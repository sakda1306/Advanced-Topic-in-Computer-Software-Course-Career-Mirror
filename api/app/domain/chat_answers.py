"""Build chat answers from computed data (Design.md §4.6, PRD FR-12, FR-16, FR-17).

Pure Python. Scores, gaps, months and salary figures always come from here; the LLM only words
claims, which `parse_claims` checks before they reach `claim_lines`.
"""

from __future__ import annotations

import csv
import re
from collections.abc import Iterable, Mapping, Sequence
from dataclasses import dataclass, field
from datetime import date
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.domain.matching.roles import RoleProfile

NO_ROLE_TH = "อยากรู้เงินเดือนของตำแหน่งไหนครับ เช่น QA Engineer หรือ Data Analyst"
MARKET_NOT_READY_TH = (
    "ข้อมูลประกาศงานและความต้องการของตลาดยังไม่พร้อมใช้งานครับ ตอนนี้ถามเงินเดือนอ้างอิงของแต่ละตำแหน่งได้"
)
REFERENCE_NOTE_TH = "ตารางอ้างอิงจัดทำโดยทีมผู้พัฒนา ไม่ใช่ตัวเลขจากประกาศงาน"
MATCH_NOTE_TH = "คำนวณจากทักษะที่ตรงกับสายงาน ไม่ใช่การรับประกันการได้งาน"
NO_BLIND_SPOTS_TH = "จากข้อมูลตอนนี้ยังไม่พบจุดที่ควรระวังเป็นพิเศษครับ"
NO_EXPERIENCE_TH = "ในโปรไฟล์ยังไม่มีข้อมูลประสบการณ์ครับ"
NO_SKILLS_TH = "ในโปรไฟล์ยังไม่มีข้อมูลทักษะครับ"

_LEVELS_TH = {"entry": "ระดับเริ่มต้น", "junior": "ระดับจูเนียร์"}
_MONTHS_TH = (
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
)
_BUDDHIST_YEARS = 543
_MAX_ROLES = 3
_MAX_GAPS_SHOWN = 3
_TWO_PART_WORD = re.compile(r"\b(full|front|back)[\s-]+(stack|end)\b")


@dataclass(frozen=True, slots=True)
class SalaryRow:
    role_id: str
    min_thb: int
    max_thb: int
    level: str
    match: str
    source: str
    url: str
    published_at: str


@dataclass(frozen=True, slots=True)
class Answer:
    text: str
    sources: list[dict[str, Any]] = field(default_factory=list)
    tokens: int = 0


class Citations:
    """Numbers evidence by first use, so the same evidence keeps one number."""

    def __init__(self, evidence: Mapping[str, Mapping[str, Any]]) -> None:
        self._evidence = evidence
        self.sources: list[dict[str, Any]] = []

    def mark(self, evidence_ids: Iterable[str]) -> str:
        numbers = [self._number(i) for i in evidence_ids if i in self._evidence]
        return " ".join(f"[{n}]" for n in dict.fromkeys(numbers))

    def _number(self, evidence_id: str) -> int:
        for source in self.sources:
            if source["evidence_id"] == evidence_id:
                return int(source["n"])
        found = self._evidence[evidence_id]
        source = {
            "n": len(self.sources) + 1,
            "evidence_id": evidence_id,
            "label_th": found["label_th"],
        }
        if found.get("url"):
            source["url"] = found["url"]
        self.sources.append(source)
        return int(source["n"])


def _normalized(text: str) -> str:
    return _TWO_PART_WORD.sub(r"\1\2", text.casefold())


def _words(role: RoleProfile) -> set[str]:
    return set(re.findall(r"[a-z0-9]+", _normalized(f"{role.role_id} {role.title_en}")))


def _position(text: str, role: RoleProfile, own_words: set[str]) -> int | None:
    names = [_normalized(name).strip() for name in role.title_en.split("/")]
    names.extend(_normalized(role.title_th).split("/"))
    places = [text.find(name) for name in names if name in text]
    for word in own_words:
        found = re.search(rf"(?<![a-z0-9]){re.escape(word)}(?![a-z0-9])", text)
        if found:
            places.append(found.start())
    return min(places) if places else None


def find_roles(message: str, catalogue: Sequence[RoleProfile]) -> list[str]:
    """Roles the message names, first named first: a full name, or a word only that role uses."""
    text = _normalized(message)
    words = {role.role_id: _words(role) for role in catalogue}
    found: list[tuple[int, str]] = []
    for role in catalogue:
        others = set().union(*(w for rid, w in words.items() if rid != role.role_id))
        place = _position(text, role, words[role.role_id] - others)
        if place is not None:
            found.append((place, role.role_id))
    return [role_id for _, role_id in sorted(found)[:_MAX_ROLES]]


@lru_cache
def load_salary_reference(data_dir: str) -> dict[str, SalaryRow]:
    path = Path(data_dir) / "salary" / "reference.csv"
    with path.open(encoding="utf-8", newline="") as file:
        return {
            row["role_id"]: SalaryRow(
                role_id=row["role_id"],
                min_thb=int(row["min"]),
                max_thb=int(row["max"]),
                level=row["level"],
                match=row["match"],
                source=row["source"],
                url=row["url"],
                published_at=row["published_at"],
            )
            for row in csv.DictReader(file)
        }


def _thai_date(iso_date: str) -> str:
    day = date.fromisoformat(iso_date)
    return f"{day.day} {_MONTHS_TH[day.month - 1]} {day.year + _BUDDHIST_YEARS}"


def _role_name(role: RoleProfile) -> str:
    return f"{role.title_th} ({role.title_en})"


def salary_answer(
    role_ids: Sequence[str],
    rows: Mapping[str, SalaryRow],
    roles: Mapping[str, RoleProfile],
) -> Answer:
    evidence = {
        f"salary-{r.role_id}": {
            "label_th": f"{r.source}, {_thai_date(r.published_at)}",
            "url": r.url,
        }
        for r in rows.values()
    }
    cites = Citations(evidence)
    lines: list[str] = []
    for role_id in role_ids:
        name = _role_name(roles[role_id])
        row = rows.get(role_id)
        if row is None:
            lines.append(f"{name}: ยังไม่มีข้อมูลเงินเดือนในตารางอ้างอิงครับ")
            continue
        level = _LEVELS_TH.get(row.level, row.level)
        amount = f"฿{row.min_thb:,} – ฿{row.max_thb:,} / เดือน (ฐานเงินเดือน)"
        mark = cites.mark([f"salary-{role_id}"])
        lines.append(f"{name}: {amount}, {level} {mark}")
        lines.append(f"ที่มา: {row.source}, {_thai_date(row.published_at)}")
        if row.match == "proxy":
            lines.append("ตัวเลขนี้อ้างอิงจากตำแหน่งใกล้เคียง")
    if cites.sources:
        lines.append(REFERENCE_NOTE_TH)
    return Answer(text="\n".join(lines), sources=cites.sources)


def role_evidence(roles: Iterable[RoleProfile]) -> dict[str, dict[str, Any]]:
    out: dict[str, dict[str, Any]] = {}
    for role in roles:
        url = next((s["url"] for s in role.sources if s.get("url")), None)
        out[f"role-{role.role_id}"] = {"label_th": f"ข้อมูลตำแหน่ง {role.title_en}", "url": url}
    return out


def claim_lines(claims: Iterable[Mapping[str, Any]], cites: Citations) -> list[str]:
    return [f"- {c['text_th']} {cites.mark(c['evidence_ids'])}".rstrip() for c in claims]


def experience_answer(profile: Mapping[str, Any]) -> Answer:
    section = profile["experience"]
    cites = Citations(profile["evidence"])
    lines = claim_lines(section["summary"], cites)
    if section["total_months"]:
        lines.append(f"รวมประสบการณ์ประมาณ {section['total_months']} เดือน")
    return Answer(text="\n".join(lines) or NO_EXPERIENCE_TH, sources=cites.sources)


def work_style_answer(profile: Mapping[str, Any]) -> Answer:
    section = profile["work_style"]
    return Answer(text=f"{section['summary_th']}\n\n{section['disclaimer_th']}")


def skill_facts(profile: Mapping[str, Any]) -> dict[str, Any]:
    """Names, levels and evidence ids only: no CV text reaches the LLM (FR-12)."""
    return {
        "hard_skills": [
            {"name": s["name_th"], "level": s["level"], "evidence_ids": s["evidence_ids"]}
            for s in profile["hard_skills"]
        ],
        "soft_skills": [
            {"name": s["name_th"], "evidence_ids": s["evidence_ids"]}
            for s in profile["soft_skills"]
        ],
    }


def skill_fallback(profile: Mapping[str, Any], cites: Citations) -> list[str]:
    lines = [
        f"- {s['name_th']} ระดับ {s['level']} {cites.mark(s['evidence_ids'])}".rstrip()
        for s in profile["hard_skills"]
    ]
    lines.extend(
        f"- {s['name_th']} {cites.mark(s['evidence_ids'])}".rstrip() for s in profile["soft_skills"]
    )
    return lines or [NO_SKILLS_TH]


def _gap_facts(match: Mapping[str, Any]) -> list[dict[str, Any]]:
    keys = ("name_th", "kind", "required_level", "user_level")
    return [{key: gap[key] for key in keys if key in gap} for gap in match["gaps"]]


def _role_facts(match: Mapping[str, Any]) -> dict[str, Any]:
    return {
        "title": match["title_th"],
        "match_pct": match["match_pct"],
        "evidence_ids": [f"role-{match['role_id']}"],
        "matched": [
            {"name": s["name_th"], "evidence_ids": s["evidence_ids"]} for s in match["matched"]
        ],
        "gaps": _gap_facts(match),
    }


def blind_spot_facts(profile: Mapping[str, Any], matches: Mapping[str, Any]) -> dict[str, Any]:
    return {
        "saved_blind_spots": [
            {"text_th": c["text_th"], "evidence_ids": c["evidence_ids"]}
            for c in profile["blind_spots"]
        ],
        "top_roles": [_role_facts(m) for m in matches["roles"][:_MAX_ROLES]],
    }


def _gap_names(match: Mapping[str, Any]) -> str:
    return ", ".join(gap["name_th"] for gap in match["gaps"][:_MAX_GAPS_SHOWN])


def blind_spot_fallback(
    profile: Mapping[str, Any], matches: Mapping[str, Any], cites: Citations
) -> list[str]:
    lines = claim_lines(profile["blind_spots"], cites)
    for match in matches["roles"][:_MAX_ROLES]:
        if match["gaps"]:
            mark = cites.mark([f"role-{match['role_id']}"])
            lines.append(f"- สาย {match['title_th']} ยังขาด {_gap_names(match)} {mark}".rstrip())
    return lines or [NO_BLIND_SPOTS_TH]


def matching_facts(matches: Mapping[str, Any]) -> dict[str, Any]:
    return {
        "threshold": matches["threshold"],
        "roles": [_role_facts(m) for m in matches["roles"]],
    }


def matching_answer_lines(
    matches: Mapping[str, Any], reasons: Sequence[str], cites: Citations
) -> list[str]:
    if matches["below_threshold"]:
        lines = [f"ยังไม่มีสายงานที่ตรงถึง {matches['threshold']}% สายงานที่ใกล้ที่สุดคือ:"]
    else:
        lines = ["สายงานที่ตรงกับคุณมากที่สุด:"]
    for number, match in enumerate(matches["roles"], start=1):
        mark = cites.mark([f"role-{match['role_id']}"])
        lines.append(f"{number}. {match['title_th']} ตรง {match['match_pct']}% {mark}".rstrip())
    lines.extend(reasons)
    top = matches["roles"][0] if matches["roles"] else None
    if top is not None and top["gaps"]:
        lines.append(f"สิ่งที่ควรเพิ่มสำหรับสาย {top['title_th']}: {_gap_names(top)}")
    lines.append(MATCH_NOTE_TH)
    return lines

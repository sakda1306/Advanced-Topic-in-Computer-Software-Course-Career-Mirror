"""Rules-only CV parsing (PRD FR-2, Design.md §4.1). Pure Python: no FastAPI, no database.

The result is a draft. The user corrects it in the confirm step (FR-3), so the rules aim to
find most fields on common Thai and English CVs, not every layout.

- Skills: taxonomy matches anywhere in the CV. A level comes only from years written next to
  the skill ("Python 4 years", "Python 2 ปี"); otherwise the user picks it.
- Sections: short heading lines such as "Experience" or "ประวัติการศึกษา".
- Dates: "Jan 2022", "06/2020", "2020", Thai months, Buddhist years (2565 → 2022),
  "Present" / "ปัจจุบัน".
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from datetime import date

from app.domain.matching.skills import SkillTaxonomy

WARN_NO_SKILLS = "ไม่พบทักษะที่ระบบรู้จักใน CV กรุณาเพิ่มเองในขั้นตอนยืนยัน"
WARN_NO_LEVEL = "ทักษะบางรายการยังไม่มีระดับ กรุณาเลือกระดับในขั้นตอนยืนยัน"
WARN_NO_DATES = "ไม่พบวันที่ของประสบการณ์บางรายการ"
WARN_NO_EDUCATION = "ไม่พบข้อมูลการศึกษาใน CV"

SUMMARY_MAX = 500


@dataclass
class CvSkillDraft:
    name: str
    skill_id: str | None
    level: int | None
    line_no: int


@dataclass
class EducationDraft:
    school: str
    degree: str | None = None
    field: str | None = None
    start: str | None = None
    end: str | None = None
    line_no: int | None = None


@dataclass
class ExperienceDraft:
    title: str
    company: str | None = None
    start: str | None = None
    end: str | None = None
    months: int | None = None
    summary: str | None = None
    line_no: int | None = None


@dataclass
class ParsedCv:
    skills: list[CvSkillDraft] = field(default_factory=list)
    education: list[EducationDraft] = field(default_factory=list)
    experience: list[ExperienceDraft] = field(default_factory=list)
    warnings_th: list[str] = field(default_factory=list)


# --- sections ----------------------------------------------------------------------------

_HEADINGS = {
    "education": {
        "education",
        "academic background",
        "educational background",
        "การศึกษา",
        "ประวัติการศึกษา",
        "วุฒิการศึกษา",
    },
    "experience": {
        "experience",
        "work experience",
        "professional experience",
        "employment",
        "employment history",
        "work history",
        "internship",
        "internships",
        "ประสบการณ์",
        "ประสบการณ์ทำงาน",
        "ประวัติการทำงาน",
        "การฝึกงาน",
    },
    "skills": {
        "skills",
        "technical skills",
        "skills and tools",
        "ทักษะ",
        "ความสามารถ",
        "ทักษะและความสามารถ",
    },
    "other": {
        "projects",
        "certifications",
        "certificates",
        "languages",
        "awards",
        "references",
        "summary",
        "profile",
        "objective",
        "about me",
        "contact",
        "activities",
        "hobbies",
        "interests",
        "โปรเจกต์",
        "ผลงาน",
        "ใบรับรอง",
        "ภาษา",
        "รางวัล",
        "บุคคลอ้างอิง",
        "เกี่ยวกับฉัน",
        "ข้อมูลส่วนตัว",
        "กิจกรรม",
        "งานอดิเรก",
    },
}
_HEADING_OF = {name: section for section, names in _HEADINGS.items() for name in names}


def _heading(line: str) -> str | None:
    if len(line) > 40:
        return None
    key = re.sub(r"\s+", " ", line.strip().rstrip(":").strip()).lower()
    return _HEADING_OF.get(key)


def _sections(lines: list[str]) -> dict[str, list[tuple[int, str]]]:
    """Lines (1-based number, text) under each heading; text before any heading is skipped."""
    out: dict[str, list[tuple[int, str]]] = {}
    current: str | None = None
    for number, line in enumerate(lines, start=1):
        section = _heading(line)
        if section:
            current = section
            out.setdefault(section, [])
        elif current:
            out[current].append((number, line))
    return out


# --- dates -------------------------------------------------------------------------------

_EN_MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
_TH_MONTHS = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
]
_TH_SHORT = [
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
]
_MONTH_WORDS = (
    [re.escape(m) for m in _TH_MONTHS + _TH_SHORT]
    + [r"(?<![a-z])" + m + r"[a-z]*\.?" for m in _EN_MONTHS]  # not "mar" in "Summary"
)
_DATE = (
    r"(?:(?P<{p}mon>" + "|".join(_MONTH_WORDS) + r")\s*)?"
    r"(?:(?P<{p}num>\d{{1,2}})\s*/\s*)?"
    r"(?P<{p}year>\d{{4}})"
)
_PRESENT = r"(?P<present>present|current|now|today|ปัจจุบัน)"
_RANGE = re.compile(
    _DATE.format(p="s") + r"\s*(?:-|–|—|to|ถึง)\s*(?:" + _PRESENT + "|" + _DATE.format(p="e") + ")",
    re.I,
)
_YEAR = re.compile(r"(?<!\d)(\d{4})(?!\d)")


@dataclass(frozen=True)
class _When:
    year: int
    month: int | None

    def text(self) -> str:
        return f"{self.year:04d}-{self.month:02d}" if self.month else f"{self.year:04d}"


def _year(raw: str) -> int | None:
    year = int(raw)
    if year > 2400:  # Buddhist Era
        year -= 543
    return year if 1950 <= year <= 2100 else None


def _month(word: str | None, number: str | None) -> int | None:
    if number and 1 <= int(number) <= 12:
        return int(number)
    if not word:
        return None
    if word in _TH_MONTHS:
        return _TH_MONTHS.index(word) + 1
    if word in _TH_SHORT:
        return _TH_SHORT.index(word) + 1
    return _EN_MONTHS.index(word[:3].lower()) + 1


def _range(line: str) -> tuple[re.Match[str], _When, _When | None] | None:
    """(match, start, end); end is None for "Present"."""
    m = _RANGE.search(line)
    if not m:
        return None
    start_year = _year(m["syear"])
    if start_year is None:
        return None
    start = _When(start_year, _month(m["smon"], m["snum"]))
    if m["present"]:
        return m, start, None
    end_year = _year(m["eyear"])
    if end_year is None:
        return None
    return m, start, _When(end_year, _month(m["emon"], m["enum"]))


def _months(start: _When, end: _When | None, today: date) -> int | None:
    end = end or _When(today.year, today.month)
    if start.month is None or end.month is None:
        return None
    count = (end.year * 12 + end.month) - (start.year * 12 + start.month) + 1
    return count if count > 0 else None


def _without(line: str, match: re.Match[str]) -> str:
    rest = line[: match.start()] + " " + line[match.end() :]
    return re.sub(r"\s+", " ", rest).strip(" -–—|,()[]:")


# --- skills ------------------------------------------------------------------------------

_YEARS = re.compile(r"(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?|ปี)", re.I)


def _level(years: float) -> int:
    if years < 1:
        return 1
    if years < 3:
        return 2
    if years < 5:
        return 3
    return 4


def _skills(lines: list[str], taxonomy: SkillTaxonomy) -> list[CvSkillDraft]:
    found: dict[str, CvSkillDraft] = {}
    for number, line in enumerate(lines, start=1):
        for segment in re.split(r"[,;•|·]", line):
            years = _YEARS.search(segment)
            for skill_id in taxonomy.find(segment):
                level = _level(float(years[1])) if years else None
                if skill_id not in found:
                    skill = taxonomy.get(skill_id)
                    name = skill.name_en.split("(")[0].strip() if skill else skill_id
                    found[skill_id] = CvSkillDraft(name, skill_id, level, number)
                elif found[skill_id].level is None and level is not None:
                    found[skill_id].level = level
    return list(found.values())


# --- experience --------------------------------------------------------------------------

_TITLE_SPLIT = re.compile(r"\s+(?:at|@)\s+|\s*\|\s*|\s+[-–—]\s+|,\s+|\s+(?=บริษัท)|\s+ที่\s+")


def _title_company(text: str) -> tuple[str, str | None]:
    parts = _TITLE_SPLIT.split(text, maxsplit=1)
    title = parts[0].strip(" ,")
    company = parts[1].strip(" ,") if len(parts) > 1 and parts[1].strip(" ,") else None
    return title, company


def _experience(section: list[tuple[int, str]], today: date) -> list[ExperienceDraft]:
    entries: list[ExperienceDraft] = []
    summaries: list[list[str]] = []
    for number, line in section:
        found = _range(line)
        if found:
            match, start, end = found
            rest = _without(line, match)
            current = entries[-1] if entries else None
            if not rest:
                if current and current.start is None:  # title line came first, then dates
                    current.start, current.end = start.text(), end.text() if end else None
                    current.months = _months(start, end, today)
                continue
            title, company = _title_company(rest)
            entries.append(
                ExperienceDraft(
                    title=title,
                    company=company,
                    start=start.text(),
                    end=end.text() if end else None,
                    months=_months(start, end, today),
                    line_no=number,
                )
            )
            summaries.append([])
        elif not entries:
            title, company = _title_company(line)
            entries.append(ExperienceDraft(title=title, company=company, line_no=number))
            summaries.append([])
        else:
            summaries[-1].append(line)
    for entry, lines in zip(entries, summaries, strict=True):
        entry.summary = " ".join(lines)[:SUMMARY_MAX] or None
    return entries


# --- education ---------------------------------------------------------------------------

_SCHOOL = re.compile(
    r"university|college|institute|school|academy|มหาวิทยาลัย|วิทยาลัย|โรงเรียน|สถาบัน", re.I
)
_DEGREE = re.compile(
    r"(Bachelor(?:'s)?(?: of [A-Z]\w*)?|Master(?:'s)?(?: of [A-Z]\w*)?|Doctor of [A-Z]\w*"
    r"|Ph\.?\s?D\.?|B\.\s?Sc\.?|B\.\s?Eng\.?|B\.\s?A\.|M\.\s?Sc\.?|M\.\s?Eng\.?|MBA|High School"
    r"|ปริญญาตรี|ปริญญาโท|ปริญญาเอก|มัธยมศึกษาตอนปลาย|ปวส\.?|ปวช\.?)"
)
_FIELD = re.compile(r"\s(?:in|major(?:ing)? in)\s+(.+)|สาขา(?:วิชา)?\s*(.+)", re.I)


def _strip_years(text: str) -> str:
    text = _RANGE.sub(" ", text)
    text = _YEAR.sub(" ", text)
    return re.sub(r"\s+", " ", text).strip(" -–—|,()[]:")


def _education(section: list[tuple[int, str]]) -> list[EducationDraft]:
    entries: list[EducationDraft] = []
    for number, line in section:
        school = _SCHOOL.search(line) is not None
        degree = _DEGREE.search(line)
        if not school and not degree:
            continue
        current = entries[-1] if entries else None
        if current is None or (school and current.school) or (degree and current.degree):
            current = EducationDraft(school="", line_no=number)
            entries.append(current)
        if school:
            current.school = _strip_years(line)
        if degree:
            current.degree = degree[1]
            after = line[degree.end() :]
            field_match = _FIELD.search(after)
            if field_match:
                current.field = _strip_years(field_match[1] or field_match[2])
        found = _range(line)
        years = [y for y in (_year(raw) for raw in _YEAR.findall(line)) if y]
        if found:
            _, start, end = found
            current.start, current.end = str(start.year), str(end.year) if end else None
        elif years:
            current.end = str(years[-1])
    for entry in entries:
        if not entry.school:  # degree only: keep the line so the user can correct it
            entry.school = entry.degree or ""
    return entries


# --- whole CV ----------------------------------------------------------------------------


def parse_cv(lines: list[str], taxonomy: SkillTaxonomy, *, today: date) -> ParsedCv:
    lines = [re.sub(r"\s+", " ", line).strip() for line in lines]
    sections = _sections(lines)
    parsed = ParsedCv(
        skills=_skills(lines, taxonomy),
        education=_education(sections.get("education", [])),
        experience=_experience(sections.get("experience", []), today),
    )
    if not parsed.skills:
        parsed.warnings_th.append(WARN_NO_SKILLS)
    elif any(s.level is None for s in parsed.skills):
        parsed.warnings_th.append(WARN_NO_LEVEL)
    if any(e.start is None for e in parsed.experience):
        parsed.warnings_th.append(WARN_NO_DATES)
    if not parsed.education:
        parsed.warnings_th.append(WARN_NO_EDUCATION)
    return parsed

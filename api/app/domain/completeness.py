"""Completeness meter (Design.md §4.1). Pure Python; returns the Contract `Completeness` shape.

Only the CV feeds it so far. The questionnaire (2 Nov) and chat (3 Nov) add their inputs here;
until then their slots stay empty and `inputs.questionnaire` is "skipped".
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

MIN_HARD_SKILLS = 3

# (slot, points, required, what to add next) in the order of Design.md §4.1.
SLOTS: list[tuple[str, int, bool, str]] = [
    ("hard_skills", 35, True, "ทักษะด้านเทคนิคอย่างน้อย 3 รายการ พร้อมระดับ"),
    ("experience", 15, True, "ประสบการณ์ทำงานหรือฝึกงาน (หรือบอกว่ายังไม่มีประสบการณ์)"),
    ("soft_skills", 15, False, "ทักษะด้านการทำงานร่วมกับผู้อื่นอย่างน้อย 3 รายการ พร้อมตัวอย่าง"),
    ("goals", 15, False, "เป้าหมาย: สายงานที่สนใจ เงินเดือนที่ต้องการ หรือพื้นที่ทำงาน"),
    ("work_style", 10, False, "รูปแบบการทำงานที่ชอบ"),
    ("education", 10, False, "ประวัติการศึกษา"),
]


@dataclass
class CvInput:
    confirmed: bool
    skills: list[dict[str, Any]] = field(default_factory=list)
    experience: list[dict[str, Any]] = field(default_factory=list)
    education: list[dict[str, Any]] = field(default_factory=list)


def _filled(cv: CvInput | None) -> dict[str, bool]:
    if cv is None or not cv.confirmed:  # a draft is not used until the user confirms (FR-3)
        return {name: False for name, *_ in SLOTS}
    rated = [s for s in cv.skills if s.get("level")]
    return {
        "hard_skills": len(rated) >= MIN_HARD_SKILLS,
        "experience": bool(cv.experience),
        "soft_skills": False,
        "goals": False,
        "work_style": False,
        "education": bool(cv.education),
    }


def compute_completeness(*, cv: CvInput | None, threshold: int) -> dict[str, Any]:
    filled = _filled(cv)
    slots = [
        {
            "slot": name,
            "filled": filled[name],
            "required": required,
            "points": points if filled[name] else 0,
            "max_points": points,
        }
        for name, points, required, _ in SLOTS
    ]
    score = sum(s["points"] for s in slots)
    missing_required = [name for name, _, required, _ in SLOTS if required and not filled[name]]
    cv_done = cv is not None and cv.confirmed
    can_generate = cv_done and not missing_required and score >= threshold
    # Required slots first, then by points (Design.md §4.1, gap_question order).
    missing = sorted(
        (slot for slot in SLOTS if not filled[slot[0]]), key=lambda s: (not s[2], -s[1])
    )
    return {
        "score": score,
        "can_generate": can_generate,
        "slots": slots,
        "missing_required": missing_required,
        "inputs": {
            "cv": "done" if cv_done else "skipped",
            "questionnaire": "skipped",
            "chat": "done" if can_generate else "needed",
        },
        "missing_th": [text for *_, text in missing],
    }

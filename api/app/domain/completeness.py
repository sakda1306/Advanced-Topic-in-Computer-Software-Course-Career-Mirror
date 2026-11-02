"""Completeness meter (Design.md §4.1). Pure Python; returns the Contract `Completeness` shape.

The CV and the questionnaire feed it so far. Chat (3 Nov) adds its input here.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

MIN_HARD_SKILLS = 3
MIN_SOFT_SKILLS = 3

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


@dataclass
class QuestionnaireInput:
    """What at least one saved answer contributes (domain.questionnaire.summarize)."""

    done: bool  # every required question is answered
    skills: list[dict[str, Any]] = field(default_factory=list)
    no_experience: bool = False
    education: bool = False
    goals: bool = False
    work_style: bool = False
    soft_skills_high: int = 0
    soft_skills_example: bool = False


def _filled(cv: CvInput | None, questionnaire: QuestionnaireInput | None) -> dict[str, bool]:
    q = questionnaire or QuestionnaireInput(done=False)
    cv = cv if cv is not None and cv.confirmed else None  # a draft is not used (FR-3)
    # The same skill from both sources counts once. Free-text CV skills have no id yet.
    rated = {
        s.get("skill_id") or s["name"].lower() for s in (cv.skills if cv else []) if s.get("level")
    }
    rated |= {s["skill_id"] for s in q.skills}
    return {
        "hard_skills": len(rated) >= MIN_HARD_SKILLS,
        "experience": bool(cv and cv.experience) or q.no_experience,
        "soft_skills": q.soft_skills_high >= MIN_SOFT_SKILLS and q.soft_skills_example,
        "goals": q.goals,
        "work_style": q.work_style,
        "education": bool(cv and cv.education) or q.education,
    }


def compute_completeness(
    *, cv: CvInput | None, questionnaire: QuestionnaireInput | None = None, threshold: int
) -> dict[str, Any]:
    filled = _filled(cv, questionnaire)
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
    has_input = cv_done or questionnaire is not None
    can_generate = has_input and not missing_required and score >= threshold
    questionnaire_status = "skipped"
    if questionnaire is not None:
        questionnaire_status = "done" if questionnaire.done else "partial"
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
            "questionnaire": questionnaire_status,
            "chat": "done" if can_generate else "needed",
        },
        "missing_th": [text for *_, text in missing],
    }

"""Layer 2, no LLM: Thai and English keywords per route (Design.md §4.6).

A message that hits two routes goes to the LLM layer, because FR-11 allows only one route.
"""

from __future__ import annotations

import re

from app.router.decision import Decision

RULE_CONFIDENCE = 0.9


def _en(words: str) -> str:
    # Word limits by hand: \b finds none between Thai and Latin letters written without a space.
    return rf"(?<![a-z0-9])(?:{words})(?![a-z0-9])"


_ROUTE_PATTERNS = {
    "skill_assessment": re.compile(rf"(?<!เพิ่ม)ทักษะ|จุดแข็ง|{_en(r'skills?|strengths?')}"),
    "work_style": re.compile(
        rf"รูปแบบการทำงาน|สไตล์การทำงาน|ชอบทำงาน|{_en(r'work\s*style')}",
    ),
    "blind_spots": re.compile(rf"จุดอ่อน|จุดบอด|{_en(r'blind\s*spots?|weakness(?:es)?')}"),
    "job_matching": re.compile(
        r"สายงานไหน|งานไหน|ควรเรียน|ควรเพิ่มทักษะ"
        rf"|{_en(r'match(?:es)?|which\s+(?:role|job)|next\s+steps?')}",
    ),
    "salary": re.compile(rf"เงินเดือน|ค่าตอบแทน|ค่าจ้าง|{_en(r'salary|salaries|pay')}"),
    "market": re.compile(rf"ตลาดงาน|ตำแหน่งงาน|เปิดรับ|{_en(r'job\s+market|demand|openings?')}"),
    "experience": re.compile(rf"ประสบการณ์|{_en(r'experience')}"),
}

_EDIT = re.compile(
    r"^(?:ช่วย|ขอ|กรุณา)?\s*(?:"
    r"(?:เปลี่ยน|แก้ไข|แก้|ปรับ|เพิ่ม)\s*(?:ทักษะ|ระดับ|สายงาน|เงินเดือน|จังหวัด|โปรไฟล์)"
    r"|ลบ\s*\S|เอา\s*\S.*ออก"
    r")"
    r"|^(?:please\s+)?(?:add|remove|delete|change|update|edit)\s+"
    r"(?:(?:the|my)\s+)?(?:skill|level|role|salary|profile)"
)
_QUESTION = re.compile(r"อะไร|ไหน|ไหม|มั้ย|ยังไง|อย่างไร|เท่าไหร่|เท่าไร|กี่|ควร|\?")


def match_rules(message: str) -> Decision | None:
    """Expects the text from `normalize`, which `decide` passes in."""
    if _EDIT.search(message) and not _QUESTION.search(message):
        return Decision(route="profile_edit", confidence=RULE_CONFIDENCE, layer="rules")
    hits = [route for route, pattern in _ROUTE_PATTERNS.items() if pattern.search(message)]
    if len(hits) == 1:
        return Decision(route=hits[0], confidence=RULE_CONFIDENCE, layer="rules")
    return None

"""Layer 1, no LLM: messages the router refuses outright (Design.md §4.6)."""

from __future__ import annotations

import re

from app.router.decision import Decision, normalize

MAX_MESSAGE_CHARS = 1000  # Contract.md §2.4

_INJECTION = re.compile(
    r"(?:ignore|disregard|forget)\s+(?:all\s+|any\s+)?(?:the\s+|your\s+)?"
    r"(?:previous\s+|prior\s+|above\s+|earlier\s+)?(?:instructions?|prompts?|rules?)"
    r"|system\s*prompt|your\s+prompt|you\s+are\s+now|jailbreak|developer\s+mode"
    r"|(?:ไม่ต้องสนใจ|อย่าสนใจ|ละเว้น|เพิกเฉย|ลืม)\s*คำสั่ง"
    r"|(?:พรอมต์|พร้อมต์|พรอมท์|prompt)\s*(?:ของคุณ|ของระบบ|ระบบ)|คำสั่งระบบ"
)
# Word limits by hand: \b finds none between Thai and Latin letters written without a space.
_OFF_TOPIC = re.compile(
    r"หวย|พนัน|ดูดวง|ไพ่ยิปซี"
    r"|(?<![a-z0-9])(?:mbti|enneagram)(?![a-z0-9])"  # PRD FR-7: no personality-type diagnosis
)


def check_guards(message: str) -> Decision | None:
    text = normalize(message)
    if (
        not text
        or len(message) > MAX_MESSAGE_CHARS
        or _INJECTION.search(text)
        or _OFF_TOPIC.search(text)
    ):
        return Decision(route="decline", confidence=1.0, layer="guard")
    return None

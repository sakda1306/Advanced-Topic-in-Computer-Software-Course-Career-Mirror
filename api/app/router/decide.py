"""All router layers in order, cheapest first (Design.md §4.6)."""

from __future__ import annotations

from app.infra.llm import GroqClient
from app.router.decision import Decision, normalize
from app.router.guards import check_guards
from app.router.llm_decision import ask_llm
from app.router.rules import RULE_CONFIDENCE, is_question, match_rules

# Answered from cached role data, so a user without a profile can ask them.
_NEEDS_NO_PROFILE = frozenset({"salary", "market"})


async def decide(
    message: str, *, has_profile: bool, llm: GroqClient, user_id: str | None = None
) -> Decision:
    guarded = check_guards(message)
    if guarded is not None:
        return guarded
    text = normalize(message)
    matched = match_rules(text)
    if not has_profile:  # chat first fills the missing completeness slots (FR-8)
        # "เงินเดือน 35000" answers our goals question, so only a real question goes to salary.
        if matched is not None and matched.route in _NEEDS_NO_PROFILE and is_question(text):
            return matched
        return Decision(route="gap_question", confidence=RULE_CONFIDENCE, layer="rules")
    return matched or await ask_llm(message, llm=llm, user_id=user_id)

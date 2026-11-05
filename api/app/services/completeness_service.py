"""The completeness meter from everything the user has given so far (Design.md §4.1)."""

from __future__ import annotations

from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings
from app.domain.completeness import (
    ChatInput,
    CvInput,
    QuestionnaireInput,
    compute_completeness,
    rated_skill_count,
    unrated_skills,
)
from app.infra.models import Fact
from app.services import cv_service, questionnaire_service


async def _chat_input(db: AsyncSession, user_id: str) -> ChatInput:
    rows = await db.scalars(select(Fact).where(Fact.user_id == user_id).order_by(Fact.id))
    chat = ChatInput()
    for fact in rows:
        if fact.kind == "skill":
            chat.skills.append(fact.value)
        elif fact.kind == "soft_skill":
            chat.soft_skills.append(fact.value)
        elif fact.kind == "experience":
            chat.no_experience = chat.no_experience or bool(fact.value.get("none"))
            chat.has_experience = chat.has_experience or not fact.value.get("none")
        elif fact.kind == "education":
            chat.education = True
        elif fact.kind == "goal":
            chat.goals = True
        elif fact.kind == "preference":
            chat.work_style = True
    return chat


async def _inputs(
    db: AsyncSession, user_id: str, settings: Settings
) -> tuple[CvInput | None, QuestionnaireInput | None, ChatInput]:
    doc = await cv_service.get_cv(db, user_id)
    cv = None
    if doc is not None:
        taxonomy = cv_service.taxonomy_for(settings)

        def is_hard(skill: dict[str, Any]) -> bool:
            known = taxonomy.get(skill["skill_id"]) if skill.get("skill_id") else None
            return known is None or known.type == "hard"  # free-text skills count as hard

        cv = CvInput(
            confirmed=doc.status == "confirmed",
            skills=[s for s in doc.parsed.get("skills", []) if is_hard(s)],
            experience=doc.parsed.get("experience", []),
            education=doc.parsed.get("education", []),
        )
    answers = await questionnaire_service.get_answers(db, user_id)
    questionnaire = questionnaire_service.questionnaire_for(settings).summarize(answers)
    return cv, questionnaire, await _chat_input(db, user_id)


async def completeness(db: AsyncSession, user_id: str, settings: Settings) -> dict[str, Any]:
    cv, questionnaire, chat = await _inputs(db, user_id, settings)
    return compute_completeness(
        cv=cv, questionnaire=questionnaire, chat=chat, threshold=settings.completeness_threshold
    )


async def rated_skills(db: AsyncSession, user_id: str, settings: Settings) -> int:
    cv, questionnaire, chat = await _inputs(db, user_id, settings)
    return rated_skill_count(cv=cv, questionnaire=questionnaire, chat=chat)


async def skills_without_a_level(db: AsyncSession, user_id: str, settings: Settings) -> list[str]:
    cv, questionnaire, chat = await _inputs(db, user_id, settings)
    return unrated_skills(cv=cv, questionnaire=questionnaire, chat=chat)

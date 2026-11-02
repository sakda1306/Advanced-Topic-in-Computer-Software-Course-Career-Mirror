"""The completeness meter from everything the user has given so far (Design.md §4.1)."""

from __future__ import annotations

from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import Settings
from app.domain.completeness import CvInput, compute_completeness
from app.services import cv_service, questionnaire_service


async def completeness(db: AsyncSession, user_id: str, settings: Settings) -> dict[str, Any]:
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
    return compute_completeness(
        cv=cv,
        questionnaire=questionnaire_service.questionnaire_for(settings).summarize(answers),
        threshold=settings.completeness_threshold,
    )

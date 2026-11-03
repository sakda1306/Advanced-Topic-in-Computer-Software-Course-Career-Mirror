"""Generate and read the profile (Contract.md §2.5, PRD FR-14 – FR-17)."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter

from app.api.deps import ContainerDep, CurrentUser, DbDep
from app.api.schemas import ProfileGenerated, ProfileOut
from app.services import explanation_service, profile_service

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.post("/generate")
async def generate_profile(
    user: CurrentUser, container: ContainerDep, db: DbDep
) -> ProfileGenerated:
    profile: dict[str, Any] = await profile_service.generate_profile(
        db, container.llm, container.settings, user_id=user.id
    )
    matches = await explanation_service.after_generate(
        db, container.llm, container.settings, user_id=user.id, profile=profile
    )
    return ProfileGenerated(profile=profile, matches=matches)


@router.get("")
async def get_profile(user: CurrentUser, db: DbDep) -> ProfileOut:
    return ProfileOut(profile=await profile_service.get_profile(db, user.id))

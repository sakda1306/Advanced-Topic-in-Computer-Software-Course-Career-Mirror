"""Generate and read the profile (Contract.md §2.5, PRD FR-14 – FR-17)."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter

from app.api.deps import ContainerDep, CurrentUser, DbDep
from app.api.schemas import ProfileGenerated, ProfileOut
from app.services import profile_service, role_service

router = APIRouter(prefix="/api/profile", tags=["profile"])


@router.post("/generate")
async def generate_profile(
    user: CurrentUser, container: ContainerDep, db: DbDep
) -> ProfileGenerated:
    profile: dict[str, Any] = await profile_service.generate_profile(
        db, container.llm, container.settings, user_id=user.id
    )
    return ProfileGenerated(
        profile=profile, matches=role_service.matches_for(profile, container.settings)
    )


@router.get("")
async def get_profile(user: CurrentUser, db: DbDep) -> ProfileOut:
    return ProfileOut(profile=await profile_service.get_profile(db, user.id))

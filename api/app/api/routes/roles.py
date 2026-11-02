"""Role catalogue, matches and one role (Contract.md §2.6, PRD FR-18 – FR-20b)."""

from __future__ import annotations

from typing import Any

from fastapi import APIRouter

from app.api.deps import ContainerDep, CurrentUser, DbDep
from app.api.schemas import RoleDetailOut, RolesOut
from app.services import role_service

router = APIRouter(prefix="/api/roles", tags=["roles"])


@router.get("")
async def list_roles(_user: CurrentUser, container: ContainerDep) -> RolesOut:
    return RolesOut(roles=role_service.catalogue(container.settings))


# Before "/{role_id}", or "matches" would be read as a role id.
@router.get("/matches")
async def get_matches(user: CurrentUser, container: ContainerDep, db: DbDep) -> dict[str, Any]:
    return await role_service.latest_matches(db, user.id, container.settings)


@router.get("/{role_id}")
async def get_role(
    role_id: str, user: CurrentUser, container: ContainerDep, db: DbDep
) -> RoleDetailOut:
    role, match = await role_service.role_with_match(db, user.id, role_id, container.settings)
    return RoleDetailOut(role=role, match=match)

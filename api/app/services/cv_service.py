"""CV upload, parse, confirm, delete (PRD FR-0 – FR-4, Contract.md §2.2, Design.md §4.1).

Rules only for now. LLM extraction joins when the Groq client lands (Schedule, 2 Nov): it will
run only when `quota_service.reserve` succeeds, and with no quota left the rules result is
returned as it is, so `POST /api/cv` never returns QUOTA_EXCEEDED.

The raw PDF is not stored, and CV text is never logged.
"""

from __future__ import annotations

import asyncio
import re
from dataclasses import asdict
from typing import Any

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.clock import to_bangkok, utcnow
from app.core.config import Settings
from app.core.errors import AppError, ErrorCode
from app.domain.cv_parser import parse_cv
from app.domain.matching.skills import SkillTaxonomy, load_taxonomy
from app.infra.models import CvDocument
from app.infra.pdf_text import extract_lines

MAX_PAGES = 20
FILENAME_MAX = 200


def taxonomy_for(settings: Settings) -> SkillTaxonomy:
    return load_taxonomy(settings.data_dir)


def clean_filename(raw: str | None) -> str:
    name = re.split(r"[\\/]", raw or "")[-1]
    name = re.sub(r"[\x00-\x1f\x7f]", "", name).strip()
    return name[:FILENAME_MAX] or "cv.pdf"


def check_pdf(data: bytes, filename: str, content_type: str | None, settings: Settings) -> None:
    if len(data) > settings.cv_max_bytes:
        raise AppError(ErrorCode.CV_TOO_LARGE)
    named_pdf = filename.lower().endswith(".pdf") or content_type == "application/pdf"
    if not data.startswith(b"%PDF-") or not named_pdf:
        raise AppError(ErrorCode.CV_INVALID_TYPE)


async def upload_cv(
    db: AsyncSession,
    user_id: str,
    *,
    data: bytes,
    filename: str | None,
    content_type: str | None,
    settings: Settings,
) -> CvDocument:
    name = clean_filename(filename)
    check_pdf(data, name, content_type, settings)
    # pypdf is CPU-bound; keep the event loop free for other requests.
    lines = await asyncio.to_thread(extract_lines, data, max_pages=MAX_PAGES)
    parsed = parse_cv(lines, taxonomy_for(settings), today=to_bangkok(utcnow()).date())

    await db.execute(delete(CvDocument).where(CvDocument.user_id == user_id))  # one CV per user
    doc = CvDocument(
        user_id=user_id,
        filename=name,
        text_lines=lines,
        parsed=asdict(parsed),
        status="draft",
    )
    db.add(doc)
    await db.commit()
    return doc


async def get_cv(db: AsyncSession, user_id: str) -> CvDocument | None:
    doc: CvDocument | None = await db.scalar(
        select(CvDocument).where(CvDocument.user_id == user_id)
    )
    return doc


def _check_skill_ids(skills: list[dict[str, Any]], taxonomy: SkillTaxonomy) -> None:
    unknown = [
        {"field": f"skills.{i}.skill_id", "message": "unknown skill id", "code": "unknown_skill"}
        for i, skill in enumerate(skills)
        if skill.get("skill_id") is not None and skill["skill_id"] not in taxonomy
    ]
    if unknown:
        raise AppError(ErrorCode.VALIDATION_ERROR, details={"fields": unknown})


async def confirm_cv(
    db: AsyncSession, user_id: str, fields: dict[str, Any], settings: Settings
) -> CvDocument:
    _check_skill_ids(fields["skills"], taxonomy_for(settings))
    doc = await get_cv(db, user_id)
    if doc is None:
        raise AppError(ErrorCode.NOT_FOUND)
    # The user's corrections replace the draft; draft warnings no longer apply.
    doc.parsed = {**fields, "warnings_th": []}
    doc.status = "confirmed"
    doc.confirmed_at = utcnow()
    await db.commit()
    return doc


async def delete_cv(db: AsyncSession, user_id: str) -> None:
    # Facts that came only from the CV are removed here too once the facts table exists.
    await db.execute(delete(CvDocument).where(CvDocument.user_id == user_id))
    await db.commit()

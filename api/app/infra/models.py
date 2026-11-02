"""Database tables (Design.md §5). Every user table keys on `user_id` with ON DELETE CASCADE,
so deleting the `users` row removes all of that user's data (DELETE /api/me)."""

from __future__ import annotations

from datetime import date, datetime
from typing import Any

from sqlalchemy import JSON, Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.core.clock import utcnow
from app.core.ids import new_id
from app.infra.db import Base

# JSONB on Postgres (Design.md §5), plain JSON on SQLite in tests.
_JSON = JSON().with_variant(JSONB(), "postgresql")


def _uuid() -> str:
    return str(new_id())


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    email: Mapped[str] = mapped_column(String(254), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(100))
    display_name: Mapped[str] = mapped_column(String(50))
    consent_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class QuotaUsage(Base):
    """Requests and tokens one user used on one day (Asia/Bangkok), PRD FR-23."""

    __tablename__ = "quota_usage"

    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    day: Mapped[date] = mapped_column(Date, primary_key=True)
    requests: Mapped[int] = mapped_column(Integer, default=0)
    tokens: Mapped[int] = mapped_column(Integer, default=0)


class Answer(Base):
    """One saved questionnaire answer, so the user can resume (PRD FR-6)."""

    __tablename__ = "answers"

    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    question_id: Mapped[str] = mapped_column(String(60), primary_key=True)
    value: Mapped[Any] = mapped_column(_JSON)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class CvDocument(Base):
    """The user's CV: extracted text lines (evidence) and parsed fields; the PDF is not kept."""

    __tablename__ = "cv_documents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True
    )
    filename: Mapped[str] = mapped_column(String(200))
    text_lines: Mapped[list[str]] = mapped_column(_JSON)
    parsed: Mapped[dict[str, Any]] = mapped_column(_JSON)
    status: Mapped[str] = mapped_column(String(10), default="draft")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    confirmed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

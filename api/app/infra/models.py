"""Database tables (Design.md §5). Every user table keys on `user_id` with ON DELETE CASCADE,
so deleting the `users` row removes all of that user's data (DELETE /api/me)."""

from __future__ import annotations

from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.clock import utcnow
from app.core.ids import new_id
from app.infra.db import Base


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

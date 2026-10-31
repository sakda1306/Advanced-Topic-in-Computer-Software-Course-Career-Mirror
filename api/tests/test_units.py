"""Units without the app: ids, tokens, passwords, rate limiter, clock, error table."""

from __future__ import annotations

from datetime import UTC, datetime

import jwt
import pytest

from app.core.clock import iso
from app.core.errors import ERROR_SPECS, AppError, ErrorCode
from app.core.ids import accept_client_id, new_id
from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)
from app.infra.rate_limit import FailureLimiter
from tests.conftest import IsolatedSettings


def test_new_id_is_time_ordered_v7() -> None:
    ids = [new_id() for _ in range(2000)]
    assert all(i.version == 7 for i in ids)
    assert ids == sorted(ids)
    assert len(set(ids)) == len(ids)


@pytest.mark.parametrize(
    ("value", "accepted"),
    [("abc-123", True), ("a" * 64, True), ("a" * 65, False), ("x y", False), (None, False)],
)
def test_accept_client_id(value: str | None, accepted: bool) -> None:
    assert (accept_client_id(value) is not None) is accepted


def test_token_round_trip_and_tamper() -> None:
    settings = IsolatedSettings(jwt_secret="s" * 32)
    token = create_access_token(settings, "user-1")
    assert decode_access_token(settings, token) == "user-1"
    other = IsolatedSettings(jwt_secret="t" * 32)
    assert decode_access_token(other, token) is None


def test_expired_token_rejected() -> None:
    settings = IsolatedSettings(jwt_secret="s" * 32)
    token = jwt.encode({"sub": "u", "exp": 1}, settings.jwt_secret, algorithm="HS256")
    assert decode_access_token(settings, token) is None


def test_short_secret_refused() -> None:
    with pytest.raises(ValueError, match="jwt_secret"):
        IsolatedSettings(jwt_secret="short")


def test_password_hash() -> None:
    hashed = hash_password("hunter2-long")
    assert verify_password("hunter2-long", hashed)
    assert not verify_password("wrong", hashed)
    assert not verify_password("x" * 100, hashed)


def test_failure_limiter_window() -> None:
    now = [0.0]
    limiter = FailureLimiter(limit=2, clock=lambda: now[0])
    limiter.record_failure("k")
    limiter.record_failure("k")
    with pytest.raises(AppError) as caught:
        limiter.check("k")
    assert caught.value.code is ErrorCode.RATE_LIMITED
    assert caught.value.retry_after == 60
    now[0] = 61.0
    limiter.check("k")  # new window
    limiter.check("other")


def test_iso_is_bangkok() -> None:
    assert iso(datetime(2026, 11, 3, 7, 5, tzinfo=UTC)) == "2026-11-03T14:05:00+07:00"
    assert iso(datetime(2026, 11, 3, 7, 5)) == "2026-11-03T14:05:00+07:00"


def test_every_code_has_a_spec() -> None:
    assert set(ERROR_SPECS) == set(ErrorCode)

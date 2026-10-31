"""Request and response bodies (Contract.md §2 and §3)."""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

from app.core.clock import iso
from app.core.security import MAX_PASSWORD_BYTES
from app.infra.models import User


class _Strict(BaseModel):
    model_config = ConfigDict(extra="forbid")


def _password_fits_bcrypt(value: str) -> str:
    if len(value.encode()) > MAX_PASSWORD_BYTES:
        raise ValueError(f"password must be at most {MAX_PASSWORD_BYTES} bytes")
    return value


class RegisterRequest(_Strict):
    email: EmailStr
    password: str = Field(min_length=8)
    display_name: str = Field(min_length=1, max_length=50)
    consent: Literal[True]

    _check_password = field_validator("password")(_password_fits_bcrypt)

    @field_validator("display_name")
    @classmethod
    def _strip_name(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("display_name must not be blank")
        return stripped


class LoginRequest(_Strict):
    email: EmailStr
    password: str = Field(min_length=1, max_length=200)


class DeleteAccountRequest(_Strict):
    confirm: Literal["DELETE"]


class UserOut(BaseModel):
    id: str
    email: str
    display_name: str
    created_at: str

    @classmethod
    def of(cls, user: User) -> UserOut:
        return cls(
            id=user.id,
            email=user.email,
            display_name=user.display_name,
            created_at=iso(user.created_at),
        )


class UserEnvelope(BaseModel):
    user: UserOut


class Ok(BaseModel):
    ok: Literal[True] = True


class Deleted(BaseModel):
    deleted: Literal[True] = True


class Health(BaseModel):
    status: Literal["ok"] = "ok"
    version: str

"""Settings read from the environment (the root `.env` in docker compose, Design.md §8)."""

from __future__ import annotations

import json
from functools import lru_cache
from typing import Annotated

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "CareerMirror"
    version: str = Field(default="0.1.0", validation_alias="GIT_SHA")
    environment: str = "dev"
    log_level: str = "INFO"
    log_json: bool = True
    error_type_base_url: str = "https://careermirror.local/errors"

    database_url: str = "postgresql+asyncpg://careermirror@localhost:5432/careermirror"
    rag_db_path: str = "./var/rag.db"
    data_dir: str = "../data"

    # Required: no default, so a missing secret stops start-up instead of signing with a known one.
    jwt_secret: str = Field(min_length=32)
    jwt_algorithm: str = "HS256"
    jwt_ttl_hours: int = 8
    cookie_name: str = "access_token"
    cookie_secure: bool = False
    # NoDecode: the env value is a comma-separated list, not JSON (split below).
    cors_allowed_origins: Annotated[list[str], NoDecode] = ["http://localhost:3000"]

    embed_model: str = ""
    groq_api_key: str = ""
    groq_model: str = ""
    llm_timeout_s: float = 30.0

    quota_daily_requests: int = 30
    quota_daily_tokens: int = 60_000
    quota_tz: str = "Asia/Bangkok"

    match_threshold: int = 60
    top_n_roles: int = 5

    cache_max_age_days: int = 7
    refresh_daily_cap: int = 20
    apify_token: str = ""
    apify_jobthai_actor: str = ""

    login_failures_per_minute: int = 5
    max_json_bytes: int = 64 * 1024
    cv_max_bytes: int = 5 * 1024 * 1024

    @field_validator("cors_allowed_origins", mode="before")
    @classmethod
    def _split_origins(cls, value: object) -> object:
        if isinstance(value, str):
            if value.strip().startswith("["):
                return json.loads(value)
            return [v.strip() for v in value.split(",") if v.strip()]
        return value

    @field_validator("log_level", mode="before")
    @classmethod
    def _upper_level(cls, value: object) -> object:
        return value.strip().upper() if isinstance(value, str) else value


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[call-arg]

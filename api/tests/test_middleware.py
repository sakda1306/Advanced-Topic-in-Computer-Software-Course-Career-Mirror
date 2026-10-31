"""Contract.md §1: request id, Problem-JSON for every error, body limits, health."""

from __future__ import annotations

from typing import Any

import httpx
import pytest

from tests.conftest import assert_problem


async def test_health(client: httpx.AsyncClient) -> None:
    response = await client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "version": "0.1.0"}
    assert response.headers["x-content-type-options"] == "nosniff"


async def test_request_id_generated_and_echoed(client: httpx.AsyncClient) -> None:
    generated = (await client.get("/api/health")).headers["x-request-id"]
    assert len(generated) == 36
    echoed = await client.get("/api/health", headers={"X-Request-ID": "web-123"})
    assert echoed.headers["x-request-id"] == "web-123"


async def test_unsafe_request_id_is_replaced(client: httpx.AsyncClient) -> None:
    response = await client.get("/api/health", headers={"X-Request-ID": "bad id\twith spaces"})
    assert response.headers["x-request-id"] != "bad id\twith spaces"


async def test_unknown_path_is_problem_json(client: httpx.AsyncClient) -> None:
    body = assert_problem(await client.get("/api/nope"), 404, "NOT_FOUND")
    assert "details" not in body


async def test_wrong_method_is_problem_json(client: httpx.AsyncClient) -> None:
    assert_problem(await client.get("/api/auth/login"), 405, "METHOD_NOT_ALLOWED")


async def test_json_body_too_large(client: httpx.AsyncClient) -> None:
    response = await client.post(
        "/api/auth/login",
        content=b'{"email":"' + b"a" * 70_000 + b'"}',
        headers={"content-type": "application/json"},
    )
    assert_problem(response, 413, "PAYLOAD_TOO_LARGE")


async def test_non_json_body_rejected(client: httpx.AsyncClient) -> None:
    response = await client.post(
        "/api/auth/login", content=b"email=a", headers={"content-type": "text/plain"}
    )
    assert_problem(response, 415, "UNSUPPORTED_MEDIA_TYPE")


@pytest.mark.parametrize("settings_overrides", [{"cv_max_bytes": 1024}])
async def test_cv_upload_over_limit(client: httpx.AsyncClient, settings_overrides: Any) -> None:
    response = await client.post(
        "/api/cv", files={"file": ("cv.pdf", b"%PDF" + b"0" * 200_000, "application/pdf")}
    )
    assert_problem(response, 413, "CV_TOO_LARGE")


async def test_thai_text_is_not_escaped(client: httpx.AsyncClient) -> None:
    response = await client.get("/api/auth/me")
    assert "กรุณาเข้าสู่ระบบ".encode() in response.content

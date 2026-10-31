"""Reject oversized bodies (413) and wrong content types (415) before routing.

JSON everywhere, except the CV upload, which is multipart and may be up to 5 MB
(Contract.md §1, §2.2).
"""

from __future__ import annotations

from starlette.datastructures import Headers
from starlette.types import ASGIApp, Message, Receive, Scope, Send

from app.api.middleware.problem_asgi import send_problem
from app.core.errors import ErrorCode

_BODY_METHODS = frozenset({"POST", "PUT", "PATCH", "DELETE"})
MULTIPART_PATHS = frozenset({"/api/cv"})
# Room for the multipart boundaries and part headers around the file itself.
_MULTIPART_OVERHEAD = 64 * 1024


class _BodyTooLarge(Exception):
    """Raised from `receive`. FastAPI may turn it into a 400 while parsing the body, so
    the middleware also remembers the overflow and replaces whatever response follows."""


def _media_type(content_type: str) -> str:
    return content_type.split(";", 1)[0].strip().lower()


def _is_json(media_type: str) -> bool:
    return media_type == "application/json" or (
        media_type.startswith("application/") and media_type.endswith("+json")
    )


class BodyGuardMiddleware:
    def __init__(
        self, app: ASGIApp, *, max_json_bytes: int, max_upload_bytes: int, type_base_url: str
    ) -> None:
        self.app = app
        self.max_json_bytes = max_json_bytes
        self.max_upload_bytes = max_upload_bytes + _MULTIPART_OVERHEAD
        self.type_base_url = type_base_url

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http" or scope["method"] not in _BODY_METHODS:
            await self.app(scope, receive, send)
            return

        headers = Headers(scope=scope)
        is_upload = scope.get("path", "") in MULTIPART_PATHS
        limit = self.max_upload_bytes if is_upload else self.max_json_bytes
        too_large = ErrorCode.CV_TOO_LARGE if is_upload else ErrorCode.PAYLOAD_TOO_LARGE

        declared = headers.get("content-length")
        if declared is not None:
            if not (declared.isascii() and declared.isdigit()):  # "²".isdigit() is True
                await send_problem(send, ErrorCode.VALIDATION_ERROR, self.type_base_url)
                return
            if int(declared) > limit:
                await send_problem(send, too_large, self.type_base_url)
                return
        has_body = (declared is not None and int(declared) > 0) or "transfer-encoding" in headers
        media_type = _media_type(headers.get("content-type", ""))
        allowed = media_type == "multipart/form-data" if is_upload else _is_json(media_type)
        if has_body and not allowed:
            await send_problem(send, ErrorCode.UNSUPPORTED_MEDIA_TYPE, self.type_base_url)
            return

        # Content-Length can be absent (chunked) or wrong, so also count what arrives.
        received = 0
        exceeded = False
        response_started = False

        async def limited_receive() -> Message:
            nonlocal received, exceeded
            message = await receive()
            if message["type"] == "http.request":
                received += len(message.get("body", b""))
                if received > limit:
                    exceeded = True
                    raise _BodyTooLarge
            return message

        async def guarded_send(message: Message) -> None:
            nonlocal response_started
            if exceeded:
                # The app answered after the overflow (e.g. a 400 from body parsing):
                # send our 413 instead and drop the app's messages.
                if not response_started:
                    response_started = True
                    await send_problem(send, too_large, self.type_base_url)
                return
            if message["type"] == "http.response.start":
                response_started = True
            await send(message)

        try:
            await self.app(scope, limited_receive, guarded_send)
        except _BodyTooLarge:
            if not response_started:
                await send_problem(send, too_large, self.type_base_url)

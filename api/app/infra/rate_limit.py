"""In-process fixed-window counters.

The api runs as one uvicorn worker (Design.md §8), so a dict is enough; counters reset
on restart. Login counts failures per email only: every user reaches the api through the
web proxy and so shares one client IP.
"""

from __future__ import annotations

import time
from collections.abc import Callable

from app.core.errors import AppError, ErrorCode

WINDOW_SECONDS = 60


class FailureLimiter:
    def __init__(self, limit: int, clock: Callable[[], float] = time.monotonic) -> None:
        self.limit = limit
        self._clock = clock
        self._windows: dict[str, tuple[float, int]] = {}

    def _current(self, key: str) -> tuple[float, int]:
        started, count = self._windows.get(key, (0.0, 0))
        if self._clock() - started >= WINDOW_SECONDS:
            return self._clock(), 0
        return started, count

    def check(self, key: str) -> None:
        """Refuse once `limit` failures were recorded for the key in this window."""
        started, count = self._current(key)
        if count >= self.limit:
            retry_after = max(1, int(WINDOW_SECONDS - (self._clock() - started)))
            raise AppError(ErrorCode.RATE_LIMITED, retry_after=retry_after)

    def record_failure(self, key: str) -> None:
        started, count = self._current(key)
        self._windows[key] = (started, count + 1)
        if len(self._windows) > 10_000:
            self._drop_expired()

    def reset(self, key: str) -> None:
        self._windows.pop(key, None)

    def _drop_expired(self) -> None:
        now = self._clock()
        self._windows = {k: v for k, v in self._windows.items() if now - v[0] < WINDOW_SECONDS}

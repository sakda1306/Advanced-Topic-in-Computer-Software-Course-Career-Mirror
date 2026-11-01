"""Text lines from a PDF CV (PRD FR-2, FR-4). OCR is out of scope: no text layer → CV_UNREADABLE.

The PDF comes from the user, so parsing is bounded (page count, characters) and any parser
error is reported as unreadable instead of a 500.
"""

from __future__ import annotations

import io
import logging
import re

from pypdf import PdfReader

from app.core.errors import AppError, ErrorCode

# A CV with less text than this is treated as scanned (images only).
MIN_TEXT_CHARS = 30
MAX_TEXT_CHARS = 100_000
_SPACES = re.compile(r"[ \t ]+")

# pypdf logs warnings about odd PDFs; they would carry nothing useful and may be noisy.
logging.getLogger("pypdf").setLevel(logging.ERROR)


def extract_lines(data: bytes, *, max_pages: int) -> list[str]:
    try:
        reader = PdfReader(io.BytesIO(data))
        if reader.is_encrypted or len(reader.pages) > max_pages:
            raise AppError(ErrorCode.CV_UNREADABLE)
        text = "\n".join(page.extract_text() or "" for page in reader.pages)
    except AppError:
        raise
    except Exception as exc:  # any parser error on user input means "cannot read it"
        raise AppError(ErrorCode.CV_UNREADABLE) from exc

    lines = [_SPACES.sub(" ", line).strip() for line in text[:MAX_TEXT_CHARS].splitlines()]
    lines = [line for line in lines if line]
    if sum(len(line) for line in lines) < MIN_TEXT_CHARS:
        raise AppError(ErrorCode.CV_UNREADABLE)
    return lines

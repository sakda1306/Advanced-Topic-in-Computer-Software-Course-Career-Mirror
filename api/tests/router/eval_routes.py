"""Router accuracy on the Thai evaluation set, for the report (Design.md §4.6).

Calls the real Groq API for messages the rules leave open, and spends tokens. Not a pytest test.
Run from the repo root, where `.env` is: PYTHONPATH=api python -m tests.router.eval_routes
"""

from __future__ import annotations

import asyncio
import json
import sys
import tempfile
from collections import Counter
from pathlib import Path

from app.core.config import get_settings
from app.infra.db import Base, create_engine, create_session_factory
from app.infra.llm import GroqClient
from app.router.decide import decide

CASES = Path(__file__).with_name("routing_cases.jsonl")


async def evaluate() -> None:
    cases = [json.loads(line) for line in CASES.read_text(encoding="utf-8").splitlines()]
    with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as folder:
        url = f"sqlite+aiosqlite:///{Path(folder).as_posix()}/eval.db"
        engine = create_engine(url)
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        llm = GroqClient(get_settings(), create_session_factory(engine))
        right: Counter[str] = Counter()
        total: Counter[str] = Counter()
        tokens = 0
        for case in cases:
            decision = await decide(case["message"], has_profile=True, llm=llm)
            total[decision.layer] += 1
            tokens += decision.tokens
            if decision.route == case["route"]:
                right[decision.layer] += 1
            else:
                print(
                    f"WRONG [{decision.layer} {decision.confidence:.2f}] {case['message']}"
                    f"  want {case['route']}, got {decision.route}"
                )
        await llm.aclose()
        await engine.dispose()
    for layer in sorted(total):
        print(f"{layer}: {right[layer]}/{total[layer]}")
    print(f"all: {sum(right.values())}/{len(cases)}, LLM tokens: {tokens}")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
    asyncio.run(evaluate())

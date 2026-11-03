"""Chat answers per route (PRD FR-11, FR-12, FR-16, FR-17; Design.md §4.6)."""

from __future__ import annotations

import json
from typing import Any

import httpx
import pytest
from sqlalchemy import select

from app.api.deps import Container
from app.domain.chat_answers import find_roles, load_salary_reference, salary_answer
from app.domain.matching.roles import load_catalogue
from app.infra.models import ChatMessage
from tests.test_profile import LLM_SECTIONS, Groq, _ready

CATALOGUE = load_catalogue("../data")
SALARY = load_salary_reference("../data")
TITLES = {role.role_id: role for role in CATALOGUE}
GOOD_CLAIM = {"text_th": "Python ของคุณอยู่ระดับ 3", "evidence_ids": ["cv-2"]}


@pytest.fixture
def settings_overrides() -> dict[str, Any]:
    return {
        "groq_api_key": "k",
        "groq_model": "main-model",
        "groq_router_model": "router-model",
        "groq_fallback_model": "router-model",
        "quota_daily_requests": 20,
        "quota_daily_tokens": 5000,
        "data_dir": "../data",
    }


@pytest.fixture
def groq(container: Container) -> Groq:
    return Groq(container)


@pytest.fixture
async def with_profile(container: Container, user: httpx.AsyncClient, groq: Groq) -> None:
    await _ready(container, user)
    groq.reply(LLM_SECTIONS)
    response = await user.post("/api/profile/generate")
    assert response.status_code == 200, response.text
    groq.requests.clear()


async def _ask(user: httpx.AsyncClient, message: str) -> dict[str, Any]:
    response = await user.post("/api/chat", json={"message": message})
    assert response.status_code == 200, response.text
    return response.json()


def _sent(groq: Groq) -> dict[str, Any]:
    return json.loads(groq.requests[-1]["messages"][1]["content"])


# --- naming a role


@pytest.mark.parametrize(
    ("message", "expected"),
    [
        ("เงินเดือน QA เท่าไหร่", ["qa-engineer"]),
        ("ai engineer ได้เท่าไหร่", ["ai-engineer"]),
        ("เงินเดือนนักวิเคราะห์ข้อมูลเท่าไหร่", ["data-analyst"]),
        ("full stack developer", ["fullstack-developer"]),
        ("full-stack ได้เท่าไหร่", ["fullstack-developer"]),
        ("machine learning engineer", ["ml-engineer"]),
        ("ML ได้เท่าไหร่", ["ml-engineer"]),
        ("devops กับ cloud engineer", ["devops-engineer", "cloud-engineer"]),
    ],
)
def test_a_role_is_found_in_the_message(message: str, expected: list[str]) -> None:
    assert find_roles(message, CATALOGUE) == expected


@pytest.mark.parametrize(
    "message",
    ["เงินเดือนเท่าไหร่", "ส่ง email ให้หน่อย", "engineer ได้เท่าไหร่", "data ได้เท่าไหร่"],
)
def test_no_clear_role_finds_nothing(message: str) -> None:
    assert find_roles(message, CATALOGUE) == []


def test_at_most_three_roles_are_found() -> None:
    message = "qa devops cloud frontend backend"
    assert len(find_roles(message, CATALOGUE)) == 3


# --- the salary text


def test_salary_gives_the_range_measure_source_and_date() -> None:
    answer = salary_answer(["qa-engineer"], SALARY, TITLES)
    assert "฿22,000 – ฿40,000 / เดือน (ฐานเงินเดือน)" in answer.text
    assert "ระดับเริ่มต้น" in answer.text
    assert "Jobsdb ไทย" in answer.text
    assert "8 มิ.ย. 2569" in answer.text
    assert "จัดทำโดยทีมผู้พัฒนา" in answer.text
    assert "[1]" in answer.text
    [source] = answer.sources
    assert source["n"] == 1
    assert source["evidence_id"] == "salary-qa-engineer"
    assert source["url"].startswith("https://th.jobsdb.com/")


def test_a_figure_from_a_related_role_says_so() -> None:
    proxy = next(row.role_id for row in SALARY.values() if row.match == "proxy")
    assert "ตำแหน่งใกล้เคียง" in salary_answer([proxy], SALARY, TITLES).text
    assert "ตำแหน่งใกล้เคียง" not in salary_answer(["qa-engineer"], SALARY, TITLES).text


def test_a_role_with_no_figure_says_so_and_invents_nothing() -> None:
    missing = next(role.role_id for role in CATALOGUE if role.role_id not in SALARY)
    answer = salary_answer([missing], SALARY, TITLES)
    assert "ยังไม่มีข้อมูลเงินเดือน" in answer.text
    assert "฿" not in answer.text
    assert answer.sources == []


# --- salary and market through the API


async def test_salary_needs_no_profile_and_no_llm(user: httpx.AsyncClient, groq: Groq) -> None:
    body = await _ask(user, "เงินเดือน QA เท่าไหร่")
    assert body["route"] == "salary"
    assert "฿22,000" in body["answer"]
    assert body["sources"][0]["evidence_id"] == "salary-qa-engineer"
    assert body["tokens_used"] == 0
    assert groq.requests == []


async def test_salary_with_no_role_and_no_profile_asks_which_role(
    user: httpx.AsyncClient, groq: Groq
) -> None:
    body = await _ask(user, "เงินเดือนเท่าไหร่")
    assert body["route"] == "salary"
    assert "ตำแหน่งไหน" in body["answer"]
    assert body["sources"] == []
    assert groq.requests == []


async def test_salary_with_no_role_uses_the_best_match(
    user: httpx.AsyncClient, groq: Groq, with_profile: None
) -> None:
    body = await _ask(user, "เงินเดือนเท่าไหร่")
    matches = (await user.get("/api/roles/matches")).json()
    top = matches["roles"][0]
    assert top["title_th"] in body["answer"]
    assert groq.requests == []


async def test_salary_with_no_role_prefers_the_role_the_user_wants(
    container: Container, user: httpx.AsyncClient, groq: Groq
) -> None:
    await _ready(container, user)
    response = await user.put(
        "/api/questionnaire/answers/go_interested_roles", json={"value": ["qa-engineer"]}
    )
    assert response.status_code == 200, response.text
    groq.reply(LLM_SECTIONS)
    await user.post("/api/profile/generate")
    body = await _ask(user, "เงินเดือนเท่าไหร่")
    assert body["sources"][0]["evidence_id"] == "salary-qa-engineer"


async def test_market_says_it_has_no_data_and_makes_nothing_up(
    user: httpx.AsyncClient, groq: Groq
) -> None:
    body = await _ask(user, "ตลาดงาน AI Engineer เป็นยังไง")
    assert body["route"] == "market"
    assert "ยังไม่พร้อม" in body["answer"]
    assert not any(character.isdigit() for character in body["answer"])
    assert body["sources"] == []
    assert body["tokens_used"] == 0
    assert groq.requests == []


# --- answers from the saved profile, no LLM


async def test_experience_cites_the_saved_summary_without_an_llm_call(
    user: httpx.AsyncClient, groq: Groq, with_profile: None
) -> None:
    body = await _ask(user, "ประสบการณ์ของผมเป็นยังไง")
    assert body["route"] == "experience"
    assert "ฝึกงานที่ ABC 6 เดือน [1]" in body["answer"]
    assert "6 เดือน" in body["answer"]
    assert body["sources"][0]["evidence_id"] == "cv-5"
    assert body["sources"][0]["label_th"] == "CV บรรทัด 5"
    assert groq.requests == []


async def test_work_style_is_self_reported_with_the_disclaimer(
    user: httpx.AsyncClient, groq: Groq, with_profile: None
) -> None:
    body = await _ask(user, "สไตล์การทำงานของผมเป็นยังไง")
    assert body["route"] == "work_style"
    assert "ไม่ใช่การวินิจฉัยบุคลิกภาพ" in body["answer"]
    assert groq.requests == []


# --- answers the LLM words


async def test_skill_assessment_cites_the_claims_that_hold_up(
    user: httpx.AsyncClient, groq: Groq, with_profile: None
) -> None:
    groq.reply({"claims": [GOOD_CLAIM]}, tokens=70)
    body = await _ask(user, "ทักษะของผมเป็นยังไง")
    assert body["route"] == "skill_assessment"
    assert body["answer"] == "- Python ของคุณอยู่ระดับ 3 [1]"
    assert body["sources"] == [{"n": 1, "evidence_id": "cv-2", "label_th": "CV บรรทัด 2"}]
    assert body["tokens_used"] == 70
    assert groq.requests[-1]["model"] == "main-model"


async def test_the_same_evidence_keeps_one_number(
    user: httpx.AsyncClient, groq: Groq, with_profile: None
) -> None:
    groq.reply({"claims": [GOOD_CLAIM, {"text_th": "ใช้ Python ได้ดี", "evidence_ids": ["cv-2"]}]})
    body = await _ask(user, "ทักษะของผมเป็นยังไง")
    assert body["answer"].count("[1]") == 2
    assert len(body["sources"]) == 1


async def test_only_the_needed_facts_go_to_the_llm(
    user: httpx.AsyncClient, groq: Groq, with_profile: None
) -> None:
    groq.reply({"claims": [GOOD_CLAIM]})
    await _ask(user, "ทักษะของผมเป็นยังไง")
    raw = groq.requests[-1]["messages"][1]["content"]
    sent = json.loads(raw)
    assert sent["question"] == "ทักษะของผมเป็นยังไง"
    names = " ".join(s["name"] for s in sent["facts"]["hard_skills"])
    assert all(skill in names for skill in ("Python", "SQL", "Docker"))
    for private in ("Somchai", "Intern at ABC", "BSc", "go_salary", "37500"):
        assert private not in raw


@pytest.mark.parametrize(
    "claim",
    [
        {"text_th": "เก่ง Python", "evidence_ids": ["made-up"]},
        {"text_th": "เก่ง Python", "evidence_ids": []},
        {"text_th": "ใช้ Python มา 99 ปี", "evidence_ids": ["cv-2"]},
        {"text_th": "เก่ง Kubernetes มาก", "evidence_ids": ["cv-2"]},
    ],
)
async def test_a_claim_that_does_not_hold_up_falls_back_to_the_facts(
    user: httpx.AsyncClient, groq: Groq, with_profile: None, claim: dict[str, Any]
) -> None:
    groq.reply({"claims": [claim]})
    body = await _ask(user, "ทักษะของผมเป็นยังไง")
    assert "Kubernetes" not in body["answer"]
    assert "99" not in body["answer"]
    assert "Python ระดับ 3 [" in body["answer"]
    assert {s["evidence_id"] for s in body["sources"]} >= {"cv-2", "cv-3", "cv-4"}


async def test_a_skill_named_only_in_the_question_cannot_enter_a_claim(
    user: httpx.AsyncClient, groq: Groq, with_profile: None
) -> None:
    groq.reply({"claims": [{"text_th": "คุณเก่ง Kubernetes", "evidence_ids": ["cv-2"]}]})
    body = await _ask(user, "ทักษะ Kubernetes ของผมเป็นยังไง")
    assert "Kubernetes" not in body["answer"]


async def test_blind_spots_use_the_gaps_of_the_top_roles(
    user: httpx.AsyncClient, groq: Groq, with_profile: None
) -> None:
    groq.reply({"claims": [{"text_th": "ยังขาดทักษะบางอย่าง", "evidence_ids": ["cv-4"]}]})
    body = await _ask(user, "จุดอ่อนของผมคืออะไร")
    assert body["route"] == "blind_spots"
    facts = _sent(groq)["facts"]
    assert facts["saved_blind_spots"][0]["evidence_ids"] == ["cv-4"]
    assert len(facts["top_roles"]) <= 3
    assert facts["top_roles"][0]["gaps"]
    assert "ยังขาดทักษะบางอย่าง [1]" in body["answer"]


async def test_blind_spots_fall_back_to_saved_text_and_computed_gaps(
    user: httpx.AsyncClient, groq: Groq, with_profile: None
) -> None:
    groq.reply({"claims": []})
    body = await _ask(user, "จุดอ่อนของผมคืออะไร")
    assert LLM_SECTIONS["blind_spots"][0]["text_th"] in body["answer"]
    assert "ยังขาด" in body["answer"]
    assert any(s["evidence_id"].startswith("role-") for s in body["sources"])


async def test_job_matching_percentages_come_from_scoring_not_the_llm(
    user: httpx.AsyncClient, groq: Groq, with_profile: None
) -> None:
    top = (await user.get("/api/roles/matches")).json()["roles"][0]
    groq.reply(
        {
            "claims": [
                {"text_th": "ตรงกับคุณถึง 99%", "evidence_ids": [f"role-{top['role_id']}"]},
                {"text_th": "มี Python ตรงกับงานนี้", "evidence_ids": ["cv-2"]},
            ]
        }
    )
    body = await _ask(user, "ผมควรเรียนอะไรต่อ")
    assert body["route"] == "job_matching"
    assert f"{top['title_th']} ตรง {top['match_pct']}%" in body["answer"]
    assert "99%" not in body["answer"]
    assert "มี Python ตรงกับงานนี้" in body["answer"]
    assert "ไม่ใช่การรับประกันการได้งาน" in body["answer"]
    assert top["gaps"][0]["name_th"] in body["answer"]
    role_source = next(s for s in body["sources"] if s["evidence_id"].startswith("role-"))
    assert role_source["url"].startswith("http")


async def test_job_matching_without_valid_claims_still_answers(
    user: httpx.AsyncClient, groq: Groq, with_profile: None
) -> None:
    groq.reply({"claims": "not a list"})
    body = await _ask(user, "ผมควรเรียนอะไรต่อ")
    assert "%" in body["answer"]


# --- failures, quota, history


async def test_llm_failure_refunds_and_saves_nothing(
    user: httpx.AsyncClient, groq: Groq, with_profile: None
) -> None:
    before = (await user.get("/api/quota")).json()["requests_used"]
    groq.fail()
    response = await user.post("/api/chat", json={"message": "ทักษะของผมเป็นยังไง"})
    assert response.status_code == 503
    assert (await user.get("/api/quota")).json()["requests_used"] == before
    assert (await user.get("/api/chat/history")).json()["messages"] == []


async def test_answer_tokens_count_toward_the_quota(
    user: httpx.AsyncClient, groq: Groq, with_profile: None
) -> None:
    before = (await user.get("/api/quota")).json()["tokens_used"]
    groq.reply({"claims": [GOOD_CLAIM]}, tokens=70)
    await _ask(user, "ทักษะของผมเป็นยังไง")
    assert (await user.get("/api/quota")).json()["tokens_used"] == before + 70


async def test_history_keeps_the_sources(user: httpx.AsyncClient, groq: Groq) -> None:
    sent = await _ask(user, "เงินเดือน QA เท่าไหร่")
    [mine, reply] = (await user.get("/api/chat/history")).json()["messages"]
    assert mine["sources"] == []
    assert reply["sources"] == sent["sources"] != []


async def test_a_new_message_row_has_empty_sources(
    container: Container, user: httpx.AsyncClient, groq: Groq
) -> None:
    await _ask(user, "งวดนี้หวยออกอะไร")
    async with container.sessions() as db:
        rows = list(await db.scalars(select(ChatMessage)))
    assert [row.sources for row in rows] == [[], []]


async def test_profile_edit_is_still_not_ready(
    user: httpx.AsyncClient, groq: Groq, with_profile: None
) -> None:
    body = await _ask(user, "ลบ Docker")
    assert body["route"] == "profile_edit"
    assert "ยังไม่พร้อม" in body["answer"]
    assert groq.requests == []

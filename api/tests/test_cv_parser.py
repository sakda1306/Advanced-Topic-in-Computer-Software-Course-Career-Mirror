"""Rules-only CV parsing (PRD FR-2, Design.md §4.1): taxonomy matching, sections, entries."""

from __future__ import annotations

from datetime import date
from pathlib import Path

import pytest

from app.core.errors import AppError, ErrorCode
from app.domain.cv_parser import parse_cv
from app.domain.matching.skills import SkillTaxonomy, load_taxonomy
from app.infra.pdf_text import extract_lines
from tests.pdf_fixtures import make_pdf

DATA_DIR = Path(__file__).parents[2] / "data"
TODAY = date(2026, 11, 3)


@pytest.fixture(scope="module")
def taxonomy() -> SkillTaxonomy:
    return load_taxonomy(str(DATA_DIR))


# --- skill matching ----------------------------------------------------------------------


@pytest.mark.parametrize(
    ("line", "expected"),
    [
        ("Python, Docker and Kubernetes", ["python", "docker", "kubernetes"]),
        ("Built REST APIs with Node.js", ["rest-api", "nodejs"]),
        ("C++ and C# developer", ["cpp", "csharp"]),
        ("Deployed on Amazon Web Services", ["aws"]),
        ("Used Redis for caching", ["caching", "nosql"]),
    ],
)
def test_taxonomy_finds_skills(taxonomy: SkillTaxonomy, line: str, expected: list[str]) -> None:
    assert set(expected) <= set(taxonomy.find(line))


@pytest.mark.parametrize(
    "line",
    [
        "I can go to the office",  # no "go" skill from plain English
        "Research and development",  # not the R language
        "Handled user ids in the log",  # not IDS
        "Javascripting is fun",  # no partial word match
    ],
)
def test_taxonomy_ignores_plain_words(taxonomy: SkillTaxonomy, line: str) -> None:
    found = taxonomy.find(line)
    assert "r" not in found
    assert "siem" not in found
    assert "javascript" not in found


def test_taxonomy_matches_thai_names(taxonomy: SkillTaxonomy) -> None:
    skill = taxonomy.get("caching")
    assert skill is not None
    thai_main = skill.name_th.split("(")[0].strip()
    assert "caching" in taxonomy.find(f"มีประสบการณ์{thai_main}ในระบบจริง")


# --- whole CV ----------------------------------------------------------------------------

CV_EN = [
    "Somchai Jaidee",  # 1
    "somchai@example.com",  # 2
    "Skills",  # 3
    "Python (4 years), Docker, SQL",  # 4
    "Work Experience",  # 5
    "Backend Developer at Acme Co., Ltd.  Jan 2022 - Present",  # 6
    "Built REST APIs with FastAPI and PostgreSQL",  # 7
    "Junior Developer | Beta Soft  06/2020 - 12/2021",  # 8
    "Maintained internal tools",  # 9
    "Education",  # 10
    "Bachelor of Engineering in Computer Engineering",  # 11
    "Kasetsart University 2016 - 2020",  # 12
]


def test_parse_finds_skills_with_lines_and_levels(taxonomy: SkillTaxonomy) -> None:
    parsed = parse_cv(CV_EN, taxonomy, today=TODAY)
    by_id = {s.skill_id: s for s in parsed.skills}
    assert {"python", "docker", "sql", "rest-api"} <= set(by_id)
    assert by_id["python"].line_no == 4
    assert by_id["python"].level == 3  # 4 years
    assert by_id["docker"].level is None  # no years: the user picks a level in the confirm step
    assert by_id["python"].name == "Python"
    assert len(parsed.skills) == len(by_id)  # each skill once


def test_parse_experience_entries(taxonomy: SkillTaxonomy) -> None:
    parsed = parse_cv(CV_EN, taxonomy, today=TODAY)
    first, second = parsed.experience
    assert (first.title, first.company) == ("Backend Developer", "Acme Co., Ltd.")
    assert (first.start, first.end, first.line_no) == ("2022-01", None, 6)
    assert first.months == 59  # Jan 2022 to Nov 2026, both months counted
    assert first.summary == "Built REST APIs with FastAPI and PostgreSQL"
    assert (second.title, second.company) == ("Junior Developer", "Beta Soft")
    assert (second.start, second.end, second.months) == ("2020-06", "2021-12", 19)


def test_parse_education(taxonomy: SkillTaxonomy) -> None:
    (entry,) = parse_cv(CV_EN, taxonomy, today=TODAY).education
    assert entry.school == "Kasetsart University"
    assert entry.degree == "Bachelor of Engineering"
    assert entry.field == "Computer Engineering"
    assert (entry.start, entry.end) == ("2016", "2020")
    assert entry.line_no == 11


def test_parse_clean_cv_has_only_level_warning(taxonomy: SkillTaxonomy) -> None:
    parsed = parse_cv(CV_EN, taxonomy, today=TODAY)
    assert parsed.warnings_th == ["ทักษะบางรายการยังไม่มีระดับ กรุณาเลือกระดับในขั้นตอนยืนยัน"]


CV_TH = [
    "ประวัติการศึกษา",  # 1
    "ปริญญาตรี วิศวกรรมศาสตร์ สาขาวิศวกรรมคอมพิวเตอร์",  # 2
    "มหาวิทยาลัยเกษตรศาสตร์ 2559 - 2563",  # 3
    "ประสบการณ์ทำงาน",  # 4
    "นักพัฒนาซอฟต์แวร์ บริษัท เอ จำกัด มกราคม 2565 - ปัจจุบัน",  # 5
    "ทักษะ",  # 6
    "Python 2 ปี, Git",  # 7
]


def test_parse_thai_cv_with_buddhist_years(taxonomy: SkillTaxonomy) -> None:
    parsed = parse_cv(CV_TH, taxonomy, today=TODAY)
    (edu,) = parsed.education
    assert edu.school == "มหาวิทยาลัยเกษตรศาสตร์"
    assert edu.degree == "ปริญญาตรี"
    assert edu.field == "วิศวกรรมคอมพิวเตอร์"
    assert (edu.start, edu.end) == ("2016", "2020")
    (job,) = parsed.experience
    assert job.start == "2022-01"
    assert job.end is None
    assert job.line_no == 5
    python = next(s for s in parsed.skills if s.skill_id == "python")
    assert python.level == 2


def test_parse_warns_when_things_are_missing(taxonomy: SkillTaxonomy) -> None:
    parsed = parse_cv(
        ["Experience", "Barista at Coffee Shop", "Hobbies", "Reading"], taxonomy, today=TODAY
    )
    assert parsed.skills == []
    assert [e.title for e in parsed.experience] == ["Barista"]
    assert "ไม่พบทักษะที่ระบบรู้จักใน CV กรุณาเพิ่มเองในขั้นตอนยืนยัน" in parsed.warnings_th
    assert "ไม่พบวันที่ของประสบการณ์บางรายการ" in parsed.warnings_th
    assert "ไม่พบข้อมูลการศึกษาใน CV" in parsed.warnings_th


# --- PDF text ----------------------------------------------------------------------------


def test_extract_lines_from_pdf() -> None:
    lines = extract_lines(make_pdf(CV_EN), max_pages=20)
    assert lines[3] == "Python (4 years), Docker, SQL"
    assert len(lines) == len(CV_EN)


@pytest.mark.parametrize(
    "data",
    [make_pdf(None), b"%PDF-1.4\nnot really a pdf", make_pdf(["a"])],
    ids=["scanned", "broken", "almost-empty"],
)
def test_unreadable_pdf(data: bytes) -> None:
    with pytest.raises(AppError) as caught:
        extract_lines(data, max_pages=20)
    assert caught.value.code == ErrorCode.CV_UNREADABLE


def test_too_many_pages_is_unreadable() -> None:
    with pytest.raises(AppError) as caught:
        extract_lines(make_pdf(CV_EN, pages=3), max_pages=2)
    assert caught.value.code == ErrorCode.CV_UNREADABLE

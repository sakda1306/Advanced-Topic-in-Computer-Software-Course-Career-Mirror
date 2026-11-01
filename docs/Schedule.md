# CareerMirror: Schedule

<!--
PURPOSE: The detailed day-by-day work plan and who does what. PRD.md section 11 keeps only the milestones;
this file holds the task-level detail and progress. Update it daily.
DOES NOT CONTAIN: requirements (PRD.md), design (Design.md).
-->

Timeline: 31 Oct 2026 to 5 Nov 2026. Milestones: [PRD.md](PRD.md) section 11. Folder ownership: [GIT_FLOW.md](GIT_FLOW.md) section 2.

Status: DRAFT. Task split is a proposal; confirm with both members.

## Tasks

<!-- Status: todo / doing / done / cut. Priority matches PRD (P0 / P1).
Owner: sakda1306 = api, data pipeline, RAG · Automatic28m = web, Thai UI · both = shared docs/ and data/. -->

| Day | Task | Owner | Priority | Status |
|---|---|---|---|---|
| 31 Oct | Docs: PRD, Design, Contract v0.1, DesignSystem, conventions, git flow | sakda1306 | P0 | done |
| 31 Oct | API scaffold: app factory, Problem-JSON errors, middleware, Alembic, health | sakda1306 | P0 | done |
| 31 Oct | Auth: register, login (rate limit), logout, me, delete account (FR-26) | sakda1306 | P0 | done |
| 31 Oct | Docker Compose, `.env.example`, `.gitignore` | sakda1306 | P0 | done |
| 31 Oct | Contract v0.2 (generic error codes) | sakda1306 | P0 | done |
| 31 Oct | Small Apify JobThai test run and report (`jobthai_report.json`) | sakda1306 | P0 | done |
| 31 Oct | Collect role source PDFs and a first `roles.json` draft | Automatic28m | P0 | done |
| 1 Nov | Review and approve Contract v0.2, then lock it | Automatic28m | P0 | todo |
| 1 Nov | Agree on the final role list (~10) and the `role_id` format (Design §6) | both | P0 | todo |
| 1 Nov | Web scaffold: Next.js, Tailwind tokens, app shell, `/api` proxy, Docker image | Automatic28m | P0 | todo |
| 1 Nov | Web: landing, register, login pages calling the auth endpoints | Automatic28m | P0 | todo |
| 1 Nov | CIBrand: colours, fonts and tone, so DesignSystem tokens resolve | Automatic28m | P0 | todo |
| 1 Nov | API: CV upload and parsing, review/confirm (FR-0 – FR-4) | sakda1306 | P0 | todo |
| 1 Nov | API: quota service and `X-Quota-*` headers (FR-23, FR-24) | sakda1306 | P0 | todo |
| 1 Nov | Data: skill taxonomy (`skills/taxonomy.json`) | both | P0 | todo |
| 2 Nov | API: questionnaire endpoints with per-question save (FR-5 – FR-7) | sakda1306 | P0 | todo |
| 2 Nov | API: AI Router skeleton and Groq client with retry (FR-11 – FR-13) | sakda1306 | P0 | todo |
| 2 Nov | RAG: port Team-D-II module 05 into `api/app/rag/`; Thai golden set; pick embedding model | sakda1306 | P0 | todo |
| 2 Nov | Data: ~10 role profiles (`roles/*.json` + `roles/*.md`) with author and sources | both | P0 | todo |
| 2 Nov | Data: `questionnaire.json` (15-20 questions), `rag/work_style.md`, `rag/soft_skills.md` | both | P0 | doing |
| 2 Nov | Data: salary reference table (`salary/reference.csv`) with source, URL, date | both | P0 | todo |
| 2 Nov | Web: intake page with CV upload + parsed CV review, questionnaire tab | Automatic28m | P0 | todo |
| 3 Nov | API: chat with completeness meter and follow-up questions (FR-8, FR-9) | sakda1306 | P0 | todo |
| 3 Nov | API: profile builder with cited evidence (FR-14 – FR-17) | sakda1306 | P0 | todo |
| 3 Nov | API: role scoring in Python, threshold, top N, closest roles (FR-18 – FR-20) | sakda1306 | P0 | todo |
| 3 Nov | Data: seed the per-role job cache (one fetch per role) | sakda1306 | P0 | todo |
| 3 Nov | Calibrate scoring weights, match threshold, completeness threshold with sample profiles | both | P0 | todo |
| 3 Nov | Web: chat tab + progress sidebar, profile page with skill chips and citations | Automatic28m | P0 | todo |
| 4 Nov | API: next steps per gap (FR-20a), role view: salary layers, market, listings (FR-21, FR-22) | sakda1306 | P0 | todo |
| 4 Nov | API: profile edit by chat and skill remove, recompute matches (FR-27 – FR-34) | sakda1306 | P0 | todo |
| 4 Nov | API: background cache refresh with daily cap (FR-22b, FR-22c) | sakda1306 | P1 | todo |
| 4 Nov | Web: role results, role detail, edit proposal card, account page | Automatic28m | P0 | todo |
| 4 Nov | Thai copy pass and agreed disclaimer texts (DesignSystem §5) | both | P0 | todo |
| 4 Nov | End-to-end test with `docker compose up --build`; bug fixes | both | P0 | todo |
| 5 Nov | Course report (scope, architecture, data sources marked unofficial, future work) | both | P0 | todo |
| 5 Nov | Tester check (5 testers, PRD §9) and demo rehearsal with the seeded cache | both | P0 | todo |
| 5 Nov | Release: PR `develop` → `main`, final pre-push checklist, submission | sakda1306 | P0 | todo |

## Dependencies and risks this week

- Contract must be locked (1 Nov) before web codes against CV, chat, profile and role endpoints.
- Role list and `role_id` format (1 Nov) block the role profiles, salary table, cache seeding and RAG documents.
- Skill taxonomy blocks CV skill mapping, scoring and role profiles.
- Role profiles and RAG port (2 Nov) block scoring and profile evidence (3 Nov).
- CIBrand colours and fonts block final styling; web can start with placeholder tokens.
- Groq model choice decides the quota numbers (PRD open question 2); decide by 2 Nov.
- Cache seeding uses Apify credits; run once per role, within the budget in `jobthai_report.json`.
- `feature/phanlop` is based on older docs; rebase on `develop` before its PR so it does not overwrite newer docs.

## Cut list

Drop in this order if behind schedule:

1. Quota indicator in the UI (FR-25, P1).
2. Streaming chat responses (FR-10, P1).
3. Background cache refresh (FR-22b, P1 here); the seeded cache stays the baseline.
4. JobsDB as a second job source; JobThai only.
5. Undo toast for skill removal; keep a confirmation instead.

## Done log

- 31 Oct 2026: docs set, API scaffold with auth, Docker Compose, Contract v0.2, JobThai test run.

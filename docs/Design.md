# CareerMirror: Design

<!--
PURPOSE: Architecture and flow only. How the system is put together and how data moves through it.
This file also replaces a separate architecture.md (they would duplicate each other).
DOES NOT CONTAIN: requirements (see PRD.md), UI rules, colours, fonts (see DesignSystem.md),
endpoint shapes (see Contract.md), dates (see Schedule.md). Link to those; do not copy them.
OWNER: backend lead. Update when a component or data flow changes.
-->

Scope and requirements: [PRD.md](PRD.md)

## 1. System overview

<!-- One diagram (draw.io or Mermaid) plus 3-5 lines. Components: web, api, vector DB, SQLite, LLM, job-data source. -->

## 2. Components

<!-- One short subsection per component: responsibility, inputs, outputs. -->

- Web (Next.js)
- API (FastAPI)
- AI Router
- Profile Builder
- Role matching (Python scoring)
- RAG (Chroma + embedding model)
- Data provider (job postings, salary, market) and role cache
- Quota guard
- Storage

## 3. Request flow

<!-- Step-by-step: request -> quota check -> router -> route handler -> LLM -> response. -->

## 4. Main flows

<!-- One sequence diagram each. -->

1. Intake: CV parse, questionnaire, chat, completeness meter
2. Generate profile
3. Role matching, threshold, next steps
4. Role view: cache read, background refresh, fallback
5. Profile edit (chat edit and remove button)

## 5. Data model

<!-- Tables/collections: user, session, cv, answers, chat message, profile, quota counter, role profile, job cache. Fields only, no UI. -->

## 6. Role profiles and RAG documents

<!-- Structure of a role profile file in /data, skill taxonomy, how documents are chunked and retrieved. -->

## 7. External data and caching

<!-- Data provider interface, sources, cache key (role), fetched_at, refresh rule, failure fallback. -->

## 8. Deployment

<!-- docker-compose services, env vars (names only, never values), volumes. -->

## 9. Decisions and trade-offs

<!-- Short list: decision, alternative, reason. Example: Python scoring instead of LLM scoring. -->

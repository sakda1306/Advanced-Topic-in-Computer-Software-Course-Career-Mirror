# CareerMirror: API Contract

<!--
PURPOSE: The agreement between frontend and backend: endpoints, request/response shapes, error codes.
Change it only when both members agree (record the agreement in the change log below).
DOES NOT CONTAIN: why the system is built this way (Design.md), UI look (DesignSystem.md).
OWNER: both members.
-->

Related: [PRD.md](PRD.md), [Design.md](Design.md)

## 1. Conventions

<!-- Base URL, JSON format, auth/session header, date format (ISO 8601), error body shape, Thai message field. -->

## 2. Endpoints

<!-- One block per endpoint using the template below. -->

### Template

```
METHOD /path
Purpose:
Request:
Response 200:
Errors:
Quota: counts / does not count
```

### Groups to fill in

- Session
- CV upload and parse
- Questionnaire
- Chat (and progress / completeness)
- Profile (generate, get, edit, remove skill)
- Roles (list matches, role detail, next steps)
- Role market data (salary, demand, listings, cache status)
- Quota (remaining, reset time)
- Data deletion

## 3. Shared types

<!-- Profile, Skill, RoleMatch, Evidence, SalaryRange (source, measure, date), Error. -->

## 4. Error codes

<!-- Code, HTTP status, meaning. Include quota exceeded, file rejected, scanned PDF, upstream LLM error. -->

## 5. Change log

| Date | Change | Agreed by |
|---|---|---|

# CareerMirror: Design System

<!--
PURPOSE: All UI rules: tokens, components, layout, states, accessibility, Thai copy rules.
Colours and fonts come from CIBrand.md; reference them by name, do not copy hex values or font names.
DOES NOT CONTAIN: architecture (Design.md), brand definitions (CIBrand.md).
OWNER: frontend lead.
-->

Brand source: [CIBrand.md](CIBrand.md)

## 1. Tokens

<!-- Map CI Brand colours/fonts to design tokens (CSS variables / Tailwind theme). Spacing scale, radius, shadow. -->

## 2. Layout

<!-- Grid, breakpoints, page shell, sidebar width. -->

## 3. Components

<!-- One entry each: purpose, variants, states. -->

- Button, input, file upload (CV)
- Questionnaire item
- Chat bubble and chat input
- Progress sidebar / completeness meter
- Skill or preference chip with remove button
- Evidence citation
- Role match card (match %, matched/missing skills, next steps)
- Salary range with source, measure and date
- Loading, empty and error states
- Quota indicator

## 4. Page templates

<!-- Landing, intake, profile, role results, role detail. Wireframe or description per page. -->

### 4.1 Site map

`[Page]` is a screen with its own URL, `[Menu]` is a header menu, and `[Action]` is a button that moves the user to another area. Items without a tag are sections inside their parent page. Requirement IDs refer to [PRD.md](PRD.md).

```
CareerMirror
│
├── Welcome / เริ่มต้น [Page]
│   ├── Product introduction
│   ├── Consent notice (links to Privacy notice)
│   ├── Start session [Action]
│   └── Continue where you left off [Action] (returning session only; opens the furthest unlocked step)
│
└── Main Workspace
    │
    ├── My Information / ข้อมูลของฉัน [Page] (choose one or both: CV, questionnaire; at least one is needed)
    │   ├── CV Upload & Review [Page]
    │   │   ├── Upload PDF
    │   │   └── Review & correct extracted information
    │   ├── Questionnaire [Page] (resumable)
    │   │   ├── Technical & soft skills
    │   │   ├── Work-style preferences (self-reported, not a personality test)
    │   │   └── Motivation
    │   └── Guided Chat [Page] (opens after CV or questionnaire)
    │       ├── Follow-up questions
    │       ├── Profile completeness
    │       └── Generate profile [Action] (enabled at the completeness threshold; unlocks My Profile and Matching Roles)
    │
    ├── My Profile / โปรไฟล์ของฉัน [Page] (locked until a profile is generated)
    │   ├── Experience summary
    │   ├── Hard & soft skills (each skill has a remove button)
    │   ├── Work-style preferences (each preference has a remove button)
    │   ├── Potential blind spots
    │   └── Edit through chat / แก้ไขโปรไฟล์ด้วยแชท [Page]
    │       ├── Request a change
    │       └── Confirm or cancel each proposed change
    │
    ├── Matching Roles / อาชีพที่เหมาะกับฉัน [Page] (locked until a profile is generated)
    │   ├── Recommended IT roles, or closest roles when none pass the threshold
    │   ├── Match scores & reasons
    │   ├── Matched & missing skills
    │   └── Role Detail / รายละเอียดอาชีพ [Page]
    │       ├── Role overview & personal fit
    │       ├── Skill gaps & prioritised next steps
    │       ├── Salary ranges
    │       ├── Market demand & trending skills
    │       └── Relevant job listings
    │
    └── Session & Privacy [Menu]
        ├── Usage quota & reset time
        ├── Privacy notice [Page]
        └── Delete my data [Action] (confirm, then back to Welcome)
```

Rules that apply across the map:

- Evidence is shown inline on every claim in My Profile and Matching Roles, never as a separate section (FR-16). Items the user changed are labelled "edited by you" (FR-33).
- Guided Chat and Edit through chat are separate pages with separate histories. Guided Chat fills gaps before the profile exists (FR-8, FR-9). Edit through chat changes an existing profile, and every change needs the user to confirm it first (FR-27). After a profile is generated, Guided Chat stays open so the user can add more information.
- Removing a skill or preference makes no LLM call and still works when the quota is used up. Edit through chat counts toward the quota (FR-30, FR-34).
- Every salary figure shows its source, measure and date (FR-21). Salary, market and listings show a "last updated" date, or a loading state while a refresh runs (FR-22d).
- Locked areas still appear in the navigation, disabled, with a Thai hint saying what unlocks them.

## 5. Content rules (Thai)

<!-- Number formats (THB, %), date format, disclaimers (work-style is self-reported, sample/unofficial data), error message style. -->

## 6. Accessibility

<!-- Contrast target, keyboard use, focus, font size minimum. -->

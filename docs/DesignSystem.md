# CareerMirror: Design System

<!--
PURPOSE: All UI rules: tokens, components, layout, states, accessibility, Thai copy rules.
Colours and fonts come from CIBrand.md; reference them by name, do not copy hex values or font names.
DOES NOT CONTAIN: architecture (Design.md), brand definitions (CIBrand.md).
OWNER: frontend lead.
-->

Brand source: [CIBrand.md](CIBrand.md) · Data shapes shown in components: [Contract.md](Contract.md)

Status: DRAFT. Items marked (assumed) are proposals, not yet confirmed by the team.

## 1. Tokens

Stack (assumed): Next.js App Router + Tailwind CSS, with tokens as CSS variables in `web/app/globals.css` and mapped in `tailwind.config.ts`. Components may start from shadcn/ui (Radix primitives, accessible by default) and are restyled with these tokens.

### 1.1 Colour tokens

Each token points to a **named** colour in CIBrand.md section 3. CIBrand.md must define these names; the hex values live only there.

| token | CIBrand colour name | use |
|---|---|---|
| `--color-primary` | Primary | main buttons, links, active tab, meter fill |
| `--color-primary-hover` | Primary Dark | hover / pressed |
| `--color-primary-subtle` | Primary Light | selected chip, highlighted card background |
| `--color-accent` | Accent | match % emphasis, highlights (sparingly) |
| `--color-bg` | Neutral 0 | page background |
| `--color-surface` | Neutral 50 | cards, sidebar |
| `--color-border` | Neutral 200 | dividers, input borders |
| `--color-text` | Neutral 900 | body text |
| `--color-text-muted` | Neutral 600 | captions, sources, dates |
| `--color-success` | Success | matched skills, saved state |
| `--color-warning` | Warning | missing skills, stale data, quota low |
| `--color-danger` | Danger | errors, destructive actions |
| `--color-info` | Info | notices, disclaimers |

Colour is never the only signal: matched / missing skills also use an icon and a text label.

### 1.2 Typography tokens

| token | CIBrand font | size / line height | use |
|---|---|---|---|
| `--font-thai` | Thai font | – | all Thai text |
| `--font-latin` | Latin font | – | numbers, English skill names (fallback after the Thai font) |
| `text-display` | | 32 / 44 px, weight 700 | landing headline |
| `text-h1` | | 28 / 40, 700 | page title |
| `text-h2` | | 22 / 32, 600 | section title |
| `text-h3` | | 18 / 28, 600 | card title |
| `text-body` | | 16 / 26, 400 | default |
| `text-small` | | 14 / 22, 400 | captions, sources |
| `text-tiny` | | 12 / 18, 500 | chips, badges (never for body copy) |

Thai needs taller line height than Latin text; keep the ratios above. `font-family: var(--font-thai), var(--font-latin), system-ui, sans-serif`.

### 1.3 Spacing, radius, shadow, motion

- Spacing scale (4 px base): 4, 8, 12, 16, 24, 32, 48, 64.
- Radius: `--radius-sm` 6 px (inputs, chips) · `--radius-md` 10 px (buttons, cards) · `--radius-lg` 16 px (dialogs, chat bubbles) · full for pills.
- Shadow: `--shadow-sm` for cards, `--shadow-md` for popovers and dialogs. No shadow on flat list items.
- Motion: 150 ms ease-out for hover/focus, 250 ms for panels. Respect `prefers-reduced-motion` (no animation of the meter or skeletons).

## 2. Layout

- Breakpoints: `sm` 640, `md` 768, `lg` 1024, `xl` 1280 px. Mobile-first.
- Content max width 1120 px, side padding 16 px (mobile) / 24 px (≥ `md`).
- **App shell**: top bar (app name from `APP_NAME`, step indicator, quota indicator, account menu) + content.
- **Intake page**: two columns at `lg`: main area (tabs CV / แบบสอบถาม / แชท) and a right **progress sidebar** 320 px, sticky. Below `lg` the sidebar collapses into a bar above the content showing the score; tap to expand.
- **Results pages**: single column of cards; role cards in a 2-column grid at `lg`.
- Step indicator (always visible after login): 1 ข้อมูลของคุณ → 2 โปรไฟล์ → 3 สายงานที่เหมาะ → 4 รายละเอียดสายงาน.

## 3. Components

Each component lists purpose, variants and states. All interactive components have default, hover, focus-visible, active, disabled states.

| component | purpose | variants | states and rules |
|---|---|---|---|
| **Button** | actions | primary, secondary (outline), ghost, danger | loading shows spinner + keeps width; disabled has a reason in a tooltip (e.g. why "สร้างโปรไฟล์" is disabled) |
| **Input / Select / Slider** | forms | text, email, password, number (THB), select, multi-select, slider (salary) | error text under the field in Thai; label always visible (no placeholder-only labels) |
| **File upload (CV)** | upload PDF | drop zone + button | idle, dragging, uploading (progress), parsed, error (`CV_INVALID_TYPE`, `CV_TOO_LARGE`, `CV_UNREADABLE` with the API `message_th`); shows "PDF ไม่เกิน 5 MB" |
| **Parsed CV review** | confirm/correct extracted data (FR-3) | editable list: skills, education, experience | each row editable and removable; "ยืนยันข้อมูล" primary button |
| **Questionnaire item** | one question | single, multi, scale 1-5 with end labels, skill checklist with level, text | saved indicator per item (auto-save, FR-6); optional questions marked "(ไม่บังคับ)" |
| **Chat bubble** | messages | user, assistant, system notice | assistant bubbles render citations `[1]` as Evidence citation; long answers collapse after 12 lines |
| **Chat input** | send message | – | Enter sends, Shift+Enter new line; disabled with quota message when `exhausted`; 1000-char counter |
| **Edit proposal card** | confirm a chat edit (FR-27) | inline in chat | shows "เดิม → ใหม่" per change; buttons ยืนยัน / ยกเลิก; expired state greys out |
| **Progress sidebar / completeness meter** | FR-9 | – | ring or bar 0-100 with the number; checklist of slots (done ✓ / missing •); CV and questionnaire marked "ไม่บังคับ" when skipped, never red; "สร้างโปรไฟล์" button enabled only when `can_generate` |
| **Skill chip** | skill in profile (FR-29) | hard, soft; matched, missing, below-level (in role cards) | level dots (1-4); badge "แก้ไขโดยคุณ" when `edited_by_user` (FR-33); remove button (×) with an undo toast for 5 s (assumed); missing = warning colour + icon + "ยังไม่มี" |
| **Evidence citation** | show where a claim comes from (FR-16) | inline `[n]` | click/hover opens a popover with `label_th` and the excerpt; keyboard focusable |
| **Role match card** | one role result | normal, below-threshold (closest role) | title, match % (large number + bar), top matched skills, gaps, reason with citations, up to 5 next steps each linked to its gap, "ดูรายละเอียด" button; `explanations_stale` shows "กำลังอัปเดตคำอธิบาย" with a refresh action |
| **Salary range** | FR-21 | advertised, curated reference, official baseline (always separate rows) | "฿35,000 – ฿55,000 / เดือน" + source + measure + date; advertised row also shows sample size; never a single figure |
| **Market demand** | FR-22 | – | posting count, trending skills as chips, list of up to 5 listings (title, company, salary text, posted date, link) |
| **Data freshness badge** | FR-22d | fresh, stale, refreshing, unavailable | "อัปเดตล่าสุด 3 พ.ย. 2569"; refreshing shows a small spinner; stale shows warning colour + "ข้อมูลอาจไม่เป็นปัจจุบัน" |
| **Quota indicator** | FR-25 (P1) | top bar | "เหลือ 12/30 ครั้งวันนี้"; warning when < 20 %; exhausted shows reset time |
| **Toast** | short feedback | success, info, warning, error | auto-hide 5 s except errors; undo action for skill removal |
| **Dialog** | confirm destructive actions | – | delete account requires typing "DELETE"; focus trapped; Esc closes |
| **Skeleton / loading** | waiting | text lines, card | used for LLM waits; after 5 s add "กำลังวิเคราะห์ อาจใช้เวลาสักครู่" |
| **Empty state** | nothing yet | – | icon + one sentence + one action (e.g. "ยังไม่มีโปรไฟล์ เริ่มจากอัปโหลด CV หรือทำแบบสอบถาม") |
| **Error state** | failed request | inline, page | show `message_th` from the API; retry button; show `request_id` small and copyable for bug reports |
| **Disclaimer note** | required notices | work-style, unofficial data, team-curated | info colour, small text, always next to the content it qualifies |

## 4. Page templates

| page | route (web) | content |
|---|---|---|
| Landing | `/` | what the app does (self-understanding first), how it works in 4 steps, privacy summary, buttons สมัครใช้งาน / เข้าสู่ระบบ |
| Register / Login | `/register`, `/login` | email, password, display name; consent checkbox with the consent notice (required); link between the two pages |
| Intake | `/start` | tabs CV / แบบสอบถาม / แชท + progress sidebar; user may use tabs in any order (PRD §5) |
| Profile | `/profile` | sections: hard skills, soft skills, work-style (with disclaimer), experience, blind spots; skill chips with remove; citations; button "ดูสายงานที่เหมาะ" |
| Role results | `/roles` | heading with threshold explanation; role match cards (top 5); below-threshold banner when none pass (FR-19a) |
| Role detail | `/roles/[role_id]` | match summary, gaps + next steps, role description, salary ranges, market demand, listings, freshness badge, disclaimers |
| Account | `/account` | email, quota today, removed skills (restore), delete all data |

The chat stays available on Profile and Role pages as a side panel (`lg`) or a bottom sheet (mobile), so the user can edit by chat at any time (PRD §5 step 7).

## 5. Content rules (Thai)

- Tone: polite and friendly, address the user as "คุณ"; no slang; short sentences. Exact tone examples come from CIBrand.md section 5.
- **Numbers**: thousands separator, THB with "฿" before the number: "฿45,000". Ranges with an en dash and spaces: "฿35,000 – ฿55,000". Always add the measure: "/ เดือน (ฐานเงินเดือน)" or "/ ปี (รวมทุกอย่าง)".
- **Percent**: integer with "%": "72%". Never decimals for match %.
- **Dates**: Thai short format with Buddhist year, "3 พ.ย. 2569" (assumed); time "14:05 น.". API stays ISO 8601.
- **Skill names**: Thai name with the English name when it is a technology: "ภาษา Python", "Docker". Keep the official English spelling of tools.
- **Required disclaimers** (exact text to be agreed):
  - Work-style: "ผลนี้มาจากความชอบที่คุณระบุเอง ไม่ใช่การวินิจฉัยบุคลิกภาพ" (FR-17).
  - Market data: "ข้อมูลประกาศงานรวบรวมจากแหล่งที่ไม่เป็นทางการ อาจไม่ครบถ้วน" (PRD §7 Data terms).
  - Role profiles and reference table: "จัดทำโดยทีมผู้พัฒนา" with sources.
  - Match %: "คำนวณจากทักษะที่ตรงกับสายงาน ไม่ใช่การรับประกันการได้งาน".
- **Error messages**: say what happened and what to do next, in one or two sentences: "ไฟล์นี้ไม่ใช่ PDF กรุณาอัปโหลดไฟล์ .pdf ขนาดไม่เกิน 5 MB". Never show stack traces or English error codes as the main text.
- **AI wording**: say "AI" for the product's assistant features (e.g. "แชทกับ AI"); do not name model vendors in the UI.

## 6. Accessibility

- Contrast: WCAG 2.1 AA — 4.5:1 for body text, 3:1 for large text and UI borders. Check every CIBrand pair before use.
- Minimum body font size 16 px; never below 12 px.
- Full keyboard use: visible focus ring (2 px, `--color-primary`, 2 px offset), logical tab order, Esc closes popovers and dialogs.
- Every input has a `<label>`; errors linked with `aria-describedby`; the completeness meter uses `role="progressbar"` with `aria-valuenow`.
- Chat log uses `aria-live="polite"` for new assistant messages; loading states announce "กำลังโหลด".
- Hit targets at least 44 × 44 px on touch (skill chip remove button included).
- Page `lang="th"`.
- Status never shown by colour alone (icons + text for matched/missing, fresh/stale).

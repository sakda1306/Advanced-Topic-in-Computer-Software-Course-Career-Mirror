"use client";

import { ApiError } from "@/lib/api";
import QUESTIONNAIRE from "@/lib/mock/fixtures/questionnaire.json";
import QUESTION_SLOTS from "@/lib/mock/fixtures/question-slots.json";
import { buildProfile, skillName, skillsInText } from "@/lib/mock/profile";

// In-browser mock of the api endpoints the intake page uses (Contract.md 2.1 –
// 2.5, 2.8). Same response shapes and error codes as the real api, with a short
// delay, so the pages cannot tell the difference. State is kept in localStorage,
// so it survives a reload; "รีเซ็ตข้อมูลจำลอง" in the mock toolbar clears it.
//
// Scenarios:
//   - a PDF whose file name contains "scan"  → 422 CV_UNREADABLE
//   - a file that is not a PDF               → 415 CV_INVALID_TYPE
//   - a file over 5 MB                       → 413 CV_TOO_LARGE
//   - any other PDF                          → the sample CV below
//   - chat: answers the open gap question (fills that slot), else picks a
//     route from keywords; the message "quota" uses up today's quota

const STATE_KEY = "cm-mock-state";
const THRESHOLD = 65;
const MAX_CV_BYTES = 5 * 1024 * 1024;

const MOCK_USER = {
  id: "00000000-0000-4000-8000-000000000001",
  email: "kamon@example.com",
  display_name: "กมล",
  created_at: "2026-11-01T10:00:00+07:00",
  is_admin: false,
};

// What the parser would read from a typical student CV.
function sampleCv(filename) {
  return {
    status: "draft",
    filename,
    skills: [
      { name: "Python", skill_id: "python", level: 3, line_no: 12 },
      { name: "SQL", skill_id: "sql", level: 2, line_no: 13 },
      { name: "REST API", skill_id: "rest-api", level: 3, line_no: 14 },
      { name: "Git", skill_id: "git", line_no: 15 },
      { name: "React", skill_id: "react", level: 1, line_no: 16 },
    ],
    education: [
      {
        school: "มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี",
        degree: "ปริญญาตรี",
        field: "วิศวกรรมคอมพิวเตอร์",
        start: "2565",
        end: "กำลังศึกษา",
        line_no: 4,
      },
    ],
    experience: [
      {
        title: "โปรเจกต์ระบบจองห้องเรียน",
        company: "โปรเจกต์รายวิชา",
        start: "2568",
        end: "2568",
        months: 4,
        summary: "พัฒนา REST API ด้วย Python และฐานข้อมูล PostgreSQL",
        line_no: 20,
      },
    ],
    warnings_th: ["ไม่พบระดับของทักษะ Git กรุณาระบุระดับก่อนยืนยัน"],
  };
}

const EMPTY = { cv: null, answers: {}, requestsUsed: 28, chat: [], chatFacts: [], pendingGap: null, profile: null, removedSkills: [] };

function load() {
  try {
    return { ...EMPTY, ...JSON.parse(window.localStorage.getItem(STATE_KEY) || "{}") };
  } catch {
    return { ...EMPTY };
  }
}

function save(state) {
  window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export function resetMockState() {
  window.localStorage.removeItem(STATE_KEY);
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const latency = () => wait(250 + Math.random() * 450);
let requestCounter = 0;

function fail(status, code, message_th, details) {
  requestCounter += 1;
  return new ApiError(status, { code, message_th, details, request_id: `mock-${Date.now().toString(36)}-${requestCounter}` });
}

/* ---------- completeness (mirrors api/app/domain/completeness.py + Design.md 4.1) ---------- */

const SLOTS = [
  ["hard_skills", 35, true, "ทักษะด้านเทคนิคอย่างน้อย 3 รายการ พร้อมระดับ"],
  ["experience", 15, true, "ประสบการณ์ทำงานหรือฝึกงาน (หรือบอกว่ายังไม่มีประสบการณ์)"],
  ["soft_skills", 15, false, "ทักษะด้านการทำงานร่วมกับผู้อื่นอย่างน้อย 3 รายการ พร้อมตัวอย่าง"],
  ["goals", 15, false, "เป้าหมาย: สายงานที่สนใจ เงินเดือนที่ต้องการ หรือพื้นที่ทำงาน"],
  ["work_style", 10, false, "รูปแบบการทำงานที่ชอบ"],
  ["education", 10, false, "ประวัติการศึกษา"],
];

const REQUIRED_QUESTIONS = QUESTIONNAIRE.sections.flatMap((s) => s.questions.filter((q) => !q.optional).map((q) => q.question_id));

function isAnswered(value) {
  if (value === undefined || value === null) return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

function bySlot(answers, slot) {
  return Object.entries(answers).filter(([id, v]) => QUESTION_SLOTS[id] === slot && isAnswered(v));
}

function computeCompleteness(state) {
  const cv = state.cv?.status === "confirmed" ? state.cv : null;
  const a = state.answers;

  const ratedSkills = new Set([
    ...(cv?.skills ?? []).filter((s) => s.level).map((s) => s.skill_id || s.name.toLowerCase()),
    ...(Array.isArray(a.sk_tech_stack) ? a.sk_tech_stack.filter((s) => s.level).map((s) => s.skill_id) : []),
    ...(state.chatFacts ?? []).flatMap((f) => (f.skills ?? []).map((s) => s.skill_id)),
  ]);
  const softHigh = bySlot(a, "soft_skills").filter(([id, v]) => id !== "ss_example" && Number(v) >= 4).length;
  const workStyle = bySlot(a, "work_style").filter(([id]) => id.startsWith("ws_")).length;

  const filled = {
    hard_skills: ratedSkills.size >= 3,
    experience: Boolean(cv?.experience.length) || isAnswered(a.ex_it_experience),
    soft_skills: softHigh >= 3 && isAnswered(a.ss_example),
    goals: bySlot(a, "goals").length > 0,
    work_style: workStyle >= 6,
    education: Boolean(cv?.education.length) || isAnswered(a.ed_level),
  };
  // Facts given in chat fill the slot they answered (Design.md 4.1, gap_question).
  // Hard skills count through ratedSkills above, so they still need 3 with a level.
  for (const f of state.chatFacts ?? []) if (f.slot in filled && f.slot !== "hard_skills") filled[f.slot] = true;

  const slots = SLOTS.map(([slot, points, required]) => ({
    slot,
    filled: filled[slot],
    required,
    points: filled[slot] ? points : 0,
    max_points: points,
  }));
  const score = slots.reduce((sum, s) => sum + s.points, 0);
  const missingRequired = SLOTS.filter(([slot, , required]) => required && !filled[slot]).map(([slot]) => slot);

  const answeredRequired = REQUIRED_QUESTIONS.filter((id) => isAnswered(a[id])).length;
  const anyAnswer = Object.values(a).some(isAnswered);
  const questionnaire = answeredRequired === REQUIRED_QUESTIONS.length ? "done" : anyAnswer ? "partial" : "skipped";
  const canGenerate = (Boolean(cv) || anyAnswer) && missingRequired.length === 0 && score >= THRESHOLD;

  const missing = SLOTS.filter(([slot]) => !filled[slot]).sort((x, y) => Number(y[2]) - Number(x[2]) || y[1] - x[1]);
  return {
    score,
    can_generate: canGenerate,
    slots,
    missing_required: missingRequired,
    inputs: { cv: cv ? "done" : "skipped", questionnaire, chat: canGenerate || missingRequired.length === 0 ? "done" : "needed" },
    missing_th: missing.map(([, , , text]) => text),
  };
}

/* ---------- validation like the api ---------- */

const QUESTIONS = Object.fromEntries(QUESTIONNAIRE.sections.flatMap((s) => s.questions.map((q) => [q.question_id, q])));

function validateAnswer(q, value) {
  const bad = (message) => fail(422, "VALIDATION_ERROR", "ข้อมูลบางช่องไม่ถูกต้อง กรุณาตรวจสอบแล้วลองใหม่", { fields: [{ field: "value", message, code: "invalid" }] });
  const values = new Set((q.options ?? []).map((o) => o.value));
  switch (q.type) {
    case "single":
      if (typeof value !== "string" || !values.has(value)) return bad("not an option");
      break;
    case "multi":
      if (!Array.isArray(value) || value.some((v) => !values.has(v))) return bad("not an option");
      if (q.max_choices && value.length > q.max_choices) return bad(`at most ${q.max_choices} choices`);
      break;
    case "scale":
      if (!Number.isInteger(value) || value < q.scale.min || value > q.scale.max) return bad("out of range");
      break;
    case "skill_checklist":
      if (!Array.isArray(value) || value.some((s) => !values.has(s.skill_id) || ![1, 2, 3, 4].includes(s.level))) return bad("bad skill or level");
      break;
    case "text":
      if (typeof value !== "string" || value.length > 1000) return bad("text too long");
      break;
    default:
      return bad("unknown type");
  }
  return null;
}

/* ---------- endpoints ---------- */

function quota(state) {
  const tomorrow = new Date();
  tomorrow.setHours(24, 0, 0, 0);
  return {
    day: new Date().toISOString().slice(0, 10),
    requests_used: state.requestsUsed,
    requests_limit: 40,
    tokens_used: 61200,
    tokens_limit: 200000,
    reset_at: tomorrow.toISOString(),
    exhausted: state.requestsUsed >= 40,
  };
}

export const mockApi = {
  async me() {
    await latency();
    return { user: MOCK_USER };
  },

  async logout() {
    await latency();
    return { ok: true };
  },

  async quota() {
    await latency();
    return quota(load());
  },

  async getCv() {
    await latency();
    return { cv: load().cv };
  },

  /** Simulates the upload with progress steps, then parses. */
  async uploadCv(file, onProgress) {
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    for (const p of [0.15, 0.4, 0.7, 1]) {
      await wait(180);
      onProgress?.(p);
    }
    if (!isPdf) throw fail(415, "CV_INVALID_TYPE", "ไฟล์นี้ไม่ใช่ PDF กรุณาอัปโหลดไฟล์ .pdf ขนาดไม่เกิน 5 MB");
    if (file.size > MAX_CV_BYTES) throw fail(413, "CV_TOO_LARGE", "ไฟล์ใหญ่เกิน 5 MB กรุณาลดขนาดไฟล์แล้วลองใหม่");
    await wait(900); // parsing
    if (/scan/i.test(file.name)) {
      throw fail(422, "CV_UNREADABLE", "อ่านข้อความจาก PDF นี้ไม่ได้ (อาจเป็นไฟล์สแกน) กรุณาใช้ PDF ที่คัดลอกข้อความได้ หรือข้ามไปทำแบบสอบถามแทน");
    }
    const state = load();
    state.cv = sampleCv(file.name);
    save(state);
    return { cv: state.cv };
  },

  async confirmCv(body) {
    await latency();
    const state = load();
    if (!state.cv) throw fail(404, "NOT_FOUND", "ยังไม่มี CV กรุณาอัปโหลดก่อน");
    state.cv = { ...state.cv, ...body, status: "confirmed", warnings_th: [] };
    save(state);
    return { cv: state.cv, completeness: computeCompleteness(state) };
  },

  async deleteCv() {
    await latency();
    const state = load();
    state.cv = null;
    save(state);
    return { deleted: true, completeness: computeCompleteness(state) };
  },

  async questionnaire() {
    await latency();
    return structuredClone(QUESTIONNAIRE);
  },

  async answers() {
    await latency();
    const { answers } = load();
    const ids = Object.keys(QUESTIONS);
    return { answers, answered: ids.filter((id) => isAnswered(answers[id])).length, total: ids.length };
  },

  async saveAnswer(questionId, value) {
    await wait(200 + Math.random() * 300);
    const q = QUESTIONS[questionId];
    if (!q) throw fail(404, "QUESTION_NOT_FOUND", "ไม่พบคำถามข้อนี้");
    const error = validateAnswer(q, value);
    if (error) throw error;
    const state = load();
    state.answers = { ...state.answers, [questionId]: value };
    save(state);
    return { saved: true, completeness: computeCompleteness(state) };
  },

  async completeness() {
    await latency();
    return computeCompleteness(load());
  },

  async generateProfile() {
    await wait(1500);
    const state = load();
    const c = computeCompleteness(state);
    if (!c.can_generate) {
      throw fail(409, "PROFILE_NOT_READY", "ข้อมูลยังไม่พอสำหรับสร้างโปรไฟล์ กรุณาตอบเพิ่มอีกเล็กน้อย", {
        missing: c.slots.filter((s) => !s.filled).map((s) => s.slot),
        missing_required: c.missing_required,
      });
    }
    if (quota(state).exhausted) throw quotaExceeded(state);
    state.requestsUsed = Math.min(40, state.requestsUsed + 1);
    state.profile = buildProfile(state, { version: (state.profile?.profile_version ?? 0) + 1 });
    save(state);
    return { profile: state.profile, matches: emptyMatches(state.profile) };
  },

  /* ---------- profile (Contract.md 2.5) ---------- */

  async getProfile() {
    await latency();
    return { profile: load().profile };
  },

  /** Remove button: no LLM call, works when the quota is used up (FR-30). */
  async removeSkill(skillId) {
    await latency();
    const state = load();
    const profile = requireProfile(state);
    const skill = [...profile.hard_skills, ...profile.soft_skills].find((s) => s.skill_id === skillId);
    if (!skill) throw fail(404, "SKILL_NOT_FOUND", "ไม่พบทักษะนี้ในโปรไฟล์");
    state.removedSkills = [
      ...state.removedSkills.filter((s) => s.skill_id !== skillId),
      { skill_id: skillId, name_th: skill.name_th, removed_at: new Date().toISOString(), skill },
    ];
    state.profile = withSkills(profile, (list) => list.filter((s) => s.skill_id !== skillId));
    save(state);
    return { profile: state.profile, matches: emptyMatches(state.profile) };
  },

  async restoreSkill(skillId) {
    await latency();
    const state = load();
    const profile = requireProfile(state);
    const entry = state.removedSkills.find((s) => s.skill_id === skillId);
    if (!entry) throw fail(404, "SKILL_NOT_FOUND", "ไม่พบทักษะนี้ในรายการที่ลบไว้");
    state.removedSkills = state.removedSkills.filter((s) => s.skill_id !== skillId);
    state.profile = withSkills(profile, (list, kind) =>
      kind === entry.skill.kind ? [...list, entry.skill].sort((x, y) => y.level - x.level) : list,
    );
    save(state);
    return { profile: state.profile, matches: emptyMatches(state.profile) };
  },

  async removedSkills() {
    await latency();
    return { skills: load().removedSkills.map(({ skill_id, name_th, removed_at }) => ({ skill_id, name_th, removed_at })) };
  },

  /* ---------- chat (Contract.md 2.4) ---------- */

  async chatHistory() {
    await latency();
    return { messages: load().chat.slice(-50) };
  },

  async chat(message) {
    const text = typeof message === "string" ? message.trim() : "";
    if (!text || text.length > 1000) {
      await latency();
      throw fail(422, "VALIDATION_ERROR", "ข้อความต้องยาว 1–1,000 ตัวอักษร", { fields: [{ field: "message", message: "length 1-1000", code: "invalid" }] });
    }
    const state = load();
    if (text.toLowerCase() === "quota") state.requestsUsed = 40;
    if (quota(state).exhausted) {
      save(state);
      await latency();
      throw quotaExceeded(state);
    }
    await wait(900 + Math.random() * 900); // the LLM call
    state.requestsUsed += 1;
    const now = new Date().toISOString();
    const userMsg = { message_id: newId(), role: "user", text, created_at: now };

    const reply = answer(state, text);
    const assistantMsg = { message_id: newId(), role: "assistant", text: reply.answer, route: reply.route, sources: reply.sources, created_at: now };
    state.chat = [...state.chat, userMsg, assistantMsg].slice(-100);
    save(state);
    return {
      message_id: assistantMsg.message_id,
      answer: reply.answer,
      route: reply.route,
      sources: reply.sources,
      edit_proposal: null,
      completeness: computeCompleteness(state),
      tokens_used: reply.route === "decline" ? 0 : 400 + Math.round(Math.random() * 600),
    };
  },
};

/* ---------- helpers for profile and chat ---------- */

const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);

function quotaExceeded(state) {
  return fail(429, "QUOTA_EXCEEDED", "วันนี้คุณใช้โควตาถาม AI ครบแล้ว ระบบจะรีเซ็ตเวลา 00:00 น. ระหว่างนี้ยังลบทักษะหรือแก้ข้อมูลในโปรไฟล์ได้ตามปกติ", {
    reset_at: quota(state).reset_at,
  });
}

function requireProfile(state) {
  if (!state.profile) throw fail(404, "PROFILE_NOT_FOUND", "ยังไม่มีโปรไฟล์ กรุณาสร้างโปรไฟล์ในขั้นที่ 1 ก่อน");
  return state.profile;
}

function withSkills(profile, change) {
  return {
    ...profile,
    profile_version: profile.profile_version + 1,
    updated_at: new Date().toISOString(),
    hard_skills: change(profile.hard_skills, "hard"),
    soft_skills: change(profile.soft_skills, "soft"),
  };
}

// The role results page (4 Nov) fills this in; until then matches are empty.
const emptyMatches = (profile) => ({ profile_version: profile.profile_version, threshold: 60, below_threshold: false, roles: [] });

// gap_question asks about missing required slots first, then the slot with the most points.
const GAP_QUESTIONS = {
  hard_skills: "คุณใช้ภาษาโปรแกรมหรือเครื่องมืออะไรบ้าง และคิดว่าแต่ละอย่างอยู่ระดับไหน (1 เริ่มต้น – 4 เชี่ยวชาญ) เช่น “Python 3, SQL 2, Git 2”",
  experience: "เล่าประสบการณ์ทำงาน ฝึกงาน หรือโปรเจกต์ที่ผ่านมาสั้น ๆ ได้ไหม คุณรับผิดชอบส่วนไหน ถ้ายังไม่มีประสบการณ์ก็บอกได้เลย",
  soft_skills: "เล่าตัวอย่างที่คุณทำงานร่วมกับคนอื่นได้ไหม เช่น แก้ปัญหาในทีม หรืออธิบายงานให้คนอื่นเข้าใจ",
  goals: "คุณสนใจสายงานไหน และคาดหวังเงินเดือนประมาณเท่าไร",
  work_style: "คุณชอบทำงานคนเดียวหรือกับทีม และชอบงานที่มีขั้นตอนชัดเจนหรือยืดหยุ่นมากกว่ากัน",
  education: "คุณเรียนจบหรือกำลังเรียนระดับไหน สาขาอะไร",
};

function nextGap(state) {
  const c = computeCompleteness(state);
  const order = [...c.slots].sort((x, y) => Number(y.required) - Number(x.required) || y.max_points - x.max_points);
  return order.find((s) => !s.filled)?.slot ?? null;
}

function answer(state, text) {
  const lower = text.toLowerCase();

  // An answer to the open gap question becomes a fact with chat evidence.
  // A question back ("…ไหม", "…อะไร", "?") is not an answer to the open gap question.
  const isQuestion = /[?？]|ไหม|มั้ย|อะไร|เท่าไร|เท่าไหร่|อย่างไร|ยังไง|ไหน|หรือเปล่า/.test(text);
  if (state.pendingGap && text.length >= 4 && !isQuestion) {
    const slot = state.pendingGap;
    const skills = slot === "hard_skills" ? skillsInText(text) : [];
    state.chatFacts = [...state.chatFacts, { id: newId(), slot, text, skills }];
    state.pendingGap = nextGap(state);
    const thanks =
      slot === "hard_skills" && skills.length
        ? `ขอบคุณครับ บันทึกทักษะ ${skills.map((s) => `${skillName(s.skill_id)} ระดับ ${s.level}`).join(", ")} ไว้แล้ว`
        : "ขอบคุณครับ บันทึกข้อมูลนี้ไว้แล้ว";
    if (!state.pendingGap) {
      return { route: "gap_question", sources: [], answer: `${thanks} ตอนนี้ข้อมูลครบพอแล้ว กด “สร้างโปรไฟล์” ได้เลย หรือจะเล่าเพิ่มก็ได้ครับ` };
    }
    return { route: "gap_question", sources: [], answer: `${thanks}\n\n${GAP_QUESTIONS[state.pendingGap]}` };
  }

  if (/ทำนาย|ดวง|การเมือง|หวย/.test(text)) {
    return { route: "decline", sources: [], answer: "ขอโทษครับ เรื่องนี้อยู่นอกขอบเขตที่ช่วยได้ ลองถามเรื่องทักษะ สายงาน หรือเงินเดือนในสาย IT ได้เลย" };
  }

  if (/เงินเดือน|salary/.test(lower)) {
    return {
      route: "salary",
      sources: [
        { n: 1, evidence_id: "salary-ref", label_th: "ตารางอ้างอิงเงินเดือนของทีม (ข้อมูลกรุงเทพฯ)" },
        { n: 2, evidence_id: "salary-jobthai", label_th: "JobThai (ประกาศงาน) อัปเดต 1 พ.ย. 2569" },
      ],
      answer:
        "ช่วงเงินเดือนเริ่มต้นของนักพัฒนาซอฟต์แวร์ในกรุงเทพฯ อยู่ราว ฿25,000 – ฿35,000 / เดือน (ฐานเงินเดือน) [1] ส่วนประกาศงานที่ระบุเงินเดือนส่วนใหญ่อยู่ในช่วงใกล้เคียงกัน [2] ตัวเลขนี้เป็นช่วงอ้างอิง ไม่ใช่เงินเดือนที่แน่นอน",
    };
  }

  if (state.profile && /ทักษะ|เก่ง|skill|จุดแข็ง/.test(lower)) {
    const top = state.profile.hard_skills.slice(0, 2);
    if (top.length) {
      return {
        route: "skill_assessment",
        sources: top.map((s, i) => ({ n: i + 1, evidence_id: s.evidence_ids[0], label_th: state.profile.evidence[s.evidence_ids[0]]?.label_th ?? "หลักฐาน" })),
        answer: `จากข้อมูลของคุณ ทักษะที่เด่นที่สุดคือ ${top.map((s, i) => `${s.name_th} ระดับ ${s.level} [${i + 1}]`).join(" และ ")} ถ้าอยากเพิ่มโอกาส ลองต่อยอดด้วยโปรเจกต์ที่ใช้ทักษะเหล่านี้ร่วมกัน`,
      };
    }
  }

  const gap = nextGap(state);
  if (gap && !state.profile) {
    state.pendingGap = gap;
    return { route: "gap_question", sources: [], answer: `เพื่อให้โปรไฟล์ครบขึ้น ขอถามเพิ่มอีกนิดครับ\n\n${GAP_QUESTIONS[gap]}` };
  }

  return {
    route: "clarify",
    sources: [],
    answer: "ช่วยบอกเพิ่มอีกนิดได้ไหมครับว่าอยากรู้เรื่องไหน เช่น ทักษะที่ควรพัฒนา สายงานที่เหมาะ หรือช่วงเงินเดือน",
  };
}

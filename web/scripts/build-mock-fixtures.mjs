// Builds the mock API fixtures from the shared /data files, in the exact shapes
// the api returns (Contract.md 2.3). Run after /data changes:
//   npm run mock:fixtures
// The web image is built from ./web only, so the output is committed.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, "..", "..", "data");
const outDir = join(here, "..", "lib", "mock", "fixtures");

const read = (name) => JSON.parse(readFileSync(join(dataDir, name), "utf8"));
const questionnaire = read("questionnaire.json");
const skills = read("skills.json");
const roles = read("roles.json");

const roleList = Array.isArray(roles) ? roles : roles.roles;

// options_source is resolved by the api: hard skills from skills.json, roles from roles.json.
const OPTION_SOURCES = {
  "skills.json": skills
    .filter((s) => s.type === "hard")
    .map((s) => ({ value: s.id, label_th: s.name_th }))
    .sort((a, b) => a.label_th.localeCompare(b.label_th, "th")),
  "roles.json": roleList.map((r) => ({ value: r.id, label_th: r.name_th })),
};

// File-only fields are never sent to the web (Contract.md 2.3).
const FILE_ONLY = new Set(["slot", "trait", "skill_id", "source_ids", "options_source"]);

function toApiQuestion(q) {
  const out = {};
  for (const [key, value] of Object.entries(q)) if (!FILE_ONLY.has(key)) out[key] = value;
  if (q.options_source) out.options = OPTION_SOURCES[q.options_source];
  return out;
}

const response = {
  version: questionnaire.version,
  sections: questionnaire.sections.map((s) => ({
    id: s.id,
    title_th: s.title_th,
    questions: s.questions.map(toApiQuestion),
  })),
  attribution: {
    text_th:
      "คำถามพัฒนาโดยทีมผู้พัฒนา โดยดัดแปลงจากมิติ Work Styles และ Skills ของ O*NET® (USDOL/ETA, CC BY 4.0) ซึ่ง USDOL/ETA ไม่ได้รับรองเนื้อหานี้",
    sources: questionnaire.sources
      .filter((s) => s.url)
      .map(({ title, url, license, license_url, attribution }) => ({ title, url, license, license_url, attribution })),
  },
};

// The mock completeness needs to know which slot each question fills.
const slots = Object.fromEntries(
  questionnaire.sections.flatMap((s) => s.questions.map((q) => [q.question_id, q.slot])),
);

// Skill names for the CV review (name, English name), keyed by skill id.
const skillNames = Object.fromEntries(skills.map((s) => [s.id, { th: s.name_th, en: s.name_en, type: s.type }]));

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "questionnaire.json"), `${JSON.stringify(response, null, 1)}\n`);
writeFileSync(join(outDir, "question-slots.json"), `${JSON.stringify(slots, null, 1)}\n`);
writeFileSync(join(outDir, "skills.json"), `${JSON.stringify(skillNames)}\n`);
console.log(
  `mock fixtures: ${response.sections.length} sections, ${Object.keys(slots).length} questions, ${Object.keys(skillNames).length} skills`,
);

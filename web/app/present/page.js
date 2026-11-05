import {
  ArrowDown,
  ArrowRight,
  BookOpenText,
  Bot,
  Calculator,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  FileText,
  FileWarning,
  Filter,
  Gauge,
  GitMerge,
  HelpCircle,
  KeyRound,
  Layers,
  ListChecks,
  MessageSquare,
  Quote,
  RefreshCw,
  Route,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Target,
  TimerOff,
  TriangleAlert,
  UserRound,
  Workflow,
} from "lucide-react";
import { DotGrid } from "@/components/motion/dot-grid";
import { ShaderBackground } from "@/components/ui/shader-background";
import { Columns, GrowBar, UsageMeter } from "@/components/present/present-visuals";
import { PresentTimeline } from "@/components/present/present-timeline";
import { CHAPTERS } from "@/components/present/chapters";

// Presentation page /present: CareerMirror for the course presentation, sections
// 1–6 of docs/Presentation.md (problem, how AI fits, AI vs no AI, techniques,
// evaluation, problems). Not linked from anywhere and not indexed. Every number
// comes from docs/Design.md, e2e/runs and the test runs; numbers not measured yet
// are marked "รอวัด".

export const metadata = {
  title: "นำเสนอโปรเจกต์",
  robots: { index: false, follow: false },
};

const BRAND_SILK = ["#0a1820", "#173d55", "#6fbfae", "#0f2230"];

/* ---------- shared pieces ---------- */

function SectionHeading({ no, eyebrow, title, children }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <p className="text-tiny font-semibold tracking-[0.12em] text-accent uppercase">
        <span className="tabular mr-2 rounded-full bg-primary-subtle px-2 py-0.5 text-text">{no}</span>
        {eyebrow}
      </p>
      <h2 className="mt-3 text-h1 font-bold text-text md:text-[40px] md:leading-[56px]">{title}</h2>
      {children && <p className="mt-3 text-body text-text-muted">{children}</p>}
    </div>
  );
}

function Tile({ icon: Icon, title, className = "", children }) {
  return (
    <div className={`flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm ${className}`}>
      {title && (
        <h3 className="mb-4 flex items-center gap-2 text-small font-semibold text-text">
          {Icon && <Icon className="size-4 text-text-muted" strokeWidth={1.75} aria-hidden="true" />}
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

function Big({ value, unit, caption }) {
  return (
    <div>
      <p className="tabular font-[family-name:var(--font-latin-first)] text-[40px] leading-none font-semibold tracking-tight text-text">
        {value}
        {unit && <span className="ml-1 text-h3 font-medium text-text-muted">{unit}</span>}
      </p>
      {caption && <p className="mt-2 text-tiny text-text-muted">{caption}</p>}
    </div>
  );
}

function Pending({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-warning px-2.5 py-0.5 text-tiny font-semibold text-warning">
      <Clock className="size-3.5" strokeWidth={2} aria-hidden="true" />
      {children}
    </span>
  );
}

/* ---------- hero ---------- */

/** A soft dark glow behind centred text, so it stays readable over the bright silk folds. */
function TextGlow() {
  return <div className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_50%_45%,rgb(12_25_34/0.7),transparent_75%)]" aria-hidden="true" />;
}

function Hero() {
  return (
    <section className="bg-brand-gradient relative isolate overflow-hidden">
      <ShaderBackground colors={BRAND_SILK} className="absolute inset-0 -z-10" />
      <div className="hero-scrim absolute inset-0 -z-10" aria-hidden="true" />
      <DotGrid vertical="top" className="-z-10" />
      <TextGlow />
      <div className="mx-auto max-w-[1120px] px-4 pt-20 pb-28 text-center md:px-6 md:pt-28 md:pb-36">
        <p className="text-small font-semibold text-hero-muted">Advanced Topics in Computer Software · RMUTT</p>
        <h1 className="mx-auto mt-4 max-w-4xl text-[34px] leading-[50px] font-bold text-hero-fg md:text-[52px] md:leading-[72px]">
          CareerMirror
          <br />
          นำ AI มาใช้เฉพาะงานที่ต้องใช้ภาษา
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-body text-hero-muted">
          ตัวเลขและการตัดสินใจคำนวณด้วย Python ทุกข้อความที่ AI เขียนต้องมีหลักฐานกำกับ
        </p>
        <ol className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-2">
          {CHAPTERS.map((c, i) => (
            <li key={c}>
              <a
                href={`#s${i + 1}`}
                data-transition="off"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-hero-muted/30 bg-white/5 px-4 text-small text-hero-fg backdrop-blur transition-colors duration-150 hover:bg-white/15"
              >
                <span className="tabular font-semibold text-hero-cta">{i + 1}</span>
                {c}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- 1. problem and goal ---------- */

const PROBLEMS = [
  { Icon: HelpCircle, title: "ไม่รู้ว่าทักษะที่มีเหมาะกับสายงานไหน", body: "สาย IT มีหลายตำแหน่ง แต่ละตำแหน่งต้องการทักษะและระดับต่างกัน" },
  { Icon: Bot, title: "ให้ LLM ให้คะแนนตรง ๆ ไม่ได้", body: "ถามซ้ำได้คะแนนต่างกัน และตรวจไม่ได้ว่าคะแนนมาจากไหน" },
  { Icon: Target, title: "จึงตั้งหลักไว้ 3 ข้อ", body: "คะแนนคำนวณได้ซ้ำ อธิบายได้ และทุกข้อความชี้กลับไปที่หลักฐานของผู้ใช้" },
];

const FLOW = [
  { Icon: FileText, title: "ข้อมูล 3 ทาง", body: "CV · แบบสอบถาม · แชท" },
  { Icon: UserRound, title: "โปรไฟล์มีหลักฐาน", body: "ทักษะ ระดับ ความชอบในการทำงาน" },
  { Icon: Layers, title: "เทียบ 26 สายงาน IT", body: "เปอร์เซ็นต์ความตรงจาก Python" },
  { Icon: Sparkles, title: "ก้าวถัดไป", body: "ช่องว่าง เงินเดือน ตลาดงานกรุงเทพฯ" },
];

function ProblemSection() {
  return (
    <section id="s1" className="mx-auto w-full max-w-[1120px] scroll-mt-20 px-4 py-20 md:px-6">
      <SectionHeading no="1" eyebrow="ปัญหาและเป้าหมาย" title="รู้จักตัวเองก่อนเลือกสายงาน IT">
        ขอบเขต: สายงาน IT เท่านั้น · ข้อมูลงานในกรุงเทพฯ · หน้าเว็บภาษาไทย
      </SectionHeading>
      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {PROBLEMS.map(({ Icon, title, body }) => (
          <li key={title} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary text-on-primary">
              <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-h3 font-semibold text-text">{title}</h3>
            <p className="mt-1 text-small text-text-muted">{body}</p>
          </li>
        ))}
      </ul>
      <ol className="mt-8 grid gap-3 md:grid-cols-4">
        {FLOW.map(({ Icon, title, body }, i) => (
          <li key={title} className="relative flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm">
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-primary">
              <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-small font-semibold text-text">{title}</span>
              <span className="block text-tiny text-text-muted">{body}</span>
            </span>
            {i < FLOW.length - 1 && (
              <ArrowRight className="absolute top-1/2 -right-3 z-10 hidden size-5 -translate-y-1/2 rounded-full bg-bg text-accent md:block" strokeWidth={2} aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- 2. how AI fits ---------- */

const PATH = [
  { Icon: UserRound, label: "web", sub: "Next.js" },
  { Icon: Server, label: "API", sub: "FastAPI" },
  { Icon: Route, label: "AI Router", sub: "เลือกเส้นทาง" },
  { Icon: Search, label: "RAG · ข้อมูลภายนอก · คะแนน Python", sub: "เตรียมข้อเท็จจริง" },
  { Icon: Bot, label: "LLM", sub: "เขียนถ้อยคำ" },
  { Icon: ShieldCheck, label: "ตรวจหลักฐาน", sub: "parse_claims" },
];

const LIMITS = [
  { value: "30", unit: "คำขอ/นาที" },
  { value: "1,000", unit: "คำขอ/วัน" },
  { value: "8,000", unit: "tokens/นาที" },
  { value: "200,000", unit: "tokens/วัน" },
];

function ArchitectureSection() {
  return (
    <section id="s2" className="scroll-mt-20 py-20">
      <div className="mx-auto w-full max-w-[1120px] px-4 md:px-6">
        <SectionHeading no="2" eyebrow="AI อยู่ตรงไหนในเว็บแอป" title="AI อยู่ปลายทาง เขียนจากข้อเท็จจริงที่เตรียมไว้">
          ทุกส่วนของ AI อยู่ใน API ทั้ง Router การค้นความรู้ และการเรียก LLM
        </SectionHeading>

        <div className="mt-12 rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <h3 className="mb-5 flex items-center gap-2 text-small font-semibold text-text">
            <Workflow className="size-4 text-text-muted" strokeWidth={1.75} aria-hidden="true" />
            เส้นทางของหนึ่งคำขอ
          </h3>
          <ol className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center">
            {PATH.map(({ Icon, label, sub }, i) => (
              <li key={label} className="flex flex-col items-stretch gap-2 lg:flex-1 lg:flex-row lg:items-center">
                <span
                  className={`flex flex-1 items-center gap-3 rounded-xl border px-3 py-3 ${
                    label === "LLM" ? "border-accent bg-primary-subtle" : "border-border bg-bg/60"
                  }`}
                >
                  <Icon className="size-5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-small leading-5 font-semibold text-text">{label}</span>
                    <span className="block text-tiny text-text-muted">{sub}</span>
                  </span>
                </span>
                {i < PATH.length - 1 && (
                  <>
                    <ArrowRight className="hidden size-4 shrink-0 text-text-muted lg:block" strokeWidth={2} aria-hidden="true" />
                    <ArrowDown className="mx-auto size-4 shrink-0 text-text-muted lg:hidden" strokeWidth={2} aria-hidden="true" />
                  </>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <Tile icon={Layers} title="3 container">
            <ul className="space-y-2.5">
              {[
                ["web", "Next.js · หน้าเว็บภาษาไทย"],
                ["api", "FastAPI · Router · RAG · LLM · คะแนน"],
                ["db", "Postgres · ผู้ใช้ โปรไฟล์ โควตา แคชงาน"],
              ].map(([name, body]) => (
                <li key={name} className="flex items-center gap-3 rounded-xl border border-border bg-bg/60 px-3 py-2.5">
                  <code className="w-10 text-small font-semibold text-accent">{name}</code>
                  <span className="text-small text-text">{body}</span>
                </li>
              ))}
            </ul>
          </Tile>
          <Tile icon={Cpu} title="2 โมเดลตามงาน (Groq)">
            <div className="space-y-3">
              <div className="rounded-xl border border-accent/50 bg-primary-subtle/50 p-3">
                <code className="text-small font-semibold text-text">openai/gpt-oss-120b</code>
                <p className="mt-1 text-tiny text-text-muted">ข้อความที่ผู้ใช้อ่าน: โปรไฟล์ เหตุผลการจับคู่ ก้าวถัดไป</p>
              </div>
              <div className="rounded-xl border border-border bg-bg/60 p-3">
                <code className="text-small font-semibold text-text">qwen/qwen3.8-27b</code>
                <p className="mt-1 text-tiny text-text-muted">งานโครงสร้าง: Router แก้โปรไฟล์ ดึงข้อเท็จจริง และเป็นโมเดลสำรอง</p>
              </div>
              <p className="text-tiny text-text-muted">model id อยู่ใน env เปลี่ยนได้โดยไม่แก้โค้ด</p>
            </div>
          </Tile>
          <Tile icon={Gauge} title="ข้อจำกัดที่กำหนดการออกแบบ">
            <div className="grid grid-cols-2 gap-2">
              {LIMITS.map((l) => (
                <div key={l.unit} className="rounded-xl border border-border bg-bg/60 px-3 py-2.5">
                  <p className="tabular text-h3 font-semibold text-text">{l.value}</p>
                  <p className="text-tiny text-text-muted">{l.unit}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-tiny text-text-muted">
              ต่อโมเดล · โควตาต่อผู้ใช้ <span className="font-semibold text-text">40 คำขอ · 40,000 tokens</span> ต่อวัน ตรวจก่อนเรียก LLM ทุกครั้ง
            </p>
          </Tile>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. AI vs no AI ---------- */

const KIND = {
  llm: { label: "LLM", cls: "bg-[var(--color-series-1)] text-white" },
  rag: { label: "LLM + RAG", cls: "bg-[var(--color-series-3)] text-white" },
  part: { label: "บางส่วน", cls: "border border-[var(--color-series-2)] text-[var(--color-series-2)]" },
  none: { label: "ไม่ใช้ AI", cls: "border border-border text-text-muted" },
};

const FEATURES = [
  { name: "แยกเส้นทางข้อความในแชท", kind: "part", how: "Guard → Keyword rules → LLM classifier → clarify เมื่อมั่นใจต่ำกว่า 0.6" },
  { name: "ดึงข้อเท็จจริงจากคำตอบในแชท", kind: "llm", how: "JSON มีโครงสร้าง แล้ว Python ตรวจว่าทักษะอยู่ในข้อความจริง" },
  { name: "สรุปประสบการณ์ และสิ่งที่ควรสำรวจ", kind: "llm", how: "เขียนจาก facts เท่านั้น ทุกข้อความต้องอ้าง evidence id" },
  { name: "เหตุผลการจับคู่ และก้าวถัดไป", kind: "rag", how: "learning path จาก RAG · เขียน 1 ข้อต่อ 1 ช่องว่างที่คำนวณแล้ว" },
  { name: "ตอบคำถามเรื่องทักษะ จุดบอด", kind: "rag", how: "ตรวจด้วย parse_claims ถ้าไม่ผ่านใช้ข้อความที่คำนวณแทน" },
  { name: "แก้โปรไฟล์ผ่านแชท", kind: "llm", how: "แปลงเป็นการแก้แบบมีโครงสร้าง ผู้ใช้ต้องกดยืนยันก่อนบันทึก" },
  { name: "อ่าน CV", kind: "part", how: "กฎ + taxonomy ก่อน ใช้ LLM เมื่อยังมีโควตา ผู้ใช้ยืนยันทุกครั้ง" },
  { name: "เปอร์เซ็นต์ความตรง", kind: "none", how: "สูตร Python 0.70 · 0.15 · 0.10 · 0.05" },
  { name: "ระดับทักษะ เดือนประสบการณ์ ความครบถ้วน", kind: "none", how: "กฎใน Python" },
  { name: "เงินเดือน และตลาดงาน", kind: "none", how: "ตารางอ้างอิง + แคช JobThai · LLM ไม่เขียนอะไร" },
  { name: "ตัวละคร แดชบอร์ด โควตา", kind: "none", how: "โค้ดปกติ" },
];

const WEIGHTS = [
  { label: "ทักษะที่ต้องมี", w: 0.7, color: "var(--color-series-1)" },
  { label: "ทักษะที่ควรมี", w: 0.15, color: "var(--color-series-2)" },
  { label: "ทักษะการทำงาน", w: 0.1, color: "var(--color-series-3)" },
  { label: "ความชอบ", w: 0.05, color: "var(--color-border)" },
];

function AiMatrixSection() {
  const counts = FEATURES.reduce((a, f) => ({ ...a, [f.kind]: (a[f.kind] ?? 0) + 1 }), {});
  return (
    <section id="s3" className="bg-section-wash scroll-mt-20 py-20">
      <div className="mx-auto w-full max-w-[1120px] px-4 md:px-6">
        <SectionHeading no="3" eyebrow="ฟีเจอร์ไหนใช้ AI" title="AI อธิบาย แต่ไม่ตัดสิน">
          ตัวเลขทุกตัวที่ผู้ใช้เห็นมาจาก Python ป้อนข้อมูลเดิมได้ผลเดิมทุกครั้ง
        </SectionHeading>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {Object.entries(KIND).map(([k, v]) => (
            <span key={k} className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-small font-semibold ${v.cls}`}>
              {v.label}
              <span className="tabular rounded-full bg-black/10 px-2 text-tiny">{counts[k] ?? 0}</span>
            </span>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
            <ul className="divide-y divide-border">
              {FEATURES.map((f) => (
                <li key={f.name} className="grid gap-1 px-5 py-3 sm:grid-cols-[minmax(0,15rem)_auto_minmax(0,1fr)] sm:items-center sm:gap-4">
                  <span className="text-small font-semibold text-text">{f.name}</span>
                  <span className={`w-fit rounded-full px-2.5 py-0.5 text-tiny font-semibold whitespace-nowrap ${KIND[f.kind].cls}`}>{KIND[f.kind].label}</span>
                  <span className="text-tiny text-text-muted">{f.how}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <Tile icon={Calculator} title="สูตรเปอร์เซ็นต์ความตรง (ไม่ใช้ AI)">
              <div className="flex h-4 gap-0.5 overflow-hidden rounded-full" role="img" aria-label="น้ำหนัก 70 15 10 5 เปอร์เซ็นต์">
                {WEIGHTS.map((w) => (
                  <span key={w.label} className="h-full first:rounded-l-full last:rounded-r-full" style={{ width: `${w.w * 100}%`, background: w.color }} />
                ))}
              </div>
              <ul className="mt-3 space-y-1.5">
                {WEIGHTS.map((w) => (
                  <li key={w.label} className="flex items-center justify-between text-small">
                    <span className="flex items-center gap-2 text-text">
                      <span className="size-2.5 rounded-sm" style={{ background: w.color }} aria-hidden="true" />
                      {w.label}
                    </span>
                    <span className="tabular font-semibold text-text">{Math.round(w.w * 100)}%</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-tiny text-text-muted">แสดงสายงานที่ได้ ≥ 60% สูงสุด 5 สายงาน</p>
            </Tile>
            <Tile icon={ShieldCheck} title="LLM ไม่เขียนลงโปรไฟล์เอง">
              <p className="text-small text-text">
                คำขอแก้ไขผ่านแชทกลายเป็นการ์ด <span className="font-semibold">“เดิม → ใหม่”</span> ผู้ใช้ต้องกดยืนยันก่อน ข้อเสนอหมดอายุใน 15 นาที
              </p>
            </Tile>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. techniques ---------- */

const ROUTER_LAYERS = [
  { name: "Guard", body: "ว่าง ยาวเกิน prompt injection นอกขอบเขต", llm: false, width: "100%" },
  { name: "Keyword rules", body: "รูปแบบภาษาไทยและอังกฤษ ความมั่นใจ 0.9", llm: false, width: "86%" },
  { name: "LLM classifier", body: "ตอบเป็นโครงสร้าง ใช้ ~260 tokens ต่อครั้ง", llm: true, width: "70%" },
  { name: "Clarify", body: "มั่นใจต่ำกว่า 0.6 ถามกลับแทนการเดา", llm: false, width: "54%" },
];

const CLAIM_STEPS = [
  { Icon: ListChecks, title: "facts + evidence id", body: "บรรทัด CV · ข้อแบบสอบถาม · ข้อความแชท" },
  { Icon: Bot, title: "LLM เขียน", body: "JSON แต่ละข้อความอ้าง id" },
  { Icon: Filter, title: "parse_claims", body: "ตัด id ที่ไม่มีจริง และตัวเลขที่ไม่อยู่ใน facts" },
  { Icon: Quote, title: "ผู้ใช้เห็น [n]", body: "กดดูที่มาได้ทุกข้อความ" },
];

const RELIABILITY = [
  { Icon: RefreshCw, title: "ลองใหม่ 1 ครั้ง", body: "เมื่อเจอ 429 · error · network" },
  { Icon: GitMerge, title: "สลับโมเดลสำรอง", body: "qwen3.8-27b" },
  { Icon: TriangleAlert, title: "แจ้งเป็นภาษาไทย", body: "และคืนโควตา" },
];

function TechniquesSection() {
  return (
    <section id="s4" className="mx-auto w-full max-w-[1120px] scroll-mt-20 px-4 py-20 md:px-6">
      <SectionHeading no="4" eyebrow="เทคนิค" title="เรียงจากถูกไปแพง และตรวจทุกคำตอบ" />

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <Tile icon={Route} title="AI Router 4 ชั้น">
          <ol className="flex flex-col items-center gap-1.5">
            {ROUTER_LAYERS.map((l, i) => (
              <li
                key={l.name}
                className={`rounded-xl px-4 py-2.5 text-center ${l.llm ? "bg-[var(--color-series-1)] text-white" : "border border-border bg-bg/60 text-text"}`}
                style={{ width: l.width }}
              >
                <span className="text-small font-semibold">
                  {i + 1}. {l.name}
                </span>
                <span className={`block text-tiny ${l.llm ? "text-white/85" : "text-text-muted"}`}>{l.body}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-tiny text-text-muted">ชั้นบนไม่ใช้ LLM จึงไม่กินโควตา · ข้อความที่ตรงกฎหลายเส้นทางส่งให้ LLM ตัดสิน</p>
        </Tile>

        <Tile icon={Search} title="Hybrid RAG">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="space-y-2">
              <div className="rounded-xl border border-border bg-bg/60 p-3">
                <p className="text-small font-semibold text-text">BM25</p>
                <p className="text-tiny text-text-muted">ตัดคำไทยด้วย pythainlp · จับชื่อทักษะตรงตัว</p>
              </div>
              <div className="rounded-xl border border-border bg-bg/60 p-3">
                <p className="text-small font-semibold text-text">FAISS vector</p>
                <p className="text-tiny text-text-muted">multilingual-e5-base · จับความหมาย</p>
              </div>
            </div>
            <ArrowRight className="size-5 text-accent" strokeWidth={2} aria-hidden="true" />
            <div className="rounded-xl border border-accent bg-primary-subtle/60 p-3 text-center">
              <p className="text-small font-semibold text-text">RRF k = 60</p>
              <p className="text-tiny text-text-muted">รวมอันดับ + กรองตามสายงานและหมวด</p>
            </div>
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-border bg-bg/60 p-3">
            <BookOpenText className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
            <p className="text-tiny text-text-muted">
              คลังความรู้ที่ทีมเขียน: 26 ไฟล์สายงาน + บันทึก work style และ soft skill · ตัด chunk ตามหัวข้อ · ใช้เสริมคำตอบเท่านั้น ถ้า index ยังไม่พร้อมก็ตอบจากข้อมูลอื่นได้
            </p>
          </div>
        </Tile>

        <Tile icon={ShieldCheck} title="กันการแต่งข้อมูล" className="lg:col-span-2">
          <ol className="grid gap-3 md:grid-cols-4">
            {CLAIM_STEPS.map(({ Icon, title, body }, i) => (
              <li key={title} className="relative rounded-xl border border-border bg-bg/60 p-4">
                <span className="tabular absolute top-3 right-3 text-tiny font-semibold text-text-muted">{i + 1}</span>
                <Icon className="size-5 text-accent" strokeWidth={1.75} aria-hidden="true" />
                <p className="mt-2 text-small font-semibold text-text">{title}</p>
                <p className="mt-0.5 text-tiny text-text-muted">{body}</p>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-small text-text">
            สัดส่วนประโยคที่ parse_claims ตัดทิ้งในการสร้างโปรไฟล์จริง <Pending>รอวัด</Pending>
          </div>
        </Tile>

        <Tile icon={TimerOff} title="ความทนทาน">
          <ol className="flex items-stretch gap-2">
            {RELIABILITY.map(({ Icon, title, body }, i) => (
              <li key={title} className="flex flex-1 items-center gap-2">
                <span className="flex-1 rounded-xl border border-border bg-bg/60 p-3">
                  <Icon className="size-4 text-accent" strokeWidth={1.75} aria-hidden="true" />
                  <span className="mt-1.5 block text-small font-semibold text-text">{title}</span>
                  <span className="block text-tiny text-text-muted">{body}</span>
                </span>
                {i < RELIABILITY.length - 1 && <ArrowRight className="size-4 shrink-0 text-text-muted" strokeWidth={2} aria-hidden="true" />}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-tiny text-text-muted">งาน Router มี timeout ต่อครั้ง 7 วินาทีแล้วลองใหม่ทันที เป้าหมายรวมไม่เกิน 15 วินาที</p>
        </Tile>

        <Tile icon={KeyRound} title="การตัดสินใจหลัก">
          <ul className="space-y-2">
            {[
              ["คะแนนใน Python", "ไม่ให้ LLM ให้คะแนน: คงที่ อธิบายได้ ถูกกว่า"],
              ["เทียบกับโปรไฟล์ 26 สายงาน", "ไม่เทียบกับประกาศงานทีละประกาศที่ข้อมูลไม่นิ่ง"],
              ["ค้นในตัว API", "BM25 + FAISS แทนการเพิ่ม vector database อีกตัว"],
              ["ผู้ใช้ยืนยันการแก้ไข", "LLM เสนอได้ แต่ไม่บันทึกเอง"],
            ].map(([t, b]) => (
              <li key={t} className="flex items-start gap-2 text-small">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={2} aria-hidden="true" />
                <span>
                  <span className="font-semibold text-text">{t}</span> <span className="text-text-muted">· {b}</span>
                </span>
              </li>
            ))}
          </ul>
        </Tile>
      </div>
    </section>
  );
}

/* ---------- 5. evaluation ---------- */

function EvaluationSection() {
  return (
    <section id="s5" className="bg-section-wash scroll-mt-20 py-20">
      <div className="mx-auto w-full max-w-[1120px] px-4 md:px-6">
        <SectionHeading no="5" eyebrow="การวัดผล" title="วัดผลด้วยชุดข้อมูลภาษาไทย">
          ชุดที่ใช้ปรับระบบแยกจากชุดที่ใช้วัด เมื่อชุดไหนถูกใช้แก้ระบบแล้ว ก็เขียนชุดใหม่มาวัดแทน
        </SectionHeading>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Tile icon={Route} title="ความถูกต้องของ AI Router · ชุด held-out ภาษาไทย 34 ข้อ">
            <Columns
              max={100}
              items={[
                { label: "ชุดแรก (ก่อนแก้กฎ)", value: 91, text: "91%" },
                { label: "ชุดที่สอง (หลังแก้กฎ)", value: 97, text: "97%", strong: true },
              ]}
            />
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              {[
                ["Guard", "1/1"],
                ["Rules", "4/7 → 6/7"],
                ["LLM", "26/26"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border bg-bg/60 px-2 py-2">
                  <p className="text-tiny text-text-muted">{k}</p>
                  <p className="tabular text-small font-semibold text-text">{v}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-tiny text-text-muted">ข้อผิดพลาดทั้งหมดมาจาก keyword rules ไม่ใช่จาก LLM · รันด้วย qwen3.8-27b วันที่ 4 พ.ย.</p>
          </Tile>

          <Tile icon={Search} title="การค้นของ RAG · golden set ภาษาไทย 30 คำถาม">
            <ul className="space-y-3">
              <GrowBar label="Hybrid hit@3" value={0.93} text="0.93" strong mark={0.8} />
              <GrowBar label="Vector hit@3" value={0.9} text="0.90" mark={0.8} delay={90} />
              <GrowBar label="BM25 hit@3" value={0.83} text="0.83" mark={0.8} delay={180} />
              <GrowBar label="Hybrid hit@1" value={0.7} text="0.70" delay={270} />
            </ul>
            <p className="mt-4 text-tiny text-text-muted">เส้นประ = เกณฑ์ 0.8 · ผ่านเกณฑ์ จึงใช้ e5-base ต่อ ไม่ต้องเปลี่ยนเป็น bge-m3 ที่ใหญ่กว่า · hybrid ดีกว่าใช้วิธีเดียว</p>
          </Tile>

          <Tile icon={UserRound} title="ปรับเกณฑ์การจับคู่ · โปรไฟล์ตัวอย่าง 3 แบบ">
            <div className="space-y-4">
              {[
                { who: "นักศึกษา", rows: [["นักพัฒนาเว็บ", 69], ["Full-stack", 59], ["Frontend", 55]] },
                { who: "Full-stack developer", rows: [["Full-stack", 86]] },
                { who: "ML developer", rows: [["AI engineer", 68], ["ML engineer", 66], ["Data scientist", 62]] },
              ].map((p) => (
                <div key={p.who}>
                  <p className="mb-1.5 text-tiny font-semibold text-text">{p.who}</p>
                  <ul className="space-y-1.5">
                    {p.rows.map(([role, pct], i) => (
                      <GrowBar key={role} label={role} value={pct} max={100} text={`${pct}%`} strong={pct >= 60} mark={60} delay={i * 80} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-4 text-tiny text-text-muted">เส้นประ = เกณฑ์ 60% · สายงานของตัวเองติด 3 อันดับแรก · สายงานที่ไม่เกี่ยวต่ำกว่า 30% · นักศึกษาเห็น 1 สายงานที่เกณฑ์ 60</p>
          </Tile>

          <div className="grid gap-5 sm:grid-cols-2">
            <Tile icon={CheckCircle2} title="End-to-end API">
              <Big value="78/78" caption="กลุ่ม A–F ผ่านทั้งหมด (รัน 4 พ.ย.)" />
            </Tile>
            <Tile icon={ListChecks} title="Unit + integration tests">
              <Big value="976" caption="pytest ผ่านทั้งหมด" />
            </Tile>
            <Tile icon={Gauge} title="ต้นทุนทั้งชุดทดสอบ e2e" className="sm:col-span-2">
              <div className="space-y-3">
                <UsageMeter label="คำขอ" used={6} limit={40} unit="ครั้ง" />
                <UsageMeter label="tokens" used={6861} limit={40000} unit="" />
              </div>
            </Tile>
            <Tile icon={Clock} title="ความเร็ว" className="sm:col-span-2">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-border bg-bg/60 px-2 py-2">
                  <p className="tabular text-h3 font-semibold text-text">1.2 วิ</p>
                  <p className="text-tiny text-text-muted">ถามเรื่องทักษะ</p>
                </div>
                <div className="rounded-xl border border-border bg-bg/60 px-2 py-2">
                  <p className="tabular text-h3 font-semibold text-text">0.3 วิ</p>
                  <p className="text-tiny text-text-muted">ปฏิเสธเรื่องนอกขอบเขต</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-warning px-2 py-2">
                  <Pending>รอวัด</Pending>
                  <p className="mt-1 text-tiny text-text-muted">p50 / p95 ของ LLM (เป้า ≤ 15 วิ)</p>
                </div>
              </div>
            </Tile>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-info/40 bg-surface p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-small font-semibold text-text">
            <TriangleAlert className="size-4 text-info" strokeWidth={2} aria-hidden="true" />
            ข้อจำกัดของการวัดผล
          </h3>
          <ul className="mt-3 grid gap-2 text-small text-text md:grid-cols-2">
            <li>• ชุดทดสอบยังเล็ก และทีมเขียนเอง ตัวเลขจริงอาจต่ำกว่านี้</li>
            <li>• ชุดที่ใช้ปรับ (47 ข้อ) แยกจากชุดที่ใช้วัด</li>
            <li>• ยังไม่มีการทดสอบกับผู้ใช้จริง</li>
            <li>• ยังไม่ได้ประเมินคุณภาพคำอธิบายจาก LLM ด้วยคนหรือ LLM-as-judge</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ---------- 6. problems ---------- */

const ISSUES = [
  {
    Icon: Server,
    problem: "Groq จำกัด 8,000 tokens ต่อนาที",
    found: "เจอ 429 ระหว่างทดสอบ แก้โปรไฟล์ 10 ครั้งติดกันก็ถูกจำกัด",
    fix: "retry · โมเดลสำรอง · โควตาต่อผู้ใช้ · prompt ไม่เกิน 5K tokens",
  },
  {
    Icon: TimerOff,
    problem: "LLM timeout ประมาณ 1%",
    found: "ReadTimeout แบบสุ่ม 4 จาก ~380 ครั้ง",
    fix: "timeout สั้นต่อครั้ง และลองใหม่ทันทีสำหรับงาน Router",
  },
  {
    Icon: Bot,
    problem: "LLM แต่งข้อความหรือตัวเลข",
    found: "ประโยคที่ไม่มีหลักฐานรองรับ",
    fix: "parse_claims ตรวจ evidence id และตัวเลขทุกประโยค",
  },
  {
    Icon: Database,
    problem: "ข้อมูลงานไม่เป็นทางการ",
    found: "Apify ดึงได้ครั้งละ 20 ประกาศ พึ่งพาแบบสดไม่ได้",
    fix: "แคชต่อสายงาน อัปเดตทุก 7 วัน แสดงวันที่และแหล่งที่มา",
  },
  {
    Icon: FileWarning,
    problem: "PDF แบบสแกน",
    found: "ไม่มีข้อความให้อ่าน",
    fix: "แจ้งเป็นภาษาไทย และยังใช้แบบสอบถามได้",
  },
  {
    Icon: Target,
    problem: "นักศึกษาเห็นแค่ 1 สายงานที่เกณฑ์ 60",
    found: "การปรับเกณฑ์ไม่ผ่าน 1 ข้อ",
    fix: "คงเกณฑ์ไว้ แสดงสายงานที่ใกล้ที่สุดพร้อมสิ่งที่ต้องเติม",
  },
  {
    Icon: Clock,
    problem: "เดือนประสบการณ์ไม่ตรงหลังแก้ฟอร์ม CV",
    found: "เดือนมาจากการอ่าน CV ครั้งแรกเท่านั้น",
    fix: "คำนวณใหม่จากวันที่ทุกครั้งที่บันทึก",
  },
];

function ProblemsSection() {
  return (
    <section id="s6" className="mx-auto w-full max-w-[1120px] scroll-mt-20 px-4 py-20 md:px-6">
      <SectionHeading no="6" eyebrow="ปัญหาและวิธีแก้" title="สิ่งที่เจอระหว่างทาง และวิธีที่แก้" />

      <div className="mt-12 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Tile icon={MessageSquare} title="Embedding ใช้จับคู่ชื่อทักษะไม่ได้">
          <p className="mb-4 text-small text-text-muted">ทดสอบ multilingual-e5-base กับ 25 คำ: คำที่ไม่เกี่ยวได้คะแนนพอ ๆ กับคู่ที่ถูก จึงตั้ง threshold แยกไม่ได้</p>
          <ul className="space-y-3">
            <GrowBar label="ReactJS → React (ถูก)" value={0.84} text="0.84" strong />
            <GrowBar label="ทำอาหาร (ไม่เกี่ยว)" value={0.83} text="0.83" delay={90} />
            <GrowBar label="ขับรถ (ไม่เกี่ยว)" value={0.83} text="0.83" delay={180} />
          </ul>
          <div className="pt-5">
            <p className="flex items-start gap-2 rounded-xl border border-success/40 bg-success/10 p-3 text-small text-text">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={2} aria-hidden="true" />
              ใช้ taxonomy + ชื่อเรียกอื่น (alias) แทน · ทักษะที่ไม่รู้จักเก็บเป็นคำของผู้ใช้
            </p>
          </div>
        </Tile>

        <ul className="grid gap-3 sm:grid-cols-2">
          {ISSUES.map(({ Icon, problem, found, fix }) => (
            <li key={problem} className="flex flex-col rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <p className="flex items-start gap-2 text-small font-semibold text-text">
                <Icon className="mt-0.5 size-4 shrink-0 text-warning" strokeWidth={2} aria-hidden="true" />
                {problem}
              </p>
              <p className="mt-1 text-tiny text-text-muted">{found}</p>
              <p className="mt-auto flex items-start gap-1.5 pt-3 text-tiny font-medium text-text">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" strokeWidth={2} aria-hidden="true" />
                {fix}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------- closing ---------- */

function Closing() {
  return (
    <section className="bg-brand-gradient relative isolate overflow-hidden">
      <ShaderBackground colors={BRAND_SILK} className="absolute inset-0 -z-10" />
      <div className="hero-scrim absolute inset-0 -z-10" aria-hidden="true" />
      <DotGrid vertical="top" className="-z-10" />
      <TextGlow />
      <div className="mx-auto max-w-[1120px] px-4 py-20 text-center md:px-6">
        <Sparkles className="mx-auto size-8 text-hero-muted" strokeWidth={1.5} aria-hidden="true" />
        <h2 className="mx-auto mt-4 max-w-3xl text-h1 font-bold text-hero-fg md:text-[40px] md:leading-[56px]">
          AI แยกเจตนา ดึงข้อเท็จจริง และเขียนคำอธิบาย
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-body text-hero-muted">คะแนนและตัวเลขทั้งหมดคำนวณด้วย Python ทุกข้อความมีหลักฐาน และวัดผลทั้ง Router และ RAG ด้วยชุดข้อมูลภาษาไทย</p>
      </div>
    </section>
  );
}

export default function PresentPage() {
  return (
    <>
      <PresentTimeline />
      <Hero />
      <ProblemSection />
      <ArchitectureSection />
      <AiMatrixSection />
      <TechniquesSection />
      <EvaluationSection />
      <ProblemsSection />
      <Closing />
    </>
  );
}

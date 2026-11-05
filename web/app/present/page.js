import {
  Activity,
  ArrowDown,
  ArrowRight,
  Ban,
  BookOpenText,
  Bot,
  Calculator,
  CheckCircle2,
  Clock,
  Cpu,
  Database,
  EyeOff,
  FileText,
  FileWarning,
  Filter,
  Gauge,
  GitMerge,
  HelpCircle,
  KeyRound,
  Layers,
  LifeBuoy,
  ListChecks,
  Lock,
  MessageSquare,
  MousePointerClick,
  Quote,
  RefreshCw,
  Route,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Split,
  Target,
  TimerOff,
  ToggleRight,
  TriangleAlert,
  UserCheck,
  UserRound,
  Workflow,
  Zap,
} from "lucide-react";
import { DotGrid } from "@/components/motion/dot-grid";
import { ShaderBackground } from "@/components/ui/shader-background";
import { Columns, GrowBar, UsageMeter } from "@/components/present/present-visuals";
import { PresentTimeline } from "@/components/present/present-timeline";
import { Explain, ExplainLayer } from "@/components/present/explain";
import { CHAPTERS } from "@/components/present/chapters";

// Presentation page /present: CareerMirror for the course presentation. Chapters:
// problem, how AI fits, AI vs no AI, techniques, Jev in the router, multi-step workflows,
// security and guardrails, evaluation and reliability, problems (docs/Presentation.md, with the
// workflow and security chapters drawn from Design.md §3–4 and the api code).
// Not linked from anywhere and not indexed. Every number
// comes from docs/Design.md, e2e/runs and the test runs; numbers not measured yet
// are marked as pending.
// Copy rule: every Thai text is a full semi-formal sentence (subject, verb, object).
// Slides lead with visuals (icons, numbers, charts) and a one-line label; every longer
// sentence lives in the block's click-to-open card (`tip`, explain.js).
// Type is larger than the rest of the site (.present-type in globals.css), for reading
// while presenting.

export const metadata = {
  title: "การนำเสนอโปรเจกต์ CareerMirror",
  robots: { index: false, follow: false },
};

const BRAND_SILK = ["#0a1820", "#173d55", "#6fbfae", "#0f2230"];

/* ---------- shared pieces ---------- */

/** Chapter heading. The subtitle (`children`) is read in the click card, not on the slide. */
function SectionHeading({ no, eyebrow, title, tip, children }) {
  const detail = [children, tip].filter(Boolean);
  return (
    <Explain tip={detail.length ? detail : undefined} title={title} className="mx-auto max-w-4xl rounded-2xl p-2 text-center">
      <p className="text-tiny font-semibold tracking-[0.12em] text-accent uppercase">
        <span className="tabular mr-2 rounded-full bg-primary-subtle px-2 py-0.5 text-text">{no}</span>
        {eyebrow}
      </p>
      <h2 className="mt-3 text-h1 font-bold text-text md:text-[44px] md:leading-[62px]">{title}</h2>
    </Explain>
  );
}

/** A slide panel. `note` is a footnote read in the click card, after `tip`. */
function Tile({ icon: Icon, title, tip, note, className = "", children }) {
  const detail = [tip, note].filter(Boolean);
  return (
    <Explain tip={detail.length ? detail : undefined} title={title} className={`flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm ${className}`}>
      {title && (
        <h3 className="mb-4 flex items-center gap-2 text-small font-semibold text-text">
          {Icon && <Icon className="size-5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />}
          {title}
        </h3>
      )}
      {children}
    </Explain>
  );
}

function Big({ value, unit, caption }) {
  return (
    <div>
      <p className="tabular font-[family-name:var(--font-latin-first)] text-[48px] leading-none font-semibold tracking-tight text-text">
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

/** Points with a check mark: the title on the slide, the body and tip in its click card. */
function CheckList({ items, className = "space-y-2", Icon = CheckCircle2, tone = "text-success" }) {
  return (
    <ul className={className}>
      {items.map(({ t, b, tip }) => (
        <Explain as="li" key={t} tip={[b, tip].filter(Boolean)} title={t} className="flex items-center gap-3 rounded-xl border border-border bg-bg/60 backdrop-blur-md p-3 text-small">
          <Icon className={`size-6 shrink-0 ${tone}`} strokeWidth={1.75} aria-hidden="true" />
          <span className="font-semibold text-text">{t}</span>
        </Explain>
      ))}
    </ul>
  );
}

/** Steps in order, numbered, three to a row on wide screens; `strong` marks the step to look at. */
function FlowChain({ steps }) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {steps.map(({ Icon, label, sub, tip, strong }, i) => (
        <Explain
          as="li"
          key={label}
          tip={[sub, tip].filter(Boolean)}
          title={label}
          className={`relative flex items-center gap-4 rounded-xl border p-4 ${strong ? "border-accent bg-primary-subtle" : "border-border bg-bg/60 backdrop-blur-md"}`}
        >
          <span className="tabular absolute top-2 right-3 text-tiny font-semibold text-text-muted">{i + 1}</span>
          <span className={`inline-flex size-12 shrink-0 items-center justify-center rounded-xl ${strong ? "bg-primary text-on-primary" : "bg-primary-subtle text-accent"}`}>
            <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <span className="min-w-0 pr-4 text-small font-semibold text-text">{label}</span>
        </Explain>
      ))}
    </ol>
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
        <h1 className="mx-auto mt-4 max-w-4xl text-[38px] leading-[56px] font-bold text-hero-fg md:text-[58px] md:leading-[80px]">
          CareerMirror
          <br />
          ใช้ AI เฉพาะงานที่ต้องใช้ภาษาเท่านั้น
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-body text-hero-muted">
          ระบบคำนวณตัวเลขและการตัดสินใจทั้งหมดด้วย Python และทุกข้อความที่ AI เขียนต้องมีหลักฐานกำกับ
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
        <p className="mt-8 inline-flex items-center gap-2 text-tiny text-hero-muted">
          <MousePointerClick className="size-5" strokeWidth={1.75} aria-hidden="true" />
          ผู้ชมสามารถคลิกที่กล่องใดก็ได้เพื่ออ่านคำอธิบายโดยละเอียด
        </p>
      </div>
    </section>
  );
}

/* ---------- 1. problem and goal ---------- */

const PROBLEMS = [
  {
    Icon: HelpCircle,
    title: "ผู้ใช้ไม่ทราบว่าทักษะของตนเหมาะกับสายงานใด",
    body: "สายงาน IT มีหลายตำแหน่ง และแต่ละตำแหน่งต้องการทักษะในระดับที่แตกต่างกัน",
    tip: "นักศึกษาและผู้เริ่มทำงานมักรู้จักชื่อตำแหน่งงาน แต่ไม่ทราบว่าแต่ละตำแหน่งต้องการทักษะใดและต้องการในระดับใด ระบบจึงเก็บทักษะของผู้ใช้พร้อมระดับ แล้วนำไปเทียบกับโปรไฟล์ของ 26 สายงาน IT เพื่อให้ผู้ใช้เห็นว่าตนใกล้กับสายงานใดมากที่สุดและยังขาดทักษะใดบ้าง",
  },
  {
    Icon: Bot,
    title: "ทีมไม่สามารถให้ LLM ให้คะแนนผู้ใช้โดยตรงได้",
    body: "LLM ให้คะแนนต่างกันเมื่อถูกถามซ้ำ และผู้ใช้ไม่สามารถตรวจสอบได้ว่าคะแนนมาจากที่ใด",
    tip: "LLM สร้างคำตอบด้วยการสุ่มตามความน่าจะเป็น คำถามเดียวกันจึงอาจได้คะแนนต่างกันในแต่ละครั้ง นอกจากนี้ LLM ไม่สามารถแสดงที่มาของคะแนนในรูปแบบที่ตรวจสอบได้ หากระบบใช้คะแนนจาก LLM ผู้ใช้จะไม่สามารถเชื่อถือผลลัพธ์หรือนำผลไปเปรียบเทียบข้ามช่วงเวลาได้",
  },
  {
    Icon: Target,
    title: "ทีมจึงกำหนดหลักการออกแบบไว้ 3 ข้อ",
    body: "ระบบต้องคำนวณคะแนนซ้ำได้ผลเดิม ระบบต้องอธิบายที่มาของคะแนนได้ และทุกข้อความต้องชี้กลับไปยังหลักฐานของผู้ใช้",
    tip: "หลักข้อแรกทำให้ข้อมูลชุดเดิมได้คะแนนเดิมทุกครั้ง หลักข้อที่สองทำให้ผู้ใช้เห็นว่าคะแนนแต่ละส่วนมาจากทักษะใด และหลักข้อที่สามทำให้ทุกประโยคที่ AI เขียนมีหมายเลขอ้างอิงไปยังบรรทัดใน CV คำตอบในแบบสอบถาม หรือข้อความในแชท หลักทั้ง 3 ข้อนี้กำหนดการออกแบบของทุกส่วนที่ปรากฏในบทถัดไป",
  },
];

const FLOW = [
  {
    Icon: FileText,
    title: "ผู้ใช้ป้อนข้อมูลได้ 3 ช่องทาง",
    body: "ผู้ใช้สามารถอัปโหลด CV ตอบแบบสอบถาม หรือพูดคุยผ่านแชทได้",
    tip: "ช่องทางทั้งสามเสริมกัน CV ให้ข้อมูลประสบการณ์และทักษะที่ผู้ใช้เขียนไว้ แบบสอบถามให้ระดับทักษะที่ผู้ใช้ประเมินเองและความชอบในการทำงาน ส่วนแชทจะถามคำถามเพิ่มเติมเฉพาะข้อมูลที่ยังขาด ระบบคำนวณความครบถ้วนของข้อมูล และอนุญาตให้สร้างโปรไฟล์เมื่อข้อมูลเพียงพอแล้ว",
  },
  {
    Icon: UserRound,
    title: "ระบบสร้างโปรไฟล์ที่มีหลักฐานกำกับ",
    body: "โปรไฟล์ระบุทักษะ ระดับทักษะ และความชอบในการทำงานของผู้ใช้",
    tip: "ข้อมูลทุกชิ้นในโปรไฟล์มี evidence id ที่ชี้กลับไปยังแหล่งที่มา ระบบเลือกระดับทักษะตามลำดับที่กำหนดไว้ คือกฎที่อ่านจาก CV ก่อน จากนั้นจึงเป็นระดับที่ผู้ใช้ประเมินในแบบสอบถาม และระดับล่าสุดที่ผู้ใช้บอกในแชท",
  },
  {
    Icon: Layers,
    title: "ระบบเทียบโปรไฟล์กับ 26 สายงาน IT",
    body: "Python คำนวณเปอร์เซ็นต์ความตรงของแต่ละสายงาน",
    tip: "ระบบเทียบทักษะของผู้ใช้กับทักษะที่แต่ละสายงานต้องมีและควรมี รวมถึงทักษะการทำงานและความชอบในการทำงาน แล้วรวมผลเป็นเปอร์เซ็นต์ด้วยสูตรถ่วงน้ำหนักที่ตายตัว ผู้ชมสามารถดูรายละเอียดของสูตรได้ในบทที่ 3",
  },
  {
    Icon: Sparkles,
    title: "ระบบแนะนำก้าวถัดไปให้ผู้ใช้",
    body: "ผู้ใช้เห็นทักษะที่ยังขาด ช่วงเงินเดือน และสภาพตลาดงานในกรุงเทพฯ",
    tip: "Python คำนวณทักษะที่ยังขาดจากส่วนต่างระหว่างระดับของผู้ใช้กับระดับที่สายงานต้องการ AI เขียนคำแนะนำหนึ่งข้อต่อหนึ่งช่องว่าง โดยอ้างอิงเส้นทางการเรียนรู้จากคลังความรู้ ส่วนเงินเดือนและตลาดงานมาจากตารางอ้างอิงและแคชประกาศงาน ดังนั้น LLM จึงไม่ได้เขียนตัวเลขเหล่านี้เอง",
  },
];

function ProblemSection() {
  return (
    <section id="s1" className="mx-auto w-full max-w-[1120px] scroll-mt-20 px-4 py-20 md:px-6">
      <SectionHeading
        no="1"
        eyebrow="โปรเจกต์นี้แก้ปัญหาอะไร"
        title="ผู้ใช้ควรรู้จักตนเองก่อนเลือกสายงาน IT"
        tip="CareerMirror ช่วยให้ผู้ใช้เห็นภาพสะท้อนของตนเองจากหลักฐานที่ผู้ใช้ให้มา ทีมจำกัดขอบเขตไว้ที่สายงาน IT และตลาดงานในกรุงเทพฯ เพื่อให้ข้อมูลอ้างอิงมีความลึกและตรวจสอบได้ภายในเวลาพัฒนาที่มีอยู่"
      >
        โปรเจกต์นี้ครอบคลุมเฉพาะสายงาน IT ใช้ข้อมูลงานในกรุงเทพฯ และแสดงผลเป็นภาษาไทย
      </SectionHeading>
      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {PROBLEMS.map(({ Icon, title, body, tip }) => (
          <Explain as="li" key={title} tip={[body, tip]} title={title} className="flex flex-col items-center rounded-2xl border border-border bg-surface p-6 text-center shadow-sm">
            <span className="inline-flex size-20 items-center justify-center rounded-2xl bg-primary text-on-primary">
              <Icon className="size-10" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-h3 font-semibold text-text">{title}</h3>
          </Explain>
        ))}
      </ul>
      <ol className="mt-8 grid gap-3 md:grid-cols-4">
        {FLOW.map(({ Icon, title, body, tip }, i) => (
          <Explain as="li" key={title} tip={[body, tip]} title={title} className="relative flex flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-5 text-center shadow-sm">
            <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-subtle text-primary">
              <Icon className="size-7" strokeWidth={1.5} aria-hidden="true" />
            </span>
            <span className="text-small font-semibold text-text">{title}</span>
            {i < FLOW.length - 1 && (
              <ArrowRight className="absolute top-1/2 -right-3 z-10 hidden size-5 -translate-y-1/2 rounded-full bg-bg text-accent md:block" strokeWidth={2} aria-hidden="true" />
            )}
          </Explain>
        ))}
      </ol>
    </section>
  );
}

/* ---------- 2. how AI fits ---------- */

const PATH = [
  {
    Icon: UserRound,
    label: "web",
    sub: "Next.js แสดงหน้าเว็บภาษาไทย",
    tip: "หน้าเว็บสร้างด้วย Next.js และเรียก API ผ่าน proxy ฝั่ง server ดังนั้น cookie ที่ใช้ยืนยันตัวตนจึงอยู่เฉพาะฝั่ง server หน้าเว็บไม่ได้ติดต่อกับ LLM โดยตรงในทุกกรณี",
  },
  {
    Icon: Server,
    label: "API",
    sub: "FastAPI รับคำขอและตรวจสิทธิ์",
    tip: "API เป็นจุดเดียวที่ตรวจสิทธิ์ ตรวจรูปแบบข้อมูล และตรวจโควตาก่อนเรียก LLM ทุกครั้ง การรวมการควบคุมไว้ที่ API ทำให้ทีมจัดการทั้งความปลอดภัยและต้นทุนได้จากจุดเดียว",
  },
  {
    Icon: Route,
    label: "AI Router",
    sub: "Router เลือกเส้นทางให้ข้อความ",
    tip: "Router อ่านข้อความของผู้ใช้แล้วตัดสินว่าข้อความนั้นถามเรื่องใด เช่น ทักษะ เงินเดือน หรือการแก้โปรไฟล์ Router ใช้กฎที่ไม่ต้องเรียก LLM ก่อน และเรียกโมเดลเฉพาะเมื่อกฎตัดสินไม่ได้ เมื่อทีมเปิดใช้ Jev ระบบจะถาม Jev ก่อน และถาม Groq เมื่อ Jev ไม่แน่ใจ ผู้ชมสามารถดูรายละเอียดได้ในบทที่ 4 และบทที่ 5",
  },
  {
    Icon: Search,
    label: "RAG · ข้อมูลภายนอก · คะแนน Python",
    sub: "ระบบเตรียมข้อเท็จจริงก่อนส่งให้ LLM",
    tip: "ก่อนเรียก LLM ระบบรวบรวมข้อเท็จจริงที่เส้นทางนั้นต้องใช้ ได้แก่ ความรู้จากคลังเอกสารผ่าน RAG ข้อมูลเงินเดือนและตลาดงาน และคะแนนที่ Python คำนวณไว้แล้ว LLM จึงไม่ต้องคิดตัวเลขหรือข้อเท็จจริงขึ้นเอง",
  },
  {
    Icon: Bot,
    label: "LLM",
    sub: "LLM เรียบเรียงข้อความ",
    strong: true,
    tip: "LLM ได้รับเฉพาะข้อเท็จจริงที่ระบบเตรียมไว้ และมีหน้าที่เรียบเรียงข้อความภาษาไทยให้ผู้ใช้อ่านเข้าใจง่าย LLM ต้องตอบเป็น JSON ที่มีโครงสร้าง และทุกข้อความต้องอ้าง evidence id",
  },
  {
    Icon: ShieldCheck,
    label: "ระบบตรวจหลักฐาน",
    sub: "parse_claims ตรวจทุกข้อความ",
    tip: "parse_claims ตรวจว่า evidence id ที่ LLM อ้างมีอยู่จริง และตรวจว่าตัวเลขในประโยคตรงกับข้อเท็จจริง ระบบตัดประโยคที่ไม่ผ่านออก และหากไม่เหลือประโยคใดผ่าน ระบบจะแสดงข้อความที่คำนวณจากข้อมูลแทน",
  },
];

const CONTAINERS = [
  { name: "web", tech: "Next.js", body: "Next.js แสดงหน้าเว็บภาษาไทยให้ผู้ใช้", tip: "container นี้รันหน้าเว็บและ proxy ฝั่ง server ซึ่งส่งต่อคำขอไปยัง API โดยไม่เปิดเผย cookie ยืนยันตัวตนให้ JavaScript ในเบราว์เซอร์" },
  { name: "api", tech: "FastAPI", body: "FastAPI รวม Router, RAG, LLM และการคำนวณคะแนนไว้ในที่เดียว", tip: "container นี้เป็นหัวใจของระบบ ทุกส่วนที่เกี่ยวกับ AI และการคำนวณทำงานอยู่ที่นี่ รวมถึงดัชนีค้นหาของ RAG ที่เก็บใน SQLite และโหลดเข้าหน่วยความจำ" },
  { name: "db", tech: "Postgres", body: "Postgres เก็บข้อมูลผู้ใช้ โปรไฟล์ โควตา และแคชประกาศงาน", tip: "ฐานข้อมูลเก็บโปรไฟล์พร้อมหลักฐานของแต่ละข้อความ การใช้โควตาในแต่ละวัน และแคชตลาดงานต่อสายงาน ระบบไม่เก็บไฟล์ PDF ที่ผู้ใช้อัปโหลด" },
];

const MODELS = [
  {
    id: "openai/gpt-oss-120b",
    role: "ข้อความที่ผู้ใช้อ่าน",
    body: "โมเดลนี้เขียนข้อความที่ผู้ใช้อ่าน ได้แก่ โปรไฟล์ เหตุผลการจับคู่ และก้าวถัดไป",
    tip: "โมเดลขนาดใหญ่เขียนภาษาไทยได้เป็นธรรมชาติกว่า ทีมจึงใช้โมเดลนี้กับข้อความที่ผู้ใช้อ่านโดยตรง ซึ่งเป็นส่วนที่คุณภาพของภาษามีผลต่อความเชื่อถือมากที่สุด",
    strong: true,
  },
  {
    id: "qwen/qwen3.8-27b",
    role: "งานเชิงโครงสร้างและโมเดลสำรอง",
    body: "โมเดลนี้ทำงานเชิงโครงสร้าง ได้แก่ Router การแก้โปรไฟล์ และการดึงข้อเท็จจริง และยังทำหน้าที่เป็นโมเดลสำรองด้วย",
    tip: "งานเชิงโครงสร้างต้องการคำตอบสั้นในรูป JSON มากกว่าภาษาที่สวยงาม โมเดลที่เล็กกว่าจึงตอบได้เร็วกว่าและใช้ tokens น้อยกว่า เมื่อโมเดลหลักเรียกไม่สำเร็จ ระบบจะสลับมาใช้โมเดลนี้แทน",
  },
  {
    id: "jev-latest · TypeSafe",
    role: "เลือกเส้นทางใน Router",
    body: "Jev เลือกเส้นทางของข้อความใน Router เป็นด่านแรกเมื่อทีมเปิดใช้งาน และ Groq ตรวจซ้ำเมื่อ Jev ไม่แน่ใจ",
    tip: "Jev ไม่ได้ทำงานผ่าน Groq แต่เรียก API ของ TypeSafe โดยตรง ระบบใช้ Jev กับงานเดียว คือการเลือกเส้นทางของข้อความ เพื่อลดจำนวนครั้งที่ต้องเรียก Groq ผู้ชมสามารถดูรายละเอียดได้ในบทที่ 5",
  },
];

const LIMITS = [
  { value: "30", unit: "คำขอ / นาที", caption: "Groq รับคำขอได้ไม่เกินจำนวนนี้ต่อนาที", tip: "ข้อจำกัดนี้ทำให้ระบบต้องลดจำนวนครั้งที่เรียก LLM ต่อหนึ่งการกระทำของผู้ใช้ Router จึงใช้กฎก่อนเรียก LLM" },
  { value: "1,000", unit: "คำขอ / วัน", caption: "Groq รับคำขอได้ไม่เกินจำนวนนี้ต่อวัน", tip: "เมื่อทีมแบ่งจำนวนนี้ให้ผู้ใช้คนละ 40 คำขอต่อวัน ระบบจะรองรับผู้ใช้ที่ใช้งานเต็มโควตาได้ประมาณ 25 คนต่อวัน" },
  { value: "8,000", unit: "tokens / นาที", caption: "Groq รับ tokens ได้ไม่เกินจำนวนนี้ต่อนาที", tip: "ข้อจำกัดนี้เข้มงวดที่สุด เพราะการสร้างโปรไฟล์หนึ่งครั้งอาจใช้หลายพัน tokens ทีมจึงจำกัด prompt ไม่ให้เกิน 5,000 tokens และเลือกไม่ใช้ agent ที่วนเรียก LLM หลายรอบ" },
  { value: "200,000", unit: "tokens / วัน", caption: "Groq รับ tokens ได้ไม่เกินจำนวนนี้ต่อวัน", tip: "ทีมตั้งโควตาผู้ใช้ไว้ที่ 40,000 tokens ต่อวัน เพื่อไม่ให้ผู้ใช้เพียงไม่กี่คนใช้ปริมาณรวมของทั้งวันจนหมด" },
];

const JEV_PLACE = [
  {
    Icon: MessageSquare,
    label: "ผู้ใช้ส่งข้อความในแชท",
    sub: "API ส่งข้อความเข้าสู่ AI Router",
    tip: "ผู้ใช้ที่มีโปรไฟล์แล้วพิมพ์คำถามในแชท API ตรวจสิทธิ์และโควตา แล้วส่งข้อความเข้าสู่ Router เพื่อเลือกว่าข้อความนั้นควรไปที่ handler ใด",
  },
  {
    Icon: ShieldAlert,
    label: "Guard",
    sub: "Guard ปฏิเสธข้อความที่ไม่ปลอดภัยหรืออยู่นอกขอบเขต",
    tip: "Guard ทำงานก่อน Jev เสมอ ข้อความที่มี prompt injection หรือถามนอกขอบเขตจึงไม่ถูกส่งออกไปยัง TypeSafe",
  },
  {
    Icon: Filter,
    label: "Keyword rules",
    sub: "กฎตัดสินข้อความที่ใช้คำชัดเจนโดยไม่เรียกโมเดล",
    tip: "ข้อความที่ตรงกับกฎเพียงเส้นทางเดียวจะถูกตัดสินที่ชั้นนี้ทันที Jev จึงได้รับเฉพาะข้อความที่กฎตัดสินไม่ได้",
  },
  {
    Icon: Zap,
    label: "Jev เลือกเส้นทาง",
    sub: "Jev เลือก 1 จาก 11 เส้นทางภายใน 3 วินาที",
    tip: "Jev ของ TypeSafe รับข้อความและบทสนทนาล่าสุด แล้วตอบชื่อเส้นทางพร้อมค่าความมั่นใจ ระบบให้ Jev ตอบเพียงครั้งเดียวโดยไม่ลองใหม่ เพราะ Groq พร้อมรับช่วงต่อทันที",
    strong: true,
  },
  {
    Icon: Cpu,
    label: "Groq ตรวจซ้ำเมื่อจำเป็น",
    sub: "qwen3.8-27b ตัดสินเมื่อ Jev ไม่แน่ใจหรือเรียกไม่สำเร็จ",
    tip: "เมื่อ Jev ตอบ clarify มีความมั่นใจต่ำกว่า 0.4 หรือเรียกไม่สำเร็จ ระบบจะส่งข้อความเดิมให้ Router model ของ Groq ตัดสิน ผู้ใช้จึงไม่ต้องพิมพ์ข้อความใหม่",
  },
  {
    Icon: Route,
    label: "Handler ของเส้นทางตอบผู้ใช้",
    sub: "Groq ยังเขียนคำตอบภาษาไทยทุกข้อความ",
    tip: "Jev ทำหน้าที่เลือกเส้นทางเท่านั้น handler ของเส้นทางยังดึงข้อมูล เรียก Groq เขียนคำตอบ และตรวจหลักฐานด้วย parse_claims เหมือนเดิม",
  },
];

function ArchitectureSection() {
  return (
    <section id="s2" className="scroll-mt-20 py-20">
      <div className="mx-auto w-full max-w-[1120px] px-4 md:px-6">
        <SectionHeading
          no="2"
          eyebrow="AI ทำงานอยู่ส่วนใดของเว็บแอป"
          title="AI ทำงานที่ปลายทาง และเขียนข้อความจากข้อเท็จจริงที่ระบบเตรียมไว้"
          tip="ทีมวาง LLM ไว้ที่ขั้นท้าย ๆ ของเส้นทาง เพราะ LLM ควรรับข้อมูลที่ผ่านการคัดกรองและคำนวณแล้วเท่านั้น การออกแบบนี้ทำให้ LLM มีหน้าที่เดียว คือเรียบเรียงภาษา และทำให้ทีมควบคุมคุณภาพของข้อมูลได้ก่อนถึงขั้น LLM"
        >
          ส่วนประกอบของ AI ทั้งหมดอยู่ใน API ได้แก่ Router การค้นคืนความรู้ และการเรียก LLM
        </SectionHeading>

        <Tile
          icon={Workflow}
          title="คำขอหนึ่งรายการเดินทางผ่าน 6 ขั้นตอน"
          tip="กล่องนี้แสดงลำดับที่ข้อความของผู้ใช้เดินทางผ่านระบบ ตั้งแต่หน้าเว็บจนถึงการตรวจหลักฐาน กล่อง LLM ถูกเน้นสีเพื่อแสดงว่า LLM เป็นเพียงหนึ่งขั้นในหลายขั้น และทุกขั้นก่อนหน้ามีหน้าที่เตรียมข้อมูลให้ LLM"
          className="mt-12 p-6"
        >
          <FlowChain steps={PATH} />
        </Tile>

        <Tile
          icon={Zap}
          title="Jev ทำงานอยู่ในชั้น LLM ของ AI Router"
          tip="Jev ของ TypeSafe ทำงานในขั้นที่ 3 ของเส้นทางด้านบน คือ AI Router และทำงานเฉพาะกับข้อความที่ Guard และ Keyword rules ตัดสินไม่ได้ Jev ไม่ได้เขียนคำตอบให้ผู้ใช้ และไม่ได้รับ CV หรือโปรไฟล์ ผู้ชมสามารถดูประโยชน์และผลการทดลองได้ในบทที่ 5"
          note="ทีมปิด Jev ไว้เป็นค่าเริ่มต้น ระบบเปิดใช้ Jev เมื่อตั้ง JEV_ROUTER_ENABLED=true และใส่ TYPESAFE_API_KEY เท่านั้น"
          className="mt-5 p-6"
        >
          <FlowChain steps={JEV_PLACE} />
          <p className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-bg/60 backdrop-blur-md px-3 py-1 text-tiny font-semibold text-text-muted">
            <ToggleRight className="size-5 text-accent" strokeWidth={1.75} aria-hidden="true" />
            ปิดไว้เป็นค่าเริ่มต้น
          </p>
        </Tile>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <Tile
            icon={Layers}
            title="ระบบทำงานบน container 3 ตัว"
            tip="ทีมเลือกใช้ container เพียง 3 ตัวเพื่อให้ติดตั้งและดูแลระบบได้ง่ายในเวลาพัฒนาที่จำกัด ดัชนีค้นหาของ RAG เก็บใน SQLite และโหลดเข้าหน่วยความจำภายใน API ทีมจึงไม่ต้องเพิ่ม container สำหรับ vector database"
          >
            <ul className="space-y-2.5">
              {CONTAINERS.map(({ name, tech, body, tip }) => (
                <Explain as="li" key={name} tip={[body, tip]} title={`container ${name}`} className="flex items-center gap-3 rounded-xl border border-border bg-bg/60 backdrop-blur-md px-3 py-3">
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-subtle text-accent">
                    <Server className="size-5" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <code className="text-body font-semibold text-text">{name}</code>
                  <span className="ml-auto text-small text-text-muted">{tech}</span>
                </Explain>
              ))}
            </ul>
          </Tile>
          <Tile
            icon={Cpu}
            title="ระบบใช้ 2 โมเดลของ Groq และใช้ Jev ช่วยเลือกเส้นทาง"
            tip="ทีมแบ่งงานให้โมเดลตามความต้องการของงาน งานที่ผู้ใช้อ่านโดยตรงใช้โมเดลที่ใหญ่กว่า ส่วนงานที่ตอบเป็นโครงสร้างใช้โมเดลที่เล็กและเร็วกว่า การแบ่งงานแบบนี้ช่วยประหยัด tokens ภายใต้ข้อจำกัดของ Groq และ Jev ช่วยลดการเรียก Groq ในชั้น Router ลงอีก"
            note="ทีมเก็บ model id ไว้ใน env จึงเปลี่ยนโมเดลได้โดยไม่ต้องแก้โค้ด"
          >
            <div className="space-y-3">
              {MODELS.map((m) => (
                <Explain key={m.id} tip={[m.body, m.tip]} title={m.id} className={`rounded-xl border p-3 ${m.strong ? "border-accent/50 bg-primary-subtle/50 backdrop-blur-md" : "border-border bg-bg/60 backdrop-blur-md"}`}>
                  <code className="text-small font-semibold text-text">{m.id}</code>
                  <span className="mt-1.5 block w-fit rounded-full bg-primary-subtle px-2.5 py-0.5 text-tiny font-semibold text-accent">{m.role}</span>
                </Explain>
              ))}
            </div>
          </Tile>
          <Tile
            icon={Gauge}
            title="Groq กำหนดข้อจำกัดที่ส่งผลต่อการออกแบบ"
            tip="Groq กำหนดเพดานการใช้งานแยกตามโมเดล ข้อจำกัดเหล่านี้เป็นเหตุผลหลักที่ทีมเลือก workflow ที่กำหนดลำดับด้วยโค้ด ใช้กฎก่อนเรียก LLM และตั้งโควตาต่อผู้ใช้"
            note="ข้อจำกัดเหล่านี้ใช้กับแต่ละโมเดล นอกจากนี้ ระบบยังจำกัดผู้ใช้แต่ละคนไว้ที่ 40 คำขอและ 40,000 tokens ต่อวัน และตรวจโควตาก่อนเรียก LLM ทุกครั้ง"
          >
            <div className="grid grid-cols-2 gap-2">
              {LIMITS.map((l) => (
                <Explain key={l.caption} tip={[l.caption, l.tip]} title={`${l.value} ${l.unit}`} className="rounded-xl border border-border bg-bg/60 backdrop-blur-md px-3 py-3">
                  <p className="tabular text-h2 font-semibold text-text">{l.value}</p>
                  <p className="text-tiny text-text-muted">{l.unit}</p>
                </Explain>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-2 rounded-xl bg-primary-subtle px-3 py-2 text-small font-semibold text-text">
              <UserRound className="size-5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
              ผู้ใช้ 1 คน: 40 คำขอ · 40,000 tokens / วัน
            </p>
          </Tile>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. AI vs no AI ---------- */

const KIND = {
  llm: {
    label: "ใช้ LLM",
    cls: "bg-[var(--color-series-1)] text-white",
    tip: "ฟีเจอร์ในกลุ่มนี้ใช้ LLM เขียนหรือแปลงข้อความ และทุกผลลัพธ์ต้องผ่านการตรวจด้วยโค้ดก่อนถึงผู้ใช้",
  },
  rag: {
    label: "ใช้ LLM ร่วมกับ RAG",
    cls: "bg-[var(--color-series-3)] text-white",
    tip: "ฟีเจอร์ในกลุ่มนี้ค้นความรู้จากคลังเอกสารที่ทีมเขียนก่อน แล้วจึงให้ LLM เขียนคำตอบโดยอ้างอิงเอกสารที่ค้นได้",
  },
  part: {
    label: "ใช้ AI บางส่วน",
    cls: "border border-[var(--color-series-2)] text-[var(--color-series-2)]",
    tip: "ฟีเจอร์ในกลุ่มนี้ใช้กฎก่อน และเรียก LLM เฉพาะกรณีที่กฎตัดสินไม่ได้ ระบบจึงประหยัดโควตาได้มาก",
  },
  none: {
    label: "ไม่ใช้ AI",
    cls: "border border-border text-text-muted",
    tip: "ฟีเจอร์ในกลุ่มนี้ทำงานด้วยโค้ดปกติทั้งหมด เพราะงานเหล่านี้ต้องการผลลัพธ์ที่แน่นอนและตรวจสอบได้",
  },
};

const FEATURES = [
  {
    name: "ระบบแยกเส้นทางของข้อความในแชท",
    kind: "part",
    how: "ระบบใช้ Guard และ Keyword rules ก่อน แล้วจึงให้ Jev หรือ Groq ตัดสิน และจะถามกลับเมื่อความมั่นใจต่ำ",
    tip: "กฎตัดสินข้อความส่วนใหญ่ได้โดยไม่ต้องเรียก LLM เช่น คำทักทาย หรือคำถามเรื่องเงินเดือนที่ใช้คำชัดเจน ระบบเรียก LLM เฉพาะเมื่อข้อความกำกวมหรือตรงกับกฎหลายเส้นทาง ทีมจึงจัดฟีเจอร์นี้ไว้ในกลุ่มที่ใช้ AI บางส่วน",
  },
  {
    name: "ระบบดึงข้อเท็จจริงจากคำตอบในแชท",
    kind: "llm",
    how: "LLM ส่งคืน JSON ที่มีโครงสร้าง แล้ว Python ตรวจว่าทักษะนั้นปรากฏอยู่ในข้อความจริง",
    tip: "เมื่อผู้ใช้ตอบคำถามเพิ่มเติม LLM จะแปลงคำตอบเป็นรายการทักษะและระดับ จากนั้น Python ตรวจว่าทักษะนั้นอยู่ในข้อความของผู้ใช้หรือในคำถามที่ผู้ใช้ตอบ และตรวจว่าระดับเป็นตัวเลขที่ผู้ใช้พิมพ์เอง ข้อมูลที่ LLM เดาขึ้นจึงไม่สามารถเข้าสู่โปรไฟล์ได้",
  },
  {
    name: "ระบบสรุปประสบการณ์และสิ่งที่ผู้ใช้ควรสำรวจ",
    kind: "llm",
    how: "LLM เขียนจากข้อเท็จจริงเท่านั้น และทุกข้อความต้องอ้าง evidence id",
    tip: "ส่วนนี้เป็นงานที่ต้องใช้ภาษามากที่สุด เพราะระบบต้องสรุปประสบการณ์จากหลายแหล่งให้อ่านเป็นเรื่องเดียวกัน ระบบส่งรายการข้อเท็จจริงที่มี id กำกับให้ LLM และตัดข้อความที่อ้าง id ไม่ถูกต้องออกก่อนบันทึก",
  },
  {
    name: "ระบบเขียนเหตุผลการจับคู่และก้าวถัดไป",
    kind: "rag",
    how: "ระบบดึงเส้นทางการเรียนรู้จาก RAG และ LLM เขียนคำแนะนำหนึ่งข้อต่อหนึ่งช่องว่างที่คำนวณไว้แล้ว",
    tip: "Python คำนวณว่าผู้ใช้ขาดทักษะใดในแต่ละสายงาน จากนั้น RAG ค้นเอกสารเส้นทางการเรียนรู้ของสายงานนั้น LLM จึงเขียนคำแนะนำโดยอิงทั้งช่องว่างที่คำนวณไว้และเอกสารที่ค้นได้ ส่วนเปอร์เซ็นต์และรายการทักษะที่ต้องเติมยังคงมาจาก Python",
  },
  {
    name: "ระบบตอบคำถามเรื่องทักษะและจุดบอด",
    kind: "rag",
    how: "parse_claims ตรวจคำตอบ และหากคำตอบไม่ผ่าน ระบบจะใช้ข้อความที่คำนวณไว้แทน",
    tip: "เมื่อผู้ใช้ถามว่าตนเก่งด้านใดหรือมีจุดบอดตรงไหน ระบบส่งทักษะ ระดับ และบันทึกเรื่อง soft skill จาก RAG ให้ LLM เรียบเรียงคำตอบ คำตอบในแชทยังผ่านการตรวจเพิ่มเติม เช่น ระบบตัดประโยคที่อ้างชื่อเครื่องมือหรือบริษัทที่ไม่มีในข้อเท็จจริง",
  },
  {
    name: "ผู้ใช้แก้โปรไฟล์ผ่านแชทได้",
    kind: "llm",
    how: "LLM แปลงคำขอเป็นการแก้ไขแบบมีโครงสร้าง และผู้ใช้ต้องกดยืนยันก่อนระบบบันทึก",
    tip: "ผู้ใช้สามารถพิมพ์ประโยคทั่วไป เช่น ขอเปลี่ยนระดับ SQL เป็น 3 แล้ว LLM จะแปลงประโยคนั้นเป็นคำสั่งที่ระบุ field การกระทำ และค่าใหม่ ระบบแสดงการ์ดเปรียบเทียบค่าเดิมกับค่าใหม่ และบันทึกเฉพาะเมื่อผู้ใช้กดปุ่มยืนยัน ผู้ชมสามารถดูรายละเอียดได้ในบทที่ 6",
  },
  {
    name: "ระบบอ่าน CV",
    kind: "part",
    how: "ระบบใช้กฎและ taxonomy ก่อน ใช้ LLM เมื่อผู้ใช้ยังมีโควตา และผู้ใช้ต้องยืนยันผลทุกครั้ง",
    tip: "กฎและ taxonomy จับชื่อทักษะและชื่อเรียกอื่นที่พบบ่อยได้โดยไม่ใช้ tokens LLM ช่วยอ่านส่วนที่กฎจับไม่ได้เมื่อผู้ใช้ยังมีโควตาเหลือ ระบบไม่เก็บไฟล์ PDF และให้ผู้ใช้ตรวจแก้ผลก่อนยืนยันทุกครั้ง",
  },
  {
    name: "ระบบคำนวณเปอร์เซ็นต์ความตรง",
    kind: "none",
    how: "Python คำนวณด้วยน้ำหนัก 0.70, 0.15, 0.10 และ 0.05",
    tip: "การคำนวณนี้ไม่ใช้ AI เลย เพื่อให้ผลลัพธ์คงที่และตรวจสอบได้ ผู้ใช้ที่มีข้อมูลเดิมจะได้เปอร์เซ็นต์เดิมทุกครั้ง และทีมสามารถเขียน unit test เพื่อตรวจสูตรได้",
  },
  {
    name: "ระบบประเมินระดับทักษะ เดือนประสบการณ์ และความครบถ้วนของข้อมูล",
    kind: "none",
    how: "Python ประเมินค่าเหล่านี้ด้วยกฎที่ทีมกำหนดไว้",
    tip: "ระบบเลือกระดับทักษะตามลำดับแหล่งข้อมูลที่กำหนดไว้ คำนวณเดือนประสบการณ์จากวันที่เริ่มและวันที่สิ้นสุดของแต่ละงาน และคำนวณความครบถ้วนจากช่องข้อมูลที่ผู้ใช้กรอกแล้ว ค่าทั้งหมดนี้ไม่ผ่าน LLM",
  },
  {
    name: "ระบบแสดงเงินเดือนและตลาดงาน",
    kind: "none",
    how: "ระบบใช้ตารางอ้างอิงและแคชจาก JobThai และ LLM ไม่ได้เขียนข้อความในส่วนนี้",
    tip: "ตัวเลขเงินเดือนมาจากตารางอ้างอิง และข้อมูลตลาดงานมาจากประกาศงานที่ระบบแคชไว้ต่อสายงาน ระบบแสดงวันที่และแหล่งที่มากำกับ เพื่อให้ผู้ใช้ทราบว่าข้อมูลถูกดึงมาเมื่อใด",
  },
  {
    name: "ระบบแสดงตัวละคร แดชบอร์ด และโควตา",
    kind: "none",
    how: "โค้ดปกติจัดการส่วนเหล่านี้ทั้งหมด",
    tip: "ส่วนเหล่านี้แสดงข้อมูลที่ระบบมีอยู่แล้ว จึงไม่มีเหตุผลที่ต้องใช้ AI การใช้โค้ดปกติทำให้หน้าเว็บตอบสนองเร็วและไม่ใช้โควตาของผู้ใช้",
  },
];

const WEIGHTS = [
  { label: "ทักษะที่สายงานต้องมี", w: 0.7, color: "var(--color-series-1)", tip: "ส่วนนี้มีน้ำหนักมากที่สุด เพราะทักษะที่ต้องมีเป็นเงื่อนไขหลักของการทำงานในสายงานนั้น ระบบเทียบระดับของผู้ใช้กับระดับที่สายงานต้องการในแต่ละทักษะ" },
  { label: "ทักษะที่สายงานควรมี", w: 0.15, color: "var(--color-series-2)", tip: "ทักษะที่ควรมีช่วยเพิ่มคะแนน แต่การขาดทักษะกลุ่มนี้ไม่ได้ทำให้ผู้ใช้หลุดจากสายงานนั้น" },
  { label: "ทักษะการทำงานที่สายงานต้องการ", w: 0.1, color: "var(--color-series-3)", tip: "ส่วนนี้วัด soft skill เช่น การสื่อสารและการทำงานเป็นทีม ที่สายงานนั้นให้ความสำคัญ" },
  { label: "ความชอบในการทำงานของผู้ใช้", w: 0.05, color: "var(--color-border)", tip: "ระบบคำนวณส่วนนี้จากระยะห่างระหว่างความชอบของผู้ใช้กับลักษณะงานของสายงาน 6 ด้าน ได้แก่ การทำงานเป็นทีม ความชัดเจนของขั้นตอน ความกำกวมของโจทย์ แรงกดดัน การใช้วิธีใหม่ และการเป็นผู้นำ หากผู้ใช้ไม่ได้ตอบ ระบบจะใช้ค่ากลาง 0.5" },
];

function AiMatrixSection() {
  const counts = FEATURES.reduce((a, f) => ({ ...a, [f.kind]: (a[f.kind] ?? 0) + 1 }), {});
  return (
    <section id="s3" className="bg-section-wash scroll-mt-20 py-20">
      <div className="mx-auto w-full max-w-[1120px] px-4 md:px-6">
        <SectionHeading
          no="3"
          eyebrow="ฟีเจอร์ใดบ้างที่ใช้ AI"
          title="AI ทำหน้าที่อธิบาย แต่ AI ไม่ได้เป็นผู้ตัดสิน"
          tip="ทีมแยกงานออกเป็นสองประเภท งานที่ต้องใช้ภาษา เช่น การสรุปหรือการอธิบาย ใช้ LLM ส่วนงานที่ต้องการความแม่นยำ เช่น คะแนน ระดับ และเงินเดือน ใช้ Python ผู้ชมสามารถคลิกที่แต่ละแถวเพื่ออ่านเหตุผลของการแบ่งงานนั้น"
        >
          ตัวเลขทุกตัวที่ผู้ใช้เห็นมาจาก Python ดังนั้นข้อมูลชุดเดิมจะได้ผลลัพธ์เดิมทุกครั้ง
        </SectionHeading>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {Object.entries(KIND).map(([k, v]) => (
            <Explain as="span" key={k} tip={v.tip} title={v.label} className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-small font-semibold ${v.cls}`}>
              {v.label}
              <span className="tabular rounded-full bg-black/10 px-2 text-tiny">{counts[k] ?? 0}</span>
            </Explain>
          ))}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="rounded-2xl border border-border bg-surface shadow-sm">
            <ul className="divide-y divide-border">
              {FEATURES.map((f) => (
                <Explain
                  as="li"
                  key={f.name}
                  tip={[f.how, f.tip]}
                  title={f.name}
                  className="flex items-center justify-between gap-4 px-5 py-3 first:rounded-t-2xl last:rounded-b-2xl"
                >
                  <span className="text-small font-semibold text-text">{f.name}</span>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-tiny font-semibold whitespace-nowrap ${KIND[f.kind].cls}`}>{KIND[f.kind].label}</span>
                </Explain>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <Tile
              icon={Calculator}
              title="Python คำนวณเปอร์เซ็นต์ความตรงโดยไม่ใช้ AI"
              note="ระบบแสดงสายงานที่ได้ตั้งแต่ 60% ขึ้นไป โดยแสดงไม่เกิน 5 สายงาน"
              tip="สูตรนี้รวมคะแนน 4 ส่วนด้วยน้ำหนักคงที่ แล้วปัดเป็นเปอร์เซ็นต์ ทีมตัดสินใจคงน้ำหนักนี้ไว้หลังจากทดสอบกับโปรไฟล์ตัวอย่างในบทที่ 8 ผู้ชมสามารถคลิกที่แต่ละส่วนเพื่ออ่านวิธีคิดของส่วนนั้น"
            >
              <div className="flex h-4 gap-0.5 overflow-hidden rounded-full" role="img" aria-label="น้ำหนักของสูตรคือ 70, 15, 10 และ 5 เปอร์เซ็นต์">
                {WEIGHTS.map((w) => (
                  <span key={w.label} className="h-full first:rounded-l-full last:rounded-r-full" style={{ width: `${w.w * 100}%`, background: w.color }} />
                ))}
              </div>
              <ul className="mt-3 space-y-1">
                {WEIGHTS.map((w) => (
                  <Explain as="li" key={w.label} tip={w.tip} title={w.label} className="flex items-center justify-between gap-3 rounded-md px-1 py-0.5 text-small">
                    <span className="flex items-center gap-2 text-text">
                      <span className="size-2.5 shrink-0 rounded-sm" style={{ background: w.color }} aria-hidden="true" />
                      {w.label}
                    </span>
                    <span className="tabular font-semibold text-text">{Math.round(w.w * 100)}%</span>
                  </Explain>
                ))}
              </ul>
              <p className="mt-3 flex items-center gap-2 rounded-xl bg-primary-subtle px-3 py-2 text-small font-semibold text-text">
                <Target className="size-5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
                ≥ 60% · สูงสุด 5 สายงาน
              </p>
            </Tile>
            <Tile
              icon={ShieldCheck}
              title="LLM ไม่สามารถเขียนข้อมูลลงโปรไฟล์ได้เอง"
              note="ระบบแปลงคำขอแก้ไขผ่านแชทเป็นการ์ด “เดิม → ใหม่” ผู้ใช้ต้องกดยืนยันก่อนระบบบันทึก และข้อเสนอแต่ละรายการจะหมดอายุภายใน 15 นาที"
              tip="หลักการนี้ป้องกันไม่ให้ LLM เปลี่ยนข้อมูลของผู้ใช้โดยที่ผู้ใช้ไม่รู้ตัว แม้ LLM จะเข้าใจคำขอผิด ผู้ใช้ก็ยังเห็นค่าเดิมและค่าใหม่ก่อนตัดสินใจ ข้อเสนอที่หมดอายุช่วยให้การ์ดเก่าไม่ถูกกดยืนยันโดยไม่ตั้งใจ"
            >
              <div className="flex flex-wrap items-center justify-center gap-2" role="img" aria-label="การ์ดเดิมไปใหม่ SQL ระดับ 2 เป็น 3 ผู้ใช้ต้องกดยืนยันภายใน 15 นาที">
                <span className="rounded-lg border border-border bg-bg/60 backdrop-blur-md px-3 py-1.5 text-small text-text-muted line-through">SQL 2</span>
                <ArrowRight className="size-5 text-accent" strokeWidth={2} aria-hidden="true" />
                <span className="rounded-lg border border-accent bg-primary-subtle px-3 py-1.5 text-small font-semibold text-text">SQL 3</span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-small font-semibold text-on-primary">
                  <MousePointerClick className="size-4" strokeWidth={2} aria-hidden="true" />
                  ยืนยัน
                </span>
                <span className="inline-flex items-center gap-1 text-tiny font-semibold text-text-muted">
                  <Clock className="size-4" strokeWidth={2} aria-hidden="true" />
                  15 นาที
                </span>
              </div>
            </Tile>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. techniques ---------- */

const ROUTER_LAYERS = [
  {
    name: "Guard",
    badge: "0 tokens",
    body: "ชั้นนี้ปฏิเสธข้อความว่าง ข้อความที่ยาวเกิน prompt injection และคำถามนอกขอบเขต",
    tip: "Guard ทำงานก่อนทุกชั้นและไม่ใช้ LLM ระบบปฏิเสธข้อความที่ไม่ผ่านทันทีโดยไม่เสียโควตา ผู้ไม่หวังดีจึงไม่สามารถใช้ prompt injection เพื่อสั่งงาน LLM ได้",
    llm: false,
    width: "100%",
  },
  {
    name: "Keyword rules",
    badge: "0.9",
    body: "ชั้นนี้จับรูปแบบคำภาษาไทยและภาษาอังกฤษ และให้ความมั่นใจ 0.9",
    tip: "ทีมเขียนรูปแบบคำของแต่ละเส้นทาง เช่น คำว่าเงินเดือนหรือ salary กฎจะไม่ตัดสินเมื่อข้อความถามเรื่องอื่นของหัวข้อนั้น หรือเมื่อข้อความตรงกับกฎหลายเส้นทาง ในกรณีเหล่านี้ระบบจะส่งข้อความต่อให้ LLM",
    llm: false,
    width: "86%",
  },
  {
    name: "LLM classifier",
    badge: "Jev → Groq",
    body: "ชั้นนี้ถาม Jev ก่อน และถาม Groq เมื่อ Jev ไม่แน่ใจ โดย Groq ใช้ประมาณ 260 tokens ต่อครั้ง",
    tip: "LLM ได้รับรายการเส้นทางที่เป็นไปได้และข้อความของผู้ใช้ แล้วตอบกลับเป็นชื่อเส้นทางพร้อมค่าความมั่นใจ การจำกัดคำตอบให้อยู่ในรูปโครงสร้างทำให้แต่ละครั้งใช้ tokens น้อย เมื่อทีมเปิดใช้ Jev ระบบจะถาม Jev ก่อน และเรียก Groq เฉพาะเมื่อ Jev ไม่แน่ใจหรือเรียกไม่สำเร็จ ผู้ชมสามารถดูรายละเอียดได้ในบทที่ 5",
    llm: true,
    width: "70%",
  },
  {
    name: "Clarify",
    badge: "< 0.6",
    body: "ระบบถามกลับแทนการเดาเมื่อความมั่นใจต่ำกว่า 0.6",
    tip: "เมื่อ LLM ไม่มั่นใจ ระบบจะถามผู้ใช้ว่าต้องการหัวข้อใด แทนการเลือกเส้นทางที่อาจผิด หากข้อความระบุชื่อสายงาน ระบบจะถามว่าผู้ใช้ต้องการทราบเรื่องใดของสายงานนั้น",
    llm: false,
    width: "54%",
  },
];

const RAG_PARTS = [
  {
    name: "BM25",
    body: "BM25 ตัดคำภาษาไทยด้วย pythainlp และจับชื่อทักษะที่ตรงตัว",
    tip: "BM25 ให้คะแนนเอกสารตามคำที่ตรงกับคำค้น จึงเหมาะกับชื่อเฉพาะ เช่น Kubernetes หรือ SQL ที่การค้นด้วยเวกเตอร์อาจจับได้ไม่แม่น ภาษาไทยไม่มีการเว้นวรรคระหว่างคำ ระบบจึงใช้ pythainlp ตัดคำก่อนสร้างดัชนี",
  },
  {
    name: "FAISS vector",
    body: "FAISS ค้นด้วย multilingual-e5-base และจับความหมายของคำถาม",
    tip: "โมเดล embedding แปลงคำถามและเอกสารเป็นเวกเตอร์ แล้ว FAISS ค้นเอกสารที่มีความหมายใกล้เคียงกัน วิธีนี้จับคำถามที่ใช้ถ้อยคำต่างจากเอกสารได้ ทีมเลือก e5-base เพราะโมเดลนี้มีขนาดประมาณครึ่งหนึ่งของ bge-m3 และทำงานบน CPU ได้เร็วพอ",
  },
];

const CLAIM_STEPS = [
  {
    Icon: ListChecks,
    title: "ระบบเตรียม facts พร้อม evidence id",
    body: "แต่ละ fact ชี้ไปยังบรรทัดใน CV ข้อในแบบสอบถาม หรือข้อความในแชท",
    tip: "ระบบสร้างรายการข้อเท็จจริงจากข้อมูลที่ผู้ใช้ยืนยันแล้ว และกำหนด id ให้แต่ละข้อ id นี้เป็นสิ่งเดียวที่ LLM ใช้อ้างอิงได้ LLM จึงไม่สามารถอ้างแหล่งที่ไม่มีอยู่จริงได้โดยไม่ถูกจับ",
  },
  {
    Icon: Bot,
    title: "LLM เขียนข้อความ",
    body: "LLM ตอบเป็น JSON และแต่ละข้อความอ้าง id ของหลักฐาน",
    tip: "รูปแบบ JSON ทำให้ระบบแยกข้อความแต่ละข้อและ id ที่อ้างได้อย่างแน่นอน ระบบไม่ต้องตีความข้อความอิสระของ LLM",
  },
  {
    Icon: Filter,
    title: "parse_claims ตรวจข้อความ",
    body: "ฟังก์ชันนี้ตัด id ที่ไม่มีอยู่จริง และตัดตัวเลขที่ไม่อยู่ใน facts",
    tip: "parse_claims ตรวจทุกประโยคก่อนบันทึก ประโยคที่อ้าง id ผิดหรือมีตัวเลขที่ไม่ตรงกับข้อเท็จจริงจะถูกตัดทิ้ง ฟังก์ชันนี้ยังตัด id ที่หลุดมาในเนื้อความ เพื่อให้ผู้ใช้เห็นหลักฐานในรูปหมายเลขอ้างอิงเท่านั้น",
  },
  {
    Icon: Quote,
    title: "ผู้ใช้เห็นหมายเลขอ้างอิง [n]",
    body: "ผู้ใช้กดดูที่มาของทุกข้อความได้",
    tip: "หน้าโปรไฟล์และแชทแสดงหมายเลขอ้างอิงท้ายข้อความ เมื่อผู้ใช้วางเมาส์หรือกดที่หมายเลข ระบบจะแสดงชื่อแหล่งที่มาและข้อความต้นฉบับ ผู้ใช้จึงตรวจได้ทันทีว่าข้อความมาจากข้อมูลส่วนใดของตน",
  },
];

const DECISIONS = [
  {
    t: "ทีมคำนวณคะแนนใน Python",
    b: "ทีมไม่ให้ LLM ให้คะแนน เพราะ Python ให้ผลคงที่ อธิบายได้ และมีต้นทุนต่ำกว่า",
    tip: "การคำนวณใน Python ไม่ใช้ tokens เลย และทีมสามารถเขียน unit test ตรวจสูตรได้ทุกกรณี หากใช้ LLM ให้คะแนน ระบบจะเสียทั้งความคงที่และโควตา",
  },
  {
    t: "ระบบเทียบกับโปรไฟล์ของ 26 สายงาน",
    b: "ระบบไม่เทียบกับประกาศงานทีละประกาศ เพราะข้อมูลประกาศงานเปลี่ยนแปลงบ่อย",
    tip: "โปรไฟล์สายงานที่ทีมเขียนไว้มีโครงสร้างคงที่ คือทักษะที่ต้องมี ทักษะที่ควรมี และลักษณะงาน ผลการจับคู่จึงไม่เปลี่ยนไปตามประกาศงานที่เข้ามาใหม่ในแต่ละวัน",
  },
  {
    t: "ระบบค้นข้อมูลภายใน API",
    b: "ทีมใช้ BM25 และ FAISS แทนการเพิ่ม vector database อีกหนึ่งตัว",
    tip: "คลังความรู้มีขนาดเล็ก คือ 26 สายงานและบันทึกอีกไม่กี่ไฟล์ การค้นภายใน API จึงเร็วพอ และทีมนำโค้ดที่เคยทดสอบกับภาษาไทยแล้วกลับมาใช้ได้ ระบบจึงมี container น้อยลงหนึ่งตัว",
  },
  {
    t: "ผู้ใช้เป็นผู้ยืนยันการแก้ไข",
    b: "LLM เสนอการแก้ไขได้ แต่ LLM ไม่สามารถบันทึกเองได้",
    tip: "การให้มนุษย์อนุมัติทุกการเปลี่ยนแปลงทำให้ความผิดพลาดของ LLM ไม่ส่งผลต่อข้อมูลจริง แนวทางนี้เรียกว่า human-in-the-loop",
  },
];

function TechniquesSection() {
  return (
    <section id="s4" className="mx-auto w-full max-w-[1120px] scroll-mt-20 px-4 py-20 md:px-6">
      <SectionHeading
        no="4"
        eyebrow="ทีมใช้เทคนิคใดบ้าง"
        title="ระบบเลือกวิธีที่ถูกที่สุดก่อน และตรวจทุกคำตอบก่อนแสดง"
        tip="บทนี้อธิบายเทคนิคหลัก 3 อย่าง ได้แก่ Router ที่เรียงจากวิธีที่ไม่มีต้นทุนไปถึงวิธีที่ใช้ LLM, Hybrid RAG ที่รวมการค้นสองแบบ และการตรวจหลักฐานที่ป้องกันไม่ให้ LLM แต่งข้อมูล"
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <Tile
          icon={Route}
          title="AI Router คัดแยกข้อความด้วย 4 ชั้น"
          note="ชั้นบนไม่ใช้ LLM จึงไม่ใช้โควตา และระบบส่งข้อความที่ตรงกับกฎหลายเส้นทางให้ LLM เป็นผู้ตัดสิน"
          tip="รูปกรวยแสดงว่าข้อความจำนวนมากถูกตัดสินที่ชั้นบนซึ่งไม่มีต้นทุน และมีเพียงข้อความส่วนน้อยที่ลงไปถึงชั้น LLM แนวทางนี้ลดทั้งเวลาตอบและการใช้โควตา"
        >
          <ol className="flex flex-col items-center gap-1.5">
            {ROUTER_LAYERS.map((l, i) => (
              <Explain
                as="li"
                key={l.name}
                tip={[l.body, l.tip]}
                title={`ชั้นที่ ${i + 1}: ${l.name}`}
                className={`rounded-xl px-4 py-3 text-center ${l.llm ? "bg-[var(--color-series-1)] text-white" : "border border-border bg-bg/60 backdrop-blur-md text-text"}`}
                style={{ width: l.width }}
              >
                <span className="text-small font-semibold">
                  {i + 1}. {l.name}
                </span>
                {l.badge && <span className={`ml-2 rounded-full px-2 py-0.5 text-tiny font-semibold ${l.llm ? "bg-white/20" : "bg-primary-subtle text-accent"}`}>{l.badge}</span>}
              </Explain>
            ))}
          </ol>
        </Tile>

        <Tile
          icon={Search}
          title="Hybrid RAG ค้นความรู้ด้วยสองวิธีพร้อมกัน"
          tip="การค้นแต่ละแบบมีจุดอ่อนต่างกัน BM25 พลาดเมื่อผู้ใช้ใช้คำต่างจากเอกสาร ส่วนการค้นด้วยเวกเตอร์พลาดกับชื่อเฉพาะ การรวมสองวิธีจึงให้ผลดีกว่าการใช้วิธีเดียว ซึ่งผลการวัดในบทที่ 8 ยืนยันข้อนี้"
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="space-y-2">
              {RAG_PARTS.map((p) => (
                <Explain key={p.name} tip={[p.body, p.tip]} title={p.name} className="flex items-center gap-3 rounded-xl border border-border bg-bg/60 backdrop-blur-md p-3">
                  <Search className="size-6 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
                  <p className="text-small font-semibold text-text">{p.name}</p>
                </Explain>
              ))}
            </div>
            <ArrowRight className="size-5 text-accent" strokeWidth={2} aria-hidden="true" />
            <Explain
              tip="RRF รวมอันดับจากทั้งสองวิธี และกรองตามสายงานและหมวด Reciprocal Rank Fusion ให้คะแนนเอกสารแต่ละชิ้นเท่ากับ 1/(k + อันดับ) จากแต่ละวิธี แล้วนำคะแนนมารวมกัน ค่า k = 60 ลดความได้เปรียบของอันดับแรกสุด เอกสารที่ทั้งสองวิธีจัดอันดับสูงจึงขึ้นมาอยู่อันดับต้น ระบบยังกรองผลตาม role_id และหมวดของเอกสารได้"
              title="RRF k = 60"
              className="rounded-xl border border-accent bg-primary-subtle/60 backdrop-blur-md p-3 text-center"
            >
              <GitMerge className="mx-auto size-7 text-accent" strokeWidth={1.75} aria-hidden="true" />
              <p className="mt-1 text-small font-semibold text-text">RRF k = 60</p>
            </Explain>
          </div>
          <Explain
            tip="ทีมเขียนคลังความรู้เอง ซึ่งประกอบด้วยไฟล์สายงาน 26 ไฟล์ และบันทึกเรื่อง work style และ soft skill ระบบตัด chunk ตามหัวข้อ และใช้ความรู้นี้เสริมคำตอบเท่านั้น หาก index ยังไม่พร้อม ระบบก็ยังตอบจากข้อมูลส่วนอื่นได้ ทีมตัด chunk ตามหัวข้อระดับ ## ทำให้แต่ละ chunk มีเนื้อหาครบในตัว และแต่ละ chunk เก็บ doc_id หมวด สายงาน และแหล่งที่มาไว้ การอ้างอิงในคำตอบจึงชี้ไปยังเนื้อหาที่มีอยู่จริงในคลัง"
            title="คลังความรู้ที่ทีมเขียนเอง"
            className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-bg/60 backdrop-blur-md p-3"
          >
            <BookOpenText className="size-8 shrink-0 text-accent" strokeWidth={1.5} aria-hidden="true" />
            <span className="tabular text-h2 font-semibold text-text">26</span>
            <span className="text-small font-semibold text-text">ไฟล์สายงาน + บันทึก work style และ soft skill</span>
          </Explain>
        </Tile>

        <Tile
          icon={ShieldCheck}
          title="ระบบป้องกันไม่ให้ LLM แต่งข้อมูลขึ้นเอง"
          note="ทีมยังไม่ได้วัดสัดส่วนประโยคที่ parse_claims ตัดทิ้งในการสร้างโปรไฟล์จริง"
          tip="ปัญหาที่พบบ่อยของ LLM คือการแต่งข้อมูลที่ฟังดูน่าเชื่อ (hallucination) ระบบนี้แก้ปัญหาด้วยการบังคับให้ทุกข้อความอ้างหลักฐาน แล้วใช้โค้ดตรวจการอ้างอิงนั้น แทนการเชื่อคำตอบของ LLM โดยตรง"
          className="lg:col-span-2"
        >
          <ol className="grid gap-3 md:grid-cols-4">
            {CLAIM_STEPS.map(({ Icon, title, body, tip }, i) => (
              <Explain as="li" key={title} tip={[body, tip]} title={title} className="relative flex flex-col items-center rounded-xl border border-border bg-bg/60 backdrop-blur-md p-4 text-center">
                <span className="tabular absolute top-2 right-3 text-tiny font-semibold text-text-muted">{i + 1}</span>
                <Icon className="size-9 text-accent" strokeWidth={1.5} aria-hidden="true" />
                <p className="mt-2 text-small font-semibold text-text">{title}</p>
              </Explain>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-small text-text">
            สัดส่วนประโยคที่ถูกตัดทิ้ง <Pending>ทีมกำลังรอวัดค่านี้</Pending>
          </div>
        </Tile>

        <Tile
          icon={KeyRound}
          title="ทีมตัดสินใจเรื่องสำคัญ 4 ข้อ"
          tip="การตัดสินใจทั้ง 4 ข้อนี้มีเป้าหมายเดียวกัน คือทำให้ระบบตรวจสอบได้ มีต้นทุนต่ำ และดูแลได้ง่ายสำหรับทีมขนาดเล็กที่มีเวลาพัฒนาจำกัด"
          className="lg:col-span-2"
        >
          <CheckList items={DECISIONS} className="grid gap-2 md:grid-cols-2" />
        </Tile>
      </div>
    </section>
  );
}

/* ---------- 5. Jev ---------- */

const JEV_OUTCOMES = [
  {
    Icon: CheckCircle2,
    when: "Jev มั่นใจตั้งแต่ 0.4 ขึ้นไป",
    short: "ใช้เส้นทางของ Jev",
    then: "ระบบใช้เส้นทางของ Jev ทันที และไม่เรียก Groq",
    tip: "กรณีนี้เป็นกรณีส่วนใหญ่ ในชุดทดลอง Jev ตัดสินได้เอง 33 จาก 43 ข้อความ ระบบจึงประหยัดการเรียก Groq ได้มากที่สุดในกรณีนี้",
    strong: true,
  },
  {
    Icon: HelpCircle,
    when: "Jev ตอบ clarify หรือมั่นใจต่ำกว่า 0.4",
    short: "Groq ตรวจซ้ำ",
    then: "Groq ตรวจซ้ำอีกครั้ง ก่อนที่ระบบจะถามผู้ใช้กลับ",
    tip: "Jev มักถามกลับบ่อยเกินไปเมื่อผู้ใช้ใช้คำแสลงหรือขอแก้โปรไฟล์ การให้ Groq ตรวจซ้ำจึงช่วยให้ผู้ใช้ไม่ต้องพิมพ์ข้อความใหม่โดยไม่จำเป็น",
  },
  {
    Icon: TimerOff,
    when: "Jev หมดเวลา ถูกจำกัดอัตรา หรือตอบผิดรูปแบบ",
    short: "ส่งต่อให้ Groq",
    then: "ระบบส่งข้อความให้ Groq ทันที และผู้ใช้ไม่เห็นข้อผิดพลาด",
    tip: "JevClient รวมความล้มเหลวทุกแบบไว้เป็น JevFailed ได้แก่ การหมดเวลา ปัญหาเครือข่าย การตอบ 429 status อื่น และคำตอบที่ใช้ไม่ได้ ระบบจึงจัดการทุกกรณีด้วยวิธีเดียวกัน คือส่งต่อให้ Groq",
  },
  {
    Icon: LifeBuoy,
    when: "Groq ล้มเหลวหลังจาก Jev ตอบ clarify",
    short: "ถามผู้ใช้กลับ",
    then: "ระบบถามผู้ใช้กลับ แทนการแสดงข้อผิดพลาด",
    tip: "ในกรณีนี้ Jev ได้ให้คำตอบที่ปลอดภัยไว้แล้ว คือการถามกลับ ระบบจึงใช้คำตอบนั้นแทนการแจ้งข้อผิดพลาดให้ผู้ใช้",
  },
];

const JEV_ALONE = [
  { label: "Groq อย่างเดียว", value: 61, text: "61/62", tip: "Router model ของ Groq (qwen3.8-27b) ตอบถูก 61 ข้อจาก 62 ข้อ บนข้อความที่มีคำตอบชัดเจนในชุดข้อความยาก" },
  { label: "Jev อย่างเดียว", value: 55, text: "55/62", tip: "Jev ตอบถูก 55 ข้อจาก 62 ข้อ บนชุดเดียวกัน Jev พลาด 7 ข้อ และ 6 ข้อในนั้นเป็นการตอบ clarify ซึ่งหมายความว่า Jev ไม่แน่ใจมากกว่าเลือกเส้นทางผิด" },
];

const JEV_GAINS = [
  {
    t: "ระบบเรียก Groq น้อยลง",
    b: "ในชุดทดลอง ระบบเรียก Groq Router เพียง 10 จาก 43 ข้อความ",
    tip: "Groq จำกัดทั้งบัญชีไว้ที่ 30 คำขอและ 8,000 tokens ต่อนาที และการเรียก Groq Router หนึ่งครั้งใช้ประมาณ 260 tokens ทุกข้อความที่ Jev ตัดสินได้จึงคืนงบประมาณส่วนนี้ให้งานที่ผู้ใช้อ่านโดยตรง เช่น การสร้างโปรไฟล์และเหตุผลการจับคู่",
  },
  {
    t: "ความแม่นยำไม่ลดลง",
    b: "เมื่อ Jev ทำงานคู่กับ Groq ระบบตอบถูก 43 จาก 43 ข้อ เท่ากับการใช้ Groq อย่างเดียว",
    tip: "ทีมเขียนชุดทดสอบนี้ขึ้นใหม่ก่อนการรัน ผลจึงไม่ได้มาจากการปรับระบบให้เข้ากับชุดข้อมูล การให้ Groq ตรวจซ้ำเมื่อ Jev ตอบ clarify ทำให้ข้อผิดพลาดหลักของ Jev หายไป",
  },
  {
    t: "โควตา tokens ของผู้ใช้ไม่ถูกหักเพิ่ม",
    b: "tokens ของ Jev ไม่นับรวมในโควตา tokens ต่อวัน แต่ข้อความยังนับเป็น 1 คำขอ",
    tip: "โควตา tokens ของผู้ใช้ออกแบบมาเพื่อติดตามข้อจำกัดของ Groq เมื่อ Jev ตัดสินแทน Groq ผู้ใช้จึงมี tokens เหลือสำหรับคำถามถัดไปมากขึ้น",
  },
  {
    t: "ต้นทุนต่ำมาก",
    b: "Jev คิดค่าบริการ $0.042 ต่อล้าน input tokens และไม่คิดค่า output",
    tip: "Jev ตอบเพียงชื่อเส้นทางและค่าความมั่นใจ ค่าใช้จ่ายจึงมาจาก input เท่านั้น ระบบบันทึกจำนวน input tokens ของทุกการเรียกไว้ใน llm_calls เพื่อให้ทีมติดตามต้นทุนได้",
  },
  {
    t: "ผู้ใช้ไม่เห็นข้อผิดพลาดจาก Jev",
    b: "เมื่อ Jev เรียกไม่สำเร็จ ระบบส่งต่อให้ Groq ทันทีภายในเวลาไม่เกิน 3 วินาที",
    tip: "Jev ได้โอกาสเพียงครั้งเดียวภายใน 3 วินาที ความล้มเหลวทุกแบบจึงเพิ่มเวลาได้ไม่เกินนี้ และหาก Groq ล้มเหลวหลังจาก Jev ตอบ clarify ระบบจะถามผู้ใช้กลับแทนการแสดงข้อผิดพลาด",
  },
  {
    t: "ผู้ดูแลติดตามการทำงานของ Jev ได้",
    b: "หน้า Admin แสดงจำนวนครั้ง จำนวนที่ล้มเหลว และ tokens ของ Jev แยกจาก Groq",
    tip: "ทุกการเรียก Jev บันทึกหนึ่งแถวใน llm_calls ด้วย task router_jev หน้า Admin แยกตัวเลขของ Jev ออกจาก Groq เพราะ Jev ตอบในเวลาประมาณ 0.3 วินาทีและมีเพดานของตนเอง ตัวเลขของ Groq จึงไม่ถูกบิดเบือน",
  },
];

const JEV_LIMITS = [
  {
    Icon: ToggleRight,
    t: "ทีมปิด Jev ไว้เป็นค่าเริ่มต้น",
    b: "ระบบเปิดใช้ Jev เมื่อตั้ง JEV_ROUTER_ENABLED=true และใส่ TYPESAFE_API_KEY เท่านั้น",
    tip: "หากทีมไม่ได้เปิด Jev ระบบจะทำงานแบบเดิมทุกประการ คือใช้ Groq ในชั้น LLM ของ Router ทีมจึงทดลอง Jev ได้โดยไม่เสี่ยงต่อการทำงานหลักของระบบ",
  },
  {
    Icon: EyeOff,
    t: "Jev ได้รับข้อมูลเท่าที่จำเป็น",
    b: "ระบบส่งเฉพาะข้อความและบทสนทนาล่าสุด และไม่ส่ง CV หรือโปรไฟล์",
    tip: "ข้อความถูกส่งไปยัง TypeSafe ในสหรัฐอเมริกา นโยบายของ TypeSafe ระบุว่าไม่นำ input ไปฝึกโมเดล แต่ยังไม่ระบุระยะเวลาเก็บข้อมูลของ API ระบบจึงไม่บันทึกข้อความหรือ error body ของ Jev ลงใน log",
  },
  {
    Icon: Gauge,
    t: "เกณฑ์ความมั่นใจ 0.4 ยังเป็นค่าที่ทีมสมมติไว้",
    b: "ค่า 0.6 ทำให้คำตอบที่ถูกกลายเป็น clarify ในการทดลอง ทีมจึงลดเกณฑ์ลง",
    tip: "ค่าความมั่นใจของ Jev ใช้สเกลต่างจากค่าที่ Groq รายงานเอง ทีมจึงไม่ใช้เกณฑ์ 0.6 เดียวกัน และต้องตรวจเกณฑ์ 0.4 กับชุดข้อมูลอื่นก่อนเปิดใช้จริง",
  },
  {
    Icon: TriangleAlert,
    t: "ผลการทดลองยังไม่แสดงว่า Jev ทำให้ระบบแม่นขึ้น",
    b: "ประโยชน์ที่ทีมวัดได้คือการเรียก Groq ที่ลดลง",
    tip: "ระบบที่ใช้ Jev คู่กับ Groq ได้คะแนนเท่ากับ Groq อย่างเดียวบนชุดทดสอบ 43 ข้อ ทีมจึงสรุปได้เพียงว่า Jev ลดภาระของ Groq โดยความแม่นยำไม่ลดลง และชุดทดสอบยังมีขนาดเล็กและทีมเขียนขึ้นเอง",
  },
];

function JevSection() {
  return (
    <section id="s5" className="bg-section-wash scroll-mt-20 py-20">
      <div className="mx-auto w-full max-w-[1120px] px-4 md:px-6">
        <SectionHeading
          no="5"
          eyebrow="Jev ช่วยโปรเจกต์นี้อย่างไร"
          title="Jev ตัดสินเส้นทางส่วนใหญ่แทน Groq และส่งเฉพาะข้อความที่ไม่แน่ใจต่อให้ Groq"
          tip="Jev คือโมเดลของ TypeSafe (jev-latest) ที่ตอบคำถามแบบเลือกตอบ (Choice) ทีมเพิ่ม Jev เข้ามาในชั้น LLM ของ AI Router เมื่อวันที่ 5 พ.ย. 2026 เพื่อลดจำนวนครั้งที่ระบบต้องเรียก Groq Guard, Keyword rules และคำตอบภาษาไทยทุกข้อความยังทำงานเหมือนเดิม"
        >
          Jev ทำหน้าที่เลือกเส้นทางของข้อความเท่านั้น ส่วน Groq ยังเขียนคำตอบภาษาไทยทุกข้อความ
        </SectionHeading>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Tile
            icon={Split}
            title="Jev และ Groq แบ่งงานกันตามลำดับนี้"
            tip="ลำดับนี้มาจากฟังก์ชัน ask_router_model ในโค้ดของ API ระบบถาม Jev ก่อนเสมอเมื่อทีมเปิดใช้งาน และเรียก Groq เฉพาะ 3 กรณีที่แสดงด้านล่าง"
            className="lg:col-span-2"
          >
            <Explain
              tip="ระบบถาม Jev ก่อน เมื่อข้อความผ่าน Guard และ Keyword rules มาแล้ว Jev เลือก 1 จาก 11 เส้นทาง และต้องตอบภายใน 3 วินาที ระบบส่งข้อความและบทสนทนาล่าสุด คำสั่ง และเกณฑ์ของ 11 เส้นทางไปยัง TypeSafe ในรูปคำถามแบบ Choice จากนั้น Jev ตอบกลับเป็นเส้นทางที่เลือกพร้อมค่าความมั่นใจระหว่าง 0 ถึง 1 ระบบให้ Jev ตอบเพียงครั้งเดียวโดยไม่ลองใหม่ เพราะ Groq พร้อมรับช่วงต่อทันที"
              title="ระบบถาม Jev ก่อน"
              className="mx-auto flex max-w-2xl items-center gap-3 rounded-xl border border-accent bg-primary-subtle p-4"
            >
              <Zap className="size-9 shrink-0 text-accent" strokeWidth={1.5} aria-hidden="true" />
              <span className="text-body font-semibold text-text">ระบบถาม Jev ก่อน</span>
              <span className="ml-auto flex gap-2">
                <span className="rounded-full bg-bg/70 px-2.5 py-0.5 text-tiny font-semibold text-accent">11 เส้นทาง</span>
                <span className="rounded-full bg-bg/70 px-2.5 py-0.5 text-tiny font-semibold text-accent">≤ 3 วินาที</span>
              </span>
            </Explain>
            <ArrowDown className="mx-auto my-3 size-6 text-accent" strokeWidth={2} aria-hidden="true" />
            <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {JEV_OUTCOMES.map(({ Icon, when, short, then, tip, strong }) => (
                <Explain
                  as="li"
                  key={when}
                  tip={[then, tip]}
                  title={when}
                  className={`flex flex-col items-center rounded-xl border p-4 text-center ${strong ? "border-[var(--color-series-1)] bg-[var(--color-series-1)] text-white" : "border-border bg-bg/60 backdrop-blur-md text-text"}`}
                >
                  <Icon className={`size-9 ${strong ? "text-white" : "text-accent"}`} strokeWidth={1.5} aria-hidden="true" />
                  <p className={`mt-2 text-tiny ${strong ? "text-white/90" : "text-text-muted"}`}>{when}</p>
                  <ArrowDown className={`my-1 size-5 ${strong ? "text-white/80" : "text-text-muted"}`} strokeWidth={2} aria-hidden="true" />
                  <p className="text-body font-semibold">{short}</p>
                </Explain>
              ))}
            </ol>
          </Tile>

          <Tile
            icon={Bot}
            title="Jev เพียงตัวเดียวยังตอบถูกน้อยกว่า Groq"
            note="Jev พลาด 7 ข้อ และ 6 ข้อในนั้นเป็นการตอบ clarify ทีมจึงให้ Groq ตรวจซ้ำเฉพาะเมื่อ Jev ไม่แน่ใจ"
            tip="ทีมทดลองให้แต่ละโมเดลตัดสินเพียงลำพังบนข้อความที่มีคำตอบชัดเจนในชุดข้อความยาก ผลนี้เป็นเหตุผลที่ทีมไม่ใช้ Jev แทน Groq ทั้งหมด แต่ใช้ Jev เป็นด่านแรกและให้ Groq ตรวจซ้ำ"
          >
            <ul className="space-y-3">
              {JEV_ALONE.map((r, i) => (
                <GrowBar key={r.label} label={r.label} value={r.value} max={62} text={r.text} strong={i === 0} delay={i * 90} tip={r.tip} />
              ))}
            </ul>

          </Tile>

          <Tile
            icon={Activity}
            title="เมื่อทำงานคู่กัน ระบบยังแม่นเท่าเดิมแต่เรียก Groq น้อยลง"
            note="ระบบตอบถูก 43 จาก 43 ข้อ เท่ากับการใช้ Groq อย่างเดียว และ Jev ตัดสินเองได้ 33 จาก 43 ข้อความโดยไม่เรียก Groq"
            tip="ทีมเขียนชุดทดสอบ 43 ข้อขึ้นใหม่ก่อนการรัน แล้ววัดระบบที่ใช้ Jev คู่กับ Groq ผลแสดงว่าระบบตอบถูกครบทุกข้อ และ Jev ตัดสินเองได้ 33 ข้อโดยไม่ต้องเรียก Groq"
          >
            <div className="grid grid-cols-2 gap-4">
              <Big value="43/43" caption="ตอบถูกทุกข้อ" />
              <Big value="77%" caption="Jev ตัดสินเอง ไม่เรียก Groq" />
            </div>
            <div className="mt-5">
              <UsageMeter label="ข้อความที่ Jev ตัดสินเองได้" used={33} limit={43} unit="ข้อความ" />
            </div>
          </Tile>

          <Tile
            icon={Sparkles}
            title="Jev ช่วยโปรเจกต์นี้ใน 6 ด้าน"
            tip="ประโยชน์หลักของ Jev คือการลดภาระของ Groq ซึ่งเป็นข้อจำกัดที่เข้มงวดที่สุดของระบบ ประโยชน์ด้านอื่นมาจากการออกแบบที่ให้ Jev ล้มเหลวได้โดยไม่กระทบผู้ใช้"
            className="lg:col-span-2"
          >
            <CheckList items={JEV_GAINS} className="grid gap-2 md:grid-cols-2" />
          </Tile>

          <Tile
            icon={ShieldAlert}
            title="ขอบเขตและข้อจำกัดที่ทีมยอมรับ"
            tip="ทีมระบุข้อจำกัดเหล่านี้ไว้ใน Design.md เพื่อไม่ให้ผู้อ่านสรุปผลการทดลองเกินกว่าที่วัดได้จริง"
            className="lg:col-span-2"
          >
            <ul className="grid gap-3 md:grid-cols-2">
              {JEV_LIMITS.map(({ Icon, t, b, tip }) => (
                <Explain as="li" key={t} tip={[b, tip]} title={t} className="flex items-center gap-3 rounded-xl border border-border bg-bg/60 backdrop-blur-md p-3">
                  <Icon className="size-7 shrink-0 text-warning" strokeWidth={1.5} aria-hidden="true" />
                  <span className="text-small font-semibold text-text">{t}</span>
                </Explain>
              ))}
            </ul>
          </Tile>
        </div>
      </div>
    </section>
  );
}

/* ---------- 6. agents and multi-step workflows ---------- */

/** Numbered steps in a row; steps with `llm` are highlighted as the only LLM calls. */
function StepRow({ steps, cols = "md:grid-cols-3 lg:grid-cols-6" }) {
  return (
    <ol className={`grid gap-2 ${cols}`}>
      {steps.map(({ Icon, title, body, tip, llm }, i) => (
        <Explain
          as="li"
          key={title}
          tip={[body, tip].filter(Boolean)}
          title={`ขั้นที่ ${i + 1}: ${title}`}
          className={`relative flex flex-col items-center rounded-xl p-4 text-center ${llm ? "bg-[var(--color-series-1)] text-white" : "border border-border bg-bg/60 backdrop-blur-md text-text"}`}
        >
          <span className={`tabular absolute top-2 right-3 text-tiny font-semibold ${llm ? "text-white/80" : "text-text-muted"}`}>{i + 1}</span>
          <Icon className={`size-9 ${llm ? "text-white" : "text-accent"}`} strokeWidth={1.5} aria-hidden="true" />
          <p className="mt-2 text-small font-semibold">{title}</p>
        </Explain>
      ))}
    </ol>
  );
}

const PROFILE_STEPS = [
  {
    Icon: ListChecks,
    title: "ระบบตรวจความพร้อม",
    body: "ระบบตรวจ can_generate และโควตาของผู้ใช้",
    tip: "can_generate ตรวจว่าผู้ใช้ยืนยัน CV หรือตอบแบบสอบถามแล้ว และมีข้อมูลเพียงพอสำหรับการสร้างโปรไฟล์ ระบบตรวจโควตาในขั้นนี้ด้วย เพื่อไม่ให้ระบบเรียก LLM เมื่อผู้ใช้ใช้โควตาหมดแล้ว",
  },
  {
    Icon: FileText,
    title: "ระบบสร้าง facts",
    body: "ทุก fact มี evidence id ที่ชี้ไปยังบรรทัดใน CV คำตอบ หรือข้อความในแชท",
    tip: "ขั้นนี้รวบรวมข้อมูลจากทั้ง 3 ช่องทางเป็นรายการเดียว และกำหนด id ให้แต่ละรายการ id เหล่านี้กลายเป็นหมายเลขอ้างอิงที่ผู้ใช้เห็นบนโปรไฟล์",
  },
  {
    Icon: EyeOff,
    title: "ระบบตัดข้อมูลส่วนตัว",
    body: "ระบบไม่ส่งอีเมล ลิงก์ และเบอร์โทรศัพท์ให้ LLM",
    tip: "ข้อมูลเหล่านี้ไม่จำเป็นต่อการสรุปประสบการณ์ ระบบจึงตัดออกก่อนส่งออกไปยังผู้ให้บริการ LLM ภายนอก เพื่อลดความเสี่ยงที่ข้อมูลส่วนตัวของผู้ใช้จะรั่วไหล",
  },
  {
    Icon: Bot,
    title: "LLM เขียนสรุป",
    body: "LLM เขียนสรุปประสบการณ์และสิ่งที่ควรสำรวจในรูปแบบ JSON",
    tip: "ขั้นนี้เป็นขั้นเดียวใน workflow ที่เรียก LLM ระบบจำกัด prompt ไม่ให้เกิน 5,000 tokens และสั่งให้ LLM เขียนจากข้อเท็จจริงที่ได้รับเท่านั้น",
    llm: true,
  },
  {
    Icon: Filter,
    title: "parse_claims ตรวจข้อความ",
    body: "ฟังก์ชันนี้ตัดข้อความที่ไม่มีหลักฐาน หรือมีตัวเลขที่ไม่อยู่ใน facts",
    tip: "นอกจากการตรวจ id และตัวเลข ขั้นนี้ยังตัดข้อความสรุปประสบการณ์ที่อ้างทักษะซึ่งไม่อยู่ใน facts และตัดทักษะที่ผู้ใช้เคยลบออกไปแล้ว",
  },
  {
    Icon: Calculator,
    title: "ระบบบันทึกและจับคู่",
    body: "Python คำนวณความตรงกับ 26 สายงาน",
    tip: "ระบบบันทึกโปรไฟล์พร้อมหลักฐาน แล้วคำนวณเปอร์เซ็นต์ความตรงกับทุกสายงานด้วยสูตรในบทที่ 3 ขั้นนี้ไม่ใช้ LLM และให้ผลเดิมทุกครั้งเมื่อข้อมูลไม่เปลี่ยน",
  },
];

const EDIT_STEPS = [
  {
    Icon: MessageSquare,
    title: "ผู้ใช้พิมพ์คำขอ",
    body: "ผู้ใช้พิมพ์ว่า “เปลี่ยนระดับ SQL เป็น 3”",
    tip: "ผู้ใช้ไม่ต้องเปิดฟอร์มแก้ไข ผู้ใช้สามารถบอกสิ่งที่ต้องการเปลี่ยนด้วยภาษาธรรมดาในแชทได้ทันที",
  },
  {
    Icon: Bot,
    title: "LLM แปลงคำขอ",
    body: "LLM แปลงคำขอเป็น field, op และค่าใหม่",
    tip: "LLM ทำหน้าที่แปลภาษาธรรมชาติให้เป็นคำสั่งที่มีโครงสร้าง LLM ได้รับเฉพาะ field ที่ผู้ใช้ต้องการแก้ จึงใช้ tokens น้อยและไม่เห็นข้อมูลส่วนอื่นของโปรไฟล์",
    llm: true,
  },
  {
    Icon: Filter,
    title: "API ตรวจคำขอ",
    body: "API ตรวจ allow-list ช่วงระดับ 1–4 และชื่อสายงานในแคตตาล็อก",
    tip: "API ปฏิเสธคำสั่งที่แก้ field นอก allow-list หรือใช้ค่าที่ไม่ถูกต้อง เช่น ระดับ 7 หรือสายงานที่ไม่มีอยู่ในระบบ หาก LLM สร้างคำสั่งผิด คำสั่งนั้นจะไม่ผ่านขั้นนี้",
  },
  {
    Icon: MousePointerClick,
    title: "ผู้ใช้กดยืนยัน",
    body: "ระบบแสดงการ์ด “เดิม → ใหม่” และการพิมพ์คำว่า “ยืนยัน” ไม่มีผล",
    tip: "ระบบรับการยืนยันจากการกดปุ่มเท่านั้น เพราะข้อความที่พิมพ์อาจถูกตีความผิดหรือถูกแทรกคำสั่งได้ การกดปุ่มเป็นการกระทำที่ชัดเจนและตรวจสอบได้",
  },
  {
    Icon: RefreshCw,
    title: "ระบบบันทึกและคำนวณใหม่",
    body: "หากค่าเดิมไม่ตรงกับค่าที่บันทึกไว้ ระบบจะแจ้ง EDIT_CONFLICT",
    tip: "ระบบเทียบค่าเดิมบนการ์ดกับค่าในฐานข้อมูลก่อนบันทึก หากผู้ใช้แก้ค่าเดียวกันจากที่อื่นไปแล้ว ระบบจะไม่เขียนทับ หลังบันทึกสำเร็จ ระบบจะคำนวณผลการจับคู่ใหม่ทันที",
  },
];

const LLM_ROUTES = [
  { r: "skill_assessment", tip: "เส้นทางนี้ตอบคำถามเรื่องทักษะของผู้ใช้ ระบบส่งชื่อทักษะ ระดับ และ evidence id ให้ LLM และหากไม่มีข้อความใดผ่าน parse_claims ระบบจะแสดงรายการทักษะที่คำนวณไว้แทน" },
  { r: "blind_spots", tip: "เส้นทางนี้ตอบเรื่องจุดบอด ระบบใช้จุดบอดที่บันทึกไว้ ช่องว่างของ 3 สายงานแรก และบันทึกเรื่อง soft skill จาก RAG 2 ชิ้น" },
  { r: "job_matching", tip: "เส้นทางนี้อธิบายเหตุผลการจับคู่ ระบบส่งผลการจับคู่ที่ Python คำนวณและเส้นทางการเรียนรู้ของสายงานจาก RAG ให้ LLM ส่วนเปอร์เซ็นต์และทักษะที่ต้องเติมยังมาจาก Python" },
  { r: "profile_edit", tip: "เส้นทางนี้แปลงคำขอแก้ไขเป็นข้อเสนอที่ผู้ใช้ต้องกดยืนยัน ตามขั้นตอนในกล่องด้านบน" },
  { r: "gap_question", tip: "เส้นทางนี้ถามคำถามเพิ่มเติมเมื่อข้อมูลยังไม่ครบ Python กำหนดข้อความของคำถามไว้ และ LLM ทำหน้าที่ดึงข้อเท็จจริงจากคำตอบเท่านั้น" },
];

const NO_LLM_ROUTES = [
  { r: "salary", tip: "เส้นทางนี้ตอบเรื่องเงินเดือนจากตารางอ้างอิง ระบบแสดงช่วงเงินเดือน แหล่งที่มา และวันที่จากตารางโดยตรง จึงไม่ใช้ LLM" },
  { r: "market", tip: "เส้นทางนี้ตอบเรื่องตลาดงานจากแคชประกาศงานของแต่ละสายงาน และระบบระบุว่าจำนวนประกาศเป็นตัวอย่างที่มีเพดาน" },
  { r: "work_style", tip: "เส้นทางนี้แสดงความชอบในการทำงานที่ผู้ใช้ตอบไว้ พร้อมบันทึกจาก RAG ที่อธิบายว่าความชอบนั้นมีความหมายอย่างไรในการทำงานจริง" },
  { r: "experience", tip: "เส้นทางนี้แสดงสรุปประสบการณ์และจำนวนเดือนที่บันทึกไว้ เพราะ LLM ได้เรียบเรียงสรุปนี้ไว้แล้วตอนสร้างโปรไฟล์" },
  { r: "small_talk", tip: "เส้นทางนี้ตอบคำทักทายหรือคำขอบคุณด้วยข้อความภาษาไทยที่ทีมกำหนดไว้ จึงไม่ใช้ tokens แต่ระบบยังนับเป็นหนึ่งคำขอ" },
];

const WHY_NOT_AGENT = [
  {
    t: "ทีมทราบต้นทุนล่วงหน้า",
    b: "agent ที่วนเรียกเครื่องมือหลายรอบใช้ tokens ไม่แน่นอน ในขณะที่ Groq จำกัดไว้ที่ 8,000 tokens ต่อนาที",
    tip: "ใน workflow ที่กำหนดด้วยโค้ด ทีมทราบว่าแต่ละงานเรียก LLM กี่ครั้งและใช้ tokens ประมาณเท่าใด ทีมจึงตั้งโควตาต่อผู้ใช้ได้อย่างมั่นใจ",
  },
  {
    t: "ทีมทดสอบได้ทีละขั้น",
    b: "ขั้นที่ไม่ใช้ LLM เป็นโค้ด Python ที่มี unit test รองรับ",
    tip: "เมื่อลำดับขั้นตายตัว ทีมสามารถทดสอบแต่ละขั้นแยกกันได้ และเมื่อเกิดข้อผิดพลาด ทีมก็ระบุได้ทันทีว่าขั้นใดผิด",
  },
  {
    t: "LLM ไม่มีสิทธิ์เขียนข้อมูล",
    b: "ทุกการเปลี่ยนแปลงต้องผ่านการกดยืนยันของผู้ใช้",
    tip: "agent ทั่วไปมักได้รับเครื่องมือที่เขียนข้อมูลได้เอง ซึ่งเสี่ยงต่อ prompt injection ระบบนี้ไม่ให้เครื่องมือแบบนั้นแก่ LLM เลย",
  },
  {
    t: "ระบบยังตอบได้เมื่อ LLM ล้ม",
    b: "เมื่อขั้น LLM ล้ม ระบบจะใช้ข้อความที่คำนวณจากข้อมูลแทน",
    tip: "ทุกขั้นที่ใช้ LLM มีทางสำรองที่เขียนด้วยโค้ด ผู้ใช้จึงยังได้รับคำตอบที่ถูกต้อง แม้คำตอบนั้นจะเรียบเรียงไม่สวยเท่าข้อความจาก LLM",
  },
];

function RouteChips({ routes, llm }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {routes.map(({ r, tip }) => (
        <Explain
          as="code"
          key={r}
          tip={tip}
          title={r}
          className={`rounded-full px-3 py-1 text-small font-semibold ${llm ? "bg-[var(--color-series-1)] text-white" : "border border-border text-text"}`}
        >
          {r}
        </Explain>
      ))}
    </div>
  );
}

function WorkflowSection() {
  return (
    <section id="s6" className="scroll-mt-20 py-20">
      <div className="mx-auto w-full max-w-[1120px] px-4 md:px-6">
        <SectionHeading
          no="6"
          eyebrow="Agents & Multi-step Workflows"
          title="โค้ดกำหนดลำดับขั้นตอน และ LLM ทำงานเพียงบางขั้น"
          tip="agent คือรูปแบบที่ให้ LLM ตัดสินใจเองว่าจะเรียกเครื่องมือใดและทำซ้ำกี่รอบ ส่วน workflow คือรูปแบบที่โค้ดกำหนดลำดับขั้นไว้ล่วงหน้า ทีมเลือก workflow เพราะต้องการต้นทุนที่คาดการณ์ได้และพฤติกรรมที่ทดสอบได้"
        >
          ระบบไม่ได้ใช้ agent ที่ให้ LLM เลือกเครื่องมือและวนทำงานเอง ทุกงานเป็น workflow ที่ทีมทดสอบได้และทราบต้นทุนล่วงหน้า
        </SectionHeading>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Tile
            icon={Workflow}
            title="Workflow สร้างโปรไฟล์มี 6 ขั้น และใช้ LLM เพียง 1 ขั้น"
            note="หากไม่มีข้อความสรุปประสบการณ์ข้อใดผ่านการตรวจ ระบบจะแสดงรายการประสบการณ์ตามที่บันทึกไว้แทน"
            tip="กล่องสีเข้มแสดงขั้นเดียวที่เรียก LLM ขั้นก่อนหน้ามีหน้าที่เตรียมและกรองข้อมูล ส่วนขั้นถัดไปมีหน้าที่ตรวจและคำนวณ โครงสร้างนี้ทำให้ LLM ทำงานในกรอบที่แคบที่สุด"
            className="lg:col-span-2"
          >
            <StepRow steps={PROFILE_STEPS} />
          </Tile>

          <Tile
            icon={UserCheck}
            title="ผู้ใช้แก้โปรไฟล์ผ่านแชทได้ และผู้ใช้ต้องอนุมัติทุกครั้ง"
            note="ข้อเสนอใหม่จะปิดข้อเสนอเก่าของ field เดียวกัน การ์ดเก่าจึงไม่สามารถย้อนการแก้ไขที่ใหม่กว่าได้ นอกจากนี้ การยืนยัน การปฏิเสธ การลบ และการกู้คืนไม่ใช้โควตา"
            tip="workflow นี้เป็นตัวอย่างของ human-in-the-loop ระบบใช้ LLM เพื่อความสะดวกในการสั่งงานด้วยภาษาธรรมชาติ แต่ระบบให้มนุษย์เป็นผู้ตัดสินขั้นสุดท้ายเสมอ"
            className="lg:col-span-2"
          >
            <StepRow steps={EDIT_STEPS} cols="md:grid-cols-5" />
          </Tile>

          <Tile
            icon={Route}
            title="Router เลือก handler และแต่ละเส้นทางดึงเฉพาะข้อมูลที่จำเป็น"
            note="ในเส้นทางกลุ่มแรก LLM เขียนคำตอบ และระบบตรวจคำตอบก่อนแสดง ส่วนในเส้นทางกลุ่มที่สอง LLM ไม่ได้เขียนข้อความ และระบบตอบจากข้อมูลหรือข้อความที่กำหนดไว้ แชทส่งข้อความล่าสุด 4 ข้อความ ซึ่งตัดไว้ที่ 300 ตัวอักษร ไปด้วยเพื่อให้ระบบเข้าใจคำถามต่อเนื่อง แต่ระบบไม่ใช้ข้อความเหล่านี้เป็นแหล่งข้อเท็จจริง"
            tip="แต่ละเส้นทางมี handler ของตนเอง และ handler ดึงเฉพาะข้อมูลที่เส้นทางนั้นต้องใช้ prompt จึงสั้นและตรงประเด็น ผู้ชมสามารถคลิกที่ชื่อเส้นทางแต่ละชื่อเพื่ออ่านว่าเส้นทางนั้นใช้ข้อมูลใด"
          >
            <p className="mb-2 flex items-center gap-2 text-small font-semibold text-text">
              <Bot className="size-5 text-accent" strokeWidth={1.75} aria-hidden="true" />
              LLM เขียนคำตอบ
            </p>
            <RouteChips routes={LLM_ROUTES} llm />
            <p className="mt-5 mb-2 flex items-center gap-2 text-small font-semibold text-text">
              <Database className="size-5 text-accent" strokeWidth={1.75} aria-hidden="true" />
              ตอบจากข้อมูล ไม่ใช้ LLM
            </p>
            <RouteChips routes={NO_LLM_ROUTES} />
          </Tile>

          <Tile
            icon={KeyRound}
            title="ทีมเลือกไม่ใช้ agent ด้วยเหตุผล 4 ข้อ"
            tip="agent เหมาะกับงานเปิดที่ไม่ทราบขั้นตอนล่วงหน้า แต่งานของ CareerMirror มีขั้นตอนที่ชัดเจน การใช้ workflow จึงให้ประโยชน์มากกว่าในทุกด้านที่ทีมให้ความสำคัญ"
          >
            <CheckList items={WHY_NOT_AGENT} />
          </Tile>
        </div>
      </div>
    </section>
  );
}

/* ---------- 7. security and guardrails ---------- */

const GUARD_LAYERS = [
  {
    Icon: Ban,
    title: "ขาเข้า: Guard ตรวจข้อความก่อนส่งถึง LLM",
    chips: ["ว่าง / ยาวเกิน", "prompt injection", "ขอดู system prompt", "นอกขอบเขต"],
    items: [
      "Guard ปฏิเสธข้อความว่างหรือข้อความที่ยาวเกิน 1,000 ตัวอักษร",
      "Guard จับ prompt injection ทั้งภาษาไทยและภาษาอังกฤษ เช่น “ignore previous instructions” และ “ไม่ต้องสนใจคำสั่ง”",
      "Guard ปฏิเสธคำขอดู system prompt แต่ผู้ใช้ยังถามถึงทักษะ “system prompt” ได้",
      "Guard ปฏิเสธเรื่องนอกขอบเขต เช่น หวย ดูดวง และ MBTI",
    ],
    note: "ระบบปฏิเสธทันทีโดยไม่ใช้ LLM และไม่ใช้โควตาของผู้ใช้",
    tip: "Guard เป็นโค้ดที่ตรวจด้วยรูปแบบข้อความ จึงทำงานเร็วและไม่มีต้นทุน Guard แยกความต่างระหว่างการขอดู system prompt ซึ่งเป็นการโจมตี กับการถามถึงทักษะการเขียน system prompt ซึ่งเป็นคำถามปกติของสายงาน AI",
  },
  {
    Icon: Filter,
    title: "ขาออก: ระบบตรวจทุกข้อความก่อนแสดง",
    chips: ["evidence id", "ตัวเลข", "ชื่อเครื่องมือ / บริษัท"],
    items: [
      "parse_claims ตัดข้อความที่อ้าง evidence id ที่ไม่มีอยู่จริง",
      "ตัวเลขในข้อความต้องตรงกับค่าที่คำนวณ และหากไม่ตรง ระบบจะใช้ template แทน",
      "ระบบตัดข้อความที่อ้างชื่อเครื่องมือ บริษัท หรือใบรับรองที่ไม่อยู่ใน facts",
    ],
    note: "ระบบยังตรวจชื่อที่เขียนเป็นภาษาไทยด้วยวิธีนี้ไม่ได้",
    tip: "การตรวจขาออกป้องกันกรณีที่ LLM แต่งข้อมูลขึ้นเอง แม้ prompt จะสั่งไว้ชัดเจนแล้วก็ตาม การตรวจชื่อเฉพาะทำงานกับชื่อที่เขียนด้วยอักษรละติน เพราะระบบเทียบกับค่าใน facts ได้ตรงตัว ส่วนชื่อภาษาไทยยังเป็นข้อจำกัดที่ทีมยอมรับไว้",
  },
  {
    Icon: UserCheck,
    title: "การกระทำ: LLM เสนอ และผู้ใช้เป็นผู้ตัดสิน",
    chips: ["allow-list", "ตรวจค่า", "กดยืนยัน", "15 นาที"],
    items: ["LLM ไม่สามารถเขียนข้อมูลลงโปรไฟล์ได้เอง", "การแก้ไขต้องอยู่ใน allow-list และต้องผ่านการตรวจค่า", "ระบบบันทึกเมื่อผู้ใช้กดปุ่มยืนยันเท่านั้น"],
    note: "ข้อเสนอแต่ละรายการจะหมดอายุภายใน 15 นาที",
    tip: "ชั้นนี้จำกัดสิ่งที่ LLM ทำได้ แม้ผู้โจมตีจะหลอก LLM สำเร็จ LLM ก็ทำได้เพียงเสนอการแก้ไขที่ผู้ใช้มองเห็นและต้องกดยืนยันเอง ความเสียหายจึงจำกัดอยู่ในขอบเขตที่ผู้ใช้ควบคุมได้",
  },
];

const APP_SECURITY = [
  {
    Icon: Lock,
    title: "ระบบยืนยันตัวตนอย่างปลอดภัย",
    body: "ระบบเก็บรหัสผ่านด้วย bcrypt ใช้ JWT HS256 ใน cookie แบบ httpOnly และ SameSite=Lax และจำกัดจำนวนการ login ผิดต่อนาที",
    tip: "bcrypt ทำให้การเดารหัสผ่านจากฐานข้อมูลที่รั่วไหลทำได้ยาก cookie แบบ httpOnly ป้องกันไม่ให้ JavaScript อ่าน token ได้ และ SameSite=Lax ลดความเสี่ยงจาก CSRF การจำกัดจำนวนการ login ผิดช่วยป้องกันการเดารหัสผ่านซ้ำ ๆ",
  },
  {
    Icon: Server,
    title: "API ทำหน้าที่เป็น trust boundary",
    body: "เว็บเรียก API ผ่าน proxy ฝั่ง server และ API ตรวจสิทธิ์ ตรวจ body และจำกัดขนาดของ JSON และไฟล์",
    tip: "trust boundary คือจุดที่ระบบเลิกเชื่อข้อมูลจากภายนอกและเริ่มตรวจทุกอย่าง ทีมวางจุดนี้ไว้ที่ API ทุกคำขอจึงถูกตรวจซ้ำที่ API แม้จะผ่านหน้าเว็บมาแล้วก็ตาม",
  },
  {
    Icon: Gauge,
    title: "ระบบจำกัดโควตาของผู้ใช้แต่ละคน",
    body: "ผู้ใช้แต่ละคนใช้ได้ 40 คำขอและ 40,000 tokens ต่อวัน ระบบตรวจก่อนเรียก LLM และเมื่อเกินโควตา ระบบจะตอบ 429 พร้อมเวลารีเซ็ต",
    tip: "โควตาป้องกันการใช้งานเกินขอบเขตทั้งโดยตั้งใจและไม่ตั้งใจ ระบบตรวจโควตาก่อนเรียก LLM ทุกครั้ง และคืนโควตาให้ผู้ใช้เมื่อการเรียก LLM ล้มเหลว",
  },
  {
    Icon: ShieldAlert,
    title: "ระบบจำกัดสิทธิ์การเข้าหน้า Admin",
    body: "เฉพาะอีเมลที่อยู่ใน ADMIN_EMAILS เท่านั้นที่เข้าได้ และผู้ใช้อื่นจะได้รับ 403",
    tip: "หน้า Admin แสดงสถิติการใช้งานของระบบ ทีมจึงกำหนดรายชื่อผู้ดูแลไว้ในค่าตั้งค่าของ server ซึ่งผู้ใช้ทั่วไปไม่สามารถแก้ไขได้",
  },
  {
    Icon: EyeOff,
    title: "ระบบปกป้องข้อมูลส่วนตัว",
    body: "ระบบไม่เก็บไฟล์ PDF ไม่บันทึก log ของข้อความใน CV, prompt หรือคำตอบ และตัดอีเมล ลิงก์ และเบอร์โทรศัพท์ก่อนส่งให้ LLM",
    tip: "หลักการนี้เรียกว่าการเก็บข้อมูลเท่าที่จำเป็น ระบบอ่าน CV แล้วเก็บเฉพาะข้อมูลที่ผู้ใช้ยืนยัน log ของระบบจึงไม่มีข้อมูลส่วนตัวที่อาจรั่วไหลได้ เมื่อทีมเปิดใช้ Jev ระบบส่งให้ TypeSafe เฉพาะข้อความและบทสนทนาล่าสุด และไม่ส่ง CV หรือโปรไฟล์",
  },
  {
    Icon: KeyRound,
    title: "ทีมเก็บ secrets อย่างปลอดภัย",
    body: "ทีมเก็บ key ไว้ในไฟล์ .env เท่านั้น และ repo มีเพียงไฟล์ .env.example",
    tip: "ไฟล์ .env.example บอกชื่อตัวแปรที่ระบบต้องใช้ แต่ไม่มีค่าจริง ผู้ที่เข้าถึง repo จึงไม่สามารถนำ API key ของทีมไปใช้ได้",
  },
];

function SecuritySection() {
  return (
    <section id="s7" className="bg-section-wash scroll-mt-20 py-20">
      <div className="mx-auto w-full max-w-[1120px] px-4 md:px-6">
        <SectionHeading
          no="7"
          eyebrow="Security & Guardrails"
          title="ระบบป้องกันทั้งขาเข้า ขาออก และขอบเขตการกระทำของ LLM"
          tip="ทีมไม่พึ่งให้ LLM ปฏิเสธคำขอที่ไม่เหมาะสมเอง เพราะ LLM อาจถูกหลอกด้วย prompt injection ได้ ทีมจึงวาง guardrail เป็นโค้ดไว้ 3 จุด คือก่อนถึง LLM หลัง LLM ตอบ และที่ขอบเขตสิทธิ์ของ LLM"
        >
          guardrail ทุกชั้นเป็นโค้ด และระบบไม่ได้พึ่งให้ LLM ปฏิเสธคำขอเอง
        </SectionHeading>

        <ol className="mt-12 grid gap-5 lg:grid-cols-3">
          {GUARD_LAYERS.map(({ Icon, title, chips, items, note, tip }) => (
            <Explain as="li" key={title} tip={[...items, note, tip]} title={title} className="flex flex-col items-center rounded-2xl border border-border bg-surface p-5 text-center shadow-sm">
              <span className="inline-flex size-16 items-center justify-center rounded-2xl bg-primary text-on-primary">
                <Icon className="size-8" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-small font-semibold text-text">{title}</h3>
              <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
                {chips.map((c) => (
                  <li key={c} className="rounded-full border border-border bg-bg/60 backdrop-blur-md px-2.5 py-0.5 text-tiny font-semibold text-text-muted">
                    {c}
                  </li>
                ))}
              </ul>
            </Explain>
          ))}
        </ol>

        <Tile
          icon={ShieldCheck}
          title="ระบบมีมาตรการความปลอดภัยระดับแอป 6 ด้าน"
          tip="นอกจาก guardrail ของ AI ระบบยังมีมาตรการพื้นฐานของเว็บแอปที่ดี ตั้งแต่การยืนยันตัวตนไปจนถึงการเก็บ secrets ผู้ชมสามารถคลิกที่แต่ละด้านเพื่ออ่านว่ามาตรการนั้นป้องกันความเสี่ยงใด"
          className="mt-5"
        >
          <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {APP_SECURITY.map(({ Icon, title, body, tip }) => (
              <Explain as="li" key={title} tip={[body, tip]} title={title} className="flex items-center gap-3 rounded-xl border border-border bg-bg/60 backdrop-blur-md p-3">
                <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-accent">
                  <Icon className="size-6" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span className="text-small font-semibold text-text">{title}</span>
              </Explain>
            ))}
          </ul>
        </Tile>
      </div>
    </section>
  );
}

/* ---------- 8. evaluation and reliability ---------- */

const ROUTER_LAYER_SCORES = [
  { k: "Guard", v: "1/1", tip: "Guard ตัดสินถูก 1 ข้อจาก 1 ข้อที่ไปถึงชั้นนี้" },
  { k: "Rules", v: "4/7 → 6/7", tip: "Keyword rules ตัดสินถูก 4 ข้อจาก 7 ข้อในชุดแรก หลังจากทีมแก้กฎ ชั้นนี้ตัดสินถูก 6 ข้อจาก 7 ข้อในชุดที่สอง" },
  { k: "LLM", v: "26/26", tip: "LLM classifier ตัดสินถูกครบทั้ง 26 ข้อที่ไปถึงชั้นนี้" },
];

const RAG_BARS = [
  { label: "Hybrid hit@3", value: 0.93, strong: true, mark: 0.8, tip: "hit@3 คือสัดส่วนของคำถามที่เอกสารที่ถูกต้องปรากฏใน 3 อันดับแรก การค้นแบบ hybrid ได้ 0.93 ซึ่งหมายความว่าระบบค้นถูกประมาณ 28 คำถามจาก 30 คำถาม" },
  { label: "Vector hit@3", value: 0.9, mark: 0.8, tip: "การค้นด้วยเวกเตอร์เพียงอย่างเดียวได้ 0.90 หรือประมาณ 27 คำถามจาก 30 คำถาม ซึ่งต่ำกว่าแบบ hybrid เล็กน้อย" },
  { label: "BM25 hit@3", value: 0.83, mark: 0.8, tip: "BM25 เพียงอย่างเดียวได้ 0.83 หรือประมาณ 25 คำถามจาก 30 คำถาม เพราะ BM25 พลาดคำถามที่ใช้ถ้อยคำต่างจากเอกสาร" },
  { label: "Hybrid hit@1", value: 0.7, tip: "hit@1 วัดว่าเอกสารที่ถูกต้องอยู่อันดับแรกพอดีหรือไม่ ค่า 0.70 หมายความว่าระบบจัดเอกสารที่ถูกไว้อันดับแรกประมาณ 21 คำถามจาก 30 คำถาม ระบบจึงส่งเอกสารหลายชิ้นให้ LLM แทนการส่งเพียงชิ้นเดียว" },
];

const SAMPLE_PROFILES = [
  { who: "โปรไฟล์ของนักศึกษาได้ผลดังนี้", short: "นักศึกษา", rows: [["นักพัฒนาเว็บ", 69], ["Full-stack", 59], ["Frontend", 55]] },
  { who: "โปรไฟล์ของ Full-stack developer ได้ผลดังนี้", short: "Full-stack developer", rows: [["Full-stack", 86]] },
  { who: "โปรไฟล์ของ ML developer ได้ผลดังนี้", short: "ML developer", rows: [["AI engineer", 68], ["ML engineer", 66], ["Data scientist", 62]] },
];

const RELIABILITY = [
  { Icon: RefreshCw, title: "ระบบลองใหม่ 1 ครั้ง", body: "ระบบลองใหม่เมื่อพบ 429, error หรือปัญหาเครือข่าย", tip: "ข้อผิดพลาดส่วนใหญ่ของ Groq เกิดขึ้นชั่วคราว เช่น การเกินเพดานต่อนาที การลองใหม่เพียงครั้งเดียวจึงกู้คืนได้เกือบทุกกรณีโดยไม่ทำให้ผู้ใช้รอนานเกินไป" },
  { Icon: GitMerge, title: "ระบบสลับไปใช้โมเดลสำรอง", body: "โมเดลสำรองคือ qwen3.8-27b", tip: "Groq นับเพดานแยกตามโมเดล เมื่อโมเดลหลักเกินเพดาน โมเดลสำรองจึงมักยังมีโควตาเหลืออยู่" },
  { Icon: TriangleAlert, title: "ระบบแจ้งผู้ใช้เป็นภาษาไทย", body: "ระบบแจ้งข้อผิดพลาดและคืนโควตาให้ผู้ใช้", tip: "เมื่อทั้งสองโมเดลล้ม ระบบจะแจ้งผู้ใช้ด้วยข้อความที่เข้าใจง่าย และคืนโควตาที่หักไป ผู้ใช้จึงไม่เสียโควตาจากความผิดพลาดที่ไม่ได้เกิดจากตนเอง" },
];

const DEGRADE = [
  { t: "เมื่อ LLM ล้มขณะเขียนคำตอบ", b: "ระบบใช้ข้อความ template ที่สร้างจากข้อมูลที่คำนวณแล้ว", tip: "template ใช้ข้อมูลชุดเดียวกับที่ส่งให้ LLM ผู้ใช้จึงยังได้รับข้อเท็จจริงที่ถูกต้องครบถ้วน แม้ภาษาจะเป็นรูปแบบคงที่" },
  { t: "เมื่อ index ของ RAG ยังไม่พร้อม", b: "ระบบตอบจากข้อมูลส่วนอื่นได้ และ API พร้อมใช้งานทันทีตั้งแต่เริ่มทำงาน", tip: "API ไม่ต้องรอให้ index ของ RAG พร้อมก่อนรับคำขอแรก ผู้ใช้จึงเริ่มใช้งานส่วนอื่นได้ทันที และคำตอบจะได้ความรู้จาก RAG เสริมเมื่อ index พร้อมแล้ว" },
  { t: "เมื่อระบบดึงข้อมูลงานไม่สำเร็จ", b: "ระบบแสดงแคชเดิมพร้อมวันที่ของข้อมูล", tip: "ผู้ใช้ยังเห็นข้อมูลตลาดงานล่าสุดที่ระบบมี และวันที่ที่แสดงช่วยให้ผู้ใช้ทราบว่าข้อมูลนั้นเก่าเพียงใด" },
  { t: "เมื่อโควตาของผู้ใช้หมด", b: "ผู้ใช้ยังยืนยัน ปฏิเสธ ลบ และกู้คืนข้อเสนอได้", tip: "การกระทำเหล่านี้ไม่เรียก LLM ระบบจึงไม่นับเป็นโควตา ผู้ใช้จึงจัดการข้อเสนอที่ค้างอยู่ได้เสมอ" },
];

const EVAL_LIMITS = [
  "ชุดทดสอบยังมีขนาดเล็กและทีมเขียนขึ้นเอง ดังนั้นตัวเลขจริงอาจต่ำกว่านี้",
  "ทีมแยกชุดที่ใช้ปรับระบบ (47 ข้อ) ออกจากชุดที่ใช้วัดผล",
  "ทีมยังไม่ได้ทดสอบระบบกับผู้ใช้จริง",
  "ทีมยังไม่ได้ประเมินคุณภาพคำอธิบายของ LLM ด้วยคนหรือด้วย LLM-as-judge",
];

function EvaluationSection() {
  return (
    <section id="s8" className="scroll-mt-20 py-20">
      <div className="mx-auto w-full max-w-[1120px] px-4 md:px-6">
        <SectionHeading
          no="8"
          eyebrow="Evaluation & Reliability"
          title="ทีมวัดผลด้วยชุดข้อมูลภาษาไทย และระบบทำงานต่อได้เมื่อบางส่วนล้ม"
          tip="ชุดข้อมูล held-out คือชุดที่ทีมไม่ได้ใช้ในการปรับระบบ ผลที่วัดได้จึงสะท้อนความสามารถจริงมากกว่าการวัดกับชุดที่ทีมเคยเห็น เมื่อทีมนำชุดใดไปแก้ระบบแล้ว ชุดนั้นจะไม่ถือเป็น held-out อีกต่อไป"
        >
          ทีมแยกชุดที่ใช้ปรับระบบออกจากชุดที่ใช้วัดผล เมื่อชุดใดถูกใช้แก้ระบบแล้ว ทีมจะเขียนชุดใหม่มาวัดแทน
        </SectionHeading>

        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <Tile
            icon={Route}
            title="AI Router ตอบถูกมากขึ้นบนชุด held-out ภาษาไทย 34 ข้อ"
            note="ข้อผิดพลาดทั้งหมดมาจาก keyword rules และไม่ได้มาจาก LLM ทีมรันการทดสอบนี้ด้วย qwen3.8-27b เมื่อวันที่ 4 พ.ย."
            tip="ทีมวัดชุดแรกแล้วพบว่าข้อผิดพลาดมาจาก keyword rules ทีมจึงแก้กฎ แล้วเขียนชุดที่สองขึ้นใหม่เพื่อวัดผลหลังแก้ ความแม่นยำเพิ่มจาก 91% เป็น 97%"
          >
            <Columns
              max={100}
              items={[
                { label: "ชุดแรกวัดก่อนทีมแก้กฎ", value: 91, text: "91%" },
                { label: "ชุดที่สองวัดหลังทีมแก้กฎ", value: 97, text: "97%", strong: true },
              ]}
            />
            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              {ROUTER_LAYER_SCORES.map(({ k, v, tip }) => (
                <Explain key={k} tip={tip} title={k} className="rounded-xl border border-border bg-bg/60 backdrop-blur-md px-2 py-2">
                  <p className="text-tiny text-text-muted">{k}</p>
                  <p className="tabular text-small font-semibold text-text">{v}</p>
                </Explain>
              ))}
            </div>
          </Tile>

          <Tile
            icon={Search}
            title="RAG ค้นเอกสารได้ถูกต้องบน golden set ภาษาไทย 30 คำถาม"
            note="เส้นประแสดงเกณฑ์ 0.8 ผลลัพธ์ผ่านเกณฑ์ ทีมจึงใช้ e5-base ต่อโดยไม่ต้องเปลี่ยนเป็น bge-m3 ที่มีขนาดใหญ่กว่า และการค้นแบบ hybrid ให้ผลดีกว่าการใช้วิธีเดียว"
            tip="golden set คือชุดคำถามที่ทีมกำหนดคำตอบที่ถูกต้องไว้ล่วงหน้า ทีมตั้งเกณฑ์ไว้ว่าหาก hit@3 ต่ำกว่า 0.8 ทีมจะเปลี่ยนไปใช้โมเดล bge-m3 ที่ใหญ่กว่า"
          >
            <ul className="space-y-3">
              {RAG_BARS.map((b, i) => (
                <GrowBar key={b.label} label={b.label} value={b.value} text={b.value.toFixed(2)} strong={b.strong} mark={b.mark} delay={i * 90} tip={b.tip} />
              ))}
            </ul>
          </Tile>

          <Tile
            icon={UserRound}
            title="ทีมปรับเกณฑ์การจับคู่ด้วยโปรไฟล์ตัวอย่าง 3 แบบ"
            note="เส้นประแสดงเกณฑ์ 60% สายงานที่ตรงกับโปรไฟล์ติด 3 อันดับแรก สายงานที่ไม่เกี่ยวข้องได้ต่ำกว่า 30% และนักศึกษาเห็นเพียง 1 สายงานที่เกณฑ์ 60%"
            tip="ทีมสร้างโปรไฟล์ตัวอย่างที่ทราบคำตอบล่วงหน้า แล้วตรวจว่าสายงานที่ควรตรงขึ้นมาอยู่อันดับต้น และสายงานที่ไม่เกี่ยวข้องได้คะแนนต่ำ ผลการตรวจทำให้ทีมคงน้ำหนักและเกณฑ์ 60% ไว้"
          >
            <div className="space-y-4">
              {SAMPLE_PROFILES.map((p) => (
                <div key={p.who}>
                  <p className="mb-1.5 text-tiny font-semibold text-text">{p.short}</p>
                  <ul className="space-y-1.5">
                    {p.rows.map(([role, pct], i) => (
                      <GrowBar
                        key={role}
                        label={role}
                        value={pct}
                        max={100}
                        text={`${pct}%`}
                        strong={pct >= 60}
                        mark={60}
                        delay={i * 80}
                        tip={
                          pct >= 60
                            ? `สายงาน ${role} ได้ ${pct}% ซึ่งผ่านเกณฑ์ 60% ระบบจึงแสดงสายงานนี้ในผลการจับคู่`
                            : `สายงาน ${role} ได้ ${pct}% ซึ่งต่ำกว่าเกณฑ์ 60% ระบบจึงไม่แสดงสายงานนี้ในรายการหลัก`
                        }
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Tile>

          <div className="grid gap-5 sm:grid-cols-2">
            <Tile
              icon={CheckCircle2}
              title="ชุดทดสอบ End-to-end ของ API ผ่านทั้งหมด"
              note="การทดสอบกลุ่ม A–F ผ่านทั้งหมดในการรันวันที่ 4 พ.ย."
              tip="การทดสอบ end-to-end เรียก API จริงและแบ่งเป็น 6 กลุ่ม ได้แก่ การยืนยันตัวตน การอ่าน CV แบบสอบถาม โปรไฟล์และสายงาน แชทและการแก้ไข และโควตากับหน้า Admin การทดสอบนี้ยืนยันว่าทุกส่วนทำงานร่วมกันได้"
            >
              <Big value="78/78" caption="กลุ่ม A–F ผ่าน" />
            </Tile>
            <Tile
              icon={ListChecks}
              title="ชุด Unit test และ integration test ผ่านทั้งหมด"
              tip="unit test ตรวจฟังก์ชันแต่ละตัว เช่น สูตรคะแนนและ parse_claims ส่วน integration test ตรวจการทำงานร่วมกันของ API กับฐานข้อมูล"
            >
              <Big value="976" caption="pytest ผ่าน" />
            </Tile>
            <Tile
              icon={Gauge}
              title="ชุดทดสอบ e2e ทั้งชุดใช้โควตาเพียงเล็กน้อย"
              tip="ชุดทดสอบ end-to-end ทั้งชุดใช้ 6 คำขอและ 6,861 tokens ซึ่งยังต่ำกว่าโควตาต่อวันของผู้ใช้หนึ่งคน ทีมจึงรันชุดทดสอบซ้ำได้บ่อยโดยไม่กระทบโควตาของ Groq มากนัก"
              className="sm:col-span-2"
            >
              <div className="space-y-3">
                <UsageMeter label="จำนวนคำขอที่ชุดทดสอบใช้" used={6} limit={40} unit="ครั้ง" />
                <UsageMeter label="จำนวน tokens ที่ชุดทดสอบใช้" used={6861} limit={40000} unit="" />
              </div>
            </Tile>
            <Tile
              icon={Clock}
              title="ระบบตอบสนองได้รวดเร็ว"
              note="ระบบตอบคำถามเรื่องทักษะภายใน 1.2 วินาที และปฏิเสธเรื่องนอกขอบเขตภายใน 0.3 วินาที ทีมยังไม่ได้วัด p50 และ p95 ของ LLM โดยตั้งเป้าไว้ไม่เกิน 15 วินาที"
              tip="คำถามเรื่องทักษะต้องเรียก LLM จึงใช้เวลามากกว่า ส่วนการปฏิเสธเรื่องนอกขอบเขตทำที่ Guard โดยไม่เรียก LLM จึงเร็วกว่ามาก ทีมยังต้องวัดค่า p50 และ p95 เพื่อดูการกระจายของเวลาตอบ"
              className="sm:col-span-2"
            >
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-border bg-bg/60 backdrop-blur-md px-2 py-2">
                  <p className="tabular text-h3 font-semibold text-text">1.2 วิ</p>
                  <p className="text-tiny text-text-muted">คำถามเรื่องทักษะ</p>
                </div>
                <div className="rounded-xl border border-border bg-bg/60 backdrop-blur-md px-2 py-2">
                  <p className="tabular text-h3 font-semibold text-text">0.3 วิ</p>
                  <p className="text-tiny text-text-muted">ปฏิเสธนอกขอบเขต</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-warning px-2 py-2">
                  <Pending>ทีมกำลังรอวัดค่านี้</Pending>
                  <p className="mt-1 text-tiny text-text-muted">p50 / p95 · เป้า ≤ 15 วิ</p>
                </div>
              </div>
            </Tile>
          </div>
        </div>

        <h3 className="mt-12 flex items-center justify-center gap-2 text-h3 font-semibold text-text">
          <LifeBuoy className="size-5 text-accent" strokeWidth={1.75} aria-hidden="true" />
          ระบบรับมือกับความล้มเหลวได้หลายระดับ
        </h3>
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <Tile
            icon={TimerOff}
            title="ระบบทำ 3 ขั้นเมื่อเรียก LLM ไม่สำเร็จ"
            note="งาน Router มี timeout 7 วินาทีต่อครั้ง และระบบลองใหม่ทันที โดยทีมตั้งเป้าเวลารวมไว้ไม่เกิน 15 วินาที"
            tip="ลำดับนี้เรียงจากวิธีที่ผู้ใช้แทบไม่รู้สึกถึงปัญหา ไปจนถึงการแจ้งผู้ใช้โดยตรง ระบบจึงแจ้งข้อผิดพลาดเฉพาะเมื่อทุกทางสำรองใช้ไม่ได้แล้ว"
          >
            <ol className="space-y-2">
              {RELIABILITY.map(({ Icon, title, body, tip }, i) => (
                <Explain as="li" key={title} tip={[body, tip]} title={title} className="flex items-center gap-3 rounded-xl border border-border bg-bg/60 backdrop-blur-md p-3">
                  <span className="tabular inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-tiny font-semibold text-on-primary">{i + 1}</span>
                  <Icon className="size-6 shrink-0 text-accent" strokeWidth={1.5} aria-hidden="true" />
                  <span className="text-small font-semibold text-text">{title}</span>
                </Explain>
              ))}
            </ol>
          </Tile>

          <Tile
            icon={Server}
            title="ทีมพบปัญหาจริงระหว่างการทดสอบวันที่ 4 พ.ย."
            note="LLM timeout 4 ครั้งจาก 380 ครั้ง หรือประมาณ 1% หลังจากทีมเพิ่มการลองใหม่ ครั้งถัดมาที่ timeout ได้คำตอบจากการลองใหม่ นอกจากนี้ Groq ตอบ 429 จำนวน 22 ครั้งขณะทีมรันชุดทดสอบต่อกัน การลองใหม่กู้คืนได้ทั้งหมดและไม่มีเส้นทางใดเปลี่ยน แต่ใช้เวลาประมาณ 55 วินาทีแทน 8 วินาที"
            tip="ตัวเลขเหล่านี้มาจากการรันชุดทดสอบจริงกับ Groq ไม่ใช่การจำลอง ผลแสดงว่ากลไกลองใหม่ที่ทีมเพิ่มเข้าไปกู้คืนความล้มเหลวได้ทั้งหมด แต่การเกินเพดานต่อนาทีทำให้เวลารวมเพิ่มขึ้นอย่างชัดเจน"
          >
            <div className="space-y-5">
              <Big value="4/380" caption="LLM timeout (~1%)" />
              <Big value="22×" unit="429" caption="กู้คืนได้ทั้งหมด · 55 วิ แทน 8 วิ" />
            </div>
          </Tile>

          <Tile
            icon={LifeBuoy}
            title="ระบบส่วนอื่นยังทำงานได้เมื่อบางส่วนล้ม"
            tip="แนวคิดนี้เรียกว่า graceful degradation ระบบออกแบบให้แต่ละส่วนล้มได้โดยไม่ลากส่วนอื่นล้มตาม ผู้ใช้จึงยังใช้งานหลักได้แม้บริการภายนอกมีปัญหา"
          >
            <ul className="space-y-2">
              {DEGRADE.map(({ t, b, tip }) => (
                <Explain as="li" key={t} tip={[b, tip]} title={t} className="flex items-center gap-3 rounded-xl border border-border bg-bg/60 backdrop-blur-md p-3 text-small">
                  <CheckCircle2 className="size-6 shrink-0 text-success" strokeWidth={1.75} aria-hidden="true" />
                  <span className="font-semibold text-text">{t}</span>
                </Explain>
              ))}
            </ul>
          </Tile>
        </div>

        <Explain
          tip={[...EVAL_LIMITS, "ทีมระบุข้อจำกัดเหล่านี้ไว้อย่างเปิดเผย เพื่อให้ผู้ชมตีความตัวเลขในบทนี้ได้อย่างถูกต้อง ตัวเลขเหล่านี้แสดงว่าระบบทำงานได้ตามที่ออกแบบ แต่ยังไม่ได้พิสูจน์ว่าผู้ใช้จริงจะได้รับประโยชน์ในระดับใด"]}
          title="การวัดผลครั้งนี้ยังมีข้อจำกัด 4 ข้อ"
          className="mt-5 rounded-2xl border border-info/40 bg-surface p-5 shadow-sm"
        >
          <h3 className="flex items-center gap-2 text-small font-semibold text-text">
            <TriangleAlert className="size-4 text-info" strokeWidth={2} aria-hidden="true" />
            การวัดผลครั้งนี้ยังมีข้อจำกัด 4 ข้อ
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {["ชุดทดสอบเล็ก", "แยกชุดปรับ / ชุดวัด", "ยังไม่ทดสอบกับผู้ใช้จริง", "ยังไม่ประเมินคุณภาพคำอธิบาย"].map((l) => (
              <li key={l} className="rounded-full border border-info/40 bg-bg/60 backdrop-blur-md px-3 py-1 text-small font-semibold text-text">
                {l}
              </li>
            ))}
          </ul>
        </Explain>
      </div>
    </section>
  );
}

/* ---------- 9. problems ---------- */

const ISSUES = [
  {
    Icon: Server,
    problem: "Groq จำกัดการใช้งานไว้ที่ 8,000 tokens ต่อนาที",
    short: "โควตา · ลองใหม่ · โมเดลสำรอง",
    found: "เมื่อทีมแก้โปรไฟล์ 10 ครั้งติดกัน ระบบได้รับ 429 กลับมา 7 ครั้ง",
    fix: "ทีมเพิ่มโควตาต่อผู้ใช้ จำกัด prompt ไม่ให้เกิน 5K tokens และเพิ่มการลองใหม่และโมเดลสำรอง (ผู้ชมสามารถดูรายละเอียดได้ในบทที่ 8)",
    tip: "ปัญหานี้เป็นข้อจำกัดภายนอกที่ทีมควบคุมไม่ได้ ทีมจึงแก้ที่ฝั่งระบบด้วยการลดปริมาณการใช้และเพิ่มทางสำรอง แทนการพึ่งพาเพดานที่สูงขึ้น",
  },
  {
    Icon: Bot,
    problem: "LLM แต่งข้อความหรือตัวเลขขึ้นเอง",
    short: "parse_claims",
    found: "LLM เขียนประโยคที่ไม่มีหลักฐานรองรับ",
    fix: "parse_claims ตรวจ evidence id และตัวเลขในทุกประโยค",
    tip: "การเขียน prompt ให้รัดกุมขึ้นลดปัญหานี้ได้เพียงบางส่วน ทีมจึงเลือกตรวจผลลัพธ์ด้วยโค้ด ซึ่งรับประกันได้ว่าประโยคที่ไม่มีหลักฐานจะไม่ถึงผู้ใช้",
  },
  {
    Icon: Database,
    problem: "ข้อมูลงานไม่ได้มาจากแหล่งทางการ",
    short: "แคชทุก 7 วัน",
    found: "Apify ดึงประกาศได้ครั้งละ 20 ประกาศ ทีมจึงพึ่งพาการดึงข้อมูลแบบสดไม่ได้",
    fix: "ทีมแคชข้อมูลต่อสายงาน อัปเดตทุก 7 วัน และแสดงวันที่และแหล่งที่มา",
    tip: "การแคชทำให้หน้าเว็บแสดงผลได้ทันทีโดยไม่ต้องรอการดึงข้อมูล และการแสดงวันที่ทำให้ผู้ใช้ทราบว่าข้อมูลเป็นตัวอย่างจากช่วงเวลาใด",
  },
  {
    Icon: FileWarning,
    problem: "ผู้ใช้บางคนอัปโหลด PDF แบบสแกน",
    short: "แจ้งผู้ใช้ · ใช้แบบสอบถามแทน",
    found: "ไฟล์แบบสแกนไม่มีข้อความให้ระบบอ่าน",
    fix: "ระบบแจ้งผู้ใช้เป็นภาษาไทย และผู้ใช้ยังกรอกแบบสอบถามแทนได้",
    tip: "PDF แบบสแกนเก็บเนื้อหาเป็นรูปภาพ ระบบจึงดึงข้อความออกมาไม่ได้หากไม่มี OCR ทีมเลือกแจ้งผู้ใช้และเสนอทางเลือกอื่น แทนการเพิ่ม OCR ซึ่งเพิ่มความซับซ้อนของระบบ",
  },
  {
    Icon: Target,
    problem: "นักศึกษาเห็นสายงานเพียง 1 สายงานที่เกณฑ์ 60%",
    short: "แสดงสายงานที่ใกล้ที่สุด",
    found: "การปรับเกณฑ์ไม่ผ่านการตรวจ 1 ข้อ",
    fix: "ทีมคงเกณฑ์ไว้ และระบบแสดงสายงานที่ใกล้ที่สุดพร้อมทักษะที่ต้องเติม",
    tip: "หากทีมลดเกณฑ์ลง สายงานที่ไม่เหมาะสมจะปรากฏขึ้นสำหรับผู้ใช้กลุ่มอื่นด้วย ทีมจึงคงเกณฑ์ไว้ และช่วยนักศึกษาด้วยการแสดงสายงานที่เกือบผ่านพร้อมสิ่งที่ต้องพัฒนา",
  },
  {
    Icon: Clock,
    problem: "เดือนประสบการณ์ไม่ตรงหลังผู้ใช้แก้ฟอร์ม CV",
    short: "คำนวณใหม่จากวันที่",
    found: "ระบบนำเดือนประสบการณ์มาจากการอ่าน CV ครั้งแรกเท่านั้น",
    fix: "ระบบคำนวณเดือนประสบการณ์ใหม่จากวันที่ทุกครั้งที่ผู้ใช้บันทึก",
    tip: "ข้อผิดพลาดนี้เกิดจากการเก็บค่าที่คำนวณแล้วไว้แทนการคำนวณจากข้อมูลต้นทาง ทีมแก้โดยให้ระบบคำนวณจากวันที่ทุกครั้ง ค่าจึงตรงกับข้อมูลล่าสุดเสมอ",
  },
];

const EMBED_BARS = [
  { label: "ReactJS → React", value: 0.84, strong: true, tip: "คู่ที่ถูก: คู่คำนี้เป็นทักษะเดียวกันที่เขียนต่างกัน และได้ความคล้าย 0.84" },
  { label: "ทำอาหาร", value: 0.83, tip: "คำที่ไม่เกี่ยว: คำนี้ไม่เกี่ยวกับ React เลย แต่ได้ความคล้าย 0.83 ซึ่งใกล้กับคู่ที่ถูกมาก ทีมจึงตั้ง threshold เพื่อแยกสองกรณีนี้ไม่ได้" },
  { label: "ขับรถ", value: 0.83, tip: "คำที่ไม่เกี่ยว: คำนี้ก็ได้ความคล้าย 0.83 เช่นกัน ผลนี้แสดงว่าโมเดล embedding ไม่เหมาะกับการเทียบคำสั้น ๆ ที่ไม่มีบริบท" },
];

function ProblemsSection() {
  return (
    <section id="s9" className="bg-section-wash scroll-mt-20 py-20">
      <div className="mx-auto w-full max-w-[1120px] px-4 md:px-6">
        <SectionHeading
          no="9"
          eyebrow="ทีมพบปัญหาใดและแก้ไขอย่างไร"
          title="ทีมพบปัญหาระหว่างการพัฒนา และแก้ไขด้วยวิธีต่อไปนี้"
          tip="บทนี้รวบรวมปัญหาที่ทีมพบจริงระหว่างการพัฒนา แต่ละการ์ดระบุปัญหา สิ่งที่ทีมสังเกตเห็น และวิธีที่ทีมแก้ไข ผู้ชมสามารถคลิกที่การ์ดเพื่ออ่านเหตุผลเบื้องหลังวิธีแก้"
        />

        <div className="mt-12 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <Tile
            icon={MessageSquare}
            title="Embedding ไม่สามารถใช้จับคู่ชื่อทักษะได้"
            note="ทีมทดสอบ multilingual-e5-base กับคำ 25 คำ และพบว่าคำที่ไม่เกี่ยวข้องได้คะแนนใกล้เคียงกับคู่ที่ถูกต้อง ทีมจึงไม่สามารถตั้ง threshold เพื่อแยกสองกลุ่มออกจากกันได้"
            tip="ทีมคาดว่า embedding จะช่วยจับคู่ชื่อทักษะที่ผู้ใช้เขียนต่างกันได้ แต่ผลการทดสอบแสดงว่าคำสั้นที่ไม่มีบริบทได้ความคล้ายสูงเกือบเท่ากันหมด ทีมจึงเปลี่ยนไปใช้วิธีที่แน่นอนกว่า"
          >
            <ul className="space-y-3">
              {EMBED_BARS.map((b, i) => (
                <GrowBar key={b.label} label={b.label} value={b.value} text={b.value.toFixed(2)} strong={b.strong} delay={i * 90} tip={b.tip} />
              ))}
            </ul>
            <div className="pt-5">
              <Explain
                tip="ทีมใช้ taxonomy และชื่อเรียกอื่น (alias) แทน และระบบเก็บทักษะที่ไม่รู้จักไว้ตามคำที่ผู้ใช้เขียน taxonomy คือรายการทักษะมาตรฐานที่ทีมกำหนดไว้ และแต่ละทักษะมีรายชื่อเรียกอื่น เช่น ReactJS และ React.js การเทียบกับรายชื่อนี้ให้ผลที่แน่นอนและตรวจสอบได้ ส่วนทักษะที่ไม่อยู่ในรายการ ระบบจะเก็บไว้ตามคำที่ผู้ใช้เขียนโดยไม่เดา"
                title="ทีมเปลี่ยนไปใช้ taxonomy และ alias"
                className="flex items-center gap-2 rounded-xl border border-success/40 bg-success/10 backdrop-blur-md p-3 text-small text-text"
              >
                <CheckCircle2 className="size-6 shrink-0 text-success" strokeWidth={1.75} aria-hidden="true" />
                <span className="font-semibold">ใช้ taxonomy + alias แทน</span>
              </Explain>
            </div>
          </Tile>

          <ul className="grid gap-3 sm:grid-cols-2">
            {ISSUES.map(({ Icon, problem, short, found, fix, tip }) => (
              <Explain as="li" key={problem} tip={[`สิ่งที่ทีมพบ: ${found}`, `วิธีแก้: ${fix}`, tip]} title={problem} className="flex flex-col rounded-2xl border border-border bg-surface p-4 shadow-sm">
                <p className="flex items-start gap-3 text-small font-semibold text-text">
                  <Icon className="size-7 shrink-0 text-warning" strokeWidth={1.5} aria-hidden="true" />
                  {problem}
                </p>
                <p className="mt-auto flex w-fit items-center gap-1.5 rounded-full bg-success/10 backdrop-blur-md px-3 py-1 text-tiny font-semibold text-text">
                  <CheckCircle2 className="size-4 shrink-0 text-success" strokeWidth={2} aria-hidden="true" />
                  {short}
                </p>
              </Explain>
            ))}
          </ul>
        </div>
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
        <h2 className="mx-auto mt-4 max-w-3xl text-h1 font-bold text-hero-fg md:text-[44px] md:leading-[62px]">AI ทำหน้าที่แยกเจตนา ดึงข้อเท็จจริง และเขียนคำอธิบาย</h2>
        <p className="mx-auto mt-3 max-w-2xl text-body text-hero-muted">
          Python คำนวณคะแนนและตัวเลขทั้งหมด ทุกข้อความมีหลักฐานกำกับ และทีมวัดผลทั้ง Router และ RAG ด้วยชุดข้อมูลภาษาไทย
        </p>
      </div>
    </section>
  );
}

export default function PresentPage() {
  return (
    <div className="present-type">
      <PresentTimeline />
      <ExplainLayer />
      <Hero />
      <ProblemSection />
      <ArchitectureSection />
      <AiMatrixSection />
      <TechniquesSection />
      <JevSection />
      <WorkflowSection />
      <SecuritySection />
      <EvaluationSection />
      <ProblemsSection />
      <Closing />
    </div>
  );
}

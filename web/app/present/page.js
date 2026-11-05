import {
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
  MousePointer2,
  Quote,
  RefreshCw,
  Route,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TimerOff,
  TriangleAlert,
  UserCheck,
  UserRound,
  Workflow,
} from "lucide-react";
import { DotGrid } from "@/components/motion/dot-grid";
import { ShaderBackground } from "@/components/ui/shader-background";
import { Columns, GrowBar, UsageMeter } from "@/components/present/present-visuals";
import { PresentTimeline } from "@/components/present/present-timeline";
import { Explain, ExplainLayer } from "@/components/present/explain";
import { CHAPTERS } from "@/components/present/chapters";

// Presentation page /present: CareerMirror for the course presentation. Chapters:
// problem, how AI fits, AI vs no AI, techniques, multi-step workflows, security and
// guardrails, evaluation and reliability, problems (docs/Presentation.md, with the
// workflow and security chapters drawn from Design.md §3–4 and the api code).
// Not linked from anywhere and not indexed. Every number
// comes from docs/Design.md, e2e/runs and the test runs; numbers not measured yet
// are marked as pending.
// Copy rule: every Thai text is a full semi-formal sentence (subject, verb, object),
// and every block carries a longer Thai explanation shown on hover (`tip`, explain.js).

export const metadata = {
  title: "การนำเสนอโปรเจกต์ CareerMirror",
  robots: { index: false, follow: false },
};

const BRAND_SILK = ["#0a1820", "#173d55", "#6fbfae", "#0f2230"];

/* ---------- shared pieces ---------- */

function SectionHeading({ no, eyebrow, title, tip, children }) {
  return (
    <Explain tip={tip} title={tip ? title : undefined} className="mx-auto max-w-4xl rounded-2xl p-2 text-center">
      <p className="text-tiny font-semibold tracking-[0.12em] text-accent uppercase">
        <span className="tabular mr-2 rounded-full bg-primary-subtle px-2 py-0.5 text-text">{no}</span>
        {eyebrow}
      </p>
      <h2 className="mt-3 text-h1 font-bold text-text md:text-[40px] md:leading-[56px]">{title}</h2>
      {children && <p className="mt-3 text-body text-text-muted">{children}</p>}
    </Explain>
  );
}

function Tile({ icon: Icon, title, tip, className = "", children }) {
  return (
    <Explain tip={tip} title={tip ? title : undefined} className={`flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm ${className}`}>
      {title && (
        <h3 className="mb-4 flex items-center gap-2 text-small font-semibold text-text">
          {Icon && <Icon className="size-4 shrink-0 text-text-muted" strokeWidth={1.75} aria-hidden="true" />}
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

/** A list of "title · body" points with a check mark; each point has its own tip. */
function CheckList({ items, className = "space-y-2" }) {
  return (
    <ul className={className}>
      {items.map(({ t, b, tip }) => (
        <Explain as="li" key={t} tip={tip} title={t} className="flex items-start gap-2 rounded-lg p-1 text-small">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={2} aria-hidden="true" />
          <span>
            <span className="font-semibold text-text">{t}</span> <span className="text-text-muted">{b}</span>
          </span>
        </Explain>
      ))}
    </ul>
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
          <MousePointer2 className="size-4" strokeWidth={1.75} aria-hidden="true" />
          ผู้ชมสามารถวางเมาส์บนกล่องใดก็ได้เพื่ออ่านคำอธิบายโดยละเอียด
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
          <Explain as="li" key={title} tip={tip} title={title} className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary text-on-primary">
              <Icon className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-h3 font-semibold text-text">{title}</h3>
            <p className="mt-1 text-small text-text-muted">{body}</p>
          </Explain>
        ))}
      </ul>
      <ol className="mt-8 grid gap-3 md:grid-cols-4">
        {FLOW.map(({ Icon, title, body, tip }, i) => (
          <Explain as="li" key={title} tip={tip} title={title} className="relative flex items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm">
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
    tip: "Router อ่านข้อความของผู้ใช้แล้วตัดสินว่าข้อความนั้นถามเรื่องใด เช่น ทักษะ เงินเดือน หรือการแก้โปรไฟล์ Router ใช้กฎที่ไม่ต้องเรียก LLM ก่อน และเรียก LLM เฉพาะเมื่อกฎตัดสินไม่ได้ ผู้ชมสามารถดูรายละเอียดได้ในบทที่ 4",
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
  { name: "web", body: "Next.js แสดงหน้าเว็บภาษาไทยให้ผู้ใช้", tip: "container นี้รันหน้าเว็บและ proxy ฝั่ง server ซึ่งส่งต่อคำขอไปยัง API โดยไม่เปิดเผย cookie ยืนยันตัวตนให้ JavaScript ในเบราว์เซอร์" },
  { name: "api", body: "FastAPI รวม Router, RAG, LLM และการคำนวณคะแนนไว้ในที่เดียว", tip: "container นี้เป็นหัวใจของระบบ ทุกส่วนที่เกี่ยวกับ AI และการคำนวณทำงานอยู่ที่นี่ รวมถึงดัชนีค้นหาของ RAG ที่เก็บใน SQLite และโหลดเข้าหน่วยความจำ" },
  { name: "db", body: "Postgres เก็บข้อมูลผู้ใช้ โปรไฟล์ โควตา และแคชประกาศงาน", tip: "ฐานข้อมูลเก็บโปรไฟล์พร้อมหลักฐานของแต่ละข้อความ การใช้โควตาในแต่ละวัน และแคชตลาดงานต่อสายงาน ระบบไม่เก็บไฟล์ PDF ที่ผู้ใช้อัปโหลด" },
];

const MODELS = [
  {
    id: "openai/gpt-oss-120b",
    body: "โมเดลนี้เขียนข้อความที่ผู้ใช้อ่าน ได้แก่ โปรไฟล์ เหตุผลการจับคู่ และก้าวถัดไป",
    tip: "โมเดลขนาดใหญ่เขียนภาษาไทยได้เป็นธรรมชาติกว่า ทีมจึงใช้โมเดลนี้กับข้อความที่ผู้ใช้อ่านโดยตรง ซึ่งเป็นส่วนที่คุณภาพของภาษามีผลต่อความเชื่อถือมากที่สุด",
    strong: true,
  },
  {
    id: "qwen/qwen3.8-27b",
    body: "โมเดลนี้ทำงานเชิงโครงสร้าง ได้แก่ Router การแก้โปรไฟล์ และการดึงข้อเท็จจริง และยังทำหน้าที่เป็นโมเดลสำรองด้วย",
    tip: "งานเชิงโครงสร้างต้องการคำตอบสั้นในรูป JSON มากกว่าภาษาที่สวยงาม โมเดลที่เล็กกว่าจึงตอบได้เร็วกว่าและใช้ tokens น้อยกว่า เมื่อโมเดลหลักเรียกไม่สำเร็จ ระบบจะสลับมาใช้โมเดลนี้แทน",
  },
];

const LIMITS = [
  { value: "30", caption: "Groq รับคำขอได้ไม่เกินจำนวนนี้ต่อนาที", tip: "ข้อจำกัดนี้ทำให้ระบบต้องลดจำนวนครั้งที่เรียก LLM ต่อหนึ่งการกระทำของผู้ใช้ Router จึงใช้กฎก่อนเรียก LLM" },
  { value: "1,000", caption: "Groq รับคำขอได้ไม่เกินจำนวนนี้ต่อวัน", tip: "เมื่อทีมแบ่งจำนวนนี้ให้ผู้ใช้คนละ 40 คำขอต่อวัน ระบบจะรองรับผู้ใช้ที่ใช้งานเต็มโควตาได้ประมาณ 25 คนต่อวัน" },
  { value: "8,000", caption: "Groq รับ tokens ได้ไม่เกินจำนวนนี้ต่อนาที", tip: "ข้อจำกัดนี้เข้มงวดที่สุด เพราะการสร้างโปรไฟล์หนึ่งครั้งอาจใช้หลายพัน tokens ทีมจึงจำกัด prompt ไม่ให้เกิน 5,000 tokens และเลือกไม่ใช้ agent ที่วนเรียก LLM หลายรอบ" },
  { value: "200,000", caption: "Groq รับ tokens ได้ไม่เกินจำนวนนี้ต่อวัน", tip: "ทีมตั้งโควตาผู้ใช้ไว้ที่ 40,000 tokens ต่อวัน เพื่อไม่ให้ผู้ใช้เพียงไม่กี่คนใช้ปริมาณรวมของทั้งวันจนหมด" },
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
          <ol className="flex flex-col items-stretch gap-2 lg:flex-row lg:items-center">
            {PATH.map(({ Icon, label, sub, tip }, i) => (
              <li key={label} className="flex flex-col items-stretch gap-2 lg:flex-1 lg:flex-row lg:items-center">
                <Explain
                  as="span"
                  tip={tip}
                  title={label}
                  className={`flex flex-1 items-center gap-3 rounded-xl border px-3 py-3 ${label === "LLM" ? "border-accent bg-primary-subtle" : "border-border bg-bg/60"}`}
                >
                  <Icon className="size-5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-small leading-5 font-semibold text-text">{label}</span>
                    <span className="block text-tiny text-text-muted">{sub}</span>
                  </span>
                </Explain>
                {i < PATH.length - 1 && (
                  <>
                    <ArrowRight className="hidden size-4 shrink-0 text-text-muted lg:block" strokeWidth={2} aria-hidden="true" />
                    <ArrowDown className="mx-auto size-4 shrink-0 text-text-muted lg:hidden" strokeWidth={2} aria-hidden="true" />
                  </>
                )}
              </li>
            ))}
          </ol>
        </Tile>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          <Tile
            icon={Layers}
            title="ระบบทำงานบน container 3 ตัว"
            tip="ทีมเลือกใช้ container เพียง 3 ตัวเพื่อให้ติดตั้งและดูแลระบบได้ง่ายในเวลาพัฒนาที่จำกัด ดัชนีค้นหาของ RAG เก็บใน SQLite และโหลดเข้าหน่วยความจำภายใน API ทีมจึงไม่ต้องเพิ่ม container สำหรับ vector database"
          >
            <ul className="space-y-2.5">
              {CONTAINERS.map(({ name, body, tip }) => (
                <Explain as="li" key={name} tip={tip} title={`container ${name}`} className="flex items-center gap-3 rounded-xl border border-border bg-bg/60 px-3 py-2.5">
                  <code className="w-10 shrink-0 text-small font-semibold text-accent">{name}</code>
                  <span className="text-small text-text">{body}</span>
                </Explain>
              ))}
            </ul>
          </Tile>
          <Tile
            icon={Cpu}
            title="ระบบเลือกใช้ 2 โมเดลตามลักษณะงานผ่าน Groq"
            tip="ทีมแบ่งงานให้โมเดลตามความต้องการของงาน งานที่ผู้ใช้อ่านโดยตรงใช้โมเดลที่ใหญ่กว่า ส่วนงานที่ตอบเป็นโครงสร้างใช้โมเดลที่เล็กและเร็วกว่า การแบ่งงานแบบนี้ช่วยประหยัด tokens ภายใต้ข้อจำกัดของ Groq"
          >
            <div className="space-y-3">
              {MODELS.map((m) => (
                <Explain key={m.id} tip={m.tip} title={m.id} className={`rounded-xl border p-3 ${m.strong ? "border-accent/50 bg-primary-subtle/50" : "border-border bg-bg/60"}`}>
                  <code className="text-small font-semibold text-text">{m.id}</code>
                  <p className="mt-1 text-tiny text-text-muted">{m.body}</p>
                </Explain>
              ))}
              <p className="text-tiny text-text-muted">ทีมเก็บ model id ไว้ใน env จึงเปลี่ยนโมเดลได้โดยไม่ต้องแก้โค้ด</p>
            </div>
          </Tile>
          <Tile
            icon={Gauge}
            title="Groq กำหนดข้อจำกัดที่ส่งผลต่อการออกแบบ"
            tip="Groq กำหนดเพดานการใช้งานแยกตามโมเดล ข้อจำกัดเหล่านี้เป็นเหตุผลหลักที่ทีมเลือก workflow ที่กำหนดลำดับด้วยโค้ด ใช้กฎก่อนเรียก LLM และตั้งโควตาต่อผู้ใช้"
          >
            <div className="grid grid-cols-2 gap-2">
              {LIMITS.map((l) => (
                <Explain key={l.caption} tip={l.tip} title={`${l.value} — ${l.caption}`} className="rounded-xl border border-border bg-bg/60 px-3 py-2.5">
                  <p className="tabular text-h3 font-semibold text-text">{l.value}</p>
                  <p className="text-tiny text-text-muted">{l.caption}</p>
                </Explain>
              ))}
            </div>
            <p className="mt-3 text-tiny text-text-muted">
              ข้อจำกัดเหล่านี้ใช้กับแต่ละโมเดล นอกจากนี้ ระบบยังจำกัดผู้ใช้แต่ละคนไว้ที่ <span className="font-semibold text-text">40 คำขอและ 40,000 tokens</span> ต่อวัน และตรวจโควตาก่อนเรียก LLM ทุกครั้ง
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
    how: "ระบบใช้ Guard และ Keyword rules ก่อน แล้วจึงใช้ LLM classifier และจะถามกลับเมื่อความมั่นใจต่ำกว่า 0.6",
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
    tip: "ผู้ใช้สามารถพิมพ์ประโยคทั่วไป เช่น ขอเปลี่ยนระดับ SQL เป็น 3 แล้ว LLM จะแปลงประโยคนั้นเป็นคำสั่งที่ระบุ field การกระทำ และค่าใหม่ ระบบแสดงการ์ดเปรียบเทียบค่าเดิมกับค่าใหม่ และบันทึกเฉพาะเมื่อผู้ใช้กดปุ่มยืนยัน ผู้ชมสามารถดูรายละเอียดได้ในบทที่ 5",
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
          tip="ทีมแยกงานออกเป็นสองประเภท งานที่ต้องใช้ภาษา เช่น การสรุปหรือการอธิบาย ใช้ LLM ส่วนงานที่ต้องการความแม่นยำ เช่น คะแนน ระดับ และเงินเดือน ใช้ Python ผู้ชมสามารถวางเมาส์บนแต่ละแถวเพื่ออ่านเหตุผลของการแบ่งงานนั้น"
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
                  tip={f.tip}
                  title={f.name}
                  className="grid gap-1 px-5 py-3 first:rounded-t-2xl last:rounded-b-2xl sm:grid-cols-[minmax(0,15rem)_auto_minmax(0,1fr)] sm:items-center sm:gap-4"
                >
                  <span className="text-small font-semibold text-text">{f.name}</span>
                  <span className={`w-fit rounded-full px-2.5 py-0.5 text-tiny font-semibold whitespace-nowrap ${KIND[f.kind].cls}`}>{KIND[f.kind].label}</span>
                  <span className="text-tiny text-text-muted">{f.how}</span>
                </Explain>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-5">
            <Tile
              icon={Calculator}
              title="Python คำนวณเปอร์เซ็นต์ความตรงโดยไม่ใช้ AI"
              tip="สูตรนี้รวมคะแนน 4 ส่วนด้วยน้ำหนักคงที่ แล้วปัดเป็นเปอร์เซ็นต์ ทีมตัดสินใจคงน้ำหนักนี้ไว้หลังจากทดสอบกับโปรไฟล์ตัวอย่างในบทที่ 7 ผู้ชมสามารถวางเมาส์บนแต่ละส่วนเพื่ออ่านวิธีคิดของส่วนนั้น"
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
              <p className="mt-3 text-tiny text-text-muted">ระบบแสดงสายงานที่ได้ตั้งแต่ 60% ขึ้นไป โดยแสดงไม่เกิน 5 สายงาน</p>
            </Tile>
            <Tile
              icon={ShieldCheck}
              title="LLM ไม่สามารถเขียนข้อมูลลงโปรไฟล์ได้เอง"
              tip="หลักการนี้ป้องกันไม่ให้ LLM เปลี่ยนข้อมูลของผู้ใช้โดยที่ผู้ใช้ไม่รู้ตัว แม้ LLM จะเข้าใจคำขอผิด ผู้ใช้ก็ยังเห็นค่าเดิมและค่าใหม่ก่อนตัดสินใจ ข้อเสนอที่หมดอายุช่วยให้การ์ดเก่าไม่ถูกกดยืนยันโดยไม่ตั้งใจ"
            >
              <p className="text-small text-text">
                ระบบแปลงคำขอแก้ไขผ่านแชทเป็นการ์ด <span className="font-semibold">“เดิม → ใหม่”</span> ผู้ใช้ต้องกดยืนยันก่อนระบบบันทึก และข้อเสนอแต่ละรายการจะหมดอายุภายใน 15 นาที
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
  {
    name: "Guard",
    body: "ชั้นนี้ปฏิเสธข้อความว่าง ข้อความที่ยาวเกิน prompt injection และคำถามนอกขอบเขต",
    tip: "Guard ทำงานก่อนทุกชั้นและไม่ใช้ LLM ระบบปฏิเสธข้อความที่ไม่ผ่านทันทีโดยไม่เสียโควตา ผู้ไม่หวังดีจึงไม่สามารถใช้ prompt injection เพื่อสั่งงาน LLM ได้",
    llm: false,
    width: "100%",
  },
  {
    name: "Keyword rules",
    body: "ชั้นนี้จับรูปแบบคำภาษาไทยและภาษาอังกฤษ และให้ความมั่นใจ 0.9",
    tip: "ทีมเขียนรูปแบบคำของแต่ละเส้นทาง เช่น คำว่าเงินเดือนหรือ salary กฎจะไม่ตัดสินเมื่อข้อความถามเรื่องอื่นของหัวข้อนั้น หรือเมื่อข้อความตรงกับกฎหลายเส้นทาง ในกรณีเหล่านี้ระบบจะส่งข้อความต่อให้ LLM",
    llm: false,
    width: "86%",
  },
  {
    name: "LLM classifier",
    body: "ชั้นนี้ให้ LLM ตอบเป็นโครงสร้าง และใช้ประมาณ 260 tokens ต่อครั้ง",
    tip: "LLM ได้รับรายการเส้นทางที่เป็นไปได้และข้อความของผู้ใช้ แล้วตอบกลับเป็นชื่อเส้นทางพร้อมค่าความมั่นใจ การจำกัดคำตอบให้อยู่ในรูปโครงสร้างทำให้แต่ละครั้งใช้ tokens น้อย",
    llm: true,
    width: "70%",
  },
  {
    name: "Clarify",
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
          tip="รูปกรวยแสดงว่าข้อความจำนวนมากถูกตัดสินที่ชั้นบนซึ่งไม่มีต้นทุน และมีเพียงข้อความส่วนน้อยที่ลงไปถึงชั้น LLM แนวทางนี้ลดทั้งเวลาตอบและการใช้โควตา"
        >
          <ol className="flex flex-col items-center gap-1.5">
            {ROUTER_LAYERS.map((l, i) => (
              <Explain
                as="li"
                key={l.name}
                tip={l.tip}
                title={`ชั้นที่ ${i + 1}: ${l.name}`}
                className={`rounded-xl px-4 py-2.5 text-center ${l.llm ? "bg-[var(--color-series-1)] text-white" : "border border-border bg-bg/60 text-text"}`}
                style={{ width: l.width }}
              >
                <span className="text-small font-semibold">
                  {i + 1}. {l.name}
                </span>
                <span className={`block text-tiny ${l.llm ? "text-white/85" : "text-text-muted"}`}>{l.body}</span>
              </Explain>
            ))}
          </ol>
          <p className="mt-4 text-tiny text-text-muted">ชั้นบนไม่ใช้ LLM จึงไม่ใช้โควตา และระบบส่งข้อความที่ตรงกับกฎหลายเส้นทางให้ LLM เป็นผู้ตัดสิน</p>
        </Tile>

        <Tile
          icon={Search}
          title="Hybrid RAG ค้นความรู้ด้วยสองวิธีพร้อมกัน"
          tip="การค้นแต่ละแบบมีจุดอ่อนต่างกัน BM25 พลาดเมื่อผู้ใช้ใช้คำต่างจากเอกสาร ส่วนการค้นด้วยเวกเตอร์พลาดกับชื่อเฉพาะ การรวมสองวิธีจึงให้ผลดีกว่าการใช้วิธีเดียว ซึ่งผลการวัดในบทที่ 7 ยืนยันข้อนี้"
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="space-y-2">
              {RAG_PARTS.map((p) => (
                <Explain key={p.name} tip={p.tip} title={p.name} className="rounded-xl border border-border bg-bg/60 p-3">
                  <p className="text-small font-semibold text-text">{p.name}</p>
                  <p className="text-tiny text-text-muted">{p.body}</p>
                </Explain>
              ))}
            </div>
            <ArrowRight className="size-5 text-accent" strokeWidth={2} aria-hidden="true" />
            <Explain
              tip="Reciprocal Rank Fusion ให้คะแนนเอกสารแต่ละชิ้นเท่ากับ 1/(k + อันดับ) จากแต่ละวิธี แล้วนำคะแนนมารวมกัน ค่า k = 60 ลดความได้เปรียบของอันดับแรกสุด เอกสารที่ทั้งสองวิธีจัดอันดับสูงจึงขึ้นมาอยู่อันดับต้น ระบบยังกรองผลตาม role_id และหมวดของเอกสารได้"
              title="RRF k = 60"
              className="rounded-xl border border-accent bg-primary-subtle/60 p-3 text-center"
            >
              <p className="text-small font-semibold text-text">RRF k = 60</p>
              <p className="text-tiny text-text-muted">RRF รวมอันดับจากทั้งสองวิธี และกรองตามสายงานและหมวด</p>
            </Explain>
          </div>
          <Explain
            tip="ทีมตัด chunk ตามหัวข้อระดับ ## ทำให้แต่ละ chunk มีเนื้อหาครบในตัว และแต่ละ chunk เก็บ doc_id หมวด สายงาน และแหล่งที่มาไว้ การอ้างอิงในคำตอบจึงชี้ไปยังเนื้อหาที่มีอยู่จริงในคลัง"
            title="คลังความรู้ที่ทีมเขียนเอง"
            className="mt-4 flex items-start gap-2 rounded-xl border border-border bg-bg/60 p-3"
          >
            <BookOpenText className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
            <p className="text-tiny text-text-muted">
              ทีมเขียนคลังความรู้เอง ซึ่งประกอบด้วยไฟล์สายงาน 26 ไฟล์ และบันทึกเรื่อง work style และ soft skill ระบบตัด chunk ตามหัวข้อ และใช้ความรู้นี้เสริมคำตอบเท่านั้น หาก index ยังไม่พร้อม ระบบก็ยังตอบจากข้อมูลส่วนอื่นได้
            </p>
          </Explain>
        </Tile>

        <Tile
          icon={ShieldCheck}
          title="ระบบป้องกันไม่ให้ LLM แต่งข้อมูลขึ้นเอง"
          tip="ปัญหาที่พบบ่อยของ LLM คือการแต่งข้อมูลที่ฟังดูน่าเชื่อ (hallucination) ระบบนี้แก้ปัญหาด้วยการบังคับให้ทุกข้อความอ้างหลักฐาน แล้วใช้โค้ดตรวจการอ้างอิงนั้น แทนการเชื่อคำตอบของ LLM โดยตรง"
          className="lg:col-span-2"
        >
          <ol className="grid gap-3 md:grid-cols-4">
            {CLAIM_STEPS.map(({ Icon, title, body, tip }, i) => (
              <Explain as="li" key={title} tip={tip} title={title} className="relative rounded-xl border border-border bg-bg/60 p-4">
                <span className="tabular absolute top-3 right-3 text-tiny font-semibold text-text-muted">{i + 1}</span>
                <Icon className="size-5 text-accent" strokeWidth={1.75} aria-hidden="true" />
                <p className="mt-2 pr-4 text-small font-semibold text-text">{title}</p>
                <p className="mt-0.5 text-tiny text-text-muted">{body}</p>
              </Explain>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-small text-text">
            ทีมยังไม่ได้วัดสัดส่วนประโยคที่ parse_claims ตัดทิ้งในการสร้างโปรไฟล์จริง <Pending>ทีมกำลังรอวัดค่านี้</Pending>
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

/* ---------- 5. agents and multi-step workflows ---------- */

/** Numbered steps in a row; steps with `llm` are highlighted as the only LLM calls. */
function StepRow({ steps, cols = "md:grid-cols-3 lg:grid-cols-6" }) {
  return (
    <ol className={`grid gap-2 ${cols}`}>
      {steps.map(({ Icon, title, body, tip, llm }, i) => (
        <Explain
          as="li"
          key={title}
          tip={tip}
          title={`ขั้นที่ ${i + 1}: ${title}`}
          className={`relative rounded-xl p-3 ${llm ? "bg-[var(--color-series-1)] text-white" : "border border-border bg-bg/60 text-text"}`}
        >
          <span className={`tabular absolute top-2.5 right-3 text-tiny font-semibold ${llm ? "text-white/80" : "text-text-muted"}`}>{i + 1}</span>
          <Icon className={`size-4 ${llm ? "text-white" : "text-accent"}`} strokeWidth={1.75} aria-hidden="true" />
          <p className="mt-1.5 pr-4 text-small leading-5 font-semibold">{title}</p>
          <p className={`mt-0.5 text-tiny ${llm ? "text-white/85" : "text-text-muted"}`}>{body}</p>
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
          className={`rounded-full px-2.5 py-0.5 text-tiny font-semibold ${llm ? "bg-[var(--color-series-1)] text-white" : "border border-border text-text"}`}
        >
          {r}
        </Explain>
      ))}
    </div>
  );
}

function WorkflowSection() {
  return (
    <section id="s5" className="bg-section-wash scroll-mt-20 py-20">
      <div className="mx-auto w-full max-w-[1120px] px-4 md:px-6">
        <SectionHeading
          no="5"
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
            tip="กล่องสีเข้มแสดงขั้นเดียวที่เรียก LLM ขั้นก่อนหน้ามีหน้าที่เตรียมและกรองข้อมูล ส่วนขั้นถัดไปมีหน้าที่ตรวจและคำนวณ โครงสร้างนี้ทำให้ LLM ทำงานในกรอบที่แคบที่สุด"
            className="lg:col-span-2"
          >
            <StepRow steps={PROFILE_STEPS} />
            <p className="mt-3 text-tiny text-text-muted">หากไม่มีข้อความสรุปประสบการณ์ข้อใดผ่านการตรวจ ระบบจะแสดงรายการประสบการณ์ตามที่บันทึกไว้แทน</p>
          </Tile>

          <Tile
            icon={UserCheck}
            title="ผู้ใช้แก้โปรไฟล์ผ่านแชทได้ และผู้ใช้ต้องอนุมัติทุกครั้ง"
            tip="workflow นี้เป็นตัวอย่างของ human-in-the-loop ระบบใช้ LLM เพื่อความสะดวกในการสั่งงานด้วยภาษาธรรมชาติ แต่ระบบให้มนุษย์เป็นผู้ตัดสินขั้นสุดท้ายเสมอ"
            className="lg:col-span-2"
          >
            <StepRow steps={EDIT_STEPS} cols="md:grid-cols-5" />
            <p className="mt-3 text-tiny text-text-muted">
              ข้อเสนอใหม่จะปิดข้อเสนอเก่าของ field เดียวกัน การ์ดเก่าจึงไม่สามารถย้อนการแก้ไขที่ใหม่กว่าได้ นอกจากนี้ การยืนยัน การปฏิเสธ การลบ และการกู้คืนไม่ใช้โควตา
            </p>
          </Tile>

          <Tile
            icon={Route}
            title="Router เลือก handler และแต่ละเส้นทางดึงเฉพาะข้อมูลที่จำเป็น"
            tip="แต่ละเส้นทางมี handler ของตนเอง และ handler ดึงเฉพาะข้อมูลที่เส้นทางนั้นต้องใช้ prompt จึงสั้นและตรงประเด็น ผู้ชมสามารถวางเมาส์บนชื่อเส้นทางแต่ละชื่อเพื่ออ่านว่าเส้นทางนั้นใช้ข้อมูลใด"
          >
            <p className="mb-2 text-tiny font-semibold text-text-muted">ในเส้นทางเหล่านี้ LLM เขียนคำตอบ และระบบตรวจคำตอบก่อนแสดง</p>
            <RouteChips routes={LLM_ROUTES} llm />
            <p className="mt-4 mb-2 text-tiny font-semibold text-text-muted">ในเส้นทางเหล่านี้ LLM ไม่ได้เขียนข้อความ และระบบตอบจากข้อมูลหรือข้อความที่กำหนดไว้</p>
            <RouteChips routes={NO_LLM_ROUTES} />
            <p className="mt-4 text-tiny text-text-muted">แชทส่งข้อความล่าสุด 4 ข้อความ ซึ่งตัดไว้ที่ 300 ตัวอักษร ไปด้วยเพื่อให้ระบบเข้าใจคำถามต่อเนื่อง แต่ระบบไม่ใช้ข้อความเหล่านี้เป็นแหล่งข้อเท็จจริง</p>
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

/* ---------- 6. security and guardrails ---------- */

const GUARD_LAYERS = [
  {
    Icon: Ban,
    title: "ขาเข้า: Guard ตรวจข้อความก่อนส่งถึง LLM",
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
    tip: "หลักการนี้เรียกว่าการเก็บข้อมูลเท่าที่จำเป็น ระบบอ่าน CV แล้วเก็บเฉพาะข้อมูลที่ผู้ใช้ยืนยัน log ของระบบจึงไม่มีข้อมูลส่วนตัวที่อาจรั่วไหลได้",
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
    <section id="s6" className="mx-auto w-full max-w-[1120px] scroll-mt-20 px-4 py-20 md:px-6">
      <SectionHeading
        no="6"
        eyebrow="Security & Guardrails"
        title="ระบบป้องกันทั้งขาเข้า ขาออก และขอบเขตการกระทำของ LLM"
        tip="ทีมไม่พึ่งให้ LLM ปฏิเสธคำขอที่ไม่เหมาะสมเอง เพราะ LLM อาจถูกหลอกด้วย prompt injection ได้ ทีมจึงวาง guardrail เป็นโค้ดไว้ 3 จุด คือก่อนถึง LLM หลัง LLM ตอบ และที่ขอบเขตสิทธิ์ของ LLM"
      >
        guardrail ทุกชั้นเป็นโค้ด และระบบไม่ได้พึ่งให้ LLM ปฏิเสธคำขอเอง
      </SectionHeading>

      <ol className="mt-12 grid gap-5 lg:grid-cols-3">
        {GUARD_LAYERS.map(({ Icon, title, items, note, tip }) => (
          <Explain as="li" key={title} tip={tip} title={title} className="flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 text-small font-semibold text-text">
              <Icon className="size-4 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
              {title}
            </h3>
            <ul className="space-y-1.5 text-small text-text">
              {items.map((it) => (
                <li key={it}>• {it}</li>
              ))}
            </ul>
            <p className="mt-auto pt-4 text-tiny text-text-muted">{note}</p>
          </Explain>
        ))}
      </ol>

      <Tile
        icon={ShieldCheck}
        title="ระบบมีมาตรการความปลอดภัยระดับแอป 6 ด้าน"
        tip="นอกจาก guardrail ของ AI ระบบยังมีมาตรการพื้นฐานของเว็บแอปที่ดี ตั้งแต่การยืนยันตัวตนไปจนถึงการเก็บ secrets ผู้ชมสามารถวางเมาส์บนแต่ละด้านเพื่ออ่านว่ามาตรการนั้นป้องกันความเสี่ยงใด"
        className="mt-5"
      >
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {APP_SECURITY.map(({ Icon, title, body, tip }) => (
            <Explain as="li" key={title} tip={tip} title={title} className="rounded-xl border border-border bg-bg/60 p-3">
              <p className="flex items-center gap-2 text-small font-semibold text-text">
                <Icon className="size-4 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
                {title}
              </p>
              <p className="mt-1 text-tiny text-text-muted">{body}</p>
            </Explain>
          ))}
        </ul>
      </Tile>
    </section>
  );
}

/* ---------- 7. evaluation and reliability ---------- */

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
  { who: "โปรไฟล์ของนักศึกษาได้ผลดังนี้", rows: [["นักพัฒนาเว็บ", 69], ["Full-stack", 59], ["Frontend", 55]] },
  { who: "โปรไฟล์ของ Full-stack developer ได้ผลดังนี้", rows: [["Full-stack", 86]] },
  { who: "โปรไฟล์ของ ML developer ได้ผลดังนี้", rows: [["AI engineer", 68], ["ML engineer", 66], ["Data scientist", 62]] },
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
    <section id="s7" className="bg-section-wash scroll-mt-20 py-20">
      <div className="mx-auto w-full max-w-[1120px] px-4 md:px-6">
        <SectionHeading
          no="7"
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
                <Explain key={k} tip={tip} title={k} className="rounded-xl border border-border bg-bg/60 px-2 py-2">
                  <p className="text-tiny text-text-muted">{k}</p>
                  <p className="tabular text-small font-semibold text-text">{v}</p>
                </Explain>
              ))}
            </div>
            <p className="mt-3 text-tiny text-text-muted">ข้อผิดพลาดทั้งหมดมาจาก keyword rules และไม่ได้มาจาก LLM ทีมรันการทดสอบนี้ด้วย qwen3.8-27b เมื่อวันที่ 4 พ.ย.</p>
          </Tile>

          <Tile
            icon={Search}
            title="RAG ค้นเอกสารได้ถูกต้องบน golden set ภาษาไทย 30 คำถาม"
            tip="golden set คือชุดคำถามที่ทีมกำหนดคำตอบที่ถูกต้องไว้ล่วงหน้า ทีมตั้งเกณฑ์ไว้ว่าหาก hit@3 ต่ำกว่า 0.8 ทีมจะเปลี่ยนไปใช้โมเดล bge-m3 ที่ใหญ่กว่า"
          >
            <ul className="space-y-3">
              {RAG_BARS.map((b, i) => (
                <GrowBar key={b.label} label={b.label} value={b.value} text={b.value.toFixed(2)} strong={b.strong} mark={b.mark} delay={i * 90} tip={b.tip} />
              ))}
            </ul>
            <p className="mt-4 text-tiny text-text-muted">เส้นประแสดงเกณฑ์ 0.8 ผลลัพธ์ผ่านเกณฑ์ ทีมจึงใช้ e5-base ต่อโดยไม่ต้องเปลี่ยนเป็น bge-m3 ที่มีขนาดใหญ่กว่า และการค้นแบบ hybrid ให้ผลดีกว่าการใช้วิธีเดียว</p>
          </Tile>

          <Tile
            icon={UserRound}
            title="ทีมปรับเกณฑ์การจับคู่ด้วยโปรไฟล์ตัวอย่าง 3 แบบ"
            tip="ทีมสร้างโปรไฟล์ตัวอย่างที่ทราบคำตอบล่วงหน้า แล้วตรวจว่าสายงานที่ควรตรงขึ้นมาอยู่อันดับต้น และสายงานที่ไม่เกี่ยวข้องได้คะแนนต่ำ ผลการตรวจทำให้ทีมคงน้ำหนักและเกณฑ์ 60% ไว้"
          >
            <div className="space-y-4">
              {SAMPLE_PROFILES.map((p) => (
                <div key={p.who}>
                  <p className="mb-1.5 text-tiny font-semibold text-text">{p.who}</p>
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
            <p className="mt-4 text-tiny text-text-muted">เส้นประแสดงเกณฑ์ 60% สายงานที่ตรงกับโปรไฟล์ติด 3 อันดับแรก สายงานที่ไม่เกี่ยวข้องได้ต่ำกว่า 30% และนักศึกษาเห็นเพียง 1 สายงานที่เกณฑ์ 60%</p>
          </Tile>

          <div className="grid gap-5 sm:grid-cols-2">
            <Tile
              icon={CheckCircle2}
              title="ชุดทดสอบ End-to-end ของ API ผ่านทั้งหมด"
              tip="การทดสอบ end-to-end เรียก API จริงและแบ่งเป็น 6 กลุ่ม ได้แก่ การยืนยันตัวตน การอ่าน CV แบบสอบถาม โปรไฟล์และสายงาน แชทและการแก้ไข และโควตากับหน้า Admin การทดสอบนี้ยืนยันว่าทุกส่วนทำงานร่วมกันได้"
            >
              <Big value="78/78" caption="การทดสอบกลุ่ม A–F ผ่านทั้งหมดในการรันวันที่ 4 พ.ย." />
            </Tile>
            <Tile
              icon={ListChecks}
              title="ชุด Unit test และ integration test ผ่านทั้งหมด"
              tip="unit test ตรวจฟังก์ชันแต่ละตัว เช่น สูตรคะแนนและ parse_claims ส่วน integration test ตรวจการทำงานร่วมกันของ API กับฐานข้อมูล"
            >
              <Big value="976" caption="pytest รันผ่านครบทั้ง 976 รายการ" />
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
              tip="คำถามเรื่องทักษะต้องเรียก LLM จึงใช้เวลามากกว่า ส่วนการปฏิเสธเรื่องนอกขอบเขตทำที่ Guard โดยไม่เรียก LLM จึงเร็วกว่ามาก ทีมยังต้องวัดค่า p50 และ p95 เพื่อดูการกระจายของเวลาตอบ"
              className="sm:col-span-2"
            >
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-border bg-bg/60 px-2 py-2">
                  <p className="tabular text-h3 font-semibold text-text">1.2 วิ</p>
                  <p className="text-tiny text-text-muted">ระบบตอบคำถามเรื่องทักษะภายในเวลานี้</p>
                </div>
                <div className="rounded-xl border border-border bg-bg/60 px-2 py-2">
                  <p className="tabular text-h3 font-semibold text-text">0.3 วิ</p>
                  <p className="text-tiny text-text-muted">ระบบปฏิเสธเรื่องนอกขอบเขตภายในเวลานี้</p>
                </div>
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-warning px-2 py-2">
                  <Pending>ทีมกำลังรอวัดค่านี้</Pending>
                  <p className="mt-1 text-tiny text-text-muted">ทีมยังไม่ได้วัด p50 และ p95 ของ LLM โดยตั้งเป้าไว้ไม่เกิน 15 วินาที</p>
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
            tip="ลำดับนี้เรียงจากวิธีที่ผู้ใช้แทบไม่รู้สึกถึงปัญหา ไปจนถึงการแจ้งผู้ใช้โดยตรง ระบบจึงแจ้งข้อผิดพลาดเฉพาะเมื่อทุกทางสำรองใช้ไม่ได้แล้ว"
          >
            <ol className="space-y-2">
              {RELIABILITY.map(({ Icon, title, body, tip }, i) => (
                <Explain as="li" key={title} tip={tip} title={title} className="flex items-center gap-3 rounded-xl border border-border bg-bg/60 p-3">
                  <span className="tabular text-tiny font-semibold text-text-muted">{i + 1}</span>
                  <Icon className="size-4 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
                  <span>
                    <span className="block text-small font-semibold text-text">{title}</span>
                    <span className="block text-tiny text-text-muted">{body}</span>
                  </span>
                </Explain>
              ))}
            </ol>
            <p className="mt-3 text-tiny text-text-muted">งาน Router มี timeout 7 วินาทีต่อครั้ง และระบบลองใหม่ทันที โดยทีมตั้งเป้าเวลารวมไว้ไม่เกิน 15 วินาที</p>
          </Tile>

          <Tile
            icon={Server}
            title="ทีมพบปัญหาจริงระหว่างการทดสอบวันที่ 4 พ.ย."
            tip="ตัวเลขเหล่านี้มาจากการรันชุดทดสอบจริงกับ Groq ไม่ใช่การจำลอง ผลแสดงว่ากลไกลองใหม่ที่ทีมเพิ่มเข้าไปกู้คืนความล้มเหลวได้ทั้งหมด แต่การเกินเพดานต่อนาทีทำให้เวลารวมเพิ่มขึ้นอย่างชัดเจน"
          >
            <div className="space-y-5">
              <Big value="4/380" caption="LLM timeout 4 ครั้งจาก 380 ครั้ง หรือประมาณ 1% หลังจากทีมเพิ่มการลองใหม่ ครั้งถัดมาที่ timeout ได้คำตอบจากการลองใหม่" />
              <Big value="22×" unit="429" caption="Groq ตอบ 429 จำนวน 22 ครั้งขณะทีมรันชุดทดสอบต่อกัน การลองใหม่กู้คืนได้ทั้งหมดและไม่มีเส้นทางใดเปลี่ยน แต่ใช้เวลาประมาณ 55 วินาทีแทน 8 วินาที" />
            </div>
          </Tile>

          <Tile
            icon={LifeBuoy}
            title="ระบบส่วนอื่นยังทำงานได้เมื่อบางส่วนล้ม"
            tip="แนวคิดนี้เรียกว่า graceful degradation ระบบออกแบบให้แต่ละส่วนล้มได้โดยไม่ลากส่วนอื่นล้มตาม ผู้ใช้จึงยังใช้งานหลักได้แม้บริการภายนอกมีปัญหา"
          >
            <ul className="space-y-2">
              {DEGRADE.map(({ t, b, tip }) => (
                <Explain as="li" key={t} tip={tip} title={t} className="rounded-lg p-1 text-small">
                  <span className="font-semibold text-text">{t}</span>
                  <span className="block text-tiny text-text-muted">{b}</span>
                </Explain>
              ))}
            </ul>
          </Tile>
        </div>

        <Explain
          tip="ทีมระบุข้อจำกัดเหล่านี้ไว้อย่างเปิดเผย เพื่อให้ผู้ชมตีความตัวเลขในบทนี้ได้อย่างถูกต้อง ตัวเลขเหล่านี้แสดงว่าระบบทำงานได้ตามที่ออกแบบ แต่ยังไม่ได้พิสูจน์ว่าผู้ใช้จริงจะได้รับประโยชน์ในระดับใด"
          title="การวัดผลครั้งนี้ยังมีข้อจำกัด 4 ข้อ"
          className="mt-5 rounded-2xl border border-info/40 bg-surface p-5 shadow-sm"
        >
          <h3 className="flex items-center gap-2 text-small font-semibold text-text">
            <TriangleAlert className="size-4 text-info" strokeWidth={2} aria-hidden="true" />
            การวัดผลครั้งนี้ยังมีข้อจำกัด 4 ข้อ
          </h3>
          <ul className="mt-3 grid gap-2 text-small text-text md:grid-cols-2">
            {EVAL_LIMITS.map((l) => (
              <li key={l}>• {l}</li>
            ))}
          </ul>
        </Explain>
      </div>
    </section>
  );
}

/* ---------- 8. problems ---------- */

const ISSUES = [
  {
    Icon: Server,
    problem: "Groq จำกัดการใช้งานไว้ที่ 8,000 tokens ต่อนาที",
    found: "เมื่อทีมแก้โปรไฟล์ 10 ครั้งติดกัน ระบบได้รับ 429 กลับมา 7 ครั้ง",
    fix: "ทีมเพิ่มโควตาต่อผู้ใช้ จำกัด prompt ไม่ให้เกิน 5K tokens และเพิ่มการลองใหม่และโมเดลสำรอง (ผู้ชมสามารถดูรายละเอียดได้ในบทที่ 7)",
    tip: "ปัญหานี้เป็นข้อจำกัดภายนอกที่ทีมควบคุมไม่ได้ ทีมจึงแก้ที่ฝั่งระบบด้วยการลดปริมาณการใช้และเพิ่มทางสำรอง แทนการพึ่งพาเพดานที่สูงขึ้น",
  },
  {
    Icon: Bot,
    problem: "LLM แต่งข้อความหรือตัวเลขขึ้นเอง",
    found: "LLM เขียนประโยคที่ไม่มีหลักฐานรองรับ",
    fix: "parse_claims ตรวจ evidence id และตัวเลขในทุกประโยค",
    tip: "การเขียน prompt ให้รัดกุมขึ้นลดปัญหานี้ได้เพียงบางส่วน ทีมจึงเลือกตรวจผลลัพธ์ด้วยโค้ด ซึ่งรับประกันได้ว่าประโยคที่ไม่มีหลักฐานจะไม่ถึงผู้ใช้",
  },
  {
    Icon: Database,
    problem: "ข้อมูลงานไม่ได้มาจากแหล่งทางการ",
    found: "Apify ดึงประกาศได้ครั้งละ 20 ประกาศ ทีมจึงพึ่งพาการดึงข้อมูลแบบสดไม่ได้",
    fix: "ทีมแคชข้อมูลต่อสายงาน อัปเดตทุก 7 วัน และแสดงวันที่และแหล่งที่มา",
    tip: "การแคชทำให้หน้าเว็บแสดงผลได้ทันทีโดยไม่ต้องรอการดึงข้อมูล และการแสดงวันที่ทำให้ผู้ใช้ทราบว่าข้อมูลเป็นตัวอย่างจากช่วงเวลาใด",
  },
  {
    Icon: FileWarning,
    problem: "ผู้ใช้บางคนอัปโหลด PDF แบบสแกน",
    found: "ไฟล์แบบสแกนไม่มีข้อความให้ระบบอ่าน",
    fix: "ระบบแจ้งผู้ใช้เป็นภาษาไทย และผู้ใช้ยังกรอกแบบสอบถามแทนได้",
    tip: "PDF แบบสแกนเก็บเนื้อหาเป็นรูปภาพ ระบบจึงดึงข้อความออกมาไม่ได้หากไม่มี OCR ทีมเลือกแจ้งผู้ใช้และเสนอทางเลือกอื่น แทนการเพิ่ม OCR ซึ่งเพิ่มความซับซ้อนของระบบ",
  },
  {
    Icon: Target,
    problem: "นักศึกษาเห็นสายงานเพียง 1 สายงานที่เกณฑ์ 60%",
    found: "การปรับเกณฑ์ไม่ผ่านการตรวจ 1 ข้อ",
    fix: "ทีมคงเกณฑ์ไว้ และระบบแสดงสายงานที่ใกล้ที่สุดพร้อมทักษะที่ต้องเติม",
    tip: "หากทีมลดเกณฑ์ลง สายงานที่ไม่เหมาะสมจะปรากฏขึ้นสำหรับผู้ใช้กลุ่มอื่นด้วย ทีมจึงคงเกณฑ์ไว้ และช่วยนักศึกษาด้วยการแสดงสายงานที่เกือบผ่านพร้อมสิ่งที่ต้องพัฒนา",
  },
  {
    Icon: Clock,
    problem: "เดือนประสบการณ์ไม่ตรงหลังผู้ใช้แก้ฟอร์ม CV",
    found: "ระบบนำเดือนประสบการณ์มาจากการอ่าน CV ครั้งแรกเท่านั้น",
    fix: "ระบบคำนวณเดือนประสบการณ์ใหม่จากวันที่ทุกครั้งที่ผู้ใช้บันทึก",
    tip: "ข้อผิดพลาดนี้เกิดจากการเก็บค่าที่คำนวณแล้วไว้แทนการคำนวณจากข้อมูลต้นทาง ทีมแก้โดยให้ระบบคำนวณจากวันที่ทุกครั้ง ค่าจึงตรงกับข้อมูลล่าสุดเสมอ",
  },
];

const EMBED_BARS = [
  { label: "ReactJS → React (คู่ที่ถูก)", value: 0.84, strong: true, tip: "คู่คำนี้เป็นทักษะเดียวกันที่เขียนต่างกัน และได้ความคล้าย 0.84" },
  { label: "ทำอาหาร (คำที่ไม่เกี่ยว)", value: 0.83, tip: "คำนี้ไม่เกี่ยวกับ React เลย แต่ได้ความคล้าย 0.83 ซึ่งใกล้กับคู่ที่ถูกมาก ทีมจึงตั้ง threshold เพื่อแยกสองกรณีนี้ไม่ได้" },
  { label: "ขับรถ (คำที่ไม่เกี่ยว)", value: 0.83, tip: "คำนี้ก็ได้ความคล้าย 0.83 เช่นกัน ผลนี้แสดงว่าโมเดล embedding ไม่เหมาะกับการเทียบคำสั้น ๆ ที่ไม่มีบริบท" },
];

function ProblemsSection() {
  return (
    <section id="s8" className="mx-auto w-full max-w-[1120px] scroll-mt-20 px-4 py-20 md:px-6">
      <SectionHeading
        no="8"
        eyebrow="ทีมพบปัญหาใดและแก้ไขอย่างไร"
        title="ทีมพบปัญหาระหว่างการพัฒนา และแก้ไขด้วยวิธีต่อไปนี้"
        tip="บทนี้รวบรวมปัญหาที่ทีมพบจริงระหว่างการพัฒนา แต่ละการ์ดระบุปัญหา สิ่งที่ทีมสังเกตเห็น และวิธีที่ทีมแก้ไข ผู้ชมสามารถวางเมาส์บนการ์ดเพื่ออ่านเหตุผลเบื้องหลังวิธีแก้"
      />

      <div className="mt-12 grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <Tile
          icon={MessageSquare}
          title="Embedding ไม่สามารถใช้จับคู่ชื่อทักษะได้"
          tip="ทีมคาดว่า embedding จะช่วยจับคู่ชื่อทักษะที่ผู้ใช้เขียนต่างกันได้ แต่ผลการทดสอบแสดงว่าคำสั้นที่ไม่มีบริบทได้ความคล้ายสูงเกือบเท่ากันหมด ทีมจึงเปลี่ยนไปใช้วิธีที่แน่นอนกว่า"
        >
          <p className="mb-4 text-small text-text-muted">
            ทีมทดสอบ multilingual-e5-base กับคำ 25 คำ และพบว่าคำที่ไม่เกี่ยวข้องได้คะแนนใกล้เคียงกับคู่ที่ถูกต้อง ทีมจึงไม่สามารถตั้ง threshold เพื่อแยกสองกลุ่มออกจากกันได้
          </p>
          <ul className="space-y-3">
            {EMBED_BARS.map((b, i) => (
              <GrowBar key={b.label} label={b.label} value={b.value} text={b.value.toFixed(2)} strong={b.strong} delay={i * 90} tip={b.tip} />
            ))}
          </ul>
          <div className="pt-5">
            <Explain
              tip="taxonomy คือรายการทักษะมาตรฐานที่ทีมกำหนดไว้ และแต่ละทักษะมีรายชื่อเรียกอื่น เช่น ReactJS และ React.js การเทียบกับรายชื่อนี้ให้ผลที่แน่นอนและตรวจสอบได้ ส่วนทักษะที่ไม่อยู่ในรายการ ระบบจะเก็บไว้ตามคำที่ผู้ใช้เขียนโดยไม่เดา"
              title="ทีมเปลี่ยนไปใช้ taxonomy และ alias"
              className="flex items-start gap-2 rounded-xl border border-success/40 bg-success/10 p-3 text-small text-text"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={2} aria-hidden="true" />
              ทีมใช้ taxonomy และชื่อเรียกอื่น (alias) แทน และระบบเก็บทักษะที่ไม่รู้จักไว้ตามคำที่ผู้ใช้เขียน
            </Explain>
          </div>
        </Tile>

        <ul className="grid gap-3 sm:grid-cols-2">
          {ISSUES.map(({ Icon, problem, found, fix, tip }) => (
            <Explain as="li" key={problem} tip={tip} title={problem} className="flex flex-col rounded-2xl border border-border bg-surface p-4 shadow-sm">
              <p className="flex items-start gap-2 text-small font-semibold text-text">
                <Icon className="mt-0.5 size-4 shrink-0 text-warning" strokeWidth={2} aria-hidden="true" />
                {problem}
              </p>
              <p className="mt-1 text-tiny text-text-muted">{found}</p>
              <p className="mt-auto flex items-start gap-1.5 pt-3 text-tiny font-medium text-text">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" strokeWidth={2} aria-hidden="true" />
                {fix}
              </p>
            </Explain>
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
        <h2 className="mx-auto mt-4 max-w-3xl text-h1 font-bold text-hero-fg md:text-[40px] md:leading-[56px]">AI ทำหน้าที่แยกเจตนา ดึงข้อเท็จจริง และเขียนคำอธิบาย</h2>
        <p className="mx-auto mt-3 max-w-2xl text-body text-hero-muted">
          Python คำนวณคะแนนและตัวเลขทั้งหมด ทุกข้อความมีหลักฐานกำกับ และทีมวัดผลทั้ง Router และ RAG ด้วยชุดข้อมูลภาษาไทย
        </p>
      </div>
    </section>
  );
}

export default function PresentPage() {
  return (
    <>
      <PresentTimeline />
      <ExplainLayer />
      <Hero />
      <ProblemSection />
      <ArchitectureSection />
      <AiMatrixSection />
      <TechniquesSection />
      <WorkflowSection />
      <SecuritySection />
      <EvaluationSection />
      <ProblemsSection />
      <Closing />
    </>
  );
}

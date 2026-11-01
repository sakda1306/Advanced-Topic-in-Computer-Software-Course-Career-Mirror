import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Eye,
  FilePlus2,
  Route,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  CvPreview,
  EvidencePreview,
  GapPreview,
  MatchCard,
  ProfileCard,
  RolesPreview,
  Thumb,
} from "@/components/landing/visuals";

// Landing page (DesignSystem.md section 4): what the app does, how it works in
// 4 steps, privacy summary, สมัครใช้งาน / เข้าสู่ระบบ. Brand gradient and glass
// surfaces are used only on the hero, the card thumbnails and the cover bands.

const FEATURES = [
  {
    title: "อ่านทักษะจาก CV",
    body: "อัปโหลดไฟล์ PDF แล้วตรวจและแก้สิ่งที่ระบบอ่านได้ ก่อนนำไปใช้",
    Preview: CvPreview,
  },
  {
    title: "โปรไฟล์ที่มีหลักฐาน",
    body: "ทุกทักษะบอกที่มา คุณลบหรือแก้ไขได้ตลอดเวลา",
    Preview: EvidencePreview,
  },
  {
    title: "เทียบกับสายงาน IT",
    body: "ดูสายงานที่ใกล้เคียงที่สุด พร้อมเหตุผลของคะแนนแต่ละส่วน",
    Preview: RolesPreview,
  },
  {
    title: "รู้ว่าควรเติมอะไร",
    body: "ทักษะที่ยังขาดพร้อมขั้นตอนถัดไป และเงินเดือนอ้างอิงในกรุงเทพฯ",
    Preview: GapPreview,
  },
];

const STEPS = [
  {
    title: "เพิ่มข้อมูล",
    Icon: FilePlus2,
    stats: [
      { label: "ช่องทาง", value: "CV · แบบสอบถาม" },
    ],
    checks: ["เริ่มจาก CV หรือแบบสอบถามก็ได้", "แชทช่วยเติมส่วนที่ยังขาด"],
  },
  {
    title: "ดูโปรไฟล์",
    Icon: UserRound,
    stats: [
      { label: "หมวด", value: "5" },
      { label: "ทุกทักษะมี", value: "ที่มา" },
    ],
    checks: ["แก้ไขผ่านแชทได้", "ลบทักษะที่ไม่ใช่ได้ทันที"],
  },
  {
    title: "เลือกสายงาน",
    Icon: Compass,
    stats: [
      { label: "สายงานที่แนะนำ", value: "5" },
      { label: "คะแนนแยก", value: "4 ส่วน" },
    ],
    checks: ["อธิบายที่มาของคะแนน", "ไม่ใช่การรับประกันการได้งาน"],
  },
  {
    title: "วางแผนต่อ",
    Icon: Route,
    stats: [
      { label: "ขั้นตอนถัดไป", value: "≤ 5" },
      { label: "ข้อมูลเงินเดือน", value: "กรุงเทพฯ" },
    ],
    checks: ["เรียงตามความสำคัญ", "บอกแหล่งที่มาและวันที่"],
  },
];

const PRIVACY = [
  "ขอความยินยอมก่อนเริ่ม",
  "ใช้เพื่อแนะนำสายงานเท่านั้น",
  "ตรวจสอบและแก้ไขได้",
  "ลบทักษะที่ไม่ต้องการ",
  "ลบข้อมูลทั้งหมดได้",
  "ผู้ดูแลเห็นเฉพาะภาพรวม",
];

function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-tiny font-semibold tracking-[0.12em] text-accent uppercase">{eyebrow}</p>
      <h2 className="mt-3 text-h1 font-bold text-text md:text-[40px] md:leading-[56px]">{title}</h2>
      {children && <p className="mt-3 text-body text-text-muted">{children}</p>}
    </div>
  );
}

function PrimaryCta({ href, children }) {
  return (
    <Link
      href={href}
      className="group inline-flex min-h-12 items-center gap-3 rounded-full bg-hero-cta py-2 pr-2 pl-6 text-body font-semibold text-on-hero-cta shadow-md transition-transform duration-200 ease-out hover:-translate-y-0.5"
    >
      {children}
      <span className="inline-flex size-9 items-center justify-center rounded-full bg-on-hero-cta text-hero-cta transition-transform duration-200 ease-out group-hover:translate-x-0.5">
        <ArrowRight className="size-4" strokeWidth={2} aria-hidden="true" />
      </span>
    </Link>
  );
}

function SecondaryCta({ href, children }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-12 items-center rounded-full border border-hero-muted/40 px-6 text-body font-medium text-hero-fg transition-colors duration-200 ease-out hover:bg-hero-fg/10"
    >
      {children}
    </Link>
  );
}

function Hero() {
  return (
    <section className="bg-brand-gradient relative isolate overflow-hidden">
      <div className="hero-scrim absolute inset-0 -z-10" aria-hidden="true" />

      <div className="mx-auto max-w-[1120px] px-4 pt-20 text-center md:px-6 md:pt-28">
        <p className="text-small font-semibold text-hero-muted">รู้จักตัวเอง ก่อนเลือกสายงาน IT</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-[36px] leading-[52px] font-bold text-hero-fg md:text-hero">
          เข้าใจตัวเองก่อน
          <br />
          แล้วงานที่ใช่จะชัดขึ้น
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-body text-hero-muted">
          สะท้อนจุดแข็ง ทักษะที่ควรเติม และสายงานที่เหมาะ จากเรื่องราวและประสบการณ์ของคุณ
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <PrimaryCta href="/register">สมัครใช้งาน</PrimaryCta>
          <SecondaryCta href="/login">เข้าสู่ระบบ</SecondaryCta>
        </div>
      </div>

      {/* Floating preview cards over the horizon */}
      <div className="relative mx-auto mt-16 h-[420px] max-w-[1120px] md:mt-20 md:h-[400px]">
        <div className="hero-glow absolute top-0 left-1/2 size-[620px] -translate-x-1/2" aria-hidden="true" />
        <div className="relative z-10 flex flex-col items-center gap-4 md:flex-row md:justify-center md:gap-10">
          <ProfileCard className="animate-float -rotate-6 md:mt-10" />
          <MatchCard className="animate-float-slow hidden rotate-6 sm:block" />
        </div>
        <div
          className="horizon absolute top-[150px] left-1/2 aspect-square w-[1500px] -translate-x-1/2 rounded-full md:top-[190px] md:w-[1900px]"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="mx-auto w-full max-w-[1120px] px-4 py-20 md:px-6">
      <SectionHeading eyebrow="ภาพรวม" title="เห็นตัวเองชัดขึ้น ก่อนตัดสินใจ">
        CareerMirror ไม่ได้บอกว่าคุณควรเป็นอะไร แต่ช่วยให้คุณเห็นสิ่งที่มีอยู่แล้วอย่างชัดเจน
      </SectionHeading>
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ title, body, Preview }) => (
          <li key={title} className="rounded-xl border border-border bg-surface p-2 shadow-sm">
            <Thumb className="h-44">
              <Preview />
            </Thumb>
            <div className="px-3 pt-4 pb-3">
              <h3 className="text-h3 font-semibold text-text">{title}</h3>
              <p className="mt-1 text-small text-text-muted">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Steps() {
  return (
    <section className="mx-auto w-full max-w-[1120px] px-4 pb-20 md:px-6">
      <SectionHeading eyebrow="ขั้นตอน" title="4 ขั้นตอน สู่ก้าวถัดไปที่ชัดเจน">
        ทำตามลำดับหรือข้ามไปมาได้ ข้อมูลของคุณบันทึกไว้ให้เสมอ
      </SectionHeading>
      <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ title, Icon, stats, checks }, i) => (
          <li key={title} className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
            <Thumb className="h-28 rounded-none">
              <span className="glass absolute top-4 left-4 inline-flex size-11 items-center justify-center rounded-md">
                <Icon className="size-5 text-primary" strokeWidth={1.5} />
              </span>
              <span className="glass absolute top-4 right-4 rounded-sm px-2 py-0.5 font-[family-name:var(--font-latin-first)] text-tiny text-text tabular">
                {String(i + 1).padStart(2, "0")}
              </span>
            </Thumb>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-h3 font-semibold text-text">{title}</h3>
              <dl className="mt-4 flex gap-6 border-b border-border pb-4">
                {stats.map((s) => (
                  <div key={s.label}>
                    <dt className="text-tiny text-text-muted">{s.label}</dt>
                    <dd className="mt-0.5 text-h3 font-semibold text-text">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <ul className="mt-4 space-y-2">
                {checks.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-small text-text-muted">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={1.5} aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Privacy() {
  return (
    <section className="mx-auto w-full max-w-[1120px] px-4 pb-20 md:px-6">
      <div className="bg-brand-gradient relative isolate overflow-hidden rounded-xl px-6 py-10 md:px-12 md:py-14">
        <div className="hero-scrim absolute inset-0 -z-10" aria-hidden="true" />
        <div
          className="horizon absolute top-[55%] -right-[260px] -z-10 aspect-square w-[620px] rounded-full md:top-[35%]"
          aria-hidden="true"
        />
        <div className="max-w-xl">
          <p className="text-tiny font-semibold tracking-[0.12em] text-hero-muted uppercase">ความเป็นส่วนตัว</p>
          <h2 className="mt-3 text-h1 font-bold text-hero-fg">คุณเป็นเจ้าของเรื่องราวของคุณ</h2>
          <p className="mt-2 text-body text-hero-muted">
            ข้อมูลใช้เพื่อแนะนำสายงานเท่านั้น คุณตรวจสอบ แก้ไข และลบได้ทุกเมื่อ
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {PRIVACY.map((p) => (
              <li key={p} className="glass rounded-full px-4 py-1.5 text-small text-text">
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="glass animate-float absolute top-10 right-10 hidden rotate-6 flex-col items-center gap-2 rounded-xl px-6 py-5 lg:flex"
          aria-hidden="true"
        >
          <ShieldCheck className="size-9 text-primary" strokeWidth={1.5} />
          <span className="text-h3 font-semibold text-text">ข้อมูลของคุณ</span>
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-brand-gradient relative isolate overflow-hidden">
      <div className="hero-scrim absolute inset-0 -z-10" aria-hidden="true" />
      <div className="mx-auto max-w-[1120px] px-4 pt-20 pb-40 text-center md:px-6 md:pb-48">
        <Eye className="mx-auto size-8 text-hero-muted" strokeWidth={1.5} aria-hidden="true" />
        <h2 className="mx-auto mt-4 max-w-2xl text-h1 font-bold text-hero-fg md:text-[40px] md:leading-[56px]">
          เริ่มจากสิ่งที่คุณมีอยู่แล้ว
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-hero-muted">
          อัปโหลด CV หรือตอบแบบสอบถาม แล้วดูว่าทักษะของคุณเหมาะกับสายงาน IT แบบไหน
        </p>
        <div className="mt-8 flex justify-center">
          <PrimaryCta href="/register">สร้างโปรไฟล์</PrimaryCta>
        </div>
      </div>
      <div
        className="horizon absolute top-[calc(100%-110px)] left-1/2 aspect-square w-[1500px] -translate-x-1/2 rounded-full md:w-[1900px]"
        aria-hidden="true"
      />
    </section>
  );
}

function Footer() {
  return (
    <footer className="mx-auto flex w-full max-w-[1120px] flex-col gap-2 px-4 py-8 text-small text-text-muted md:flex-row md:justify-between md:px-6">
      <p>CareerMirror · รู้จักตัวเองก่อนสมัครงาน</p>
      <p>คำแนะนำช่วยสำรวจทางเลือก ไม่รับประกันการได้งาน</p>
    </footer>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <Steps />
      <Privacy />
      <FinalCta />
      <Footer />
    </>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, Clock, Database, Loader2, RefreshCw, Server, ShieldAlert, XCircle } from "lucide-react";
import { data } from "@/lib/data";
import { usePageReady } from "@/components/motion/page-transition";
import { dateTh, num } from "@/lib/format";
import { useSession } from "@/lib/session";
import { StatTile, ShareBars } from "@/components/charts/admin";
import { Meter } from "@/components/charts/meter";
import { Button, ErrorState, LoadingBlock } from "@/components/intake/ui";

// Admin dashboard /admin (PRD FR-40 – FR-45, DesignSystem.md section 4):
// read-only aggregates from GET /api/admin/overview. Header with the window
// switch, last updated time and refresh; the warning list; then the panels
// สถานะระบบ, การใช้ AI, โควตาผู้ใช้, ข้อมูลตลาดงาน (full-width table), AI Router
// and เส้นทางผู้ใช้. Refreshes every 60 s while open. No step indicator, no chat,
// never any user content (FR-42).

// Warning thresholds are api config (ADMIN_WARN_LLM_PCT, ADMIN_WARN_ERROR_PCT);
// the api sends the resulting warnings, and the web colours single values with
// the same numbers, set at build time.
const WARN_LLM_PCT = Number(process.env.NEXT_PUBLIC_ADMIN_WARN_LLM_PCT || 80);
const WARN_ERROR_PCT = Number(process.env.NEXT_PUBLIC_ADMIN_WARN_ERROR_PCT || 5);
const REFRESH_MS = 60000;

const WINDOWS = [
  { id: "today", label: "วันนี้" },
  { id: "7d", label: "7 วัน" },
  { id: "30d", label: "30 วัน" },
];
const PANEL_TH = { health: "สถานะระบบ", llm: "การใช้ AI", quota: "โควตาผู้ใช้", cache: "ข้อมูลตลาดงาน", router: "AI Router" };
const ROLE_TH = { main: "โมเดลหลัก", router: "Router", fallback: "Fallback" };
const PRIORITY_CODES = ["LLM_UNAVAILABLE", "LLM_TIMEOUT", "INTERNAL_ERROR", "RATE_LIMITED"];
const pct = (r) => `${Math.round(r * 100)}%`;
const timeTh = (iso) => new Date(iso).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

/* ---------- layout pieces ---------- */

function Panel({ id, title, subtitle, warn, wide = false, children }) {
  return (
    <section aria-labelledby={`panel-${id}`} className={`rounded-xl border bg-surface p-5 shadow-sm md:p-6 ${warn ? "border-warning/60" : "border-border"} ${wide ? "lg:col-span-2" : ""}`}>
      <header className="mb-5 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 id={`panel-${id}`} className="text-h3 font-semibold text-text">
            {title}
          </h2>
          {subtitle && <p className="mt-0.5 text-small text-text-muted">{subtitle}</p>}
        </div>
        {warn && (
          <span className="inline-flex items-center gap-1 rounded-full border border-warning px-2.5 py-0.5 text-tiny font-medium text-warning">
            <AlertTriangle className="size-3.5" strokeWidth={2} aria-hidden="true" />
            มีคำเตือน
          </span>
        )}
      </header>
      {children}
    </section>
  );
}

function SmallStat({ label, value, warn = false }) {
  return (
    <div className="rounded-lg border border-border bg-bg p-3">
      <p className="text-tiny text-text-muted">{label}</p>
      <p className={`tabular mt-0.5 text-h3 font-semibold ${warn ? "text-warning" : "text-text"}`}>{value}</p>
    </div>
  );
}

/** Horizontal count bars (errors by code, funnel, removed skills): label, bar, number. */
function CountBars({ items, total, showShare = false }) {
  const top = Math.max(1, ...items.map((i) => i.count));
  return (
    <ul className="space-y-2.5">
      {items.map((i) => (
        <li key={i.key} className="grid grid-cols-[minmax(0,10rem)_1fr_auto] items-center gap-3 text-small">
          <span className={`truncate text-text ${i.mono ? "font-[family-name:var(--font-latin-first)] text-tiny" : ""}`}>{i.label}</span>
          <span className="h-2.5 overflow-hidden rounded-full bg-border" aria-hidden="true">
            <span className={`block h-full rounded-full ${i.warn ? "bg-warning" : "bg-primary"}`} style={{ width: `${(i.count / top) * 100}%` }} />
          </span>
          <span className="tabular text-right text-text-muted">
            {num(i.count)}
            {showShare && total ? ` · ${pct(i.count / total)}` : ""}
          </span>
        </li>
      ))}
    </ul>
  );
}

function WindowSwitch({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="ช่วงเวลา" className="inline-flex rounded-full border border-border bg-bg p-1">
      {WINDOWS.map((w) => (
        <button
          key={w.id}
          type="button"
          role="radio"
          aria-checked={value === w.id}
          onClick={() => onChange(w.id)}
          className={`min-h-9 rounded-full px-4 text-small font-medium transition-colors duration-150 ${value === w.id ? "bg-primary text-on-primary" : "text-text-muted hover:text-text"}`}
        >
          {w.label}
        </button>
      ))}
    </div>
  );
}

/** Warning list (FR-44): one row per warning, or "ทุกอย่างปกติ". */
function Warnings({ warnings }) {
  if (!warnings.length) {
    return (
      <p role="status" className="flex items-center gap-2 rounded-xl border border-border bg-surface px-5 py-4 text-small text-text">
        <CheckCircle2 className="size-5 text-success" strokeWidth={2} aria-hidden="true" />
        ทุกอย่างปกติ
      </p>
    );
  }
  return (
    <section aria-label="คำเตือน" className="rounded-xl border border-warning/60 bg-surface px-5 py-4">
      <p className="flex items-center gap-2 font-semibold text-warning">
        <AlertTriangle className="size-5" strokeWidth={2} aria-hidden="true" />
        คำเตือน {warnings.length} รายการ
      </p>
      <ul className="mt-2 space-y-1.5">
        {warnings.map((w, i) => (
          <li key={`${w.code}-${i}`} className="flex flex-wrap gap-x-2 text-small text-text">
            <span className="font-semibold">{PANEL_TH[w.panel] ?? w.panel}:</span>
            <span>{w.message_th}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ---------- panels ---------- */

function HealthPanel({ health, warn }) {
  const errors = [...health.errors_by_code].sort((a, b) => {
    const pa = PRIORITY_CODES.indexOf(a.code);
    const pb = PRIORITY_CODES.indexOf(b.code);
    return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb) || b.count - a.count;
  });
  const up = (ok) => (ok ? <CheckCircle2 className="size-4 text-success" strokeWidth={2} aria-hidden="true" /> : <XCircle className="size-4 text-danger" strokeWidth={2} aria-hidden="true" />);
  return (
    <Panel id="health" title="สถานะระบบ" subtitle="คำขอ ข้อผิดพลาด และความหน่วงของ AI ในช่วงเวลาที่เลือก" warn={warn}>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-small text-text">
        <span className="inline-flex items-center gap-1.5">
          <Server className="size-4 text-text-muted" strokeWidth={1.75} aria-hidden="true" />
          API {up(health.api === "ok")} {health.api === "ok" ? "พร้อมใช้" : "มีปัญหา"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Database className="size-4 text-text-muted" strokeWidth={1.75} aria-hidden="true" />
          ฐานข้อมูล {up(health.db === "ok")} {health.db === "ok" ? "พร้อมใช้" : "ติดต่อไม่ได้"}
        </span>
        <span className="inline-flex items-center gap-1.5 text-text-muted">
          <Clock className="size-4" strokeWidth={1.75} aria-hidden="true" />
          คำขอล่าสุด {health.last_request_at ? `${dateTh(health.last_request_at)} ${timeTh(health.last_request_at)} น.` : "–"}
        </span>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <StatTile label="คำขอทั้งหมด" value={health.requests} />
        <StatTile label="อัตราข้อผิดพลาด" value={health.error_rate * 100} format="pct1" warnAbove={WARN_ERROR_PCT} />
        <StatTile label="ความหน่วง AI (p50)" value={health.llm_latency_ms.p50 / 1000} format="sec" target={health.llm_latency_ms.target / 1000} />
        <StatTile label="ความหน่วง AI (p95)" value={health.llm_latency_ms.p95 / 1000} format="sec" target={health.llm_latency_ms.target / 1000} />
      </div>
      <h3 className="mt-6 mb-3 text-small font-semibold text-text">ข้อผิดพลาดแยกตามรหัส</h3>
      {errors.length ? (
        <CountBars items={errors.map((e) => ({ key: e.code, label: e.code, count: e.count, mono: true, warn: PRIORITY_CODES.includes(e.code) }))} />
      ) : (
        <p className="text-small text-text-muted">ไม่มีข้อผิดพลาด</p>
      )}
    </Panel>
  );
}

function LlmPanel({ llm, warn }) {
  return (
    <Panel id="llm" title="การใช้ AI วันนี้" subtitle={`แยกตามโมเดล เทียบกับขีดจำกัดต่อวัน · เตือนเมื่อเกิน ${WARN_LLM_PCT}%`} warn={warn}>
      <div className="space-y-6">
        {llm.models.map((m) => (
          <div key={`${m.model}-${m.role}`}>
            <p className="mb-2 text-small font-semibold text-text">
              {ROLE_TH[m.role] ?? m.role} <span className="font-[family-name:var(--font-latin-first)] text-tiny font-normal text-text-muted">{m.model}</span>
            </p>
            <div className="space-y-3">
              <Meter label="โทเคน" value={m.tokens_used} max={m.tokens_limit} warnAt={WARN_LLM_PCT / 100} warnText={`เกิน ${WARN_LLM_PCT}% ของขีดจำกัด`} format={(v, max) => `${num(v)} / ${num(max)}`} />
              <Meter label="คำขอ" value={m.requests_used} max={m.requests_limit} warnAt={WARN_LLM_PCT / 100} warnText={`เกิน ${WARN_LLM_PCT}% ของขีดจำกัด`} format={(v, max) => `${num(v)} / ${num(max)}`} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <SmallStat label="ตอบกลับ 429 (rate limit)" value={num(llm.rate_limited_429)} />
        <SmallStat label="เรียกโมเดลสำรอง" value={num(llm.fallback_calls)} />
      </div>
    </Panel>
  );
}

function QuotaPanel({ quota }) {
  return (
    <Panel id="quota" title="โควตาผู้ใช้วันนี้" subtitle="รวมทุกบัญชี ไม่แสดงรายบุคคล">
      <div className="grid grid-cols-2 gap-3">
        <SmallStat label="คำขอที่ใช้ไป" value={num(quota.requests_used)} />
        <SmallStat label="โทเคนที่ใช้ไป" value={num(quota.tokens_used)} />
        <SmallStat label="ผู้ใช้ที่ใช้งานวันนี้" value={num(quota.users_active)} />
        <SmallStat label="ผู้ใช้ที่ใช้เกิน 80%" value={num(quota.users_over_80pct)} />
        <SmallStat label="ผู้ใช้ที่ใช้ครบโควตา" value={num(quota.users_exhausted)} warn={quota.users_exhausted > 0} />
      </div>
    </Panel>
  );
}

const CACHE_COLUMNS = [
  { key: "title_th", label: "สายงาน" },
  { key: "age_days", label: "อายุข้อมูล", numeric: true },
  { key: "status", label: "สถานะ" },
  { key: "posting_count", label: "ประกาศงาน", numeric: true },
  { key: "salary_parsed_share", label: "มีเงินเดือน %", numeric: true },
  { key: "has_reference_salary", label: "เงินเดือนอ้างอิง" },
  { key: "last_error", label: "ข้อผิดพลาดล่าสุด" },
];
const STATUS_ORDER = { error: 0, stale: 1, refreshing: 2, empty: 3, fresh: 4 };
const cacheStatus = (r) => (r.last_error ? "error" : r.refreshing ? "refreshing" : r.fetched_at === null ? "empty" : r.stale ? "stale" : "fresh");

function CacheStatus({ row }) {
  const s = cacheStatus(row);
  if (s === "refreshing") {
    return (
      <span className="inline-flex items-center gap-1.5 text-text-muted">
        <Loader2 className="size-3.5 animate-spin motion-reduce:animate-none" strokeWidth={2} aria-hidden="true" />
        กำลังอัปเดต
      </span>
    );
  }
  if (s === "error" || s === "stale") {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-warning">
        <AlertTriangle className="size-3.5" strokeWidth={2} aria-hidden="true" />
        {s === "error" ? "ดึงข้อมูลผิดพลาด" : "เก่ากว่า 7 วัน"}
      </span>
    );
  }
  if (s === "empty") return <span className="text-text-muted">ยังไม่มีข้อมูล</span>;
  return (
    <span className="inline-flex items-center gap-1.5 text-success">
      <CheckCircle2 className="size-3.5" strokeWidth={2} aria-hidden="true" />
      พร้อมใช้
    </span>
  );
}

function CachePanel({ cache, warn }) {
  const [sort, setSort] = useState({ key: "status", dir: "asc" });
  const rows = useMemo(() => {
    const value = (r) => (sort.key === "status" ? STATUS_ORDER[cacheStatus(r)] : sort.key === "age_days" ? (r.age_days ?? 999) : r[sort.key]);
    return [...cache.roles].sort((a, b) => {
      const va = value(a);
      const vb = value(b);
      const c = typeof va === "string" ? va.localeCompare(vb, "th") : Number(va ?? -1) - Number(vb ?? -1);
      return sort.dir === "asc" ? c : -c;
    });
  }, [cache.roles, sort]);
  const over = cache.apify_runs_this_week > cache.apify_runs_budget;

  return (
    <Panel id="cache" title={`ข้อมูลตลาดงาน · ${cache.roles.length} สายงาน`} subtitle="แคชต่อสายงาน (ข้อมูลกรุงเทพฯ) · ระบบอัปเดตเองทุก 7 วัน หน้านี้ไม่สั่งดึงข้อมูล" warn={warn} wide>
      <Meter
        label="การดึงข้อมูล Apify สัปดาห์นี้"
        value={cache.apify_runs_this_week}
        max={cache.apify_runs_budget}
        warnAt={over ? 0 : 2} /* Meter caps the ratio at 1, so warn only when the budget is passed */
        warnText={`เกินงบ ${cache.apify_runs_budget} ครั้งต่อสัปดาห์`}
        format={(v, max) => `${num(v)} / ${num(max)}`}
      />
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-small">
          <thead>
            <tr className="border-b border-border text-tiny text-text-muted">
              {CACHE_COLUMNS.map((c) => {
                const active = sort.key === c.key;
                return (
                  <th key={c.key} scope="col" aria-sort={active ? (sort.dir === "asc" ? "ascending" : "descending") : "none"} className={`py-2 pr-3 font-semibold ${c.numeric ? "text-right" : ""}`}>
                    <button
                      type="button"
                      onClick={() => setSort({ key: c.key, dir: active && sort.dir === "asc" ? "desc" : "asc" })}
                      className={`inline-flex min-h-9 items-center gap-1 rounded-sm hover:text-text ${active ? "text-text" : ""}`}
                    >
                      {c.label}
                      {active && (sort.dir === "asc" ? <ArrowUp className="size-3" strokeWidth={2} aria-hidden="true" /> : <ArrowDown className="size-3" strokeWidth={2} aria-hidden="true" />)}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.role_id} className="border-b border-border last:border-0">
                <th scope="row" className="py-2.5 pr-3 font-medium text-text">
                  <Link href={`/roles/${r.role_id}`} className="hover:underline">
                    {r.title_th}
                  </Link>
                </th>
                <td className={`tabular py-2.5 pr-3 text-right ${r.stale ? "font-semibold text-warning" : "text-text"}`} title={r.fetched_at ? dateTh(r.fetched_at) : undefined}>
                  {r.age_days === null ? "–" : `${r.age_days} วัน`}
                </td>
                <td className="py-2.5 pr-3">
                  <CacheStatus row={r} />
                </td>
                <td className="tabular py-2.5 pr-3 text-right text-text">{num(r.posting_count)}</td>
                <td className="tabular py-2.5 pr-3 text-right text-text">{r.posting_count ? pct(r.salary_parsed_share) : "–"}</td>
                <td className="py-2.5 pr-3 text-text">{r.has_reference_salary ? "มี" : <span className="text-text-muted">ไม่มี</span>}</td>
                <td className="py-2.5 font-[family-name:var(--font-latin-first)] text-tiny text-warning">{r.last_error ?? <span className="text-text-muted">–</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function RouterPanel({ router, warn }) {
  const layers = [
    { layer: "Rules", share: router.by_layer.rules },
    { layer: "LLM", share: router.by_layer.llm },
    { layer: "Guard", share: router.by_layer.guard },
  ];
  return (
    <Panel id="router" title="AI Router" subtitle={`ข้อความ ${num(router.messages)} รายการในช่วงเวลาที่เลือก`} warn={warn}>
      <div className="space-y-6">
        <ShareBars title="สัดส่วนเส้นทาง" items={router.by_route} labelKey="route" />
        <ShareBars title="ตัดสินใจโดย" description="กฎ · LLM · ตัวกรองความปลอดภัย" items={layers} labelKey="layer" />
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <SmallStat label="clarify" value={pct(router.clarify_rate)} />
        <SmallStat label="decline" value={pct(router.decline_rate)} />
        <SmallStat label="ความมั่นใจต่ำ" value={pct(router.low_confidence_rate)} />
      </div>
    </Panel>
  );
}

function FunnelPanel({ funnel }) {
  const steps = [
    { key: "registered", label: "สมัครใช้งาน", count: funnel.registered },
    { key: "input", label: "มี CV หรือแบบสอบถาม", count: funnel.with_cv_or_questionnaire },
    { key: "profile", label: "สร้างโปรไฟล์", count: funnel.profile_generated },
    { key: "role", label: "เปิดดูสายงาน", count: funnel.role_opened },
  ];
  const mix = [
    { input: "CV อย่างเดียว", share: funnel.input_mix.cv_only },
    { input: "แบบสอบถามอย่างเดียว", share: funnel.input_mix.questionnaire_only },
    { input: "ทั้งสองอย่าง", share: funnel.input_mix.both },
  ];
  const e = funnel.edits;
  return (
    <Panel id="funnel" title="เส้นทางผู้ใช้" subtitle="จำนวนรวมในช่วงเวลาที่เลือก · ไม่แสดงรายบุคคล" wide>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-small font-semibold text-text">จากสมัครถึงเปิดดูสายงาน</h3>
          <CountBars items={steps} total={funnel.registered} showShare />
          <div className="mt-5 grid grid-cols-2 gap-3">
            <SmallStat label="ความครบถ้วนเฉลี่ยตอนสร้างโปรไฟล์" value={`${Math.round(funnel.avg_completeness_at_generate)}%`} />
            <SmallStat label="CV ที่อ่านไม่ได้" value={pct(funnel.cv_unreadable_rate)} />
          </div>
        </div>
        <div className="space-y-6">
          <ShareBars title="ข้อมูลที่ผู้ใช้ให้" items={mix} labelKey="input" />
          <div>
            <h3 className="mb-3 text-small font-semibold text-text">การแก้โปรไฟล์ผ่านแชท</h3>
            <div className="grid grid-cols-3 gap-3">
              <SmallStat label="ยืนยัน" value={num(e.applied)} />
              <SmallStat label="ยกเลิก" value={num(e.rejected)} />
              <SmallStat label="หมดเวลา" value={num(e.expired)} />
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-small font-semibold text-text">ทักษะที่ถูกลบบ่อยที่สุด</h3>
            {funnel.top_removed_skills.length ? (
              <CountBars items={funnel.top_removed_skills.map((s) => ({ key: s.skill_id, label: s.name_th, count: s.count }))} />
            ) : (
              <p className="text-small text-text-muted">ยังไม่มีการลบทักษะ</p>
            )}
          </div>
        </div>
      </div>
    </Panel>
  );
}

/* ---------- page ---------- */

function Forbidden() {
  return (
    <div className="mx-auto mt-10 flex max-w-md flex-col items-center rounded-xl border border-border bg-surface px-6 py-14 text-center">
      <ShieldAlert className="size-10 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
      <h1 className="mt-4 text-h3 font-semibold text-text">หน้านี้สำหรับผู้ดูแลระบบเท่านั้น</h1>
      <Link href="/start" className="mt-5 inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-small font-semibold text-on-primary hover:bg-primary-hover">
        กลับไปหน้าหลัก
      </Link>
    </div>
  );
}

export function AdminDashboard() {
  const session = useSession();
  const [win, setWin] = useState("today");
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const requestRef = useRef(0);

  const load = useCallback((w) => {
    requestRef.current += 1;
    const id = requestRef.current;
    setLoading(true);
    return data.adminOverview(w).then(
      (o) => {
        if (id !== requestRef.current) return; // a newer window was picked
        setError(null);
        setOverview(o);
        setLoading(false);
      },
      (e) => {
        if (id !== requestRef.current) return;
        setError(e);
        setLoading(false);
      },
    );
  }, []);

  const isAdmin = session.status === "ready" && session.user?.is_admin;
  usePageReady(session.status === "error" || (session.status === "ready" && (!isAdmin || Boolean(overview || error))));

  // Load on open and on window change, then every 60 s while the tab is visible (FR-45).
  useEffect(() => {
    if (!isAdmin) return;
    // First load on the next tick, so the loading state is not set inside the effect body.
    const first = setTimeout(() => load(win), 0);
    const t = setInterval(() => {
      if (document.visibilityState === "visible") load(win);
    }, REFRESH_MS);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, [isAdmin, win, load]);

  const wrap = (children) => <div className="mx-auto w-full max-w-[1120px] px-4 pt-8 pb-24 md:px-6 md:pt-10">{children}</div>;

  if (session.status === "error") return wrap(<ErrorState error={session.error} onRetry={() => window.location.reload()} />);
  if (session.status !== "ready") return wrap(<LoadingBlock lines={8} label="กำลังโหลด…" />);
  if (!isAdmin || error?.code === "FORBIDDEN") return wrap(<Forbidden />);

  const warnPanels = new Set((overview?.warnings ?? []).map((w) => w.panel));

  return wrap(
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-h1 font-bold text-text">ภาพรวมการทำงานของระบบ</h1>
          <p className="mt-1 text-small text-text-muted">
            อ่านอย่างเดียว · ตัวเลขรวมเท่านั้น ไม่แสดงข้อมูลส่วนบุคคล · อัปเดตเองทุก 60 วินาที
            {overview && ` · อัปเดตล่าสุด ${dateTh(overview.generated_at)} ${timeTh(overview.generated_at)} น.`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <WindowSwitch value={win} onChange={setWin} />
          <Button variant="secondary" onClick={() => load(win)} loading={loading}>
            {!loading && <RefreshCw className="size-4" strokeWidth={2} aria-hidden="true" />}
            รีเฟรช
          </Button>
        </div>
      </header>
      <p className="mt-2 text-tiny text-text-muted">ช่วงเวลาใช้กับสถานะระบบ AI Router และเส้นทางผู้ใช้ · การใช้ AI และโควตาเป็นของวันนี้เสมอ · ตารางแคชเป็นข้อมูลปัจจุบัน</p>

      {error && (
        <div className="mt-6">
          <ErrorState error={error} onRetry={() => load(win)} />
        </div>
      )}

      {!overview ? (
        !error && (
          <div className="mt-6">
            <LoadingBlock lines={8} label="กำลังโหลดข้อมูลแดชบอร์ด…" />
          </div>
        )
      ) : (
        <div className={`mt-6 space-y-6 transition-opacity duration-150 ${loading ? "opacity-70" : ""}`} aria-busy={loading}>
          <Warnings warnings={overview.warnings} />
          <div className="grid items-start gap-6 lg:grid-cols-2">
            <HealthPanel health={overview.health} warn={warnPanels.has("health")} />
            <LlmPanel llm={overview.llm} warn={warnPanels.has("llm")} />
            <QuotaPanel quota={overview.quota} />
            <RouterPanel router={overview.router} warn={warnPanels.has("router")} />
            <CachePanel cache={overview.cache} warn={warnPanels.has("cache")} />
            <FunnelPanel funnel={overview.funnel} />
          </div>
        </div>
      )}
    </>,
  );
}

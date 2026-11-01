"use client";

import { useMemo } from "react";
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_MOTION, useReducedMotion } from "@/lib/use-motion";
import { ChartCard, LegendItem, TooltipBox } from "./chart-card";
import { HeroNumber, Meter } from "./meter";

const YOU = "var(--color-chart-you)";
const one = (n) => n.toFixed(1);

/** Match % headline: big number + meter + the required disclaimer (DesignSystem.md 5). */
export function MatchSummary({ roleTitle, matchPct, threshold = 60 }) {
  const passes = matchPct >= threshold;
  return (
    <ChartCard title={`ความตรงกับสายงาน ${roleTitle}`} description={`แสดงสายงานที่ได้ตั้งแต่ ${threshold}% ขึ้นไป`}>
      <div className="flex items-end gap-4">
        <HeroNumber value={matchPct} className="text-[56px]" />
        <span className={`mb-2 rounded-full px-3 py-0.5 text-tiny font-medium ${passes ? "bg-primary-subtle text-text" : "border border-warning text-warning"}`}>
          {passes ? "✓ ผ่านเกณฑ์" : "! ต่ำกว่าเกณฑ์"}
        </span>
      </div>
      <div className="mt-4">
        <Meter value={matchPct} size="lg" />
      </div>
      <p className="mt-3 text-tiny text-text-muted">คำนวณจากทักษะที่ตรงกับสายงาน ไม่ใช่การรับประกันการได้งาน</p>
    </ChartCard>
  );
}

/** Completeness meter for the intake sidebar. */
export function CompletenessSummary({ value, threshold = 65 }) {
  return (
    <ChartCard title="ความครบถ้วนของโปรไฟล์" description={`สร้างโปรไฟล์ได้เมื่อถึง ${threshold}% และข้อมูลที่จำเป็นครบ`}>
      <div className="flex items-end gap-3">
        <HeroNumber value={value} className="text-[48px]" />
      </div>
      <div className="mt-4">
        <Meter value={value} size="lg" />
      </div>
      <p className="mt-3 text-small text-text-muted">อีก {threshold - value}% ก็สร้างโปรไฟล์ได้ ลองตอบแบบสอบถามหมวดเป้าหมาย</p>
    </ChartCard>
  );
}

function BreakdownTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <TooltipBox
      title={d.label}
      rows={[
        { color: YOU, label: "ได้", value: `${one(d.earned)} คะแนน` },
        { label: "เต็ม", value: `${d.max} คะแนน` },
        { label: "ที่มา", value: d.detail },
      ]}
    />
  );
}

/**
 * Why the score is what it is: points earned out of each part's maximum on one
 * shared scale, so it is clear that required skills carry most of the score.
 */
export function MatchBreakdown({ parts, matchPct }) {
  const reduced = useReducedMotion();
  // Stable data: Recharts restarts its animation whenever the data array changes.
  const data = useMemo(() => parts.map((p) => ({ ...p, rest: p.max - p.earned, text: `${one(p.earned)} / ${p.max}` })), [parts]);

  return (
    <ChartCard
      title="ที่มาของคะแนน"
      description={`คะแนนรวม ${matchPct} จาก 100 แยกตาม 4 ส่วน`}
      legend={
        <div className="flex flex-wrap gap-4">
          <LegendItem color={YOU}>คะแนนที่ได้</LegendItem>
          <LegendItem color="var(--color-border)">คะแนนเต็มของส่วนนั้น</LegendItem>
        </div>
      }
      table={{
        columns: ["ส่วน", "ได้", "เต็ม", "ที่มา"],
        rows: parts.map((p) => [p.label, one(p.earned), p.max, p.detail]),
      }}
    >
      <div className="h-[200px] w-full" role="img" aria-label={`คะแนนรวม ${matchPct} แยกเป็น 4 ส่วน`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 84, bottom: 0, left: 0 }} barCategoryGap={10}>
            <XAxis type="number" domain={[0, 70]} hide />
            <YAxis type="category" dataKey="label" width={120} axisLine={false} tickLine={false} tick={{ fill: "var(--color-text)", fontSize: 13 }} />
            <Tooltip content={<BreakdownTooltip />} cursor={{ fill: "var(--color-bg)", opacity: 0.6 }} />
            <Bar dataKey="earned" stackId="a" fill={YOU} radius={[4, 0, 0, 4]} isAnimationActive={!reduced} animationDuration={CHART_MOTION.duration} animationEasing={CHART_MOTION.easing} />
            <Bar dataKey="rest" stackId="a" fill="var(--color-border)" radius={[0, 4, 4, 0]} isAnimationActive={!reduced} animationDuration={CHART_MOTION.duration} animationEasing={CHART_MOTION.easing}>
              <LabelList dataKey="text" position="right" fill="var(--color-text-muted)" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

function TrendTooltip({ active, payload, postings }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return <TooltipBox title={d.name} rows={[{ color: YOU, label: "พบในประกาศ", value: `${d.count} จาก ${postings}` }]} />;
}

/** Market demand: skills most often asked for in the cached postings, sorted. */
export function TrendingSkills({ data, roleTitle }) {
  const reduced = useReducedMotion();
  const skills = useMemo(() => [...data.skills].sort((a, b) => b.count - a.count), [data.skills]);

  return (
    <ChartCard
      title="ทักษะที่ประกาศงานต้องการบ่อย"
      description={`${roleTitle} · จาก ${data.postings} ประกาศ · ข้อมูลกรุงเทพฯ`}
      table={{ columns: ["ทักษะ", "จำนวนประกาศ"], rows: skills.map((s) => [s.name, `${s.count} / ${data.postings}`]) }}
      note="ข้อมูลประกาศงานรวบรวมจากแหล่งที่ไม่เป็นทางการ อาจไม่ครบถ้วน"
    >
      <div className="h-[280px] w-full" role="img" aria-label={`ทักษะที่พบบ่อยใน ${data.postings} ประกาศ`}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={skills} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 0 }} barCategoryGap={6}>
            <XAxis type="number" domain={[0, data.postings]} hide />
            <YAxis type="category" dataKey="name" width={100} axisLine={false} tickLine={false} tick={{ fill: "var(--color-text)", fontSize: 13 }} />
            <Tooltip content={<TrendTooltip postings={data.postings} />} cursor={{ fill: "var(--color-bg)", opacity: 0.6 }} />
            <Bar dataKey="count" fill={YOU} radius={[0, 4, 4, 0]} isAnimationActive={!reduced} animationDuration={CHART_MOTION.duration} animationEasing={CHART_MOTION.easing}>
              <LabelList dataKey="count" position="right" fill="var(--color-text-muted)" fontSize={12} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}

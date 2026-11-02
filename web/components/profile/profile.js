"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Info, RotateCcw, Sparkles, UserRound, X } from "lucide-react";
import { data } from "@/lib/data";
import { dateTh } from "@/lib/format";
import { useSession } from "@/lib/session";
import { StepIndicator } from "@/components/app/step-indicator";
import { Cite, EvidenceProvider } from "@/components/app/citation";
import { ConfirmDialog } from "@/components/app/confirm-dialog";
import { ChatPanel } from "@/components/chat/chat-panel";
import { WithChat } from "@/components/chat/with-chat";
import { Card, ErrorState, LoadingBlock, LEVELS } from "@/components/intake/ui";
import { SkillChip } from "@/components/profile/skill-chip";

// Profile page /profile (DesignSystem.md section 4, FR-15 – FR-17, FR-29 – FR-33):
// hard skills, soft skills, work style (with disclaimer), experience and blind
// spots. Every claim cites its evidence inline [n]; skill chips can be removed
// (confirm first, no LLM call, works with no quota) and restored. The chat stays
// beside the profile: a side panel at lg, a bottom sheet below lg.

// Ends of each work-style scale (data/questionnaire.json, Design.md section 6).
const TRAIT_ENDS = {
  teamwork: ["ทำงานคนเดียวเป็นหลัก", "ทำงานร่วมกับทีมตลอด"],
  structure: ["คิดวิธีทำเองอย่างยืดหยุ่น", "มีขั้นตอนและมาตรฐานชัดเจน"],
  ambiguity: ["อยากได้โจทย์ชัดก่อนเริ่ม", "สนุกกับการค้นหาคำตอบเอง"],
  pressure: ["จังหวะสม่ำเสมอ วางแผนได้", "งานเร่งด่วน เดดไลน์กระชั้น"],
  innovation: ["ใช้วิธีที่พิสูจน์แล้ว", "ลองวิธีหรือเครื่องมือใหม่ ๆ"],
  leadership: ["รับผิดชอบงานส่วนของตัวเอง", "นำทีมและประสานงาน"],
};

function monthsTh(total) {
  if (!total) return null;
  const y = Math.floor(total / 12);
  const m = total % 12;
  return [y ? `${y} ปี` : "", m ? `${m} เดือน` : ""].filter(Boolean).join(" ");
}

function Disclaimer({ children }) {
  return (
    <p className="mt-4 flex items-start gap-2 text-tiny text-info">
      <Info className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

function ClaimList({ claims, empty }) {
  if (!claims?.length) return <p className="text-small text-text-muted">{empty}</p>;
  return (
    <ul className="space-y-2.5">
      {claims.map((c, i) => (
        <li key={i} className="flex gap-2 text-body text-text">
          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
          <span>
            {c.text_th}
            <Cite ids={c.evidence_ids} />
            {c.edited_by_user && <span className="ml-1 rounded-full bg-primary-subtle px-2 py-0.5 text-tiny font-medium">แก้ไขโดยคุณ</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

function SkillSection({ title, subtitle, skills, empty, onRemove, busy }) {
  return (
    <Card title={title} subtitle={subtitle}>
      {skills.length ? (
        <ul className="flex flex-wrap gap-2" aria-label={title}>
          {skills.map((s) => (
            <SkillChip key={s.skill_id} skill={s} onRemove={onRemove} disabled={busy} />
          ))}
        </ul>
      ) : (
        <p className="text-small text-text-muted">{empty}</p>
      )}
    </Card>
  );
}

function WorkStyle({ workStyle }) {
  return (
    <Card title="ความชอบในการทำงาน" subtitle="จากคำตอบที่คุณเลือกเอง">
      <p className="text-body text-text">
        {workStyle.summary_th}
        <Cite ids={workStyle.summary_evidence_ids} />
      </p>
      {workStyle.traits.length > 0 && (
        <ul className="mt-5 space-y-4">
          {workStyle.traits.map((t) => {
            const [low, high] = TRAIT_ENDS[t.trait] ?? ["", ""];
            return (
              <li key={t.trait}>
                <div className="flex justify-between gap-4 text-tiny text-text-muted">
                  <span>{low}</span>
                  <span className="text-right">{high}</span>
                </div>
                <div className="relative mt-1.5 h-1.5 rounded-full bg-border" aria-hidden="true">
                  <span
                    className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-primary"
                    style={{ left: `${t.value * 100}%` }}
                  />
                </div>
                <p className="mt-1 text-small text-text">
                  {t.label_th}
                  <Cite ids={t.evidence_ids} />
                </p>
              </li>
            );
          })}
        </ul>
      )}
      <Disclaimer>{workStyle.disclaimer_th}</Disclaimer>
    </Card>
  );
}

function RemovedSkills({ skills, onRestore, busy }) {
  if (!skills.length) return null;
  return (
    <Card title="ทักษะที่คุณลบออก" subtitle="ไม่นำมาใช้คำนวณสายงาน · กู้คืนได้ทุกเมื่อ">
      <ul className="divide-y divide-border">
        {skills.map((s) => (
          <li key={s.skill_id} className="flex items-center justify-between gap-3 py-2">
            <span className="text-small text-text">
              {s.name_th}
              <span className="ml-2 text-tiny text-text-muted">ลบเมื่อ {dateTh(s.removed_at)}</span>
            </span>
            <button
              type="button"
              disabled={busy}
              onClick={() => onRestore(s)}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 text-small font-semibold text-accent hover:bg-bg disabled:opacity-50"
            >
              <RotateCcw className="size-4" strokeWidth={2} aria-hidden="true" />
              กู้คืน
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast || toast.kind === "error") return;
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 lg:bottom-6">
      {toast && (
        <div className="pointer-events-auto flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-small text-text shadow-lg">
          <span>{toast.text}</span>
          {toast.action && (
            <button type="button" onClick={toast.action.run} className="min-h-9 rounded-md px-2 font-semibold text-accent hover:bg-bg">
              {toast.action.label}
            </button>
          )}
          <button type="button" onClick={onClose} aria-label="ปิด" className="inline-flex size-9 items-center justify-center rounded-md text-text-muted hover:bg-bg">
            <X className="size-4" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyProfile() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center rounded-xl border border-dashed border-border bg-surface px-6 py-14 text-center">
      <UserRound className="size-10 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
      <p className="mt-4 text-body text-text">ยังไม่มีโปรไฟล์ เริ่มจากอัปโหลด CV หรือทำแบบสอบถาม</p>
      <Link href="/start" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 text-small font-semibold text-on-primary hover:bg-primary-hover">
        ไปที่ขั้นที่ 1
        <ArrowRight className="size-4" strokeWidth={2} aria-hidden="true" />
      </Link>
    </div>
  );
}

export function Profile() {
  const session = useSession();
  const [profile, setProfile] = useState(undefined); // undefined = loading, null = none yet
  const [removed, setRemoved] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [confirming, setConfirming] = useState(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [toast, setToast] = useState(null);

  const load = useCallback(
    () =>
      Promise.all([data.getProfile(), data.removedSkills().catch(() => ({ skills: [] }))]).then(
        ([p, r]) => {
          setLoadError(null);
          setProfile(p.profile);
          setRemoved(r.skills);
        },
        (e) => {
          if (e.code === "PROFILE_NOT_FOUND") setProfile(null);
          else setLoadError(e);
        },
      ),
    [],
  );

  useEffect(() => {
    if (session.status === "ready") load();
  }, [session.status, load]);

  const closeToast = useCallback(() => setToast(null), []);

  async function restore(skill) {
    setBusy(true);
    setActionError(null);
    try {
      const r = await data.restoreSkill(skill.skill_id);
      setProfile(r.profile);
      setRemoved((list) => list.filter((s) => s.skill_id !== skill.skill_id));
      setToast({ text: `กู้คืน ${skill.name_th} แล้ว` });
    } catch (e) {
      setActionError(e);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    const skill = confirming;
    setBusy(true);
    setActionError(null);
    try {
      const r = await data.removeSkill(skill.skill_id);
      setProfile(r.profile);
      setRemoved((list) => [...list.filter((s) => s.skill_id !== skill.skill_id), { skill_id: skill.skill_id, name_th: skill.name_th, removed_at: new Date().toISOString() }]);
      setConfirming(null);
      setToast({ text: `ลบ ${skill.name_th} ออกจากโปรไฟล์แล้ว`, action: { label: "เลิกทำ", run: () => restore(skill) } });
    } catch (e) {
      setConfirming(null);
      setActionError(e);
    } finally {
      setBusy(false);
    }
  }

  const ready = session.status === "ready" && profile;
  const steps = <StepIndicator current={2} unlocked={profile ? 3 : 1} />;
  const wrap = (children) => (
    <>
      {steps}
      <div className="mx-auto w-full max-w-[1120px] px-4 pt-8 pb-28 md:px-6 md:pt-10">{children}</div>
    </>
  );

  if (session.status === "error") return wrap(<ErrorState error={session.error} onRetry={() => window.location.reload()} />);
  if (loadError) return wrap(<ErrorState error={loadError} onRetry={load} />);
  if (session.status !== "ready" || profile === undefined) return wrap(<LoadingBlock lines={8} label="กำลังโหลดโปรไฟล์…" />);
  if (!ready) return wrap(<EmptyProfile />);

  const chat = (
    <ChatPanel
      variant="panel"
      title="แชทกับ AI"
      subtitle="ถามหรือขอแก้โปรไฟล์ได้ · ทุกการแก้ไขต้องยืนยันก่อน · ใช้โควตาครั้งละ 1"
      emptyText="อยากรู้อะไรเพิ่มเกี่ยวกับโปรไฟล์นี้ ถามได้เลย"
      suggestions={["ทักษะไหนของฉันเด่นที่สุด", "เปลี่ยนระดับ SQL เป็น 3"]}
      onProfileChange={(r) => {
        setProfile(r.profile);
        data.removedSkills().then((x) => setRemoved(x.skills), () => {});
      }}
    />
  );

  return wrap(
    <EvidenceProvider evidence={profile.evidence}>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-h1 font-bold text-text">ภาพสะท้อนทักษะของคุณ</h1>
          <p className="mt-1 text-body text-text-muted">
            สร้างเมื่อ {dateTh(profile.generated_at)}
            {profile.updated_at !== profile.generated_at && ` · แก้ไขล่าสุด ${dateTh(profile.updated_at)}`} · ทุกข้อมูลมีหลักฐานกำกับ [n] กดเพื่อดูที่มา
          </p>
        </div>
        <Link href="/roles" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-5 text-small font-semibold text-on-primary shadow-sm hover:bg-primary-hover">
          ดูสายงานที่เหมาะ
          <ArrowRight className="size-4" strokeWidth={2} aria-hidden="true" />
        </Link>
      </header>

      {actionError && (
        <div className="mt-6">
          <ErrorState error={actionError} />
        </div>
      )}

      <div className="mt-6">
        <WithChat chat={chat}>
          <SkillSection
            title="ทักษะด้านเทคนิค"
            subtitle={`${profile.hard_skills.length} ทักษะ · ระดับ ${LEVELS.map((l) => `${l.value} ${l.label}`).join(" · ")}`}
            skills={profile.hard_skills}
            empty="ยังไม่มีทักษะด้านเทคนิค เพิ่มได้จาก CV แบบสอบถาม หรือแชท"
            onRemove={setConfirming}
            busy={busy}
          />
          <SkillSection
            title="ทักษะการทำงานร่วมกับผู้อื่น"
            subtitle="จากคะแนนที่คุณให้ตัวเอง 4–5 และตัวอย่างที่เล่า"
            skills={profile.soft_skills}
            empty="ยังไม่มีหลักฐานทักษะด้านนี้ เล่าตัวอย่างในแชทได้"
            onRemove={setConfirming}
            busy={busy}
          />
          <WorkStyle workStyle={profile.work_style} />
          <Card title="ประสบการณ์และการศึกษา" subtitle={monthsTh(profile.experience.total_months) ? `ประสบการณ์รวมประมาณ ${monthsTh(profile.experience.total_months)}` : undefined}>
            <ClaimList claims={profile.experience.summary} empty="ยังไม่มีข้อมูลประสบการณ์" />
          </Card>
          <Card title="สิ่งที่ยังควรสำรวจ" subtitle="จุดที่ยังไม่มีหลักฐาน หรือที่คุณให้คะแนนตัวเองต่ำ">
            <ClaimList claims={profile.blind_spots} empty="ยังไม่พบจุดที่ควรสำรวจเพิ่ม" />
            <Disclaimer>ไม่ได้หมายความว่าคุณไม่มีทักษะนี้ เล่าเพิ่มในแชทเพื่อให้ภาพชัดขึ้นได้</Disclaimer>
          </Card>
          <RemovedSkills skills={removed} onRestore={restore} busy={busy} />
          <div className="flex justify-end">
            <Link href="/roles" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-5 text-small font-semibold text-on-primary shadow-sm hover:bg-primary-hover">
              <Sparkles className="size-4" strokeWidth={2} aria-hidden="true" />
              ดูสายงานที่เหมาะ
            </Link>
          </div>
        </WithChat>
      </div>

      <ConfirmDialog
        open={Boolean(confirming)}
        title={confirming ? `ลบ ${confirming.name_th} ออกจากโปรไฟล์?` : ""}
        confirmLabel="ลบทักษะ"
        danger
        loading={busy}
        onConfirm={remove}
        onCancel={() => setConfirming(null)}
      >
        ทักษะนี้จะไม่ถูกนำไปคำนวณสายงานที่เหมาะ และจะไม่ถูกเพิ่มกลับเองเมื่อสร้างโปรไฟล์ใหม่ คุณกู้คืนได้ทุกเมื่อจากรายการ “ทักษะที่คุณลบออก” หรือหน้าบัญชี
      </ConfirmDialog>

      <Toast toast={toast} onClose={closeToast} />
    </EvidenceProvider>,
  );
}

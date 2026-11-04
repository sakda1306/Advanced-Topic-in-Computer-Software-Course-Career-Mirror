"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, UserRound } from "lucide-react";
import { logout, useSession } from "@/lib/session";
import { useLandingState } from "@/components/landing/landing-actions";

// Top-bar items (DesignSystem.md section 2). Logged-in pages: the quota indicator
// (FR-25) and the account menu. Public pages (landing, login, register) only peek
// at the session: signed out they show เข้าสู่ระบบ / สมัครใช้งาน (not the one for
// the page you are on), signed in the same "continue" button as the landing hero
// plus the account menu.

const PUBLIC_PATHS = new Set(["/", "/login", "/register"]);

function QuotaIndicator({ quota }) {
  if (!quota) return null;
  const left = Math.max(0, quota.requests_limit - quota.requests_used);
  const low = quota.exhausted || left / quota.requests_limit < 0.2;
  const resetTime = new Date(quota.reset_at).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
  return (
    <span
      className={`hidden items-center gap-1.5 text-small sm:inline-flex ${low ? "font-medium text-warning" : "text-text-muted"}`}
      title={quota.exhausted ? `รีเซ็ตเวลา ${resetTime} น.` : undefined}
    >
      {quota.exhausted ? `ใช้ AI ครบแล้ววันนี้ · รีเซ็ต ${resetTime} น.` : (
        <>
          เหลือ <span className="tabular">{left}/{quota.requests_limit}</span> ครั้งวันนี้
        </>
      )}
    </span>
  );
}

function AccountMenu({ user }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => !wrapRef.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-small text-text hover:bg-surface"
      >
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary-subtle font-semibold text-text">
          {user.display_name.slice(0, 1)}
        </span>
        <span className="hidden max-w-32 truncate md:inline">{user.display_name}</span>
        <ChevronDown className="size-4 text-text-muted" strokeWidth={1.75} aria-hidden="true" />
      </button>
      {open && (
        <div id={menuId} role="menu" aria-label="บัญชี" className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-border bg-bg p-1 shadow-md">
          <p className="truncate px-3 pt-2 pb-1 text-tiny text-text-muted">{user.email}</p>
          <a role="menuitem" href="/account" className="flex min-h-11 items-center gap-3 rounded-md px-3 text-small text-text hover:bg-surface">
            <UserRound className="size-4 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
            บัญชีของฉัน
          </a>
          {user.is_admin && (
            <a role="menuitem" href="/admin" className="flex min-h-11 items-center gap-3 rounded-md px-3 text-small text-text hover:bg-surface">
              <LayoutDashboard className="size-4 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
              แดชบอร์ดผู้ดูแล
            </a>
          )}
          <button
            role="menuitem"
            type="button"
            onClick={logout}
            className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left text-small text-text hover:bg-surface"
          >
            <LogOut className="size-4 text-text-muted" strokeWidth={1.5} aria-hidden="true" />
            ออกจากระบบ
          </button>
        </div>
      )}
    </div>
  );
}

// No display class here: each use adds inline-flex, or hidden sm:inline-flex.
const navPrimary =
  "min-h-11 items-center whitespace-nowrap rounded-full bg-primary px-4 text-small font-semibold text-on-primary transition-colors duration-150 hover:bg-primary-hover";
const navGhost =
  "min-h-11 items-center whitespace-nowrap rounded-full px-3 text-small font-semibold text-text transition-colors duration-150 hover:bg-surface sm:px-4";

function PublicNav({ pathname }) {
  const s = useLandingState();
  if (s.state === "checking") return null;
  if (s.state === "in") {
    return (
      <>
        <Link href={s.hasProfile ? "/profile" : "/start"} className={`${navPrimary} hidden sm:inline-flex`}>
          {s.hasProfile ? "โปรไฟล์ของฉัน" : "เริ่มสร้างโปรไฟล์"}
        </Link>
        <AccountMenu user={s.user} />
      </>
    );
  }
  return (
    <nav aria-label="บัญชี" className="flex items-center gap-1">
      {pathname !== "/login" && (
        // On the landing page the hero has both buttons, so a phone keeps only สมัครใช้งาน here.
        <Link href="/login" className={`${navGhost} ${pathname === "/" ? "hidden sm:inline-flex" : "inline-flex"}`}>
          เข้าสู่ระบบ
        </Link>
      )}
      {pathname !== "/register" && (
        <Link href="/register" className={`${navPrimary} inline-flex`}>
          สมัครใช้งาน
        </Link>
      )}
    </nav>
  );
}

export function AccountSlot() {
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.has(pathname);
  const { status, user, quota } = useSession({ load: !isPublic });
  if (isPublic) return <PublicNav pathname={pathname} />;
  if (status !== "ready" || !user) return null;
  return (
    <>
      <QuotaIndicator quota={quota} />
      <AccountMenu user={user} />
    </>
  );
}

"use client";

import { useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";

// Layout for Profile and Role pages (DesignSystem.md section 4): the page content
// with the chat beside it, a sticky 360 px side panel at lg and a bottom sheet
// below lg, opened from a button at the bottom left (clear of the mock toolbar).
export function WithChat({ chat, children }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const close = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">{children}</div>
        <aside className="sticky top-24 hidden h-[calc(100vh-8rem)] rounded-xl border border-border bg-surface p-5 shadow-sm lg:block">{chat}</aside>
      </div>

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="chat-sheet"
        className="fixed bottom-4 left-4 z-40 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 text-small font-semibold text-on-primary shadow-lg hover:bg-primary-hover lg:hidden"
      >
        <MessageCircle className="size-5" strokeWidth={2} aria-hidden="true" />
        แชทกับ AI
      </button>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="ปิดแชท" tabIndex={-1} className="absolute inset-0 bg-black/40" onClick={close} />
          <div
            id="chat-sheet"
            role="dialog"
            aria-modal="true"
            aria-label="แชทกับ AI"
            onKeyDown={(e) => e.key === "Escape" && close()}
            className="absolute inset-x-0 bottom-0 flex h-[85vh] flex-col rounded-t-xl border-t border-border bg-surface p-5 shadow-xl"
          >
            <div className="mb-2 flex justify-end">
              <button type="button" onClick={close} aria-label="ปิดแชท" className="inline-flex size-11 items-center justify-center rounded-md text-text-muted hover:bg-bg">
                <X className="size-5" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 flex-1">{chat}</div>
          </div>
        </div>
      )}
    </>
  );
}

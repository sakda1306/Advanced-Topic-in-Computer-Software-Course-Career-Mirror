"use client";

import { useEffect, useId, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";

// Hover explanations for the presentation page (/present). Any block wrapped in
// <Explain tip="..."> shows a longer Thai explanation next to the pointer on hover,
// or under the block on keyboard focus or tap. Only the innermost hovered block
// shows its card, so a tile and the items inside it can each have their own.
// One <ExplainLayer /> per page draws the card into document.body, so overflow
// and stacking inside the page never clip it. Esc closes it.

const TIP_ID = "present-explain-tip";

let state = { id: null, tip: null, title: null, x: 0, top: 0, bottom: 0 };
const listeners = new Set();

function setState(next) {
  state = next;
  listeners.forEach((l) => l());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function hide(id) {
  if (state.id === id) setState({ ...state, id: null });
}

/** Wraps a block so hovering or focusing it shows `tip` (a string or a list of paragraphs). */
export function Explain({ as: Tag = "div", tip, title, className = "", children, ...rest }) {
  const id = useId();
  const active = useSyncExternalStore(
    subscribe,
    () => state.id === id,
    () => false,
  );

  if (!tip) return <Tag className={className} {...rest}>{children}</Tag>;

  const showAt = (x, top, bottom) => setState({ id, tip, title, x, top, bottom });

  return (
    <Tag
      {...rest}
      tabIndex={0}
      data-explain-active={active || undefined}
      aria-describedby={active ? TIP_ID : undefined}
      className={`cursor-help outline-none transition-shadow duration-150 data-[explain-active]:ring-2 data-[explain-active]:ring-accent/60 focus-visible:ring-2 focus-visible:ring-accent ${className}`}
      onMouseOver={(e) => {
        e.stopPropagation();
        if (state.id !== id) showAt(e.clientX, e.clientY, e.clientY);
      }}
      onMouseMove={(e) => {
        e.stopPropagation();
        showAt(e.clientX, e.clientY, e.clientY);
      }}
      onMouseLeave={() => hide(id)}
      onFocus={(e) => {
        e.stopPropagation();
        const r = e.currentTarget.getBoundingClientRect();
        showAt(r.left + Math.min(r.width / 2, 160), r.top, r.bottom);
      }}
      onBlur={() => hide(id)}
    >
      {children}
    </Tag>
  );
}

const GAP = 16;
const MARGIN = 12;

/** Draws the card of the block that is hovered or focused. Mount once on the page. */
export function ExplainLayer() {
  const s = useSyncExternalStore(
    subscribe,
    () => state,
    () => null,
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && state.id) setState({ ...state, id: null });
    };
    // The card is placed in screen coordinates, so it would drift from its block.
    const onScroll = () => {
      if (state.id) setState({ ...state, id: null });
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (!s?.id) return null;

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const width = Math.min(380, vw - MARGIN * 2);
  let left = s.x + GAP;
  if (left + width > vw - MARGIN) left = s.x - GAP - width;
  left = Math.max(MARGIN, Math.min(left, vw - MARGIN - width));
  // Below the pointer in the upper half of the screen, above it in the lower half.
  const below = s.bottom < vh * 0.5;
  const pos = below ? { top: s.bottom + GAP } : { bottom: vh - s.top + GAP };
  const paragraphs = Array.isArray(s.tip) ? s.tip : [s.tip];

  return createPortal(
    <div
      id={TIP_ID}
      role="tooltip"
      className="pointer-events-none fixed z-[60] max-h-[70vh] overflow-hidden rounded-xl border border-border bg-surface p-4 text-left shadow-xl"
      style={{ left, width, ...pos }}
    >
      {s.title && (
        <p className="mb-1.5 flex items-center gap-1.5 text-small font-semibold text-text">
          <Info className="size-4 shrink-0 text-accent" strokeWidth={2} aria-hidden="true" />
          {s.title}
        </p>
      )}
      <div className="space-y-2">
        {paragraphs.map((p) => (
          <p key={p} className="text-tiny leading-relaxed text-text-muted">
            {p}
          </p>
        ))}
      </div>
    </div>,
    document.body,
  );
}

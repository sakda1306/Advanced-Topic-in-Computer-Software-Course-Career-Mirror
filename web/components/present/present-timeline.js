"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "lucide-react";
import { Stepper, StepperIndicator, StepperItem, StepperNav, StepperSeparator, StepperTitle, StepperTrigger } from "@/components/ui/stepper";
import { useReducedMotion } from "@/lib/use-motion";
import { CHAPTERS } from "@/components/present/chapters";

// Fixed vertical timeline on the left of /present. The active step follows the
// chapter section crossing the middle of the screen; clicking a step scrolls to it.
// It fades out over the hero and closing bands, where no chapter is in view.
// Wide screens only: numbers from xl (1280px), numbers and titles from 2xl (1536px),
// where the margin beside the 1120px content is wide enough.

export function PresentTimeline() {
  const [active, setActive] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const sections = CHAPTERS.map((_, i) => document.getElementById(`s${i + 1}`)).filter(Boolean);
    const inView = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const n = Number(e.target.id.slice(1));
          if (e.isIntersecting) inView.add(n);
          else inView.delete(n);
        }
        setActive(inView.size ? Math.min(...inView) : 0);
      },
      // A thin band across the middle of the viewport.
      { rootMargin: "-45% 0px -54% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const goTo = (step) => {
    document.getElementById(`s${step}`)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  };

  const visible = active > 0;

  return (
    <aside
      aria-label="สารบัญการนำเสนอ"
      inert={!visible}
      className={`fixed top-1/2 left-3 z-30 hidden -translate-y-1/2 rounded-2xl border border-border bg-bg/85 p-3 shadow-sm backdrop-blur transition-opacity duration-300 xl:block 2xl:left-4 2xl:max-w-48 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <Stepper value={active || 1} onValueChange={goTo} orientation="vertical" indicators={{ completed: <CheckIcon className="size-3.5" strokeWidth={2.5} aria-hidden="true" /> }}>
        <StepperNav>
          {CHAPTERS.map((title, i) => (
            <StepperItem key={title} step={i + 1} className="relative items-start">
              <StepperTrigger className="items-start gap-2.5 rounded-md pb-6 text-left group-last/step:pb-0" aria-label={`${i + 1}. ${title}`}>
                <StepperIndicator>{i + 1}</StepperIndicator>
                <StepperTitle className="mt-0.5 hidden text-text-muted transition-colors duration-200 hover:text-text data-[state=active]:font-semibold data-[state=active]:text-text 2xl:block">
                  {title}
                </StepperTitle>
              </StepperTrigger>
              {i < CHAPTERS.length - 1 && (
                <StepperSeparator className="absolute top-7 left-3 m-0 -translate-x-1/2 group-data-[orientation=vertical]/stepper-nav:h-[calc(100%-2rem)] group-data-[state=completed]/step:bg-success" />
              )}
            </StepperItem>
          ))}
        </StepperNav>
      </Stepper>
    </aside>
  );
}

"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "../ui/Container";

interface ScheduleItem {
  time: string;
  title: string;
  type: string;
}

const SCHEDULE_ITEMS: ScheduleItem[] = [
  { time: "9:00 AM", title: "Appointment", type: "Calendar" },
  { time: "Today", title: "Buy groceries", type: "Task" },
  { time: "6:00 PM", title: "Pay a bill", type: "Reminder" },
  { time: "Evening", title: "Call home", type: "Calendar" },
];

export function YourDaySection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="your-day"
      ref={sectionRef}
      className="relative isolate min-h-[100svh] flex items-center py-12 sm:py-16 lg:py-24 overflow-hidden border-b border-white/[0.06] bg-transparent"
      aria-label="Your Day Coordinated"
    >
      {/* Ambient glow positioned behind Robin on the left */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-[10%] -translate-y-1/2 w-[300px] sm:w-[460px] md:w-[540px] h-[300px] sm:h-[460px] md:h-[540px] rounded-full pointer-events-none -z-10"
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12)_0%,rgba(99,102,241,0.03)_50%,transparent_70%)] blur-3xl" />
      </div>

      <Container size="wide" className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Robin Persistent Canvas Spacer (5 cols) */}
          <div
            className="lg:col-span-5 order-2 lg:order-1 w-full aspect-square max-w-[280px] sm:max-w-[360px] lg:max-w-[440px] mx-auto pointer-events-none flex items-center justify-center"
            aria-hidden="true"
          />

          {/* Right Column: Headline & Unified Day Schedule (7 cols) */}
          <motion.div
            initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.25 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-start text-left z-20"
          >
            {/* Minimal Scene Tag */}
            <div className="mb-2 sm:mb-3">
              <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-brand-violet font-medium">
                Your day
              </span>
            </div>

            {/* Major Headline (height-aware) */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[clamp(2.75rem,min(5vw,6.5vh),4.75rem)] font-semibold tracking-tighter text-white leading-[1.04]">
              YOUR DAY.
              <br />
              COORDINATED.
            </h2>

            {/* Supporting Statement (height-aware) */}
            <p className="mt-3 sm:mt-5 text-[clamp(1.125rem,min(1.8vw,2.2vh),1.5rem)] text-white/70 font-normal leading-relaxed max-w-xl">
              Calendar, tasks, and reminders unified in one conversational relationship.
            </p>

            {/* Unified Schedule Card */}
            <div className="mt-6 sm:mt-10 w-full max-w-xl rounded-2xl border border-white/[0.1] bg-neutral-950/80 lg:bg-white/[0.03] backdrop-blur-md p-4 sm:p-7 shadow-[0_8px_32px_rgba(0,0,0,0.36)]">
              <div className="divide-y divide-white/[0.08]">
                {SCHEDULE_ITEMS.map((item) => (
                  <div
                    key={item.title}
                    className="py-3 sm:py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2.5 sm:gap-4"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-5 min-w-0">
                      <span className="font-mono text-[11px] sm:text-sm uppercase tracking-wider text-brand-violet/90 w-16 sm:w-24 shrink-0 font-medium">
                        {item.time}
                      </span>
                      <span className="text-xs sm:text-base md:text-[clamp(1rem,min(1.5vw,2vh),1.375rem)] font-medium text-white leading-tight">
                        {item.title}
                      </span>
                    </div>
                    <span className="font-mono text-[9px] sm:text-xs uppercase tracking-wider text-white/40 px-1.5 sm:px-2 py-0.5 rounded border border-white/[0.08] shrink-0">
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

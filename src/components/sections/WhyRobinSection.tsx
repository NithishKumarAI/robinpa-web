"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "../ui/Container";
import { Briefcase, CalendarCheck, ShieldCheck } from "lucide-react";

export function WhyRobinSection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const pillars = [
    {
      icon: Briefcase,
      title: "Everyday Administrative Relief",
      description:
        "Senior executives have personal assistants to filter messages, draft correspondence, and keep commitments on track. Robin brings that structured, day-to-day administrative support to everyday Windows users.",
    },
    {
      icon: CalendarCheck,
      title: "Context Before Every Moment",
      description:
        "Rather than forcing you to dig through scattered inboxes and calendar invites, Robin surfaces who you are meeting, what was previously discussed, and what tasks need attention before you begin.",
    },
    {
      icon: ShieldCheck,
      title: "Assistive, Not Autonomous",
      description:
        "Robin does not replace human judgment. It reads context with your permission, prepares actions clearly, and always waits for your explicit review and approval before sending or saving anything.",
    },
  ];

  return (
    <section
      id="why-robin"
      ref={sectionRef}
      className="relative isolate py-20 sm:py-28 overflow-hidden border-b border-white/[0.06] bg-background/85 backdrop-blur-sm scroll-mt-16"
      aria-label="Why Robin"
    >
      {/* Subtle ambient lighting */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.08)_0%,transparent_70%)] blur-3xl pointer-events-none -z-10"
      />

      <Container size="wide">
        <motion.div
          initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center space-y-4"
        >
          <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-brand-violet font-medium">
            Why Robin
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter text-white leading-tight">
            Personal assistants shouldn&apos;t be limited to executives.
          </h2>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed pt-2">
            The idea behind Robin is simple: senior leaders rely on personal assistants to organize communication,
            schedules, follow-ups, and administrative tasks. Robin is designed to bring that level of calm,
            reliable coordination to anyone on Windows.
          </p>
        </motion.div>

        {/* 3 Pillar Cards */}
        <div className="mt-14 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: prefersReduced ? 0 : idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] p-6 sm:p-7 flex flex-col items-start transition-colors duration-200"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center text-brand-violet mb-5">
                  <IconComponent className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight mb-2.5">
                  {pillar.title}
                </h3>
                <p className="text-sm text-white/65 leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

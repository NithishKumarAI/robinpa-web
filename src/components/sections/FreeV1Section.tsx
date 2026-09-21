"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "../ui/Container";
import { Check, Sparkles } from "lucide-react";

export function FreeV1Section() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const included = [
    "Full conversational PA interface on Windows",
    "Local AI engine with Ollama support",
    "Cloud AI engine with personal Gemini API key",
    "Google Workspace tools: Gmail, Calendar, Tasks, Contacts",
    "On-device CPU voice transcription via Moonshine",
    "Scoped local workspace document search",
    "Explicit action review and approval safety architecture",
  ];

  return (
    <section
      id="free-v1"
      ref={sectionRef}
      className="relative isolate py-20 sm:py-28 overflow-hidden border-b border-white/[0.06] bg-background/85 backdrop-blur-sm scroll-mt-16"
      aria-label="Robin V1 Release"
    >
      <Container size="narrow">
        <motion.div
          initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-3xl border border-white/[0.1] bg-white/[0.02] p-8 sm:p-12 text-center relative overflow-hidden"
        >
          {/* Subtle decorative glow */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-brand-violet/20 blur-3xl pointer-events-none -z-10"
          />

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium uppercase tracking-wider bg-brand-violet/10 text-brand-violet border border-brand-violet/25 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            V1 Availability
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter text-white leading-tight">
            Robin V1 starts free.
          </h2>

          <p className="mt-4 text-base sm:text-lg text-white/80 max-w-xl mx-auto leading-relaxed">
            &ldquo;Robin V1 starts free. Optional paid services may be introduced in the future, while the goal is to keep the core personal-assistant experience broadly accessible.&rdquo;
          </p>

          <div className="mt-8 pt-8 border-t border-white/[0.08] max-w-lg mx-auto text-left">
            <h3 className="text-xs font-mono uppercase tracking-wider text-white/50 mb-4 text-center sm:text-left">
              What&apos;s included in Robin V1
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-white/80">
              {included.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-brand-violet mt-0.5 shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

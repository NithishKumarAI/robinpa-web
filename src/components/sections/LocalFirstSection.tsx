"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "../ui/Container";
import { Cpu, Cloud } from "lucide-react";

export function LocalFirstSection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="ai-choice"
      ref={sectionRef}
      className="relative isolate min-h-[100svh] flex items-center py-12 sm:py-16 lg:py-24 overflow-hidden border-b border-white/[0.06] bg-transparent scroll-mt-16"
      aria-label="Your AI, Your Choice"
    >
      {/* Anchor alias for backwards compatibility */}
      <span id="local-first" className="absolute top-0" aria-hidden="true" />

      {/* Ambient glow positioned behind Robin on the right */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[300px] sm:w-[460px] md:w-[540px] h-[300px] sm:h-[460px] md:h-[540px] rounded-full pointer-events-none -z-10"
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12)_0%,rgba(99,102,241,0.03)_50%,transparent_70%)] blur-3xl" />
      </div>

      <Container size="wide" className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Headline & Local/Cloud Choices (7 cols) */}
          <motion.div
            initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.25 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left z-20"
          >
            {/* Minimal Scene Tag */}
            <div className="mb-2 sm:mb-3">
              <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-brand-violet font-medium">
                Your AI, Your Choice
              </span>
            </div>

            {/* Major Headline (height-aware) */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[clamp(2.75rem,min(5vw,6.5vh),4.75rem)] font-semibold tracking-tighter text-white leading-[1.04]">
              Your PA.
              <br />
              Your choice of brain.
            </h2>

            {/* Supporting Statement (height-aware) */}
            <p className="mt-3 sm:mt-5 text-[clamp(1.125rem,min(1.8vw,2.2vh),1.5rem)] text-white/70 font-normal leading-relaxed max-w-xl">
              Run locally on your machine or connect cloud AI. You configure what powers your assistant.
            </p>

            {/* Side-by-side or Stacked Local vs Cloud Cards */}
            <div className="mt-6 sm:mt-10 w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Local Card */}
              <div className="rounded-2xl border border-white/[0.1] bg-neutral-950/80 lg:bg-white/[0.03] backdrop-blur-md p-5 sm:p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-brand-violet/15 border border-brand-violet/25 flex items-center justify-center text-brand-violet">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-mono text-sm uppercase tracking-wider text-white font-medium">
                  LOCAL
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Run Robin with a supported model on your PC via Ollama.
                </p>
              </div>

              {/* Cloud Card */}
              <div className="rounded-2xl border border-white/[0.1] bg-neutral-950/80 lg:bg-white/[0.03] backdrop-blur-md p-5 sm:p-6 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                  <Cloud className="w-5 h-5" />
                </div>
                <h3 className="font-mono text-sm uppercase tracking-wider text-white font-medium">
                  CLOUD
                </h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  Connect Gemini using your own API key.
                </p>
              </div>
            </div>

            {/* Factual Clarification Note */}
            <p className="mt-5 text-xs sm:text-sm text-white/45 leading-relaxed max-w-xl">
              Note: Google integrations (Gmail, Calendar, Tasks, Contacts) connect to their respective online services under your direct authorization. Robin never uses your Google Workspace data to train generalized AI models.
            </p>
          </motion.div>

          {/* Right Column: Robin Persistent Canvas Spacer (5 cols) */}
          <div
            className="lg:col-span-5 w-full aspect-square max-w-[280px] sm:max-w-[360px] lg:max-w-[440px] mx-auto pointer-events-none flex items-center justify-center"
            aria-hidden="true"
          />
        </div>
      </Container>
    </section>
  );
}

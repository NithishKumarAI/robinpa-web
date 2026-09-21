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

            {/* Side-by-side Local vs Cloud Comparison Cards */}
            <div className="mt-6 sm:mt-8 w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Local AI Card */}
              <div className="rounded-2xl border border-white/[0.1] bg-neutral-950/85 lg:bg-white/[0.03] backdrop-blur-md p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-brand-violet/15 border border-brand-violet/25 flex items-center justify-center text-brand-violet">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-brand-violet/30 bg-brand-violet/10 text-brand-violet uppercase tracking-wider">
                      On-Device
                    </span>
                  </div>
                  <h3 className="font-mono text-sm uppercase tracking-wider text-white font-medium mt-3">
                    Local AI (Ollama)
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed mt-1">
                    Detects hardware, recommends compatible models, and downloads in-app.
                  </p>
                  <ul className="mt-3 space-y-1.5 text-[11px] text-white/60 border-t border-white/[0.06] pt-3">
                    <li>&bull; Maximum privacy: prompts stay on your PC</li>
                    <li>&bull; In-app hardware detection &amp; model setup</li>
                    <li>&bull; Required for Workspace-assisted AI tasks</li>
                    <li>&bull; AI reasoning &amp; memory run offline</li>
                  </ul>
                </div>
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-white/40">Powered by Ollama runtime</span>
                </div>
              </div>

              {/* Cloud AI Card */}
              <div className="rounded-2xl border border-white/[0.1] bg-neutral-950/85 lg:bg-white/[0.03] backdrop-blur-md p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400">
                      <Cloud className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 uppercase tracking-wider">
                      Cloud Option
                    </span>
                  </div>
                  <h3 className="font-mono text-sm uppercase tracking-wider text-white font-medium mt-3">
                    Google Gemini
                  </h3>
                  <p className="text-xs text-white/70 leading-relaxed mt-1">
                    Connect Gemini for general conversation using your personal API key.
                  </p>
                  <ul className="mt-3 space-y-1.5 text-[11px] text-white/60 border-t border-white/[0.06] pt-3">
                    <li>&bull; Fast cloud reasoning on lower-spec PCs</li>
                    <li>&bull; Workspace data blocked (fail-closed)</li>
                    <li>&bull; Personal key in Windows Credential Manager</li>
                    <li>&bull; Terms &amp; quotas set by Google</li>
                  </ul>
                </div>
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-white/40">Requires Google Gemini API key</span>
                </div>
              </div>
            </div>

            {/* Factual Clarification Note */}
            <p className="mt-4 text-xs text-white/45 leading-relaxed max-w-xl">
              Note: Connected Google accounts (Gmail, Calendar, Tasks, Contacts) communicate directly with Google&apos;s encrypted APIs under your direct authorization. Workspace-derived data is never sent to Gemini. Robin never uses your Google Workspace data to train generalized AI models.
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

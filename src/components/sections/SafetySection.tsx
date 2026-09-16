"use client";

import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "../ui/Container";
import { Check, X } from "lucide-react";

export function SafetySection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [approved, setApproved] = useState(false);

  return (
    <section
      id="control"
      ref={sectionRef}
      className="relative isolate min-h-[100svh] flex items-center py-12 sm:py-16 lg:py-24 overflow-hidden border-b border-white/[0.06] bg-transparent scroll-mt-16"
      aria-label="You Stay in Control"
    >
      {/* Anchor alias for backwards compatibility */}
      <span id="safety" className="absolute top-0" aria-hidden="true" />

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

          {/* Right Column: Headline & Large Review Card (7 cols) */}
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
                Control
              </span>
            </div>

            {/* Major Headline (height-aware) */}
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[clamp(2.75rem,min(5vw,6.5vh),4.75rem)] font-semibold tracking-tighter text-white leading-[1.04]">
              Robin prepares.
              <br />
              You decide.
            </h2>

            {/* Grounded Supporting Statement (height-aware) */}
            <div className="mt-3 sm:mt-5 text-[clamp(1.125rem,min(1.8vw,2.2vh),1.5rem)] text-white/70 font-normal leading-relaxed max-w-xl">
              <p>Robin prepares the action.</p>
              <p className="text-white/90">You approve before it happens.</p>
            </div>

            {/* Large Review Card */}
            <div className="mt-6 sm:mt-10 w-full max-w-xl rounded-2xl border border-white/[0.12] bg-neutral-950/80 lg:bg-white/[0.03] backdrop-blur-md p-5 sm:p-7 space-y-4 sm:space-y-5 shadow-[0_8px_32px_rgba(0,0,0,0.36)]">
              {/* Header Status */}
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/[0.08]">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider bg-brand-violet/15 text-brand-violet border border-brand-violet/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-violet animate-pulse" />
                  Ready to send
                </span>
                <span className="font-mono text-xs text-white/40">Requires review</span>
              </div>

              {/* Recipient & Subject */}
              <div className="space-y-2.5 font-mono text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-white/40 w-16 uppercase text-xs">To:</span>
                  <span className="text-white font-medium">Recipient</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white/40 w-16 uppercase text-xs">Subject:</span>
                  <span className="text-white font-medium">Re: Update</span>
                </div>
              </div>

              {/* Message Body */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-white/90 text-sm sm:text-base leading-relaxed font-sans">
                &ldquo;Thanks for the update. Please let me know when it&apos;s ready.&rdquo;
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setApproved(false)}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg border border-white/[0.1] text-xs sm:text-sm text-white/60 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setApproved(true)}
                  className={`inline-flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    approved
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-brand-violet text-white hover:bg-brand-violet/90 shadow-[0_0_16px_rgba(139,92,246,0.3)]"
                  }`}
                >
                  {approved ? (
                    <>
                      <Check className="w-4 h-4" />
                      Approved
                    </>
                  ) : (
                    "Approve & Send"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

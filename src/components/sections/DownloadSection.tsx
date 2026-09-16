"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "../ui/Container";
import { DownloadButton } from "../ui/DownloadButton";
import { ArrowUp } from "lucide-react";
import { ROBIN_VERSION, ROBIN_PLATFORM } from "@/config/download";

export function DownloadSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section
      id="download"
      ref={sectionRef}
      className="relative isolate min-h-[100svh] pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 flex flex-col items-center justify-between overflow-hidden border-b-0 bg-transparent scroll-mt-16"
      aria-label="Download Robin for Windows"
    >
      {/* Central ambient glow behind the final enlarged Robin */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] md:w-[620px] h-[300px] sm:h-[500px] md:h-[620px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.14)_0%,rgba(99,102,241,0.04)_50%,transparent_70%)] blur-3xl pointer-events-none -z-10"
      />

      <Container size="narrow" className="w-full flex flex-col items-center text-center z-20 shrink-0">
        {/* Culmination statement */}
        <motion.div
          initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.25em] text-brand-violet font-medium">
            Closing
          </span>
          <h2 className="mt-2 sm:mt-3 text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tighter text-white/90">
            Everyone deserves a PA.
          </h2>
        </motion.div>
      </Container>

      {/* Robin Persistent Canvas Center Spacer */}
      <div
        className="my-auto w-full aspect-square max-w-[260px] sm:max-w-[360px] md:max-w-[440px] max-h-[30vh] mx-auto pointer-events-none flex items-center justify-center shrink-0"
        aria-hidden="true"
      />

      <Container size="narrow" className="w-full flex flex-col items-center text-center z-20 shrink-0">
        {/* Grand Final Call to Action */}
        <motion.div
          initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <h3 className="text-4xl sm:text-6xl md:text-7xl lg:text-[clamp(3rem,min(6.5vw,8vh),5.5rem)] font-semibold tracking-tighter text-white leading-[1.02]">
            Meet Robin.
          </h3>
          <p className="mt-2 sm:mt-3 text-sm sm:text-lg text-white/60 font-normal">
            Your personal assistant for everyday life.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col items-center gap-2.5">
            <DownloadButton size="lg" placement="closing" />
            <span className="font-mono text-xs text-white/40 tracking-wider">
              {ROBIN_PLATFORM} &bull; v{ROBIN_VERSION}
            </span>
          </div>
        </motion.div>

        {/* Back to top anchor */}
        <div className="mt-8 sm:mt-10 pt-4">
          <button
            type="button"
            onClick={handleScrollToTop}
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
            Back to Top
          </button>
        </div>
      </Container>
    </section>
  );
}

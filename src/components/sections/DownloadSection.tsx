"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "../ui/Container";
import { RobinOrb } from "../visual/RobinOrb";
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
      className="relative isolate min-h-[100svh] py-24 sm:py-32 flex flex-col items-center justify-center overflow-hidden border-b-0 bg-background"
      aria-label="Download Robin for Windows"
    >
      {/* Restrained central ambient glow behind the final orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[520px] h-[340px] sm:h-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12)_0%,rgba(99,102,241,0.04)_50%,transparent_70%)] blur-3xl pointer-events-none -z-10" />

      <Container size="narrow" className="flex flex-col items-center text-center">
        {/* Subtitle tag */}
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-brand-violet">
            Everyone deserves a PA.
          </span>
        </motion.div>

        {/* Emotionally resonant headline */}
        <motion.h2
          initial={{ opacity: 0, y: prefersReduced ? 0 : 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tighter text-white leading-[1.06] max-w-2xl"
        >
          Meet Robin.
        </motion.h2>

        {/* Final Robin Orb Anchor */}
        <motion.div
          initial={{ opacity: 0, scale: prefersReduced ? 1 : 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="my-8 sm:my-10 w-full max-w-[260px] sm:max-w-[320px] aspect-square flex items-center justify-center mx-auto"
        >
          <RobinOrb className="w-full h-full" />
        </motion.div>

        {/* Actions: Primary Download + Secondary Back to Top */}
        <motion.div
          initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xs sm:max-w-none"
        >
          {/* Primary CTA via centralized configuration */}
          <DownloadButton size="lg" className="w-full sm:w-auto" placement="download-section" />

          {/* Secondary CTA: Back to Top */}
          <a
            href="#"
            onClick={handleScrollToTop}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 text-xs sm:text-sm font-medium text-foreground-muted hover:text-white bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.16] rounded transition-all duration-150"
            aria-label="Back to top of page"
          >
            <ArrowUp size={13} aria-hidden="true" />
            <span>Back to top</span>
          </a>
        </motion.div>

        {/* Small supporting metadata line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-2 text-[11px] font-mono text-foreground-subtle"
        >
          <span>Robin {ROBIN_VERSION}</span>
          <span>&bull;</span>
          <span>{ROBIN_PLATFORM}</span>
        </motion.div>
      </Container>
    </section>
  );
}

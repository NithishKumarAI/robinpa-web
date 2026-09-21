"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "../ui/Container";
import { HardDrive, Lock, ShieldCheck, UserCheck, ArrowRight } from "lucide-react";

export function HomepagePrivacySection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const points = [
    {
      icon: HardDrive,
      title: "Local-First by Design",
      description:
        "Robin stores session history, local SQLite databases (robin.db), and vector memory on your hard drive under ~/.robin. Your notes and preferences remain on your machine.",
    },
    {
      icon: Lock,
      title: "Transparent AI Processing",
      description:
        "Choose Local AI for local model processing where prompts remain on your PC, or connect Gemini if you prefer cloud AI. Cloud models only receive requests when you explicitly choose them.",
    },
    {
      icon: UserCheck,
      title: "Explicit Google Authorization",
      description:
        "Google Workspace data is accessed only after you sign in and authorize permissions. Robin never sells user data and never uses your Google data to train generalized AI models.",
    },
    {
      icon: ShieldCheck,
      title: "Review Before Action",
      description:
        "Robin prepares sensitive mutating actions—such as drafting an email or updating an event—in a pending state. Robin requires your explicit approval before execution.",
    },
  ];

  return (
    <section
      id="privacy"
      ref={sectionRef}
      className="relative isolate py-20 sm:py-28 overflow-hidden border-b border-white/[0.06] bg-background/85 backdrop-blur-sm scroll-mt-16"
      aria-label="Privacy Principles"
    >
      <Container size="wide">
        {/* Section Header */}
        <motion.div
          initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center space-y-4"
        >
          <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-brand-violet font-medium">
            Privacy Principles
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter text-white leading-tight">
            Privacy you can understand. No exaggerated claims.
          </h2>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed pt-1">
            We don&apos;t make unrealistic claims like &ldquo;100% unhackable&rdquo; or &ldquo;zero data leaves your computer&rdquo;.
            Instead, we give you transparent architecture: choose local AI for on-device processing, or connect Gemini for cloud AI.
          </p>
        </motion.div>

        {/* 4 Core Privacy Cards */}
        <div className="mt-14 sm:mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {points.map((pt, idx) => {
            const IconComponent = pt.icon;
            return (
              <motion.div
                key={pt.title}
                initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: prefersReduced ? 0 : idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center text-brand-violet mb-4">
                    <IconComponent className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-white tracking-tight mb-2">
                    {pt.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/65 leading-relaxed">
                    {pt.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Link to Full Legal Policy */}
        <div className="mt-12 text-center">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/[0.12] bg-white/[0.03] hover:bg-white/[0.06] text-xs font-mono uppercase tracking-wider text-white transition-colors"
          >
            <span>Read Complete Privacy Policy</span>
            <ArrowRight className="w-3.5 h-3.5 text-brand-violet" />
          </Link>
          <p className="text-[11px] text-white/40 mt-3">
            Includes full Google OAuth scopes, Limited Use disclosures, token storage, and data retention details.
          </p>
        </div>
      </Container>
    </section>
  );
}

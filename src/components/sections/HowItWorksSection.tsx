"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "../ui/Container";
import { Download, Cpu, KeyRound, MessageSquare, CheckCircle2 } from "lucide-react";

export function HowItWorksSection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const steps = [
    {
      num: "01",
      icon: Download,
      title: "Install Robin",
      description: "Download the Windows installer and launch Robin on your desktop.",
    },
    {
      num: "02",
      icon: Cpu,
      title: "Choose Local AI or Gemini",
      description: "Select on-device Ollama for local privacy, or configure Gemini with your API key.",
    },
    {
      num: "03",
      icon: KeyRound,
      title: "Connect Your Services",
      description: "Securely authorize Google Workspace (Gmail, Calendar, Tasks, Contacts) via OAuth.",
    },
    {
      num: "04",
      icon: MessageSquare,
      title: "Talk Naturally",
      description: "Type or speak to Robin just like a human assistant. No complex prompt syntax.",
    },
    {
      num: "05",
      icon: CheckCircle2,
      title: "Review & Approve",
      description: "Inspect drafted replies and calendar changes before Robin executes sensitive actions.",
    },
  ];

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative isolate py-20 sm:py-28 overflow-hidden border-b border-white/[0.06] bg-background/85 backdrop-blur-sm scroll-mt-16"
      aria-label="How Robin Works"
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
            Setup &amp; Flow
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter text-white leading-tight">
            How Robin works.
          </h2>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed pt-1">
            Five clear steps to having a personal assistant on your Windows PC.
          </p>
        </motion.div>

        {/* 5-Step Horizontal Grid */}
        <div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: prefersReduced ? 0 : idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 flex flex-col justify-between relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-semibold text-brand-violet">
                      {step.num}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/70">
                      <IconComponent className="w-4 h-4" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-white tracking-tight mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

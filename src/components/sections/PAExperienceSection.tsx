"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "../ui/Container";
import { Sun, Users2, CheckCircle2, Clock } from "lucide-react";

export function PAExperienceSection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const steps = [
    {
      phase: "01 • Morning Briefing",
      time: "08:30 AM",
      icon: Sun,
      title: "Today's Briefing",
      status: "Being prepared for V1",
      statusColor: "text-amber-400/90 border-amber-400/30 bg-amber-400/10",
      description: "Start your day with a clear view of commitments instead of opening ten different tabs.",
      items: [
        "Today's appointments and calendar conflicts",
        "Top priority tasks and impending deadlines",
        "High-priority messages needing response",
        "Pending action items from yesterday",
      ],
      sampleDialog: {
        speaker: "Robin",
        text: "“Good morning. You have 3 events today starting at 10:00 AM with Alex. 2 urgent tasks are due before noon.”",
      },
    },
    {
      phase: "02 • Meeting Preparation",
      time: "15 min prior",
      icon: Users2,
      title: "Before You Meet",
      status: "Active V1 Capability",
      statusColor: "text-brand-violet border-brand-violet/30 bg-brand-violet/10",
      description: "Walk into conversations with immediate context and relevant history at your fingertips.",
      items: [
        "Who the attendees are and their contact details",
        "Relevant previous emails and shared threads",
        "Agenda topics and open discussion points",
        "Related tasks pending with the attendee",
      ],
      sampleDialog: {
        speaker: "Robin",
        text: "“In 15 minutes you meet Sarah regarding the Q3 review. Last week she requested the updated document.”",
      },
    },
    {
      phase: "03 • Post-Meeting Follow-up",
      time: "Afterward",
      icon: CheckCircle2,
      title: "Action & Follow-up",
      status: "Coming in V1",
      statusColor: "text-indigo-400/90 border-indigo-400/30 bg-indigo-400/10",
      description: "Turn conversations into concrete next steps without manual administrative friction.",
      items: [
        "Capture action items directly into Google Tasks",
        "Draft follow-up emails for your explicit review",
        "Schedule check-ins and next milestones",
        "Update local contact notes and preferences",
      ],
      sampleDialog: {
        speaker: "Robin",
        text: "“I drafted a follow-up email summarizing the next steps. Would you like to review and approve sending it?”",
      },
    },
  ];

  return (
    <section
      id="pa-experience"
      ref={sectionRef}
      className="relative isolate py-20 sm:py-28 overflow-hidden border-b border-white/[0.06] bg-background/85 backdrop-blur-sm scroll-mt-16"
      aria-label="The PA Experience"
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
            The PA Experience
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter text-white leading-tight">
            How a personal assistant behaves across your day.
          </h2>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed pt-1">
            Robin is designed as an assistant, not just a passive Q&amp;A bot.
            Here is how Robin coordinates your daily rhythm.
          </p>
        </motion.div>

        {/* 3 Step Flow */}
        <div className="mt-14 sm:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const IconComponent = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: prefersReduced ? 0 : idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="font-mono text-xs uppercase tracking-wider text-white/50">
                      {step.phase}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${step.statusColor}`}
                    >
                      <Clock className="w-2.5 h-2.5" />
                      {step.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center text-brand-violet shrink-0">
                      <IconComponent className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-semibold text-white tracking-tight">
                      {step.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-white/60 mb-5 leading-relaxed">
                    {step.description}
                  </p>

                  <ul className="space-y-2 border-t border-white/[0.06] pt-4 text-xs text-white/75 mb-6">
                    {step.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-brand-violet mt-1.5 shrink-0" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sample Assistant Interaction */}
                <div className="rounded-xl bg-neutral-950/70 border border-white/[0.08] p-4 text-xs">
                  <div className="flex items-center gap-1.5 text-brand-violet font-mono text-[10px] uppercase tracking-wider mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-violet animate-pulse" />
                    {step.sampleDialog.speaker}
                  </div>
                  <p className="text-white/90 italic font-sans leading-relaxed">
                    {step.sampleDialog.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Feature status disclaimer */}
        <div className="mt-8 text-center text-xs text-white/40 max-w-2xl mx-auto">
          <p>
            Robin V1 active capabilities are available today. Proactive daily briefings and automated meeting lifecycle tracking are being completed for upcoming V1 updates.
          </p>
        </div>
      </Container>
    </section>
  );
}

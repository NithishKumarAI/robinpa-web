"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "../ui/Container";
import {
  Mail,
  Calendar,
  CheckSquare,
  Users,
  Folder,
  Mic,
  Brain,
  ShieldAlert,
} from "lucide-react";

export function ProductCapabilitiesSection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const capabilities = [
    {
      icon: Mail,
      title: "Email",
      subtitle: "Gmail integration",
      description: "Manage incoming mail and compose responses without getting lost in your inbox.",
      highlights: [
        "Understand important messages and thread context",
        "Draft and send replies with explicit review",
        "Follow long email threads and key requests",
      ],
      badge: "Google OAuth",
    },
    {
      icon: Calendar,
      title: "Calendar",
      subtitle: "Google Calendar",
      description: "Keep your commitments coordinated through simple conversation.",
      highlights: [
        "View today's schedule and check for conflicts",
        "Create, reschedule, or update events with approval",
        "Prepare for upcoming meetings with attendees",
      ],
      badge: "Google OAuth",
    },
    {
      icon: CheckSquare,
      title: "Tasks & Reminders",
      subtitle: "Google Tasks & Local",
      description: "Capture to-dos naturally as they come to mind.",
      highlights: [
        "Capture tasks using natural language",
        "Keep track of due dates and priorities",
        "Set reminders so commitments aren't forgotten",
      ],
      badge: "Built-in",
    },
    {
      icon: Users,
      title: "People",
      subtitle: "Contacts & Local Directory",
      description: "Remember who people are so communication never feels ambiguous.",
      highlights: [
        "Remember who collaborators and contacts are",
        "Safely resolve recipients before drafting messages",
        "Local people directory tied to your conversation",
      ],
      badge: "Google & Local",
    },
    {
      icon: Folder,
      title: "Files",
      subtitle: "Scoped Local Workspace",
      description: "Ask Robin about documents placed in your dedicated assistant folder.",
      highlights: [
        "Work inside Robin's local workspace (C:\\RobinWorkspace)",
        "Summarize notes, briefs, and reference documents",
        "Scoped strictly to your workspace folder, never your entire drive",
      ],
      badge: "Local-First",
    },
    {
      icon: Mic,
      title: "Voice",
      subtitle: "On-Device Speech Processing",
      description: "Speak directly to Robin without needing synthetic keyword syntaxes.",
      highlights: [
        "Talk naturally with Robin through your microphone",
        "On-device CPU transcription using Moonshine",
        "Volatile in-memory audio; no audio files saved to disk",
      ],
      badge: "On-Device STT",
    },
    {
      icon: Brain,
      title: "Memory",
      subtitle: "Local Context & Preferences",
      description: "Robin remembers how you work so you don't repeat yourself every session.",
      highlights: [
        "Remembers meeting preferences, project names, and routines",
        "Stored on your PC in ~/.robin (robin.db & vector store)",
        "You can inspect, clear, or reset your memory at any time",
      ],
      badge: "Device-Only",
    },
  ];

  return (
    <section
      id="product"
      ref={sectionRef}
      className="relative isolate py-20 sm:py-28 overflow-hidden border-b border-white/[0.06] bg-background/85 backdrop-blur-sm scroll-mt-16"
      aria-label="What Robin Helps With"
    >
      {/* Background ambient gradient */}
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none -z-10"
      />

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
            Product Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter text-white leading-tight">
            What Robin helps with.
          </h2>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed pt-1">
            Real personal assistant capabilities designed for everyday Windows workflows.
            Everything is accessible through natural conversation—no complex command prompts required.
          </p>
        </motion.div>

        {/* Capability Cards Grid */}
        <div className="mt-14 sm:mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, idx) => {
            const IconComponent = cap.icon;
            return (
              <motion.div
                key={cap.title}
                initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.15 }}
                transition={{
                  duration: 0.5,
                  delay: prefersReduced ? 0 : idx * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04] p-6 sm:p-7 flex flex-col justify-between transition-colors duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center text-brand-violet">
                      <IconComponent className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-white/40 px-2 py-0.5 rounded border border-white/[0.08]">
                      {cap.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white tracking-tight">
                    {cap.title}
                  </h3>
                  <p className="text-xs font-mono text-brand-violet/80 mb-2">
                    {cap.subtitle}
                  </p>
                  <p className="text-xs sm:text-sm text-white/60 mb-5 leading-relaxed">
                    {cap.description}
                  </p>

                  <ul className="space-y-2 border-t border-white/[0.06] pt-4 text-xs text-white/75">
                    {cap.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-brand-violet mt-1.5 shrink-0" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}

          {/* Action Approval Guarantee Card */}
          <motion.div
            initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ amount: 0.15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-2 lg:col-span-2 rounded-2xl border border-brand-violet/25 bg-brand-violet/[0.03] p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
          >
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2 text-brand-violet font-mono text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Action Review Architecture</span>
              </div>
              <h4 className="text-lg font-semibold text-white tracking-tight">
                Robin asks before executing sensitive changes.
              </h4>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                Robin prepares drafts, calendar changes, and task creations in a pending review state.
                Nothing mutating ever executes until you explicitly click &ldquo;Approve&rdquo;.
              </p>
            </div>
            <a
              href="#control"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-brand-violet/30 text-xs font-mono uppercase tracking-wider text-white hover:bg-brand-violet/10 transition-colors shrink-0"
            >
              See Action Control
            </a>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

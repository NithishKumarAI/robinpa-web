"use client";

import React, { useState, useRef } from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import { Container } from "../ui/Container";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string | React.ReactNode;
}

export function FaqSection() {
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs: FaqItem[] = [
    {
      question: "What is Robin?",
      answer:
        "Robin is a local-first personal AI assistant built for Windows. It acts like an executive personal assistant for everyday life, helping you organize email, calendar appointments, tasks, reminders, contacts, and workspace documents through natural conversation.",
    },
    {
      question: "Is Robin free?",
      answer:
        "Robin V1 starts free. Optional paid services may be introduced in the future, while the goal is to keep the core personal-assistant experience broadly accessible.",
    },
    {
      question: "Does Robin work without the internet?",
      answer:
        "Local AI model inference, local workspace file reading, and local vector memory function completely offline once installed. However, connected services—such as Gmail, Google Calendar, Google Tasks, Google Contacts, Google Gemini cloud reasoning, model downloads, and initial OAuth authorization—require an active internet connection.",
    },
    {
      question: "What is Local AI?",
      answer:
        "Local AI means the machine learning model runs directly on your computer hardware (utilizing your CPU and GPU acceleration where available) through Ollama. Your conversational prompts, personal context, and assistant thoughts never leave your PC or travel across third-party AI servers.",
    },
    {
      question: "Do I need a powerful PC?",
      answer:
        "Smaller local models (such as 1B–2B parameter models) can run on modest PCs, including some systems with 8 GB of RAM. For standard or larger local models, 12–16+ GB of RAM and a dedicated GPU provide a significantly faster, more responsive experience. Robin automatically inspects your hardware (RAM, CPU threads, GPU VRAM, and storage) and suggests a compatible model tier during onboarding. If your system cannot comfortably run local models, Google Gemini provides a fast cloud alternative.",
    },
    {
      question: "What happens if my PC cannot run a local model?",
      answer:
        "You don't need a high-end gaming PC. You can configure Google Gemini with your personal API key for general cloud conversation, offloading heavy model inference from your machine. Note that Google Workspace assistant workflows (such as email and calendar management) require Local AI to protect your personal data under Robin's fail-closed boundary.",
    },
    {
      question: "Why does Gemini need an API key?",
      answer:
        "When using cloud AI, Robin communicates directly from your desktop to Google's Gemini API rather than routing your private prompts through an intermediary Robin server. Using your personal API key gives you direct control over your quota and data settings. Robin stores your key securely in the Windows Credential Manager.",
    },
    {
      question: "Does Robin read my Gmail?",
      answer:
        "Only when you explicitly ask Robin about your inbox or request details regarding a specific conversation. Robin uses read-only access (gmail.readonly) strictly to fulfill your requested assistant tasks. AI-assisted Gmail workflows require Local AI because Workspace data is strictly blocked from Gemini cloud context. Robin never monitors your inbox in the background, never sells data, and never uses your email to train generalized AI models.",
    },
    {
      question: "Where is my Robin memory stored?",
      answer:
        "All Robin application data, SQLite databases (robin.db and adk-sessions.db), and vector memory indices are stored locally on your hard drive in ~/.robin under your Windows user profile. OAuth tokens and API keys are stored in the Windows Credential Manager.",
    },
    {
      question: "Does Robin send emails without asking me?",
      answer:
        "No. Robin uses an affirmative human-in-the-loop safety architecture. Any mutating action—such as drafting an email, updating a calendar appointment, or adding a task—is presented in a pending review card with recipient and content clearly visible. Robin only sends or saves when you explicitly click 'Approve'.",
    },
    {
      question: "Which version of Windows does Robin support?",
      answer:
        "Robin is built and actively verified on modern 64-bit Windows 11 systems. Windows 10 (64-bit) is architecturally targeted.",
    },
    {
      question: "Do I need Ollama?",
      answer:
        "Only if you choose the Local AI engine. If you select Google Gemini for cloud reasoning, Ollama is not required. If you choose Local AI, Ollama is a free local runtime that Robin connects to automatically.",
    },
    {
      question: "Can I disconnect my Google account?",
      answer:
        "Yes, at any time. Open Robin Settings > Google Status and click 'Disconnect'. This immediately deletes your stored OAuth tokens from the Windows Credential Manager. You can also revoke access anytime in your Google Account security settings at myaccount.google.com/permissions.",
    },
  ];

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative isolate py-20 sm:py-28 overflow-hidden border-b border-white/[0.06] bg-background/85 backdrop-blur-sm scroll-mt-16"
      aria-label="Frequently Asked Questions"
    >
      <Container size="narrow">
        {/* Section Header */}
        <motion.div
          initial={prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.25 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-4 mb-14 sm:mb-16"
        >
          <span className="font-mono text-xs sm:text-sm uppercase tracking-[0.2em] text-brand-violet font-medium">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter text-white leading-tight">
            Frequently asked questions.
          </h2>
          <p className="text-base sm:text-lg text-white/70 leading-relaxed max-w-xl mx-auto">
            Honest answers about Robin&apos;s architecture, privacy, local AI, and capabilities.
          </p>
        </motion.div>

        {/* Accordion List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.035] transition-colors overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full py-5 px-6 sm:px-7 flex items-center justify-between text-left gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet rounded-2xl"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <span className="text-sm sm:text-base font-medium text-white tracking-tight">
                    {faq.question}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0 text-white/60 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-white" : ""
                    }`}
                  >
                    <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                        transition: {
                          height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.25, delay: 0.05 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                          opacity: { duration: 0.15 },
                        },
                      }}
                    >
                      <div className="px-6 sm:px-7 pb-5 pt-1 text-xs sm:text-sm text-white/70 leading-relaxed border-t border-white/[0.04]">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Container } from "../ui/Container";
import { RobinOrb } from "../visual/RobinOrb";
import { CapabilityNode } from "./capabilities/CapabilityNode";
import {
  CommunicationDemo,
  TimeDemo,
  WorkspaceDemo,
  VoiceDemo,
} from "./capabilities/InteractionDemo";
import {
  Mail,
  Calendar,
  Users,
  CheckSquare,
  Folder,
  Bell,
  Mic,
  Brain,
} from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

export function CapabilitiesSection() {
  const prefersReducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const orbContainerRef = useRef<HTMLDivElement>(null);
  const orbGlowRef = useRef<HTMLDivElement>(null);

  // Headlines
  const headline1Ref = useRef<HTMLDivElement>(null);
  const headline2Ref = useRef<HTMLDivElement>(null);
  const headline3Ref = useRef<HTMLDivElement>(null);
  const headline4Ref = useRef<HTMLDivElement>(null);
  const headline5Ref = useRef<HTMLDivElement>(null);

  // Spatial Nodes (Desktop only)
  const nodeEmailRef = useRef<HTMLDivElement>(null);
  const nodeCalendarRef = useRef<HTMLDivElement>(null);
  const nodePeopleRef = useRef<HTMLDivElement>(null);
  const nodeTasksRef = useRef<HTMLDivElement>(null);
  const nodeFilesRef = useRef<HTMLDivElement>(null);
  const nodeRemindersRef = useRef<HTMLDivElement>(null);
  const nodeVoiceRef = useRef<HTMLDivElement>(null);
  const nodeMemoryRef = useRef<HTMLDivElement>(null);

  // Moment Demo Cards
  const demoCommRef = useRef<HTMLDivElement>(null);
  const demoTimeRef = useRef<HTMLDivElement>(null);
  const demoWorkspaceRef = useRef<HTMLDivElement>(null);
  const demoVoiceRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      const allNodes = [
        nodeEmailRef.current,
        nodeCalendarRef.current,
        nodePeopleRef.current,
        nodeTasksRef.current,
        nodeFilesRef.current,
        nodeRemindersRef.current,
        nodeVoiceRef.current,
        nodeMemoryRef.current,
      ];

      // =======================================================================
      // DESKTOP & TABLET CINEMATIC PINNED SEQUENCE
      // =======================================================================
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Initialize states
          gsap.set(headline1Ref.current, { opacity: 1, y: 0 });
          gsap.set(
            [
              headline2Ref.current,
              headline3Ref.current,
              headline4Ref.current,
              headline5Ref.current,
            ],
            { opacity: 0, y: 15 }
          );

          gsap.set(allNodes, { opacity: 0.75, scale: 1 });
          gsap.set(
            [
              demoCommRef.current,
              demoTimeRef.current,
              demoWorkspaceRef.current,
              demoVoiceRef.current,
            ],
            { opacity: 0, y: 25, scale: 0.95, pointerEvents: "none" }
          );

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              pin: pin,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          });

          // -------------------------------------------------------------
          // MOMENT 1 -> MOMENT 2: Communication (Email + People) (0 -> 0.28)
          // -------------------------------------------------------------
          tl.to(
            headline1Ref.current,
            { opacity: 0, y: -15, duration: 0.08, ease: "power2.in" },
            0.1
          )
            .to(
              headline2Ref.current,
              { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
              0.16
            )
            // Dim distant nodes; highlight Email & People
            .to(
              [
                nodeCalendarRef.current,
                nodeTasksRef.current,
                nodeFilesRef.current,
                nodeRemindersRef.current,
                nodeVoiceRef.current,
                nodeMemoryRef.current,
              ],
              { opacity: 0.2, scale: 0.95, duration: 0.1 },
              0.16
            )
            .to(
              [nodeEmailRef.current, nodePeopleRef.current],
              { opacity: 1, scale: 1.1, duration: 0.12, ease: "power1.out" },
              0.16
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.7, scale: 1.15, duration: 0.14 },
              0.18
            )
            .to(
              demoCommRef.current,
              { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "power2.out" },
              0.2
            );

          // -------------------------------------------------------------
          // MOMENT 2 -> MOMENT 3: Time (Calendar + Tasks + Reminders) (0.28 -> 0.56)
          // -------------------------------------------------------------
          tl.to(
            headline2Ref.current,
            { opacity: 0, y: -15, duration: 0.08, ease: "power2.in" },
            0.36
          )
            .to(
              demoCommRef.current,
              { opacity: 0, y: -15, scale: 0.96, duration: 0.08, ease: "power2.in" },
              0.36
            )
            .to(
              headline3Ref.current,
              { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
              0.42
            )
            // Dim previous; highlight Calendar, Tasks, Reminders
            .to(
              [nodeEmailRef.current, nodePeopleRef.current],
              { opacity: 0.2, scale: 0.95, duration: 0.1 },
              0.42
            )
            .to(
              [
                nodeCalendarRef.current,
                nodeTasksRef.current,
                nodeRemindersRef.current,
              ],
              { opacity: 1, scale: 1.1, duration: 0.12, ease: "power1.out" },
              0.42
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.5, scale: 1.05, duration: 0.14 },
              0.44
            )
            .to(
              demoTimeRef.current,
              { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "power2.out" },
              0.46
            );

          // -------------------------------------------------------------
          // MOMENT 3 -> MOMENT 4: Scoped Workspace (Files + Memory) (0.56 -> 0.78)
          // -------------------------------------------------------------
          tl.to(
            headline3Ref.current,
            { opacity: 0, y: -15, duration: 0.08, ease: "power2.in" },
            0.58
          )
            .to(
              demoTimeRef.current,
              { opacity: 0, y: -15, scale: 0.96, duration: 0.08, ease: "power2.in" },
              0.58
            )
            .to(
              headline4Ref.current,
              { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
              0.64
            )
            // Dim previous; highlight Files & Memory
            .to(
              [
                nodeCalendarRef.current,
                nodeTasksRef.current,
                nodeRemindersRef.current,
              ],
              { opacity: 0.2, scale: 0.95, duration: 0.1 },
              0.64
            )
            .to(
              [nodeFilesRef.current, nodeMemoryRef.current],
              { opacity: 1, scale: 1.1, duration: 0.12, ease: "power1.out" },
              0.64
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.65, scale: 1.1, duration: 0.14 },
              0.66
            )
            .to(
              demoWorkspaceRef.current,
              { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "power2.out" },
              0.68
            );

          // -------------------------------------------------------------
          // MOMENT 4 -> MOMENT 5: Voice & Unified Assistant (0.78 -> 0.92)
          // -------------------------------------------------------------
          tl.to(
            headline4Ref.current,
            { opacity: 0, y: -15, duration: 0.08, ease: "power2.in" },
            0.76
          )
            .to(
              demoWorkspaceRef.current,
              { opacity: 0, y: -15, scale: 0.96, duration: 0.08, ease: "power2.in" },
              0.76
            )
            .to(
              headline5Ref.current,
              { opacity: 1, y: 0, duration: 0.1, ease: "power2.out" },
              0.8
            )
            // Highlight Voice; dim others
            .to(
              [nodeFilesRef.current, nodeMemoryRef.current],
              { opacity: 0.2, scale: 0.95, duration: 0.1 },
              0.8
            )
            .to(
              nodeVoiceRef.current,
              { opacity: 1, scale: 1.12, duration: 0.12, ease: "power1.out" },
              0.8
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.8, scale: 1.2, duration: 0.14 },
              0.82
            )
            .to(
              demoVoiceRef.current,
              { opacity: 1, y: 0, scale: 1, duration: 0.14, ease: "power2.out" },
              0.84
            );

          // -------------------------------------------------------------
          // MOMENT 5 -> CLEAN BALANCED OUTRO (0.92 -> 1.0)
          // -------------------------------------------------------------
          tl.to(
            headline5Ref.current,
            { opacity: 0, y: -15, duration: 0.06, ease: "power2.in" },
            0.93
          )
            .to(
              demoVoiceRef.current,
              { opacity: 0, y: -15, scale: 0.96, duration: 0.06, ease: "power2.in" },
              0.93
            )
            .to(
              allNodes,
              { opacity: 0.7, scale: 1, duration: 0.07, ease: "power1.out" },
              0.94
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.4, scale: 1, duration: 0.07, ease: "power1.out" },
              0.94
            );
        }
      );

      // =======================================================================
      // MOBILE PINNED SEQUENCE (COMPACT & OVERFLOW-SAFE)
      // =======================================================================
      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(headline1Ref.current, { opacity: 1, y: 0 });
          gsap.set(
            [
              headline2Ref.current,
              headline3Ref.current,
              headline4Ref.current,
              headline5Ref.current,
            ],
            { opacity: 0, y: 15 }
          );
          gsap.set(
            [
              demoCommRef.current,
              demoTimeRef.current,
              demoWorkspaceRef.current,
              demoVoiceRef.current,
            ],
            { opacity: 0, y: 20 }
          );

          const tlMobile = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              pin: pin,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          tlMobile
            // Moment 1 exit -> Moment 2 enter
            .to(headline1Ref.current, { opacity: 0, y: -12, duration: 0.1 }, 0.1)
            .to(headline2Ref.current, { opacity: 1, y: 0, duration: 0.1 }, 0.16)
            .to(demoCommRef.current, { opacity: 1, y: 0, duration: 0.12 }, 0.18)
            // Moment 2 exit -> Moment 3 enter
            .to(headline2Ref.current, { opacity: 0, y: -12, duration: 0.1 }, 0.34)
            .to(demoCommRef.current, { opacity: 0, y: -12, duration: 0.1 }, 0.34)
            .to(headline3Ref.current, { opacity: 1, y: 0, duration: 0.1 }, 0.4)
            .to(demoTimeRef.current, { opacity: 1, y: 0, duration: 0.12 }, 0.42)
            // Moment 3 exit -> Moment 4 enter
            .to(headline3Ref.current, { opacity: 0, y: -12, duration: 0.1 }, 0.58)
            .to(demoTimeRef.current, { opacity: 0, y: -12, duration: 0.1 }, 0.58)
            .to(headline4Ref.current, { opacity: 1, y: 0, duration: 0.1 }, 0.64)
            .to(demoWorkspaceRef.current, { opacity: 1, y: 0, duration: 0.12 }, 0.66)
            // Moment 4 exit -> Moment 5 enter
            .to(headline4Ref.current, { opacity: 0, y: -12, duration: 0.1 }, 0.8)
            .to(demoWorkspaceRef.current, { opacity: 0, y: -12, duration: 0.1 }, 0.8)
            .to(headline5Ref.current, { opacity: 1, y: 0, duration: 0.1 }, 0.86)
            .to(demoVoiceRef.current, { opacity: 1, y: 0, duration: 0.12 }, 0.88)
            // Clean outro
            .to(headline5Ref.current, { opacity: 0, y: -12, duration: 0.08 }, 0.94)
            .to(demoVoiceRef.current, { opacity: 0, y: -12, duration: 0.08 }, 0.94);
        }
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  // =========================================================================
  // ACCESSIBLE STATIC VIEW FOR REDUCED MOTION
  // =========================================================================
  if (prefersReducedMotion) {
    return (
      <section
        id="capabilities"
        className="relative isolate w-full py-20 sm:py-24 bg-background border-b border-white/[0.06]"
        aria-label="Robin Capabilities Interactive System"
      >
        <Container size="default" className="flex flex-col items-center">
          <div className="text-center max-w-2xl mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-brand-indigo">
              02 / Spatial System
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
              One assistant. Your daily life connected.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-foreground-muted">
              Robin brings the tools you already use into one conversation.
            </p>
          </div>

          {/* Central Orb */}
          <div className="relative w-40 sm:w-48 aspect-square flex items-center justify-center my-6">
            <RobinOrb className="w-full h-full" />
          </div>

          {/* Capability Pills */}
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mb-12">
            {[
              "Email",
              "Calendar",
              "People",
              "Tasks",
              "Files",
              "Reminders",
              "Voice",
              "Memory",
            ].map((name) => (
              <span
                key={name}
                className="px-3.5 py-1.5 rounded-full bg-background-surface border border-white/[0.08] text-xs text-white/90 font-mono"
              >
                {name}
              </span>
            ))}
          </div>

          {/* Sequential readable cards */}
          <div className="w-full max-w-xl flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-violet text-center">
                Communication &bull; People
              </span>
              <CommunicationDemo />
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-indigo text-center">
                Time &bull; Schedule &bull; Routines
              </span>
              <TimeDemo />
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-violet text-center">
                Scoped Workspace &bull; Memory
              </span>
              <WorkspaceDemo />
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-brand-magenta text-center">
                Natural Voice &bull; Unified Assistant
              </span>
              <VoiceDemo />
            </div>
          </div>
        </Container>
      </section>
    );
  }

  // =========================================================================
  // STANDARD CINEMATIC PINNED VIEW
  // =========================================================================
  return (
    <section
      id="capabilities"
      ref={sectionRef}
      className="relative isolate w-full h-[350vh] bg-background border-b border-white/[0.06]"
      aria-label="Robin Capabilities Interactive System"
    >
      {/* Pinned Viewport Scene (No sticky top-0, managed cleanly by ScrollTrigger) */}
      <div
        ref={pinRef}
        className="w-full h-screen flex flex-col items-center justify-between py-12 sm:py-16 overflow-hidden"
      >
        {/* Subtle ambient illumination behind the orb */}
        <div
          ref={orbGlowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[540px] h-[340px] sm:h-[540px] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.14)_0%,rgba(139,92,246,0.06)_45%,transparent_70%)] blur-2xl pointer-events-none -z-10"
        />

        {/* ============================================================= */}
        {/* TOP: Dynamic Moment Headlines */}
        {/* ============================================================= */}
        <Container size="default" className="relative h-20 sm:h-24 flex items-center justify-center text-center z-20 pointer-events-none">
          {/* Moment 1 */}
          <div ref={headline1Ref} className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-xs uppercase tracking-widest text-brand-indigo">
              02 / Spatial System
            </span>
            <h2 className="mt-1 text-2xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white">
              One assistant. Your daily life connected.
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-foreground-muted max-w-xl">
              Robin brings the tools you already use into one conversation.
            </p>
          </div>

          {/* Moment 2 */}
          <div ref={headline2Ref} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
            <span className="font-mono text-xs uppercase tracking-widest text-brand-violet">
              Communication &bull; People
            </span>
            <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
              Email meets confirmed identity.
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
              Connect intent to people without switching between apps.
            </p>
          </div>

          {/* Moment 3 */}
          <div ref={headline3Ref} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
            <span className="font-mono text-xs uppercase tracking-widest text-brand-indigo">
              Time &bull; Schedule &bull; Routines
            </span>
            <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
              Synchronized to your schedule.
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
              Calendar, daily tasks, and timed reminders unified.
            </p>
          </div>

          {/* Moment 4 */}
          <div ref={headline4Ref} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
            <span className="font-mono text-xs uppercase tracking-widest text-brand-violet">
              Scoped Workspace &bull; Memory
            </span>
            <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
              Files and continuity within your sandbox.
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
              Robin recalls relevant context inside your configured workspace.
            </p>
          </div>

          {/* Moment 5 */}
          <div ref={headline5Ref} className="absolute inset-0 flex flex-col items-center justify-center opacity-0">
            <span className="font-mono text-xs uppercase tracking-widest text-brand-magenta">
              Natural Voice &bull; Unified Assistant
            </span>
            <h3 className="mt-1 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
              Type it or say it.
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-foreground-muted">
              Robin uses the same unified assistant underneath.
            </p>
          </div>
        </Container>

        {/* ============================================================= */}
        {/* CENTER: Spatial System with RobinOrb & Surrounding Nodes */}
        {/* ============================================================= */}
        <div className="relative w-full max-w-5xl h-[340px] sm:h-[400px] flex items-center justify-center my-auto px-4">
          
          {/* Spatial Capability Nodes (Desktop Placement - distinct refs) */}
          <div className="hidden md:block absolute inset-0 pointer-events-none">
            {/* Top-Left: Email */}
            <div className="absolute left-[6%] top-[12%]">
              <CapabilityNode
                id="email"
                label="Email"
                sublabel="Gmail sync"
                icon={Mail}
                nodeRef={nodeEmailRef}
              />
            </div>

            {/* Top-Right: Calendar */}
            <div className="absolute right-[6%] top-[12%]">
              <CapabilityNode
                id="calendar"
                label="Calendar"
                sublabel="Events & schedule"
                icon={Calendar}
                nodeRef={nodeCalendarRef}
              />
            </div>

            {/* Mid-Left: People */}
            <div className="absolute left-[2%] top-[46%] -translate-y-1/2">
              <CapabilityNode
                id="people"
                label="People"
                sublabel="Confirmed identities"
                icon={Users}
                nodeRef={nodePeopleRef}
              />
            </div>

            {/* Mid-Right: Tasks */}
            <div className="absolute right-[2%] top-[46%] -translate-y-1/2">
              <CapabilityNode
                id="tasks"
                label="Tasks"
                sublabel="Daily list"
                icon={CheckSquare}
                nodeRef={nodeTasksRef}
              />
            </div>

            {/* Bottom-Left: Files */}
            <div className="absolute left-[8%] bottom-[12%]">
              <CapabilityNode
                id="files"
                label="Files"
                sublabel="Workspace scope"
                icon={Folder}
                nodeRef={nodeFilesRef}
              />
            </div>

            {/* Bottom-Right: Reminders */}
            <div className="absolute right-[8%] bottom-[12%]">
              <CapabilityNode
                id="reminders"
                label="Reminders"
                sublabel="Timed alerts"
                icon={Bell}
                nodeRef={nodeRemindersRef}
              />
            </div>

            {/* Sub-Bottom Left: Voice */}
            <div className="absolute left-[26%] bottom-[2%]">
              <CapabilityNode
                id="voice"
                label="Voice"
                sublabel="Live conversation"
                icon={Mic}
                nodeRef={nodeVoiceRef}
              />
            </div>

            {/* Sub-Bottom Right: Memory */}
            <div className="absolute right-[26%] bottom-[2%]">
              <CapabilityNode
                id="memory"
                label="Memory"
                sublabel="Local context"
                icon={Brain}
                nodeRef={nodeMemoryRef}
              />
            </div>
          </div>

          {/* Central Orb Container */}
          <div
            ref={orbContainerRef}
            className="relative w-48 sm:w-60 md:w-64 aspect-square flex items-center justify-center z-10 pointer-events-none select-none"
          >
            <RobinOrb className="w-full h-full" />
          </div>

          {/* Mobile Capability Pills (Static visual presentation, zero ref hijacking) */}
          <div className="md:hidden absolute inset-x-2 -top-2 flex flex-wrap justify-center gap-1.5 pointer-events-none">
            <span className="px-2.5 py-1 rounded bg-background-surface/90 border border-white/[0.08] text-[11px] text-white/90 font-mono">Email</span>
            <span className="px-2.5 py-1 rounded bg-background-surface/90 border border-white/[0.08] text-[11px] text-white/90 font-mono">Calendar</span>
            <span className="px-2.5 py-1 rounded bg-background-surface/90 border border-white/[0.08] text-[11px] text-white/90 font-mono">People</span>
            <span className="px-2.5 py-1 rounded bg-background-surface/90 border border-white/[0.08] text-[11px] text-white/90 font-mono">Tasks</span>
            <span className="px-2.5 py-1 rounded bg-background-surface/90 border border-white/[0.08] text-[11px] text-white/90 font-mono">Files</span>
            <span className="px-2.5 py-1 rounded bg-background-surface/90 border border-white/[0.08] text-[11px] text-white/90 font-mono">Reminders</span>
            <span className="px-2.5 py-1 rounded bg-background-surface/90 border border-white/[0.08] text-[11px] text-white/90 font-mono">Voice</span>
            <span className="px-2.5 py-1 rounded bg-background-surface/90 border border-white/[0.08] text-[11px] text-white/90 font-mono">Memory</span>
          </div>
        </div>

        {/* ============================================================= */}
        {/* BOTTOM: Active Moment Interactive Card */}
        {/* ============================================================= */}
        <div className="relative w-full max-w-lg h-36 flex items-center justify-center px-4 z-20 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <CommunicationDemo ref={demoCommRef} />
            <TimeDemo ref={demoTimeRef} />
            <WorkspaceDemo ref={demoWorkspaceRef} />
            <VoiceDemo ref={demoVoiceRef} />
          </div>
        </div>

      </div>
    </section>
  );
}

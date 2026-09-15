"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { Container } from "../ui/Container";
import { RobinOrb } from "../visual/RobinOrb";
import { DemoMessage } from "./meet-robin/DemoMessage";
import { PersonCard } from "./meet-robin/PersonCard";
import { ApprovalCard } from "./meet-robin/ApprovalCard";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

export function MeetRobinSection() {
  const prefersReducedMotion = useReducedMotion();

  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  // Moment refs for GSAP targeting
  const orbContainerRef = useRef<HTMLDivElement>(null);
  const orbGlowRef = useRef<HTMLDivElement>(null);

  // Moment 1 refs
  const m1Ref = useRef<HTMLDivElement>(null);

  // Moment 2 refs
  const m2Ref = useRef<HTMLDivElement>(null);
  const m2BubbleRef = useRef<HTMLDivElement>(null);

  // Moment 3 refs
  const m3Ref = useRef<HTMLDivElement>(null);
  const m3CardRef = useRef<HTMLDivElement>(null);

  // Moment 4 refs
  const m4Ref = useRef<HTMLDivElement>(null);
  const m4CardRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // =======================================================================
      // DESKTOP & TABLET CINEMATIC PINNED SEQUENCE
      // =======================================================================
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Set initial states
          gsap.set(m1Ref.current, { opacity: 1, y: 0 });
          gsap.set(m2Ref.current, { opacity: 0, y: 20 });
          gsap.set(m2BubbleRef.current, { opacity: 0, y: 30, scale: 0.95 });
          gsap.set(m3Ref.current, { opacity: 0, y: 20 });
          gsap.set(m3CardRef.current, { opacity: 0, y: 30, scale: 0.95 });
          gsap.set(m4Ref.current, { opacity: 0, y: 20 });
          gsap.set(m4CardRef.current, { opacity: 0, y: 30, scale: 0.95 });
          gsap.set(orbContainerRef.current, { scale: 1, y: 0 });
          gsap.set(orbGlowRef.current, { opacity: 0.4, scale: 1 });

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
          // MOMENT 1 -> MOMENT 2 (0% -> 28%)
          // Text 1 fades out; Text 2 & User bubble appear; Orb subtly pulses
          // -------------------------------------------------------------
          tl.to(
            m1Ref.current,
            { opacity: 0, y: -24, duration: 0.12, ease: "power2.in" },
            0.08
          )
            .to(
              orbContainerRef.current,
              { scale: 1.06, duration: 0.16, ease: "power1.inOut" },
              0.16
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.7, scale: 1.15, duration: 0.16, ease: "power1.inOut" },
              0.16
            )
            .to(
              m2Ref.current,
              { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" },
              0.18
            )
            .to(
              m2BubbleRef.current,
              { opacity: 1, y: 0, scale: 1, duration: 0.16, ease: "back.out(1.2)" },
              0.22
            );

          // -------------------------------------------------------------
          // MOMENT 2 -> MOMENT 3 (28% -> 58%)
          // Bubble gently shifts; Moment 3 (Person Card) enters
          // -------------------------------------------------------------
          tl.to(
            m2Ref.current,
            { opacity: 0, y: -16, duration: 0.1, ease: "power2.in" },
            0.38
          )
            .to(
              m2BubbleRef.current,
              { opacity: 0, y: -20, scale: 0.96, duration: 0.1, ease: "power2.in" },
              0.4
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.45, scale: 1.05, duration: 0.14 },
              0.4
            )
            .to(
              m3Ref.current,
              { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" },
              0.44
            )
            .to(
              m3CardRef.current,
              { opacity: 1, y: 0, scale: 1, duration: 0.16, ease: "power2.out" },
              0.47
            );

          // -------------------------------------------------------------
          // MOMENT 3 -> MOMENT 4 (58% -> 88%)
          // Person card fades; Moment 4 (Approval Card) enters
          // -------------------------------------------------------------
          tl.to(
            m3Ref.current,
            { opacity: 0, y: -16, duration: 0.1, ease: "power2.in" },
            0.64
          )
            .to(
              m3CardRef.current,
              { opacity: 0, y: -20, scale: 0.96, duration: 0.1, ease: "power2.in" },
              0.66
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.65, scale: 1.1, duration: 0.14 },
              0.68
            )
            .to(
              m4Ref.current,
              { opacity: 1, y: 0, duration: 0.14, ease: "power2.out" },
              0.7
            )
            .to(
              m4CardRef.current,
              { opacity: 1, y: 0, scale: 1, duration: 0.16, ease: "power2.out" },
              0.73
            );

          // -------------------------------------------------------------
          // MOMENT 4 -> CLEAN OUTRO (88% -> 100%)
          // Approval card fades out; Orb returns to neutral state
          // -------------------------------------------------------------
          tl.to(
            m4Ref.current,
            { opacity: 0, y: -16, duration: 0.08, ease: "power2.in" },
            0.9
          )
            .to(
              m4CardRef.current,
              { opacity: 0, y: -20, scale: 0.96, duration: 0.08, ease: "power2.in" },
              0.91
            )
            .to(
              orbContainerRef.current,
              { scale: 1, y: 0, duration: 0.08, ease: "power1.out" },
              0.92
            )
            .to(
              orbGlowRef.current,
              { opacity: 0.35, scale: 1, duration: 0.08, ease: "power1.out" },
              0.92
            );
        }
      );

      // =======================================================================
      // MOBILE PINNED & ADAPTED SEQUENCE
      // =======================================================================
      mm.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(m1Ref.current, { opacity: 1, y: 0 });
          gsap.set(m2Ref.current, { opacity: 0, y: 15 });
          gsap.set(m2BubbleRef.current, { opacity: 0, y: 20 });
          gsap.set(m3Ref.current, { opacity: 0, y: 15 });
          gsap.set(m3CardRef.current, { opacity: 0, y: 20 });
          gsap.set(m4Ref.current, { opacity: 0, y: 15 });
          gsap.set(m4CardRef.current, { opacity: 0, y: 20 });

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

          // Mobile 4-step progressive timeline
          tlMobile
            // Moment 1 exit
            .to(m1Ref.current, { opacity: 0, y: -15, duration: 0.12 }, 0.1)
            // Moment 2 enter
            .to(m2Ref.current, { opacity: 1, y: 0, duration: 0.12 }, 0.18)
            .to(m2BubbleRef.current, { opacity: 1, y: 0, duration: 0.14 }, 0.22)
            // Moment 2 exit
            .to(m2Ref.current, { opacity: 0, y: -15, duration: 0.1 }, 0.38)
            .to(m2BubbleRef.current, { opacity: 0, y: -15, duration: 0.1 }, 0.4)
            // Moment 3 enter
            .to(m3Ref.current, { opacity: 1, y: 0, duration: 0.12 }, 0.46)
            .to(m3CardRef.current, { opacity: 1, y: 0, duration: 0.14 }, 0.5)
            // Moment 3 exit
            .to(m3Ref.current, { opacity: 0, y: -15, duration: 0.1 }, 0.66)
            .to(m3CardRef.current, { opacity: 0, y: -15, duration: 0.1 }, 0.68)
            // Moment 4 enter
            .to(m4Ref.current, { opacity: 1, y: 0, duration: 0.12 }, 0.74)
            .to(m4CardRef.current, { opacity: 1, y: 0, duration: 0.14 }, 0.78)
            // Moment 4 exit & clean outro
            .to(m4Ref.current, { opacity: 0, y: -15, duration: 0.08 }, 0.92)
            .to(m4CardRef.current, { opacity: 0, y: -15, duration: 0.08 }, 0.92);
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
        id="meet-robin"
        className="relative isolate w-full py-20 sm:py-28 bg-background border-b border-white/[0.06]"
        aria-label="Meet Robin Interactive Showcase"
      >
        <Container size="narrow" className="flex flex-col items-center text-center">
          <span className="font-mono text-xs uppercase tracking-widest text-brand-violet">
            01 / Introduction
          </span>
          <h2 className="mt-2 text-3xl sm:text-5xl font-semibold tracking-tighter text-white">
            Meet Robin.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-foreground-muted font-normal leading-relaxed max-w-xl">
            Your personal assistant for the things you deal with every day.
          </p>

          {/* Central Robin Orb */}
          <div className="relative w-48 sm:w-56 aspect-square flex items-center justify-center my-8">
            <RobinOrb className="w-full h-full" />
          </div>

          {/* Sequential Showcase Cards */}
          <div className="w-full max-w-md flex flex-col gap-10 mt-2 text-left">
            <div className="flex flex-col gap-3">
              <div className="text-center">
                <span className="font-mono text-[11px] uppercase tracking-widest text-brand-indigo">
                  02 / Direct Input
                </span>
                <h3 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  Just tell Robin what you need.
                </h3>
              </div>
              <div className="flex justify-center">
                <DemoMessage />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="text-center">
                <span className="font-mono text-[11px] uppercase tracking-widest text-brand-violet">
                  03 / People Context
                </span>
                <p className="mt-1 text-sm sm:text-base font-medium text-white max-w-sm mx-auto">
                  Robin understands the people you&apos;ve confirmed &mdash; not just email addresses.
                </p>
              </div>
              <div className="flex justify-center">
                <PersonCard />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="text-center">
                <span className="font-mono text-[11px] uppercase tracking-widest text-brand-magenta">
                  04 / Human In The Loop
                </span>
                <h3 className="mt-1 text-xl sm:text-2xl font-semibold tracking-tight text-white">
                  Robin prepares it. You stay in control.
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-foreground-muted font-normal">
                  Actions that change something are reviewed before execution.
                </p>
              </div>
              <div className="flex justify-center">
                <ApprovalCard />
              </div>
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
      id="meet-robin"
      ref={sectionRef}
      className="relative isolate w-full h-[250vh] bg-background border-b border-white/[0.06]"
      aria-label="Meet Robin Interactive Showcase"
    >
      {/* Pinned Viewport Scene (No sticky top-0, managed cleanly by ScrollTrigger) */}
      <div
        ref={pinRef}
        className="w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Ambient illumination behind central scene */}
        <div
          ref={orbGlowRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[500px] h-[340px] sm:h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.14)_0%,rgba(99,102,241,0.05)_45%,transparent_70%)] blur-2xl pointer-events-none -z-10"
        />

        <Container size="narrow" className="relative w-full h-full flex flex-col items-center justify-center px-4 sm:px-6">
          
          {/* ============================================================= */}
          {/* MOMENT 1: Meet Robin (Intro) */}
          {/* ============================================================= */}
          <div
            ref={m1Ref}
            className="absolute top-[12%] sm:top-[15%] text-center max-w-xl px-4 z-20 pointer-events-none"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-brand-violet">
              01 / Introduction
            </span>
            <h2 className="mt-2 text-3xl sm:text-5xl font-semibold tracking-tighter text-white">
              Meet Robin.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-foreground-muted font-normal leading-relaxed">
              Your personal assistant for the things you deal with every day.
            </p>
          </div>

          {/* ============================================================= */}
          {/* MOMENT 2: Just ask (User message bubble) */}
          {/* ============================================================= */}
          <div
            ref={m2Ref}
            className="absolute top-[10%] sm:top-[12%] text-center max-w-md px-4 z-20 pointer-events-none opacity-0"
          >
            <span className="font-mono text-[11px] uppercase tracking-widest text-brand-indigo">
              02 / Direct Input
            </span>
            <h3 className="mt-1.5 text-2xl sm:text-4xl font-semibold tracking-tight text-white">
              Just tell Robin what you need.
            </h3>
          </div>
          <div
            ref={m2BubbleRef}
            className="absolute bottom-[8%] sm:bottom-[10%] md:bottom-[12%] w-full flex justify-center px-4 z-20 opacity-0"
          >
            <DemoMessage />
          </div>

          {/* ============================================================= */}
          {/* MOMENT 3: Robin understands the person */}
          {/* ============================================================= */}
          <div
            ref={m3Ref}
            className="absolute top-[10%] sm:top-[12%] text-center max-w-md px-4 z-20 pointer-events-none opacity-0"
          >
            <span className="font-mono text-[11px] uppercase tracking-widest text-brand-violet">
              03 / People Context
            </span>
            <p className="mt-1.5 text-base sm:text-xl font-medium tracking-tight text-white max-w-sm mx-auto">
              Robin understands the people you&apos;ve confirmed &mdash; not just email addresses.
            </p>
          </div>
          <div
            ref={m3CardRef}
            className="absolute bottom-[8%] sm:bottom-[10%] md:bottom-[12%] w-full flex justify-center px-4 z-20 opacity-0"
          >
            <PersonCard />
          </div>

          {/* ============================================================= */}
          {/* MOMENT 4: Robin prepares the action (Approval Workflow) */}
          {/* ============================================================= */}
          <div
            ref={m4Ref}
            className="absolute top-[9%] sm:top-[11%] text-center max-w-lg px-4 z-20 pointer-events-none opacity-0"
          >
            <span className="font-mono text-[11px] uppercase tracking-widest text-brand-magenta">
              04 / Human In The Loop
            </span>
            <h3 className="mt-1.5 text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Robin prepares it. You stay in control.
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-foreground-muted font-normal">
              Actions that change something are reviewed before execution.
            </p>
          </div>
          <div
            ref={m4CardRef}
            className="absolute bottom-[7%] sm:bottom-[8%] md:bottom-[10%] w-full flex justify-center px-4 z-20 opacity-0"
          >
            <ApprovalCard />
          </div>

          {/* ============================================================= */}
          {/* CENTRAL ANCHOR: RobinOrb Container */}
          {/* ============================================================= */}
          <div
            ref={orbContainerRef}
            className="relative w-full max-w-[210px] sm:max-w-[250px] md:max-w-[280px] aspect-square flex items-center justify-center my-auto z-10 pointer-events-none select-none"
          >
            <RobinOrb className="w-full h-full" />
          </div>

        </Container>
      </div>
    </section>
  );
}

"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  ROBIN_SCENES,
  getBaseOrbSize,
  type SceneConfig,
} from "./robin-scenes";
import {
  buildPersistentParticles,
  PersistentParticleEngine,
  type PersistentParticle,
} from "./persistent-engine";
import {
  subscribeRobinStateOverride,
  getRobinStateOverride,
} from "./stage-state";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function PersistentRobinStage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();

  // Keep single persistent particle population for the page lifetime
  const particlesRef = useRef<PersistentParticle[] | null>(null);
  if (!particlesRef.current) {
    particlesRef.current = buildPersistentParticles();
  }

  // Persistent simulation engine
  const engineRef = useRef<PersistentParticleEngine | null>(null);
  if (!engineRef.current) {
    engineRef.current = new PersistentParticleEngine(
      particlesRef.current,
      ROBIN_SCENES[0].state,
      prefersReduced
    );
  }

  // Dynamic state override (e.g. VoiceSection listening/speaking)
  const [activeOverrideState, setActiveOverrideState] = useState(getRobinStateOverride());

  useEffect(() => {
    return subscribeRobinStateOverride((nextState) => {
      setActiveOverrideState(nextState);
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;
    let rafId = 0;
    let lastTime: number | null = null;

    // Viewport dimensions
    let vw = window.innerWidth;
    let vh = window.innerHeight;
    let isMobile = vw < 768;
    let baseOrbSize = getBaseOrbSize(vw, vh);

    const resizeCanvas = () => {
      vw = window.innerWidth;
      vh = window.innerHeight;
      isMobile = vw < 768;
      baseOrbSize = getBaseOrbSize(vw, vh);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = vw * dpr;
      canvas.height = vh * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0); // reset transform
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Current transition interpolation proxy
    const transitionState = {
      fromIndex: 0,
      toIndex: 0,
      progress: 0,
    };

    // Initialize ScrollTriggers for each transition between consecutive scenes
    let triggers: ScrollTrigger[] = [];

    const setupTriggers = () => {
      // Kill existing triggers if any
      triggers.forEach((t) => t.kill());
      triggers = [];

      for (let i = 0; i < ROBIN_SCENES.length - 1; i += 1) {
        const fromScene = ROBIN_SCENES[i];
        const toScene = ROBIN_SCENES[i + 1];

        const fromEl = document.getElementById(fromScene.sectionId);
        const toEl = document.getElementById(toScene.sectionId);

        if (!fromEl || !toEl) continue;

        // Transition starts as fromEl ends / toEl enters, completing as toEl settles
        const st = ScrollTrigger.create({
          trigger: fromEl,
          start: "bottom-=28% bottom",
          endTrigger: toEl,
          end: "top+=28% top",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // When this transition is active (progress between 0 and 1)
            const p = self.progress;
            if (p > 0 && p < 1) {
              transitionState.fromIndex = i;
              transitionState.toIndex = i + 1;
              transitionState.progress = p;
            } else if (p >= 1 && transitionState.fromIndex === i) {
              // Settled in toScene
              transitionState.fromIndex = i + 1;
              transitionState.toIndex = i + 1;
              transitionState.progress = 0;
            } else if (p <= 0 && transitionState.toIndex === i + 1) {
              // Settled in fromScene
              transitionState.fromIndex = i;
              transitionState.toIndex = i;
              transitionState.progress = 0;
            }
          },
        });

        triggers.push(st);
      }
    };

    // Small delay to ensure all section DOM and pinned ScrollTriggers have initialized
    const initTimer = setTimeout(() => {
      setupTriggers();
      ScrollTrigger.refresh();
    }, 150);

    // Continuous render loop
    const frame = (now: number) => {
      rafId = 0;
      const dt = lastTime === null ? 0 : Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const fromScene: SceneConfig = ROBIN_SCENES[transitionState.fromIndex] || ROBIN_SCENES[0];
      const toScene: SceneConfig = ROBIN_SCENES[transitionState.toIndex] || fromScene;

      const fromX = isMobile ? fromScene.mobileX : fromScene.desktopX;
      const fromY = isMobile ? fromScene.mobileY : fromScene.desktopY;
      const toX = isMobile ? toScene.mobileX : toScene.desktopX;
      const toY = isMobile ? toScene.mobileY : toScene.desktopY;

      // Active state: user override takes precedence (e.g. voice interaction), else interpolated scene state
      const targetState =
        activeOverrideState ||
        (transitionState.progress >= 0.5 ? toScene.state : fromScene.state);

      ctx.clearRect(0, 0, vw, vh);

      engineRef.current?.render({
        ctx,
        viewportWidth: vw,
        viewportHeight: vh,
        baseOrbSize,
        fromX,
        fromY,
        fromScale: fromScene.scale,
        toX,
        toY,
        toScale: toScene.scale,
        transitionProgress: transitionState.progress,
        currentState: targetState,
        dt,
        isStatic: prefersReduced,
      });

      if (running) {
        rafId = requestAnimationFrame(frame);
      }
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      running = false;
      clearTimeout(initTimer);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeCanvas);
      triggers.forEach((t) => t.kill());
    };
  }, [prefersReduced, activeOverrideState]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-10 w-full h-full overflow-hidden select-none"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

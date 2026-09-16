"use client";

import React, { useEffect, useRef } from "react";
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
import type { OrbState } from "../robin-orb/orb-state";

const getActiveParticleCount = (vw: number): number => {
  if (vw >= 1280) return 1900;
  if (vw >= 1024) return 1600;
  if (vw >= 768) return 1250;
  return 850;
};

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

  // Mutable ref for dynamic state override (VoiceSection driving listening/thinking/speaking)
  // This completely decouples state changes from the main ScrollTrigger/canvas lifecycle
  const overrideStateRef = useRef<OrbState | null>(getRobinStateOverride());
  const redrawStaticRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return subscribeRobinStateOverride((nextState) => {
      overrideStateRef.current = nextState;
      // In reduced motion, trigger an on-demand redraw when override changes
      redrawStaticRef.current?.();
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

      // Trigger immediate redraw on resize
      renderFrame(0, prefersReduced);
    };

    const transitionState = {
      fromIndex: 0,
      toIndex: 0,
      progress: 0,
    };

    const renderFrame = (dt: number, isStatic: boolean) => {
      const fromScene: SceneConfig = ROBIN_SCENES[transitionState.fromIndex] || ROBIN_SCENES[0];
      const toScene: SceneConfig = ROBIN_SCENES[transitionState.toIndex] || fromScene;

      const fromX = isMobile ? fromScene.mobileX : fromScene.desktopX;
      const fromY = isMobile ? fromScene.mobileY : fromScene.desktopY;
      const toX = isMobile ? toScene.mobileX : toScene.desktopX;
      const toY = isMobile ? toScene.mobileY : toScene.desktopY;

      // Active state: user override takes precedence (e.g. voice interaction), else interpolated scene state
      const targetState =
        overrideStateRef.current ||
        (transitionState.progress >= 0.5 ? toScene.state : fromScene.state);

      const activeCount = getActiveParticleCount(vw);

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
        isStatic,
        activeCount,
      });
    };

    redrawStaticRef.current = () => {
      renderFrame(0, true);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize ScrollTriggers for each transition between consecutive scenes
    let triggers: ScrollTrigger[] = [];

    const setupTriggers = () => {
      triggers.forEach((t) => t.kill());
      triggers = [];

      for (let i = 0; i < ROBIN_SCENES.length - 1; i += 1) {
        const fromScene = ROBIN_SCENES[i];
        const toScene = ROBIN_SCENES[i + 1];

        const fromEl = document.getElementById(fromScene.sectionId);
        const toEl = document.getElementById(toScene.sectionId);

        if (!fromEl || !toEl) continue;

        const st = ScrollTrigger.create({
          trigger: fromEl,
          start: "bottom-=18% bottom",
          endTrigger: toEl,
          end: "top+=18% top",
          scrub: 0.25,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p > 0 && p < 1) {
              transitionState.fromIndex = i;
              transitionState.toIndex = i + 1;
              transitionState.progress = p;
            } else if (p >= 1 && transitionState.fromIndex === i) {
              transitionState.fromIndex = i + 1;
              transitionState.toIndex = i + 1;
              transitionState.progress = 0;
            } else if (p <= 0 && transitionState.toIndex === i + 1) {
              transitionState.fromIndex = i;
              transitionState.toIndex = i;
              transitionState.progress = 0;
            }

            // In reduced motion, redraw on-demand on scroll position update
            if (prefersReduced) {
              renderFrame(0, true);
            }
          },
        });

        triggers.push(st);
      }
    };

    const initTimer = setTimeout(() => {
      setupTriggers();
      ScrollTrigger.refresh();
      if (prefersReduced) {
        renderFrame(0, true);
      }
    }, 150);

    // Continuous animation loop (only for standard motion)
    const frame = (now: number) => {
      rafId = 0;
      const dt = lastTime === null ? 0 : Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      renderFrame(dt, false);

      if (running && !prefersReduced && !document.hidden) {
        rafId = requestAnimationFrame(frame);
      }
    };

    // Start RAF only if prefersReduced is false and document is visible
    if (!prefersReduced && !document.hidden) {
      rafId = requestAnimationFrame(frame);
    } else if (prefersReduced) {
      renderFrame(0, true);
    }

    // Visibility change handling: pause RAF when tab hidden, resume when visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        lastTime = null;
      } else {
        if (!prefersReduced && running && !rafId) {
          lastTime = null;
          rafId = requestAnimationFrame(frame);
        } else if (prefersReduced) {
          renderFrame(0, true);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      running = false;
      redrawStaticRef.current = null;
      clearTimeout(initTimer);
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      triggers.forEach((t) => t.kill());
    };
  }, [prefersReduced]); // Main effect only depends on prefersReduced, never on activeOverrideState!

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

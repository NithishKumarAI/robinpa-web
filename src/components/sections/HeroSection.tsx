"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { Container } from "../ui/Container";
import { RobinOrb } from "../visual/RobinOrb";
import { DownloadButton } from "../ui/DownloadButton";

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  // Smooth mouse parallax physics
  const mouseX = useSpring(0, { stiffness: 60, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 60, damping: 20 });

  // Parallax offsets derived from normalized mouse coordinates (-1 to 1)
  const textParallaxX = useTransform(mouseX, [-1, 1], [-4, 4]);
  const textParallaxY = useTransform(mouseY, [-1, 1], [-4, 4]);
  const orbParallaxX = useTransform(mouseX, [-1, 1], [-12, 12]);
  const orbParallaxY = useTransform(mouseY, [-1, 1], [-12, 12]);
  const glowParallaxX = useTransform(mouseX, [-1, 1], [-8, 8]);
  const glowParallaxY = useTransform(mouseY, [-1, 1], [-8, 8]);

  // Gentle scroll reaction: prepare elements for subsequent scroll narrative
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 320], [1, 0.35]);
  const heroTranslateY = useTransform(scrollY, [0, 320], [0, -30]);
  const heroScale = useTransform(scrollY, [0, 320], [1, 0.96]);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDesktop || prefersReduced) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const normX = (clientX / innerWidth) * 2 - 1;
    const normY = (clientY / innerHeight) * 2 - 1;
    mouseX.set(normX);
    mouseY.set(normY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Staggered entrance animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative isolate min-h-[100svh] flex flex-col justify-between pt-20 sm:pt-24 pb-6 sm:pb-8 overflow-hidden border-b border-white/[0.06]"
    >
      {/* Subtle ambient violet/indigo illumination behind orb */}
      <motion.div
        style={{
          x: prefersReduced ? 0 : glowParallaxX,
          y: prefersReduced ? 0 : glowParallaxY,
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[480px] md:w-[560px] h-[300px] sm:h-[480px] md:h-[560px] rounded-full pointer-events-none -z-10"
      >
        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.12)_0%,rgba(99,102,241,0.04)_45%,transparent_70%)] blur-2xl" />
      </motion.div>

      {/* Main Content Area */}
      <motion.div
        style={{
          opacity: heroOpacity,
          y: prefersReduced ? 0 : heroTranslateY,
          scale: prefersReduced ? 1 : heroScale,
        }}
        className="my-auto w-full"
      >
        <Container size="narrow" className="flex flex-col items-center text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center w-full"
          >
            {/* Minimal Brand Identifier */}
            <motion.div variants={itemVariants} className="mb-2.5 sm:mb-3">
              <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-white/50">
                Robin
              </span>
            </motion.div>

            {/* Core Headline: Everyone's PA. */}
            <motion.div
              variants={itemVariants}
              style={{
                x: prefersReduced ? 0 : textParallaxX,
                y: prefersReduced ? 0 : textParallaxY,
              }}
            >
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tighter text-white leading-[1.05]">
                Everyone&apos;s PA.
              </h1>
            </motion.div>

            {/* Supporting Copy */}
            <motion.div
              variants={itemVariants}
              className="mt-4 sm:mt-5 text-sm sm:text-base text-foreground-muted font-normal leading-relaxed max-w-lg space-y-0.5"
            >
              <p>Your email. Your calendar. Your tasks.</p>
              <p>Your people. Your files.</p>
              <p className="text-white/90 font-medium">One conversation.</p>
            </motion.div>

            {/* Focal Point: Robin Orb Placeholder */}
            <motion.div
              variants={itemVariants}
              style={{
                x: prefersReduced ? 0 : orbParallaxX,
                y: prefersReduced ? 0 : orbParallaxY,
              }}
              className="my-2 sm:my-3 w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] mx-auto"
            >
              <RobinOrb />
            </motion.div>

            {/* Primary & Secondary CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none"
            >
              {/* Primary CTA */}
              <DownloadButton size="default" className="w-full sm:w-auto" />

              {/* Secondary CTA */}
              <a
                href="#meet-robin"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 text-xs sm:text-sm font-medium text-white/80 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.18] transition-all duration-150 rounded"
              >
                Meet Robin
              </a>
            </motion.div>
          </motion.div>
        </Container>
      </motion.div>

      {/* Minimal Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        style={{ opacity: heroOpacity }}
        className="w-full flex flex-col items-center justify-center pt-2"
      >
        <a
          href="#meet-robin"
          className="group inline-flex flex-col items-center gap-1.5 text-[10px] font-mono tracking-widest text-foreground-subtle hover:text-foreground-muted transition-colors uppercase"
          aria-label="Scroll to Meet Robin"
        >
          <span>Scroll</span>
          <div className="w-[1px] h-5 bg-white/[0.1] relative overflow-hidden">
            <motion.div
              animate={{
                y: prefersReduced ? 0 : [0, 20, 0],
                opacity: prefersReduced ? 1 : [0.3, 1, 0.3],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-full h-2.5 bg-brand-violet/80"
            />
          </div>
        </a>
      </motion.div>
    </section>
  );
}

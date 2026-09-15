"use client";

import React from "react";
import { Container } from "../ui/Container";
import { RobinOrb } from "../visual/RobinOrb";

export function HeroSection() {
  return (
    <section className="relative min-h-[92vh] pt-36 pb-24 flex items-center border-b border-background-border/50">
      <Container className="flex flex-col items-center text-center">
        {/* Subtitle tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs font-mono text-foreground-muted bg-background-surface border border-background-border rounded-full">
          <span className="text-brand-violet font-semibold">Robin</span>
          <span className="text-foreground-subtle">•</span>
          <span>Everyone&apos;s PA for Windows</span>
        </div>

        {/* Hero headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tighter text-white max-w-4xl leading-[1.08]">
          The personal AI assistant for Windows.
        </h1>

        <p className="mt-6 text-base sm:text-lg text-foreground-muted max-w-2xl font-normal leading-relaxed">
          Deeply integrated into Windows. Context-aware, privacy-first, and always ready to act across your system.
        </p>

        {/* Replaceable 3D Orb Placeholder */}
        <div className="my-10 w-full max-w-md mx-auto">
          <RobinOrb />
        </div>

        {/* Action triggers */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#download"
            className="px-6 py-3 rounded text-sm font-medium text-black bg-white hover:bg-neutral-200 transition-colors duration-150"
          >
            Download for Windows
          </a>
          <a
            href="#meet-robin"
            className="px-6 py-3 rounded text-sm font-medium text-foreground-muted hover:text-white bg-background-surface hover:bg-background-elevated border border-background-border transition-colors duration-150"
          >
            Learn More
          </a>
        </div>
      </Container>
    </section>
  );
}

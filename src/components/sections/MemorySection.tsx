import React from "react";
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";

export function MemorySection() {
  return (
    <Section id="memory">
      <Container>
        <span className="font-mono text-xs uppercase tracking-widest text-brand-indigo">
          05 / Continuity
        </span>
        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Contextual Memory.
        </h2>
        <p className="mt-4 text-foreground-muted max-w-2xl text-base leading-relaxed">
          Episodic memory stored locally on your device. Robin remembers past conversations, ongoing projects, and your specific personal working habits without sharing data.
        </p>
      </Container>
    </Section>
  );
}

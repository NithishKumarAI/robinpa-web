import React from "react";
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";

export function VoiceSection() {
  return (
    <Section id="voice">
      <Container>
        <span className="font-mono text-xs uppercase tracking-widest text-brand-magenta">
          04 / Interaction
        </span>
        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Real-time Voice.
        </h2>
        <p className="mt-4 text-foreground-muted max-w-2xl text-base leading-relaxed">
          Sub-300ms bidirectional voice conversation with instant interruption handling. Talk to Robin naturally while multitasking across screens.
        </p>
      </Container>
    </Section>
  );
}

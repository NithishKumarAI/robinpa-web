import React from "react";
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";

export function LocalFirstSection() {
  return (
    <Section id="local-first">
      <Container>
        <span className="font-mono text-xs uppercase tracking-widest text-brand-violet">
          06 / Architecture
        </span>
        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Local First.
        </h2>
        <p className="mt-4 text-foreground-muted max-w-2xl text-base leading-relaxed">
          Built for Windows. Deep system-level integration designed with user privacy and security at its core.
        </p>
      </Container>
    </Section>
  );
}

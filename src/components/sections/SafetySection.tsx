import React from "react";
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";

export function SafetySection() {
  return (
    <Section id="safety">
      <Container>
        <span className="font-mono text-xs uppercase tracking-widest text-brand-violet">
          03 / Trust
        </span>
        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Safety & Boundaries.
        </h2>
        <p className="mt-4 text-foreground-muted max-w-2xl text-base leading-relaxed">
          Full transparency. Every action requiring elevated permissions is surfaced for explicit confirmation. Robin never modifies system settings or critical files without your approval.
        </p>
      </Container>
    </Section>
  );
}

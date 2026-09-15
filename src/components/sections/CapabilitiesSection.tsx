import React from "react";
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";

export function CapabilitiesSection() {
  return (
    <Section id="capabilities">
      <Container>
        <span className="font-mono text-xs uppercase tracking-widest text-brand-indigo">
          02 / Execution
        </span>
        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Capabilities.
        </h2>
        <p className="mt-4 text-foreground-muted max-w-2xl text-base leading-relaxed">
          From deep window automation to document synthesis and scheduled routines. Robin bridges natural language intent into deterministic Windows actions.
        </p>
      </Container>
    </Section>
  );
}

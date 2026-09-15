import React from "react";
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";

export function MeetRobinSection() {
  return (
    <Section id="meet-robin">
      <Container>
        <span className="font-mono text-xs uppercase tracking-widest text-brand-violet">
          01 / Philosophy
        </span>
        <h2 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Meet Robin.
        </h2>
        <p className="mt-4 text-foreground-muted max-w-2xl text-base leading-relaxed">
          Not another chatbot sidebar. Robin is designed from the ground up as an executive assistant that lives directly on your Windows desktop, orchestrating tasks across your applications with calm precision.
        </p>
      </Container>
    </Section>
  );
}

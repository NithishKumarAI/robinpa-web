import React from "react";
import { Container } from "../ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-background-border/50 bg-background-surface/40 py-12 text-xs text-foreground-subtle">
      <Container size="wide" className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-violet/70" />
          <span className="text-foreground-muted font-medium">Robin</span>
          <span className="font-mono text-foreground-subtle">— Everyone&apos;s PA for Windows</span>
        </div>
        <p className="text-center sm:text-right font-mono text-[11px]">
          Designed for privacy, speed, and deep local intelligence.
        </p>
      </Container>
    </footer>
  );
}

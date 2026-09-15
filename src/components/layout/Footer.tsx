import React from "react";
import Link from "next/link";
import { Container } from "../ui/Container";

export function Footer() {
  return (
    <footer className="border-t border-background-border/50 bg-background-surface/50 py-12 text-xs text-foreground-subtle">
      <Container size="wide" className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand & Tagline */}
        <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-violet/80 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
            <span className="text-foreground-muted font-medium tracking-tight">Robin</span>
          </div>
          <span className="font-mono text-foreground-subtle text-[11px]">
            &mdash; Everyone&apos;s PA. Windows personal AI assistant.
          </span>
        </div>

        {/* Real Navigation Destinations */}
        <nav aria-label="Legal and support links" className="flex items-center gap-6 text-[11px] font-mono text-foreground-subtle">
          <Link
            href="/privacy"
            className="hover:text-foreground-muted transition-colors"
          >
            Privacy
          </Link>
          <span className="text-foreground-subtle/30" aria-hidden="true">&bull;</span>
          <Link
            href="/terms"
            className="hover:text-foreground-muted transition-colors"
          >
            Terms
          </Link>
          <span className="text-foreground-subtle/30" aria-hidden="true">&bull;</span>
          <Link
            href="/support"
            className="hover:text-foreground-muted transition-colors"
          >
            Support
          </Link>
        </nav>
      </Container>
    </footer>
  );
}

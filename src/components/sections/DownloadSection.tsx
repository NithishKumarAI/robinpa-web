import React from "react";
import { Container } from "../ui/Container";
import { Section } from "../ui/Section";

export function DownloadSection() {
  return (
    <Section id="download" className="border-b-0">
      <Container className="text-center flex flex-col items-center">
        <span className="font-mono text-xs uppercase tracking-widest text-brand-violet">
          07 / Get Started
        </span>
        <h2 className="mt-3 text-3xl sm:text-5xl font-semibold tracking-tight text-white">
          Experience Robin on Windows.
        </h2>
        <p className="mt-4 text-foreground-muted max-w-xl text-base leading-relaxed">
          Native Windows 11 executable. Fast installer with zero telemetry overhead.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#installer"
            className="px-6 py-3 rounded text-sm font-medium text-black bg-white hover:bg-neutral-200 transition-colors duration-150"
          >
            Download Installer (.exe)
          </a>
          <span className="text-xs font-mono text-foreground-subtle">
            Requires Windows 11 (Build 22621+) • 64-bit
          </span>
        </div>
      </Container>
    </Section>
  );
}

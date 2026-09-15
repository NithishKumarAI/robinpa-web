"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "../ui/Container";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Meet Robin", href: "#meet-robin" },
  { label: "Capabilities", href: "#capabilities" },
  { label: "Safety", href: "#safety" },
  { label: "Voice", href: "#voice" },
  { label: "Memory", href: "#memory" },
  { label: "Local First", href: "#local-first" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/70 border-b border-white/[0.06] transition-colors">
      <Container size="wide" className="h-14 sm:h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-violet/90 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
          <span className="font-medium tracking-tight text-white/95 text-sm sm:text-base">
            Robin
          </span>
          <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded border border-white/[0.08] text-foreground-subtle font-mono uppercase tracking-wider">
            Everyone&apos;s PA
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 text-xs text-foreground-muted">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors duration-150 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action button - Visually quiet */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href="#download-placeholder"
            // TODO: Replace with official Windows installer link when released
            className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium text-white/90 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] hover:border-white/[0.2] rounded transition-all duration-150"
          >
            Download for Windows
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 text-foreground-muted hover:text-white"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </Container>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background-surface/95 backdrop-blur-xl border-b border-white/[0.08] px-6 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-xs tracking-wide text-foreground-muted hover:text-white py-1.5"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-white/[0.06]">
            <a
              href="#download-placeholder"
              // TODO: Replace with official Windows installer link when released
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex w-full items-center justify-center px-4 py-2 text-xs font-medium text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] rounded"
            >
              Download for Windows
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

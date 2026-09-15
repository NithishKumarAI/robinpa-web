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
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/85 border-b border-background-border/60">
      <Container size="wide" className="h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-violet shadow-[0_0_12px_rgba(139,92,246,0.8)]" />
          <span className="font-medium tracking-tight text-white text-base">
            Robin
          </span>
          <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded border border-background-border text-foreground-subtle font-mono uppercase tracking-wider">
            Everyone&apos;s PA
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm text-foreground-muted">
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

        {/* Action button */}
        <div className="hidden sm:flex items-center gap-4">
          <a
            href="#download"
            className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-medium text-white bg-background-elevated hover:bg-background-border border border-background-border rounded transition-colors duration-150"
          >
            Download for Windows
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-foreground-muted hover:text-white"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </Container>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background-surface border-b border-background-border px-6 py-4 space-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-foreground-muted hover:text-white py-1"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-background-border/50">
            <a
              href="#download"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex w-full items-center justify-center px-4 py-2 text-xs font-medium text-white bg-background-elevated hover:bg-background-border border border-background-border rounded"
            >
              Download for Windows
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

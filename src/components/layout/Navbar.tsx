"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "../ui/Container";
import { Menu, X } from "lucide-react";
import { DownloadButton } from "../ui/DownloadButton";

const NAV_LINKS = [
  { label: "Meet Robin", href: "#meet-robin" },
  { label: "What Robin Does", href: "#your-day" },
  { label: "Safety", href: "#control" },
  { label: "Voice", href: "#voice" },
  { label: "Download", href: "#download" },
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
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7 text-xs text-foreground-muted">
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

        {/* Action button - Centralized Download */}
        <div className="hidden sm:flex items-center gap-4">
          <DownloadButton variant="header" placement="header" />
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-1.5 text-foreground-muted hover:text-white"
          aria-label="Toggle Navigation"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-menu"
        >
          {mobileMenuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
        </button>
      </Container>

      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-nav-menu"
          aria-label="Mobile navigation"
          className="md:hidden bg-background-surface/95 backdrop-blur-xl border-b border-white/[0.08] px-6 py-4 space-y-3"
        >
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
            <DownloadButton variant="header" className="w-full justify-center" placement="header" />
          </div>
        </nav>
      )}
    </header>
  );
}

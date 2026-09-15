import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, FileText, HelpCircle } from "lucide-react";
import { Container } from "../ui/Container";
import { SITE_NAME, LAST_UPDATED } from "@/config/site";

interface LegalPageProps {
  title: string;
  subtitle?: string;
  badge?: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function LegalPage({
  title,
  subtitle,
  badge,
  lastUpdated = LAST_UPDATED,
  children,
}: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-brand-violet/20 selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-background/85 backdrop-blur-md">
        <Container size="default" className="h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="group flex items-center gap-2.5 text-xs font-mono text-foreground-muted hover:text-white transition-colors"
              aria-label="Return to Robin homepage"
            >
              <div className="w-6 h-6 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:border-white/20 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5 text-foreground-muted group-hover:text-white transition-colors" />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-violet shadow-[0_0_8px_rgba(139,92,246,0.9)]" />
                <span className="font-semibold text-white tracking-tight text-sm">{SITE_NAME}</span>
              </div>
              <span className="text-foreground-subtle hidden sm:inline">&bull; Home</span>
            </Link>
          </div>

          {/* Quick Page Jump Links */}
          <nav className="flex items-center gap-4 sm:gap-6 text-xs font-mono text-foreground-subtle" aria-label="Legal and support navigation">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 opacity-70" />
              <span className="hidden sm:inline">Privacy</span>
            </Link>
            <Link
              href="/terms"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 opacity-70" />
              <span className="hidden sm:inline">Terms</span>
            </Link>
            <Link
              href="/support"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 opacity-70" />
              <span>Support</span>
            </Link>
          </nav>
        </Container>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-12 sm:py-16">
        <Container size="narrow" className="max-w-3xl">
          {/* Header Block */}
          <div className="mb-12 border-b border-white/[0.08] pb-8">
            {badge && (
              <span className="inline-block px-2.5 py-1 rounded bg-brand-violet/10 border border-brand-violet/20 text-brand-violet font-mono text-[11px] uppercase tracking-wider mb-3">
                {badge}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-3">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm sm:text-base text-foreground-muted leading-relaxed max-w-2xl">
                {subtitle}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-foreground-subtle">
              <span>Last updated: {lastUpdated}</span>
              <span>&bull;</span>
              <span>Applies to Robin V1 (Windows)</span>
            </div>
          </div>

          {/* Document Content */}
          <div className="legal-content text-foreground-muted text-sm sm:text-[15px] leading-relaxed space-y-8">
            {children}
          </div>
        </Container>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-white/[0.06] bg-background-surface/30 py-8 text-xs text-foreground-subtle">
        <Container size="narrow" className="max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-violet/80" />
            <span className="text-foreground-muted font-medium">{SITE_NAME}</span>
            <span className="text-foreground-subtle">&mdash; Everyone&apos;s PA</span>
          </div>

          <div className="flex items-center gap-5 font-mono text-[11px]">
            <Link href="/" className="hover:text-foreground-muted transition-colors">
              Home
            </Link>
            <span>&bull;</span>
            <Link href="/privacy" className="hover:text-foreground-muted transition-colors">
              Privacy
            </Link>
            <span>&bull;</span>
            <Link href="/terms" className="hover:text-foreground-muted transition-colors">
              Terms
            </Link>
            <span>&bull;</span>
            <Link href="/support" className="hover:text-foreground-muted transition-colors">
              Support
            </Link>
          </div>
        </Container>
      </footer>
    </div>
  );
}

import React from "react";
import { UserCheck, ShieldCheck } from "lucide-react";

interface PersonCardProps {
  className?: string;
}

export function PersonCard({ className = "" }: PersonCardProps) {
  return (
    <div
      className={`w-full max-w-sm p-4 sm:p-5 rounded-xl bg-background-surface/90 border border-white/[0.09] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-violet/10 border border-brand-violet/20 text-brand-violet text-[11px] font-mono">
          <ShieldCheck size={12} />
          <span>Confirmed Identity</span>
        </div>
        <span className="text-[10px] font-mono text-foreground-subtle">
          Local People System
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-background-elevated border border-white/[0.1] flex items-center justify-center text-xs font-semibold text-white">
          CT
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-white tracking-tight">
              Contact
            </h4>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/[0.06] text-foreground-subtle font-mono">
              Saved Contact
            </span>
          </div>
          <p className="text-xs text-foreground-muted font-mono truncate mt-0.5">
            contact@example.com
          </p>
        </div>
        <UserCheck size={16} className="text-brand-violet shrink-0" />
      </div>

      <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-foreground-subtle">
        <span>Identity confirmed</span>
        <span className="font-mono text-[10px] text-brand-indigo/90">
          Ready for draft
        </span>
      </div>
    </div>
  );
}

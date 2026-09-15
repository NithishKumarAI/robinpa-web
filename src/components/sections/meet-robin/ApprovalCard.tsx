import React from "react";
import { Mail, Check, X, Lock } from "lucide-react";

interface ApprovalCardProps {
  className?: string;
}

export function ApprovalCard({ className = "" }: ApprovalCardProps) {
  return (
    <div
      className={`w-full max-w-sm sm:max-w-md p-5 sm:p-6 rounded-xl bg-background-surface/95 border border-white/[0.1] shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-md ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
        <div className="flex items-center gap-2">
          <Mail size={14} className="text-brand-violet" />
          <span className="text-xs font-medium text-white tracking-tight">
            Send email
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-foreground-subtle">
          <Lock size={10} className="text-brand-violet" />
          <span>Review required</span>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-2 text-xs">
        <div className="flex items-baseline gap-2 py-1">
          <span className="text-foreground-subtle font-mono w-14 shrink-0">
            To:
          </span>
          <span className="text-white font-medium">Vicky</span>
          <span className="text-foreground-subtle font-mono text-[11px]">
            &lt;vicky@example.com&gt;
          </span>
        </div>

        <div className="flex items-baseline gap-2 py-1 border-t border-white/[0.04]">
          <span className="text-foreground-subtle font-mono w-14 shrink-0">
            Subject:
          </span>
          <span className="text-white">Frontend status</span>
        </div>

        {/* Message body preview */}
        <div className="mt-3 p-3 rounded-lg bg-background-elevated/70 border border-white/[0.05] text-white/90 leading-relaxed font-sans text-xs sm:text-sm">
          Hi Vicky, is the frontend ready for review?
        </div>
      </div>

      {/* Interactive review buttons (visual demonstration only) */}
      <div className="mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-3">
        <span className="text-[10px] font-mono text-foreground-subtle">
          Waiting for your confirmation
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1.5 rounded text-xs text-foreground-muted hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-colors inline-flex items-center gap-1 cursor-default"
            aria-label="Cancel action (demonstration only)"
          >
            <X size={12} />
            <span>Cancel</span>
          </button>
          <button
            type="button"
            className="px-3.5 py-1.5 rounded text-xs font-medium text-black bg-white hover:bg-neutral-200 transition-colors inline-flex items-center gap-1.5 cursor-default shadow-sm"
            aria-label="Approve action (demonstration only)"
          >
            <Check size={12} />
            <span>Approve</span>
          </button>
        </div>
      </div>
    </div>
  );
}

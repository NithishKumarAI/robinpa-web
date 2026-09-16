import React from "react";
import { Mail, Check, X, ShieldAlert } from "lucide-react";

interface SafetyReviewCardProps {
  className?: string;
  isApproved?: boolean;
}

export const SafetyReviewCard = React.forwardRef<HTMLDivElement, SafetyReviewCardProps>(
  ({ className = "", isApproved = false }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full max-w-sm sm:max-w-md p-4 sm:p-5 rounded-xl bg-background-surface/95 border ${
          isApproved ? "border-brand-violet/50 shadow-[0_0_25px_rgba(139,92,246,0.15)]" : "border-white/[0.1]"
        } shadow-[0_12px_40px_rgba(0,0,0,0.6)] backdrop-blur-md transition-colors duration-300 ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06] mb-3">
          <div className="flex items-center gap-2">
            <Mail size={13} className="text-brand-violet" />
            <span className="text-xs font-medium text-white tracking-tight">
              Send email
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {isApproved ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-violet/15 border border-brand-violet/30 text-[10px] font-mono text-brand-violet font-semibold">
                <Check size={10} />
                APPROVED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-[10px] font-mono text-foreground-muted">
                <ShieldAlert size={10} className="text-brand-violet" />
                WAITING FOR APPROVAL
              </span>
            )}
          </div>
        </div>

        {/* Action Details */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-baseline gap-2 py-0.5">
            <span className="text-foreground-subtle font-mono w-14 shrink-0">
              To:
            </span>
            <span className="text-white font-medium">Recipient</span>
          </div>

          <div className="flex items-baseline gap-2 py-0.5 border-t border-white/[0.04]">
            <span className="text-foreground-subtle font-mono w-14 shrink-0">
              Subject:
            </span>
            <span className="text-white">Review ready</span>
          </div>

          {/* Body */}
          <div className="mt-2.5 p-2.5 rounded-lg bg-background-elevated/70 border border-white/[0.05] text-white/90 text-xs sm:text-sm font-sans leading-relaxed">
            The review is ready for your confirmation.
          </div>
        </div>

        {/* Footer / Status */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-3">
          <span className="text-[10px] font-mono text-foreground-subtle">
            {isApproved ? (
              <span className="text-brand-violet font-medium">
                Approved by you &bull; Ready to execute
              </span>
            ) : (
              "Changing something requires your approval."
            )}
          </span>

          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-1 rounded text-xs text-foreground-muted bg-white/[0.04] border border-white/[0.08] cursor-default select-none pointer-events-none inline-flex items-center gap-1"
              role="presentation"
              aria-hidden="true"
            >
              <X size={11} />
              <span>Cancel</span>
            </span>
            <span
              className={`px-3 py-1 rounded text-xs font-medium transition-all duration-200 cursor-default select-none pointer-events-none inline-flex items-center gap-1 ${
                isApproved
                  ? "bg-brand-violet text-white shadow-[0_0_12px_rgba(139,92,246,0.6)]"
                  : "bg-white text-black"
              }`}
              role="presentation"
              aria-hidden="true"
            >
              <Check size={11} />
              <span>{isApproved ? "Approved" : "Approve"}</span>
            </span>
          </div>
        </div>
      </div>
    );
  }
);

SafetyReviewCard.displayName = "SafetyReviewCard";

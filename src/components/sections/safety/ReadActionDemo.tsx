import React from "react";
import { Calendar, ArrowRight } from "lucide-react";

export const ReadActionDemo = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className = "" }, ref) => (
    <div
      ref={ref}
      className={`w-full max-w-sm sm:max-w-md p-4 sm:p-5 rounded-xl bg-background-surface/95 border border-white/[0.09] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md ${className}`}
    >
      <div className="flex items-center justify-between text-[11px] font-mono text-foreground-subtle pb-2.5 border-b border-white/[0.06] mb-3">
        <span className="flex items-center gap-1.5 text-white/90">
          <Calendar size={13} className="text-brand-indigo" />
          <span>Read Action</span>
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-foreground-muted">
          No approval needed
        </span>
      </div>

      <div className="space-y-2.5">
        <div className="p-2.5 rounded-lg bg-background-elevated/70 border border-white/[0.06] text-xs sm:text-sm text-white font-medium">
          &ldquo;What do I have tomorrow?&rdquo;
        </div>

        {/* Visual Route */}
        <div className="flex items-center justify-center gap-2 py-1 text-[10px] font-mono text-foreground-subtle">
          <span>You</span>
          <ArrowRight size={10} className="text-foreground-subtle/50" />
          <span className="text-brand-violet">Robin</span>
          <ArrowRight size={10} className="text-foreground-subtle/50" />
          <span className="text-brand-indigo">Calendar</span>
        </div>

        {/* Result */}
        <div className="p-2.5 rounded-lg bg-brand-indigo/10 border border-brand-indigo/20 flex items-center justify-between">
          <span className="text-xs text-white/90">3 events scheduled tomorrow</span>
          <span className="text-[10px] font-mono text-brand-indigo">Read Complete</span>
        </div>
      </div>
      <p className="mt-2.5 text-[11px] text-foreground-muted text-center">
        Reading information doesn&apos;t need unnecessary friction.
      </p>
    </div>
  )
);
ReadActionDemo.displayName = "ReadActionDemo";

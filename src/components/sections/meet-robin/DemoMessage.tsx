import React from "react";
import { MessageSquare, Sparkles } from "lucide-react";

interface DemoMessageProps {
  className?: string;
}

export function DemoMessage({ className = "" }: DemoMessageProps) {
  return (
    <div
      className={`w-full max-w-sm sm:max-w-md p-4 sm:p-5 rounded-xl bg-background-surface/90 border border-white/[0.09] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={13} className="text-brand-violet" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-foreground-subtle">
            Dialogue demonstration
          </span>
        </div>
        <span className="text-[10px] font-mono text-foreground-subtle/80">
          Desktop voice / text
        </span>
      </div>
      <div className="space-y-2.5">
        <div className="flex items-start gap-2.5">
          <span className="text-xs font-mono text-brand-violet uppercase tracking-wider mt-0.5 shrink-0">
            User:
          </span>
          <p className="text-sm sm:text-base text-white/95 font-medium leading-snug">
            &ldquo;Robin.&rdquo;
          </p>
        </div>
        <div className="flex items-start gap-2.5 pl-3 border-l border-brand-violet/30">
          <span className="text-xs font-mono text-brand-indigo uppercase tracking-wider mt-0.5 shrink-0 flex items-center gap-1">
            <Sparkles size={11} /> Robin:
          </span>
          <p className="text-sm sm:text-base text-brand-violet font-medium leading-snug">
            &ldquo;Yes, sir.&rdquo;
          </p>
        </div>
        <div className="flex items-start gap-2.5">
          <span className="text-xs font-mono text-brand-violet uppercase tracking-wider mt-0.5 shrink-0">
            User:
          </span>
          <p className="text-sm sm:text-base text-white/95 font-medium leading-snug">
            &ldquo;What&apos;s on my schedule today?&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}

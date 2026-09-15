import React from "react";
import { MessageSquare } from "lucide-react";

interface DemoMessageProps {
  className?: string;
}

export function DemoMessage({ className = "" }: DemoMessageProps) {
  return (
    <div
      className={`w-full max-w-sm sm:max-w-md p-4 sm:p-5 rounded-xl bg-background-surface/90 border border-white/[0.09] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2">
          <MessageSquare size={13} className="text-brand-violet" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-foreground-subtle">
            You to Robin
          </span>
        </div>
        <span className="text-[10px] font-mono text-foreground-subtle/80">
          Desktop voice / text
        </span>
      </div>
      <p className="text-sm sm:text-base text-white/95 font-medium leading-snug">
        &ldquo;Email Vicky and ask if the frontend is ready.&rdquo;
      </p>
    </div>
  );
}

import React from "react";
import { Bookmark, Sparkles, MessageSquare } from "lucide-react";

interface RecallConversationProps {
  mode: "input" | "recall" | "summary";
  className?: string;
}

export const RecallConversation = React.forwardRef<HTMLDivElement, RecallConversationProps>(
  ({ mode, className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full max-w-sm sm:max-w-md p-4 sm:p-5 rounded-xl bg-background-surface/95 border border-white/[0.09] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 ${className}`}
      >
        {/* Mode: Initial Input */}
        {mode === "input" && (
          <div className="space-y-2.5 text-left">
            <div className="flex items-center justify-between text-[11px] font-mono text-foreground-subtle pb-2 border-b border-white/[0.06]">
              <span className="flex items-center gap-1 text-brand-indigo">
                <MessageSquare size={12} />
                <span>Conversation</span>
              </span>
              <span>Earlier interaction</span>
            </div>
            <div className="p-2.5 rounded-lg bg-background-elevated/70 border border-white/[0.06] text-xs sm:text-sm text-white font-medium">
              &ldquo;Keep my project updates concise.&rdquo;
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-brand-violet pt-1">
              <Bookmark size={11} />
              <span>Retained preference: Concise project updates</span>
            </div>
          </div>
        )}

        {/* Mode: Context Recall */}
        {mode === "recall" && (
          <div className="space-y-2.5 text-left">
            <div className="flex items-center justify-between text-[11px] font-mono text-foreground-subtle pb-2 border-b border-white/[0.06]">
              <span className="flex items-center gap-1 text-brand-violet">
                <Sparkles size={12} />
                <span>Later Conversation</span>
              </span>
              <span className="text-brand-violet font-medium">Recalling Context</span>
            </div>

            {/* Prompt */}
            <div className="p-2.5 rounded-lg bg-background-elevated/60 border border-white/[0.05] text-xs sm:text-sm text-white/90">
              &ldquo;Give me an update on the project.&rdquo;
            </div>

            {/* Injected contextual preference badge */}
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-brand-violet/10 border border-brand-violet/25 text-[11px] font-mono text-white/90">
              <Bookmark size={11} className="text-brand-violet shrink-0" />
              <span>Using remembered preference: Concise updates</span>
            </div>

            {/* Response */}
            <div className="p-2.5 rounded-lg bg-background-elevated/80 border border-white/[0.06] text-xs sm:text-sm text-white font-medium">
              &ldquo;Here&apos;s the short version&hellip;&rdquo;
            </div>
          </div>
        )}

        {/* Mode: Summary */}
        {mode === "summary" && (
          <div className="space-y-2 text-left text-xs">
            <div className="flex items-center justify-between text-[11px] font-mono text-foreground-subtle pb-1.5 border-b border-white/[0.06]">
              <span>Context Continuity</span>
              <span className="text-brand-violet">Retained on-device</span>
            </div>
            <p className="text-white/90 leading-relaxed pt-1">
              Robin used your previous instructions instead of starting from zero.
            </p>
          </div>
        )}
      </div>
    );
  }
);

RecallConversation.displayName = "RecallConversation";

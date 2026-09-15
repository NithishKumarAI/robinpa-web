import React from "react";
import { VoiceState } from "./VoiceVisualizer";

interface TranscriptCardProps {
  state: VoiceState;
  className?: string;
}

export const TranscriptCard = React.forwardRef<HTMLDivElement, TranscriptCardProps>(
  ({ state, className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`w-full max-w-sm sm:max-w-md p-4 sm:p-5 rounded-xl bg-background-surface/90 border border-white/[0.09] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md transition-all duration-300 ${className}`}
      >
        {/* Moment 2: Listening state */}
        {state === "listening" && (
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between text-[11px] font-mono text-foreground-subtle">
              <span className="text-brand-indigo">User speech</span>
              <span className="animate-pulse">Transcribing...</span>
            </div>
            <p className="text-base sm:text-lg text-white font-medium tracking-tight">
              &ldquo;What do I have tomorrow?&rdquo;
            </p>
          </div>
        )}

        {/* Moment 3: Thinking state */}
        {state === "thinking" && (
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between text-[11px] font-mono text-foreground-subtle">
              <span className="text-brand-violet">Context resolution</span>
              <span>Calendar</span>
            </div>
            <p className="text-base sm:text-lg text-white font-medium tracking-tight">
              &ldquo;What do I have tomorrow?&rdquo;
            </p>
            <p className="text-xs font-mono text-brand-violet/90 pt-1">
              Understanding your request&hellip;
            </p>
          </div>
        )}

        {/* Moment 4: Speaking state */}
        {state === "speaking" && (
          <div className="space-y-2 text-left">
            <div className="flex items-center justify-between text-[11px] font-mono text-foreground-subtle">
              <span className="text-brand-magenta">Robin Voice</span>
              <span className="animate-pulse">Audio streaming</span>
            </div>
            <p className="text-base sm:text-lg text-white font-medium tracking-tight leading-relaxed">
              &ldquo;You have three events tomorrow. Your first one starts at 10 AM.&rdquo;
            </p>
          </div>
        )}

        {/* Moment 5 or Idle: Complete flow summary */}
        {(state === "conversation" || state === "idle") && (
          <div className="space-y-2.5 text-left text-xs">
            <div className="p-2 rounded bg-background-elevated/60 border border-white/[0.05]">
              <span className="text-foreground-subtle font-mono text-[10px] block mb-0.5">You</span>
              <span className="text-white/90">&ldquo;What do I have tomorrow?&rdquo;</span>
            </div>
            <div className="p-2 rounded bg-brand-violet/10 border border-brand-violet/20">
              <span className="text-brand-violet font-mono text-[10px] block mb-0.5">Robin</span>
              <span className="text-white font-medium">
                &ldquo;You have three events tomorrow. Your first one starts at 10 AM.&rdquo;
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

TranscriptCard.displayName = "TranscriptCard";

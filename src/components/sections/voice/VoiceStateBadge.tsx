import React from "react";
import { Mic, Sparkles, Volume2 } from "lucide-react";
import { VoiceState } from "./VoiceVisualizer";

interface VoiceStateBadgeProps {
  state: VoiceState;
  className?: string;
}

export const VoiceStateBadge = React.forwardRef<HTMLDivElement, VoiceStateBadgeProps>(
  ({ state, className = "" }, ref) => {
    if (state === "idle") {
      return (
        <div
          ref={ref}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-foreground-subtle text-xs font-mono tracking-wider uppercase ${className}`}
        >
          <Mic size={12} className="text-white/60" />
          <span>Voice System</span>
        </div>
      );
    }

    if (state === "conversation") {
      return (
        <div
          ref={ref}
          className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-background-surface/90 border border-white/[0.09] shadow-md text-xs font-mono tracking-wider ${className}`}
        >
          <span className="text-brand-indigo">LISTENING</span>
          <span className="text-foreground-subtle/50">&rarr;</span>
          <span className="text-brand-violet">THINKING</span>
          <span className="text-foreground-subtle/50">&rarr;</span>
          <span className="text-brand-magenta">SPEAKING</span>
        </div>
      );
    }

    const stateConfig = {
      listening: {
        label: "LISTENING",
        icon: Mic,
        color: "text-brand-indigo",
        border: "border-brand-indigo/30",
        bg: "bg-brand-indigo/10",
        dot: "bg-brand-indigo animate-pulse",
      },
      thinking: {
        label: "THINKING",
        icon: Sparkles,
        color: "text-brand-violet",
        border: "border-brand-violet/30",
        bg: "bg-brand-violet/10",
        dot: "bg-brand-violet animate-ping",
      },
      speaking: {
        label: "SPEAKING",
        icon: Volume2,
        color: "text-brand-magenta",
        border: "border-brand-magenta/30",
        bg: "bg-brand-magenta/10",
        dot: "bg-brand-magenta animate-pulse",
      },
    }[state];

    const Icon = stateConfig.icon;

    return (
      <div
        ref={ref}
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${stateConfig.bg} ${stateConfig.border} border shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-all duration-300 ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${stateConfig.dot}`} />
        <Icon size={12} className={stateConfig.color} />
        <span className={`text-[11px] font-mono tracking-widest font-semibold ${stateConfig.color}`}>
          {stateConfig.label}
        </span>
      </div>
    );
  }
);

VoiceStateBadge.displayName = "VoiceStateBadge";

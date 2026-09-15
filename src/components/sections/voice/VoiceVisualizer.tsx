import React from "react";

export type VoiceState = "idle" | "listening" | "thinking" | "speaking" | "conversation";

interface VoiceVisualizerProps {
  state: VoiceState;
  className?: string;
}

/**
 * Lightweight SVG circular acoustic visualization around RobinOrb.
 * Accents Robin's real particle orb without obscuring or intersecting its outer shell.
 * - Listening: Inward converging pulses with indigo/violet accents.
 * - Thinking: Concentrated high-frequency harmonic orbit.
 * - Speaking: Outward expanding soundwave ripples.
 */
export const VoiceVisualizer = React.forwardRef<HTMLDivElement, VoiceVisualizerProps>(
  ({ state, className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none ${className}`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full max-w-[340px] sm:max-w-[420px] md:max-w-[460px] aspect-square overflow-visible"
        >
          <defs>
            <linearGradient id="voiceGradientViolet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.12" />
            </linearGradient>
            <linearGradient id="voiceGradientSpeaking" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D946EF" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.08" />
            </linearGradient>
          </defs>

          {/* Base Ambient Circular Guide (framed cleanly outside orb) */}
          <circle
            cx="200"
            cy="200"
            r="142"
            fill="none"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth="1"
          />

          {/* Wave 1: Primary acoustic ring */}
          <circle
            cx="200"
            cy="200"
            r={state === "thinking" ? 138 : state === "listening" ? 146 : state === "speaking" ? 154 : 142}
            fill="none"
            stroke="url(#voiceGradientViolet)"
            strokeWidth={state === "speaking" ? 1.5 : 1}
            strokeDasharray={state === "thinking" ? "4 8" : state === "listening" ? "6 6" : "none"}
            className={`transition-all duration-700 ease-out origin-center ${
              state === "thinking"
                ? "animate-[spin_4s_linear_infinite]"
                : state === "listening"
                ? "animate-pulse"
                : ""
            }`}
          />

          {/* Wave 2: Outer harmonic ring */}
          <circle
            cx="200"
            cy="200"
            r={state === "thinking" ? 156 : state === "listening" ? 166 : state === "speaking" ? 176 : 158}
            fill="none"
            stroke={state === "speaking" ? "url(#voiceGradientSpeaking)" : "rgba(139, 92, 246, 0.22)"}
            strokeWidth={state === "speaking" ? 1.5 : 1}
            strokeDasharray={state === "thinking" ? "8 12" : "none"}
            className={`transition-all duration-700 ease-out origin-center ${
              state === "thinking"
                ? "animate-[spin_6s_linear_infinite_reverse]"
                : ""
            }`}
          />

          {/* Wave 3: Subtle receptive boundary */}
          {(state === "listening" || state === "speaking" || state === "conversation") && (
            <circle
              cx="200"
              cy="200"
              r={state === "speaking" ? 192 : 180}
              fill="none"
              stroke={state === "speaking" ? "rgba(217, 70, 239, 0.2)" : "rgba(99, 102, 241, 0.15)"}
              strokeWidth="1"
              strokeDasharray={state === "listening" ? "2 6" : "none"}
              className="transition-all duration-700 ease-out"
            />
          )}
        </svg>
      </div>
    );
  }
);

VoiceVisualizer.displayName = "VoiceVisualizer";

import React from "react";

export type VoiceState = "idle" | "listening" | "thinking" | "speaking" | "conversation";

interface VoiceVisualizerProps {
  state: VoiceState;
  className?: string;
}

/**
 * Lightweight SVG circular acoustic visualization around RobinOrb.
 * Uses SVG circles with CSS animations tailored to each state:
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
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="voiceGradientSpeaking" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D946EF" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Base Ambient Circular Guide */}
          <circle
            cx="200"
            cy="200"
            r="120"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />

          {/* Wave 1: Inner ring */}
          <circle
            cx="200"
            cy="200"
            r={state === "thinking" ? 110 : state === "listening" ? 125 : state === "speaking" ? 140 : 115}
            fill="none"
            stroke="url(#voiceGradientViolet)"
            strokeWidth={state === "speaking" ? 2 : 1.5}
            strokeDasharray={state === "thinking" ? "4 8" : state === "listening" ? "6 6" : "none"}
            className={`transition-all duration-700 ease-out origin-center ${
              state === "thinking"
                ? "animate-[spin_4s_linear_infinite]"
                : state === "listening"
                ? "animate-pulse"
                : ""
            }`}
          />

          {/* Wave 2: Middle ring */}
          <circle
            cx="200"
            cy="200"
            r={state === "thinking" ? 125 : state === "listening" ? 145 : state === "speaking" ? 165 : 135}
            fill="none"
            stroke={state === "speaking" ? "url(#voiceGradientSpeaking)" : "rgba(139, 92, 246, 0.35)"}
            strokeWidth={state === "speaking" ? 1.75 : 1}
            strokeDasharray={state === "thinking" ? "8 12" : "none"}
            className={`transition-all duration-700 ease-out origin-center ${
              state === "thinking"
                ? "animate-[spin_6s_linear_infinite_reverse]"
                : ""
            }`}
          />

          {/* Wave 3: Outer expanding / receptive boundary */}
          {(state === "listening" || state === "speaking" || state === "conversation") && (
            <circle
              cx="200"
              cy="200"
              r={state === "speaking" ? 190 : 165}
              fill="none"
              stroke={state === "speaking" ? "rgba(217, 70, 239, 0.3)" : "rgba(99, 102, 241, 0.25)"}
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

import React from "react";

interface RuntimeBoundaryProps {
  activeRoute: "local" | "cloud" | "both" | "idle";
  className?: string;
}

export const RuntimeBoundary = React.forwardRef<HTMLDivElement, RuntimeBoundaryProps>(
  ({ activeRoute, className = "" }, ref) => {
    return (
      <div
        ref={ref}
        className={`absolute inset-0 flex items-center justify-center pointer-events-none select-none ${className}`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 500 360"
          className="w-full h-full max-w-[480px] sm:max-w-[620px] aspect-[5/3.6] overflow-visible"
        >
          <defs>
            <linearGradient id="localPathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="cloudPathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#D946EF" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Local Windows PC Boundary (Rounded rect enclosing Robin Core) */}
          <rect
            x="130"
            y="70"
            width="240"
            height="220"
            rx="24"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />

          {/* Local PC Label */}
          <text
            x="145"
            y="94"
            fill="rgba(255, 255, 255, 0.4)"
            fontSize="10"
            fontFamily="monospace"
            letterSpacing="1"
          >
            WINDOWS PC RUNTIME
          </text>

          {/* Path 1: Local AI (stays close to center) */}
          <path
            d="M 250 180 Q 200 230 170 230"
            fill="none"
            stroke={
              activeRoute === "local" || activeRoute === "both"
                ? "url(#localPathGrad)"
                : "rgba(255, 255, 255, 0.05)"
            }
            strokeWidth={activeRoute === "local" || activeRoute === "both" ? 2 : 1}
            className="transition-all duration-500"
          />

          {/* Path 2: Cloud AI (extends outward past the PC boundary) */}
          <path
            d="M 250 180 Q 330 130 420 120"
            fill="none"
            stroke={
              activeRoute === "cloud" || activeRoute === "both"
                ? "url(#cloudPathGrad)"
                : "rgba(255, 255, 255, 0.05)"
            }
            strokeWidth={activeRoute === "cloud" || activeRoute === "both" ? 2 : 1}
            className="transition-all duration-500"
          />
        </svg>
      </div>
    );
  }
);

RuntimeBoundary.displayName = "RuntimeBoundary";

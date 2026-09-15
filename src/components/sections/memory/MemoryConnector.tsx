import React from "react";

interface MemoryConnectorProps {
  isRecalled?: boolean;
  className?: string;
}

export const MemoryConnector = React.forwardRef<SVGSVGElement, MemoryConnectorProps>(
  ({ isRecalled = false, className = "" }, ref) => {
    return (
      <svg
        ref={ref}
        viewBox="0 0 400 300"
        className={`absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500 ${className}`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="memoryLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Path from top-left fragment to center */}
        <path
          d="M 120 70 Q 180 110 200 150"
          fill="none"
          stroke={isRecalled ? "url(#memoryLineGrad)" : "rgba(255, 255, 255, 0.08)"}
          strokeWidth={isRecalled ? 2 : 1}
          strokeDasharray={isRecalled ? "none" : "4 6"}
          className="transition-all duration-500"
        />

        {/* Path from right fragment to center */}
        <path
          d="M 290 85 Q 240 120 200 150"
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />

        {/* Path from bottom fragment to center */}
        <path
          d="M 140 230 Q 175 190 200 150"
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
      </svg>
    );
  }
);

MemoryConnector.displayName = "MemoryConnector";

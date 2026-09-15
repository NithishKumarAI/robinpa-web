import React from "react";
import { Cpu, Cloud, Check } from "lucide-react";

export type ActiveRoute = "local" | "cloud" | "both" | "idle";

interface ModelRouteCardProps {
  activeRoute: ActiveRoute;
  className?: string;
}

export const ModelRouteCard = React.forwardRef<HTMLDivElement, ModelRouteCardProps>(
  ({ activeRoute, className = "" }, ref) => {
    const isLocalActive = activeRoute === "local" || activeRoute === "both";
    const isCloudActive = activeRoute === "cloud" || activeRoute === "both";

    return (
      <div
        ref={ref}
        className={`w-full max-w-sm sm:max-w-lg p-3 sm:p-4 rounded-xl bg-background-surface/90 border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md flex flex-col sm:flex-row items-center gap-3 transition-all duration-300 ${className}`}
      >
        {/* Route 1: Local AI (Ollama) */}
        <div
          className={`flex-1 w-full p-3 rounded-lg border transition-all duration-300 ${
            isLocalActive
              ? "bg-brand-violet/10 border-brand-violet/50 shadow-[0_0_15px_rgba(139,92,246,0.2)]"
              : "bg-white/[0.02] border-white/[0.06] opacity-40"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Cpu size={14} className={isLocalActive ? "text-brand-violet" : "text-white/60"} />
              <span className="text-xs font-semibold text-white tracking-tight">
                Local AI
              </span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-foreground-subtle">
              On-device
            </span>
          </div>
          <p className="text-xs text-white/90 font-medium">Ollama</p>
          <p className="text-[11px] text-foreground-muted mt-0.5 leading-snug">
            Run a supported model directly on your Windows PC.
          </p>
        </div>

        {/* Divider / Junction */}
        <div className="hidden sm:flex flex-col items-center justify-center text-foreground-subtle/50 text-xs font-mono select-none px-1">
          <span>or</span>
        </div>

        {/* Route 2: Cloud AI (Gemini) */}
        <div
          className={`flex-1 w-full p-3 rounded-lg border transition-all duration-300 ${
            isCloudActive
              ? "bg-brand-indigo/10 border-brand-indigo/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]"
              : "bg-white/[0.02] border-white/[0.06] opacity-40"
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Cloud size={14} className={isCloudActive ? "text-brand-indigo" : "text-white/60"} />
              <span className="text-xs font-semibold text-white tracking-tight">
                Cloud AI
              </span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.06] text-foreground-subtle">
              Connected
            </span>
          </div>
          <p className="text-xs text-white/90 font-medium">Gemini</p>
          <p className="text-[11px] text-foreground-muted mt-0.5 leading-snug">
            Connect a cloud model when you prefer its capabilities.
          </p>
        </div>
      </div>
    );
  }
);

ModelRouteCard.displayName = "ModelRouteCard";

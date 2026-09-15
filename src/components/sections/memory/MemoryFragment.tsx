import React from "react";
import { Sparkles, Bookmark, Folder, UserCheck } from "lucide-react";

export type FragmentType = "preference" | "project" | "person";

interface MemoryFragmentProps {
  type: FragmentType;
  label: string;
  value: string;
  isRecalled?: boolean;
  className?: string;
  nodeRef?: React.RefObject<HTMLDivElement>;
}

export function MemoryFragment({
  type,
  label,
  value,
  isRecalled = false,
  className = "",
  nodeRef,
}: MemoryFragmentProps) {
  const iconMap = {
    preference: Bookmark,
    project: Folder,
    person: UserCheck,
  };

  const Icon = iconMap[type];

  return (
    <div
      ref={nodeRef}
      className={`relative inline-flex items-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-background-surface/90 border ${
        isRecalled
          ? "border-brand-violet/70 shadow-[0_0_20px_rgba(139,92,246,0.35)] scale-105 bg-background-surface/95"
          : "border-white/[0.08] shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
      } backdrop-blur-md transition-all duration-300 pointer-events-none select-none ${className}`}
    >
      <div
        className={`w-5 h-5 sm:w-6 sm:h-6 rounded-md flex items-center justify-center ${
          isRecalled ? "bg-brand-violet/20 text-brand-violet" : "bg-white/[0.04] text-white/70"
        }`}
      >
        <Icon size={12} />
      </div>

      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-foreground-subtle">
            {label}
          </span>
          {isRecalled && (
            <span className="inline-flex items-center gap-0.5 text-[9px] font-mono text-brand-violet">
              <Sparkles size={8} />
              <span>Recalled</span>
            </span>
          )}
        </div>
        <span
          className={`text-xs sm:text-sm font-medium tracking-tight ${
            isRecalled ? "text-white font-semibold" : "text-white/90"
          }`}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

import React from "react";
import { LucideIcon } from "lucide-react";

interface CapabilityNodeProps {
  id: string;
  label: string;
  sublabel?: string;
  icon: LucideIcon;
  className?: string;
  nodeRef?: React.RefObject<HTMLDivElement>;
}

export function CapabilityNode({
  label,
  sublabel,
  icon: Icon,
  className = "",
  nodeRef,
}: CapabilityNodeProps) {
  return (
    <div
      ref={nodeRef}
      className={`group relative inline-flex items-center gap-2.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-background-surface/85 border border-white/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md transition-colors duration-300 pointer-events-none select-none ${className}`}
    >
      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-md bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/80 shrink-0">
        <Icon size={14} className="transition-colors group-[.is-active]:text-brand-violet" />
      </div>
      <div className="flex flex-col text-left">
        <span className="text-xs sm:text-sm font-medium text-white/90 tracking-tight leading-none">
          {label}
        </span>
        {sublabel && (
          <span className="text-[10px] font-mono text-foreground-subtle mt-0.5 leading-none">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}

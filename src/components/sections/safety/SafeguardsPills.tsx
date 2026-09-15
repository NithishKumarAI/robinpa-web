import React from "react";
import { CheckCircle2, FolderKey, ShieldCheck } from "lucide-react";

export const SafeguardsPills = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className = "" }, ref) => {
    const safeguards = [
      {
        title: "Approval",
        desc: "Actions that change something are reviewed.",
        icon: CheckCircle2,
      },
      {
        title: "Workspace",
        desc: "File access stays inside Robin's configured workspace.",
        icon: FolderKey,
      },
      {
        title: "Connections",
        desc: "Connected services use the permissions you grant.",
        icon: ShieldCheck,
      },
    ];

    return (
      <div
        ref={ref}
        className={`w-full max-w-2xl flex flex-col sm:flex-row items-stretch justify-center gap-3 px-4 ${className}`}
      >
        {safeguards.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex-1 p-3 sm:p-3.5 rounded-xl bg-background-surface/85 border border-white/[0.08] backdrop-blur-md shadow-md flex flex-col text-left"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={14} className="text-brand-violet shrink-0" />
                <span className="text-xs font-semibold text-white tracking-tight">
                  {item.title}
                </span>
              </div>
              <p className="text-[11px] text-foreground-muted leading-snug">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    );
  }
);

SafeguardsPills.displayName = "SafeguardsPills";

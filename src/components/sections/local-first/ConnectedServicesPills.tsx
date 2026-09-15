import React from "react";
import { Mail, Calendar, CheckSquare, Users, Globe } from "lucide-react";

export const ConnectedServicesPills = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className = "" }, ref) => {
    const services = [
      { name: "Email", icon: Mail, detail: "Gmail API" },
      { name: "Calendar", icon: Calendar, detail: "Google Calendar" },
      { name: "Tasks", icon: CheckSquare, detail: "Task Sync" },
      { name: "People", icon: Users, detail: "Contacts API" },
    ];

    return (
      <div
        ref={ref}
        className={`w-full max-w-lg p-3.5 sm:p-4 rounded-xl bg-background-surface/90 border border-white/[0.08] backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.5)] ${className}`}
      >
        <div className="flex items-center justify-between text-[11px] font-mono text-foreground-subtle pb-2 border-b border-white/[0.06] mb-2.5">
          <span className="flex items-center gap-1.5 text-white/90">
            <Globe size={12} className="text-brand-indigo" />
            <span>Authorized Connected Services</span>
          </span>
          <span>Online Sync</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.name}
                className="p-2 rounded-lg bg-background-elevated/60 border border-white/[0.05] flex flex-col items-center text-center"
              >
                <Icon size={14} className="text-white/80 mb-1" />
                <span className="text-xs text-white font-medium">{svc.name}</span>
                <span className="text-[10px] font-mono text-foreground-subtle">{svc.detail}</span>
              </div>
            );
          })}
        </div>

        <p className="mt-2.5 text-[11px] text-foreground-muted text-center leading-snug">
          Robin connects to services you&apos;ve authorized when a request needs them.
        </p>
      </div>
    );
  }
);

ConnectedServicesPills.displayName = "ConnectedServicesPills";

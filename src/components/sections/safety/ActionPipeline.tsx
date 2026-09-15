import React from "react";

interface ActionPipelineProps {
  activeStep?: "request" | "understand" | "prepare" | "review" | "execute" | "none";
  className?: string;
  isApproved?: boolean;
}

export const ActionPipeline = React.forwardRef<HTMLDivElement, ActionPipelineProps>(
  ({ activeStep = "request", className = "", isApproved = false }, ref) => {
    const steps = [
      { id: "request", label: "Request" },
      { id: "understand", label: "Understand" },
      { id: "prepare", label: "Prepare" },
      { id: "review", label: "Review" },
      { id: "execute", label: "Execute" },
    ];

    return (
      <div
        ref={ref}
        className={`inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-background-surface/90 border border-white/[0.08] backdrop-blur-md shadow-lg ${className}`}
      >
        {steps.map((step, idx) => {
          const isStepActive = step.id === activeStep;
          const isReview = step.id === "review";
          const isExecute = step.id === "execute";

          return (
            <React.Fragment key={step.id}>
              {idx > 0 && (
                <span className="text-[10px] text-foreground-subtle/40 select-none">
                  &rarr;
                </span>
              )}

              {/* Luminous Approval Boundary Line right before execute */}
              {isExecute && (
                <div
                  className={`h-4 w-[2px] mx-0.5 transition-colors duration-300 ${
                    isApproved ? "bg-brand-violet shadow-[0_0_8px_rgba(139,92,246,0.8)]" : "bg-brand-violet/40"
                  }`}
                  title="Approval Gate"
                />
              )}

              <div
                className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-mono transition-colors duration-200 ${
                  isStepActive
                    ? "bg-white/[0.08] text-white font-medium"
                    : isReview && !isApproved
                    ? "text-brand-violet/90"
                    : isExecute && isApproved
                    ? "text-brand-indigo font-medium"
                    : "text-foreground-subtle"
                }`}
              >
                <span>{step.label}</span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);

ActionPipeline.displayName = "ActionPipeline";

import React from "react";
import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  id: string;
  className?: string;
}

export function Section({ children, id, className, ...props }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-28 sm:py-36 border-b border-background-border/50",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}

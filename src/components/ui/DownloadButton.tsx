"use client";

import React from "react";
import { Download, Clock } from "lucide-react";
import {
  ROBIN_DOWNLOAD_URL,
  isDownloadAvailable,
  ROBIN_VERSION,
  ROBIN_PLATFORM,
} from "@/config/download";
import { trackDownloadClick } from "@/lib/analytics";

interface DownloadButtonProps {
  className?: string;
  size?: "sm" | "default" | "lg";
  variant?: "primary" | "secondary" | "header";
  placement?: "header" | "hero" | "download-section" | string;
}

export function DownloadButton({
  className = "",
  size = "default",
  variant = "primary",
  placement = "unknown",
}: DownloadButtonProps) {
  if (isDownloadAvailable) {
    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs",
      default: "px-6 py-2.5 text-xs sm:text-sm",
      lg: "px-8 py-3.5 text-sm sm:text-base",
    };

    const variantClasses = {
      primary:
        "bg-white text-black hover:bg-neutral-200 transition-colors shadow-sm",
      secondary:
        "bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.1] hover:border-white/[0.2]",
      header:
        "bg-white/[0.04] hover:bg-white/[0.08] text-white/90 hover:text-white border border-white/[0.1] hover:border-white/[0.2]",
    };

    return (
      <a
        href={ROBIN_DOWNLOAD_URL}
        download
        onClick={() => trackDownloadClick(placement)}
        className={`inline-flex items-center justify-center gap-2 font-medium rounded transition-all duration-150 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        aria-label={`Download Robin ${ROBIN_VERSION} for ${ROBIN_PLATFORM}`}
      >
        <Download size={size === "lg" ? 16 : 13} />
        <span>Download Robin for Windows</span>
      </a>
    );
  }

  // Temporary State: Installer URL not yet connected
  const disabledSizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    default: "px-5 py-2.5 text-xs sm:text-sm",
    lg: "px-7 py-3 text-sm",
  };

  if (variant === "header") {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-foreground-muted bg-white/[0.03] border border-white/[0.08] rounded cursor-default select-none ${className}`}
        title="Official Windows installer coming soon"
      >
        <Clock size={11} className="text-brand-violet/80" />
        <span>Download coming soon</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center justify-center gap-2 font-medium rounded bg-white/[0.06] border border-white/[0.12] text-white/90 shadow-sm cursor-default select-none ${disabledSizeClasses[size]} ${className}`}
      title="Official Windows installer is currently in preparation"
      role="status"
    >
      <Clock size={13} className="text-brand-violet" />
      <span>Download coming soon</span>
      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-brand-violet/20 border border-brand-violet/30 text-brand-violet">
        Windows
      </span>
    </div>
  );
}

import { ROBIN_PLATFORM, ROBIN_VERSION, ROBIN_CHANNEL } from "@/config/download";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Public Google Analytics 4 Measurement ID
 * Set via NEXT_PUBLIC_GA_MEASUREMENT_ID in .env.local (or build environment).
 */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";

/**
 * Determine whether analytics should be active.
 * - Requires a non-empty measurement ID.
 * - Runs only in production (NODE_ENV === "production"), unless
 *   NEXT_PUBLIC_GA_DEBUG === "true" is explicitly set for local verification.
 */
export function isAnalyticsEnabled(): boolean {
  if (!GA_MEASUREMENT_ID) return false;
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_GA_DEBUG !== "true"
  ) {
    return false;
  }
  return true;
}

/**
 * Track page views across App Router route navigations.
 * Avoids duplicate tracking and records non-sensitive page metadata.
 */
export function trackPageView(url: string, title?: string): void {
  if (
    typeof window === "undefined" ||
    !isAnalyticsEnabled() ||
    typeof window.gtag !== "function"
  ) {
    return;
  }

  try {
    window.gtag("event", "page_view", {
      page_path: url,
      page_location: window.location.href,
      page_title: title || document.title,
    });
  } catch {
    // Fail silently without console noise if blocked by client privacy tools
  }
}

/**
 * Generic GA4 custom event tracking helper.
 */
export function trackEvent(
  action: string,
  params: Record<string, string | number | boolean> = {}
): void {
  if (
    typeof window === "undefined" ||
    !isAnalyticsEnabled() ||
    typeof window.gtag !== "function"
  ) {
    return;
  }

  try {
    window.gtag("event", action, params);
  } catch {
    // Fail silently without console noise if blocked by client privacy tools
  }
}

/**
 * Custom event: track clicks on the official Robin Windows installer link.
 * Note: Sent only when an active download link is clicked, representing
 * a download intent click, not confirmed installation.
 */
export function trackDownloadClick(placement: string = "unknown"): void {
  trackEvent("robin_download_click", {
    platform: ROBIN_PLATFORM,
    version: ROBIN_VERSION,
    channel: ROBIN_CHANNEL.toLowerCase(),
    placement,
  });
}

/**
 * Custom event: track interaction with primary "Meet Robin" discovery CTA.
 */
export function trackMeetRobinClick(placement: string = "hero"): void {
  trackEvent("meet_robin_click", {
    placement,
  });
}

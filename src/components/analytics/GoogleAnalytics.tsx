"use client";

import React, { useEffect, useRef, Suspense } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import {
  GA_MEASUREMENT_ID,
  isAnalyticsEnabled,
  trackPageView,
} from "@/lib/analytics";

function AnalyticsNavigationTracker() {
  const pathname = usePathname();
  const lastTrackedPathRef = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    // Prevent duplicate page view events for the same path
    if (lastTrackedPathRef.current === pathname) return;
    lastTrackedPathRef.current = pathname;

    trackPageView(pathname);
  }, [pathname]);

  return null;
}

export function GoogleAnalytics() {
  if (!isAnalyticsEnabled()) {
    return null;
  }

  return (
    <>
      {/* Google Analytics 4 Script Loader */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script id="google-analytics-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            send_page_view: false
          });
        `}
      </Script>
      {/* Route change observer for App Router client navigation */}
      <Suspense fallback={null}>
        <AnalyticsNavigationTracker />
      </Suspense>
    </>
  );
}

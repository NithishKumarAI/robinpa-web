import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_URL,
} from "@/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/branding/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/branding/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/branding/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/branding/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/branding/icon-512.png",
        width: 512,
        height: 512,
        alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/branding/icon-512.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-background text-foreground antialiased font-sans">
        {/* Google Analytics 4 Script & Route Observer */}
        <GoogleAnalytics />
        {/* Accessible Skip Navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-background-surface focus:text-white focus:border focus:border-brand-violet/50 focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-violet font-mono text-xs"
        >
          Skip to content
        </a>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}

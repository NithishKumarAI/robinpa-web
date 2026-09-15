/**
 * Centralized Windows Installer Download Configuration
 * -------------------------------------------------------------
 * When the official installer is uploaded to Google Cloud Storage (GCS),
 * set ROBIN_DOWNLOAD_URL to the direct artifact URL.
 *
 * Example: "https://storage.googleapis.com/robin-releases/Robin-Setup-1.0.exe"
 *
 * While empty (""), all download CTAs throughout the website gracefully
 * display a temporary "Download coming soon" state without navigating to
 * broken or fake URLs.
 */
export const ROBIN_DOWNLOAD_URL: string = "";

export const ROBIN_VERSION: string = "1.0";
export const ROBIN_PLATFORM: string = "Windows";

export const isDownloadAvailable: boolean = Boolean(
  ROBIN_DOWNLOAD_URL && ROBIN_DOWNLOAD_URL.trim().length > 0
);

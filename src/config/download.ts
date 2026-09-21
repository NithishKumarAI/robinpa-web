/**
 * Centralized Windows Installer Download Configuration
 * -------------------------------------------------------------
 * Official Robin Beta Testing Build (v0.1.0)
 *
 * Hosted on Google Cloud Storage (GCS) for direct client downloads.
 */
export const ROBIN_DOWNLOAD_URL: string =
  "https://storage.googleapis.com/robin-v1-beta-testing/Robin%20Setup%200.1.0.exe";

export const ROBIN_VERSION: string = "0.1.0";
export const ROBIN_CHANNEL: string = "Beta";
export const ROBIN_PLATFORM: string = "Windows";

export const isDownloadAvailable: boolean = Boolean(
  ROBIN_DOWNLOAD_URL && ROBIN_DOWNLOAD_URL.trim().length > 0
);

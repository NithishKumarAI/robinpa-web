import type { OrbState } from "../robin-orb/orb-state";

export interface SceneConfig {
  id: string;
  sectionId: string;
  // Normalized viewport coordinates (0 to 1). e.g. 0.5 is center, 0.72 is right, 0.28 is left.
  desktopX: number;
  desktopY: number;
  mobileX: number;
  mobileY: number;
  // Size multiplier relative to base responsive orb diameter
  scale: number;
  // Default orb state when resting in this scene
  state: OrbState;
}

export const ROBIN_SCENES: SceneConfig[] = [
  {
    id: "hero",
    sectionId: "hero",
    desktopX: 0.50,
    desktopY: 0.52,
    mobileX: 0.50,
    mobileY: 0.48,
    scale: 1.0,
    state: "idle",
  },
  {
    id: "meet-robin",
    sectionId: "meet-robin",
    desktopX: 0.72,
    desktopY: 0.50,
    mobileX: 0.50,
    mobileY: 0.42,
    scale: 0.95,
    state: "speaking",
  },
  {
    id: "capabilities",
    sectionId: "capabilities",
    desktopX: 0.28,
    desktopY: 0.50,
    mobileX: 0.50,
    mobileY: 0.42,
    scale: 0.95,
    state: "thinking",
  },
  {
    id: "safety",
    sectionId: "safety",
    desktopX: 0.72,
    desktopY: 0.50,
    mobileX: 0.50,
    mobileY: 0.42,
    scale: 0.92,
    state: "idle",
  },
  {
    id: "voice",
    sectionId: "voice",
    desktopX: 0.50,
    desktopY: 0.48,
    mobileX: 0.50,
    mobileY: 0.45,
    scale: 1.05,
    state: "idle", // dynamically updated via voice events
  },
  {
    id: "memory",
    sectionId: "memory",
    desktopX: 0.28,
    desktopY: 0.50,
    mobileX: 0.50,
    mobileY: 0.42,
    scale: 0.95,
    state: "thinking",
  },
  {
    id: "local-first",
    sectionId: "local-first",
    desktopX: 0.72,
    desktopY: 0.50,
    mobileX: 0.50,
    mobileY: 0.42,
    scale: 0.92,
    state: "idle",
  },
  {
    id: "download",
    sectionId: "download",
    desktopX: 0.50,
    desktopY: 0.45,
    mobileX: 0.50,
    mobileY: 0.42,
    scale: 1.15,
    state: "idle",
  },
];

/**
 * Returns responsive base orb diameter in pixels.
 * Desktop: 560px (~500–650px)
 * Laptop: 480px (~420–550px)
 * Tablet: 380px (~320–430px)
 * Mobile: 280px (~240–320px)
 */
export function getBaseOrbSize(viewportWidth: number, viewportHeight: number): number {
  if (viewportWidth >= 1280) {
    return Math.min(620, Math.max(500, Math.min(viewportWidth * 0.38, viewportHeight * 0.65)));
  }
  if (viewportWidth >= 1024) {
    return Math.min(520, Math.max(420, Math.min(viewportWidth * 0.42, viewportHeight * 0.6)));
  }
  if (viewportWidth >= 768) {
    return Math.min(420, Math.max(320, Math.min(viewportWidth * 0.48, viewportHeight * 0.5)));
  }
  return Math.min(320, Math.max(240, Math.min(viewportWidth * 0.75, viewportHeight * 0.38)));
}

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
    desktopY: 0.50,
    mobileX: 0.50,
    mobileY: 0.44,
    scale: 1.05,
    state: "idle",
  },
  {
    id: "meet-robin",
    sectionId: "meet-robin",
    desktopX: 0.72,
    desktopY: 0.50,
    mobileX: 0.50,
    mobileY: 0.36,
    scale: 0.95,
    state: "speaking",
  },
  {
    id: "your-day",
    sectionId: "your-day",
    desktopX: 0.28,
    desktopY: 0.50,
    mobileX: 0.50,
    mobileY: 0.36,
    scale: 0.95,
    state: "thinking",
  },
  {
    id: "people-email",
    sectionId: "people-email",
    desktopX: 0.72,
    desktopY: 0.50,
    mobileX: 0.50,
    mobileY: 0.36,
    scale: 0.95,
    state: "idle",
  },
  {
    id: "control",
    sectionId: "control",
    desktopX: 0.28,
    desktopY: 0.50,
    mobileX: 0.50,
    mobileY: 0.36,
    scale: 0.95,
    state: "idle",
  },
  {
    id: "voice",
    sectionId: "voice",
    desktopX: 0.50,
    desktopY: 0.52,
    mobileX: 0.50,
    mobileY: 0.46,
    scale: 1.02,
    state: "idle", // dynamically driven by voice interactions
  },
  {
    id: "memory",
    sectionId: "memory",
    desktopX: 0.28,
    desktopY: 0.50,
    mobileX: 0.50,
    mobileY: 0.36,
    scale: 0.95,
    state: "thinking",
  },
  {
    id: "ai-choice",
    sectionId: "ai-choice",
    desktopX: 0.72,
    desktopY: 0.50,
    mobileX: 0.50,
    mobileY: 0.36,
    scale: 0.92,
    state: "idle",
  },
  {
    id: "download",
    sectionId: "download",
    desktopX: 0.50,
    desktopY: 0.44,
    mobileX: 0.50,
    mobileY: 0.40,
    scale: 1.12,
    state: "idle",
  },
];

/**
 * Returns responsive base orb diameter in pixels, adapting to BOTH viewport width and height.
 * Prevents vertical crowding/clipping on short laptops (1280x720, 1366x768) and compact phones (320x568).
 */
export function getBaseOrbSize(viewportWidth: number, viewportHeight: number): number {
  // Height-aware ceiling: never exceed 48% of height on desktop/tablet, or 34% on mobile
  const heightCeiling = viewportWidth < 768 ? viewportHeight * 0.34 : viewportHeight * 0.48;

  if (viewportWidth >= 1280) {
    const widthTarget = Math.min(600, Math.max(420, viewportWidth * 0.36));
    return Math.min(widthTarget, heightCeiling);
  }
  if (viewportWidth >= 1024) {
    const widthTarget = Math.min(480, Math.max(360, viewportWidth * 0.40));
    return Math.min(widthTarget, heightCeiling);
  }
  if (viewportWidth >= 768) {
    const widthTarget = Math.min(400, Math.max(300, viewportWidth * 0.44));
    return Math.min(widthTarget, heightCeiling);
  }
  // Mobile (< 768px)
  const widthTarget = Math.min(290, Math.max(190, viewportWidth * 0.68));
  return Math.min(widthTarget, heightCeiling);
}

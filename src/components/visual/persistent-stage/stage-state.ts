import type { OrbState } from "../robin-orb/orb-state";

type StateListener = (state: OrbState | null) => void;
const listeners = new Set<StateListener>();
let overrideState: OrbState | null = null;

/**
 * Sets a dynamic state override (e.g. VoiceSection driving listening/thinking/speaking).
 * Pass null to return control to the active scene's default state.
 */
export const setRobinStateOverride = (state: OrbState | null) => {
  overrideState = state;
  listeners.forEach((fn) => fn(overrideState));
};

export const subscribeRobinStateOverride = (fn: StateListener) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

export const getRobinStateOverride = (): OrbState | null => overrideState;

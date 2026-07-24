const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export const ACCORDION_ANIMATION_DURATION_MS = 260;

export const getPreferredScrollBehavior = (): ScrollBehavior =>
  typeof window.matchMedia === "function" &&
  window.matchMedia(reducedMotionQuery).matches
    ? "auto"
    : "smooth";

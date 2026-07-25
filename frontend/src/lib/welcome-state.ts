export const WELCOME_SEEN_STORAGE_KEY =
  "bundle-builder:welcome-seen:v1";

export const hasSeenWelcome = (): boolean => {
  if (typeof window === "undefined") return false;

  try {
    return window.localStorage.getItem(WELCOME_SEEN_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
};

export const markWelcomeSeen = (): void => {
  try {
    window.localStorage.setItem(WELCOME_SEEN_STORAGE_KEY, "1");
  } catch {
    // Storage can be unavailable; the current visit should still continue.
  }
};

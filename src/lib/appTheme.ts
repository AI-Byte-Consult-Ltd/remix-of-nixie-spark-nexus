import { useCallback, useEffect, useState } from "react";
import { trackUsage } from "./usageAnalytics";

/*
 * Light / dark theme for the NICS AI Trader app: the Telegram Mini App,
 * the web cabinet and the Windows app (which is the cabinet). The choice
 * is kept per device. Default: dark.
 */

export type AppTheme = "dark" | "light";

const STORAGE_KEY = "nics_app_theme";
const EVENT = "nics-app-theme-change";

const read = (): AppTheme => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
};

export const useAppTheme = () => {
  const [theme, setThemeState] = useState<AppTheme>(read);

  useEffect(() => {
    const sync = () => setThemeState(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const setTheme = useCallback((next: AppTheme) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage blocked: the choice lasts until the page reloads.
    }
    setThemeState(next);
    window.dispatchEvent(new Event(EVENT));
    trackUsage("theme_changed");
  }, []);

  const toggle = useCallback(() => setTheme(read() === "dark" ? "light" : "dark"), [setTheme]);

  return { theme, setTheme, toggle };
};

// While mounted, puts the shadcn `dark` class on <html> when the theme is
// dark (used by the cabinet; the public site stays light).
export const useHtmlDarkClass = (theme: AppTheme) => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    return () => root.classList.remove("dark");
  }, [theme]);
};

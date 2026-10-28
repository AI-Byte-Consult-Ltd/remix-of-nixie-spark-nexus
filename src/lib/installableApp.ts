import { useEffect } from "react";

// /trading and /nics-video install as their own home-screen apps ("NICS
// Trading", "NICS Video"), each opening on its own page; the rest of the
// site keeps the AI Byte Consult manifest. The pre-rendered HTML of each
// route already names the right manifest (scripts/generate-seo-pages.mjs);
// this hook keeps it right after client-side navigation, because Chrome
// installs from whatever <link rel="manifest"> the page has now and Safari
// reads the apple-touch-icon / title at "Add to Home Screen" time.
export type InstallableApp = "trading" | "video";

export const APP_HEAD: Record<InstallableApp | "site", { manifest: string; icon: string; title: string }> = {
  site: { manifest: "/site.webmanifest", icon: "/apple-touch-icon.png", title: "AI Byte Consult" },
  trading: { manifest: "/trading.webmanifest", icon: "/apps/trading-apple-touch.png", title: "NICS Trading" },
  video: { manifest: "/nics-video.webmanifest", icon: "/apps/video-apple-touch.png", title: "NICS Video" },
};

const applyAppHead = (app: InstallableApp | "site") => {
  const head = APP_HEAD[app];
  document.querySelector('link[rel="manifest"]')?.setAttribute("href", head.manifest);
  document.querySelector('link[rel="apple-touch-icon"]')?.setAttribute("href", head.icon);
  document.querySelector('meta[name="apple-mobile-web-app-title"]')?.setAttribute("content", head.title);
};

export const useInstallableApp = (app: InstallableApp) => {
  useEffect(() => {
    applyAppHead(app);
    return () => applyAppHead("site");
  }, [app]);
};

// Registered only in production builds: see public/sw.js for why it caches
// nothing but the offline page.
export const registerServiceWorker = () => {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
};

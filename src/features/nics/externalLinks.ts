/*
 * External links from the Trader app (Mini App, cabinet, Windows app).
 * Inside Telegram a plain <a target="_blank"> is swallowed, so links go
 * through Telegram.WebApp.openLink there.
 */

import { trackUsage } from "@/lib/usageAnalytics";

// Alexander's broker referral link. Empty = the "Open at broker" buttons
// stay hidden. Set it here when the link is known (public, not a secret).
export const BROKER_REFERRAL_URL = "https://vigco.co/la-com-inv/mGaes8ub";

// The Windows app installer, served by the site (public/downloads). The
// same link is shown in the app (sidebar, About), on the license page and
// in the text an admin sends with a gift key.
export const WINDOWS_APP_DOWNLOAD_PATH = "/downloads/NICS-Trading-Ecosystem-Setup.exe";
export const WINDOWS_APP_DOWNLOAD_URL = `https://aibyteconsult.com${WINDOWS_APP_DOWNLOAD_PATH}`;
// Public page about the app (features, install steps, download).
export const WINDOWS_APP_PAGE_URL = "https://aibyteconsult.com/nics-windows-app";

export const openExternal = (url: string) => {
  if (url === BROKER_REFERRAL_URL) trackUsage("broker_link_opened");
  const telegram = window.Telegram?.WebApp;
  if (telegram?.initData && telegram.openLink) {
    telegram.openLink(url);
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
};

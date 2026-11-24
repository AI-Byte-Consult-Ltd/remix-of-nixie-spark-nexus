/*
 * External links from the Trader app (Mini App, cabinet, Windows app).
 * Inside Telegram a plain <a target="_blank"> is swallowed, so links go
 * through Telegram.WebApp.openLink there.
 */

import { trackUsage } from "@/lib/usageAnalytics";

// Vantage partner links go through our click counter (n8n "[45 WEB] Vantage
// Click Counter", 2026-11-22): it counts the click per source (s=) without
// storing IP or user agent, then redirects to the fixed partner link (l=):
// vig = open-live-account invite link, fwd = the CPA short link.
const VANTAGE_COUNTER = "https://n8n.aibyteconsult.com/webhook/vantage";

// Alexander's broker referral link in the Trader app (Mini App, cabinet,
// Windows app). Empty = the "Open at broker" buttons stay hidden.
export const BROKER_REFERRAL_URL = `${VANTAGE_COUNTER}?s=app&l=vig`;

// Vantage links on the public site.
export const VANTAGE_SITE_URL = `${VANTAGE_COUNTER}?s=site&l=fwd`;

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

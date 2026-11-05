/*
 * External links from the Trader app (Mini App, cabinet, Windows app).
 * Inside Telegram a plain <a target="_blank"> is swallowed, so links go
 * through Telegram.WebApp.openLink there.
 */

import { trackUsage } from "@/lib/usageAnalytics";

// Alexander's broker referral link. Empty = the "Open at broker" buttons
// stay hidden. Set it here when the link is known (public, not a secret).
export const BROKER_REFERRAL_URL = "https://vigco.co/la-com-inv/mGaes8ub";

export const openExternal = (url: string) => {
  if (url === BROKER_REFERRAL_URL) trackUsage("broker_link_opened");
  const telegram = window.Telegram?.WebApp;
  if (telegram?.initData && telegram.openLink) {
    telegram.openLink(url);
    return;
  }
  window.open(url, "_blank", "noopener,noreferrer");
};

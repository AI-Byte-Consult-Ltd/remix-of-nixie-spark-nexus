/*
 * Cookie-free site analytics for aibyteconsult.com.
 * Alexander, 2026-11-07: "the first technical action is to measure the whole
 * funnel": where visitors come from, which pages they open, how many press
 * Start Trial, open the Telegram bot, download the Windows app, pay.
 *
 * Events go to n8n [40 WEB] Site Analytics (POST /webhook/site-event) and land
 * in the n8n data table site_events; the 09:00 Daily Growth Scoreboard reads
 * them together with bot starts, payments and license activations from the
 * bot database.
 *
 * Privacy by design, so no consent banner is needed:
 * - no cookies, nothing written to the visitor's browser storage;
 * - only the page path is sent (never query strings, tokens or form data),
 *   the referring site's host name, utm tags, language and screen width;
 * - n8n counts unique visitors with a hash of a random salt that changes
 *   every day plus IP and browser; the IP and browser are not stored.
 * Opt out on this device: open any page with ?notrack=1 (back on: ?notrack=0).
 * Analytics never blocks or slows the site: fire-and-forget, errors ignored.
 */

import { URL_LANGUAGES } from "@/contexts/LanguageContext";
import { isDesktopApp } from "@/features/cabinet/license";

export const SITE_ANALYTICS_URL = "https://n8n.aibyteconsult.com/webhook/site-event";

export type SiteEvent =
  | "pageview"
  | "bot_click"
  | "trial_click"
  | "windows_download"
  | "contact_click"
  | "outbound"
  | "newsletter_signup"
  | "contact_submit"
  | "lead_signup"
  | "video_free_credits"
  | "video_checkout"
  | "trader_checkout"
  | "cta_click";

type Props = Record<string, string | number | boolean | null | undefined>;

const OPT_OUT_KEY = "nics-no-track";
const SITE_HOST = /(^|\.)aibyteconsult\.com$/i;

// Where this visit came from, worked out once per page load and kept in memory
// only, so every later event of the visit (bot click, checkout) carries it.
let landing: { s: string; m: string; c: string } | null = null;

const readLanding = () => {
  if (landing) return landing;
  let s = "direct";
  let m = "";
  let c = "";
  try {
    const q = new URLSearchParams(window.location.search);
    const ref = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, "") : "";
    if (ref && !SITE_HOST.test(ref)) s = ref;
    const utm = q.get("utm_source") || q.get("s") || q.get("ref_src");
    if (utm) s = utm;
    m = q.get("utm_medium") || "";
    c = q.get("utm_campaign") || "";
  } catch {
    /* keep direct */
  }
  landing = { s: s.slice(0, 60), m: m.slice(0, 40), c: c.slice(0, 60) };
  return landing;
};

const handleOptOutParam = () => {
  try {
    const v = new URLSearchParams(window.location.search).get("notrack");
    if (v === "1") localStorage.setItem(OPT_OUT_KEY, "1");
    if (v === "0") localStorage.removeItem(OPT_OUT_KEY);
  } catch {
    /* storage blocked: nothing to remember */
  }
};

const isDisabled = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") return true;
  if (!/(^|\.)aibyteconsult\.com$/i.test(window.location.hostname)) return true; // dev, previews
  if ((navigator as Navigator & { webdriver?: boolean }).webdriver) return true;
  if (isDesktopApp()) return true; // the Windows app has its own usage analytics
  if (window.location.pathname.startsWith("/nics-app")) return true; // Telegram Mini App, same
  try {
    if (localStorage.getItem(OPT_OUT_KEY) === "1") return true;
  } catch {
    /* ignore */
  }
  return false;
};

const langOf = (path: string) => {
  const first = path.split("/")[1] ?? "";
  return (URL_LANGUAGES as string[]).includes(first) ? first : "en";
};

export const trackSiteEvent = (event: SiteEvent, props?: Props) => {
  try {
    if (isDisabled()) return;
    const path = window.location.pathname;
    const { s, m, c } = readLanding();
    const x: Record<string, string> = {};
    if (props) {
      for (const [k, v] of Object.entries(props)) {
        if (v !== undefined && v !== null && v !== "") x[k] = String(v).slice(0, 60);
      }
    }
    const body = JSON.stringify({ e: event, p: path, s, m, c, l: langOf(path), w: window.innerWidth, x });
    const blob = new Blob([body], { type: "text/plain;charset=UTF-8" });
    if (navigator.sendBeacon && navigator.sendBeacon(SITE_ANALYTICS_URL, blob)) return;
    void fetch(SITE_ANALYTICS_URL, {
      method: "POST",
      body,
      keepalive: true,
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
    }).catch(() => undefined);
  } catch {
    /* analytics must never break the site */
  }
};

let lastPageview = "";
export const trackPageview = () => {
  const path = typeof window !== "undefined" ? window.location.pathname : "";
  if (!path || path === lastPageview) return;
  lastPageview = path;
  trackSiteEvent("pageview");
};

const BOT_HOST = /^(t\.me|telegram\.me)$/i;

// One listener for the whole site: link clicks are classified by where they go,
// so new buttons are counted without extra code. A button can also name its own
// event with data-track="cta_click" (and data-track-label="...").
const onClick = (ev: MouseEvent) => {
  try {
    const target = ev.target as Element | null;
    const el = target?.closest?.("a[href], [data-track]") as HTMLElement | null;
    if (!el) return;
    const custom = el.getAttribute("data-track");
    if (custom) {
      trackSiteEvent(custom as SiteEvent, { label: el.getAttribute("data-track-label") ?? undefined });
      return;
    }
    const href = el.getAttribute("href") || "";
    if (/^mailto:|^tel:/i.test(href)) return trackSiteEvent("contact_click", { kind: href.split(":")[0] });
    let url: URL;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return;
    }
    if (/\.exe$/i.test(url.pathname)) return trackSiteEvent("windows_download", { file: url.pathname.split("/").pop() });
    if (BOT_HOST.test(url.hostname)) {
      const start = url.searchParams.get("start") || "";
      const bot = url.pathname.split("/")[1] || "";
      return trackSiteEvent(/trial/i.test(start) ? "trial_click" : "bot_click", { bot, start });
    }
    if (/(^|\.)(wa\.me|whatsapp\.com)$/i.test(url.hostname)) return trackSiteEvent("contact_click", { kind: "whatsapp" });
    if (url.hostname && !SITE_HOST.test(url.hostname) && /^https?:$/.test(url.protocol)) {
      return trackSiteEvent("outbound", { host: url.hostname.replace(/^www\./, "") });
    }
  } catch {
    /* ignore */
  }
};

let started = false;
export const initSiteAnalytics = () => {
  if (started || typeof window === "undefined") return;
  started = true;
  handleOptOutParam();
  readLanding();
  document.addEventListener("click", onClick, { capture: true, passive: true });
};

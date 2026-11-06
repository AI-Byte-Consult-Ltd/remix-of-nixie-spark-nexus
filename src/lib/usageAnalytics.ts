/*
 * Usage statistics for the NICS AI Trader app (Windows app + web cabinet).
 * Alexander, 2026-11-05: "collect statistics on how users use the app".
 *
 * Events go to n8n [43 OPS] App Usage Analytics (POST /webhook/nics-usage)
 * with the cabinet session, and land in product_events next to the events
 * the Telegram Mini App already writes through [07 APP].
 *
 * What is sent: the event name plus a few technical fields (screen or
 * page, platform, app version, language, theme, market, result).
 * What is never sent: message text, amounts, keys, e-mail, IP-derived data.
 * Analytics never blocks or slows the app: fire-and-forget, errors ignored.
 */

import { CABINET_SESSION_STORAGE_KEY } from "@/features/cabinet/api";
import { isDesktopApp } from "@/features/cabinet/license";

export const TRADER_APP_VERSION = "2.9.0";

export const USAGE_API_URL = "https://n8n.aibyteconsult.com/webhook/nics-usage";

export type UsagePlatform = "desktop" | "web" | "telegram";

export type UsageMetadata = {
  screen?: string;
  page?: string;
  market?: string | null;
  scope?: string;
  result?: string;
  signalId?: string;
  language?: string;
};

const readSession = (): string | null => {
  try {
    const raw = localStorage.getItem(CABINET_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { session?: string };
    return parsed?.session || null;
  } catch {
    return null;
  }
};

const readTheme = (): string => {
  try {
    return localStorage.getItem("nics_app_theme") === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
};

export const usagePlatform = (): UsagePlatform => {
  if (window.Telegram?.WebApp?.initData) return "telegram";
  return isDesktopApp() ? "desktop" : "web";
};

/**
 * Records one usage event for a signed-in cabinet / Windows app user.
 * Without a cabinet session (Telegram Mini App, signed-out visitor) it
 * does nothing; the Mini App keeps its own [07 APP] track_event path.
 */
export const trackUsage = (eventName: string, metadata: UsageMetadata = {}, session?: string | null) => {
  if (typeof window === "undefined") return;
  const cabinetSession = session ?? readSession();
  if (!cabinetSession) return;

  const body = JSON.stringify({
    action: "track",
    cabinetSession,
    eventName,
    metadata: {
      ...metadata,
      market: metadata.market ?? undefined,
      platform: usagePlatform(),
      appVersion: TRADER_APP_VERSION,
      language: metadata.language || document.documentElement.lang || undefined,
      theme: readTheme(),
    },
  });

  try {
    void fetch(USAGE_API_URL, {
      method: "POST",
      // Simple content type: no CORS preflight.
      headers: { "Content-Type": "text/plain;charset=UTF-8" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    // Analytics never breaks the app.
  }
};

// Cabinet routes like /cabinet/academy/lesson/12 are reduced to their
// section so the statistics group pages, not individual records.
export const cabinetPageKey = (pathname: string): string => {
  const parts = pathname.replace(/\/+$/, "").split("/").filter(Boolean);
  if (parts[0] !== "cabinet") return "";
  if (parts.length === 1) return "cabinet";
  return parts
    .slice(1, 3)
    .filter((part) => !/\d/.test(part))
    .join("/")
    .slice(0, 60);
};

export interface UsageBucket {
  key: string;
  users?: number;
  events?: number;
}

export interface UsageStats {
  days: number;
  includeAdmins: boolean;
  generatedAt: string;
  active: { today: number; d7: number; d30: number };
  events: number;
  users: number;
  daily: Array<{ day: string; users: number; events: number }>;
  platforms: UsageBucket[];
  screens: UsageBucket[];
  actions: UsageBucket[];
  versions: UsageBucket[];
  languages: UsageBucket[];
  signalOrders: UsageBucket[];
}

export const fetchUsageStats = async (
  session: string,
  days: number,
  includeAdmins: boolean,
): Promise<UsageStats> => {
  const response = await fetch(USAGE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify({ action: "stats", cabinetSession: session, days, includeAdmins }),
  });
  const result = (await response.json().catch(() => null)) as
    | { ok: boolean; code?: string; data?: UsageStats }
    | null;
  if (!response.ok || !result?.ok || !result.data) {
    throw new Error(result?.code || "REQUEST_FAILED");
  }
  return result.data;
};

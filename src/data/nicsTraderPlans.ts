/*
 * Single source of truth for NICS AI Trader pricing, shared between the
 * public marketing page (NicsTraderPlans.tsx) and the cabinet's
 * subscription page (CabinetSubscription.tsx). Previously this data
 * only lived inline in the marketing component -- duplicating it into
 * the cabinet would have created exactly the kind of parallel list
 * that has desynced and caused production incidents on this project
 * before (see runbook).
 */

// ?start=src_site lets the bot record signup_source = site for first-time users.
export const TELEGRAM_BOT_URL = "https://t.me/nics_ai_bot?start=src_site";

export type Period = "7d" | "30d" | "90d";
export type Currency = "EUR" | "USD";

export type PaidPrice = Record<Period, Record<Currency, number>>;

export interface Plan {
  id: string;
  name: string;
  badge?: string;
  subtitle: string;
  markets: string;
  free?: boolean;
  prices?: PaidPrice;
  features: string[];
  cta: string;
  featured?: boolean;
}

/*
 * 2026-10-22, Galileo funnel relaunch (Block 3): collapsed from four
 * tiers (demo/single/multi/full) to one flat tariff -- full access
 * always covers every market the buyer has selected, same as the free
 * trial. EUR prices MUST stay in sync with [02 BOT]'s Build Telegram
 * API Actions and [21 REVOLUT]'s Build Order Payload, both of which
 * read the same app_secrets keys (nics_price_week_eur,
 * nics_price_month_eur, nics_price_3months_eur) -- same parallel-list
 * risk flagged in those nodes' own comments. USD is a display-only
 * estimate: Revolut always charges in EUR regardless of the toggle
 * shown here (see the Revolut payment description below).
 */
export const plans: Plan[] = [
  {
    id: "demo",
    name: "AI Trader Free Trial",
    badge: "FREE 3-DAY TRIAL",
    subtitle: "Full access to your chosen markets for 3 days, no payment required.",
    markets: "Any currently available markets",
    free: true,
    features: [
      "Full access to every market you select",
      "Request signals on demand, any time during the trial",
      "Entry zone, Stop Loss and TP1–TP4",
      "AI explanation and risk notes",
      "Lifecycle updates after accepting a signal",
      "Granted once per account, no payment required",
    ],
    cta: "Start Free Trial",
  },
  {
    id: "full",
    name: "AI Trader Full Access",
    badge: "ONE PLAN, ALL MARKETS",
    subtitle: "Complete NICS coverage across every supported market.",
    markets: "Gold, Oil, Forex, Crypto, Stocks, Silver, Indices",
    prices: {
      "7d": { EUR: 9, USD: 9.99 },
      "30d": { EUR: 29, USD: 31.99 },
      "90d": { EUR: 69, USD: 75.99 },
    },
    features: [
      "Access to every supported market",
      "No request-count limit while access is active",
      "Automated scans across the trading day",
      "On-demand Get Signal requests",
      "Entry, SL and TP1–TP4",
      "AI explanation and risk analysis",
      "TP, SL and breakeven lifecycle updates",
      "Personal Telegram delivery",
    ],
    cta: "Get Full Access",
    featured: true,
  },
];

export const formatPrice = (amount: number, currency: Currency) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

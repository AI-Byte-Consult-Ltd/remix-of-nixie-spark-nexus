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
// 2026-11-04 paid card trial: /start src_trial opens the 1.99 EUR / 7 days offer
// in the bot ([39 TRADER] Card Subscription), then 19.99 EUR/month auto-renew.
export const TRIAL_BOT_URL = "https://t.me/nics_ai_bot?start=src_trial";

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
  /** Paid trial plan: headline price and the line under it. */
  trialPrice?: string;
  trialNote?: string;
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
    name: "Monthly subscription",
    badge: "START FOR €1.99",
    subtitle: "€1.99 for the first 7 days, then €19.99 every month. Renews automatically by card, cancel any time.",
    markets: "Gold & silver · Forex · Brent oil · Crypto · US stocks · Indices",
    free: true,
    trialPrice: "€1.99",
    trialNote: "first 7 days, then €19.99/month until you cancel. Includes the Windows app Pro key.",
    features: [
      "Full access to every supported market",
      "Windows app Pro key, web dashboard and Telegram",
      "Request signals on demand, any time",
      "Entry zone, Stop Loss and TP1–TP4",
      "AI explanation and risk notes",
      "Reminder in the bot and by e-mail a day before the first €19.99 charge",
      "Cancel with one button in the bot, access stays until the paid period ends",
    ],
    cta: "Start for €1.99",
    featured: true,
  },
  {
    id: "full",
    name: "One-time pass",
    badge: "NO AUTO-RENEWAL",
    subtitle: "Pay once for 7, 30 or 90 days. No card is saved and nothing renews: access simply ends.",
    markets: "Gold & silver · Forex · Brent oil · Crypto · US stocks · Indices",
    prices: {
      "7d": { EUR: 9, USD: 9.99 },
      "30d": { EUR: 29, USD: 31.99 },
      "90d": { EUR: 69, USD: 75.99 },
    },
    features: [
      "Access to every supported market",
      "No request-count limit while access is active",
      "Automated scans around the clock",
      "On-demand Get Signal requests",
      "Entry, SL and TP1–TP4",
      "AI explanation and risk analysis",
      "TP, SL and breakeven lifecycle updates",
      "Windows app Pro key, web dashboard and Telegram",
    ],
    cta: "Buy a pass",
  },
];

export const formatPrice = (amount: number, currency: Currency) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

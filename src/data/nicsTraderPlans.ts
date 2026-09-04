/*
 * Single source of truth for NICS AI Trader pricing, shared between the
 * public marketing page (NicsTraderPlans.tsx) and the cabinet's
 * subscription page (CabinetSubscription.tsx). Previously this data
 * only lived inline in the marketing component -- duplicating it into
 * the cabinet would have created exactly the kind of parallel list
 * that has desynced and caused production incidents on this project
 * before (see runbook).
 */

export const TELEGRAM_BOT_URL = "https://t.me/nics_ai_bot";

/*
 * Revolut Business payment links, EUR plans only -- same
 * checkout.revolut.com/pay/<id> pattern already used in SCIProducts.tsx.
 * The button stays hidden for any plan/period left empty here.
 */
export const REVOLUT_LINKS: Record<string, Record<string, string>> = {
  "30d": {
    single: "https://checkout.revolut.com/pay/77320277-3272-4175-a7db-a0f70ed6cacd",
    multi: "https://checkout.revolut.com/pay/48476677-fb37-45d0-882f-d4316bb185ea",
    full: "https://checkout.revolut.com/pay/a95ccc94-7bc5-470d-97e7-5198949a4d49",
  },
  "7d": {
    single: "https://checkout.revolut.com/pay/a3eb2890-88c8-47af-8023-1855c52f6e22",
    multi: "https://checkout.revolut.com/pay/5f970c45-13c7-47a3-abdd-09de7d700087",
    full: "https://checkout.revolut.com/pay/21ada208-69aa-4eff-b285-503a3e1f9691",
  },
};

export type Period = "7d" | "30d";
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

export const plans: Plan[] = [
  {
    id: "demo",
    name: "AI Trader Demo",
    badge: "FREE DEMO",
    subtitle: "Experience one real NICS trading plan before subscribing.",
    markets: "Any currently available market",
    free: true,
    features: [
      "One real AI-generated trading signal",
      "Choose any currently available market",
      "Entry zone, Stop Loss and TP1–TP4",
      "AI explanation and risk notes",
      "Lifecycle updates after accepting the signal",
      "No payment required",
    ],
    cta: "Try One Free Signal",
  },
  {
    id: "single",
    name: "AI Trader Single Market",
    subtitle: "Focused AI trading coverage for one selected market.",
    markets: "Gold OR Oil OR Forex OR Bitcoin",
    prices: {
      "7d": { EUR: 10.99, USD: 12.99 },
      "30d": { EUR: 34.99, USD: 39.99 },
    },
    features: [
      "Choose one supported market",
      "No request-count limit while access is active",
      "Ten automated market scans per day",
      "On-demand Get Signal requests",
      "Current-market validation before delivery",
      "Entry, SL and TP1–TP4",
      "AI explanation and market-risk check",
      "TP, SL and breakeven lifecycle updates",
      "Personal Telegram delivery",
    ],
    cta: "Choose One Market",
  },
  {
    id: "multi",
    name: "AI Trader Multi-Market",
    badge: "MOST POPULAR",
    subtitle: "Broader coverage for active traders following two markets.",
    markets: "Choose any 2: Gold, Oil, Forex or Bitcoin",
    prices: {
      "7d": { EUR: 17.99, USD: 20.99 },
      "30d": { EUR: 52.99, USD: 60.99 },
    },
    features: [
      "Choose any two supported markets",
      "No request-count limit while access is active",
      "Ten automated scans across available markets",
      "On-demand requests by selected market",
      "Current-market validation before delivery",
      "Entry, SL and TP1–TP4",
      "AI explanation and news-risk analysis",
      "Personal TP, SL and breakeven updates",
      "Priority Telegram delivery",
    ],
    cta: "Choose Two Markets",
    featured: true,
  },
  {
    id: "full",
    name: "AI Trader Full Coverage",
    subtitle: "Complete NICS coverage across all supported trading markets.",
    markets: "Gold + Oil + Forex + Bitcoin",
    prices: {
      "7d": { EUR: 26.99, USD: 30.99 },
      "30d": { EUR: 79.99, USD: 91.99 },
    },
    features: [
      "Access to all four supported market groups",
      "No request-count limit while access is active",
      "Ten automated full-market scans per day",
      "On-demand selection of a specific market",
      "Current-market validation before delivery",
      "Entry, SL and TP1–TP4",
      "AI explanation, news and risk analysis",
      "Personal TP, SL and breakeven updates",
      "Full Telegram delivery and tracking",
    ],
    cta: "Unlock Full Coverage",
  },
];

export const formatPrice = (amount: number, currency: Currency) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

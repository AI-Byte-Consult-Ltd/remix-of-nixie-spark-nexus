import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Bot, Check, ShieldCheck, Target, Zap } from "lucide-react";
import { useState } from "react";

const TELEGRAM_BOT_URL = "https://t.me/nics_ai_bot";

type Period = "7d" | "30d";
type Currency = "EUR" | "USD";

type PaidPrice = Record<Period, Record<Currency, number>>;

interface Plan {
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

const plans: Plan[] = [
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

const formatPrice = (amount: number, currency: Currency) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

const NicsTraderPlans = () => {
  const [period, setPeriod] = useState<Period>("30d");
  const [currency, setCurrency] = useState<Currency>("EUR");

  return (
    <section id="nics-trader-plans" className="relative overflow-hidden bg-[#050914] py-28 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(30,58,138,0.55),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(249,115,22,0.18),_transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.4) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto mb-12 max-w-4xl text-center"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/5 px-4 py-1.5 text-xs font-medium tracking-wider text-orange-300 backdrop-blur">
            <Bot className="h-3.5 w-3.5" />
            NICS AI TRADER ACCESS
          </div>
          <h2 className="mb-6 text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Choose Your Markets.{" "}
            <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              Start Trading with NICS.
            </span>
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-white/70 md:text-xl">
            Choose your coverage and receive structured AI trading scenarios directly in Telegram and the NICS Mini App.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Zap, label: "Fast Telegram access" },
              { icon: ShieldCheck, label: "No setup fee" },
              { icon: Target, label: "Entry, SL and TP1–TP4" },
            ].map((item) => (
              <div
                key={item.label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-white/75 backdrop-blur"
              >
                <item.icon className="h-3.5 w-3.5 text-orange-300" />
                {item.label}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="mb-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <div role="tablist" aria-label="Access period" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur">
            {(["7d", "30d"] as Period[]).map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={period === value}
                onClick={() => setPeriod(value)}
                className={`relative rounded-full px-5 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                  period === value ? "text-black" : "text-white/70 hover:text-white"
                }`}
              >
                {period === value && (
                  <motion.span
                    layoutId="nicsPeriodPill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-amber-400"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">{value === "7d" ? "7 Days" : "30 Days"}</span>
              </button>
            ))}
          </div>

          <div role="tablist" aria-label="Price currency" className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur">
            {(["EUR", "USD"] as Currency[]).map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={currency === value}
                onClick={() => setCurrency(value)}
                className={`relative rounded-full px-5 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                  currency === value ? "text-black" : "text-white/70 hover:text-white"
                }`}
              >
                {currency === value && (
                  <motion.span
                    layoutId="nicsCurrencyPill"
                    className="absolute inset-0 rounded-full bg-white"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">{value}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl items-stretch gap-6 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan, index) => {
            const amount = plan.prices?.[period]?.[currency];

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className={`group relative rounded-3xl p-[1px] ${
                  plan.featured
                    ? "bg-gradient-to-b from-orange-400/60 via-orange-400/20 to-transparent"
                    : plan.free
                      ? "bg-gradient-to-b from-white/20 via-white/5 to-transparent"
                      : "bg-gradient-to-b from-white/15 to-transparent"
                }`}
              >
                <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(1.5rem-1px)] bg-[#0a0f1f]/90 p-7 backdrop-blur-xl">
                  <div
                    className={`absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl transition-opacity duration-500 ${
                      plan.featured
                        ? "bg-orange-500/25 opacity-100"
                        : plan.free
                          ? "bg-white/10 opacity-60 group-hover:opacity-100"
                          : "bg-blue-500/15 opacity-60 group-hover:opacity-100"
                    }`}
                  />

                  {plan.badge && (
                    <div
                      className={`absolute right-5 top-5 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                        plan.free
                          ? "border border-white/15 bg-white/10 text-white/80"
                          : "bg-gradient-to-r from-orange-400 to-amber-400 text-black"
                      }`}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <h3 className="relative mb-2 mt-1 pr-20 text-xl font-semibold">{plan.name}</h3>
                  <p className="relative mb-4 min-h-[42px] text-sm leading-relaxed text-white/70">{plan.subtitle}</p>
                  <p className="relative mb-5 min-h-[32px] text-xs text-orange-300/90">{plan.markets}</p>

                  <div className="relative mb-6 min-h-[92px] border-b border-white/10 pb-6">
                    {plan.free ? (
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-semibold text-white">FREE</span>
                          <span className="text-sm text-white/50">1 signal</span>
                        </div>
                        <p className="mt-2 text-xs text-white/50">No payment required</p>
                      </div>
                    ) : amount !== undefined ? (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`${period}-${currency}`}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="text-3xl font-semibold text-white">{formatPrice(amount, currency)}</div>
                          <p className="mt-2 text-xs text-white/55">for {period === "7d" ? "7 days" : "30 days"}</p>
                        </motion.div>
                      </AnimatePresence>
                    ) : null}
                  </div>

                  <ul className="relative mb-6 flex-1 space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm text-white/75">
                        <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border border-orange-400/40 bg-orange-400/15">
                          <Check className="h-3 w-3 text-orange-300" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={TELEGRAM_BOT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1f] ${
                      plan.featured
                        ? "bg-gradient-to-r from-orange-400 to-amber-400 text-black hover:shadow-lg hover:shadow-orange-500/40"
                        : plan.free
                          ? "border border-white/15 bg-white/[0.06] text-white hover:bg-white/10"
                          : "border border-white/15 bg-white/5 text-white hover:border-orange-400/40 hover:bg-white/10"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-white/50">
          Prices are displayed directly in the selected currency. Trading involves substantial risk. NICS provides analytical trading scenarios and risk-management tools, not guaranteed returns or financial advice.
        </p>
      </div>
    </section>
  );
};

export default NicsTraderPlans;

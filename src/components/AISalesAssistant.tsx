import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Bot,
  ArrowRight,
  Check,
  Star,
  Zap,
  ShieldCheck,
  Target,
  Coins,
  Droplet,
  DollarSign,
  Bitcoin,
} from "lucide-react";

const TELEGRAM_BOT_URL = "https://t.me/nics_ai_bot";

type Period = "7d" | "30d";

interface Plan {
  id: string;
  name: string;
  badge?: string;
  subtitle: string;
  markets: string;
  free?: boolean;
  priceFree?: string;
  priceSecondary?: string;
  prices?: Record<Period, { stars: string; eur: string }>;
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
    priceFree: "FREE",
    priceSecondary: "1 signal",
    features: [
      "One real AI-generated trading signal",
      "Choose any currently available market",
      "Entry zone, Stop Loss and TP1–TP4",
      "AI explanation and risk notes",
      "Personal lifecycle updates after accepting the signal",
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
      "7d": { stars: "499", eur: "≈ €10–12 / 7 days" },
      "30d": { stars: "1,499", eur: "≈ €30–37 / 30 days" },
    },
    features: [
      "Choose one supported market",
      "No request-count limit while access is active",
      "Ten automated market scans per day",
      "On-demand “Get Signal” requests",
      "Fresh 5m and 15m data validation",
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
      "7d": { stars: "799", eur: "≈ €16–20 / 7 days" },
      "30d": { stars: "2,299", eur: "≈ €46–57 / 30 days" },
    },
    features: [
      "Choose any two supported markets",
      "No request-count limit while access is active",
      "Ten automated scans across available markets",
      "On-demand signal requests by selected market",
      "Fresh 5m and 15m validation",
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
    markets: "Gold + Oil + Forex + Bitcoin (same price for 3 or 4 markets)",
    prices: {
      "7d": { stars: "1,199", eur: "≈ €24–30 / 7 days" },
      "30d": { stars: "3,499", eur: "≈ €70–87 / 30 days" },
    },
    features: [
      "Access to three or all four market groups",
      "No request-count limit while access is active",
      "Ten automated full-market scans per day",
      "On-demand selection of a specific market",
      "Fresh 5m and 15m data validation",
      "Entry, SL and TP1–TP4",
      "AI explanation, news and risk analysis",
      "Personal TP, SL and breakeven updates",
      "Full Telegram delivery and tracking",
    ],
    cta: "Unlock Full Coverage",
  },
];

const markets = [
  {
    icon: Coins,
    name: "Gold",
    symbol: "XAU/USD + XAUUSD247",
    desc: "Regular XAU/USD during weekday sessions and Vantage XAUUSD247 when the weekend feed is available.",
    availability: "Weekdays + available weekend trading",
  },
  {
    icon: Droplet,
    name: "Oil",
    symbol: "UKOUSDft",
    desc: "Vantage Brent Crude Oil Future with broker-native MT5 pricing.",
    availability: "Monday–Friday, according to Vantage market hours",
  },
  {
    icon: DollarSign,
    name: "Forex",
    symbol: "EUR/USD · GBP/USD · USD/JPY",
    desc: "NICS compares the supported currency pairs and selects the strongest current setup.",
    availability: "Sunday opening through Friday closing",
  },
  {
    icon: Bitcoin,
    name: "Bitcoin",
    symbol: "BTC/USD",
    desc: "Continuous cryptocurrency analysis and on-demand signals.",
    availability: "24/7",
  },
];

const AISalesAssistant = () => {
  const [period, setPeriod] = useState<Period>("30d");

  return (
    <section
      id="sci-products"
      className="relative overflow-hidden py-28 bg-[#050914] text-white"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(30,58,138,0.55),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(249,115,22,0.18),_transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.4) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-400/30 bg-orange-400/5 text-orange-300 text-xs font-medium mb-6 backdrop-blur tracking-wider">
            <Bot className="w-3.5 h-3.5" />
            NICS AI TRADER ACCESS
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 leading-[1.05]">
            Choose Your Markets.{" "}
            <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              Start Trading with NICS.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-6">
            Select your markets, pay securely with Telegram Stars and receive AI-built intraday trade plans directly in Telegram.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Zap, label: "Instant Telegram activation" },
              { icon: ShieldCheck, label: "No setup fee" },
              { icon: Target, label: "Entry, SL and TP1–TP4" },
            ].map((b) => (
              <div
                key={b.label}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-white/75 backdrop-blur"
              >
                <b.icon className="w-3.5 h-3.5 text-orange-300" />
                {b.label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Period selector */}
        <div className="flex justify-center mb-10">
          <div
            role="tablist"
            aria-label="Access period"
            className="inline-flex p-1 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur"
          >
            {(["7d", "30d"] as Period[]).map((p) => (
              <button
                key={p}
                role="tab"
                aria-selected={period === p}
                onClick={() => setPeriod(p)}
                className={`relative px-5 py-2 text-sm rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                  period === p ? "text-black" : "text-white/70 hover:text-white"
                }`}
              >
                {period === p && (
                  <motion.span
                    layoutId="periodPill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-amber-400"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">{p === "7d" ? "7 Days" : "30 Days"}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
          {plans.map((plan, index) => {
            const priceBlock = plan.prices?.[period];
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
                <div className="relative h-full rounded-[calc(1.5rem-1px)] bg-[#0a0f1f]/90 backdrop-blur-xl p-7 flex flex-col overflow-hidden">
                  <div
                    className={`absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl transition-opacity duration-500 ${
                      plan.featured
                        ? "bg-orange-500/25 opacity-100"
                        : plan.free
                        ? "bg-white/10 opacity-60 group-hover:opacity-100"
                        : "bg-blue-500/15 opacity-60 group-hover:opacity-100"
                    }`}
                  />

                  {plan.badge && (
                    <div
                      className={`absolute top-5 right-5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ${
                        plan.free
                          ? "bg-white/10 text-white/80 border border-white/15"
                          : "bg-gradient-to-r from-orange-400 to-amber-400 text-black"
                      }`}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <h3 className="relative text-xl font-semibold mb-2 mt-1">{plan.name}</h3>
                  <p className="relative text-sm text-white/70 mb-4 leading-relaxed min-h-[42px]">
                    {plan.subtitle}
                  </p>
                  <p className="relative text-xs text-orange-300/90 mb-5 min-h-[32px]">
                    {plan.markets}
                  </p>

                  <div className="relative mb-6 pb-6 border-b border-white/10 min-h-[92px]">
                    {plan.free ? (
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-semibold text-white">{plan.priceFree}</span>
                          <span className="text-sm text-white/50">{plan.priceSecondary}</span>
                        </div>
                        <p className="text-xs text-white/50 mt-2">No payment required</p>
                      </div>
                    ) : priceBlock ? (
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={period}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25 }}
                        >
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className="text-3xl font-semibold text-white">{priceBlock.stars}</span>
                            <Star className="w-5 h-5 text-amber-300 fill-amber-300" />
                            <span className="text-sm text-white/50">Stars</span>
                          </div>
                          <p className="text-xs text-white/55 mt-2">{priceBlock.eur}</p>
                        </motion.div>
                      </AnimatePresence>
                    ) : null}
                  </div>

                  <ul className="relative space-y-2.5 mb-6 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-white/75">
                        <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-orange-400/15 border border-orange-400/40 flex items-center justify-center">
                          <Check className="w-3 h-3 text-orange-300" />
                        </span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={TELEGRAM_BOT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full font-medium text-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1f] ${
                      plan.featured
                        ? "bg-gradient-to-r from-orange-400 to-amber-400 text-black hover:shadow-lg hover:shadow-orange-500/40"
                        : plan.free
                        ? "bg-white/[0.06] border border-white/15 text-white hover:bg-white/10"
                        : "bg-white/5 border border-white/15 text-white hover:bg-white/10 hover:border-orange-400/40"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Markets Covered */}
        <div className="mt-24 max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Markets Covered by{" "}
              <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                NICS
              </span>
            </h3>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {markets.map((m) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="group relative rounded-2xl p-[1px] bg-gradient-to-b from-white/15 to-transparent"
              >
                <div className="h-full rounded-[calc(1rem-1px)] bg-[#0a0f1f]/90 backdrop-blur-xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                      <m.icon className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold">{m.name}</div>
                      <div className="text-xs text-orange-300/90">{m.symbol}</div>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed mb-4">{m.desc}</p>
                  <div className="text-xs text-white/55 pt-3 border-t border-white/10">
                    {m.availability}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How payment works */}
        <div className="mt-24 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight">How Payment Works</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { n: "1", title: "Select your markets", desc: "Pick the coverage that fits your trading style." },
              { n: "2", title: "Open NICS in Telegram", desc: "Tap any plan button to launch the NICS AI bot." },
              { n: "3", title: "Pay with Telegram Stars", desc: "Confirm inside Telegram and get instant access." },
            ].map((s) => (
              <div key={s.n} className="rounded-2xl p-[1px] bg-gradient-to-b from-white/15 to-transparent">
                <div className="h-full rounded-[calc(1rem-1px)] bg-[#0a0f1f]/90 backdrop-blur-xl p-6">
                  <div className="w-10 h-10 rounded-full bg-orange-400/15 border border-orange-400/40 text-orange-300 flex items-center justify-center font-semibold mb-4">
                    {s.n}
                  </div>
                  <div className="text-lg font-semibold mb-1.5">{s.title}</div>
                  <p className="text-sm text-white/65 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-white/55 leading-relaxed text-center max-w-3xl mx-auto mt-8">
            Payments are completed securely inside Telegram using Telegram Stars. Approximate euro values are provided only as a reference. The final local price may vary by platform, region, package and applicable taxes and is always shown by Telegram before payment.
          </p>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 max-w-4xl mx-auto"
        >
          <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-orange-400/50 via-white/10 to-blue-400/40">
            <div className="relative rounded-[calc(1.5rem-1px)] bg-[#0a0f1f]/95 backdrop-blur-xl p-8 md:p-12 text-center overflow-hidden">
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl" />
              <h3 className="relative text-2xl md:text-4xl font-semibold mb-4 leading-tight">
                Ready to trade with NICS?
              </h3>
              <p className="relative text-white/70 max-w-2xl mx-auto mb-8">
                Open the NICS AI trader agent on Telegram — activation is instant.
              </p>
              <a
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 text-black font-semibold hover:shadow-xl hover:shadow-orange-500/40 transition-all"
              >
                Open @nics_ai_bot
                <ArrowRight className="w-4 h-4" />
              </a>
              <p className="relative text-xs text-white/50 leading-relaxed max-w-3xl mx-auto mt-8">
                Trading involves substantial risk. NICS provides AI-generated market analysis and trading signals, not financial advice. Results and profits are not guaranteed. NFA.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AISalesAssistant;

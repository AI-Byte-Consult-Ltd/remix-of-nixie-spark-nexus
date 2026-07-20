import { motion } from "framer-motion";
import {
  MessageCircle,
  Send,
  Bot,
  ArrowRight,
  Check,
  LineChart,
  Sparkles,
  Crown,
  TrendingUp,
  Activity,
  Newspaper,
  Infinity as InfinityIcon,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { traderCopy, type Lang } from "./aiTraderPlansI18n";

const REVOLUT_URL = "https://revolut.me/REPLACE-WITH-REAL-LINK";

interface Plan {
  id: string;
  icon: typeof Bot;
  name: string;
  setup?: string;
  monthly: string;
  monthlyLabel?: string;
  oldPrice?: string;
  priceNote?: string;
  tag?: string;
  tagline: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
  lifetime?: boolean;
}

const channelBubbles = [
  { label: "Gold", icon: TrendingUp, x: "6%", y: "18%", delay: 0 },
  { label: "Forex", icon: LineChart, x: "18%", y: "72%", delay: 0.6 },
  { label: "Oil", icon: Activity, x: "84%", y: "22%", delay: 1.2 },
  { label: "Telegram", icon: Send, x: "88%", y: "70%", delay: 1.8 },
  { label: "WhatsApp", icon: MessageCircle, x: "72%", y: "88%", delay: 2.4 },
  { label: "Market News", icon: Newspaper, x: "12%", y: "40%", delay: 3.0 },
];

const AISalesAssistant = () => {
  const { language } = useLanguage();
  const c = traderCopy[(language as Lang)] || traderCopy.en;

  const plans: Plan[] = [
    {
      id: "essential",
      icon: LineChart,
      name: c.essential.name,
      setup: "€149",
      monthly: "€49.99",
      tagline: c.essential.tagline,
      description: c.essential.description,
      features: c.essential.features,
      cta: c.essential.cta,
      href: REVOLUT_URL,
    },
    {
      id: "professional",
      icon: Sparkles,
      name: c.professional.name,
      setup: "€249",
      monthly: "€99.99",
      tag: c.professional.tag,
      tagline: c.professional.tagline,
      description: c.professional.description,
      features: c.professional.features,
      cta: c.professional.cta,
      href: REVOLUT_URL,
      featured: true,
    },
    {
      id: "elite",
      icon: Crown,
      name: c.elite.name,
      setup: "€499",
      monthly: "€349",
      tagline: c.elite.tagline,
      description: c.elite.description,
      features: c.elite.features,
      cta: c.elite.cta,
      href: REVOLUT_URL,
    },
    {
      id: "lifetime",
      icon: InfinityIcon,
      name: "AI Trader Lifetime",
      oldPrice: "€1,499",
      monthly: "€999",
      monthlyLabel: "one-time",
      tag: "Founding Member Offer",
      priceNote:
        "Available to the first founding members only. After the launch offer ends, the price returns to €1,499.",
      tagline: "One payment. Lifetime access.",
      description:
        "Lifetime access to the complete AI trading service with no recurring monthly payments.",
      features: [
        "Lifetime access",
        "No monthly payments",
        "All supported markets",
        "Up to 10 carefully selected AI trade opportunities per day",
        "Multiple AI trading strategies",
        "Future AI upgrades included",
        "Premium market reports",
        "VIP priority alerts",
        "Dedicated VIP support",
        "Founding Member status",
        "Priority access to new AI features",
      ],
      cta: "Get Lifetime Access",
      href: REVOLUT_URL,
      lifetime: true,
    },
  ];

  const pipelineIcons = [Activity, Bot, LineChart, Send, TrendingUp];
  const pipeline = c.pipeline.map((label, i) => ({
    icon: pipelineIcons[i],
    label,
  }));

  return (
    <section
      id="sci-products"
      className="relative overflow-hidden py-28 bg-[#050914] text-white"
    >
      {/* Ambient background */}
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

        {/* Flowing neural lines */}
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="neuralLine" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(96,165,250,0)" />
              <stop offset="50%" stopColor="rgba(96,165,250,0.55)" />
              <stop offset="100%" stopColor="rgba(249,115,22,0)" />
            </linearGradient>
          </defs>
          {[0.15, 0.35, 0.55, 0.75].map((y, i) => (
            <motion.path
              key={i}
              d={`M -50 ${y * 800} Q ${300 + i * 80} ${y * 800 - 80} ${600 + i * 40} ${y * 800 + 40} T 1600 ${y * 800}`}
              stroke="url(#neuralLine)"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 3, delay: i * 0.4, ease: "easeInOut" }}
            />
          ))}
        </svg>

        {/* Floating channel bubbles */}
        {channelBubbles.map((b) => (
          <motion.div
            key={b.label}
            className="absolute hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs text-white/70"
            style={{ left: b.x, top: b.y }}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: [0, 1, 1, 0.7, 1],
              y: [20, 0, -8, 0, 20],
            }}
            transition={{
              duration: 8,
              delay: b.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <b.icon className="w-3.5 h-3.5 text-orange-400" />
            {b.label}
          </motion.div>
        ))}
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-400/30 bg-orange-400/5 text-orange-300 text-xs font-medium mb-6 backdrop-blur">
            <Bot className="w-3.5 h-3.5" />
            {c.badge}
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 leading-[1.05]">
            {c.title1}{" "}
            <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              {c.title2}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-4">
            {c.subtitle}
          </p>
        </motion.div>

        {/* Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto mb-20"
        >
          <div className="relative flex flex-wrap items-center justify-center gap-3 md:gap-2 p-5 md:p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl">
            {pipeline.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3 md:gap-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-gradient-to-br from-white/10 to-white/[0.02] border border-white/10"
                >
                  <step.icon className="w-4 h-4 text-orange-300" />
                  <span className="text-xs md:text-sm text-white/85 whitespace-nowrap">
                    {step.label}
                  </span>
                </motion.div>
                {i < pipeline.length - 1 && (
                  <motion.div
                    animate={{ x: [0, 4, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  >
                    <ArrowRight className="w-4 h-4 text-orange-400/70" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -6 }}
              className={`group relative rounded-3xl p-[1px] ${
                plan.featured
                  ? "bg-gradient-to-b from-orange-400/60 via-orange-400/20 to-transparent"
                  : plan.lifetime
                  ? "bg-gradient-to-b from-amber-300/70 via-amber-500/30 to-blue-500/20"
                  : "bg-gradient-to-b from-white/15 to-transparent"
              }`}
            >
              <div className="relative h-full rounded-[calc(1.5rem-1px)] bg-[#0a0f1f]/90 backdrop-blur-xl p-8 flex flex-col overflow-hidden">
                {/* Glow */}
                <div
                  className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl transition-opacity duration-500 ${
                    plan.featured
                      ? "bg-orange-500/25 opacity-100"
                      : plan.lifetime
                      ? "bg-amber-400/25 opacity-100"
                      : "bg-blue-500/20 opacity-60 group-hover:opacity-100"
                  }`}
                />

                {plan.tag && (
                  <div className={`absolute top-5 right-5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold ${
                    plan.lifetime
                      ? "bg-gradient-to-r from-amber-300 to-amber-500 text-black"
                      : "bg-orange-400 text-black"
                  }`}>
                    {plan.tag}
                  </div>
                )}

                <motion.div
                  whileHover={{ rotate: 8, scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 250 }}
                  className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/25"
                >
                  <plan.icon className="w-7 h-7 text-black" />
                </motion.div>

                <h3 className="relative text-2xl font-semibold mb-2">
                  {plan.name}
                </h3>
                <p className="relative text-sm text-orange-300/90 mb-5">
                  {plan.tagline}
                </p>

                <div className="relative mb-6 pb-6 border-b border-white/10">
                  {plan.lifetime ? (
                    <>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg text-white/40 line-through">{plan.oldPrice}</span>
                        <span className="text-[10px] uppercase tracking-wider text-amber-300/90 font-semibold">
                          Launch price
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-semibold">{plan.monthly}</span>
                        <span className="text-sm text-white/50">{plan.monthlyLabel}</span>
                      </div>
                      {plan.priceNote && (
                        <p className="text-xs text-white/50 mt-3 leading-relaxed">
                          {plan.priceNote}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg text-white/40 line-through">{plan.setup}</span>
                        <span className="text-xs text-white/60">{c.setupFee}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-emerald-400/15 text-emerald-300 border border-emerald-400/30">
                          Free
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-3xl font-semibold text-white">
                          {plan.monthly}
                        </span>
                        <span className="text-sm text-white/50">{c.perMonth}</span>
                      </div>
                    </>
                  )}
                </div>

                <p className="relative text-sm text-white/70 leading-relaxed mb-6">
                  {plan.description}
                </p>

                <ul className="relative space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f, i) => (
                    <motion.li
                      key={f}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.04 }}
                      className="flex items-start gap-3 text-sm text-white/75"
                    >
                      <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-orange-400/15 border border-orange-400/40 flex items-center justify-center">
                        <Check className="w-3 h-3 text-orange-300" />
                      </span>
                      <span>{f}</span>
                    </motion.li>
                  ))}
                </ul>

                <a
                  href={plan.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`relative inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full font-medium text-sm transition-all duration-300 ${
                    plan.featured
                      ? "bg-gradient-to-r from-orange-400 to-amber-400 text-black hover:shadow-lg hover:shadow-orange-500/40"
                      : plan.lifetime
                      ? "bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 text-black hover:shadow-lg hover:shadow-amber-500/40"
                      : "bg-white/5 border border-white/15 text-white hover:bg-white/10 hover:border-orange-400/40"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
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
                {c.finalTitle}
              </h3>
              <p className="relative text-white/70 max-w-2xl mx-auto mb-8">
                {c.finalDesc}
              </p>
              <a
                href="#contact"
                className="relative inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 text-black font-semibold hover:shadow-xl hover:shadow-orange-500/40 transition-all"
              >
                {c.finalCta}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AISalesAssistant;
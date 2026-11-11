import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Bot, Check, CreditCard, ShieldCheck, Target, Zap } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizedPlans, plansUi } from "@/i18n/traderPlans";
import {
  formatPrice,
  TELEGRAM_BOT_URL,
  TRIAL_BOT_URL,
  type Currency,
  type Period,
} from "@/data/nicsTraderPlans";

const NicsTraderPlans = () => {
  const { language } = useLanguage();
  const ui = plansUi(language);
  const plans = localizedPlans(language);
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
            {ui.title1}{" "}
            <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              {ui.title2}
            </span>
          </h2>
          <p className="mb-6 text-lg leading-relaxed text-white/70 md:text-xl">
            {ui.desc}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { icon: Zap, label: ui.chips[0] },
              { icon: ShieldCheck, label: ui.chips[1] },
              { icon: Target, label: ui.chips[2] },
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
            {(["7d", "30d", "90d"] as Period[]).map((value) => (
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
                <span className="relative">
                  {ui.periods[value]}
                </span>
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

        <div className="mx-auto grid max-w-4xl items-stretch gap-6 md:grid-cols-2">
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
                          <span className="text-3xl font-semibold text-white">{plan.trialPrice ?? "€1.99"}</span>
                          <span className="text-sm text-white/50">{ui.trialLabel}</span>
                        </div>
                        <p className="mt-2 text-xs text-white/50">{plan.trialNote}</p>
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
                          <p className="mt-2 text-xs text-white/55">{ui.periodFor[period]}</p>
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

                  {plan.free ? (
                    <a
                      href={TRIAL_BOT_URL}
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
                  ) : (
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className={`relative inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0f1f] ${
                            plan.featured
                              ? "bg-gradient-to-r from-orange-400 to-amber-400 text-black hover:shadow-lg hover:shadow-orange-500/40"
                              : "border border-white/15 bg-white/5 text-white hover:border-orange-400/40 hover:bg-white/10"
                          }`}
                        >
                          {plan.cta}
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </DialogTrigger>
                      <DialogContent className="border-white/10 bg-[#0a0f1f] text-white sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="text-white">{plan.name}</DialogTitle>
                          <DialogDescription className="text-white/60">
                            {ui.periods[period]} ·{" "}
                            {amount !== undefined ? formatPrice(amount, currency) : ""} — {ui.choosePay}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-3 pt-1">
                          <a
                            href={TELEGRAM_BOT_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:border-orange-400/40 hover:bg-white/10"
                          >
                            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-orange-400/30 bg-orange-400/15">
                              <Bot className="h-5 w-5 text-orange-300" />
                            </span>
                            <span className="flex-1">
                              <span className="block text-sm font-medium text-white">{ui.starsTitle}</span>
                              <span className="block text-xs text-white/55">
                                {ui.starsDesc}
                              </span>
                            </span>
                            <ArrowRight className="h-4 w-4 flex-shrink-0 text-white/40" />
                          </a>

                          <Link
                            to="/cabinet/subscription"
                            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:border-orange-400/40 hover:bg-white/10"
                          >
                            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10">
                              <CreditCard className="h-5 w-5 text-white/80" />
                            </span>
                            <span className="flex-1">
                              <span className="block text-sm font-medium text-white">{ui.cardTitle}</span>
                              <span className="block text-xs text-white/55">
                                {currency === "EUR" ? ui.cardDescEur : ui.cardDescUsd}
                              </span>
                            </span>
                            <ArrowRight className="h-4 w-4 flex-shrink-0 text-white/40" />
                          </Link>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-3 text-sm text-white/75 md:grid-cols-3">
          {ui.explain.map((box) => (
            <div key={box.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="font-semibold text-white">{box.title}</p>
              <p className="mt-1">{box.body}</p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-relaxed text-white/50">
          {ui.disclaimer}
        </p>
      </div>
    </section>
  );
};

export default NicsTraderPlans;

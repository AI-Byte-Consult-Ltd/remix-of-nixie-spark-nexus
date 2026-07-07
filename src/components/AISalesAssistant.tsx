import { motion } from "framer-motion";
import {
  MessageCircle,
  Send,
  Globe,
  Bot,
  Users,
  Database,
  ArrowRight,
  Check,
  ClipboardList,
  Rocket,
  Sparkles,
  Filter,
  Handshake,
  Home,
  Hammer,
  Package,
  Briefcase,
  Stethoscope,
  Plane,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface Plan {
  id: string;
  icon: typeof Bot;
  name: string;
  price: string;
  monthly?: string;
  tag?: string;
  tagline: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
}

const channelBubbles = [
  { label: "Website", icon: Globe, x: "6%", y: "18%", delay: 0 },
  { label: "WhatsApp", icon: MessageCircle, x: "18%", y: "72%", delay: 0.6 },
  { label: "Telegram", icon: Send, x: "84%", y: "22%", delay: 1.2 },
  { label: "Messenger", icon: MessageCircle, x: "88%", y: "70%", delay: 1.8 },
  { label: "CRM", icon: Database, x: "72%", y: "88%", delay: 2.4 },
  { label: "Human Manager", icon: Users, x: "12%", y: "40%", delay: 3.0 },
];

const AISalesAssistant = () => {
  const { t } = useLanguage();

  const plans: Plan[] = [
    {
      id: "audit",
      icon: ClipboardList,
      name: t("aisa.audit.name"),
      price: t("aisa.audit.price"),
      tagline: t("aisa.audit.tagline"),
      description: t("aisa.audit.desc"),
      features: [1, 2, 3, 4, 5, 6].map((i) => t(`aisa.audit.f${i}`)),
      cta: t("aisa.audit.cta"),
      href: "#contact",
    },
    {
      id: "starter",
      icon: Rocket,
      name: t("aisa.starter.name"),
      price: t("aisa.starter.price"),
      monthly: t("aisa.starter.monthly"),
      tag: t("aisa.starter.tag"),
      tagline: t("aisa.starter.tagline"),
      description: t("aisa.starter.desc"),
      features: [1, 2, 3, 4, 5, 6, 7, 8].map((i) => t(`aisa.starter.f${i}`)),
      cta: t("aisa.starter.cta"),
      href: "#contact",
      featured: true,
    },
    {
      id: "pro",
      icon: Sparkles,
      name: t("aisa.pro.name"),
      price: t("aisa.pro.price"),
      monthly: t("aisa.pro.monthly"),
      tagline: t("aisa.pro.tagline"),
      description: t("aisa.pro.desc"),
      features: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => t(`aisa.pro.f${i}`)),
      cta: t("aisa.pro.cta"),
      href: "#contact",
    },
  ];

  const pipeline = [
    { icon: Users, label: t("aisa.pipe.visitor") },
    { icon: Bot, label: t("aisa.pipe.ai") },
    { icon: Filter, label: t("aisa.pipe.qualify") },
    { icon: Database, label: t("aisa.pipe.crm") },
    { icon: Handshake, label: t("aisa.pipe.deal") },
  ];

  const audiences = [
    { icon: Home, label: t("aisa.aud.realestate") },
    { icon: Hammer, label: t("aisa.aud.construction") },
    { icon: Package, label: t("aisa.aud.custom") },
    { icon: Briefcase, label: t("aisa.aud.services") },
    { icon: Stethoscope, label: t("aisa.aud.clinics") },
    { icon: Plane, label: t("aisa.aud.travel") },
  ];

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
            AI Sales Automation
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 leading-[1.05]">
            AI Sales Assistant for{" "}
            <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-amber-300 bg-clip-text text-transparent">
              WhatsApp, Telegram & Website
            </span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-4">
            Stop losing hours on repetitive client messages. Our AI assistant
            answers first, qualifies prospects, follows a sales conversation
            flow, and hands over only serious leads to your team.
          </p>
          <p className="text-sm md:text-base text-white/50">
            Built for high-ticket service businesses, real estate teams,
            construction companies, custom product manufacturers, and businesses
            where every lead matters.
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
        <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
                  : "bg-gradient-to-b from-white/15 to-transparent"
              }`}
            >
              <div className="relative h-full rounded-[calc(1.5rem-1px)] bg-[#0a0f1f]/90 backdrop-blur-xl p-8 flex flex-col overflow-hidden">
                {/* Glow */}
                <div
                  className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl transition-opacity duration-500 ${
                    plan.featured
                      ? "bg-orange-500/25 opacity-100"
                      : "bg-blue-500/20 opacity-60 group-hover:opacity-100"
                  }`}
                />

                {plan.tag && (
                  <div className="absolute top-5 right-5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-orange-400 text-black">
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
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold">{plan.price}</span>
                    <span className="text-sm text-white/50">
                      {plan.id === "audit" ? "one-time" : "setup"}
                    </span>
                  </div>
                  {plan.monthly && (
                    <div className="text-sm text-white/60 mt-1">
                      {plan.monthly}
                    </div>
                  )}
                </div>

                <p className="relative text-sm text-white/70 leading-relaxed mb-6">
                  {plan.description}
                </p>

                <ul className="relative space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-sm text-white/75"
                    >
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-400" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.href}
                  className={`relative inline-flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-full font-medium text-sm transition-all duration-300 ${
                    plan.featured
                      ? "bg-gradient-to-r from-orange-400 to-amber-400 text-black hover:shadow-lg hover:shadow-orange-500/40"
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

        {/* Who is this for */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-24 max-w-5xl mx-auto text-center"
        >
          <h3 className="text-2xl md:text-3xl font-semibold mb-4">
            Who is this for?
          </h3>
          <p className="text-white/65 max-w-3xl mx-auto mb-8 leading-relaxed">
            This is for businesses where clients ask the same questions every
            day before buying: prices, availability, details, delivery,
            consultation, documents, location, materials, timing or next steps.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {audiences.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                whileHover={{ y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/12 bg-white/[0.04] backdrop-blur text-sm text-white/85 hover:border-orange-400/40 hover:text-white transition-colors"
              >
                <a.icon className="w-4 h-4 text-orange-300" />
                {a.label}
              </motion.div>
            ))}
          </div>
        </motion.div>

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
                Not sure if your business needs an AI assistant?
              </h3>
              <p className="relative text-white/70 max-w-2xl mx-auto mb-8">
                Book an AI Lead Audit and we will show exactly where automation
                can save time, qualify clients and reduce manual replies.
              </p>
              <a
                href="#contact"
                className="relative inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 text-black font-semibold hover:shadow-xl hover:shadow-orange-500/40 transition-all"
              >
                Book AI Audit
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
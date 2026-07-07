import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  Eye,
  TrendingUp,
  Building2,
  UtensilsCrossed,
  Mountain,
  Globe2,
  Users,
  PawPrint,
  X,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

type Status = "Live" | "Alpha" | "Training Active" | "Research Active" | "Coming Soon";

interface EcosystemModule {
  id: string;
  name: string;
  icon: typeof Brain;
  status: Status;
  short: string;
  tags: string[];
  who: string;
  connection: string;
  cta: { label: string; href: string; external?: boolean };
}

const modules: EcosystemModule[] = [
  {
    id: "llm",
    name: "NICS LLM",
    icon: Brain,
    status: "Training Active",
    short:
      "Proprietary multilingual language model trained on Project Gutenberg corpus.",
    tags: ["LLM", "Gutenberg-trained", "Multilingual"],
    who: "Researchers, product teams and enterprises that need an independent, sovereign language model.",
    connection:
      "The linguistic core of the NICS AI Ecosystem — powers reasoning, dialogue and multilingual understanding across every platform.",
    cta: { label: "View NICS Ecosystem", href: "/nics-ecosystem" },
  },
  {
    id: "visual",
    name: "NICS Visual AI",
    icon: Eye,
    status: "Research Active",
    short:
      "Computer vision model trained on Earth and NASA imagery for minerals, materials and complex scene recognition.",
    tags: ["Computer Vision", "NASA Imagery", "Science AI"],
    who: "Geologists, scientific labs, mining companies and Earth-observation teams.",
    connection:
      "The eyes of NICS — feeds visual understanding into the LLM and downstream platforms like NICS AI Geologist.",
    cta: { label: "Explore Research", href: "/nics-ecosystem" },
  },
  {
    id: "trading",
    name: "NICS Trading",
    icon: TrendingUp,
    status: "Live",
    short:
      "AI-assisted trading intelligence for Forex, Gold, Crypto and multi-asset market analysis.",
    tags: ["Trading", "Gold", "Crypto", "Forex"],
    who: "Active traders, funds and institutions seeking data-driven multi-asset intelligence.",
    connection:
      "Applies NICS reasoning to live financial markets — real-time signals and structured market analysis.",
    cta: { label: "Explore NICS Trading", href: "https://fwd.cx/Yj25BCrDzEHB", external: true },
  },
  {
    id: "architect",
    name: "NICS Architect",
    icon: Building2,
    status: "Coming Soon",
    short:
      "3D planning and visualization platform for apartments, houses, interiors and land plots.",
    tags: ["3D Design", "Architecture", "Visualization"],
    who: "Architects, developers, interior designers and real-estate owners.",
    connection:
      "Turns NICS spatial intelligence into a design engine for real-world properties and interiors.",
    cta: { label: "View NICS Architect", href: "/estate" },
  },
  {
    id: "horeca",
    name: "NICS AI HoReCa",
    icon: UtensilsCrossed,
    status: "Coming Soon",
    short:
      "AI automation platform for restaurants, bars and cafés with voice interaction, smart ordering and POS/CRM integration.",
    tags: ["Restaurants", "Voice AI", "Automation"],
    who: "Restaurant groups, hotels, bars and hospitality chains.",
    connection:
      "Deploys NICS voice + reasoning into hospitality — automating orders, service and back-office operations.",
    cta: { label: "Request Similar Platform", href: "#contact" },
  },
  {
    id: "geologist",
    name: "NICS AI Geologist",
    icon: Mountain,
    status: "Coming Soon",
    short:
      "AI platform connecting geology, mining, historical archives and exploration data.",
    tags: ["Geology", "Mining", "Research"],
    who: "Mining companies, exploration teams and geological institutes.",
    connection:
      "Combines NICS LLM with Visual AI to fuse historical archives, field data and satellite imagery.",
    cta: { label: "Discover Geologist AI", href: "https://nics.space", external: true },
  },
  {
    id: "aquaterra",
    name: "AquaTerra World",
    icon: Globe2,
    status: "Alpha",
    short:
      "Immersive AI-driven metaverse for virtual collaboration, creativity and digital economy.",
    tags: ["Metaverse", "AI", "Virtual World"],
    who: "Creators, brands and communities building persistent virtual spaces.",
    connection:
      "Places NICS agents inside an immersive world — the social + creative layer of the ecosystem.",
    cta: { label: "Enter AquaTerra", href: "https://aquaterra.world", external: true },
  },
  {
    id: "pride",
    name: "PRIDE Social Network",
    icon: Users,
    status: "Live",
    short:
      "Decentralized Web3 community platform rewarding creativity and engagement.",
    tags: ["Web3", "Social", "Token Economy"],
    who: "Creators and communities seeking a fair, token-rewarded social layer.",
    connection:
      "The community layer — where NICS-powered experiences meet a decentralized identity and reward system.",
    cta: { label: "Discover PRIDE Network", href: "https://pridesocial.org", external: true },
  },
  {
    id: "animals",
    name: "Animals Foundation",
    icon: PawPrint,
    status: "Coming Soon",
    short:
      "AI and blockchain platform for animal welfare, rescue coordination and wildlife protection.",
    tags: ["Animals", "Foundation", "Blockchain"],
    who: "Shelters, NGOs, veterinary networks and wildlife protection groups.",
    connection:
      "Applies NICS coordination and vision models to animal welfare and rescue logistics.",
    cta: { label: "Support the Foundation", href: "https://yorkie.aibyteconsult.com/", external: true },
  },
];

const statusStyles: Record<Status, string> = {
  Live: "bg-emerald-400/10 text-emerald-300 border-emerald-400/30",
  Alpha: "bg-primary/10 text-primary border-primary/30",
  "Training Active": "bg-amber-300/10 text-amber-200 border-amber-300/30",
  "Research Active": "bg-cyan-300/10 text-cyan-200 border-cyan-300/30",
  "Coming Soon": "bg-white/5 text-white/60 border-white/15",
};

const OrbitDot = ({ delay = 0 }: { delay?: number }) => (
  <motion.span
    className="absolute w-1 h-1 rounded-full bg-amber-300/70 shadow-[0_0_8px_2px_rgba(251,191,36,0.6)]"
    animate={{ opacity: [0.2, 1, 0.2] }}
    transition={{ duration: 3, repeat: Infinity, delay }}
  />
);

const OurEcosystem = () => {
  const { t } = useLanguage();
  const [active, setActive] = useState<EcosystemModule | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Positions around the core on desktop (percent of container)
  const positions = useMemo(() => {
    const n = modules.length;
    return modules.map((_, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
      const rx = 38; // horizontal radius %
      const ry = 34; // vertical radius %
      return {
        x: 50 + Math.cos(angle) * rx,
        y: 50 + Math.sin(angle) * ry,
      };
    });
  }, []);

  // Prevent body scroll when detail panel is open
  useEffect(() => {
    if (active) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [active]);

  return (
    <section
      id="ecosystem"
      className="relative py-24 md:py-32 overflow-hidden bg-[#07070b] text-white"
    >
      {/* Cinematic background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(251,191,36,0.10), transparent 55%), radial-gradient(ellipse at 20% 80%, rgba(59,130,246,0.08), transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(20,184,166,0.08), transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 75%)",
          }}
        />
        {/* Floating particles */}
        {Array.from({ length: 30 }).map((_, i) => {
          const left = (i * 37) % 100;
          const top = (i * 53) % 100;
          return (
            <motion.span
              key={i}
              className="absolute w-[3px] h-[3px] rounded-full bg-white/40"
              style={{ left: `${left}%`, top: `${top}%` }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.15, 0.6, 0.15],
              }}
              transition={{
                duration: 6 + (i % 5),
                repeat: Infinity,
                delay: (i % 7) * 0.4,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      <div className="container mx-auto px-4 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 md:mb-20 space-y-4"
        >
          <div className="text-[11px] tracking-[0.35em] text-amber-300/80 font-medium">
            {t("oureco.eyebrow")}
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight">
            {t("oureco.title1")}{" "}
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              {t("oureco.title2")}
            </span>
          </h2>
          <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            {t("oureco.desc")}
          </p>
        </motion.div>

        {/* Ecosystem Map — Desktop / Tablet constellation */}
        <div className="relative hidden md:block max-w-6xl mx-auto">
          <div className="relative w-full aspect-[16/11]">
            {/* Connection lines */}
            <svg
              ref={svgRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(251,191,36,0.9)" />
                  <stop offset="100%" stopColor="rgba(251,191,36,0.05)" />
                </linearGradient>
              </defs>
              {positions.map((p, i) => {
                const isActive = hovered === modules[i].id;
                return (
                  <motion.line
                    key={modules[i].id}
                    x1={50}
                    y1={50}
                    x2={p.x}
                    y2={p.y}
                    stroke="url(#lineGrad)"
                    strokeWidth={isActive ? 0.35 : 0.15}
                    strokeDasharray="0.6 0.8"
                    initial={{ opacity: 0, pathLength: 0 }}
                    whileInView={{ opacity: isActive ? 1 : 0.35, pathLength: 1 }}
                    animate={{ opacity: isActive ? 1 : 0.35 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.1 * i }}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
            </svg>

            {/* Central Core */}
            <motion.button
              type="button"
              onClick={() => {
                const el = document.getElementById("ecosystem-cta");
                el?.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 group"
            >
              <div className="relative w-48 h-48 lg:w-56 lg:h-56 rounded-full flex items-center justify-center">
                {/* Rings */}
                <motion.div
                  className="absolute inset-0 rounded-full border border-amber-300/20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_10px_2px_rgba(251,191,36,0.8)]" />
                </motion.div>
                <motion.div
                  className="absolute inset-4 rounded-full border border-white/10"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
                />
                {/* Glow */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/25 via-amber-500/10 to-transparent blur-2xl" />
                <div className="relative w-32 h-32 lg:w-36 lg:h-36 rounded-full bg-gradient-to-br from-[#141018] to-[#0a0a10] border border-amber-300/30 shadow-[0_0_60px_-10px_rgba(251,191,36,0.6)] flex flex-col items-center justify-center text-center px-4">
                  <div className="text-[10px] tracking-[0.3em] text-amber-300/80 mb-1">
                    NICS AI
                  </div>
                  <div className="text-sm lg:text-base font-semibold leading-tight">
                    Ecosystem
                  </div>
                  <div className="text-[10px] text-white/40 mt-1">
                    Independent AI Stack
                  </div>
                </div>
              </div>
            </motion.button>

            {/* Modules */}
            {modules.map((m, i) => {
              const p = positions[i];
              const Icon = m.icon;
              return (
                <motion.button
                  type="button"
                  key={m.id}
                  onClick={() => setActive(m)}
                  onMouseEnter={() => setHovered(m.id)}
                  onMouseLeave={() => setHovered(null)}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 * i }}
                  whileHover={{ scale: 1.06 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group text-left"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 5 + (i % 3),
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.3,
                    }}
                    className="relative"
                  >
                    <div
                      className={`relative w-[190px] rounded-2xl border backdrop-blur-xl px-4 py-3 transition-all duration-300 ${
                        hovered === m.id
                          ? "border-amber-300/50 bg-white/[0.06] shadow-[0_0_40px_-10px_rgba(251,191,36,0.5)]"
                          : "border-white/10 bg-white/[0.03] hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-300/20 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-amber-200" />
                        </div>
                        <div className="text-sm font-semibold truncate">
                          {m.name}
                        </div>
                      </div>
                      <div
                        className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full border ${statusStyles[m.status]}`}
                      >
                        <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                        {m.status}
                      </div>
                      <AnimatePresence>
                        {hovered === m.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <p className="text-[11px] text-white/60 leading-relaxed mt-2">
                              {m.short}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {m.tags.map((t) => (
                                <span
                                  key={t}
                                  className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-300/10 text-amber-200/80 border border-amber-300/20"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Mobile stacked list */}
        <div className="md:hidden space-y-3 max-w-xl mx-auto">
          <div className="relative rounded-2xl border border-amber-300/30 bg-gradient-to-br from-amber-400/10 to-transparent p-5 text-center">
            <div className="text-[10px] tracking-[0.3em] text-amber-300/80 mb-1">
              {t("oureco.core.label")}
            </div>
            <div className="text-lg font-semibold">{t("oureco.core.name")}</div>
            <div className="text-[11px] text-white/50">{t("oureco.core.stack")}</div>
          </div>
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setActive(m)}
                className="w-full text-left rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl px-4 py-4 hover:border-amber-300/40 transition-colors"
              >
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-300/20 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-amber-200" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold">{m.name}</div>
                    <div
                      className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border mt-1 ${statusStyles[m.status]}`}
                    >
                      <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                      {m.status}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/40" />
                </div>
                <p className="text-[12px] text-white/60 leading-relaxed">
                  {m.short}
                </p>
              </button>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          id="ecosystem-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative mt-20 md:mt-28 max-w-5xl mx-auto"
        >
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl p-8 md:p-12">
            <div
              className="absolute inset-0 opacity-60 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 20% 0%, rgba(251,191,36,0.18), transparent 55%), radial-gradient(ellipse at 100% 100%, rgba(20,184,166,0.12), transparent 55%)",
              }}
            />
            <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-4xl font-semibold tracking-tight leading-tight">
                  {t("oureco.cta.title1")}{" "}
                  <span className="bg-gradient-to-r from-amber-200 to-amber-400 bg-clip-text text-transparent">
                    {t("oureco.cta.title2")}
                  </span>
                </h3>
                <p className="text-white/60 mt-4 leading-relaxed">
                  {t("oureco.cta.desc")}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <a href="/nics-ecosystem">
                  <Button
                    size="lg"
                    className="w-full bg-amber-300 text-black hover:bg-amber-200"
                  >
                    {t("oureco.cta.btn1")} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </a>
                <a href="#contact">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white/20 bg-transparent text-white hover:bg-white/10"
                  >
                    {t("oureco.cta.btn2")} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setActive(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl rounded-3xl border border-amber-300/20 bg-[#0b0b12]/95 backdrop-blur-xl overflow-hidden shadow-[0_0_80px_-20px_rgba(251,191,36,0.5)]"
            >
              <div
                className="absolute inset-0 opacity-70 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 20% 0%, rgba(251,191,36,0.15), transparent 60%)",
                }}
              />
              <button
                onClick={() => setActive(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="relative p-6 md:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-300/30 flex items-center justify-center">
                    <active.icon className="w-6 h-6 text-amber-200" />
                  </div>
                  <div>
                    <div
                      className={`inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full border mb-1 ${statusStyles[active.status]}`}
                    >
                      <span className="w-1 h-1 rounded-full bg-current animate-pulse" />
                      {active.status}
                    </div>
                    <h3 className="text-2xl font-semibold">{active.name}</h3>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-white/70 leading-relaxed">
                  <div>
                    <div className="text-[10px] tracking-[0.25em] text-amber-300/80 mb-1">
                      WHAT IT DOES
                    </div>
                    <p>{active.short}</p>
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.25em] text-amber-300/80 mb-1">
                      WHO IT IS FOR
                    </div>
                    <p>{active.who}</p>
                  </div>
                  <div>
                    <div className="text-[10px] tracking-[0.25em] text-amber-300/80 mb-1">
                      HOW IT CONNECTS
                    </div>
                    <p>{active.connection}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {active.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-amber-300/10 text-amber-200/90 border border-amber-300/20"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <a
                    href={active.cta.href}
                    target={active.cta.external ? "_blank" : undefined}
                    rel={active.cta.external ? "noopener noreferrer" : undefined}
                  >
                    <Button className="bg-amber-300 text-black hover:bg-amber-200">
                      {active.cta.label}
                      {active.cta.external ? (
                        <ExternalLink className="w-4 h-4 ml-1" />
                      ) : (
                        <ArrowRight className="w-4 h-4 ml-1" />
                      )}
                    </Button>
                  </a>
                  <a href="#contact" onClick={() => setActive(null)}>
                    <Button
                      variant="outline"
                      className="border-white/20 bg-transparent text-white hover:bg-white/10"
                    >
                      Request Similar Platform
                    </Button>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default OurEcosystem;
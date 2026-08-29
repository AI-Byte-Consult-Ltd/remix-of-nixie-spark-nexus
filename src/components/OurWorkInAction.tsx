import { useRef, useState, useEffect } from "react";
import { motion, useInView, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import realestateAiImg from "@/assets/project-realestate-ai.jpg";
import architectureImg from "@/assets/project-architecture-3d.jpg";
import restaurantImg from "@/assets/project-restaurant-new.jpg";
import hotelImg from "@/assets/project-hotel-new.jpg";
import aquaterraImg from "@/assets/project-nft-new.jpg";

const prideImg = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1125" viewBox="0 0 900 1125">
  <defs>
    <radialGradient id="g1" cx="30%" cy="20%" r="60%"><stop offset="0%" stop-color="#ff3b30" stop-opacity="0.55"/><stop offset="100%" stop-color="#ff3b30" stop-opacity="0"/></radialGradient>
    <radialGradient id="g2" cx="80%" cy="15%" r="55%"><stop offset="0%" stop-color="#ff9500" stop-opacity="0.5"/><stop offset="100%" stop-color="#ff9500" stop-opacity="0"/></radialGradient>
    <radialGradient id="g3" cx="85%" cy="55%" r="55%"><stop offset="0%" stop-color="#ffd60a" stop-opacity="0.45"/><stop offset="100%" stop-color="#ffd60a" stop-opacity="0"/></radialGradient>
    <radialGradient id="g4" cx="20%" cy="60%" r="55%"><stop offset="0%" stop-color="#34c759" stop-opacity="0.5"/><stop offset="100%" stop-color="#34c759" stop-opacity="0"/></radialGradient>
    <radialGradient id="g5" cx="55%" cy="85%" r="55%"><stop offset="0%" stop-color="#0a84ff" stop-opacity="0.55"/><stop offset="100%" stop-color="#0a84ff" stop-opacity="0"/></radialGradient>
    <radialGradient id="g6" cx="15%" cy="90%" r="45%"><stop offset="0%" stop-color="#ff2d55" stop-opacity="0.5"/><stop offset="100%" stop-color="#ff2d55" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="900" height="1125" fill="#0a0a0f"/>
  <rect width="900" height="1125" fill="url(#g1)"/>
  <rect width="900" height="1125" fill="url(#g2)"/>
  <rect width="900" height="1125" fill="url(#g3)"/>
  <rect width="900" height="1125" fill="url(#g4)"/>
  <rect width="900" height="1125" fill="url(#g5)"/>
  <rect width="900" height="1125" fill="url(#g6)"/>
  <g stroke="#ffffff" stroke-opacity="0.35" stroke-width="1.5">
    <line x1="180" y1="260" x2="420" y2="180"/>
    <line x1="420" y1="180" x2="700" y2="300"/>
    <line x1="180" y1="260" x2="330" y2="480"/>
    <line x1="330" y1="480" x2="700" y2="300"/>
    <line x1="330" y1="480" x2="560" y2="640"/>
    <line x1="560" y1="640" x2="760" y2="560"/>
    <line x1="560" y1="640" x2="420" y2="860"/>
    <line x1="420" y1="860" x2="680" y2="920"/>
    <line x1="180" y1="260" x2="240" y2="700"/>
    <line x1="240" y1="700" x2="420" y2="860"/>
  </g>
  <g fill="#ffffff">
    <circle cx="180" cy="260" r="9"/>
    <circle cx="420" cy="180" r="7"/>
    <circle cx="700" cy="300" r="10"/>
    <circle cx="330" cy="480" r="8"/>
    <circle cx="560" cy="640" r="11"/>
    <circle cx="760" cy="560" r="7"/>
    <circle cx="420" cy="860" r="9"/>
    <circle cx="680" cy="920" r="7"/>
    <circle cx="240" cy="700" r="6"/>
  </g>
</svg>
`)}`;

const multimediaImg = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="1125" viewBox="0 0 900 1125">
  <defs>
    <radialGradient id="m1" cx="50%" cy="30%" r="65%"><stop offset="0%" stop-color="#f5b942" stop-opacity="0.45"/><stop offset="100%" stop-color="#f5b942" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="900" height="1125" fill="#0a0a0f"/>
  <rect width="900" height="1125" fill="url(#m1)"/>
  <g fill="#f5b942" fill-opacity="0.85">
    <rect x="60" y="590" width="34" height="120" rx="17"/>
    <rect x="140" y="540" width="34" height="220" rx="17"/>
    <rect x="220" y="480" width="34" height="340" rx="17"/>
    <rect x="300" y="560" width="34" height="180" rx="17"/>
    <rect x="380" y="440" width="34" height="420" rx="17"/>
    <rect x="460" y="500" width="34" height="300" rx="17"/>
    <rect x="540" y="530" width="34" height="240" rx="17"/>
    <rect x="620" y="460" width="34" height="380" rx="17"/>
    <rect x="700" y="570" width="34" height="160" rx="17"/>
    <rect x="780" y="520" width="34" height="260" rx="17"/>
    <rect x="860" y="550" width="34" height="200" rx="17"/>
  </g>
  <g fill="#f5b942" fill-opacity="0.4">
    <rect x="60" y="920" width="34" height="60" rx="17"/>
    <rect x="140" y="880" width="34" height="140" rx="17"/>
    <rect x="220" y="905" width="34" height="90" rx="17"/>
    <rect x="300" y="840" width="34" height="220" rx="17"/>
    <rect x="380" y="890" width="34" height="120" rx="17"/>
    <rect x="460" y="860" width="34" height="180" rx="17"/>
    <rect x="540" y="820" width="34" height="260" rx="17"/>
    <rect x="620" y="900" width="34" height="100" rx="17"/>
    <rect x="700" y="850" width="34" height="200" rx="17"/>
    <rect x="780" y="880" width="34" height="140" rx="17"/>
    <rect x="860" y="910" width="34" height="80" rx="17"/>
  </g>
</svg>
`)}`;

type Case = {
  id: string;
  industry: string;
  name: string;
  problem: string;
  solution: string;
  result: string;
  metric: { value: number; suffix: string; label: string };
  tags: string[];
  cta: string;
  href?: string;
  image: string;
};

const CASES: Case[] = [
  {
    id: "propertypartner",
    industry: "Real Estate · Developers & Agencies",
    name: "Property Partner",
    problem: "Developers, agencies and independent agents lose buyers because they have no proper website and no way to answer property questions outside office hours.",
    solution: "The full package: a professional real estate website, an AI chat widget on the site, and an AI agent inside WhatsApp/Telegram that answers questions, sends listings and books viewings around the clock.",
    result: "A real digital presence and continuous contact with buyers, without hiring extra staff.",
    metric: { value: 24, suffix: "/7", label: "Always-on lead response" },
    tags: ["AI Agent", "Website", "Real Estate", "WhatsApp/Telegram"],
    cta: "Build My Property Package",
    image: realestateAiImg,
  },
  {
    id: "architecture",
    industry: "Architecture · Real Estate Development",
    name: "Architecture & 3D Design Studio",
    problem: "Clients struggle to imagine apartments, houses and interiors before construction or renovation.",
    solution: "AI-assisted 3D visualization, interior concepts, exterior renders and presentation materials.",
    result: "Faster client approvals, better presentations, higher perceived project value.",
    metric: { value: 3, suffix: "×", label: "Faster client approvals" },
    tags: ["3D Design", "Architecture", "Visualization", "AI"],
    cta: "Create 3D Visual Concept",
    image: architectureImg,
  },
  {
    id: "nicstrading",
    industry: "Trading · Market Intelligence",
    name: "NICS AI Trading",
    problem: "Retail traders act on emotion and scattered information instead of a structured process across Forex, Gold and Crypto.",
    solution: "NICS AI Trader reads price action, Ichimoku, Fibonacci and volume confluence in real time, then delivers confidence-scored signals with entries, stops and take-profit levels straight to Telegram and MT5 through our Vantage broker integration.",
    result: "A disciplined, always-on signal engine with a public, verified track record instead of backtested promises.",
    metric: { value: 24, suffix: "/7", label: "Market analysis coverage" },
    tags: ["AI Trading", "Forex · Gold · Crypto", "Telegram + MT5", "Verified Track Record"],
    cta: "Explore AI Trading",
    href: "https://fwd.cx/Yj25BCrDzEHB",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "hospitality",
    industry: "Hospitality · Hotels & Airbnb",
    name: "Hotel & Airbnb Auto-Reply",
    problem: "Hotels and independent Airbnb hosts miss bookings because guests message on WhatsApp, email, Airbnb chat and social media at all hours.",
    solution: "An AI guest-support assistant answers questions, checks availability, explains house rules and amenities, and helps guests book or check in — for hotels and individual Airbnb hosts alike.",
    result: "Faster guest replies day and night, and far less manual work for reception or a host running several listings.",
    metric: { value: 24, suffix: "/7", label: "Guest replies, day or night" },
    tags: ["WhatsApp API", "Hospitality", "Airbnb", "Automation"],
    cta: "Automate Guest Replies",
    image: hotelImg,
  },
  {
    id: "restaurant",
    industry: "Restaurants · Food Service",
    name: "Restaurant Ordering Assistant",
    problem: "Restaurant staff spend hours answering the same questions about the menu, hours, delivery and reservations instead of serving guests.",
    solution: "An AI assistant handles menu questions, table reservations and delivery inquiries over chat, and hands off to staff only when a human is really needed.",
    result: "Less repetitive phone and chat work for staff, and guests get instant answers at any hour.",
    metric: { value: 24, suffix: "/7", label: "Guest questions answered anytime" },
    tags: ["Chat AI", "Reservations", "Delivery", "Automation"],
    cta: "Automate Restaurant Orders",
    image: restaurantImg,
  },
  {
    id: "aquaterra",
    industry: "Metaverse · AI Education",
    name: "AquaTerra World",
    problem: "AI education is abstract and hard to engage with through slides and video alone.",
    solution: "AquaTerra World is our metaverse project — 640,000 virtual land parcels designed as an interactive, AI-teaching environment. Development is currently paused while we focus on other priorities.",
    result: "A concrete blueprint and reserved virtual territory, ready to resume when development restarts.",
    metric: { value: 640000, suffix: "", label: "Virtual land parcels planned" },
    tags: ["Metaverse", "AI Education", "Virtual Land", "Paused"],
    cta: "See AquaTerra World",
    href: "https://aquaterra.world",
    image: aquaterraImg,
  },
  {
    id: "pride",
    industry: "Social Network · Community",
    name: "PRIDE Social Network",
    problem: "LGBTQ+ communities often lack a dedicated social platform built with their needs in mind.",
    solution: "We designed and built PRIDE Social Network (pridesocial.org) end to end — profiles, feeds and community features, built in-house rather than on a template.",
    result: "A live platform already in use by an early group of real members, growing organically.",
    metric: { value: 100, suffix: "%", label: "In-house build, live today" },
    tags: ["Social Network", "Community", "LGBTQ+", "Live"],
    cta: "Visit PRIDE Social",
    href: "https://pridesocial.org",
    image: prideImg,
  },
  {
    id: "multimedia",
    industry: "Music · Multimedia",
    name: "NICS Multimedia",
    problem: "Creative work outside our core AI products had no home or distribution.",
    solution: "Lyrics, musical idea and visual direction entirely by Aleksandr Tochilov; technical production by NICS Multimedia. Released on Spotify and other streaming platforms — starting with the track \"Just Live\".",
    result: "Real, released music available to stream today, not a mockup.",
    metric: { value: 1, suffix: "", label: "Track released, more in the works" },
    tags: ["Music", "Streaming", "Spotify", "Creative"],
    cta: "Read the Story",
    href: "/nics-multimedia",
    image: multimediaImg,
  },
];

const FEATURED = CASES.slice(0, 3);
const REST = CASES.slice(3);

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toString());
  useEffect(() => {
    if (inView) {
      const controls = animate(mv, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
      return controls.stop;
    }
  }, [inView, to, mv]);
  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

function scrollToContact() {
  const el = document.getElementById("contact");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function handleCta(c: Case) {
  if (!c.href) {
    scrollToContact();
    return;
  }
  if (c.href.startsWith("http")) window.open(c.href, "_blank", "noopener,noreferrer");
  else window.location.href = c.href;
}

function FeaturedCard({ c, index }: { c: Case; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotX = useTransform(my, [0, 1], [4, -4]);
  const rotY = useTransform(mx, [0, 1], [-4, 4]);
  const imgX = useTransform(mx, [0, 1], [-12, 12]);
  const imgY = useTransform(my, [0, 1], [-8, 8]);

  function onMove(e: React.MouseEvent) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  }

  return (
    <>
      <motion.article
        ref={ref}
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.9, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
        onMouseMove={onMove}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => { setHover(false); mx.set(0.5); my.set(0.5); }}
        onClick={() => setExpanded(true)}
        style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 1200 }}
        className="group relative aspect-[4/5] cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
      >
        <motion.img
          src={c.image}
          alt={c.name}
          style={{ x: imgX, y: imgY, scale: hover ? 1.12 : 1.04 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="absolute inset-0 h-full w-full object-cover transition-[filter] duration-700 group-hover:brightness-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-60" />

        {/* Top row */}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/70">{c.industry}</span>
          <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70 backdrop-blur">
            Case {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {/* Bottom content */}
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <h3 className="text-2xl md:text-3xl font-semibold text-white leading-tight">{c.name}</h3>

          <div className="mt-4 flex items-end gap-4">
            <div className="text-4xl md:text-5xl font-semibold text-gradient-gold leading-none">
              <Counter to={c.metric.value} suffix={c.metric.suffix} />
            </div>
            <div className="text-xs text-white/70 pb-1">{c.metric.label}</div>
          </div>

          <motion.div
            animate={{ height: hover ? "auto" : 0, opacity: hover ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="mt-4 text-sm text-white/80 leading-relaxed">{c.solution}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {c.tags.slice(0, 3).map((t) => (
                <span key={t} className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white/70">
                  {t}
                </span>
              ))}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleCta(c); }}
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
            >
              {c.cta} <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </motion.article>

      <ExpandedCase open={expanded} onClose={() => setExpanded(false)} c={c} />
    </>
  );
}

function CompactCard({ c, index }: { c: Case; index: number }) {
  const [hover, setHover] = useState(false);
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setExpanded(true)}
        className="group relative aspect-[16/10] cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-neutral-950"
      >
        <motion.img
          src={c.image}
          alt={c.name}
          animate={{ scale: hover ? 1.1 : 1.02 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 p-5 flex flex-col justify-between">
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/70">{c.industry}</span>
          <div>
            <h4 className="text-xl font-semibold text-white">{c.name}</h4>
            <p className="mt-1 text-xs text-white/70 line-clamp-2">{c.solution}</p>
            <div className="mt-3 flex items-center gap-2 text-primary text-xs font-medium opacity-0 group-hover:opacity-100 transition">
              {c.cta} <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </motion.article>
      <ExpandedCase open={expanded} onClose={() => setExpanded(false)} c={c} />
    </>
  );
}

function ExpandedCase({ open, onClose, c }: { open: boolean; onClose: () => void; c: Case }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.94, y: 20, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-950 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="relative h-64 md:h-80">
              <img src={c.image} alt={c.name} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
              <div className="absolute bottom-0 p-6 md:p-8">
                <div className="text-[11px] uppercase tracking-[0.25em] text-white/70">{c.industry}</div>
                <h3 className="mt-2 text-3xl md:text-4xl font-semibold text-white">{c.name}</h3>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6 p-6 md:p-8 text-white">
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/50 mb-2">Problem</div>
                <p className="text-sm text-white/80 leading-relaxed">{c.problem}</p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-primary mb-2">AI Solution</div>
                <p className="text-sm text-white/80 leading-relaxed">{c.solution}</p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.25em] text-white/50 mb-2">Business Result</div>
                <p className="text-sm text-white/80 leading-relaxed">{c.result}</p>
                <div className="mt-3 text-3xl font-semibold text-gradient-gold">
                  <Counter to={c.metric.value} suffix={c.metric.suffix} />
                </div>
                <div className="text-xs text-white/60">{c.metric.label}</div>
              </div>
            </div>
            {c.id === "multimedia" && (
              <div className="px-6 md:px-8 pb-6 md:pb-8">
                <iframe
                  title="NICS Multimedia — Spotify player"
                  data-testid="embed-iframe"
                  style={{ borderRadius: 12 }}
                  src="https://open.spotify.com/embed/album/1Sj5W4WdKgCUOw0ziLSrDX?utm_source=generator&si=7b1b89c7df784bf8"
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 p-6 md:p-8">
              <div className="flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <span key={t} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wider text-white/70">
                    {t}
                  </span>
                ))}
              </div>
              <button
                onClick={() => handleCta(c)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-white shadow-gold hover:opacity-90"
              >
                {c.cta} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const OurWorkInAction = () => {
  const { t } = useLanguage();
  return (
    <section id="projects" className="relative overflow-hidden bg-neutral-950 py-28 text-white">
      {/* Cinematic background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:64px_64px]" />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 left-1/4 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[140px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 h-[520px] w-[520px] rounded-full bg-amber-500/10 blur-[160px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.3em] text-white/70 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            {t("owia.badge")}
          </div>
          <h2 className="mt-6 text-4xl md:text-6xl font-semibold leading-tight">
            {t("owia.title1")} <span className="text-gradient-gold">{t("owia.title2")}</span>
          </h2>
          <p className="mt-5 text-lg text-white/70">
            {t("owia.subtitle")}
          </p>
        </motion.div>

        {/* Featured cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {FEATURED.map((c, i) => (
            <FeaturedCard key={c.id} c={c} index={i} />
          ))}
        </div>

        {/* Rest */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REST.map((c, i) => (
            <CompactCard key={c.id} c={c} index={i} />
          ))}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-20 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-10 md:p-14"
        >
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-semibold leading-tight">
                {t("owia.cta.title1")} <span className="text-gradient-gold">{t("owia.cta.title2")}</span>
              </h3>
              <p className="mt-4 text-white/70 max-w-lg">
                {t("owia.cta.desc")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <button
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3.5 text-sm font-semibold text-white shadow-gold hover:opacity-90"
              >
                {t("owia.cta.btn1")} <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                {t("owia.cta.btn2")}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OurWorkInAction;
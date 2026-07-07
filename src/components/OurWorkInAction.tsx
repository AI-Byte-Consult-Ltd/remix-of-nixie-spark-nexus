import { useRef, useState, useEffect } from "react";
import { motion, useInView, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import realestateAiImg from "@/assets/project-realestate-ai.jpg";
import architectureImg from "@/assets/project-architecture-3d.jpg";
import restaurantImg from "@/assets/project-restaurant-new.jpg";
import logisticsImg from "@/assets/project-logistics-new.jpg";
import hotelImg from "@/assets/project-hotel-new.jpg";
import clinicImg from "@/assets/project-clinic-new.jpg";
import retailImg from "@/assets/project-retail-new.jpg";

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
    id: "estatereply",
    industry: "Real Estate",
    name: "EstateReply AI",
    problem: "Real estate agencies lose leads because they respond too late to property inquiries.",
    solution: "AI agent replies to property questions 24/7, qualifies leads, sends listings and schedules viewings.",
    result: "80% faster response time, 24/7 lead capture, more booked viewings.",
    metric: { value: 80, suffix: "%", label: "Faster response time" },
    tags: ["AI Agent", "Email Automation", "Real Estate", "24/7"],
    cta: "Automate Real Estate Leads",
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
    problem: "Traders need structured analysis for Forex, Gold and Crypto instead of emotional decisions.",
    solution: "AI-assisted market analysis, trading scenarios, risk zones, technical summaries and broker integration.",
    result: "Faster market preparation, structured trade planning, multi-asset analysis.",
    metric: { value: 24, suffix: "/7", label: "Market analysis coverage" },
    tags: ["AI Trading", "Forex", "Gold", "Crypto"],
    cta: "Explore AI Trading",
    href: "https://fwd.cx/Yj25BCrDzEHB",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1600&q=80",
  },
  {
    id: "hotel",
    industry: "Hotels · Hospitality",
    name: "Hotel Booking Automation",
    problem: "Hotels miss bookings because guests ask questions on WhatsApp, email and social channels at all hours.",
    solution: "AI booking assistant answers questions, checks availability, explains services and helps guests book.",
    result: "Faster guest replies, more direct bookings, less manual reception work.",
    metric: { value: 60, suffix: "%", label: "More direct bookings" },
    tags: ["WhatsApp API", "Hospitality", "Booking AI", "Automation"],
    cta: "Automate Hotel Bookings",
    image: hotelImg,
  },
  {
    id: "restaurant",
    industry: "Restaurants",
    name: "Restaurant Chain Automation",
    problem: "Restaurants lose time handling repetitive order questions, menu requests and customer service.",
    solution: "AI ordering assistant handles menu questions, reservations, delivery inquiries and customer support.",
    result: "Faster service, less manual work, higher operational efficiency.",
    metric: { value: 5, suffix: "×", label: "Faster order handling" },
    tags: ["FastAPI", "React", "NLP", "Automation"],
    cta: "Automate Restaurant Orders",
    image: restaurantImg,
  },
  {
    id: "logistics",
    industry: "Logistics · Supply Chain",
    name: "Logistics Parser AI",
    problem: "Logistics companies manually process documents, shipment updates and cargo data.",
    solution: "AI parser extracts data from messages, PDFs and shipment documents, then structures it for tracking and analytics.",
    result: "Faster document processing, real-time tracking, less manual data entry.",
    metric: { value: 90, suffix: "%", label: "Less manual data entry" },
    tags: ["Python", "AI/ML", "Real-time", "Analytics"],
    cta: "Build Logistics AI Parser",
    image: logisticsImg,
  },
  {
    id: "clinic",
    industry: "Healthcare · Clinics",
    name: "Voice Assistant for Clinics",
    problem: "Clinics spend too much time answering calls and scheduling appointments manually.",
    solution: "Voice AI assistant handles patient questions, appointment requests and basic clinic information.",
    result: "Less reception workload, faster appointment booking, better patient experience.",
    metric: { value: 70, suffix: "%", label: "Less reception workload" },
    tags: ["Voice AI", "Healthcare", "Automation", "NLP"],
    cta: "Create Clinic Voice Assistant",
    image: clinicImg,
  },
  {
    id: "retail",
    industry: "Retail",
    name: "Retail Analytics Platform",
    problem: "Retail stores need better visibility into demand, stock and sales trends.",
    solution: "AI analytics platform predicts sales, detects inventory problems and gives business insights.",
    result: "Better stock planning, fewer missed sales, data-driven decisions.",
    metric: { value: 40, suffix: "%", label: "Fewer missed sales" },
    tags: ["Analytics", "AI/ML", "React", "Python"],
    cta: "Build Retail Analytics",
    image: retailImg,
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
  if (c.href) window.open(c.href, "_blank", "noopener,noreferrer");
  else scrollToContact();
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
            Selected AI Solutions
          </div>
          <h2 className="mt-6 text-4xl md:text-6xl font-semibold leading-tight">
            Our Work in <span className="text-gradient-gold">Action</span>
          </h2>
          <p className="mt-5 text-lg text-white/70">
            Real solutions delivering measurable results for forward-thinking businesses.
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
                Have a process we can <span className="text-gradient-gold">automate?</span>
              </h3>
              <p className="mt-4 text-white/70 max-w-lg">
                AI Byte Consult builds custom AI agents, automation systems and intelligent business tools for real companies.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <button
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-gold px-7 py-3.5 text-sm font-semibold text-white shadow-gold hover:opacity-90"
              >
                Build Similar AI System <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={scrollToContact}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
              >
                Book Strategy Call
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OurWorkInAction;
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Building2,
  LineChart,
  Cog,
  Activity,
  ShieldCheck,
  Cpu,
  Sparkles,
  Calendar,
} from "lucide-react";

type CaseId = "estatereply" | "financegpt" | "businessai";

interface Metric {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

interface CaseStudy {
  id: CaseId;
  name: string;
  category: string;
  status: string;
  icon: React.ComponentType<{ className?: string }>;
  mainMetric: Metric;
  secondary: { label: string; value: string }[];
  features: string[];
  logs: string[];
}

const CASES: CaseStudy[] = [
  {
    id: "estatereply",
    name: "EstateReply AI",
    category: "Real Estate",
    status: "LIVE SYSTEM",
    icon: Building2,
    mainMetric: { label: "Faster Response Time", value: 80, suffix: "%" },
    secondary: [
      { label: "Availability", value: "24/7" },
      { label: "Lead Capture", value: "99.5%" },
    ],
    features: ["Automated property inquiries", "Lead qualification", "Appointment scheduling"],
    logs: [
      "> new inquiry received...",
      "> language detected: EN",
      "> property intent classified...",
      "> lead score: 92/100",
      "> viewing appointment suggested...",
      "> CRM record updated...",
    ],
  },
  {
    id: "financegpt",
    name: "FinanceGPT",
    category: "FinTech",
    status: "AI ACTIVE",
    icon: LineChart,
    mainMetric: { label: "Transactions Processed", value: 2, prefix: "$", suffix: "M+", decimals: 1 },
    secondary: [
      { label: "Accuracy", value: "99.9%" },
      { label: "Analysis", value: "Real-time" },
    ],
    features: ["Automated report generation", "Risk assessment", "Compliance monitoring"],
    logs: [
      "> transaction stream connected...",
      "> anomaly scan running...",
      "> compliance rules verified...",
      "> risk profile updated...",
      "> report generated...",
      "> accuracy stable at 99.9%...",
    ],
  },
  {
    id: "businessai",
    name: "BusinessAI Suite",
    category: "Enterprise",
    status: "NICS CONNECTED",
    icon: Cog,
    mainMetric: { label: "Cost Reduction", value: 45, suffix: "%" },
    secondary: [
      { label: "ROI", value: "300%" },
      { label: "Payback", value: "12 mo" },
    ],
    features: ["Process automation", "Data analysis", "Strategic insights"],
    logs: [
      "> workflow mapped...",
      "> repetitive task detected...",
      "> automation sequence deployed...",
      "> cost center analyzed...",
      "> strategic insight generated...",
      "> ROI projection updated...",
    ],
  },
];

/* ------------- Counter ------------- */
const useCounter = (target: number, active: boolean, duration = 1400, decimals = 0) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(+(target * eased).toFixed(decimals));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration, decimals]);
  return val;
};

const AnimatedMetric = ({ metric, active }: { metric: Metric; active: boolean }) => {
  const v = useCounter(metric.value, active, 1500, metric.decimals ?? 0);
  return (
    <div className="flex items-baseline gap-1 tabular-nums">
      {metric.prefix && <span className="text-white/80 text-2xl">{metric.prefix}</span>}
      <span className="text-5xl md:text-6xl font-semibold text-white tracking-tight">
        {metric.decimals ? v.toFixed(metric.decimals) : Math.floor(v)}
      </span>
      {metric.suffix && <span className="text-white/80 text-2xl">{metric.suffix}</span>}
    </div>
  );
};

/* ------------- Background: neural nodes ------------- */
const NeuralBackdrop = () => {
  const nodes = useMemo(
    () =>
      Array.from({ length: 26 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: 0.6 + Math.random() * 1.4,
        d: 8 + Math.random() * 10,
        delay: Math.random() * 5,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {nodes.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white/60"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            filter: "drop-shadow(0 0 6px rgba(255,255,255,0.5))",
          }}
          animate={{ y: [0, -24, 0], opacity: [0.1, 0.7, 0.1] }}
          transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <svg className="absolute inset-0 w-full h-full opacity-[0.12]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="wline" x1="0" x2="1">
            <stop offset="0" stopColor="rgba(255,255,255,0)" />
            <stop offset="0.5" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="1" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {[...Array(6)].map((_, i) => (
          <motion.line
            key={i}
            x1={`${5 + i * 15}%`}
            y1="5%"
            x2={`${15 + i * 12}%`}
            y2="95%"
            stroke="url(#wline)"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 9 + i, repeat: Infinity, delay: i * 0.5 }}
          />
        ))}
      </svg>
    </div>
  );
};

/* ------------- Selectable card with magnetic hover ------------- */
const SolutionCard = ({
  data,
  active,
  onSelect,
}: {
  data: CaseStudy;
  active: boolean;
  onSelect: () => void;
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });
  const Icon = data.icon;

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = e.clientX - r.left - r.width / 2;
    const cy = e.clientY - r.top - r.height / 2;
    setT({ x: cx * 0.04, y: cy * 0.04 });
  };
  const reset = () => setT({ x: 0, y: 0 });

  return (
    <motion.button
      ref={ref}
      onClick={onSelect}
      onMouseMove={onMove}
      onMouseLeave={reset}
      animate={{
        x: t.x,
        y: t.y,
        scale: active ? 1.02 : 1,
        opacity: active ? 1 : 0.55,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={`relative text-left w-full rounded-2xl border p-5 backdrop-blur-2xl transition-colors ${
        active
          ? "border-white/25 bg-white/[0.08] shadow-[0_20px_80px_-20px_rgba(255,255,255,0.15)]"
          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
      }`}
    >
      {active && (
        <motion.div
          layoutId="active-glow"
          className="absolute -inset-px rounded-2xl pointer-events-none"
          style={{
            background:
              "radial-gradient(600px circle at 0% 0%, rgba(255,255,255,0.08), transparent 40%)",
          }}
        />
      )}
      <div className="relative flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center">
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-[10px] tracking-[0.24em] text-white/50">{data.category.toUpperCase()}</div>
            <div className="text-white font-medium">{data.name}</div>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] text-emerald-300">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
          </span>
          {data.status}
        </span>
      </div>

      <div className="relative">
        <AnimatedMetric metric={data.mainMetric} active={active} />
        <div className="text-[11px] tracking-[0.2em] text-white/50 mt-1">
          {data.mainMetric.label.toUpperCase()}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {data.secondary.map((s) => (
          <div key={s.label} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
            <div className="text-[9px] tracking-[0.2em] text-white/50">{s.label.toUpperCase()}</div>
            <div className="text-sm text-white font-medium">{s.value}</div>
          </div>
        ))}
      </div>
    </motion.button>
  );
};

/* ------------- Preview panels ------------- */
const PreviewShell = ({ children }: { children: React.ReactNode }) => (
  <div className="relative rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-2xl p-5 md:p-6 min-h-[520px] overflow-hidden">
    <div
      className="absolute -inset-24 pointer-events-none"
      style={{
        background: "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.06), transparent 60%)",
      }}
    />
    {children}
  </div>
);

const LiveLogs = ({ logs }: { logs: string[] }) => {
  const [visible, setVisible] = useState<string[]>([]);
  useEffect(() => {
    setVisible([]);
    let i = 0;
    const id = setInterval(() => {
      setVisible((prev) => {
        const next = [...prev, logs[i % logs.length]];
        return next.slice(-6);
      });
      i++;
    }, 800);
    return () => clearInterval(id);
  }, [logs]);
  return (
    <div className="rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-[11px] text-emerald-300/90 h-[150px] overflow-hidden">
      {visible.map((l, i) => (
        <motion.div
          key={`${i}-${l}`}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className="truncate"
        >
          {l}
        </motion.div>
      ))}
      <motion.span
        className="inline-block w-2 h-3 bg-emerald-300/80 align-middle"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </div>
  );
};

const StatRow = ({ k, v, accent }: { k: string; v: string; accent?: boolean }) => (
  <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
    <div className="text-[9px] tracking-[0.22em] text-white/50">{k}</div>
    <div className={`text-sm font-medium tabular-nums ${accent ? "text-emerald-300" : "text-white"}`}>
      {v}
    </div>
  </div>
);

const EstatePreview = () => {
  const [ms, setMs] = useState(2400);
  useEffect(() => {
    const id = setInterval(() => setMs(1800 + Math.floor(Math.random() * 1200)), 1500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative grid gap-4">
      <div className="flex items-center justify-between">
        <div className="text-white font-medium">EstateReply AI · Live Console</div>
        <span className="text-[10px] tracking-[0.2em] text-white/50">NICS · REAL ESTATE</span>
      </div>
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
        <div className="text-[10px] tracking-[0.22em] text-white/50 mb-1">INCOMING INQUIRY</div>
        <div className="text-sm text-white/90 leading-relaxed">
          "Hi, is the 2-bedroom apartment on Vitosha Blvd still available? Could I view it this weekend?"
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <StatRow k="LANGUAGE" v="EN · Auto" accent />
        <StatRow k="INTENT" v="Viewing" />
        <StatRow k="LEAD SCORE" v="92 / 100" accent />
        <StatRow k="RESPONSE" v={`${ms} ms`} />
        <StatRow k="APPOINTMENT" v="Sat 14:30" />
        <StatRow k="CRM SYNC" v="OK" accent />
      </div>
      <div>
        <div className="flex justify-between text-[10px] tracking-[0.2em] text-white/60 mb-1.5">
          <span>QUALIFICATION</span>
          <span>92%</span>
        </div>
        <div className="h-1 rounded-full bg-white/10 overflow-hidden">
          <motion.div className="h-full bg-white" animate={{ width: ["0%", "92%"] }} transition={{ duration: 1.4 }} />
        </div>
      </div>
      <LiveLogs logs={CASES[0].logs} />
    </div>
  );
};

const FinancePreview = () => {
  const [tx, setTx] = useState(1_842_310);
  const [risk, setRisk] = useState(12);
  useEffect(() => {
    const id = setInterval(() => {
      setTx((v) => v + Math.floor(400 + Math.random() * 4000));
      setRisk(() => 8 + Math.floor(Math.random() * 10));
    }, 1400);
    return () => clearInterval(id);
  }, []);
  const bars = useMemo(() => Array.from({ length: 32 }).map(() => Math.random()), []);
  return (
    <div className="relative grid gap-4">
      <div className="flex items-center justify-between">
        <div className="text-white font-medium">FinanceGPT · Intelligence Deck</div>
        <span className="text-[10px] tracking-[0.2em] text-white/50">NICS · FINTECH</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <StatRow k="VOLUME" v={`$${tx.toLocaleString()}`} accent />
        <StatRow k="ACCURACY" v="99.9%" accent />
        <StatRow k="RISK" v={`${risk} / 100`} />
        <StatRow k="COMPLIANCE" v="PASSED" accent />
        <StatRow k="ANOMALIES" v="0 flagged" />
        <StatRow k="REPORTS" v="Auto" />
      </div>
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <div className="text-[10px] tracking-[0.22em] text-white/50 mb-2">TRANSACTION STREAM</div>
        <div className="flex items-end gap-1 h-16">
          {bars.map((b, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-white/70 rounded-sm"
              animate={{ height: [`${20 + b * 60}%`, `${30 + Math.random() * 60}%`, `${20 + b * 60}%`] }}
              transition={{ duration: 2 + (i % 5) * 0.2, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
      <LiveLogs logs={CASES[1].logs} />
    </div>
  );
};

const BusinessPreview = () => {
  const [roi, setRoi] = useState(287);
  const [tasks, setTasks] = useState(1284);
  useEffect(() => {
    const id = setInterval(() => {
      setRoi((v) => Math.min(320, v + Math.floor(Math.random() * 3)));
      setTasks((v) => v + Math.floor(1 + Math.random() * 4));
    }, 1500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative grid gap-4">
      <div className="flex items-center justify-between">
        <div className="text-white font-medium">BusinessAI Suite · Ops Control</div>
        <span className="text-[10px] tracking-[0.2em] text-white/50">NICS · ENTERPRISE</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <StatRow k="ROI" v={`${roi}%`} accent />
        <StatRow k="COST DOWN" v="45%" />
        <StatRow k="TASKS AUTOMATED" v={tasks.toLocaleString()} />
        <StatRow k="WORKFLOWS" v="24 active" accent />
        <StatRow k="INSIGHTS" v="Live" />
        <StatRow k="PAYBACK" v="12 mo" />
      </div>
      <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
        <div className="text-[10px] tracking-[0.22em] text-white/50 mb-2">WORKFLOW AUTOMATION MAP</div>
        <svg viewBox="0 0 300 90" className="w-full h-20">
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <motion.circle
                cx={20 + i * 65}
                cy={45}
                r={6}
                fill="white"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
              />
              {i < 4 && (
                <motion.line
                  x1={26 + i * 65}
                  y1={45}
                  x2={78 + i * 65}
                  y2={45}
                  stroke="white"
                  strokeOpacity="0.4"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1] }}
                  transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity, repeatType: "loop" }}
                />
              )}
            </g>
          ))}
        </svg>
      </div>
      <LiveLogs logs={CASES[2].logs} />
    </div>
  );
};

const PreviewFor = ({ id }: { id: CaseId }) => {
  if (id === "estatereply") return <EstatePreview />;
  if (id === "financegpt") return <FinancePreview />;
  return <BusinessPreview />;
};

/* ------------- Section ------------- */
const OurWorkInAction = () => {
  const [active, setActive] = useState<CaseId>("estatereply");
  const current = CASES.find((c) => c.id === active)!;

  return (
    <section id="projects" className="relative overflow-hidden bg-black text-white py-24 md:py-32">
      <NeuralBackdrop />

      <div className="relative container mx-auto px-6 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-14"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="h-px w-8 bg-white/60" />
            <span className="text-[11px] tracking-[0.32em] text-white/80 font-medium">
              NICS · MISSION CONTROL
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
            Our Work in <span className="text-white/70">Action</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-white/70 max-w-2xl leading-relaxed">
            Real solutions delivering measurable results for forward-thinking businesses.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6 lg:gap-8 items-start">
          {/* Left — cards */}
          <div className="space-y-4">
            {CASES.map((c) => (
              <SolutionCard
                key={c.id}
                data={c}
                active={active === c.id}
                onSelect={() => setActive(c.id)}
              />
            ))}

            <div className="pt-2 grid grid-cols-3 gap-2">
              <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-white/60">
                <Activity className="w-3 h-3" /> DEPLOYED
              </div>
              <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-white/60">
                <ShieldCheck className="w-3 h-3" /> SECURED
              </div>
              <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] text-white/60">
                <Cpu className="w-3 h-3" /> NICS CORE
              </div>
            </div>
          </div>

          {/* Right — preview */}
          <PreviewShell>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <PreviewFor id={current.id} />
                <div className="mt-5 flex flex-wrap gap-2">
                  {current.features.map((f) => (
                    <span
                      key={f}
                      className="text-[11px] tracking-wide text-white/80 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </PreviewShell>
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-14 flex flex-wrap items-center gap-3"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-all"
          >
            Deploy Similar AI System
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="/nics-ecosystem"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 backdrop-blur-md text-white px-6 py-3 text-sm font-medium hover:bg-white/10 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            View AI Solutions
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full text-white/85 px-4 py-3 text-sm font-medium hover:text-white transition-all"
          >
            <Calendar className="w-4 h-4" />
            Book Strategy Call
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default OurWorkInAction;
import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Calendar, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

const Particles = () => {
  const dots = useMemo(
    () =>
      Array.from({ length: 34 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        s: 0.5 + Math.random() * 1.8,
        d: 6 + Math.random() * 10,
        delay: Math.random() * 6,
      })),
    []
  );
  return (
    <div className="pointer-events-none absolute inset-0 z-[5] overflow-hidden">
      {dots.map((p, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-white/70"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            filter: "drop-shadow(0 0 6px rgba(255,255,255,0.7))",
          }}
          animate={{ y: [0, -30, 0], opacity: [0.15, 0.9, 0.15] }}
          transition={{ duration: p.d, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {/* neural connections */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.18]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="nline" x1="0" x2="1">
            <stop offset="0" stopColor="rgba(255,255,255,0)" />
            <stop offset="0.5" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="1" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
        {[...Array(7)].map((_, i) => (
          <motion.line
            key={i}
            x1={`${10 + i * 12}%`}
            y1="10%"
            x2={`${20 + i * 10}%`}
            y2="90%"
            stroke="url(#nline)"
            strokeWidth="0.6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 8 + i, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
      </svg>
    </div>
  );
};

const LiveControlPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-md ml-auto"
      style={{ perspective: 1200 }}
    >
      {/* Glow */}
      <div className="absolute -inset-6 rounded-[2rem] bg-white/5 blur-2xl" />
      <div className="relative rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-2xl p-5 shadow-[0_20px_80px_-20px_rgba(0,0,0,0.6)]">
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
            </span>
            <span className="text-[11px] tracking-[0.2em] text-white/90">VERIFIED SNAPSHOT</span>
          </div>
          <span className="text-[10px] tracking-[0.2em] text-white/50">NICS · AI LAB</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <Cell label="MODEL" value="NICS Text Nano" />
          <Cell label="STATUS" value="First Run Complete" accent />
          <Cell label="PARAMETERS" value="868,992" />
          <Cell label="HARDWARE" value="CPU Only" />
          <Cell label="TRAIN LOSS" value="3.914" />
          <Cell label="LANG" value="English (roadmap: more)" />
        </div>

        <div className="rounded-lg border border-white/10 bg-black/40 p-3 text-[11px] text-white/70 leading-relaxed mb-4">
          Trained from random initialisation on a public-domain corpus. Not
          a live feed -- a snapshot of the most recent verified run.
        </div>

        <a
          href="https://github.com/AI-Byte-Consult-Ltd/nics-ai-lab"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-[11px] text-white/80 hover:text-white transition-colors"
        >
          Full logs &amp; checkpoints on GitHub <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  );
};

const Cell = ({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) => (
  <div className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
    <div className="text-[9px] tracking-[0.22em] text-white/50">{label}</div>
    <div className={`text-sm font-medium tabular-nums ${accent ? "text-emerald-300" : "text-white"}`}>
      {value}
    </div>
  </div>
);

const Hero = () => {
  const { t } = useLanguage();
  const HEADLINE_LINES = [
    t("hero2.line1"),
    t("hero2.line2"),
    t("hero2.line3"),
    t("hero2.line4"),
  ];
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

  return (
    <section ref={ref} className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Video background — no overlay */}
      <motion.div style={{ scale: videoScale }} className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          src={HERO_VIDEO}
          autoPlay
          muted
          playsInline
          loop
          aria-hidden="true"
        >
          <track kind="captions" srcLang="en" src="/hero-video-captions.vtt" label="English" default />
        </video>
      </motion.div>

      <Particles />

      {/* Lens flare */}
      <motion.div
        className="absolute top-1/3 -left-24 w-[520px] h-[520px] rounded-full pointer-events-none z-[6]"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.14), transparent 60%)" }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 9, repeat: Infinity }}
      />

      <motion.div
        style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 pt-32 pb-24 min-h-screen flex items-center"
      >
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-16 items-center w-full">
          {/* Left */}
          <div className="text-white">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 mb-8"
            >
              <span className="h-px w-8 bg-white/60" />
              <span className="text-[11px] tracking-[0.32em] text-white/80 font-medium">
                {t("hero2.eyebrow")}
              </span>
            </motion.div>

            <h1 className="font-semibold tracking-tight leading-[1.02] text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
              {HEADLINE_LINES.map((line, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2 + i * 0.15, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Plain <p>, not motion.p: this is the page's LCP element on
                most viewports — an opacity:0 initial state with a 1.1s
                delay was pushing the LCP element-render-delay to ~3.4s in
                PageSpeed, with no network cost to blame (TTFB was 0ms). */}
            <p className="mt-8 max-w-xl text-base md:text-lg text-white/85 leading-relaxed">
              {t("hero2.desc")}
            </p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.9 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/trading"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-6 py-3 text-sm font-semibold hover:from-amber-300 hover:to-yellow-400 transition-all shadow-[0_8px_30px_-8px_rgba(251,191,36,0.6)]"
              >
                {t("hero2.cta.trading")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/nics-ecosystem"
                className="group inline-flex items-center gap-2 rounded-full bg-white text-black px-6 py-3 text-sm font-medium hover:bg-white/90 transition-all"
              >
                {t("hero2.cta.explore")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/nics-ecosystem"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 backdrop-blur-md text-white px-6 py-3 text-sm font-medium hover:bg-white/10 transition-all"
              >
                <Play className="w-4 h-4" />
                {t("hero2.cta.watch")}
              </Link>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full text-white/85 px-4 py-3 text-sm font-medium hover:text-white transition-all"
              >
                <Calendar className="w-4 h-4" />
                {t("hero2.cta.book")}
              </a>
            </motion.div>
          </div>

          {/* Right — Live glass control panel */}
          <div className="w-full">
            <LiveControlPanel />
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/70 text-[10px] tracking-[0.3em]"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
      >
        {t("hero2.scroll")}
      </motion.div>
    </section>
  );
};

export default Hero;

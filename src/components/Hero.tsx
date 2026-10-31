import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Calendar } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import HalloweenHero from "@/components/halloween/HalloweenHero";
import NewYearHero from "@/components/newyear/NewYearHero";
import HeroGradient from "@/components/hero/HeroGradient";
import HeroOrbit from "@/components/hero/HeroOrbit";

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
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Animated brand gradient (WebGL) — replaced a 13.8 MB stock video */}
      <motion.div style={{ scale: bgScale }} className="absolute inset-0 z-0">
        <HeroGradient />
      </motion.div>

      <HalloweenHero />
      <NewYearHero />

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

          {/* Right — the NICS products on an orbit, each one a link */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <HeroOrbit />
          </motion.div>
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

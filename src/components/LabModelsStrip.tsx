import Link from "@/components/SiteLink";
import { ArrowRight, CandlestickChart, Eye, FileText, Github } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLabModelsTexts, type LabModelId } from "@/i18n/labModels";

const LAB_REPO = "https://github.com/AI-Byte-Consult-Ltd/nics-ai-lab";

const ICONS: Record<LabModelId, typeof Eye> = {
  trading: CandlestickChart,
  text: FileText,
  vision: Eye,
};

/**
 * First block under the hero: the three NICS AI Lab models with an honest
 * status each (texts and facts in src/i18n/labModels.ts).
 */
const LabModelsStrip = () => {
  const { language } = useLanguage();
  const tx = getLabModelsTexts(language);

  return (
    <section id="nics-ai-lab" className="relative bg-black text-white py-16 md:py-20 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(251,191,36,0.18), transparent 45%), radial-gradient(circle at 85% 80%, rgba(108,198,255,0.16), transparent 45%)",
        }}
      />
      <div className="container mx-auto px-4 md:px-12 lg:px-20 relative">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-8 bg-white/60" />
            <span className="text-[11px] tracking-[0.32em] text-white/80 font-medium uppercase">{tx.badge}</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
            {tx.title1}{" "}
            <span className="bg-gradient-to-r from-amber-300 to-yellow-500 bg-clip-text text-transparent">{tx.title2}</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-white/75 leading-relaxed">{tx.desc}</p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {tx.models.map((m) => {
            const Icon = ICONS[m.id];
            const building = m.stage === "building";
            return (
              <div
                key={m.id}
                className={`rounded-2xl border p-5 md:p-6 backdrop-blur-sm flex flex-col ${
                  building ? "border-amber-400/50 bg-amber-400/[0.06]" : "border-white/15 bg-white/[0.04]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      building ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-black" : "bg-white/10 text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      building ? "bg-amber-400/15 text-amber-200" : "bg-emerald-400/10 text-emerald-300"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${building ? "bg-amber-300" : "bg-emerald-400"}`} />
                    {m.status}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold">{m.name}</h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">{m.desc}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-white/85">
                  {m.facts.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-white/40">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            to="/nics-ecosystem"
            className="group inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2.5 text-sm font-medium hover:bg-white/90 transition-all"
          >
            {tx.ctaLab}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href={LAB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 text-white px-5 py-2.5 text-sm font-medium hover:bg-white/10 transition-all"
          >
            <Github className="w-4 h-4" />
            {tx.ctaRepo}
          </a>
          <span className="text-xs text-white/50">{tx.note}</span>
        </div>
      </div>
    </section>
  );
};

export default LabModelsStrip;

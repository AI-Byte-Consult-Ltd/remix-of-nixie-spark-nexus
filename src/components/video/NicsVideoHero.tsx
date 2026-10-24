import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clapperboard, Film, Instagram, Youtube, Facebook } from "lucide-react";
import type { Language } from "@/contexts/LanguageContext";

// Hero of /nics-video: headline and buttons on the left, "Before -> After" on
// the right. "After" is a real Short made by NICS Video (the taiko clip from the
// examples gallery, re-encoded to H.264 without sound and served from our own
// site) plus the real YouTube covers cycling. "Before" is drawn, not filmed:
// a folder of raw clips. To swap the Short, replace public/examples/hero-after-*.
const AFTER_VIDEO = "/examples/hero-after-taiko.mp4";
const AFTER_POSTER = "/examples/hero-after-taiko.webp";
const LONG_COVERS = ["xVdtNjRyXdo", "Lb6Cns-mVjc", "_mfzGzlV6jA", "B9fwmU_LJ48"].map((id) => `/examples/yt-${id}.webp`);
const RAW_CLIPS = ["clip_01.mp4", "clip_02.mov", "clip_03.mp4"];

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.6 6.7a4.8 4.8 0 0 1-3.8-4.2h-3.3v13.4a2.9 2.9 0 1 1-2-2.8V9.7a6.2 6.2 0 1 0 5.3 6.1V9.3a8 8 0 0 0 4.7 1.5V7.5a4.8 4.8 0 0 1-.9-.8Z" />
  </svg>
);

const PLATFORMS = [
  { label: "TikTok", Icon: TikTokIcon },
  { label: "Instagram", Icon: Instagram },
  { label: "YouTube", Icon: Youtube },
  { label: "Facebook", Icon: Facebook },
];

interface HeroStrings {
  title: string;
  accent: string;
  before: string;
  after: string;
  folder: string;
  postTo: string;
  videoAlt: string;
}

const strings: Record<Language, HeroStrings> = {
  en: { title: "From raw clips", accent: "to ready videos", before: "Before", after: "After", folder: "Folder of raw clips", postTo: "Post to", videoAlt: "A vertical Short edited by NICS Video" },
  ru: { title: "Из сырых клипов", accent: "в готовые видео", before: "До", after: "После", folder: "Папка с исходниками", postTo: "Публикуйте в", videoAlt: "Вертикальный Short, смонтированный NICS Video" },
  de: { title: "Aus Rohclips", accent: "werden fertige Videos", before: "Vorher", after: "Nachher", folder: "Ordner mit Rohclips", postTo: "Posten auf", videoAlt: "Ein von NICS Video geschnittener Short im Hochformat" },
  fr: { title: "Des clips bruts", accent: "aux vidéos prêtes", before: "Avant", after: "Après", folder: "Dossier de clips bruts", postTo: "Publiez sur", videoAlt: "Un Short vertical monté par NICS Video" },
  ar: { title: "من مقاطع خام", accent: "إلى فيديوهات جاهزة", before: "قبل", after: "بعد", folder: "مجلد المقاطع الخام", postTo: "انشر على", videoAlt: "فيديو Short عمودي حرّره NICS Video" },
  zh: { title: "从原始素材", accent: "到成品视频", before: "之前", after: "之后", folder: "原始素材文件夹", postTo: "发布到", videoAlt: "由 NICS Video 剪辑的竖屏短视频" },
  pl: { title: "Z surowych klipów", accent: "gotowe filmy", before: "Przed", after: "Po", folder: "Folder surowych klipów", postTo: "Publikuj na", videoAlt: "Pionowy Short zmontowany przez NICS Video" },
  tr: { title: "Ham kliplerden", accent: "hazır videolara", before: "Önce", after: "Sonra", folder: "Ham klip klasörü", postTo: "Paylaş", videoAlt: "NICS Video ile kurgulanmış dikey bir Short" },
  it: { title: "Dalle clip grezze", accent: "ai video pronti", before: "Prima", after: "Dopo", folder: "Cartella di clip grezze", postTo: "Pubblica su", videoAlt: "Uno Short verticale montato da NICS Video" },
  bg: { title: "От сурови клипове", accent: "до готови видеа", before: "Преди", after: "След", folder: "Папка със сурови клипове", postTo: "Публикувайте в", videoAlt: "Вертикален Short, монтиран от NICS Video" },
  es: { title: "De clips sin editar", accent: "a vídeos listos", before: "Antes", after: "Después", folder: "Carpeta de clips sin editar", postTo: "Publica en", videoAlt: "Un Short vertical editado por NICS Video" },
  pt: { title: "De clipes brutos", accent: "a vídeos prontos", before: "Antes", after: "Depois", folder: "Pasta de clipes brutos", postTo: "Publique em", videoAlt: "Um Short vertical editado pelo NICS Video" },
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

interface Props {
  lang: Language;
  badge: string;
  subtitle: string;
  note: string;
  ctaPrimary: string;
  ctaSecondary: string;
  guideLabel: string;
  shortsTitle: string;
  longTitle: string;
  coversTitle: string;
}

const NicsVideoHero = ({ lang, badge, subtitle, note, ctaPrimary, ctaSecondary, guideLabel, shortsTitle, longTitle, coversTitle }: Props) => {
  const s = strings[lang] ?? strings.en;
  const [still] = useState(prefersReducedMotion);
  const [cover, setCover] = useState(0);

  useEffect(() => {
    if (still) return;
    const t = window.setInterval(() => setCover((i) => (i + 1) % LONG_COVERS.length), 3000);
    return () => window.clearInterval(t);
  }, [still]);

  return (
    <section className="pt-28 pb-16 md:pt-32 md:pb-20 relative overflow-hidden">
      <div className="absolute top-20 right-10 w-[28rem] h-[28rem] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text */}
          <div className="space-y-6 text-center lg:text-start">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
              <Clapperboard className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{badge}</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground leading-[1.08]">
              {s.title}
              <br />
              <span className="text-gradient-gold">{s.accent}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">{subtitle}</p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">{note}</p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-1">
              <a href="#pricing">
                <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8 shadow-lg">
                  {ctaPrimary}
                  <ArrowRight className="ms-2 w-4 h-4 rtl:rotate-180" />
                </Button>
              </a>
              <a href="#how">
                <Button size="lg" variant="outline" className="rounded-full px-6 border-2">
                  {ctaSecondary}
                </Button>
              </a>
              <a href="#guide">
                <Button size="lg" variant="ghost" className="rounded-full px-5">
                  {guideLabel}
                </Button>
              </a>
            </div>
            <div className="flex items-center gap-4 justify-center lg:justify-start text-muted-foreground">
              <span className="text-xs font-medium uppercase tracking-[0.15em]">{s.postTo}</span>
              {PLATFORMS.map(({ label, Icon }) => (
                <span key={label} title={label} className="text-foreground/70">
                  <Icon className="w-5 h-5" />
                  <span className="sr-only">{label}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Before -> After */}
          <div className="flex items-center justify-center gap-3 sm:gap-6">
            {/* Before: a folder of raw clips */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">{s.before}</span>
              <div className="relative w-28 sm:w-40 aspect-[3/4]">
                {RAW_CLIPS.map((name, i) => (
                  <div
                    key={name}
                    className="absolute inset-x-0 rounded-xl border border-border bg-card shadow-md p-2 flex flex-col gap-1.5"
                    style={{ top: `${i * 22}%`, transform: `rotate(${[-6, 4, -2][i]}deg)`, zIndex: i }}
                  >
                    <div className="aspect-video rounded-md bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                      <Film className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-mono text-muted-foreground truncate">{name}</span>
                  </div>
                ))}
              </div>
              <span className="text-xs text-muted-foreground text-center max-w-[7rem] sm:max-w-[10rem]">{s.folder}</span>
            </div>

            <span className="flex shrink-0 rtl:rotate-180">
              <ArrowRight className="w-7 h-7 sm:w-9 sm:h-9 text-primary motion-safe:animate-nudge" />
            </span>

            {/* After: real Short + real covers */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">{s.after}</span>
              <div className="relative motion-safe:animate-float">
                <div className="relative w-36 sm:w-48 aspect-[9/16] rounded-[1.75rem] overflow-hidden border-4 border-foreground/90 shadow-2xl bg-black">
                  <video
                    src={AFTER_VIDEO}
                    poster={AFTER_POSTER}
                    autoPlay={!still}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={s.videoAlt}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="absolute top-2 start-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] sm:text-xs text-white">
                    {shortsTitle}
                  </span>
                </div>
                {/* Long video covers, overlapping the phone */}
                <div className="absolute -bottom-6 -start-4 sm:-start-24 w-32 sm:w-44 aspect-video rounded-xl overflow-hidden border-2 border-background shadow-xl bg-muted">
                  {LONG_COVERS.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt=""
                      loading={i === 0 ? "eager" : "lazy"}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === cover ? "opacity-100" : "opacity-0"}`}
                    />
                  ))}
                  <span className="absolute top-1.5 start-1.5 rounded-full bg-black/55 px-2 py-0.5 text-[10px] text-white">{longTitle}</span>
                </div>
              </div>
              <span className="mt-6 text-xs text-muted-foreground text-center max-w-[12rem]">{coversTitle}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NicsVideoHero;

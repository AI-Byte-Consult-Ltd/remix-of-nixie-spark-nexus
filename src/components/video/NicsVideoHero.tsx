import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clapperboard, Instagram, Youtube, Facebook } from "lucide-react";
import type { Language } from "@/contexts/LanguageContext";

// Hero of /nics-video: headline and buttons on the left, "Before -> After" on
// the right. Both sides are real: "After" is the Hawaii part 3 Short that NICS
// Video built from 30 raw clips, "Before" is 2 seconds from each of 4 of those
// clips, as shot (no grading, no crop). Everything is re-encoded to small H.264
// without sound and served from our own site (public/examples/hero-*).
// RAW_CLIPS lists the clips in the order they appear in BEFORE_VIDEO.
const AFTER_VIDEO = "/examples/hero-after-hawaii.mp4";
const AFTER_POSTER = "/examples/hero-after-hawaii.webp";
const BEFORE_VIDEO = "/examples/hero-before-hawaii.mp4";
const RAW_SEGMENT_SECONDS = 2;
const RAW_CLIPS = ["20181117_142028", "20181118_092203", "20181118_101121", "20181118_111736"];
const RAW_STILLS = RAW_CLIPS.slice(0, 3).map((name) => `/examples/hero-before-${name}.webp`);
const RAW_CLIP_COUNT = 30;
const LONG_COVERS = ["Lb6Cns-mVjc", "xVdtNjRyXdo", "_mfzGzlV6jA", "B9fwmU_LJ48"].map((id) => `/examples/yt-${id}.webp`);

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
  folder: (n: number) => string;
  postTo: string;
  videoAlt: string;
  rawAlt: string;
}

const strings: Record<Language, HeroStrings> = {
  en: { title: "From raw clips", accent: "to ready videos", before: "Before", after: "After", folder: n => `${n} raw clips, as shot`, postTo: "Post to", videoAlt: "A vertical Short edited by NICS Video", rawAlt: "Raw clips from the phone, as shot" },
  ru: { title: "Из сырых клипов", accent: "в готовые видео", before: "До", after: "После", folder: n => `${n} исходных клипов, как сняли`, postTo: "Публикуйте в", videoAlt: "Вертикальный Short, смонтированный NICS Video", rawAlt: "Исходные клипы с телефона, как сняли" },
  de: { title: "Aus Rohclips", accent: "werden fertige Videos", before: "Vorher", after: "Nachher", folder: n => `${n} Rohclips, so wie gefilmt`, postTo: "Posten auf", videoAlt: "Ein von NICS Video geschnittener Short im Hochformat", rawAlt: "Rohclips vom Handy, so wie gefilmt" },
  fr: { title: "Des clips bruts", accent: "aux vidéos prêtes", before: "Avant", after: "Après", folder: n => `${n} clips bruts, tels que filmés`, postTo: "Publiez sur", videoAlt: "Un Short vertical monté par NICS Video", rawAlt: "Clips bruts du téléphone, tels que filmés" },
  ar: { title: "من مقاطع خام", accent: "إلى فيديوهات جاهزة", before: "قبل", after: "بعد", folder: n => `${n} مقطعًا خامًا كما صُوّرت`, postTo: "انشر على", videoAlt: "فيديو Short عمودي حرّره NICS Video", rawAlt: "مقاطع خام من الهاتف كما صُوّرت" },
  zh: { title: "从原始素材", accent: "到成品视频", before: "之前", after: "之后", folder: n => `${n} 个原始片段，未经处理`, postTo: "发布到", videoAlt: "由 NICS Video 剪辑的竖屏短视频", rawAlt: "手机拍摄的原始片段，未经处理" },
  pl: { title: "Z surowych klipów", accent: "gotowe filmy", before: "Przed", after: "Po", folder: n => `${n} surowych klipów, prosto z aparatu`, postTo: "Publikuj na", videoAlt: "Pionowy Short zmontowany przez NICS Video", rawAlt: "Surowe klipy z telefonu, prosto z aparatu" },
  tr: { title: "Ham kliplerden", accent: "hazır videolara", before: "Önce", after: "Sonra", folder: n => `Çekildiği gibi ${n} ham klip`, postTo: "Paylaş", videoAlt: "NICS Video ile kurgulanmış dikey bir Short", rawAlt: "Telefondan çekildiği gibi ham klipler" },
  it: { title: "Dalle clip grezze", accent: "ai video pronti", before: "Prima", after: "Dopo", folder: n => `${n} clip grezze, così come girate`, postTo: "Pubblica su", videoAlt: "Uno Short verticale montato da NICS Video", rawAlt: "Clip grezze dal telefono, così come girate" },
  bg: { title: "От сурови клипове", accent: "до готови видеа", before: "Преди", after: "След", folder: n => `${n} сурови клипа, както са заснети`, postTo: "Публикувайте в", videoAlt: "Вертикален Short, монтиран от NICS Video", rawAlt: "Сурови клипове от телефона, както са заснети" },
  es: { title: "De clips sin editar", accent: "a vídeos listos", before: "Antes", after: "Después", folder: n => `${n} clips sin editar, tal como se grabaron`, postTo: "Publica en", videoAlt: "Un Short vertical editado por NICS Video", rawAlt: "Clips del móvil sin editar, tal como se grabaron" },
  pt: { title: "De clipes brutos", accent: "a vídeos prontos", before: "Antes", after: "Depois", folder: n => `${n} clipes brutos, como foram filmados`, postTo: "Publique em", videoAlt: "Um Short vertical editado pelo NICS Video", rawAlt: "Clipes brutos do celular, como foram filmados" },
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
  const [raw, setRaw] = useState(0);

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
            {/* Before: real raw clips */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">{s.before}</span>
              <div className="relative w-32 sm:w-48 aspect-[4/5]">
                {RAW_STILLS.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    loading="lazy"
                    className="absolute inset-x-0 aspect-video w-full object-cover rounded-lg border-2 border-background shadow-md"
                    style={{ top: `${i * 14}%`, transform: `rotate(${[-7, 5, -3][i]}deg)`, zIndex: i }}
                  />
                ))}
                <div className="absolute inset-x-0 bottom-0 z-10 rounded-lg overflow-hidden border-2 border-background shadow-xl bg-black aspect-video">
                  <video
                    src={BEFORE_VIDEO}
                    autoPlay={!still}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={s.rawAlt}
                    onTimeUpdate={(e) =>
                      setRaw(Math.min(RAW_CLIPS.length - 1, Math.floor(e.currentTarget.currentTime / RAW_SEGMENT_SECONDS)))
                    }
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span dir="ltr" className="absolute bottom-1 start-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-mono text-white">
                    {RAW_CLIPS[raw]}.mp4
                  </span>
                </div>
              </div>
              <span className="text-xs text-muted-foreground text-center max-w-[8rem] sm:max-w-[12rem]">{s.folder(RAW_CLIP_COUNT)}</span>
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
                <div className="absolute -bottom-6 -start-4 sm:-start-10 w-32 sm:w-44 aspect-video rounded-xl overflow-hidden border-2 border-background shadow-xl bg-muted">
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

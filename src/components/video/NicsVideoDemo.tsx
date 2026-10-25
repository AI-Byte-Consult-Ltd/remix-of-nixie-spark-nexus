import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, CheckCircle2, Download, Film, Loader2, Upload } from "lucide-react";
import type { Language } from "@/contexts/LanguageContext";

// Animated preview of the upload block for visitors who are not signed in:
// the Hawaii raw clips go in, the editing stages tick by, the finished Short
// comes out. The footage is real (same files as the hero); only the timing is
// sped up, and the block says so. Signed-in visitors get the real form.
const BEFORE_VIDEO = "/examples/hero-before-hawaii.mp4";
const AFTER_VIDEO = "/examples/hero-after-hawaii.mp4";
const AFTER_POSTER = "/examples/hero-after-hawaii.webp";
const LONG_COVER = "/examples/yt-Lb6Cns-mVjc.webp";
const RAW_CLIPS = ["20181117_142028", "20181118_092203", "20181118_101121", "20181118_111736"];
const RAW_CLIP_COUNT = 30;

// One loop, in tenths of a second: upload, then editing, then the result.
const UPLOAD_END = 35;
const EDIT_END = 85;
const CYCLE = 140;

interface DemoStrings {
  heading: string;
  intro: string;
  badge: string;
  steps: [string, string, string];
  clips: (n: number) => string;
  stages: [string, string, string];
  signIn: string;
}

const strings: Record<Language, DemoStrings> = {
  en: {
    heading: "Upload your footage",
    intro: "This is what the editor looks like: 30 raw clips from Hawaii go in, a ready Short comes out. Sign in to upload your own.",
    badge: "Preview, sped up",
    steps: ["Upload", "Editing", "Ready"],
    clips: (n) => `${n} clips`,
    stages: ["Finding the best moments", "Building timing and cuts", "Making covers in 2 languages"],
    signIn: "Sign in and upload",
  },
  ru: {
    heading: "Загрузите свои видео",
    intro: "Так выглядит монтажёр: на входе 30 сырых клипов с Гавайев, на выходе готовый шортс. Войдите, чтобы загрузить свои.",
    badge: "Превью, ускорено",
    steps: ["Загрузка", "Монтаж", "Готово"],
    clips: (n) => `${n} клипов`,
    stages: ["Ищем лучшие моменты", "Собираем хронометраж и склейки", "Делаем обложки на 2 языках"],
    signIn: "Войти и загрузить",
  },
  de: {
    heading: "Material hochladen",
    intro: "So sieht der Editor aus: 30 Rohclips aus Hawaii rein, ein fertiger Short raus. Melden Sie sich an, um Ihre eigenen hochzuladen.",
    badge: "Vorschau, beschleunigt",
    steps: ["Upload", "Schnitt", "Fertig"],
    clips: (n) => `${n} Clips`,
    stages: ["Beste Momente finden", "Timing und Schnitte bauen", "Cover in 2 Sprachen erstellen"],
    signIn: "Anmelden und hochladen",
  },
  fr: {
    heading: "Importez vos vidéos",
    intro: "Voici l'éditeur : 30 clips bruts d'Hawaï en entrée, un Short prêt en sortie. Connectez-vous pour importer les vôtres.",
    badge: "Aperçu accéléré",
    steps: ["Import", "Montage", "Prêt"],
    clips: (n) => `${n} clips`,
    stages: ["Recherche des meilleurs moments", "Rythme et coupes", "Couvertures en 2 langues"],
    signIn: "Se connecter et importer",
  },
  ar: {
    heading: "ارفع لقطاتك",
    intro: "هكذا يبدو المحرر: 30 مقطعًا خامًا من هاواي تدخل، ويخرج فيديو Short جاهز. سجّل الدخول لرفع مقاطعك.",
    badge: "معاينة مُسرّعة",
    steps: ["الرفع", "المونتاج", "جاهز"],
    clips: (n) => `${n} مقطعًا`,
    stages: ["العثور على أفضل اللحظات", "بناء الإيقاع والقطعات", "إنشاء أغلفة بلغتين"],
    signIn: "سجّل الدخول وارفع",
  },
  zh: {
    heading: "上传你的素材",
    intro: "剪辑器的样子：输入 30 个夏威夷原始片段，输出一条成品短视频。登录后即可上传你自己的素材。",
    badge: "预览（已加速）",
    steps: ["上传", "剪辑", "完成"],
    clips: (n) => `${n} 个片段`,
    stages: ["寻找最佳片段", "生成节奏与剪切", "制作双语封面"],
    signIn: "登录并上传",
  },
  pl: {
    heading: "Prześlij swoje nagrania",
    intro: "Tak wygląda edytor: 30 surowych klipów z Hawajów na wejściu, gotowy Short na wyjściu. Zaloguj się, aby przesłać własne.",
    badge: "Podgląd, przyspieszony",
    steps: ["Przesyłanie", "Montaż", "Gotowe"],
    clips: (n) => `${n} klipów`,
    stages: ["Szukamy najlepszych momentów", "Układamy tempo i cięcia", "Tworzymy okładki w 2 językach"],
    signIn: "Zaloguj się i prześlij",
  },
  tr: {
    heading: "Görüntülerinizi yükleyin",
    intro: "Editör böyle görünür: Hawaii'den 30 ham klip girer, hazır bir Short çıkar. Kendi kliplerinizi yüklemek için giriş yapın.",
    badge: "Önizleme, hızlandırılmış",
    steps: ["Yükleme", "Kurgu", "Hazır"],
    clips: (n) => `${n} klip`,
    stages: ["En iyi anlar bulunuyor", "Ritim ve kesmeler kuruluyor", "2 dilde kapaklar hazırlanıyor"],
    signIn: "Giriş yap ve yükle",
  },
  it: {
    heading: "Carica i tuoi video",
    intro: "Ecco l'editor: entrano 30 clip grezze dalle Hawaii, esce uno Short pronto. Accedi per caricare le tue.",
    badge: "Anteprima accelerata",
    steps: ["Caricamento", "Montaggio", "Pronto"],
    clips: (n) => `${n} clip`,
    stages: ["Ricerca dei momenti migliori", "Ritmo e tagli", "Copertine in 2 lingue"],
    signIn: "Accedi e carica",
  },
  bg: {
    heading: "Качете своите видеа",
    intro: "Така изглежда монтажистът: влизат 30 сурови клипа от Хаваите, излиза готов шортс. Влезте, за да качите своите.",
    badge: "Преглед, ускорен",
    steps: ["Качване", "Монтаж", "Готово"],
    clips: (n) => `${n} клипа`,
    stages: ["Търсим най-добрите моменти", "Изграждаме ритъм и склейки", "Правим корици на 2 езика"],
    signIn: "Вход и качване",
  },
  es: {
    heading: "Sube tus vídeos",
    intro: "Así es el editor: entran 30 clips sin editar de Hawái y sale un Short listo. Inicia sesión para subir los tuyos.",
    badge: "Vista previa acelerada",
    steps: ["Subida", "Edición", "Listo"],
    clips: (n) => `${n} clips`,
    stages: ["Buscando los mejores momentos", "Montando ritmo y cortes", "Creando portadas en 2 idiomas"],
    signIn: "Inicia sesión y sube",
  },
  pt: {
    heading: "Envie seus vídeos",
    intro: "Assim é o editor: entram 30 clipes brutos do Havaí e sai um Short pronto. Entre para enviar os seus.",
    badge: "Prévia acelerada",
    steps: ["Envio", "Edição", "Pronto"],
    clips: (n) => `${n} clipes`,
    stages: ["Encontrando os melhores momentos", "Montando ritmo e cortes", "Criando capas em 2 idiomas"],
    signIn: "Entrar e enviar",
  },
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

interface Props {
  lang: Language;
  shortsTitle: string;
  longTitle: string;
  coversTitle: string;
  ctaPrimary: string;
  onSignIn: () => void;
  onGetCredits: () => void;
}

const NicsVideoDemo = ({ lang, shortsTitle, longTitle, coversTitle, ctaPrimary, onSignIn, onGetCredits }: Props) => {
  const s = strings[lang] ?? strings.en;
  const [still] = useState(prefersReducedMotion);
  // Reduced motion: stay on the finished result.
  const [t, setT] = useState(still ? EDIT_END : 0);

  useEffect(() => {
    if (still) return;
    const id = window.setInterval(() => setT((v) => (v + 1) % CYCLE), 100);
    return () => window.clearInterval(id);
  }, [still]);

  const step = t < UPLOAD_END ? 0 : t < EDIT_END ? 1 : 2;
  const uploadPct = Math.min(100, Math.round((t / UPLOAD_END) * 100));
  const visibleClips = Math.min(RAW_CLIPS.length, Math.floor(t / 6) + 1);
  const editPct = step === 0 ? 0 : step === 2 ? 100 : Math.round(((t - UPLOAD_END) / (EDIT_END - UPLOAD_END)) * 100);
  const stagesDone = step === 2 ? 3 : step === 1 ? Math.floor((editPct / 100) * 3) : 0;

  return (
    <div className="rounded-3xl border border-border/60 bg-card shadow-xl overflow-hidden">
      {/* Window bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60 bg-muted/40">
        <span className="w-3 h-3 rounded-full bg-red-400/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
        <span className="w-3 h-3 rounded-full bg-green-400/80" />
        <span className="ms-3 text-sm font-medium text-foreground">NICS Video</span>
        <span className="ms-auto rounded-full bg-accent border border-primary/20 px-2.5 py-0.5 text-xs text-primary">{s.badge}</span>
      </div>

      <div className="p-5 sm:p-8 space-y-6">
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
            <Film className="w-6 h-6 text-primary" />
            {s.heading}
          </h3>
          <p className="text-muted-foreground leading-relaxed">{s.intro}</p>
        </div>

        {/* Steps */}
        <ol className="grid grid-cols-3 gap-2">
          {s.steps.map((label, i) => (
            <li
              key={label}
              className={`flex items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-xs sm:text-sm font-medium transition-colors ${
                i === step ? "bg-foreground text-background" : i < step ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
              }`}
            >
              {i < step ? <CheckCircle2 className="w-4 h-4" /> : <span className="tabular-nums">{i + 1}</span>}
              <span className="truncate">{label}</span>
            </li>
          ))}
        </ol>

        <div className="min-h-[17rem] sm:min-h-[23rem]">
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {RAW_CLIPS.map((name, i) => (
                  <div
                    key={name}
                    className={`rounded-xl overflow-hidden border border-border/60 bg-muted transition-all duration-500 ${
                      i < visibleClips ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    }`}
                  >
                    <img src={`/examples/hero-before-${name}.webp`} alt="" loading="lazy" className="aspect-video w-full object-cover" />
                    <div dir="ltr" className="px-2 py-1 text-[10px] sm:text-xs font-mono text-muted-foreground truncate">
                      {name}.mp4
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Upload className="w-4 h-4 text-primary shrink-0" />
                <span className="font-medium text-foreground">{s.clips(RAW_CLIP_COUNT)}</span>
                <Progress value={uploadPct} className="h-2 flex-1" />
                <span className="tabular-nums w-10 text-end">{uploadPct}%</span>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="grid sm:grid-cols-2 gap-6 items-center">
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video shadow-md">
                <video src={BEFORE_VIDEO} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-90" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent motion-safe:animate-pulse" />
                <span className="absolute bottom-2 start-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">{s.clips(RAW_CLIP_COUNT)}</span>
              </div>
              <ul className="space-y-3">
                {s.stages.map((label, i) => (
                  <li key={label} className="flex items-center gap-2.5 text-sm">
                    {i < stagesDone ? (
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    ) : i === stagesDone ? (
                      <Loader2 className="w-5 h-5 text-primary shrink-0 animate-spin" />
                    ) : (
                      <span className="w-5 h-5 rounded-full border-2 border-muted shrink-0" />
                    )}
                    <span className={i <= stagesDone ? "text-foreground" : "text-muted-foreground"}>{label}</span>
                  </li>
                ))}
                <li className="pt-1">
                  <Progress value={editPct} className="h-2" />
                </li>
              </ul>
            </div>
          )}

          {step === 2 && (
            <div className="flex items-center justify-center gap-4 sm:gap-10">
              <div className="relative w-28 sm:w-40 shrink-0 aspect-[9/16] rounded-[1.5rem] overflow-hidden border-4 border-foreground/90 shadow-2xl bg-black">
                <video
                  src={AFTER_VIDEO}
                  poster={AFTER_POSTER}
                  autoPlay={!still}
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="space-y-2 sm:space-y-3 min-w-0 flex-1 max-w-xs">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  {s.steps[2]}
                </div>
                <img src={LONG_COVER} alt="" loading="lazy" className="hidden sm:block w-full aspect-video object-cover rounded-xl border border-border/60 shadow-md" />
                {[shortsTitle, longTitle, coversTitle].map((label) => (
                  <div key={label} className="flex items-center justify-between gap-2 rounded-lg border border-border/60 px-2.5 sm:px-3 py-2 text-xs sm:text-sm">
                    <span className="truncate">{label}</span>
                    <Download className="w-4 h-4 text-primary shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8" onClick={onSignIn}>
            <Upload className="me-2 w-4 h-4" />
            {s.signIn}
          </Button>
          <Button size="lg" variant="outline" className="rounded-full px-6 border-2" onClick={onGetCredits}>
            {ctaPrimary}
            <ArrowRight className="ms-2 w-4 h-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NicsVideoDemo;

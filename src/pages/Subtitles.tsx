import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Captions, Check, Download, Loader2, Upload } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Aspect, type Caption, type Project, buildCaptions, newProject, uid } from "@/features/studio/model";
import { TranscribeError, transcribeProject } from "@/features/studio/transcribe";
import { browserCanEdit, exportProject } from "@/features/studio/exportVideo";
import type { CaptionLang } from "@/features/studio/agent";

// Free subtitles tool (NICS Video lead magnet): the visitor's clip is
// transcribed and rendered in their own browser with the NICS Studio engine,
// nothing is uploaded. Downloads open after an email, which starts the
// NICS Video email chain in n8n [32 WEB] Lead Magnet Funnel (src=subtitles).
const LEAD_URL = "https://n8n.aibyteconsult.com/webhook/lead-magnet";
const MAX_SECONDS = 60;
const SITE_LABEL = "aibyteconsult.com/subtitles";

type Lang = "en" | "ru" | "bg";
type Stage = "idle" | "reading" | "model" | "recognize" | "ready" | "rendering" | "done";

const SPEECH_LANGS: { id: CaptionLang; label: string }[] = [
  { id: "ru", label: "Русский" },
  { id: "en", label: "English" },
  { id: "bg", label: "Български" },
  { id: "de", label: "Deutsch" },
  { id: "es", label: "Español" },
  { id: "fr", label: "Français" },
  { id: "it", label: "Italiano" },
  { id: "pl", label: "Polski" },
  { id: "pt", label: "Português" },
  { id: "tr", label: "Türkçe" },
];

const copy: Record<Lang, {
  seoTitle: string; seoDesc: string; title: string; subtitle: string; points: string[];
  pick: string; pickHint: string; speech: string; start: string; reading: string; model: string; recognize: string;
  preview: string; emailTitle: string; emailText: string; placeholder: string; consent: string; privacy: string;
  unlock: string; sending: string; video: string; srt: string; rendering: (n: number) => string; done: string;
  again: string; noSpeech: string; failed: string; unsupported: string; badEmail: string; needConsent: string;
  cut: string; upsellTitle: string; upsellText: string; upsellButton: string;
}> = {
  en: {
    seoTitle: "Free subtitles for your video online — NICS Video",
    seoDesc: "Add subtitles to a clip up to 1 minute for free: speech is recognised right in your browser, the video is not uploaded anywhere. Download the video with subtitles and an .srt file.",
    title: "Free subtitles for your video",
    subtitle: "Upload a clip up to 1 minute. Subtitles appear right in your browser, the video is not uploaded anywhere.",
    points: ["Video with burned-in subtitles", ".srt file for YouTube and editors", "10 speech languages"],
    pick: "Choose a video", pickHint: "MP4 or MOV from your phone, up to 1 minute",
    speech: "Speech language", start: "Make subtitles",
    reading: "Reading the sound...", model: "Loading speech recognition (first time about a minute)...", recognize: "Recognising speech...",
    preview: "Your subtitles",
    emailTitle: "Where should we send the link to your next videos?",
    emailText: "Enter your email to download. We will also send 4 short emails on how to turn clips like this into a finished Short, a long video and covers in minutes.",
    placeholder: "Your email", consent: "I agree to receive 4 emails about NICS Video. Unsubscribe in one click.", privacy: "Privacy policy",
    unlock: "Download", sending: "One moment...", video: "Video with subtitles", srt: "Subtitles .srt",
    rendering: (n) => `Rendering the video: ${n}%`, done: "Ready. The files are saved to your downloads.",
    again: "Another video", noSpeech: "No speech found in this clip. Try another one or another language.",
    failed: "Could not recognise the speech. Try again or use another browser.",
    unsupported: "This browser cannot render video. Open the page in Chrome, Edge or a recent Safari.",
    badEmail: "Please enter a valid email.", needConsent: "Please tick the box.",
    cut: "The clip is longer than 1 minute: we used the first minute.",
    upsellTitle: "Want a whole finished video from your clips?",
    upsellText: "NICS Video's editing script turns 3 to 10 clips into a Short, a long video and 4 covers.",
    upsellButton: "See how it works",
  },
  ru: {
    seoTitle: "Субтитры к видео онлайн бесплатно — NICS Video",
    seoDesc: "Бесплатно добавьте субтитры к ролику до 1 минуты: речь распознаётся прямо в вашем браузере, видео никуда не загружается. Скачайте ролик с субтитрами и файл .srt.",
    title: "Бесплатные субтитры к вашему видео",
    subtitle: "Загрузите ролик до 1 минуты. Субтитры появятся прямо в вашем браузере, видео никуда не загружается.",
    points: ["Ролик с вшитыми субтитрами", "Файл .srt для YouTube и монтажа", "10 языков речи"],
    pick: "Выбрать видео", pickHint: "MP4 или MOV с телефона, до 1 минуты",
    speech: "Язык речи", start: "Сделать субтитры",
    reading: "Читаем звук...", model: "Загружаем распознавание речи (первый раз около минуты)...", recognize: "Распознаём речь...",
    preview: "Ваши субтитры",
    emailTitle: "Куда прислать подсказки для следующих роликов?",
    emailText: "Введите email, чтобы скачать. Ещё пришлём 4 коротких письма о том, как из таких клипов за минуты получить готовый Short, длинное видео и обложки.",
    placeholder: "Ваш email", consent: "Согласен получить 4 письма о NICS Video. Отписка в один клик.", privacy: "Политика конфиденциальности",
    unlock: "Скачать", sending: "Секунду...", video: "Ролик с субтитрами", srt: "Субтитры .srt",
    rendering: (n) => `Собираем ролик: ${n}%`, done: "Готово. Файлы сохранены в загрузки.",
    again: "Другое видео", noSpeech: "В ролике не нашлось речи. Попробуйте другой ролик или другой язык.",
    failed: "Не удалось распознать речь. Попробуйте ещё раз или в другом браузере.",
    unsupported: "Этот браузер не умеет собирать видео. Откройте страницу в Chrome, Edge или свежем Safari.",
    badEmail: "Введите корректный email.", needConsent: "Отметьте согласие.",
    cut: "Ролик длиннее минуты: взяли первую минуту.",
    upsellTitle: "Хотите целый готовый ролик из своих клипов?",
    upsellText: "Монтажный скрипт NICS Video собирает из 3–10 клипов Short, длинное видео и 4 обложки.",
    upsellButton: "Посмотреть, как это работает",
  },
  bg: {
    seoTitle: "Безплатни субтитри за видео онлайн — NICS Video",
    seoDesc: "Добавете безплатно субтитри към клип до 1 минута: речта се разпознава направо в браузъра ви, видеото не се качва никъде. Изтеглете видеото със субтитри и .srt файл.",
    title: "Безплатни субтитри за вашето видео",
    subtitle: "Качете клип до 1 минута. Субтитрите се появяват направо в браузъра ви, видеото не се качва никъде.",
    points: ["Видео с вградени субтитри", ".srt файл за YouTube и монтаж", "10 езика на речта"],
    pick: "Изберете видео", pickHint: "MP4 или MOV от телефона, до 1 минута",
    speech: "Език на речта", start: "Направете субтитри",
    reading: "Четем звука...", model: "Зареждаме разпознаването на реч (първия път около минута)...", recognize: "Разпознаваме речта...",
    preview: "Вашите субтитри",
    emailTitle: "Къде да изпратим съвети за следващите ви видеа?",
    emailText: "Въведете имейл, за да изтеглите. Ще ви изпратим и 4 кратки писма как от такива клипове за минути да получите готов Short, дълго видео и корици.",
    placeholder: "Вашият имейл", consent: "Съгласен съм да получа 4 писма за NICS Video. Отписване с едно кликване.", privacy: "Политика за поверителност",
    unlock: "Изтеглете", sending: "Секунда...", video: "Видео със субтитри", srt: "Субтитри .srt",
    rendering: (n) => `Сглобяваме видеото: ${n}%`, done: "Готово. Файловете са в изтеглянията.",
    again: "Друго видео", noSpeech: "В клипа няма реч. Опитайте с друг клип или друг език.",
    failed: "Речта не беше разпозната. Опитайте отново или в друг браузър.",
    unsupported: "Този браузър не може да сглобява видео. Отворете страницата в Chrome, Edge или нов Safari.",
    badEmail: "Въведете валиден имейл.", needConsent: "Отбележете съгласието.",
    cut: "Клипът е по-дълъг от минута: взехме първата минута.",
    upsellTitle: "Искате цяло готово видео от вашите клипове?",
    upsellText: "Монтажният скрипт на NICS Video прави от 3–10 клипа Short, дълго видео и 4 корици.",
    upsellButton: "Вижте как работи",
  },
};

const EMAIL_RE = /^[^\s@,]+@[^\s@,]+\.[a-z]{2,24}$/i;

const srtTime = (s: number) => {
  const ms = Math.max(0, Math.round(s * 1000));
  const p = (n: number, l = 2) => String(n).padStart(l, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
};

const toSrt = (captions: Caption[]) =>
  captions
    .map((c, i) => `${i + 1}\n${srtTime(c.start)} --> ${srtTime(c.end)}\n${c.words.map((w) => w.text).join(" ")}\n`)
    .join("\n");

const saveFile = (blob: Blob, name: string) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 60_000);
};

const aspectOf = (w: number, h: number): Aspect => (Math.abs(w - h) / Math.max(w, h) < 0.08 ? "1:1" : w > h ? "16:9" : "9:16");

const readVideo = (url: string) =>
  new Promise<HTMLVideoElement>((resolve, reject) => {
    const v = document.createElement("video");
    v.preload = "metadata";
    v.playsInline = true;
    v.onloadedmetadata = () => resolve(v);
    v.onerror = () => reject(new Error("video"));
    v.src = url;
  });

const sourceTag = () => {
  try {
    const utm = new URLSearchParams(window.location.search).get("utm_source");
    if (utm) return `subtitles_${utm}`.toLowerCase().replace(/[^a-z0-9_-]/g, "").slice(0, 40);
  } catch {
    // ignore
  }
  return "subtitles";
};

// These pages exist only as /x, /ru/x and /bg/x: the URL decides the language,
// not a choice stored from an earlier visit (an unprefixed URL is English).
const pathLang = (): Lang => {
  const seg = typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "";
  return seg === "ru" || seg === "bg" ? seg : "en";
};

const Subtitles = () => {
  const lang: Lang = pathLang();
  const c = copy[lang];
  const prefix = lang === "en" ? "" : `/${lang}`;
  const [speech, setSpeech] = useState<CaptionLang>(lang === "en" ? "en" : lang);
  const [project, setProject] = useState<Project | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [share, setShare] = useState(0);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [sending, setSending] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const openedAt = useRef(Date.now());
  const canEdit = browserCanEdit();

  const reset = () => {
    project?.clips.forEach((cl) => URL.revokeObjectURL(cl.url));
    setProject(null);
    setStage("idle");
    setError("");
    setNotice("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const run = async (file: File) => {
    setError("");
    setNotice("");
    setStage("reading");
    const url = URL.createObjectURL(file);
    try {
      const v = await readVideo(url);
      const d = Number.isFinite(v.duration) && v.duration > 0 ? v.duration : 0;
      if (!d) throw new TranscribeError("failed", "duration");
      if (d > MAX_SECONDS + 0.5) setNotice(c.cut);
      const len = Math.min(d, MAX_SECONDS);
      const base = newProject();
      const p: Project = {
        ...base,
        title: file.name.replace(/\.[^.]+$/, ""),
        aspect: aspectOf(v.videoWidth || 1080, v.videoHeight || 1920),
        clips: [{ id: uid(), kind: "video", file, url, name: file.name, sourceDuration: d, in: 0, out: len, volume: 1, filter: "none" }],
      };
      const words = await transcribeProject(p, speech, (pr) => {
        setStage(pr.stage === "audio" ? "reading" : pr.stage);
        if (pr.stage !== "recognize") setShare(pr.share);
      });
      const captions = buildCaptions(words, p.captionStyle.wordsPerCaption);
      // A small site address at the top: the free tool's only mark on the result.
      const mark = { id: uid(), text: SITE_LABEL, start: 0, end: len, y: 0.06, size: 0.028, color: "#ffffff", box: true };
      setProject({ ...p, captions, texts: [mark] });
      setStage("ready");
    } catch (err) {
      URL.revokeObjectURL(url);
      setStage("idle");
      setError(err instanceof TranscribeError && err.code === "no_speech" ? c.noSpeech : c.failed);
    }
  };

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) return setError(c.badEmail);
    if (!consent) return setError(c.needConsent);
    setError("");
    setSending(true);
    try {
      const r = await fetch(LEAD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, product: "video", lang, src: sourceTag(), consent: true, website, elapsed_ms: Date.now() - openedAt.current }),
      });
      if (!r.ok) throw new Error(String(r.status));
    } catch (err) {
      // The download is the promise of this page: a failed signup must not take it away.
      console.error(err);
    }
    setSending(false);
    setUnlocked(true);
  };

  const downloadVideo = async () => {
    if (!project) return;
    setStage("rendering");
    setShare(0);
    try {
      const out = await exportProject(project, setShare, () => false);
      saveFile(out.blob, `${project.title || "video"}-subtitles${out.extension.startsWith(".") ? "" : "."}${out.extension}`);
      setStage("done");
    } catch {
      setStage("ready");
      setError(c.failed);
    }
  };

  const downloadSrt = () => {
    if (!project) return;
    saveFile(new Blob([toSrt(project.captions)], { type: "application/x-subrip" }), `${project.title || "video"}.srt`);
  };

  const busy = stage === "reading" || stage === "model" || stage === "recognize";
  const status =
    stage === "reading" ? c.reading : stage === "model" ? `${c.model} ${Math.round(share * 100)}%` : stage === "recognize" ? c.recognize : "";

  return (
    <>
      <SEO
        title={c.seoTitle}
        description={c.seoDesc}
        canonical={`https://aibyteconsult.com${prefix}/subtitles`}
        htmlLang={lang}
        alternates={[
          { lang: "en", href: "https://aibyteconsult.com/subtitles" },
          { lang: "ru", href: "https://aibyteconsult.com/ru/subtitles" },
          { lang: "bg", href: "https://aibyteconsult.com/bg/subtitles" },
          { lang: "x-default", href: "https://aibyteconsult.com/subtitles" },
        ]}
      />
      <main className="min-h-screen bg-background">
        <Header />
        <section className="pt-28 pb-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl space-y-8">
              <div className="space-y-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-gold">
                  <Captions className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-3xl font-semibold leading-tight text-foreground md:text-5xl">{c.title}</h1>
                <p className="text-lg leading-relaxed text-muted-foreground">{c.subtitle}</p>
                <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-foreground">
                  {c.points.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-5 rounded-3xl border border-primary/25 bg-card p-6 shadow-card sm:p-8">
                {!canEdit && <p className="text-sm text-destructive">{c.unsupported}</p>}

                {!project && (
                  <>
                    <label className="block space-y-1 text-sm text-muted-foreground">
                      {c.speech}
                      <select
                        value={speech}
                        onChange={(e) => setSpeech(e.target.value as CaptionLang)}
                        disabled={busy}
                        className="flex h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground"
                      >
                        {SPEECH_LANGS.map((l) => (
                          <option key={l.id} value={l.id}>{l.label}</option>
                        ))}
                      </select>
                    </label>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) run(f);
                      }}
                    />
                    <Button
                      size="lg"
                      disabled={busy || !canEdit}
                      onClick={() => fileRef.current?.click()}
                      className="h-auto min-h-12 w-full whitespace-normal rounded-full bg-gradient-gold py-3 font-semibold text-white"
                    >
                      {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                      {busy ? status : c.pick}
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">{c.pickHint}</p>
                  </>
                )}

                {project && (
                  <>
                    <div className="space-y-2">
                      <p className="font-semibold text-foreground">{c.preview}</p>
                      <div className="max-h-56 space-y-1 overflow-y-auto rounded-xl border border-border bg-background p-3 text-sm">
                        {project.captions.map((cap) => (
                          <p key={cap.id} className="text-foreground">
                            <span className="me-2 font-mono text-xs text-muted-foreground">{srtTime(cap.start).slice(3, 8)}</span>
                            {cap.words.map((w) => w.text).join(" ")}
                          </p>
                        ))}
                      </div>
                    </div>

                    {!unlocked ? (
                      <form onSubmit={unlock} noValidate className="relative space-y-3">
                        <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
                          <label htmlFor="sub-website">Website</label>
                          <input id="sub-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                        </div>
                        <p className="font-semibold text-foreground">{c.emailTitle}</p>
                        <p className="text-sm text-muted-foreground">{c.emailText}</p>
                        <Input
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          aria-label={c.placeholder}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={c.placeholder}
                          className="h-12 rounded-full border-border bg-background px-6"
                        />
                        <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
                          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-[hsl(var(--primary))]" />
                          <span>
                            {c.consent} <Link to="/privacy" className="underline hover:text-primary">{c.privacy}</Link>
                          </span>
                        </label>
                        <Button type="submit" size="lg" disabled={sending} className="w-full rounded-full bg-gradient-gold font-semibold text-white">
                          {sending ? c.sending : c.unlock}
                        </Button>
                      </form>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Button size="lg" onClick={downloadVideo} disabled={stage === "rendering"} className="h-auto min-h-12 whitespace-normal rounded-full bg-gradient-gold py-3 font-semibold text-white">
                            {stage === "rendering" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                            {stage === "rendering" ? c.rendering(Math.round(share * 100)) : c.video}
                          </Button>
                          <Button size="lg" variant="outline" onClick={downloadSrt} className="h-auto min-h-12 whitespace-normal rounded-full py-3">
                            <Download className="mr-2 h-4 w-4" />
                            {c.srt}
                          </Button>
                        </div>
                        {stage === "done" && <p role="status" className="text-sm text-foreground">{c.done}</p>}
                      </div>
                    )}
                    <Button variant="ghost" size="sm" onClick={reset} disabled={stage === "rendering"}>{c.again}</Button>
                  </>
                )}

                {notice && <p className="text-sm text-muted-foreground">{notice}</p>}
                {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              </div>

              <div className="space-y-3 rounded-3xl border border-border/60 bg-muted/30 p-6 text-center">
                <p className="text-lg font-semibold text-foreground">{c.upsellTitle}</p>
                <p className="text-muted-foreground">{c.upsellText}</p>
                <a href={`${prefix}/nics-video?utm_source=subtitles&utm_medium=tool`}>
                  <Button variant="outline" className="mt-2 rounded-full">{c.upsellButton}</Button>
                </a>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
};

export default Subtitles;

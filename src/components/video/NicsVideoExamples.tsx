import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Smartphone, MonitorPlay } from "lucide-react";
import type { Language } from "@/contexts/LanguageContext";

// Videos made with NICS Video. Plain links, no TikTok embed script: the site
// stays static and loads nothing from third parties until the visitor clicks.
// Covers are copies of the TikTok/YouTube covers in public/examples/, named
// tt-<id>.webp or yt-<id>.webp and served from our own site. The prefix also
// keeps names from starting with "_", which GitHub Pages does not publish.
// To add an example, save its cover there and append { platform, id, format, title } below.
const TIKTOK_PROFILE = "https://www.tiktok.com/@alexander.nics";
const YOUTUBE_CHANNEL = "https://www.youtube.com/channel/UCfC75nacgk2RLwaRm1Q0NIg";

interface Example {
  platform: "tiktok" | "youtube";
  id: string;
  format: "shorts" | "long";
  title: { en: string; ru: string };
}

const EXAMPLES: Example[] = [
  { platform: "tiktok", id: "7699976101874961686", format: "shorts", title: { en: "Taiko drums, Japan", ru: "Барабаны тайко, Япония" } },
  { platform: "tiktok", id: "7699181389463260438", format: "shorts", title: { en: "Miami Beach, Florida", ru: "Майами-Бич, Флорида" } },
  { platform: "tiktok", id: "7698887330911898902", format: "shorts", title: { en: "Everglades, Florida", ru: "Эверглейдс, Флорида" } },
  { platform: "tiktok", id: "7697650004147703062", format: "shorts", title: { en: "Brighton Beach, New York", ru: "Брайтон-Бич, Нью-Йорк" } },
  { platform: "tiktok", id: "7697585024002034966", format: "shorts", title: { en: "New York", ru: "Нью-Йорк" } },
  { platform: "youtube", id: "xVdtNjRyXdo", format: "long", title: { en: "Miami Beach, Florida", ru: "Майами-Бич, Флорида" } },
  { platform: "youtube", id: "Lb6Cns-mVjc", format: "long", title: { en: "Hawaii", ru: "Гавайи" } },
  { platform: "youtube", id: "_mfzGzlV6jA", format: "long", title: { en: "Las Vegas, Nevada", ru: "Лас-Вегас, Невада" } },
  { platform: "youtube", id: "B9fwmU_LJ48", format: "long", title: { en: "San Antonio, Texas", ru: "Сан-Антонио, Техас" } },
];

const videoUrl = (e: Example) =>
  e.platform === "youtube" ? `https://www.youtube.com/watch?v=${e.id}` : `${TIKTOK_PROFILE}/video/${e.id}`;

interface ExamplesStrings {
  heading: string;
  intro: string;
  profileTitle: string;
  profileText: string;
  shorts: string;
  long: string;
  watch: string;
  watchYoutube: string;
}

const strings: Record<Language, ExamplesStrings> = {
  en: {
    heading: "Examples",
    intro: "Real videos edited by NICS Video from raw clips, without manual editing.",
    profileTitle: "All examples on TikTok and YouTube",
    profileText: "We publish videos made by NICS Video on our TikTok and YouTube channels. New examples appear there first.",
    shorts: "Vertical",
    long: "Horizontal",
    watch: "Watch on TikTok",
    watchYoutube: "Watch on YouTube",
  },
  ru: {
    heading: "Примеры",
    intro: "Настоящие видео, смонтированные NICS Video из исходных клипов, без ручного монтажа.",
    profileTitle: "Все примеры в TikTok и на YouTube",
    profileText: "Видео, сделанные NICS Video, мы публикуем в наших каналах TikTok и YouTube. Новые примеры появляются там первыми.",
    shorts: "Вертикальное",
    long: "Горизонтальное",
    watch: "Смотреть в TikTok",
    watchYoutube: "Смотреть на YouTube",
  },
  de: {
    heading: "Beispiele",
    intro: "Echte Videos, die NICS Video aus Rohclips geschnitten hat, ganz ohne manuellen Schnitt.",
    profileTitle: "Alle Beispiele auf TikTok und YouTube",
    profileText: "Mit NICS Video erstellte Videos veröffentlichen wir auf unseren TikTok- und YouTube-Kanälen. Neue Beispiele erscheinen dort zuerst.",
    shorts: "Hochformat",
    long: "Querformat",
    watch: "Auf TikTok ansehen",
    watchYoutube: "Auf YouTube ansehen",
  },
  fr: {
    heading: "Exemples",
    intro: "De vraies vidéos montées par NICS Video à partir de clips bruts, sans montage manuel.",
    profileTitle: "Tous les exemples sur TikTok et YouTube",
    profileText: "Nous publions les vidéos réalisées avec NICS Video sur nos chaînes TikTok et YouTube. Les nouveaux exemples y apparaissent en premier.",
    shorts: "Vertical",
    long: "Horizontal",
    watch: "Voir sur TikTok",
    watchYoutube: "Voir sur YouTube",
  },
  ar: {
    heading: "أمثلة",
    intro: "فيديوهات حقيقية حرّرها NICS Video من مقاطع خام، دون مونتاج يدوي.",
    profileTitle: "جميع الأمثلة على TikTok وYouTube",
    profileText: "ننشر الفيديوهات المصنوعة بواسطة NICS Video على قناتينا في TikTok وYouTube. تظهر الأمثلة الجديدة هناك أولاً.",
    shorts: "عمودي",
    long: "أفقي",
    watch: "شاهد على TikTok",
    watchYoutube: "شاهد على YouTube",
  },
  zh: {
    heading: "作品示例",
    intro: "由 NICS Video 从原始素材自动剪辑的真实视频，无需手动剪辑。",
    profileTitle: "TikTok 和 YouTube 上的全部示例",
    profileText: "我们在 TikTok 和 YouTube 频道发布用 NICS Video 制作的视频，新示例会首先在那里发布。",
    shorts: "竖屏",
    long: "横屏",
    watch: "在 TikTok 观看",
    watchYoutube: "在 YouTube 观看",
  },
  pl: {
    heading: "Przykłady",
    intro: "Prawdziwe filmy zmontowane przez NICS Video z surowych klipów, bez ręcznego montażu.",
    profileTitle: "Wszystkie przykłady na TikToku i YouTube",
    profileText: "Filmy zrobione w NICS Video publikujemy na naszych kanałach TikTok i YouTube. Nowe przykłady pojawiają się tam najpierw.",
    shorts: "Pionowy",
    long: "Poziomy",
    watch: "Obejrzyj na TikToku",
    watchYoutube: "Obejrzyj na YouTube",
  },
  tr: {
    heading: "Örnekler",
    intro: "NICS Video'nun ham kliplerden elle kurgu yapmadan hazırladığı gerçek videolar.",
    profileTitle: "Tüm örnekler TikTok ve YouTube'da",
    profileText: "NICS Video ile yapılan videoları TikTok ve YouTube kanallarımızda yayınlıyoruz. Yeni örnekler önce orada görünür.",
    shorts: "Dikey",
    long: "Yatay",
    watch: "TikTok'ta izle",
    watchYoutube: "YouTube'da izle",
  },
  it: {
    heading: "Esempi",
    intro: "Video reali montati da NICS Video a partire da clip grezze, senza montaggio manuale.",
    profileTitle: "Tutti gli esempi su TikTok e YouTube",
    profileText: "Pubblichiamo i video realizzati con NICS Video sui nostri canali TikTok e YouTube. I nuovi esempi compaiono prima lì.",
    shorts: "Verticale",
    long: "Orizzontale",
    watch: "Guarda su TikTok",
    watchYoutube: "Guarda su YouTube",
  },
  bg: {
    heading: "Примери",
    intro: "Истински видеа, монтирани от NICS Video от сурови клипове, без ръчен монтаж.",
    profileTitle: "Всички примери в TikTok и YouTube",
    profileText: "Видеата, направени с NICS Video, публикуваме в нашите канали в TikTok и YouTube. Новите примери се появяват първо там.",
    shorts: "Вертикално",
    long: "Хоризонтално",
    watch: "Гледай в TikTok",
    watchYoutube: "Гледай в YouTube",
  },
  es: {
    heading: "Ejemplos",
    intro: "Vídeos reales editados por NICS Video a partir de clips en bruto, sin edición manual.",
    profileTitle: "Todos los ejemplos en TikTok y YouTube",
    profileText: "Publicamos los vídeos hechos con NICS Video en nuestros canales de TikTok y YouTube. Los nuevos ejemplos aparecen allí primero.",
    shorts: "Vertical",
    long: "Horizontal",
    watch: "Ver en TikTok",
    watchYoutube: "Ver en YouTube",
  },
  pt: {
    heading: "Exemplos",
    intro: "Vídeos reais editados pelo NICS Video a partir de clipes brutos, sem edição manual.",
    profileTitle: "Todos os exemplos no TikTok e no YouTube",
    profileText: "Publicamos os vídeos feitos com o NICS Video nos nossos canais do TikTok e do YouTube. Os novos exemplos aparecem lá primeiro.",
    shorts: "Vertical",
    long: "Horizontal",
    watch: "Ver no TikTok",
    watchYoutube: "Ver no YouTube",
  },
};

const NicsVideoExamples = ({ lang }: { lang: Language }) => {
  const s = strings[lang] ?? strings.en;

  return (
    <section id="examples" className="py-20 bg-muted/30 scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-4">
            <span className="text-gradient-gold">{s.heading}</span>
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12">{s.intro}</p>

          {(["shorts", "long"] as const).map((format) => {
            const items = EXAMPLES.filter((e) => e.format === format);
            if (items.length === 0) return null;
            const FormatIcon = format === "shorts" ? Smartphone : MonitorPlay;
            return (
              <div
                key={format}
                className={`grid gap-4 mb-8 ${
                  format === "shorts" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 lg:grid-cols-4"
                }`}
              >
                {items.map((e) => {
                  const title = lang === "ru" ? e.title.ru : e.title.en;
                  const watch = e.platform === "youtube" ? s.watchYoutube : s.watch;
                  return (
                    <a key={e.id} href={videoUrl(e)} target="_blank" rel="noopener noreferrer" className="group" aria-label={`${title}. ${watch}`}>
                      <div
                        className={`relative rounded-2xl overflow-hidden bg-muted border border-border/50 ${
                          format === "shorts" ? "aspect-[3/4]" : "aspect-video"
                        }`}
                      >
                        <img
                          src={`/examples/${e.platform === "youtube" ? "yt" : "tt"}-${e.id}.webp`}
                          alt={title}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
                          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow transition-transform group-hover:scale-110">
                            <Play className="w-5 h-5 text-foreground ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
                          <FormatIcon className="w-3 h-3" />
                          {format === "shorts" ? s.shorts : s.long}
                        </span>
                      </div>
                      <div className="mt-2 text-sm font-medium text-foreground group-hover:text-primary">{title}</div>
                      <div className="text-xs text-muted-foreground">{watch}</div>
                    </a>
                  );
                })}
              </div>
            );
          })}

          <Card className="bg-card border-border/50 max-w-2xl mx-auto">
            <CardContent className="pt-6 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-gold flex items-center justify-center">
                <Play className="w-7 h-7 text-white ml-1" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold text-foreground">{s.profileTitle}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.profileText}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                {[
                  { href: TIKTOK_PROFILE, label: "TikTok" },
                  { href: YOUTUBE_CHANNEL, label: "YouTube" },
                ].map((ch) => (
                  <a key={ch.label} href={ch.href} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-full px-6">
                      {ch.label}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default NicsVideoExamples;

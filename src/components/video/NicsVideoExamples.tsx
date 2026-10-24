import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Smartphone, MonitorPlay } from "lucide-react";
import type { Language } from "@/contexts/LanguageContext";

// Videos made with NICS Video. Plain links, no TikTok embed script: the site
// stays static and loads nothing from third parties until the visitor clicks.
// To add an example, append { url, format } with the full TikTok video link.
const TIKTOK_PROFILE = "https://www.tiktok.com/@alexander.nics";

interface Example {
  url: string;
  format: "shorts" | "long";
}

const EXAMPLES: Example[] = [];

interface ExamplesStrings {
  heading: string;
  intro: string;
  profileTitle: string;
  profileText: string;
  profileButton: string;
  shorts: string;
  long: string;
  watch: string;
}

const strings: Record<Language, ExamplesStrings> = {
  en: {
    heading: "Examples",
    intro: "Real videos edited by NICS Video from raw clips, without manual editing.",
    profileTitle: "All examples on TikTok",
    profileText: "We publish videos made by NICS Video on our TikTok channel. New examples appear there first.",
    profileButton: "Open TikTok",
    shorts: "Vertical",
    long: "Horizontal",
    watch: "Watch on TikTok",
  },
  ru: {
    heading: "Примеры",
    intro: "Настоящие видео, смонтированные NICS Video из исходных клипов, без ручного монтажа.",
    profileTitle: "Все примеры в TikTok",
    profileText: "Видео, сделанные NICS Video, мы публикуем в нашем TikTok. Новые примеры появляются там первыми.",
    profileButton: "Открыть TikTok",
    shorts: "Вертикальное",
    long: "Горизонтальное",
    watch: "Смотреть в TikTok",
  },
  de: {
    heading: "Beispiele",
    intro: "Echte Videos, die NICS Video aus Rohclips geschnitten hat, ganz ohne manuellen Schnitt.",
    profileTitle: "Alle Beispiele auf TikTok",
    profileText: "Mit NICS Video erstellte Videos veröffentlichen wir auf unserem TikTok-Kanal. Neue Beispiele erscheinen dort zuerst.",
    profileButton: "TikTok öffnen",
    shorts: "Hochformat",
    long: "Querformat",
    watch: "Auf TikTok ansehen",
  },
  fr: {
    heading: "Exemples",
    intro: "De vraies vidéos montées par NICS Video à partir de clips bruts, sans montage manuel.",
    profileTitle: "Tous les exemples sur TikTok",
    profileText: "Nous publions les vidéos réalisées avec NICS Video sur notre chaîne TikTok. Les nouveaux exemples y apparaissent en premier.",
    profileButton: "Ouvrir TikTok",
    shorts: "Vertical",
    long: "Horizontal",
    watch: "Voir sur TikTok",
  },
  ar: {
    heading: "أمثلة",
    intro: "فيديوهات حقيقية حرّرها NICS Video من مقاطع خام، دون مونتاج يدوي.",
    profileTitle: "جميع الأمثلة على TikTok",
    profileText: "ننشر الفيديوهات المصنوعة بواسطة NICS Video على قناتنا في TikTok. تظهر الأمثلة الجديدة هناك أولاً.",
    profileButton: "فتح TikTok",
    shorts: "عمودي",
    long: "أفقي",
    watch: "شاهد على TikTok",
  },
  zh: {
    heading: "作品示例",
    intro: "由 NICS Video 从原始素材自动剪辑的真实视频，无需手动剪辑。",
    profileTitle: "TikTok 上的全部示例",
    profileText: "我们在 TikTok 频道发布用 NICS Video 制作的视频，新示例会首先在那里发布。",
    profileButton: "打开 TikTok",
    shorts: "竖屏",
    long: "横屏",
    watch: "在 TikTok 观看",
  },
  pl: {
    heading: "Przykłady",
    intro: "Prawdziwe filmy zmontowane przez NICS Video z surowych klipów, bez ręcznego montażu.",
    profileTitle: "Wszystkie przykłady na TikToku",
    profileText: "Filmy zrobione w NICS Video publikujemy na naszym kanale TikTok. Nowe przykłady pojawiają się tam najpierw.",
    profileButton: "Otwórz TikTok",
    shorts: "Pionowy",
    long: "Poziomy",
    watch: "Obejrzyj na TikToku",
  },
  tr: {
    heading: "Örnekler",
    intro: "NICS Video'nun ham kliplerden elle kurgu yapmadan hazırladığı gerçek videolar.",
    profileTitle: "Tüm örnekler TikTok'ta",
    profileText: "NICS Video ile yapılan videoları TikTok kanalımızda yayınlıyoruz. Yeni örnekler önce orada görünür.",
    profileButton: "TikTok'u aç",
    shorts: "Dikey",
    long: "Yatay",
    watch: "TikTok'ta izle",
  },
  it: {
    heading: "Esempi",
    intro: "Video reali montati da NICS Video a partire da clip grezze, senza montaggio manuale.",
    profileTitle: "Tutti gli esempi su TikTok",
    profileText: "Pubblichiamo i video realizzati con NICS Video sul nostro canale TikTok. I nuovi esempi compaiono prima lì.",
    profileButton: "Apri TikTok",
    shorts: "Verticale",
    long: "Orizzontale",
    watch: "Guarda su TikTok",
  },
  bg: {
    heading: "Примери",
    intro: "Истински видеа, монтирани от NICS Video от сурови клипове, без ръчен монтаж.",
    profileTitle: "Всички примери в TikTok",
    profileText: "Видеата, направени с NICS Video, публикуваме в нашия TikTok канал. Новите примери се появяват първо там.",
    profileButton: "Отвори TikTok",
    shorts: "Вертикално",
    long: "Хоризонтално",
    watch: "Гледай в TikTok",
  },
  es: {
    heading: "Ejemplos",
    intro: "Vídeos reales editados por NICS Video a partir de clips en bruto, sin edición manual.",
    profileTitle: "Todos los ejemplos en TikTok",
    profileText: "Publicamos los vídeos hechos con NICS Video en nuestro canal de TikTok. Los nuevos ejemplos aparecen allí primero.",
    profileButton: "Abrir TikTok",
    shorts: "Vertical",
    long: "Horizontal",
    watch: "Ver en TikTok",
  },
  pt: {
    heading: "Exemplos",
    intro: "Vídeos reais editados pelo NICS Video a partir de clipes brutos, sem edição manual.",
    profileTitle: "Todos os exemplos no TikTok",
    profileText: "Publicamos os vídeos feitos com o NICS Video no nosso canal do TikTok. Os novos exemplos aparecem lá primeiro.",
    profileButton: "Abrir TikTok",
    shorts: "Vertical",
    long: "Horizontal",
    watch: "Ver no TikTok",
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

          {EXAMPLES.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {EXAMPLES.map((e) => {
                const FormatIcon = e.format === "shorts" ? Smartphone : MonitorPlay;
                return (
                  <a key={e.url} href={e.url} target="_blank" rel="noopener noreferrer" className="group">
                    <div
                      className={`relative rounded-2xl overflow-hidden bg-gradient-gold flex items-center justify-center ${
                        e.format === "shorts" ? "aspect-[9/16]" : "aspect-video"
                      }`}
                    >
                      <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center transition-transform group-hover:scale-110">
                        <Play className="w-6 h-6 text-foreground ml-1" />
                      </div>
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-xs text-white">
                        <FormatIcon className="w-3 h-3" />
                        {e.format === "shorts" ? s.shorts : s.long}
                      </span>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground group-hover:text-primary">{s.watch}</div>
                  </a>
                );
              })}
            </div>
          )}

          <Card className="bg-card border-border/50 max-w-2xl mx-auto">
            <CardContent className="pt-6 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-gold flex items-center justify-center">
                <Play className="w-7 h-7 text-white ml-1" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold text-foreground">{s.profileTitle}</h3>
                <p className="text-muted-foreground leading-relaxed">{s.profileText}</p>
                <p className="text-sm text-primary">@alexander.nics</p>
              </div>
              <a href={TIKTOK_PROFILE} target="_blank" rel="noopener noreferrer">
                <Button className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-6">
                  {s.profileButton}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default NicsVideoExamples;

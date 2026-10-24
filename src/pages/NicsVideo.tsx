import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clapperboard,
  Smartphone,
  MonitorPlay,
  Image,
  Upload,
  ScanSearch,
  ListOrdered,
  Film,
  ShieldCheck,
  Clock,
  ArrowRight,
  ArrowLeft,
  Plane,
  Building2,
  Camera,
  Users,
  Check,
  Scissors,
} from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { formatPrice } from "@/data/nicsTraderPlans";
import NicsVideoCheckout, { type CheckoutPlan, type NicsVideoPlanId } from "@/components/video/NicsVideoCheckout";
import NicsVideoStudio from "@/components/video/NicsVideoStudio";
import { studioStrings } from "@/features/studio/strings";
import { readAccount, signOut, useAccount } from "@/features/account/account";
import AccountDialog from "@/features/account/AccountDialog";
import { nicsVideoLocales } from "@/i18n/nicsVideo";

// Credit plans, EUR per 30 days. Keep in sync with PLAN_PRICES in n8n
// [24 VIDEO] Validate Request and the credit amounts in [26 VIDEO] Check Access.
// A package (1 Short + 1 Long + 4 covers) costs PACKAGE_CREDITS.
const NICS_VIDEO_START_EUR = 14.99;
const NICS_VIDEO_CREATOR_EUR = 34.99;
const NICS_VIDEO_PRO_EUR = 69.99;

export interface VideoContent {
  badge: string;
  heroHeading: string;
  heroSubtitle: string;
  heroNote: string;
  ctaPrimary: string;
  ctaSecondary: string;
  outputsHeading: string;
  outputsIntro: string;
  shortsTitle: string;
  shortsText: string;
  longTitle: string;
  longText: string;
  coversTitle: string;
  coversText: string;
  outputsFootnote: string;
  howHeading: string;
  steps: { title: string; text: string }[];
  styleHeading: string;
  styleIntro: string;
  styleRows: { label: string; shorts: string; long: string }[];
  styleNote: string;
  privacyHeading: string;
  privacyP1: string;
  privacyP2: string;
  audienceHeading: string;
  audience: { title: string; text: string }[];
  pricingHeading: string;
  pricingIntro: string;
  demoName: string;
  demoPrice: string;
  demoPeriod: string;
  demoFeatures: string[];
  demoButton: string;
  basicName: string;
  basicPeriod: string;
  basicFeatures: string[];
  basicButton: string;
  maxName: string;
  maxPeriod: string;
  maxFeatures: string[];
  maxButton: string;
  proName: string;
  proPeriod: string;
  proFeatures: string[];
  proButton: string;
  creditsNote: string;
  pricingNote: string;
  backButton: string;
  signIn: string;
  signOut: string;
  signedInAs: (email: string) => string;
}

const content: Partial<Record<Language, VideoContent>> & { en: VideoContent } = {
  en: {
    badge: "NICS Video Editor",
    heroHeading: "NICS Video Editor",
    heroSubtitle:
      "Upload a folder of raw clips from your trip — get back a vertical Short, a horizontal travel film and four covers in two languages. No manual storyboarding, no editing timeline.",
    heroNote:
      "This is not generative video: the AI invents nothing and draws nothing in. It edits the footage you actually shot — finds the best moments, builds the timing and the cuts by itself.",
    ctaPrimary: "Get 10 free credits",
    ctaSecondary: "How it works",
    outputsHeading: "What you get",
    outputsIntro: "Six ready files from every folder you upload:",
    shortsTitle: "Short · 9:16",
    shortsText:
      "Vertical video in a dynamic editing style, about 28–33 seconds — for TikTok, Instagram Reels and YouTube Shorts.",
    longTitle: "Long · 16:9",
    longText: "Horizontal video in a smooth travel style, about 60–90 seconds — for YouTube, your website or portfolio.",
    coversTitle: "4 covers · EN / RU",
    coversText:
      "Poster-style covers for the Short and the Long, in English and Russian: a real frame from your video with a bold, layered title.",
    outputsFootnote:
      "Both videos are H.264/AAC, without burned-in subtitles, with optional background music that starts from the most energetic part of the track.",
    howHeading: "How it works",
    steps: [
      {
        title: "Upload",
        text: "Drop in a folder or several MP4/MOV files — from 3 to 40+ clips per location. Your originals are never modified.",
      },
      {
        title: "Analysis",
        text: "Scene detection, quality and motion scoring and content tagging (beach, mountains, food, people…) pick out the strongest shots.",
      },
      {
        title: "Edit plan",
        text: "A timeline is built from the best segments: sources alternate so no single clip dominates, with a strong opening and closing.",
      },
      {
        title: "Render & covers",
        text: "FFmpeg renders both videos with transitions, stabilisation and music, then generates the four covers and validates every file.",
      },
    ],
    styleHeading: "Short vs Long",
    styleIntro: "Both videos come from one analysis of your footage, with two different editing passes.",
    styleRows: [
      { label: "Frame", shorts: "9:16 vertical", long: "16:9 horizontal" },
      { label: "Style", shorts: "Dynamic — short cuts, fast transitions", long: "Travel — longer shots, smooth storytelling" },
      { label: "Length", shorts: "28–32 sec", long: "70–90 sec" },
      { label: "For", shorts: "TikTok, Reels, Shorts", long: "YouTube, website, portfolio" },
    ],
    styleNote:
      "If there is too little footage, the video honestly gets shorter — frames are never duplicated to pad it out, and you will see a warning.",
    privacyHeading: "Your footage stays private",
    privacyP1:
      "The whole pipeline runs on our own hardware with local models. No video file or frame is ever sent to an external cloud AI service — important when it is your family or personal footage.",
    privacyP2: "It has been tested end-to-end with the internet switched off, on dozens of locations.",
    audienceHeading: "Who it is for",
    audience: [
      { title: "Travel bloggers", text: "Hours of trip footage turned into ready content." },
      { title: "Real estate & tourism", text: "Property and destination videos without an editor." },
      { title: "Event videographers", text: "Fast highlight cuts in two formats at once." },
      { title: "Everyone with a phone archive", text: "A lot of raw video and no time to edit it." },
    ],
    pricingHeading: "Pricing",
    pricingIntro: "Pay with credits. One package (1 Short + 1 Long video + 4 covers) = 10 credits. Start with 10 free credits.",
    demoName: "Free start",
    demoPrice: "Free",
    demoPeriod: "once",
    demoFeatures: [
      "10 credits = 1 package",
      "Up to 15 minutes of source footage",
      "Both styles: dynamic and travel",
      "No card required",
    ],
    demoButton: "Get 10 credits",
    basicName: "Start",
    basicPeriod: "per month",
    basicFeatures: [
      "60 credits = 6 packages",
      "Up to 20 minutes of source footage per package",
      "No watermark",
      "Background music and cover regeneration",
    ],
    basicButton: "Get Start",
    proName: "Creator",
    proPeriod: "per month",
    proFeatures: [
      "250 credits = 25 packages",
      "Up to 60 minutes of source footage per package",
      "Everything in Start",
    ],
    proButton: "Get Creator",
    maxName: "Pro",
    maxPeriod: "per month",
    maxFeatures: [
      "700 credits = 70 packages",
      "Up to 60 minutes of source footage per package",
      "Everything in Creator",
      "Priority processing",
    ],
    maxButton: "Get Pro",
    creditsNote: "Credits are valid for 30 days from payment. Secure card payment via Revolut, charged in EUR.",
    pricingNote:
      "Processing time depends on the amount of footage: from a few minutes for a small folder to several hours for long source files — you will get a notification when it is ready.",
    backButton: "Explore the Ecosystem",
    signIn: "Sign in",
    signOut: "Sign out",
    signedInAs: (email: string) => `Signed in as ${email}`,
  },
  ru: {
    badge: "NICS Video Монтажёр",
    heroHeading: "NICS Video Монтажёр",
    heroSubtitle:
      "Загружаете папку с сырыми клипами поездки — получаете вертикальный шортс, горизонтальный travel-ролик и четыре обложки на двух языках. Без ручной раскадровки и монтажа.",
    heroNote:
      "Это не генеративное видео: ИИ ничего не придумывает и не дорисовывает. Это автоматический монтаж того, что вы сняли, — система сама находит лучшие кадры, строит хронометраж и склейки.",
    ctaPrimary: "Получить 10 кредитов бесплатно",
    ctaSecondary: "Как это работает",
    outputsHeading: "Что вы получаете",
    outputsIntro: "Шесть готовых файлов на каждую загруженную папку:",
    shortsTitle: "Шортс · 9:16",
    shortsText:
      "Вертикальное видео в динамичном стиле, около 28–33 секунд — для TikTok, Instagram Reels и YouTube Shorts.",
    longTitle: "Лонг · 16:9",
    longText: "Горизонтальное видео в плавном travel-стиле, около 60–90 секунд — для YouTube, сайта или портфолио.",
    coversTitle: "4 обложки · RU / EN",
    coversText:
      "Постерные обложки для шортса и лонга на русском и английском: реальный кадр из вашего видео и крупный объёмный заголовок.",
    outputsFootnote:
      "Оба видео — H.264/AAC, без вшитых субтитров, с фоновой музыкой по желанию: трек стартует с самой энергичной части.",
    howHeading: "Как это работает",
    steps: [
      {
        title: "Загрузка",
        text: "Папка или несколько файлов MP4/MOV — от 3 до 40+ клипов на локацию. Исходники никогда не изменяются.",
      },
      {
        title: "Анализ",
        text: "Детекция сцен, оценка качества и движения кадра и теги по содержимому (пляж, горы, еда, люди…) отбирают сильные планы.",
      },
      {
        title: "План монтажа",
        text: "Из лучших отрезков строится таймлайн: источники чередуются, чтобы один файл не занял весь ролик, с сильным началом и финалом.",
      },
      {
        title: "Рендер и обложки",
        text: "FFmpeg собирает оба видео с переходами, стабилизацией и музыкой, затем делает четыре обложки и проверяет каждый файл.",
      },
    ],
    styleHeading: "Шортс и лонг",
    styleIntro: "Оба видео строятся из одного анализа исходников, но двумя разными проходами монтажа.",
    styleRows: [
      { label: "Кадр", shorts: "9:16, вертикальный", long: "16:9, горизонтальный" },
      { label: "Стиль", shorts: "Динамичный — короткие куски, быстрые переходы", long: "Путешествие — длинные планы, плавное повествование" },
      { label: "Длительность", shorts: "28–32 сек", long: "70–90 сек" },
      { label: "Для чего", shorts: "TikTok, Reels, Shorts", long: "YouTube, сайт, портфолио" },
    ],
    styleNote:
      "Если исходников мало, ролик честно становится короче — кадры не дублируются ради хронометража, и вы увидите предупреждение.",
    privacyHeading: "Ваши видео остаются приватными",
    privacyP1:
      "Весь пайплайн работает на нашем собственном железе с локальными моделями. Ни один видеофайл и кадр не отправляется во внешние облачные AI-сервисы — это важно для личных и семейных видео.",
    privacyP2: "Проверено полностью оффлайн, с отключённым интернетом, на десятках локаций.",
    audienceHeading: "Для кого",
    audience: [
      { title: "Тревел-блогеры", text: "Часы видео из поездки превращаются в готовый контент." },
      { title: "Недвижимость и туризм", text: "Ролики об объектах и направлениях без монтажёра." },
      { title: "Event-видеографы", text: "Быстрые нарезки сразу в двух форматах." },
      { title: "Все, у кого архив в телефоне", text: "Много сырого видео и нет времени монтировать." },
    ],
    pricingHeading: "Тарифы",
    pricingIntro: "Оплата кредитами. Один пакет (шортс + длинное видео + 4 обложки) = 10 кредитов. Начните с 10 бесплатных кредитов.",
    demoName: "Бесплатный старт",
    demoPrice: "Бесплатно",
    demoPeriod: "один раз",
    demoFeatures: [
      "10 кредитов = 1 пакет",
      "До 15 минут исходника",
      "Оба стиля: динамичный и travel",
      "Без привязки карты",
    ],
    demoButton: "Получить 10 кредитов",
    basicName: "Start",
    basicPeriod: "в месяц",
    basicFeatures: [
      "60 кредитов = 6 пакетов",
      "До 20 минут исходника на пакет",
      "Без водяного знака",
      "Фоновая музыка и перегенерация обложек",
    ],
    basicButton: "Оформить Start",
    proName: "Creator",
    proPeriod: "в месяц",
    proFeatures: [
      "250 кредитов = 25 пакетов",
      "До 60 минут исходника на пакет",
      "Всё, что в Start",
    ],
    proButton: "Оформить Creator",
    maxName: "Pro",
    maxPeriod: "в месяц",
    maxFeatures: [
      "700 кредитов = 70 пакетов",
      "До 60 минут исходника на пакет",
      "Всё, что в Creator",
      "Приоритетная обработка",
    ],
    maxButton: "Оформить Pro",
    creditsNote: "Кредиты действуют 30 дней с момента оплаты. Безопасная оплата картой через Revolut, списание в евро.",
    pricingNote:
      "Время обработки зависит от объёма материала: от нескольких минут для небольшой папки до нескольких часов для длинных исходников — о готовности придёт уведомление.",
    backButton: "Экосистема NICS",
    signIn: "Войти",
    signOut: "Выйти",
    signedInAs: (email: string) => `Вы вошли как ${email}`,
  },
};

const stepIcons = [Upload, ScanSearch, ListOrdered, Film];
const audienceIcons = [Plane, Building2, Camera, Users];

const NicsVideo = () => {
  const { language } = useLanguage();
  const [checkoutPlan, setCheckoutPlan] = useState<CheckoutPlan | null>(null);
  const [studioEmail, setStudioEmail] = useState(() => readAccount()?.email ?? "");
  const [signInOpen, setSignInOpen] = useState(false);
  const account = useAccount();
  useEffect(() => {
    if (account) setStudioEmail(account.email);
  }, [account]);
  const c = content[language] ?? nicsVideoLocales[language]?.page ?? content.en;
  const studio = studioStrings(language);

  const outputs = [
    { icon: Smartphone, title: c.shortsTitle, text: c.shortsText },
    { icon: MonitorPlay, title: c.longTitle, text: c.longText },
    { icon: Image, title: c.coversTitle, text: c.coversText },
  ];

  const plans = [
    { id: "nics_video_demo" as NicsVideoPlanId, name: c.demoName, price: c.demoPrice, period: c.demoPeriod, features: c.demoFeatures, button: c.demoButton, featured: false },
    {
      id: "nics_video_basic" as NicsVideoPlanId,
      name: c.basicName,
      price: formatPrice(NICS_VIDEO_START_EUR, "EUR"),
      period: c.basicPeriod,
      features: c.basicFeatures,
      button: c.basicButton,
      featured: false,
    },
    {
      id: "nics_video_pro" as NicsVideoPlanId,
      name: c.proName,
      price: formatPrice(NICS_VIDEO_CREATOR_EUR, "EUR"),
      period: c.proPeriod,
      features: c.proFeatures,
      button: c.proButton,
      featured: true,
    },
    {
      id: "nics_video_max" as NicsVideoPlanId,
      name: c.maxName,
      price: formatPrice(NICS_VIDEO_PRO_EUR, "EUR"),
      period: c.maxPeriod,
      features: c.maxFeatures,
      button: c.maxButton,
      featured: false,
    },
  ];

  const seoProps = {
    title: "NICS Video Editor — Automatic Shorts, Long Videos and Covers",
    description:
      "Upload raw clips from your trip and get a vertical Short, a horizontal travel video and four covers in two languages. Automatic editing of your real footage, fully offline.",
    canonical: "https://aibyteconsult.com/nics-video",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "NICS Video Editor",
      applicationCategory: "MultimediaApplication",
      url: "https://aibyteconsult.com/nics-video",
      provider: { "@type": "Organization", name: "AI Byte Consult Ltd." },
    },
  };

  return (
    <>
      <SEO {...seoProps} />
      <main className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-20 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
                <Clapperboard className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">{c.badge}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
                <span className="text-gradient-gold">{c.heroHeading}</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">{c.heroSubtitle}</p>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">{c.heroNote}</p>
              <div className="flex flex-wrap gap-4 justify-center pt-2">
                <a href="#pricing">
                  <Button size="lg" className="w-full sm:w-auto bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                    {c.ctaPrimary}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </a>
                <a href="#how">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 border-2">
                    {c.ctaSecondary}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Outputs */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-4">
                <span className="text-gradient-gold">{c.outputsHeading}</span>
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-12">{c.outputsIntro}</p>
              <div className="grid md:grid-cols-3 gap-6">
                {outputs.map((o) => (
                  <Card key={o.title} className="bg-card border-border/50">
                    <CardContent className="pt-6 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-gold flex items-center justify-center">
                        <o.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-sm font-semibold uppercase tracking-wide text-primary">{o.title}</div>
                      <p className="text-muted-foreground leading-relaxed">{o.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-sm text-muted-foreground text-center mt-8 max-w-3xl mx-auto">{c.outputsFootnote}</p>
            </div>
          </div>
        </section>

        {/* NICS Studio: manual editor */}
        <section id="nics-studio" className="py-20 bg-background scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
                <Scissors className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">{studio.badge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                <span className="text-gradient-gold">{studio.sectionHeading}</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{studio.sectionText}</p>
              <div>
                <Link to="/nics-studio">
                  <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                    {studio.sectionButton}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="py-20 bg-background scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-12">
                <span className="text-gradient-gold">{c.howHeading}</span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {c.steps.map((s, i) => {
                  const Icon = stepIcons[i];
                  return (
                    <Card key={s.title} className="bg-card border-border/50">
                      <CardContent className="pt-6 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-accent border border-primary/20 flex items-center justify-center">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-sm font-semibold text-primary">0{i + 1}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground">{s.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{s.text}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Shorts vs Long */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-4">
                <span className="text-gradient-gold">{c.styleHeading}</span>
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-10">{c.styleIntro}</p>
              <div className="bg-card rounded-3xl border border-border/50 shadow-card overflow-hidden">
                <div className="grid grid-cols-3 text-sm font-semibold uppercase tracking-wide text-primary border-b border-border/50">
                  <div className="p-4" />
                  <div className="p-4 flex items-center gap-2"><Smartphone className="w-4 h-4" />Shorts</div>
                  <div className="p-4 flex items-center gap-2"><MonitorPlay className="w-4 h-4" />Long</div>
                </div>
                {c.styleRows.map((r) => (
                  <div key={r.label} className="grid grid-cols-3 border-b border-border/50 last:border-b-0">
                    <div className="p-4 font-medium text-foreground">{r.label}</div>
                    <div className="p-4 text-muted-foreground">{r.shorts}</div>
                    <div className="p-4 text-muted-foreground">{r.long}</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground text-center mt-6">{c.styleNote}</p>
            </div>
          </div>
        </section>

        {/* Privacy */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-gold flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                <span className="text-gradient-gold">{c.privacyHeading}</span>
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>{c.privacyP1}</p>
                <p>{c.privacyP2}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Audience */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-12">
                <span className="text-gradient-gold">{c.audienceHeading}</span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {c.audience.map((a, i) => {
                  const Icon = audienceIcons[i];
                  return (
                    <Card key={a.title} className="bg-card border-border/50">
                      <CardContent className="pt-6 space-y-3">
                        <Icon className="w-6 h-6 text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">{a.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{a.text}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 bg-background scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center mb-4">
                <span className="text-gradient-gold">{c.pricingHeading}</span>
              </h2>
              <p className="text-lg text-muted-foreground text-center mb-12">{c.pricingIntro}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((plan) => (
                  <Card
                    key={plan.name}
                    className={`bg-card ${plan.featured ? "border-2 border-primary shadow-card" : "border-border/50"}`}
                  >
                    <CardContent className="pt-8 pb-8 space-y-6 flex flex-col h-full">
                      <div className="space-y-2">
                        <div className="text-sm font-semibold uppercase tracking-wide text-primary">{plan.name}</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-semibold text-foreground">{plan.price}</span>
                          <span className="text-muted-foreground">{plan.period}</span>
                        </div>
                      </div>
                      <ul className="space-y-3 flex-1">
                        {plan.features.map((f) => (
                          <li key={f} className="flex gap-3 text-muted-foreground">
                            <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                          size="lg"
                          onClick={() => setCheckoutPlan({ id: plan.id, name: plan.name, price: plan.price })}
                          variant={plan.featured ? "default" : "outline"}
                          className={`w-full rounded-full px-8 ${plan.featured ? "bg-foreground hover:bg-foreground/90 text-background" : "border-2"}`}
                        >
                          {plan.button}
                          <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-sm text-muted-foreground text-center mt-8">
                {c.creditsNote}
              </p>
              <p className="text-sm text-muted-foreground text-center mt-4 max-w-2xl mx-auto flex items-start justify-center gap-2">
                <Clock className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                <span>{c.pricingNote}</span>
              </p>
              <div className="text-center mt-8">
                <Link to="/nics-ecosystem">
                  <Button variant="ghost" className="rounded-full">
                    <ArrowLeft className="mr-2 w-4 h-4" />
                    {c.backButton}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Upload + job status */}
        <section id="studio" className="py-20 bg-muted/30 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="mb-4 flex flex-wrap items-center justify-end gap-2 text-sm">
                {account ? (
                  <>
                    <span className="text-muted-foreground break-all">{c.signedInAs(account.email)}</span>
                    <Button variant="ghost" size="sm" className="rounded-full" onClick={() => signOut()}>
                      {c.signOut}
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" className="rounded-full" onClick={() => setSignInOpen(true)}>
                    {c.signIn}
                  </Button>
                )}
              </div>
              <NicsVideoStudio
                lang={language}
                email={studioEmail}
                onEmailChange={setStudioEmail}
                onNeedAccess={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
              />
            </div>
          </div>
        </section>

        <AccountDialog open={signInOpen} onOpenChange={setSignInOpen} lang={language} onSignedIn={() => setSignInOpen(false)} />
        <NicsVideoCheckout plan={checkoutPlan} onClose={() => setCheckoutPlan(null)} lang={language} onStarted={setStudioEmail} />
        <Footer />
      </main>
    </>
  );
};

export default NicsVideo;

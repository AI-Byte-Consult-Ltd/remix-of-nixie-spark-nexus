import { ArrowRight, Briefcase, Clapperboard, Send } from "lucide-react";
import SEO from "@/components/SEO";
import alexanderPhoto from "@/assets/go-alexander.webp";

// Link-in-bio page for Instagram, TikTok, YouTube and Threads profiles:
// three big buttons, each opening a free first step (no checklists, no PDFs).
// The profile link carries ?s=<tag> (ig_ru, tiktok_en, yt_ru, threads_en...),
// passed on as utm_source to the site and as /start src_<tag> to the bot,
// so [00 OPS] Daily Growth Scoreboard shows which profile brought people.
type Lang = "en" | "ru" | "bg";

const BOT = "https://t.me/nics_ai_bot";
const CHANNEL = "https://t.me/TravelTradeBook";
const WHATSAPP = "https://wa.me/359988899109";

const copy: Record<Lang, {
  name: string;
  about: string;
  video: [string, string];
  trader: [string, string];
  consult: [string, string];
  consultMessage: string;
  site: string;
  channel: string;
  risk: string;
}> = {
  en: {
    name: "Alexander Lunin",
    about: "Founder of AI Byte Consult, Bulgaria. I build tools that save time: video editing, market scanning, business automation.",
    video: ["Free subtitles for your video", "Upload a clip up to 1 minute and download it with subtitles"],
    trader: ["Gold and forex signals in Telegram", "3 days free: entry, stop and targets in every signal"],
    consult: ["Automate routine work in your business", "Free 20-minute review of where you lose time"],
    consultMessage: "Hello! I would like a free 20-minute review of what can be automated in my business.",
    site: "Company website",
    channel: "Telegram channel",
    risk: "Trading involves risk of loss. Signals are not investment advice.",
  },
  ru: {
    name: "Александр Лунин",
    about: "Основатель AI Byte Consult, Болгария. Делаю инструменты, которые экономят время: монтаж видео, сканер рынков, автоматизация бизнеса.",
    video: ["Бесплатные субтитры к вашему ролику", "Загрузите клип до 1 минуты и скачайте его с субтитрами"],
    trader: ["Сигналы по золоту и форексу в Telegram", "3 дня бесплатно: вход, стоп и тейки в каждом сигнале"],
    consult: ["Автоматизировать рутину в вашем бизнесе", "Бесплатный разбор на 20 минут: где вы теряете время"],
    consultMessage: "Здравствуйте! Хочу бесплатный разбор на 20 минут: что можно автоматизировать в моём бизнесе.",
    site: "Сайт компании",
    channel: "Telegram-канал",
    risk: "Торговля связана с риском потерь. Сигналы не являются инвестиционным советом.",
  },
  bg: {
    name: "Александър Лунин",
    about: "Основател на AI Byte Consult, България. Правя инструменти, които пестят време: видео монтаж, скенер на пазари, автоматизация на бизнеса.",
    video: ["Безплатни субтитри за вашето видео", "Качете клип до 1 минута и го изтеглете със субтитри"],
    trader: ["Сигнали за злато и форекс в Telegram", "3 дни безплатно: вход, стоп и цели във всеки сигнал"],
    consult: ["Автоматизирайте рутината в бизнеса си", "Безплатен 20-минутен преглед: къде губите време"],
    consultMessage: "Здравейте! Искам безплатен 20-минутен преглед какво може да се автоматизира в моя бизнес.",
    site: "Сайт на компанията",
    channel: "Telegram канал",
    risk: "Търговията е свързана с риск от загуби. Сигналите не са инвестиционен съвет.",
  },
};

// Same token rule as the bot's /start src_<token> parser: [a-z0-9_], max 32.
const sourceTag = (): string => {
  try {
    const raw = new URLSearchParams(window.location.search).get("s") || "";
    const tag = raw.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 28);
    return tag || "go";
  } catch {
    return "go";
  }
};

// These pages exist only as /x, /ru/x and /bg/x: the URL decides the language,
// not a choice stored from an earlier visit (an unprefixed URL is English).
const pathLang = (): Lang => {
  const seg = typeof window !== "undefined" ? window.location.pathname.split("/")[1] : "";
  return seg === "ru" || seg === "bg" ? seg : "en";
};

const Go = () => {
  const lang: Lang = pathLang();
  const c = copy[lang];
  const tag = sourceTag();
  const prefix = lang === "en" ? "" : `/${lang}`;
  const utm = `utm_source=${tag}&utm_medium=bio&utm_campaign=go`;
  const search = typeof window !== "undefined" ? window.location.search : "";
  const langLinks: { code: Lang; label: string; href: string }[] = [
    { code: "ru", label: "RU", href: `/ru/go${search}` },
    { code: "bg", label: "BG", href: `/bg/go${search}` },
    { code: "en", label: "EN", href: `/go${search}` },
  ];

  const buttons = [
    { icon: Clapperboard, title: c.video[0], text: c.video[1], href: `${prefix}/subtitles?${utm}`, external: false },
    { icon: Send, title: c.trader[0], text: c.trader[1], href: `${BOT}?start=src_${tag}`, external: true },
    { icon: Briefcase, title: c.consult[0], text: c.consult[1], href: `${WHATSAPP}?text=${encodeURIComponent(c.consultMessage)}`, external: true },
  ];

  return (
    <>
      <SEO
        title={`${c.name} — AI Byte Consult`}
        description={c.about}
        canonical={`https://aibyteconsult.com${prefix}/go`}
        htmlLang={lang}
        noindex
      />
      <main className="min-h-screen bg-background px-4 py-10">
        <div className="mx-auto flex max-w-md flex-col items-center gap-6">
          <nav className="flex gap-2 self-end text-sm" aria-label="Language">
            {langLinks.map((l) => (
              <a
                key={l.code}
                href={l.href}
                hrefLang={l.code}
                aria-current={l.code === lang ? "page" : undefined}
                className={`rounded-full border px-3 py-1 ${l.code === lang ? "border-primary bg-primary/10 font-semibold text-foreground" : "border-primary/25 text-muted-foreground hover:border-primary/60"}`}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <img
            src={alexanderPhoto}
            alt={c.name}
            width={112}
            height={112}
            className="h-28 w-28 rounded-full border-2 border-primary/40 object-cover shadow-card"
          />
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold text-foreground">{c.name}</h1>
            <p className="text-sm leading-relaxed text-muted-foreground">{c.about}</p>
          </div>

          <div className="flex w-full flex-col gap-4">
            {buttons.map((b) => (
              <a
                key={b.title}
                href={b.href}
                {...(b.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-center gap-4 rounded-2xl border border-primary/25 bg-card p-5 shadow-card transition-colors hover:border-primary/60"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-gold">
                  <b.icon className="h-6 w-6 text-white" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold leading-snug text-foreground">{b.title}</span>
                  <span className="mt-1 block text-sm leading-snug text-muted-foreground">{b.text}</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1 rtl:rotate-180" />
              </a>
            ))}
          </div>

          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
            <a href={`${prefix || "/"}?${utm}`} className="text-muted-foreground underline hover:text-primary">{c.site}</a>
            <a href={CHANNEL} target="_blank" rel="noopener noreferrer" className="text-muted-foreground underline hover:text-primary">{c.channel}</a>
          </nav>
          <p className="text-center text-xs leading-relaxed text-muted-foreground">{c.risk}</p>
        </div>
      </main>
    </>
  );
};

export default Go;

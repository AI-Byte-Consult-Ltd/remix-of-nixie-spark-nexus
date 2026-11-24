import authorImg from "@/assets/author-alexander.webp";
import { useLanguage } from "@/contexts/LanguageContext";

// Alexander Lunin's personal channels. One list for the whole site:
// footer, home team block and the author block on /trading.
type SocialId = "instagram" | "threads" | "youtube" | "substack" | "medium";

export const AUTHOR_SOCIALS: { id: SocialId; label: string; handle: string; url: string }[] = [
  { id: "instagram", label: "Instagram", handle: "@alexander.nics", url: "https://www.instagram.com/alexander.nics/" },
  { id: "threads", label: "Threads", handle: "@alexander.nics", url: "https://www.threads.com/@alexander.nics" },
  { id: "youtube", label: "YouTube", handle: "@Alexander.Beyond.Ordinary", url: "https://www.youtube.com/@Alexander.Beyond.Ordinary" },
  { id: "substack", label: "Substack", handle: "@navajjoo", url: "https://substack.com/@navajjoo" },
  { id: "medium", label: "Medium", handle: "alexander-nics", url: "https://alexander-nics.medium.com/" },
];

const SocialIcon = ({ id, className = "h-5 w-5" }: { id: SocialId; className?: string }) => {
  const common = { className, viewBox: "0 0 24 24", "aria-hidden": true } as const;
  switch (id) {
    case "instagram":
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
        </svg>
      );
    case "threads":
      return (
        <svg {...common} fill="currentColor">
          <path d="M17.7 11.1c-.1 0-.2-.1-.3-.1-.2-3.2-1.9-5-4.9-5h-.1c-1.8 0-3.2.7-4.1 2.1l1.6 1.1c.7-1 1.7-1.2 2.5-1.2h.1c1 0 1.8.3 2.2.9.4.4.6 1 .7 1.8-.9-.1-1.8-.2-2.8-.1-2.8.2-4.6 1.8-4.5 4.1.1 1.2.6 2.2 1.6 2.8.8.5 1.9.8 3 .7 1.5-.1 2.6-.6 3.4-1.6.6-.8 1-1.7 1.1-2.9.7.4 1.2 1 1.5 1.6.5 1.2.5 3.1-1 4.6-1.3 1.3-2.9 1.9-5.3 1.9-2.7 0-4.7-.9-6-2.6-1.2-1.6-1.9-3.9-1.9-6.8s.6-5.2 1.9-6.8c1.3-1.7 3.3-2.6 6-2.6 2.7 0 4.8.9 6.2 2.6.7.8 1.2 1.9 1.5 3.1l1.9-.5c-.4-1.5-1-2.8-1.9-3.9C18.6 1.2 16 .1 12.6 0h-.1C9.1.1 6.5 1.2 4.8 3.3 3.3 5.2 2.5 7.9 2.5 11.2v.1c0 3.3.8 6 2.3 7.9 1.7 2.2 4.3 3.3 7.7 3.3h.1c3 0 5.2-.8 6.9-2.6 2.3-2.3 2.2-5.2 1.5-6.9-.5-1.2-1.6-2.3-3.3-3.1zm-5.2 4.9c-1.3.1-2.6-.5-2.6-1.6-.1-.8.6-1.8 2.7-1.9h.7c.8 0 1.5.1 2.2.2-.3 3-1.7 3.2-3 3.3z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common} fill="currentColor">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
        </svg>
      );
    case "substack":
      return (
        <svg {...common} fill="currentColor">
          <path d="M3 3h18v2.6H3V3zm0 5h18v2.6H3V8zm0 5h18v8.5l-9-5-9 5V13z" />
        </svg>
      );
    case "medium":
      return (
        <svg {...common} fill="currentColor">
          <ellipse cx="6.8" cy="12" rx="6.8" ry="6.9" />
          <ellipse cx="17.6" cy="12" rx="3.4" ry="6.5" />
          <ellipse cx="22.6" cy="12" rx="1.3" ry="5.8" />
        </svg>
      );
  }
};

/** Row of round icon links. Used in the footer and the home team block. */
export const AuthorSocialIcons = ({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" }) => {
  const box = size === "sm" ? "p-2" : "p-3";
  const icon = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {AUTHOR_SOCIALS.map((s) => (
        <a
          key={s.id}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer me"
          title={`${s.label} ${s.handle}`}
          aria-label={`Alexander Lunin — ${s.label}`}
          className={`${box} rounded-full bg-accent text-primary transition-colors hover:bg-primary/10`}
        >
          <SocialIcon id={s.id} className={icon} />
        </a>
      ))}
    </div>
  );
};

const AUTHOR_COPY = {
  ru: {
    badge: "Автор проекта",
    role: "Сооснователь AI Byte Consult, автор NICS Trading Ecosystem",
    text: "Рассказываю, как развивается проект: что построено, что не сработало, реальные цифры. Плюс путешествия и технологии — «За гранью возможного».",
    follow: "Подписывайтесь, где вам удобнее:",
  },
  bg: {
    badge: "Автор на проекта",
    role: "Съосновател на AI Byte Consult, автор на NICS Trading Ecosystem",
    text: "Разказвам как се развива проектът: какво е построено, какво не проработи, реални числа. Плюс пътешествия и технологии — „Отвъд обикновеното“.",
    follow: "Последвайте ме, където ви е удобно:",
  },
  en: {
    badge: "Behind the project",
    role: "Co-founder of AI Byte Consult, author of NICS Trading Ecosystem",
    text: "I share how the project is going: what got built, what didn't work, real numbers. Plus travel and tech — Beyond the Ordinary.",
    follow: "Follow wherever suits you:",
  },
};

// Other site languages (added 2026-11-22); en / ru / bg live in AUTHOR_COPY.
const AUTHOR_COPY_MORE: Record<string, (typeof AUTHOR_COPY)["en"]> = {
  de: { badge: "Hinter dem Projekt", role: "Mitgründer von AI Byte Consult, Autor von NICS Trading Ecosystem", text: "Ich erzähle, wie das Projekt vorankommt: was gebaut wurde, was nicht funktioniert hat, echte Zahlen. Dazu Reisen und Technik — Beyond the Ordinary.", follow: "Folgen Sie mir, wo es Ihnen passt:" },
  es: { badge: "Detrás del proyecto", role: "Cofundador de AI Byte Consult, autor de NICS Trading Ecosystem", text: "Cuento cómo avanza el proyecto: qué se ha construido, qué no ha funcionado, cifras reales. Además, viajes y tecnología — Beyond the Ordinary.", follow: "Sígueme donde prefieras:" },
  fr: { badge: "Derrière le projet", role: "Cofondateur d'AI Byte Consult, auteur de NICS Trading Ecosystem", text: "Je raconte l'avancement du projet : ce qui a été construit, ce qui n'a pas marché, les vrais chiffres. Et aussi voyages et tech — Beyond the Ordinary.", follow: "Suivez-moi là où vous préférez :" },
  it: { badge: "Dietro il progetto", role: "Cofondatore di AI Byte Consult, autore di NICS Trading Ecosystem", text: "Racconto come procede il progetto: cosa è stato costruito, cosa non ha funzionato, numeri reali. In più viaggi e tecnologia — Beyond the Ordinary.", follow: "Seguimi dove preferisci:" },
  pl: { badge: "Autor projektu", role: "Współzałożyciel AI Byte Consult, autor NICS Trading Ecosystem", text: "Opowiadam, jak rozwija się projekt: co zbudowaliśmy, co nie zadziałało, prawdziwe liczby. Do tego podróże i technologia — Beyond the Ordinary.", follow: "Obserwuj tam, gdzie Ci wygodnie:" },
  pt: { badge: "Por trás do projeto", role: "Cofundador da AI Byte Consult, autor do NICS Trading Ecosystem", text: "Conto como o projeto está indo: o que foi construído, o que não deu certo, números reais. Além de viagens e tecnologia — Beyond the Ordinary.", follow: "Siga onde for melhor para você:" },
  tr: { badge: "Projenin arkasında", role: "AI Byte Consult'un kurucu ortağı, NICS Trading Ecosystem'in yazarı", text: "Projenin nasıl ilerlediğini paylaşıyorum: neler yapıldı, neler işe yaramadı, gerçek rakamlar. Bir de seyahat ve teknoloji — Beyond the Ordinary.", follow: "Size uygun yerden takip edin:" },
  zh: { badge: "项目背后", role: "AI Byte Consult 联合创始人，NICS Trading Ecosystem 作者", text: "我会分享项目的进展：做成了什么、哪些没成功、真实的数字。还有旅行和科技内容 — Beyond the Ordinary。", follow: "在您方便的平台关注我：" },
  ar: { badge: "وراء المشروع", role: "شريك مؤسس في AI Byte Consult، ومؤلف NICS Trading Ecosystem", text: "أشارك كيف يتقدّم المشروع: ما الذي بُني، وما الذي لم ينجح، والأرقام الحقيقية. وأيضًا السفر والتقنية — Beyond the Ordinary.", follow: "تابعني حيث يناسبك:" },
};
/** Author card with photo and labelled links, for landing pages like /trading. */
export const AuthorBlock = () => {
  const { language } = useLanguage();
  const c = language === "ru" ? AUTHOR_COPY.ru : language === "bg" ? AUTHOR_COPY.bg : AUTHOR_COPY_MORE[language] ?? AUTHOR_COPY.en;
  const name = language === "ru" || language === "bg" ? "Александр Лунин" : "Alexander Lunin";

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 rounded-3xl border border-border/60 bg-card/60 p-8 md:flex-row md:items-start md:p-12">
          <img
            src={authorImg}
            alt={name}
            width={160}
            height={160}
            loading="lazy"
            className="h-32 w-32 shrink-0 rounded-full object-cover ring-4 ring-primary/20 md:h-40 md:w-40"
          />
          <div className="flex-1 text-center md:text-left">
            <p className="text-sm font-medium uppercase tracking-wide text-primary">{c.badge}</p>
            <h2 className="mt-2 text-3xl font-semibold">{name}</h2>
            <p className="mt-1 text-muted-foreground">{c.role}</p>
            <p className="mt-4 leading-7 text-muted-foreground">{c.text}</p>
            <p className="mt-6 text-sm font-medium">{c.follow}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
              {AUTHOR_SOCIALS.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-4 py-2 text-sm transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <SocialIcon id={s.id} className="h-4 w-4" />
                  <span>{s.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// NICS Trading Lab: the project's own YouTube channel (trading, technical
// analysis, how the NICS Trading Ecosystem app is being built).
export const TRADING_LAB_URL = "https://www.youtube.com/@NICSTradingLab";

const TRADING_LAB_COPY = {
  ru: {
    title: "NICS Trading Lab на YouTube",
    text: "Трейдинг, технический анализ и как мы разрабатываем приложение NICS Trading Ecosystem — изнутри.",
    button: "Смотреть канал",
  },
  bg: {
    title: "NICS Trading Lab в YouTube",
    text: "Трейдинг, технически анализ и как разработваме приложението NICS Trading Ecosystem — отвътре.",
    button: "Към канала",
  },
  en: {
    title: "NICS Trading Lab on YouTube",
    text: "Trading, technical analysis and how we build the NICS Trading Ecosystem app, from the inside.",
    button: "Watch the channel",
  },
};

// Other site languages (added 2026-11-22); en / ru / bg live in TRADING_LAB_COPY.
const TRADING_LAB_COPY_MORE: Record<string, (typeof TRADING_LAB_COPY)["en"]> = {
  de: { title: "NICS Trading Lab auf YouTube", text: "Trading, technische Analyse und wie wir die App NICS Trading Ecosystem entwickeln, ein Blick hinter die Kulissen.", button: "Kanal ansehen" },
  es: { title: "NICS Trading Lab en YouTube", text: "Trading, análisis técnico y cómo desarrollamos la app NICS Trading Ecosystem, desde dentro.", button: "Ver el canal" },
  fr: { title: "NICS Trading Lab sur YouTube", text: "Trading, analyse technique et les coulisses du développement de l'application NICS Trading Ecosystem.", button: "Voir la chaîne" },
  it: { title: "NICS Trading Lab su YouTube", text: "Trading, analisi tecnica e come sviluppiamo l'app NICS Trading Ecosystem, dall'interno.", button: "Guarda il canale" },
  pl: { title: "NICS Trading Lab na YouTube", text: "Trading, analiza techniczna i kulisy budowy aplikacji NICS Trading Ecosystem.", button: "Oglądaj kanał" },
  pt: { title: "NICS Trading Lab no YouTube", text: "Trading, análise técnica e como desenvolvemos o app NICS Trading Ecosystem, por dentro.", button: "Ver o canal" },
  tr: { title: "YouTube'da NICS Trading Lab", text: "Trading, teknik analiz ve NICS Trading Ecosystem uygulamasını nasıl geliştirdiğimiz, içeriden.", button: "Kanalı izle" },
  zh: { title: "YouTube 上的 NICS Trading Lab", text: "交易、技术分析，以及我们如何开发 NICS Trading Ecosystem 应用的幕后过程。", button: "观看频道" },
  ar: { title: "NICS Trading Lab على YouTube", text: "التداول والتحليل الفني وكيف نطوّر تطبيق NICS Trading Ecosystem، من الداخل.", button: "شاهد القناة" },
};

/** Banner for the project's YouTube channel, shown on /trading. */
export const TradingLabBanner = () => {
  const { language } = useLanguage();
  const c = language === "ru" ? TRADING_LAB_COPY.ru : language === "bg" ? TRADING_LAB_COPY.bg : TRADING_LAB_COPY_MORE[language] ?? TRADING_LAB_COPY.en;
  return (
    <section className="pt-4">
      <div className="container mx-auto px-4">
        <a
          href={TRADING_LAB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-3xl border border-red-500/30 bg-gradient-to-br from-red-500/10 via-background to-primary/10 p-8 text-center transition-colors hover:border-red-500/60 md:flex-row md:p-10 md:text-left"
        >
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white">
            <SocialIcon id="youtube" className="h-8 w-8" />
          </span>
          <span className="flex-1">
            <span className="block text-2xl font-semibold md:text-3xl">{c.title}</span>
            <span className="mt-1 block text-sm text-muted-foreground">@NICSTradingLab</span>
            <span className="mt-3 block leading-7 text-muted-foreground">{c.text}</span>
          </span>
          <span className="inline-flex shrink-0 items-center rounded-full bg-red-600 px-6 py-3 font-medium text-white transition-transform group-hover:scale-105">
            {c.button}
          </span>
        </a>
      </div>
    </section>
  );
};

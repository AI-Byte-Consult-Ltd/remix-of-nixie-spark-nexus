import { Mail, Phone, MessageCircle } from "lucide-react";
import Link from "@/components/SiteLink";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthorSocialIcons, TRADING_LAB_URL } from "@/components/AuthorSocials";
import { windowsAppPath } from "@/i18n/windowsApp";
import { blogPath, phasedPath } from "@/i18n/phasedSeo";

// Featured articles (content/blog). Articles exist in EN, RU and BG; every
// other language links to the English version. Slugs must match folders in
// content/blog, otherwise the link 404s.
const FEATURED_ARTICLES: { slug: string; label: Record<"en" | "ru" | "bg", string> }[] = [
  { slug: "trading-signals-vs-automated-trading", label: { en: "Signals vs automated trading", ru: "Торговые сигналы или автоторговля", bg: "Сигнали или автоматична търговия" } },
  { slug: "forex-risk-management", label: { en: "Forex risk management: 8 rules", ru: "Риск-менеджмент: 8 правил", bg: "Управление на риска: 8 правила" } },
  { slug: "how-to-calculate-lot-size-forex", label: { en: "How to calculate lot size", ru: "Как рассчитать размер лота", bg: "Как да изчислим размера на лота" } },
  { slug: "how-to-analyze-gold-market", label: { en: "How to analyze the gold market", ru: "Как анализировать рынок золота", bg: "Как да анализираме пазара на злато" } },
  { slug: "short-video-editing-cost", label: { en: "How much short video editing costs", ru: "Сколько стоит монтаж коротких видео", bg: "Колко струва монтажът на кратки видеа" } },
];

const ALL_ARTICLES_LABEL: Record<"en" | "ru" | "bg", string> = { en: "All articles →", ru: "Все статьи →", bg: "Всички статии →" };

const SOFTWARE_LABEL: Record<string, string> = {
  en: "AI Trading Software", ru: "Программа для трейдинга с ИИ", bg: "Софтуер за трейдинг с ИИ", de: "KI-Trading-Software", es: "Software de trading con IA",
};

const ABOUT_LABEL: Record<string, string> = {
  en: "About us", ru: "О компании", bg: "За нас", de: "Über uns", es: "Sobre nosotros", pt: "Sobre nós",
  fr: "À propos", it: "Chi siamo", pl: "O nas", tr: "Hakkımızda", ar: "من نحن", zh: "关于我们",
};

const Footer = () => {
  const { t, language } = useLanguage();
  // Articles are static pages outside the SPA (scripts/blog.mjs), so a plain
  // <a> with a full page load, in the reader's language where one exists.
  const blogLang = language === "ru" || language === "bg" ? language : "en";
  const blogHref = blogPath(language);
  const blogLabel = blogLang === "ru" ? "Статьи" : blogLang === "bg" ? "Статии" : "Articles";
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="relative py-16 border-t border-border/50 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">AI Byte Consult Ltd.</h3>
              <p className="text-muted-foreground leading-relaxed">{t("footer.description")}</p>
              <div className="pt-2 space-y-2">
                <p className="text-sm font-medium text-foreground">Alexander Lunin</p>
                <AuthorSocialIcons size="sm" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">{t("footer.quicklinks")}</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.home")}</Link></li>
                <li><Link to={phasedPath("/about", language)} className="text-muted-foreground hover:text-primary transition-colors">{ABOUT_LABEL[language] ?? "About us"}</Link></li>
                <li><Link to="/#ecosystem" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.ecosystem")}</Link></li>
                <li><Link to="/trading" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.trading")}</Link></li>
                <li><Link to="/#projects" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.projects")}</Link></li>
                <li><Link to="/#contact" className="text-muted-foreground hover:text-primary transition-colors">{t("nav.contact")}</Link></li>
                <li><Link to="/nics-multimedia" className="text-muted-foreground hover:text-primary transition-colors">NICS Multimedia</Link></li>
                <li><a href="https://alessandro-studio.eu" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Partners</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">{t("footer.services")}</h3>
              <ul className="space-y-2">
                <li><a href="https://estate.aibyteconsult.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">NICS Real Estate</a></li>
                <li><Link to={phasedPath("/nics-ecosystem", language)} className="text-muted-foreground hover:text-primary transition-colors">NICS AI Ecosystem</Link></li>
                <li><Link to="/trading" className="text-muted-foreground hover:text-primary transition-colors">NICS Trading Ecosystem</Link></li>
                <li><Link to={phasedPath("/nics-trading-software", language)} className="text-muted-foreground hover:text-primary transition-colors">{SOFTWARE_LABEL[language] ?? SOFTWARE_LABEL.en}</Link></li>
                <li><Link to={windowsAppPath(language)} className="text-muted-foreground hover:text-primary transition-colors">NICS Trading Ecosystem for Windows</Link></li>
                <li><Link to="/nics-video" className="text-muted-foreground hover:text-primary transition-colors">NICS Video</Link></li>
                <li><a href={TRADING_LAB_URL} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">NICS Trading Lab (YouTube)</a></li>
                <li><a href="https://pride.aibyteconsult.com/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">NICS Social</a></li>
                <li><a href="https://aquaterra.aibyteconsult.com/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">AquaTerra World</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                <a href={blogHref} className="hover:text-primary transition-colors">{blogLabel}</a>
              </h3>
              <ul className="space-y-2">
                {FEATURED_ARTICLES.map((article) => (
                  <li key={article.slug}>
                    <a href={blogPath(language, article.slug)} className="text-muted-foreground hover:text-primary transition-colors">{article.label[blogLang]}</a>
                  </li>
                ))}
                <li><a href={blogHref} className="font-medium text-primary hover:underline underline-offset-4">{ALL_ARTICLES_LABEL[blogLang]}</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">{t("footer.legal")}</h3>
              <ul className="space-y-2">
                <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.terms")}</Link></li>
                <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.privacy")}</Link></li>
              </ul>
              <div className="pt-4 space-y-2">
                <a href="mailto:info@aibyteconsult.com" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>info@aibyteconsult.com</span>
                </a>
                <a href="tel:+359988899109" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>+359 988 899 109</span>
                </a>
                <a href="viber://chat?number=%2B359988899109" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>Viber</span>
                </a>
                <a href="https://wa.me/359988899109" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-green-500 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              © 2011–{currentYear} {t("footer.copyright")}
            </p>
            <p className="text-muted-foreground text-sm font-medium tracking-wide">{t("footer.madein")}</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;

import { Mail, Phone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { AuthorSocialIcons, TRADING_LAB_URL } from "@/components/AuthorSocials";
import { windowsAppPath } from "@/i18n/windowsApp";
import { phasedPath } from "@/i18n/phasedSeo";

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
  const blogHref = language === "ru" || language === "bg" ? `/${language}/blog/` : "/blog/";
  const blogLabel = language === "ru" ? "Статьи" : language === "bg" ? "Статии" : "Articles";
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="relative py-16 border-t border-border/50 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
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
                <li><a href={blogHref} className="text-muted-foreground hover:text-primary transition-colors">{blogLabel}</a></li>
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
                <li><a href="https://pridesocial.org" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">NICS Social</a></li>
                <li><a href="https://aquaterra.aibyteconsult.com/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">AquaTerra World</a></li>
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

import { Mail, Phone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 border-t border-border/50 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">AI Byte Consult Ltd.</h3>
            <p className="text-muted-foreground leading-relaxed">{t("footer.description")}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">{t("footer.quicklinks")}</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.home")}</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.aboutus")}</Link></li>
              <li><Link to="/#ecosystem" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.ecosystem")}</Link></li>
              <li><Link to="/#projects" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.projects")}</Link></li>
              <li><Link to="/#contact" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.contact")}</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">{t("footer.services")}</h3>
            <ul className="space-y-2">
              <li><a href="https://estate.aibyteconsult.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">NICS Real Estate</a></li>
              <li><Link to="/insurance" className="text-muted-foreground hover:text-primary transition-colors">NICS Insurance</Link></li>
              <li><Link to="/translation" className="text-muted-foreground hover:text-primary transition-colors">NICS Translation</Link></li>
              <li><Link to="/furnishings" className="text-muted-foreground hover:text-primary transition-colors">NICS Furnishings</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">{t("footer.legal")}</h3>
            <ul className="space-y-2">
              <li><a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.privacy")}</a></li>
              <li><a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">{t("footer.terms")}</a></li>
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
              <a href="viber://chat?number=%2B359988899109" className="flex items-center gap-2 text-muted-foreground hover:text-purple-500 transition-colors">
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
  );
};

export default Footer;

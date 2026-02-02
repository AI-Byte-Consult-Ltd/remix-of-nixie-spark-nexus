import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, Globe, ChevronDown } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Link, useLocation } from "react-router-dom";

const languages: { code: Language; flag: string; name: string }[] = [
  { code: "en", flag: "🇬🇧", name: "English" },
  { code: "de", flag: "🇩🇪", name: "Deutsch" },
  { code: "fr", flag: "🇫🇷", name: "Français" },
  { code: "ar", flag: "🇸🇦", name: "العربية" },
  { code: "zh", flag: "🇨🇳", name: "中文" },
];

const nicsServices = [
  { href: "/estate", label: "NICS Real Estate" },
  { href: "/insurance", label: "NICS Insurance" },
  { href: "/translation", label: "NICS Translation" },
  { href: "/furnishings", label: "NICS Furnishings" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const { language, setLanguage, t, isRTL } = useLanguage();
  const location = useLocation();

  const currentLang = languages.find((l) => l.code === language);

  const navLinks = [
    { href: "/", label: t("nav.home"), isHome: true },
    { href: "/#ecosystem", label: t("nav.ecosystem") },
    { href: "/#projects", label: t("nav.projects") },
    { href: "/#ai-automation-fix", label: t("nav.automation") },
    { href: "/#contact", label: t("nav.contact") },
  ];

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
    if (href.startsWith("/#") && location.pathname === "/") {
      const id = href.replace("/#", "");
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-semibold text-foreground tracking-tight">
            AI Byte Consult
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-muted/50"
              >
                {link.label}
              </Link>
            ))}

            {/* Services Dropdown */}
            <DropdownMenu open={isServicesOpen} onOpenChange={setIsServicesOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50">
                  Services
                  <ChevronDown className={`w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                {nicsServices.map((service) => (
                  <DropdownMenuItem key={service.href} asChild>
                    <Link
                      to={service.href}
                      className="w-full cursor-pointer"
                    >
                      {service.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 ml-2 rounded-full hover:bg-muted/50">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-lg">{currentLang?.flag}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? "start" : "end"}>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`gap-2 cursor-pointer ${language === lang.code ? "bg-accent" : ""}`}
                    dir={lang.code === "ar" ? "rtl" : "ltr"}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {/* Mobile Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <span className="text-xl">{currentLang?.flag}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? "start" : "end"}>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`gap-2 cursor-pointer ${language === lang.code ? "bg-accent" : ""}`}
                    dir={lang.code === "ar" ? "rtl" : "ltr"}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-full"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile Services */}
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-2">
                Services
              </div>
              {nicsServices.map((service) => (
                <Link
                  key={service.href}
                  to={service.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors"
                >
                  {service.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

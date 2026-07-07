import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Building2, Scale, Languages, Palette, Shield, Bot, Briefcase, Home } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-microscheme.jpg";
import { useLanguage } from "@/contexts/LanguageContext";

const sectorKeys = [
  { icon: Bot, key: "hero.sector.ai" },
  { icon: Briefcase, key: "hero.sector.automation" },
  { icon: Building2, key: "hero.sector.estate" },
  { icon: Languages, key: "hero.sector.translation" },
  { icon: Scale, key: "hero.sector.law" },
  { icon: Shield, key: "hero.sector.insurance" },
  { icon: Home, key: "hero.sector.registration" },
  { icon: Palette, key: "hero.sector.design" },
];

const Hero = () => {
  const { t } = useLanguage();

  const scrollToEcosystem = () => {
    document.getElementById("ecosystem")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />
      
      <div className="container relative z-10 mx-auto px-6 md:px-12 lg:px-20 pt-28 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-fade-in space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-sm font-medium text-primary">{t("hero.badge")}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] text-foreground">
              {t("hero.headline1")}{" "}
              <span className="text-gradient-gold">{t("hero.headline2")}</span>
            </h1>

            <p className="text-xl md:text-2xl font-medium text-primary italic">
              {t("hero.slogan")}
            </p>

            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
              {t("hero.desc2")}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
              {sectorKeys.map((sector, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/30 hover:bg-accent/50 transition-all duration-300"
                >
                  <sector.icon className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-xs font-medium text-foreground truncate">{t(sector.key)}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                size="lg"
                onClick={scrollToEcosystem}
                className="group bg-foreground hover:bg-foreground/90 text-background font-medium text-base px-8 py-6 rounded-full transition-all duration-300"
              >
                {t("hero.cta")}
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Link to="/about">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-medium text-base px-8 py-6 rounded-full border-2 border-border hover:border-foreground/20 hover:bg-muted/50 transition-all duration-300 w-full sm:w-auto"
                >
                  {t("hero.aboutus")}
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>{t("hero.trust.since")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>{t("hero.trust.meta")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>{t("hero.trust.microsoft")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>{t("hero.trust.global")}</span>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in order-1 lg:order-2" style={{ animationDelay: "200ms" }}>
            <div className="relative">
              <img
                src={heroImage}
                alt="AI Technology - Golden Microscheme"
                className="relative w-full h-auto rounded-3xl shadow-hover object-cover aspect-video"
              />
              <div className="hidden sm:block absolute -bottom-4 -left-4 bg-background p-4 rounded-2xl shadow-card border border-border animate-float">
                <div className="text-2xl font-semibold text-gradient-gold">8+</div>
                <div className="text-sm text-muted-foreground">{t("hero.stats.sectors")}</div>
              </div>
              <div className="hidden sm:block absolute -top-4 -right-4 bg-background p-4 rounded-2xl shadow-card border border-border animate-float" style={{ animationDelay: "1s" }}>
                <div className="text-2xl font-semibold text-gradient-gold">14+</div>
                <div className="text-sm text-muted-foreground">{t("hero.stats.experience")}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-muted-foreground/30 rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;

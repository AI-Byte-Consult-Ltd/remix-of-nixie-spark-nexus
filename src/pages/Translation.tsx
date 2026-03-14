import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Languages, FileCheck, Scale, Globe, ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import useSEO from "@/hooks/useSEO";
import { useLanguage } from "@/contexts/LanguageContext";

const serviceIcons = [Languages, FileCheck, Scale, Globe];

const Translation = () => {
  const { t } = useLanguage();

  useSEO({
    title: "NICS Translation & Legalisation — Certified Services | AI Byte Consult",
    description: "Professional certified translation and legalisation services in 50+ languages with AI-enhanced accuracy, apostille, and notarized translations.",
    canonical: "https://aibyteconsult.com/translation",
    ogImage: "https://aibyteconsult.com/og-translation.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "NICS Translation & Legalisation",
      "provider": { "@type": "Organization", "name": "AI Byte Consult Ltd" },
      "description": "Certified translation and legalisation services in 50+ languages.",
      "url": "https://aibyteconsult.com/translation"
    },
  });

  const services = [
    { icon: serviceIcons[0], title: t("translation.service1.title"), description: t("translation.service1.desc") },
    { icon: serviceIcons[1], title: t("translation.service2.title"), description: t("translation.service2.desc") },
    { icon: serviceIcons[2], title: t("translation.service3.title"), description: t("translation.service3.desc") },
    { icon: serviceIcons[3], title: t("translation.service4.title"), description: t("translation.service4.desc") },
  ];

  const languages = [
    t("translation.lang.en"), t("translation.lang.de"), t("translation.lang.fr"),
    t("translation.lang.ar"), t("translation.lang.zh"), t("translation.lang.es"),
    t("translation.lang.ru"), t("translation.lang.pt"), t("translation.lang.ja"),
    t("translation.lang.ko"), t("translation.lang.it"), t("translation.lang.nl"),
  ];

  const benefits = [
    t("translation.benefit1"), t("translation.benefit2"), t("translation.benefit3"),
    t("translation.benefit4"), t("translation.benefit5"), t("translation.benefit6"),
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
              <Languages className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">NICS Translation & Legalisation</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
              {t("translation.hero.title1")} <span className="text-gradient-gold">{t("translation.hero.title2")}</span> {t("translation.hero.title3")}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("translation.hero.desc")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                {t("translation.cta.quote")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Link to="/#contact">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-2">
                  {t("translation.cta.contact")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              {t("translation.services.title1")} <span className="text-gradient-gold">{t("translation.services.title2")}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("translation.services.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <Card key={index} className="card-hover bg-card border-border/50 hover:border-primary/30">
                <CardHeader>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-gold flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              50+ <span className="text-gradient-gold">{t("translation.languages.title")}</span> {t("translation.languages.supported")}
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {languages.map((lang, index) => (
                <span key={index} className="px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium">
                  {lang}
                </span>
              ))}
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                + 40 {t("translation.languages.more")}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                  {t("translation.why.title1")} <span className="text-gradient-gold">{t("translation.why.title2")}</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  {t("translation.why.desc")}
                </p>
              </div>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6 bg-card p-12 rounded-3xl border border-border/50 shadow-card">
            <h2 className="text-3xl font-semibold text-foreground">
              {t("translation.cta.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("translation.cta.desc")}
            </p>
            <Link to="/#contact">
              <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                {t("translation.cta.button")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Translation;

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sofa, Home, Palette, Box, ArrowRight, Check, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import useSEO from "@/hooks/useSEO";
import { useLanguage } from "@/contexts/LanguageContext";

const featureIcons = [Home, Sofa, Palette, Eye];

const Furnishings = () => {
  const { t } = useLanguage();

  useSEO({
    title: "NICS Furnishings — 3D Interior Design | AI Byte Consult",
    description: "3D house projects and virtual furnishing platform. Visualize your dream home with photorealistic renderings and AI-powered interior design.",
    canonical: "https://aibyteconsult.com/furnishings",
    ogImage: "https://aibyteconsult.com/og-furnishings.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "NICS Furnishings",
      "provider": { "@type": "Organization", "name": "AI Byte Consult Ltd" },
      "description": "3D house projects and virtual furnishing with AI-powered interior design.",
      "url": "https://aibyteconsult.com/furnishings"
    },
  });

  const features = [
    { icon: featureIcons[0], title: t("furnishings.feature1.title"), description: t("furnishings.feature1.desc") },
    { icon: featureIcons[1], title: t("furnishings.feature2.title"), description: t("furnishings.feature2.desc") },
    { icon: featureIcons[2], title: t("furnishings.feature3.title"), description: t("furnishings.feature3.desc") },
    { icon: featureIcons[3], title: t("furnishings.feature4.title"), description: t("furnishings.feature4.desc") },
  ];

  const process = [
    { step: "01", title: t("furnishings.step1.title"), description: t("furnishings.step1.desc") },
    { step: "02", title: t("furnishings.step2.title"), description: t("furnishings.step2.desc") },
    { step: "03", title: t("furnishings.step3.title"), description: t("furnishings.step3.desc") },
    { step: "04", title: t("furnishings.step4.title"), description: t("furnishings.step4.desc") },
  ];

  const benefits = [
    t("furnishings.benefit1"), t("furnishings.benefit2"), t("furnishings.benefit3"),
    t("furnishings.benefit4"), t("furnishings.benefit5"), t("furnishings.benefit6"),
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-40 left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
              <Box className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">NICS Furnishings</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
              {t("furnishings.hero.title1")} <span className="text-gradient-gold">{t("furnishings.hero.title2")}</span> {t("furnishings.hero.title3")}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t("furnishings.hero.desc")}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                {t("furnishings.cta.start")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Link to="/#contact">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-2">
                  {t("furnishings.cta.portfolio")}
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
              {t("furnishings.offer.title1")} <span className="text-gradient-gold">{t("furnishings.offer.title2")}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("furnishings.offer.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="card-hover bg-card border-border/50 hover:border-primary/30">
                <CardHeader>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-gold flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              {t("furnishings.process.title1")} <span className="text-gradient-gold">{t("furnishings.process.title2")}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("furnishings.process.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {process.map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="text-5xl font-bold text-gradient-gold">{item.step}</div>
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                  {t("furnishings.why.title1")} <span className="text-gradient-gold">{t("furnishings.why.title2")}</span>
                </h2>
                <p className="text-lg text-muted-foreground">
                  {t("furnishings.why.desc")}
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
              {t("furnishings.cta.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("furnishings.cta.desc")}
            </p>
            <Link to="/#contact">
              <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                {t("furnishings.cta.button")}
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

export default Furnishings;

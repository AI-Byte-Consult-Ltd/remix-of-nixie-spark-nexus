import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Building2, Bot, Briefcase, Languages, Scale, Shield, Home, Palette,
  Target, Eye, Heart, Globe, Users, Award, ArrowRight, CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import useSEO from "@/hooks/useSEO";
import { useLanguage } from "@/contexts/LanguageContext";

const divisionIcons = [Bot, Briefcase, Building2, Languages, Scale, Shield, Home, Palette];
const valueIcons = [Target, Eye, Heart];

const About = () => {
  const { t } = useLanguage();

  useSEO({
    title: "About AI Byte Consult — Mission, Vision & Divisions",
    description: "Discover AI Byte Consult Ltd, a diversified holding company founded in 2011 with 8+ business divisions serving 50+ countries worldwide.",
    canonical: "https://aibyteconsult.com/about",
    ogImage: "https://aibyteconsult.com/og-about.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About AI Byte Consult",
      "url": "https://aibyteconsult.com/about",
      "mainEntity": {
        "@type": "Organization",
        "name": "AI Byte Consult Ltd",
        "foundingDate": "2011",
        "numberOfEmployees": { "@type": "QuantitativeValue", "value": "50+" },
        "areaServed": "Worldwide"
      }
    },
  });

  const businessDivisions = [
    { icon: divisionIcons[0], title: t("aboutpage.div1.title"), description: t("aboutpage.div1.desc"), link: undefined },
    { icon: divisionIcons[1], title: t("aboutpage.div2.title"), description: t("aboutpage.div2.desc"), link: undefined },
    { icon: divisionIcons[2], title: t("aboutpage.div3.title"), description: t("aboutpage.div3.desc"), link: "/estate" },
    { icon: divisionIcons[3], title: t("aboutpage.div4.title"), description: t("aboutpage.div4.desc"), link: "/translation" },
    { icon: divisionIcons[4], title: t("aboutpage.div5.title"), description: t("aboutpage.div5.desc"), link: undefined },
    { icon: divisionIcons[5], title: t("aboutpage.div6.title"), description: t("aboutpage.div6.desc"), link: "/insurance" },
    { icon: divisionIcons[6], title: t("aboutpage.div7.title"), description: t("aboutpage.div7.desc"), link: undefined },
    { icon: divisionIcons[7], title: t("aboutpage.div8.title"), description: t("aboutpage.div8.desc"), link: "/furnishings" },
  ];

  const companyValues = [
    { icon: valueIcons[0], title: t("aboutpage.value1.title"), description: t("aboutpage.value1.desc") },
    { icon: valueIcons[1], title: t("aboutpage.value2.title"), description: t("aboutpage.value2.desc") },
    { icon: valueIcons[2], title: t("aboutpage.value3.title"), description: t("aboutpage.value3.desc") },
  ];

  const companyStats = [
    { value: "2011", label: t("aboutpage.stat1") },
    { value: "8+", label: t("aboutpage.stat2") },
    { value: "50+", label: t("aboutpage.stat3") },
    { value: "500+", label: t("aboutpage.stat4") },
  ];

  const milestones = [
    { year: "2011", event: t("aboutpage.milestone1") },
    { year: "2013", event: t("aboutpage.milestone2") },
    { year: "2015", event: t("aboutpage.milestone3") },
    { year: "2017", event: t("aboutpage.milestone4") },
    { year: "2019", event: t("aboutpage.milestone5") },
    { year: "2021", event: t("aboutpage.milestone6") },
    { year: "2023", event: t("aboutpage.milestone7") },
    { year: "2024", event: t("aboutpage.milestone8") },
  ];

  const whyChooseUs = [
    t("aboutpage.choose1"), t("aboutpage.choose2"), t("aboutpage.choose3"), t("aboutpage.choose4"),
    t("aboutpage.choose5"), t("aboutpage.choose6"), t("aboutpage.choose7"), t("aboutpage.choose8"),
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t("aboutpage.badge")}</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
              {t("aboutpage.hero.title1")}{" "}
              <span className="text-gradient-gold">{t("aboutpage.hero.title2")}</span>
            </h1>

            <p className="text-xl md:text-2xl font-medium text-primary italic">
              "{t("aboutpage.hero.slogan")}"
            </p>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {t("aboutpage.hero.desc")}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {companyStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-semibold text-gradient-gold mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                  {t("aboutpage.who.title1")} <span className="text-gradient-gold">{t("aboutpage.who.title2")}</span>
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>{t("aboutpage.who.p1")}</p>
                  <p>{t("aboutpage.who.p2")}</p>
                  <p>{t("aboutpage.who.p3")}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="bg-muted/50 p-6 rounded-2xl border border-border/50">
                    <Users className="w-8 h-8 text-primary mb-3" />
                    <h4 className="font-semibold text-foreground mb-1">{t("aboutpage.card1.title")}</h4>
                    <p className="text-sm text-muted-foreground">{t("aboutpage.card1.desc")}</p>
                  </div>
                  <div className="bg-muted/50 p-6 rounded-2xl border border-border/50">
                    <Award className="w-8 h-8 text-primary mb-3" />
                    <h4 className="font-semibold text-foreground mb-1">{t("aboutpage.card2.title")}</h4>
                    <p className="text-sm text-muted-foreground">{t("aboutpage.card2.desc")}</p>
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-muted/50 p-6 rounded-2xl border border-border/50">
                    <Globe className="w-8 h-8 text-primary mb-3" />
                    <h4 className="font-semibold text-foreground mb-1">{t("aboutpage.card3.title")}</h4>
                    <p className="text-sm text-muted-foreground">{t("aboutpage.card3.desc")}</p>
                  </div>
                  <div className="bg-muted/50 p-6 rounded-2xl border border-border/50">
                    <Bot className="w-8 h-8 text-primary mb-3" />
                    <h4 className="font-semibold text-foreground mb-1">{t("aboutpage.card4.title")}</h4>
                    <p className="text-sm text-muted-foreground">{t("aboutpage.card4.desc")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              {t("aboutpage.purpose.title1")} <span className="text-gradient-gold">{t("aboutpage.purpose.title2")}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("aboutpage.purpose.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {companyValues.map((value, index) => (
              <Card key={index} className="card-hover bg-card border-border/50 text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Business Divisions */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              {t("aboutpage.divisions.title1")} <span className="text-gradient-gold">{t("aboutpage.divisions.title2")}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("aboutpage.divisions.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {businessDivisions.map((division, index) => (
              <Card key={index} className="card-hover bg-card border-border/50 hover:border-primary/30 group">
                <CardHeader className="pb-2">
                  <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center mb-4">
                    <division.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {division.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {division.description}
                  </p>
                  {division.link && (
                    <Link to={division.link} className="inline-flex items-center text-sm font-medium text-primary hover:underline">
                      {t("aboutpage.learnMore")}
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              {t("aboutpage.journey.title1")} <span className="text-gradient-gold">{t("aboutpage.journey.title2")}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t("aboutpage.journey.subtitle")}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-0.5" />
              
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center gap-6 mb-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                  <div className="absolute left-4 md:left-1/2 w-3 h-3 bg-primary rounded-full md:-translate-x-1.5 z-10" />
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm">
                      <div className="text-lg font-semibold text-gradient-gold mb-1">{milestone.year}</div>
                      <p className="text-muted-foreground text-sm">{milestone.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                {t("aboutpage.whychoose.title1")} <span className="text-gradient-gold">{t("aboutpage.whychoose.title2")}</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {whyChooseUs.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6 bg-card p-12 rounded-3xl border border-border/50 shadow-card">
            <h2 className="text-3xl font-semibold text-foreground">
              {t("aboutpage.cta.title")}
            </h2>
            <p className="text-muted-foreground">
              {t("aboutpage.cta.desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/#contact">
                <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                  {t("aboutpage.cta.button1")}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/#ecosystem">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-2">
                  {t("aboutpage.cta.button2")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default About;

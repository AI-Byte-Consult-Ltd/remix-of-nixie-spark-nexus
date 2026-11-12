import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NicsLiveDashboard from "@/components/NicsLiveDashboard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Box, Brain, ChevronDown, Clapperboard, Cpu, Film, Layers, Languages, LineChart, Server, Sparkles } from "lucide-react";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { ecosystemTexts, type EcosystemProduct } from "@/i18n/ecosystem";
import { phasedAlternates, phasedCanonical, phasedLang } from "@/i18n/phasedSeo";

const BASE = "/nics-ecosystem";
const LAB_REPO = "https://github.com/AI-Byte-Consult-Ltd/nics-ai-lab";
const STACK_ICONS = [Layers, Brain, Cpu, Sparkles, Languages, Server];
const PRODUCT_ICONS: Record<EcosystemProduct, typeof LineChart> = {
  trader: LineChart,
  video: Film,
  studio: Clapperboard,
  forge: Box,
  lab: Brain,
};

const productHref = (id: EcosystemProduct, lang: string) => {
  const prefix = lang === "en" ? "" : `/${lang}`;
  if (id === "trader") return `${prefix}/trading`;
  if (id === "video") return `${prefix}/nics-video`;
  if (id === "studio") return `${prefix}/nics-studio`;
  if (id === "forge") return "/nics-forge";
  return LAB_REPO;
};

const NicsEcosystem = () => {
  const { language } = useLanguage();
  const lang = phasedLang(language);
  const tx = ecosystemTexts[lang];
  const canonical = phasedCanonical(BASE, lang);

  const seoProps = {
    title: tx.seoTitle,
    description: tx.seoDescription,
    canonical,
    htmlLang: lang,
    alternates: phasedAlternates(BASE),
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: tx.seoTitle,
        description: tx.seoDescription,
        url: canonical,
        inLanguage: lang,
        about: tx.products.map((p) => ({ "@type": "SoftwareApplication", name: p.title })),
        publisher: { "@type": "Organization", name: "AI Byte Consult Ltd", url: "https://aibyteconsult.com/" },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: tx.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <>
      <SEO {...seoProps} />
      <main className="min-h-screen bg-background text-foreground">
      <Header />

      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.12] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 15% 20%, rgba(34,211,238,0.5), transparent 40%), radial-gradient(circle at 85% 80%, rgba(20,184,166,0.35), transparent 45%)" }}
        />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl space-y-6">
            <Badge className="bg-primary/10 border border-primary/30 text-primary hover:bg-primary/15">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mr-2" />
              {tx.badge}
            </Badge>
            <h1 className="text-5xl md:text-6xl font-semibold leading-tight">
              {tx.title1}{" "}
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">{tx.title2}</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">{tx.subtitle}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#products"><Button size="lg" className="bg-primary text-primary-foreground hover:opacity-90">{tx.ctaProducts} <ArrowRight className="w-4 h-4 ml-1" /></Button></a>
              <a href="#lab"><Button size="lg" variant="outline" className="border-primary/40 text-foreground bg-transparent hover:bg-primary/10">{tx.ctaLab}</Button></a>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-20 border-t border-border/60">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-semibold">{tx.productsTitle}</h2>
            <p className="text-muted-foreground max-w-2xl">{tx.productsDesc}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tx.products.map((product) => {
              const Icon = PRODUCT_ICONS[product.id];
              const href = productHref(product.id, lang);
              const external = href.startsWith("http");
              const cta = (
                <span className="inline-flex items-center text-sm font-medium text-primary">
                  {product.cta} <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              );
              return (
                <Card key={product.id} className="bg-card border-border p-6 hover:border-primary/30 transition-colors flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                    <Badge variant="outline" className="border-primary/30 text-xs">{product.status}</Badge>
                  </div>
                  <h3 className="font-semibold mb-2 text-foreground">{product.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{product.desc}</p>
                  <div className="mt-4">
                    {external ? (
                      <a href={href} target="_blank" rel="noopener noreferrer">{cta}</a>
                    ) : (
                      <Link to={href}>{cta}</Link>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 border-t border-border/60 bg-muted/25">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-semibold mb-10">{tx.principlesTitle}</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {tx.principles.map((item) => (
              <Card key={item.title} className="bg-card border-border p-6">
                <h3 className="font-semibold mb-2 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lab */}
      <section id="lab" className="py-20 border-t border-border/60">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-4">
              <div className="text-xs tracking-widest text-primary uppercase">{tx.labBadge}</div>
              <h2 className="text-3xl md:text-4xl font-semibold">{tx.labTitle}</h2>
              <p className="text-muted-foreground">{tx.labDesc}</p>
              <a href={LAB_REPO} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">github.com/AI-Byte-Consult-Ltd/nics-ai-lab</a>
            </div>
            <div>
              <NicsLiveDashboard />
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
            {tx.stack.map(({ title, desc }, index) => {
              const Icon = STACK_ICONS[index] ?? Layers;
              return (
                <Card key={title} className="bg-card border-border p-6 hover:border-primary/30 transition-colors">
                  <Icon className="w-6 h-6 text-primary mb-3" />
                  <h3 className="font-semibold mb-2 text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-20 border-t border-border/60">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-semibold mb-10 text-center">{tx.infraTitle}</h2>
          <div className="rounded-2xl border border-border divide-y divide-border/60 overflow-hidden">
            {tx.infra.map((row) => (
              <div key={row.title} className="flex items-center justify-between p-4 md:p-5 bg-card">
                <div>
                  <div className="text-foreground font-medium">{row.title}</div>
                  <div className="text-sm text-muted-foreground">{row.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 border-t border-border/60 bg-muted/25">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="mb-8 text-3xl font-semibold md:text-4xl">{tx.faqTitle}</h2>
          <div className="space-y-3">
            {tx.faq.map((item) => (
              <details key={item.q} className="group rounded-2xl border border-border/60 bg-card/70 p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {item.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 leading-relaxed text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
    </>
  );
};

export default NicsEcosystem;

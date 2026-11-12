import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { tradingSoftwareTexts } from "@/i18n/tradingSoftware";
import { blogPath, phasedAlternates, phasedCanonical, phasedLang, phasedPath } from "@/i18n/phasedSeo";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Calculator,
  CalendarDays,
  ChevronDown,
  Cpu,
  Eye,
  FileText,
  Search,
  ShieldCheck,
  Target,
  X,
} from "lucide-react";

const SITE_URL = "https://aibyteconsult.com";
const BASE = "/nics-trading-software";
const FEATURE_ICONS = [Target, Calculator, Search, CalendarDays, BarChart3, BookOpen];
const TELEGRAM_BOT = "https://t.me/nics_ai_bot";

const NicsTradingSoftware = () => {
  const { language } = useLanguage();
  const lang = phasedLang(language);
  const tx = tradingSoftwareTexts[lang];
  const canonical = phasedCanonical(BASE, lang);
  const trading = lang === "en" ? "/trading" : `/${lang}/trading`;

  const surfaceHref = (href: "windows" | "cabinet" | "telegram" | "trading") => {
    if (href === "windows") return { to: phasedPath("/nics-windows-app", lang) };
    if (href === "cabinet") return { to: "/cabinet" };
    if (href === "trading") return { to: trading };
    return { external: TELEGRAM_BOT };
  };

  const seo = {
    title: tx.seoTitle,
    description: tx.seoDescription,
    canonical,
    htmlLang: lang,
    ogImage: `${SITE_URL}/og-trading.jpg`,
    alternates: phasedAlternates(BASE),
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "NICS AI Trader",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Windows, Web, Telegram",
        url: canonical,
        inLanguage: lang,
        description: tx.seoDescription,
        publisher: { "@type": "Organization", name: "AI Byte Consult Ltd", url: `${SITE_URL}/` },
        offers: { "@type": "Offer", price: "1.99", priceCurrency: "EUR", url: `${SITE_URL}${trading}/#nics-trader-plans` },
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
      <SEO {...seo} />
      <main className="min-h-screen bg-background text-foreground">
        <Header />

        <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,hsl(var(--primary)/0.16),transparent_40%),radial-gradient(circle_at_85%_70%,rgba(59,130,246,0.12),transparent_40%)]" />
          <div className="container relative z-10 mx-auto px-4">
            <div className="max-w-3xl">
              <Badge className="mb-6 border-primary/25 bg-primary/10 text-primary hover:bg-primary/10">
                <Cpu className="mr-2 h-3.5 w-3.5" />
                {tx.badge}
              </Badge>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">{tx.title}</h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground md:text-xl">{tx.subtitle}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Link to={`${trading}#nics-trader-plans`}>
                  <Button size="lg" className="w-full rounded-full px-8 sm:w-auto">
                    {tx.ctaPlans}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to={phasedPath("/nics-windows-app", lang)}>
                  <Button size="lg" variant="outline" className="w-full rounded-full px-8 sm:w-auto">
                    {tx.ctaWindows}
                  </Button>
                </Link>
                <Link to={`${trading}#track-record`}>
                  <Button size="lg" variant="ghost" className="w-full rounded-full px-6 sm:w-auto">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    {tx.ctaTrack}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/25 py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-10 text-3xl font-semibold md:text-4xl">{tx.howTitle}</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {tx.how.map((step) => (
                <Card key={step.title} className="h-full border-border/60 bg-card/70">
                  <CardHeader>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm leading-relaxed text-muted-foreground">{step.desc}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-10 text-3xl font-semibold md:text-4xl">{tx.featuresTitle}</h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {tx.features.map((feature, index) => {
                const Icon = FEATURE_ICONS[index] ?? Target;
                return (
                  <Card key={feature.title} className="h-full border-border/60 bg-card/70">
                    <CardHeader>
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm leading-relaxed text-muted-foreground">{feature.desc}</CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/25 py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-10 text-3xl font-semibold md:text-4xl">{tx.setupsTitle}</h2>
            <div className="grid gap-5 md:grid-cols-2">
              <Card className="h-full border-emerald-500/40 bg-card/70">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    {tx.strong.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-muted-foreground">{tx.strong.desc}</CardContent>
              </Card>
              <Card className="h-full border-amber-500/40 bg-card/70">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Eye className="h-5 w-5 text-amber-500" />
                    {tx.watchlist.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed text-muted-foreground">{tx.watchlist.desc}</CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-2xl font-semibold md:text-3xl">{tx.surfacesTitle}</h2>
              <ul className="space-y-4">
                {tx.surfaces.map((surface) => {
                  const target = surfaceHref(surface.href);
                  const inner = (
                    <>
                      <span className="font-medium text-foreground group-hover:text-primary">{surface.title}</span>
                      <span className="block text-sm text-muted-foreground">{surface.desc}</span>
                    </>
                  );
                  return (
                    <li key={surface.title} className="rounded-2xl border border-border/60 bg-card/70 p-4">
                      {target.to ? (
                        <Link to={target.to} className="group block">{inner}</Link>
                      ) : (
                        <a href={target.external} target="_blank" rel="noopener noreferrer" className="group block">{inner}</a>
                      )}
                    </li>
                  );
                })}
              </ul>
              <h2 className="mb-4 mt-12 text-2xl font-semibold md:text-3xl">{tx.marketsTitle}</h2>
              <p className="leading-relaxed text-muted-foreground">{tx.marketsLine}</p>
            </div>
            <div>
              <h2 className="mb-6 text-2xl font-semibold md:text-3xl">{tx.notTitle}</h2>
              <ul className="space-y-4">
                {tx.not.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-muted-foreground">
                    <X className="mt-1 h-4 w-4 shrink-0 text-rose-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <h2 className="mb-6 mt-12 text-2xl font-semibold md:text-3xl">{tx.guidesTitle}</h2>
              <ul className="space-y-2">
                {tx.guides.map((guide) => (
                  <li key={guide.slug}>
                    {/* Articles are static pages outside the SPA: plain links. */}
                    <a href={blogPath(lang, guide.slug)} className="inline-flex items-start gap-2 text-primary underline-offset-4 hover:underline">
                      <FileText className="mt-1 h-4 w-4 shrink-0" />
                      {guide.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="border-t border-border/60 bg-muted/25 py-20">
          <div className="container mx-auto max-w-3xl px-4">
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
            <div className="mt-10 text-center">
              <Link to={`${trading}#nics-trader-plans`}>
                <Button size="lg" className="rounded-full px-8">
                  {tx.ctaPlans}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <p className="mt-10 text-center text-xs leading-relaxed text-muted-foreground">{tx.disclaimer}</p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default NicsTradingSoftware;

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import TradingViewTicker from "@/components/TradingViewTicker";
import NicsTraderPlans from "@/components/NicsTraderPlans";
import VerifiedTrackRecord from "@/components/VerifiedTrackRecord";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BellRing,
  Bitcoin,
  Bot,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coins,
  Gauge,
  Globe,
  History,
  LineChart,
  Rocket,
  Send,
  Settings,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

const MINI_APP_URL = "https://aibyteconsult.com/nics-app";
const TELEGRAM_URL = "https://t.me/TravelTradeBook";
const VANTAGE_URL = "https://fwd.cx/Yj25BCrDzEHB";

const Trading = () => {
  const { t } = useLanguage();

  const benefits = [
    { title: t("tradingpage.benefit1.title"), description: t("tradingpage.benefit1.desc"), icon: Target },
    { title: t("tradingpage.benefit2.title"), description: t("tradingpage.benefit2.desc"), icon: Zap },
    { title: t("tradingpage.benefit3.title"), description: t("tradingpage.benefit3.desc"), icon: Settings },
    { title: t("tradingpage.benefit4.title"), description: t("tradingpage.benefit4.desc"), icon: History },
  ];

  const miniAppFeatures = [
    t("tradingpage.miniapp.feature1"),
    t("tradingpage.miniapp.feature2"),
    t("tradingpage.miniapp.feature3"),
    t("tradingpage.miniapp.feature4"),
    t("tradingpage.miniapp.feature5"),
    t("tradingpage.miniapp.feature6"),
  ];

  const steps = [
    { step: "01", title: t("tradingpage.step1.title"), description: t("tradingpage.step1.desc"), icon: BarChart3 },
    { step: "02", title: t("tradingpage.step2.title"), description: t("tradingpage.step2.desc"), icon: Wallet },
    { step: "03", title: t("tradingpage.step3.title"), description: t("tradingpage.step3.desc"), icon: Send },
  ];

  const markets = [
    {
      name: t("tradingpage.market.gold.name"),
      description: t("tradingpage.market.gold.desc"),
      availability: t("tradingpage.market.gold.availability"),
      icon: Coins,
    },
    {
      name: t("tradingpage.market.forex.name"),
      description: t("tradingpage.market.forex.desc"),
      availability: t("tradingpage.market.forex.availability"),
      icon: TrendingUp,
    },
    {
      name: t("tradingpage.market.brent.name"),
      description: t("tradingpage.market.brent.desc"),
      availability: t("tradingpage.market.brent.availability"),
      icon: Activity,
    },
    {
      name: t("tradingpage.market.bitcoin.name"),
      description: t("tradingpage.market.bitcoin.desc"),
      availability: t("tradingpage.market.bitcoin.availability"),
      icon: Bitcoin,
    },
  ];

  const protections = [
    { title: t("tradingpage.protection1.title"), description: t("tradingpage.protection1.desc"), icon: Clock },
    { title: t("tradingpage.protection2.title"), description: t("tradingpage.protection2.desc"), icon: Gauge },
    { title: t("tradingpage.protection3.title"), description: t("tradingpage.protection3.desc"), icon: ShieldCheck },
    { title: t("tradingpage.protection4.title"), description: t("tradingpage.protection4.desc"), icon: CheckCircle2 },
  ];

  const advantages = [
    t("tradingpage.advantage1"),
    t("tradingpage.advantage2"),
    t("tradingpage.advantage3"),
    t("tradingpage.advantage4"),
    t("tradingpage.advantage5"),
    t("tradingpage.advantage6"),
  ];

  const platformCapabilities = [
    { title: t("tradingpage.capability1.title"), description: t("tradingpage.capability1.desc"), icon: BarChart3 },
    { title: t("tradingpage.capability2.title"), description: t("tradingpage.capability2.desc"), icon: Settings },
    { title: t("tradingpage.capability3.title"), description: t("tradingpage.capability3.desc"), icon: History },
    { title: t("tradingpage.capability4.title"), description: t("tradingpage.capability4.desc"), icon: BadgeCheck },
    { title: t("tradingpage.capability5.title"), description: t("tradingpage.capability5.desc"), icon: Users },
    { title: t("tradingpage.capability6.title"), description: t("tradingpage.capability6.desc"), icon: Globe },
  ];

  const faqs = [
    { question: t("tradingpage.faq1.q"), answer: t("tradingpage.faq1.a") },
    { question: t("tradingpage.faq2.q"), answer: t("tradingpage.faq2.a") },
    { question: t("tradingpage.faq3.q"), answer: t("tradingpage.faq3.a") },
    { question: t("tradingpage.faq4.q"), answer: t("tradingpage.faq4.a") },
    { question: t("tradingpage.faq5.q"), answer: t("tradingpage.faq5.a") },
    { question: t("tradingpage.faq6.q"), answer: t("tradingpage.faq6.a") },
  ];

  const roadmap = [
    { title: t("tradingpage.roadmapItem1.title"), description: t("tradingpage.roadmapItem1.desc"), icon: Users },
    { title: t("tradingpage.roadmapItem2.title"), description: t("tradingpage.roadmapItem2.desc"), icon: LineChart },
    { title: t("tradingpage.roadmapItem3.title"), description: t("tradingpage.roadmapItem3.desc"), icon: Zap },
    { title: t("tradingpage.roadmapItem4.title"), description: t("tradingpage.roadmapItem4.desc"), icon: Rocket },
  ];

  const seoProps = {
    title: t("tradingpage.seo.title"),
    description: t("tradingpage.seo.description"),
    canonical: "https://aibyteconsult.com/trading",
    ogImage: "https://aibyteconsult.com/og-home.jpg",
    jsonLd: [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "NICS AI Trader",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Telegram Web App",
        provider: {
          "@type": "Organization",
          name: "AI Byte Consult Ltd",
        },
        description: t("tradingpage.schema.description"),
        url: "https://aibyteconsult.com/trading",
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <SEO {...seoProps} />
      <main className="min-h-screen bg-background text-foreground">
        <Header />

        <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,hsl(var(--primary)/0.16),transparent_35%),radial-gradient(circle_at_85%_65%,rgba(34,197,94,0.12),transparent_35%)]" />
          <div className="container relative z-10 mx-auto px-4">
            <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <Badge className="mb-6 border-primary/25 bg-primary/10 text-primary hover:bg-primary/10">
                  <Bot className="mr-2 h-3.5 w-3.5" />
                  {t("tradingpage.hero.badge")}
                </Badge>

                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-7xl">
                  {t("tradingpage.hero.title1")}
                  <span className="block text-gradient-gold">{t("tradingpage.hero.title2")}</span>
                </h1>

                <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                  {t("tradingpage.hero.desc")}
                </p>

                <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                  <a href={MINI_APP_URL} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full rounded-full px-8 sm:w-auto">
                      {t("tradingpage.hero.cta1")}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <a href="#example-signal">
                    <Button size="lg" variant="outline" className="w-full rounded-full px-8 sm:w-auto">
                      {t("tradingpage.hero.cta2")}
                    </Button>
                  </a>
                </div>

                <div className="mt-9 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {markets.map((market) => (
                    <span key={market.name} className="rounded-full border border-border/70 bg-card/60 px-4 py-2 backdrop-blur">
                      {market.name}
                    </span>
                  ))}
                </div>
              </div>

              <div id="example-signal" className="mx-auto w-full max-w-md scroll-mt-28">
                <div className="rounded-[2rem] border border-border/70 bg-card/90 p-3 shadow-2xl shadow-primary/10 backdrop-blur">
                  <div className="rounded-[1.5rem] border border-border/60 bg-background p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{t("tradingpage.example.label")}</p>
                        <h2 className="mt-2 text-2xl font-semibold">{t("tradingpage.example.pair")}</h2>
                      </div>
                      <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10">{t("tradingpage.example.live")}</Badge>
                    </div>

                    <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
                      <p className="text-sm text-muted-foreground">{t("tradingpage.example.orderTypeLabel")}</p>
                      <p className="mt-1 text-xl font-semibold">{t("tradingpage.example.orderTypeValue")}</p>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl border border-border/60 p-4">
                        <p className="text-muted-foreground">{t("tradingpage.example.entryLabel")}</p>
                        <p className="mt-1 font-semibold">{t("tradingpage.example.entryValue")}</p>
                      </div>
                      <div className="rounded-xl border border-border/60 p-4">
                        <p className="text-muted-foreground">{t("tradingpage.example.slLabel")}</p>
                        <p className="mt-1 font-semibold">{t("tradingpage.example.slValue")}</p>
                      </div>
                      <div className="rounded-xl border border-border/60 p-4">
                        <p className="text-muted-foreground">{t("tradingpage.example.tpLabel")}</p>
                        <p className="mt-1 font-semibold">{t("tradingpage.example.tpValue")}</p>
                      </div>
                      <div className="rounded-xl border border-border/60 p-4">
                        <p className="text-muted-foreground">{t("tradingpage.example.validLabel")}</p>
                        <p className="mt-1 font-semibold">{t("tradingpage.example.validValue")}</p>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <Button className="rounded-xl">{t("tradingpage.example.accept")}</Button>
                      <Button variant="outline" className="rounded-xl">{t("tradingpage.example.skip")}</Button>
                    </div>

                    <p className="mt-5 text-center text-xs text-muted-foreground">
                      {t("tradingpage.example.note")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <TradingViewTicker />

        <section className="border-y border-border/60 bg-muted/25 py-20">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <Badge className="mb-4 border-primary/25 bg-primary/10 text-primary hover:bg-primary/10">
                  <ShieldCheck className="mr-2 h-3.5 w-3.5" />
                  {t("tradingpage.vantage.badge")}
                </Badge>
                <h2 className="text-3xl font-semibold md:text-5xl">
                  {t("tradingpage.vantage.titlePre")} <span className="text-gradient-gold">{t("tradingpage.vantage.titleHighlight")}</span> {t("tradingpage.vantage.titlePost")}
                </h2>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">
                  {t("tradingpage.vantage.desc")}
                </p>
                <a href={VANTAGE_URL} target="_blank" rel="noopener noreferrer sponsored" className="mt-8 inline-block">
                  <Button size="lg" variant="outline" className="rounded-full px-8">
                    {t("tradingpage.vantage.cta")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>

              <div className="rounded-[2rem] border border-border/70 bg-card/70 p-6 shadow-xl shadow-primary/5">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl border border-border/60 bg-background p-4">
                    <p className="text-muted-foreground">{t("tradingpage.vantage.broker.label")}</p>
                    <p className="mt-1 font-semibold">{t("tradingpage.vantage.broker.value")}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background p-4">
                    <p className="text-muted-foreground">{t("tradingpage.vantage.status.label")}</p>
                    <p className="mt-1 font-semibold">{t("tradingpage.vantage.status.value")}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background p-4">
                    <p className="text-muted-foreground">{t("tradingpage.vantage.execution.label")}</p>
                    <p className="mt-1 font-semibold">{t("tradingpage.vantage.execution.value")}</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background p-4">
                    <p className="text-muted-foreground">{t("tradingpage.vantage.price.label")}</p>
                    <p className="mt-1 font-semibold">{t("tradingpage.vantage.price.value")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4">{t("tradingpage.benefits.badge")}</Badge>
              <h2 className="text-3xl font-semibold md:text-5xl">{t("tradingpage.benefits.title")}</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                {t("tradingpage.benefits.desc")}
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="h-full border-border/60 bg-card/70">
                  <CardHeader>
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <benefit.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/25 py-20">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <div>
                <Badge variant="outline" className="mb-4">{t("tradingpage.miniapp.badge")}</Badge>
                <h2 className="text-3xl font-semibold md:text-5xl">{t("tradingpage.miniapp.title")}</h2>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">
                  {t("tradingpage.miniapp.desc")}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {miniAppFeatures.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <a href={MINI_APP_URL} target="_blank" rel="noopener noreferrer" className="mt-9 inline-block">
                  <Button size="lg" className="rounded-full px-8">
                    {t("tradingpage.miniapp.cta")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>

              <div className="mx-auto w-full max-w-lg rounded-[2rem] border border-border/70 bg-background p-4 shadow-xl">
                <div className="rounded-[1.5rem] border border-border/60 bg-card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{t("tradingpage.miniapp.badge")}</p>
                      <p className="mt-1 text-xl font-semibold">{t("tradingpage.miniapp.mock.title")}</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bot className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border/60 bg-background p-4">
                      <p className="text-xs text-muted-foreground">{t("tradingpage.miniapp.mock.activeSignalsLabel")}</p>
                      <p className="mt-1 text-2xl font-semibold">{t("tradingpage.miniapp.mock.activeSignalsValue")}</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background p-4">
                      <p className="text-xs text-muted-foreground">{t("tradingpage.miniapp.mock.riskProfileLabel")}</p>
                      <p className="mt-1 text-2xl font-semibold">{t("tradingpage.miniapp.mock.riskProfileValue")}</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-border/60 bg-background p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{t("tradingpage.example.pair")}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{t("tradingpage.miniapp.mock.pairMeta")}</p>
                      </div>
                      <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10">{t("tradingpage.miniapp.mock.open")}</Badge>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="rounded-xl border border-border/60 p-3">
                      <History className="mx-auto mb-2 h-4 w-4 text-primary" />
                      {t("tradingpage.miniapp.mock.history")}
                    </div>
                    <div className="rounded-xl border border-border/60 p-3">
                      <BarChart3 className="mx-auto mb-2 h-4 w-4 text-primary" />
                      {t("tradingpage.miniapp.mock.statistics")}
                    </div>
                    <div className="rounded-xl border border-border/60 p-3">
                      <Settings className="mx-auto mb-2 h-4 w-4 text-primary" />
                      {t("tradingpage.miniapp.mock.risk")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <VerifiedTrackRecord />

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4">{t("tradingpage.steps.badge")}</Badge>
              <h2 className="text-3xl font-semibold md:text-5xl">{t("tradingpage.steps.title")}</h2>
            </div>

            <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-3">
              {steps.map((item) => (
                <Card key={item.step} className="relative h-full border-border/60">
                  <CardHeader>
                    <span className="absolute right-5 top-5 text-sm font-semibold text-muted-foreground">{item.step}</span>
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-7 text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/25 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4">{t("tradingpage.markets.badge")}</Badge>
              <h2 className="text-3xl font-semibold md:text-5xl">{t("tradingpage.markets.title")}</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                {t("tradingpage.markets.desc")}
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
              {markets.map((market) => (
                <Card key={market.name} className="h-full border-border/60 bg-background/80">
                  <CardHeader>
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <market.icon className="h-5 w-5" />
                    </div>
                    <CardTitle>{market.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-7">{market.description}</p>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">{market.availability}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4">{t("tradingpage.protections.badge")}</Badge>
              <h2 className="text-3xl font-semibold md:text-5xl">{t("tradingpage.protections.title")}</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                {t("tradingpage.protections.desc")}
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
              {protections.map((item) => (
                <Card key={item.title} className="h-full border-border/60 bg-card/70">
                  <CardHeader>
                    <item.icon className="mb-3 h-7 w-7 text-primary" />
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/25 py-20">
          <div className="container mx-auto px-4">
            <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <Badge variant="outline" className="mb-4">{t("tradingpage.why.badge")}</Badge>
                <h2 className="text-3xl font-semibold md:text-5xl">{t("tradingpage.why.title")}</h2>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">
                  {t("tradingpage.why.desc")}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {advantages.map((advantage) => (
                  <div key={advantage} className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                    <span>{advantage}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4">{t("tradingpage.about.badge")}</Badge>
              <h2 className="text-3xl font-semibold md:text-5xl">{t("tradingpage.about.title")}</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                {t("tradingpage.about.desc")}
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
              {platformCapabilities.map((item) => (
                <Card key={item.title} className="h-full border-border/60 bg-card/70">
                  <CardHeader>
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mx-auto mt-16 max-w-6xl">
              <div className="mx-auto max-w-3xl text-center">
                <Badge variant="outline" className="mb-4">
                  <Rocket className="mr-2 h-3.5 w-3.5" />
                  {t("tradingpage.roadmap.badge")}
                </Badge>
                <h3 className="text-2xl font-semibold md:text-3xl">{t("tradingpage.roadmap.title")}</h3>
              </div>

              <div className="mx-auto mt-8 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
                {roadmap.map((item) => (
                  <div key={item.title} className="rounded-xl border border-dashed border-border/70 bg-background p-5">
                    <item.icon className="mb-3 h-6 w-6 text-muted-foreground" />
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <NicsTraderPlans />

        <section className="py-24">
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-5xl overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-background to-green-500/10">
              <CardContent className="p-8 text-center md:p-14">
                <BellRing className="mx-auto h-10 w-10 text-primary" />
                <h2 className="mt-5 text-3xl font-semibold md:text-5xl">{t("tradingpage.cta.title")}</h2>
                <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                  {t("tradingpage.cta.desc")}
                </p>

                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                  <a href={MINI_APP_URL} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full rounded-full px-8 sm:w-auto">
                      {t("tradingpage.hero.cta1")}
                    </Button>
                  </a>
                  <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="w-full rounded-full px-8 sm:w-auto">
                      <Send className="mr-2 h-4 w-4" />
                      {t("tradingpage.cta.button2")}
                    </Button>
                  </a>
                </div>

                <a href={VANTAGE_URL} target="_blank" rel="noopener noreferrer sponsored" className="mt-6 inline-flex items-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                  {t("tradingpage.cta.vantageLink")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4">{t("tradingpage.faq.badge")}</Badge>
              <h2 className="text-3xl font-semibold md:text-5xl">{t("tradingpage.faq.title")}</h2>
            </div>

            <div className="mx-auto mt-12 max-w-3xl space-y-4">
              {faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl border border-border/60 bg-card/60 p-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    {faq.question}
                    <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="container mx-auto px-4">
            <details className="mx-auto max-w-5xl rounded-2xl border border-border/60 bg-card/60 p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {t("tradingpage.tech.summary")}
                <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
              </summary>
              <div className="mt-6 grid gap-4 text-sm leading-7 text-muted-foreground md:grid-cols-2">
                <p>{t("tradingpage.tech.p1")}</p>
                <p>{t("tradingpage.tech.p2")}</p>
              </div>
            </details>

            <p className="mx-auto mt-8 max-w-4xl text-center text-xs leading-6 text-muted-foreground">
              {t("tradingpage.disclaimer")}
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Trading;

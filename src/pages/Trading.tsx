import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import TradingViewTicker from "@/components/TradingViewTicker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BellRing,
  Bitcoin,
  Bot,
  CheckCircle2,
  Coins,
  Database,
  Gauge,
  LockKeyhole,
  Network,
  Send,
  Server,
  ShieldCheck,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

const MINI_APP_URL = "https://aibyteconsult.com/nics-app";
const TELEGRAM_URL = "https://t.me/GoldAndMarkets";
const VANTAGE_URL = "https://fwd.cx/Yj25BCrDzEHB";

const markets = [
  {
    name: "Gold",
    symbols: "XAU/USD · XAUUSD247",
    schedule: "Weekdays plus broker-fed weekend coverage",
    icon: Coins,
  },
  {
    name: "Brent Oil",
    symbols: "UKOUSDft",
    schedule: "Brent Futures market sessions",
    icon: Activity,
  },
  {
    name: "Forex",
    symbols: "EUR/USD · GBP/USD · USD/JPY",
    schedule: "Sunday evening through Friday",
    icon: TrendingUp,
  },
  {
    name: "Bitcoin",
    symbols: "BTC/USD",
    schedule: "24 hours a day, 7 days a week",
    icon: Bitcoin,
  },
];

const signalFields = [
  "Direction and market-order scenario",
  "Entry zone and current-price context",
  "Stop Loss and four Take Profit targets",
  "Signal validity and maximum price deviation",
  "Spread, slippage and market-session checks",
  "Clear accept or reject decision in Telegram",
];

const pipeline = [
  {
    title: "Broker market data",
    description: "Fresh 5-minute and 15-minute candles, instrument specifications and live prices from the Vantage MT5 environment.",
    icon: Database,
  },
  {
    title: "NICS analysis engine",
    description: "Separate Gold, Brent, Forex and Bitcoin logic evaluates direction, Entry, SL, TP, risk and market conditions.",
    icon: Bot,
  },
  {
    title: "Production automation",
    description: "n8n workflows coordinate analysis, access control, signal lifecycle, delivery and post-entry tracking.",
    icon: Network,
  },
  {
    title: "Telegram Mini App",
    description: "Users receive a compact signal first, then open the detailed analysis, risk profile and personal performance view.",
    icon: Send,
  },
];

const safeguards = [
  {
    title: "Fresh-data requirement",
    description: "NICS does not build a trading plan from stale 5-minute or 15-minute market data.",
    icon: Gauge,
  },
  {
    title: "Entry protection",
    description: "Acceptance is blocked after expiry, TP1, excessive price movement or invalid market conditions.",
    icon: Target,
  },
  {
    title: "Risk controls",
    description: "Account balance, risk percentage, total exposure and correlated exposure are part of the user profile.",
    icon: ShieldCheck,
  },
  {
    title: "Authenticated access",
    description: "Telegram initData verification and user-scoped queries keep every dashboard private to its owner.",
    icon: LockKeyhole,
  },
];

const Trading = () => {
  const seoProps = {
    title: "NICS AI Trader Agent — Telegram Mini App for Vantage Markets",
    description:
      "NICS AI Trader Agent combines Vantage MT5 market data, n8n production automation, structured risk controls and a Telegram Mini App for Gold, Brent, Forex and Bitcoin signals.",
    canonical: "https://aibyteconsult.com/trading",
    ogImage: "https://aibyteconsult.com/og-trading.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "NICS AI Trader Agent",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Telegram Web App",
      provider: {
        "@type": "Organization",
        name: "AI Byte Consult Ltd",
      },
      description:
        "A Telegram-first AI trading scenario engine using broker market data, automated risk checks and structured signal lifecycle management.",
      url: "https://aibyteconsult.com/trading",
    },
  };

  return (
    <>
      <SEO {...seoProps} />
      <main className="min-h-screen bg-background text-foreground">
        <Header />

        <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,hsl(var(--primary)/0.16),transparent_35%),radial-gradient(circle_at_80%_60%,rgba(34,197,94,0.12),transparent_35%)]" />
          <div className="container relative z-10 mx-auto px-4">
            <div className="mx-auto max-w-5xl text-center">
              <Badge className="mb-7 border-primary/25 bg-primary/10 text-primary hover:bg-primary/10">
                <Zap className="mr-2 h-3.5 w-3.5" />
                Real broker data · Production automation · Telegram-first UX
              </Badge>

              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-7xl">
                Telegram AI Trader
                <span className="block text-gradient-gold">powered by NICS</span>
              </h1>

              <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-muted-foreground md:text-xl">
                A structured AI trading scenario engine connected to Vantage MT5 data, n8n workflows and a secure Telegram Mini App. NICS evaluates Gold, Brent, Forex and Bitcoin, then delivers an actionable Entry, Stop Loss, Take Profit plan and risk context.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a href={MINI_APP_URL} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="rounded-full px-8">
                    Open NICS Mini App
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="rounded-full px-8">
                    <Send className="mr-2 h-4 w-4" />
                    Telegram channel
                  </Button>
                </a>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-3 text-sm text-muted-foreground">
                {["Market-order scenarios", "Fresh 5m + 15m data", "Entry · SL · TP1–TP4", "Personal risk profile"].map((item) => (
                  <span key={item} className="inline-flex items-center rounded-full border border-border/70 bg-card/60 px-4 py-2 backdrop-blur">
                    <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <TradingViewTicker />

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4">Real NICS AI Trader Agent</Badge>
              <h2 className="text-3xl font-semibold md:text-5xl">Not a copy-trading promise — a structured AI scenario engine</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                NICS does not publish invented profitability figures or generic dashboard theatre. It processes current broker data, applies instrument-specific trading logic and gives the user a bounded decision with transparent risk parameters.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
              {signalFields.map((field) => (
                <Card key={field} className="border-border/60 bg-card/70">
                  <CardContent className="flex items-start gap-3 p-5">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                    <span className="font-medium">{field}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/25 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4">Supported markets</Badge>
              <h2 className="text-3xl font-semibold md:text-5xl">Dedicated logic for each market</h2>
              <p className="mt-5 text-lg text-muted-foreground">
                Gold, oil, Forex and crypto do not share one generic configuration. Each market has its own schedule, data source and trading parameters.
              </p>
            </div>

            <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
              {markets.map((market) => (
                <Card key={market.name} className="h-full border-border/60 bg-background/80">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <market.icon className="h-6 w-6" />
                    </div>
                    <CardTitle>{market.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium">{market.symbols}</p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{market.schedule}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4">Infrastructure</Badge>
              <h2 className="text-3xl font-semibold md:text-5xl">Two-VPS signal pipeline</h2>
              <p className="mt-5 text-lg text-muted-foreground">
                Market collection and trading analysis are separated from user delivery and application services, creating a cleaner and more resilient production architecture.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-6xl">
              <div className="mb-8 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <Card className="border-primary/20 bg-primary/5">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Server className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-semibold">Alibaba Cloud VPS</p>
                        <p className="text-sm text-muted-foreground">Market intelligence and AI analysis workloads</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <ArrowRight className="mx-auto hidden h-6 w-6 text-muted-foreground md:block" />
                <Card className="border-green-500/20 bg-green-500/5">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Server className="h-8 w-8 text-green-500" />
                      <div>
                        <p className="font-semibold">Oracle Cloud VPS</p>
                        <p className="text-sm text-muted-foreground">n8n orchestration, PostgreSQL, Telegram and Mini App API</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {pipeline.map((step, index) => (
                  <Card key={step.title} className="relative border-border/60">
                    <CardHeader>
                      <span className="absolute right-4 top-4 text-xs font-semibold text-muted-foreground">0{index + 1}</span>
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                        <step.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-lg">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-muted/25 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4">Risk before speed</Badge>
              <h2 className="text-3xl font-semibold md:text-5xl">Production safeguards built into every decision</h2>
            </div>

            <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
              {safeguards.map((item) => (
                <Card key={item.title} className="border-border/60 bg-background/80">
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

        <section className="py-24">
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-5xl overflow-hidden border-primary/20 bg-gradient-to-br from-primary/10 via-background to-green-500/10">
              <CardContent className="p-8 text-center md:p-14">
                <BellRing className="mx-auto h-10 w-10 text-primary" />
                <h2 className="mt-5 text-3xl font-semibold md:text-5xl">Trade scenarios delivered where decisions happen</h2>
                <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                  Open the NICS Mini App for active signals, live status, personal statistics and risk settings, or connect through Telegram for compact real-time delivery.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                  <a href={MINI_APP_URL} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="rounded-full px-8">Open Mini App</Button>
                  </a>
                  <a href={VANTAGE_URL} target="_blank" rel="noopener noreferrer sponsored">
                    <Button size="lg" variant="outline" className="rounded-full px-8">
                      Vantage Markets
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                </div>
                <p className="mt-6 text-xs text-muted-foreground">
                  Trading involves risk. NICS provides structured analytical scenarios and risk controls, not guaranteed returns or financial advice.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Trading;

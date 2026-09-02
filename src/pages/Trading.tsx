import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import TradingViewTicker from "@/components/TradingViewTicker";
import NicsTraderPlans from "@/components/NicsTraderPlans";
import VerifiedTrackRecord from "@/components/VerifiedTrackRecord";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const benefits = [
  {
    title: "A complete trade plan",
    description: "Get the direction, market entry, Stop Loss and four Take Profit targets in one clear scenario.",
    icon: Target,
  },
  {
    title: "A fast decision",
    description: "Accept or skip a signal directly from the compact Telegram message without opening a complex dashboard.",
    icon: Zap,
  },
  {
    title: "Personal risk control",
    description: "Use your account balance, currency and preferred risk limits to keep every decision consistent.",
    icon: Settings,
  },
  {
    title: "Signal tracking",
    description: "Follow active scenarios, target progress, completed results and your personal signal history in one place.",
    icon: History,
  },
];

const miniAppFeatures = [
  "Active signals and current status",
  "Detailed Entry, Stop Loss and TP1–TP4",
  "Accept or skip each opportunity",
  "Personal risk profile and exposure limits",
  "Selected markets and signal preferences",
  "Signal history and verified personal statistics",
];

const steps = [
  {
    step: "01",
    title: "Choose your markets",
    description: "Select Gold, Forex, Brent Oil or Bitcoin and receive only the opportunities relevant to you.",
    icon: BarChart3,
  },
  {
    step: "02",
    title: "Set your risk profile",
    description: "Add your account currency, balance and preferred risk limits once, then adjust them whenever needed.",
    icon: Wallet,
  },
  {
    step: "03",
    title: "Receive and manage signals",
    description: "Review the compact scenario, accept or skip it, and track its lifecycle through Telegram and the Mini App.",
    icon: Send,
  },
];

const markets = [
  {
    name: "Gold",
    description: "Fast intraday scenarios with a clear market entry, defined risk and staged profit targets.",
    availability: "Weekdays plus supported broker-fed weekend coverage",
    icon: Coins,
  },
  {
    name: "Forex",
    description: "Selected opportunities across supported major currency pairs with dedicated market logic.",
    availability: "Sunday evening through Friday",
    icon: TrendingUp,
  },
  {
    name: "Brent Oil",
    description: "Oil scenarios built around active sessions, current market conditions and controlled trade duration.",
    availability: "During supported Brent market sessions",
    icon: Activity,
  },
  {
    name: "Bitcoin",
    description: "Crypto scenarios and signal delivery throughout the week, including weekends.",
    availability: "24 hours a day, 7 days a week",
    icon: Bitcoin,
  },
];

const protections = [
  {
    title: "No outdated opportunity",
    description: "NICS does not present a new trading scenario when current market conditions are no longer suitable.",
    icon: Clock,
  },
  {
    title: "Clear expiration",
    description: "Every scenario has a limited decision window, so you know when the opportunity is no longer valid.",
    icon: Gauge,
  },
  {
    title: "Price-movement protection",
    description: "Acceptance can be blocked when price has already moved too far from the intended entry.",
    icon: ShieldCheck,
  },
  {
    title: "You stay in control",
    description: "NICS prepares the scenario. You decide whether to accept it, skip it or review the full analysis.",
    icon: CheckCircle2,
  },
];

const advantages = [
  "Compact Telegram signals for fast decisions",
  "Full analysis available only when you need it",
  "Dedicated logic for different markets",
  "Personal risk settings and exposure limits",
  "Automatic signal lifecycle and target tracking",
  "History and statistics based on your own accepted signals",
];

const platformCapabilities = [
  {
    title: "Structured signals across four markets",
    description: "Gold, Forex, Brent Oil and Bitcoin, each with dedicated market logic and its own trading schedule.",
    icon: BarChart3,
  },
  {
    title: "Personal risk sizing",
    description: "Position size, total exposure and correlated risk are calculated from your own account balance and risk settings.",
    icon: Settings,
  },
  {
    title: "Automatic lifecycle tracking",
    description: "Take Profit, Stop Loss and Breakeven updates are delivered automatically as each accepted scenario develops.",
    icon: History,
  },
  {
    title: "Verified public track record",
    description: "Real, accepted-and-closed results are published for every period below — no invented statistics.",
    icon: BadgeCheck,
  },
  {
    title: "Referral program",
    description: "Earn 30% commission from every confirmed subscription payment and renewal through your personal link.",
    icon: Users,
  },
  {
    title: "10-language interface",
    description: "The Mini App and signal delivery are available in ten languages, including Russian, Bulgarian, English and Spanish.",
    icon: Globe,
  },
];

const faqs = [
  {
    question: "What is NICS AI Trader?",
    answer:
      "NICS AI Trader is a Telegram-first trading assistant built by AI Byte Consult Ltd. It delivers structured trading scenarios — Entry, Stop Loss and four Take Profit targets — through a signal bot and the NICS Mini App.",
  },
  {
    question: "Which markets does it cover?",
    answer:
      "Gold, Forex, Brent Oil and Bitcoin, each with dedicated market logic and its own trading schedule.",
  },
  {
    question: "Where does the price data come from?",
    answer:
      "NICS AI Trader is an official trading-signal provider for Vantage. Every scenario is generated from Vantage's own live price feed, and accepted signals can be executed on a Vantage MT5 account through our market-data bridge.",
  },
  {
    question: "Do I have to accept every signal?",
    answer:
      "No. Each signal arrives as a compact scenario in Telegram, and you accept or skip it. Nothing is executed automatically.",
  },
  {
    question: "Is the risk sizing personal to me?",
    answer:
      "Yes. Position size, total exposure and correlated risk are calculated from your own account balance, currency and risk settings, set once in the Mini App and adjustable at any time.",
  },
  {
    question: "Does NICS guarantee profits?",
    answer:
      "No. Trading involves substantial risk. NICS provides structured analytical scenarios and risk-management tools, not guaranteed returns, investment advice or automatic profit.",
  },
];

const roadmap = [
  {
    title: "Copy-trading & referral leaderboard",
    description: "A ranked leaderboard for top referrers and, later, optional copy-trading for accepted scenarios.",
    icon: Users,
  },
  {
    title: "On-demand backtesting",
    description: "Request a historical backtest of the current strategy against a chosen market and period.",
    icon: LineChart,
  },
  {
    title: "VIP / scalping tier",
    description: "A faster, higher-frequency signal tier for experienced traders who want more setups per day.",
    icon: Zap,
  },
  {
    title: "Broader MT5 auto-execution",
    description: "Optional automatic order placement on a connected MT5 account, beyond today's manual accept/skip flow.",
    icon: Rocket,
  },
];

const Trading = () => {
  const seoProps = {
    title: "NICS AI Trader — AI Technical Analysis & Trading Signals in Telegram",
    description:
      "AI-powered technical analysis for gold, forex and crypto. Receive structured trading signals with Entry, Stop Loss, TP1–TP4, personal risk controls and signal tracking for Gold, Forex, Brent Oil and Bitcoin in Telegram and the NICS Mini App.",
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
        description:
          "A Telegram-first trading assistant that delivers structured market scenarios, personal risk controls, signal tracking and history for supported markets.",
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
                  AI Technical Analysis · Gold · Forex · Crypto
                </Badge>

                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-7xl">
                  Trade with a clear plan,
                  <span className="block text-gradient-gold">not guesswork</span>
                </h1>

                <p className="mt-7 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                  AI-powered technical analysis for gold, forex and crypto — delivered as structured trading signals with Entry, Stop Loss, four Take Profit targets and personal risk control, directly in Telegram and your NICS Mini App.
                </p>

                <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                  <a href={MINI_APP_URL} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full rounded-full px-8 sm:w-auto">
                      Open NICS Mini App
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                  <a href="#example-signal">
                    <Button size="lg" variant="outline" className="w-full rounded-full px-8 sm:w-auto">
                      View example signal
                    </Button>
                  </a>
                </div>

                <div className="mt-9 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  {["Gold", "Forex", "Brent Oil", "Bitcoin"].map((market) => (
                    <span key={market} className="rounded-full border border-border/70 bg-card/60 px-4 py-2 backdrop-blur">
                      {market}
                    </span>
                  ))}
                </div>
              </div>

              <div id="example-signal" className="mx-auto w-full max-w-md scroll-mt-28">
                <div className="rounded-[2rem] border border-border/70 bg-card/90 p-3 shadow-2xl shadow-primary/10 backdrop-blur">
                  <div className="rounded-[1.5rem] border border-border/60 bg-background p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">NICS AI TRADER</p>
                        <h2 className="mt-2 text-2xl font-semibold">Gold · LONG</h2>
                      </div>
                      <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10">LIVE</Badge>
                    </div>

                    <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
                      <p className="text-sm text-muted-foreground">Order type</p>
                      <p className="mt-1 text-xl font-semibold">BUY MARKET</p>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl border border-border/60 p-4">
                        <p className="text-muted-foreground">Entry</p>
                        <p className="mt-1 font-semibold">Current market</p>
                      </div>
                      <div className="rounded-xl border border-border/60 p-4">
                        <p className="text-muted-foreground">Stop Loss</p>
                        <p className="mt-1 font-semibold">Defined</p>
                      </div>
                      <div className="rounded-xl border border-border/60 p-4">
                        <p className="text-muted-foreground">Take Profit</p>
                        <p className="mt-1 font-semibold">TP1–TP4</p>
                      </div>
                      <div className="rounded-xl border border-border/60 p-4">
                        <p className="text-muted-foreground">Valid for</p>
                        <p className="mt-1 font-semibold">Limited time</p>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <Button className="rounded-xl">Accept</Button>
                      <Button variant="outline" className="rounded-xl">Skip</Button>
                    </div>

                    <p className="mt-5 text-center text-xs text-muted-foreground">
                      Illustrative interface. Live prices and levels are provided only inside an active signal.
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
                  Official Vantage signal provider
                </Badge>
                <h2 className="text-3xl font-semibold md:text-5xl">
                  Built on a <span className="text-gradient-gold">regulated broker's</span> live market data
                </h2>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">
                  NICS AI Trader is an official trading-signal provider for Vantage. Every scenario is generated from Vantage's own live price feed, and every accepted signal can be executed on a Vantage MT5 account through our dedicated market-data bridge — the same feed, the same broker, no intermediary re-quoting.
                </p>
                <a href={VANTAGE_URL} target="_blank" rel="noopener noreferrer sponsored" className="mt-8 inline-block">
                  <Button size="lg" variant="outline" className="rounded-full px-8">
                    Open a Vantage account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>

              <div className="rounded-[2rem] border border-border/70 bg-card/70 p-6 shadow-xl shadow-primary/5">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-xl border border-border/60 bg-background p-4">
                    <p className="text-muted-foreground">Broker</p>
                    <p className="mt-1 font-semibold">Vantage Markets</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background p-4">
                    <p className="text-muted-foreground">Status</p>
                    <p className="mt-1 font-semibold">Official provider</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background p-4">
                    <p className="text-muted-foreground">Execution</p>
                    <p className="mt-1 font-semibold">Live MT5 bridge</p>
                  </div>
                  <div className="rounded-xl border border-border/60 bg-background p-4">
                    <p className="text-muted-foreground">Price source</p>
                    <p className="mt-1 font-semibold">Vantage live feed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4">What you receive</Badge>
              <h2 className="text-3xl font-semibold md:text-5xl">Everything needed to make a trading decision</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                NICS turns market analysis into a clear, time-limited scenario you can understand and act on without sorting through technical dashboards.
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
                <Badge variant="outline" className="mb-4">NICS Mini App</Badge>
                <h2 className="text-3xl font-semibold md:text-5xl">Your personal trading dashboard</h2>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">
                  The compact Telegram message is designed for speed. Open the Mini App when you need the full scenario, personal risk settings, signal history and your own performance statistics.
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
                    Open Mini App
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>

              <div className="mx-auto w-full max-w-lg rounded-[2rem] border border-border/70 bg-background p-4 shadow-xl">
                <div className="rounded-[1.5rem] border border-border/60 bg-card p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">NICS Mini App</p>
                      <p className="mt-1 text-xl font-semibold">My trading dashboard</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Bot className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border/60 bg-background p-4">
                      <p className="text-xs text-muted-foreground">Active signals</p>
                      <p className="mt-1 text-2xl font-semibold">Live</p>
                    </div>
                    <div className="rounded-xl border border-border/60 bg-background p-4">
                      <p className="text-xs text-muted-foreground">Risk profile</p>
                      <p className="mt-1 text-2xl font-semibold">Personal</p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-border/60 bg-background p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">Gold · LONG</p>
                        <p className="mt-1 text-xs text-muted-foreground">Entry · SL · TP1–TP4 · Validity</p>
                      </div>
                      <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10">OPEN</Badge>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs">
                    <div className="rounded-xl border border-border/60 p-3">
                      <History className="mx-auto mb-2 h-4 w-4 text-primary" />
                      History
                    </div>
                    <div className="rounded-xl border border-border/60 p-3">
                      <BarChart3 className="mx-auto mb-2 h-4 w-4 text-primary" />
                      Statistics
                    </div>
                    <div className="rounded-xl border border-border/60 p-3">
                      <Settings className="mx-auto mb-2 h-4 w-4 text-primary" />
                      Risk
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
              <Badge variant="outline" className="mb-4">Simple start</Badge>
              <h2 className="text-3xl font-semibold md:text-5xl">Start in three steps</h2>
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
              <Badge variant="outline" className="mb-4">Supported markets</Badge>
              <h2 className="text-3xl font-semibold md:text-5xl">One AI Trader. Dedicated logic for every market.</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                Each market is handled according to its own schedule and trading behaviour instead of using one generic setup for everything.
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
              <Badge variant="outline" className="mb-4">Protection before speed</Badge>
              <h2 className="text-3xl font-semibold md:text-5xl">NICS helps protect you from missed opportunities</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                A trading scenario is useful only while the market still supports it. NICS checks whether the opportunity remains actionable before you accept it.
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
                <Badge variant="outline" className="mb-4">Why NICS</Badge>
                <h2 className="text-3xl font-semibold md:text-5xl">More than a signal channel</h2>
                <p className="mt-5 text-lg leading-8 text-muted-foreground">
                  NICS does not simply forward another trader's call. It creates a structured scenario for the selected instrument and current conditions, then helps you manage the decision from delivery to closure.
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
              <Badge variant="outline" className="mb-4">About the project</Badge>
              <h2 className="text-3xl font-semibold md:text-5xl">What NICS AI Trader does today — and what's coming next</h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                NICS AI Trader is built by AI Byte Consult Ltd as a Telegram-first trading assistant, delivered through a signal bot and the NICS Mini App. Here is what's actually live right now, and what's genuinely planned rather than promised.
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
                  Roadmap
                </Badge>
                <h3 className="text-2xl font-semibold md:text-3xl">On the roadmap — not available yet</h3>
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
                <h2 className="mt-5 text-3xl font-semibold md:text-5xl">Your next signal should arrive with a plan</h2>
                <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                  Open NICS AI Trader, choose your markets and receive structured scenarios with Entry, Stop Loss, Take Profit targets and personal risk control.
                </p>

                <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                  <a href={MINI_APP_URL} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="w-full rounded-full px-8 sm:w-auto">
                      Open NICS Mini App
                    </Button>
                  </a>
                  <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" variant="outline" className="w-full rounded-full px-8 sm:w-auto">
                      <Send className="mr-2 h-4 w-4" />
                      Join Telegram channel
                    </Button>
                  </a>
                </div>

                <a href={VANTAGE_URL} target="_blank" rel="noopener noreferrer sponsored" className="mt-6 inline-flex items-center text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                  Need a supported trading account? Open Vantage Markets
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4">FAQ</Badge>
              <h2 className="text-3xl font-semibold md:text-5xl">Frequently asked questions</h2>
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
                Technology and security information for professionals
                <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground" />
              </summary>
              <div className="mt-6 grid gap-4 text-sm leading-7 text-muted-foreground md:grid-cols-2">
                <p>
                  NICS uses current broker market data, separate market-specific analysis, automated signal lifecycle management and authenticated Telegram access.
                </p>
                <p>
                  User dashboards are scoped to the authenticated Telegram account, while risk settings, active scenarios, history and performance data are handled separately for each user.
                </p>
              </div>
            </details>

            <p className="mx-auto mt-8 max-w-4xl text-center text-xs leading-6 text-muted-foreground">
              Trading involves substantial risk. NICS provides structured analytical scenarios and risk-management tools, not guaranteed returns, investment advice or automatic profit.
            </p>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Trading;

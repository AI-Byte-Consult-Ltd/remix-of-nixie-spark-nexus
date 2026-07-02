import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import TradingViewTicker from "@/components/TradingViewTicker";
import {
  TrendingUp,
  ArrowRight,
  Send,
  Users,
  BookOpen,
  Download,
  ShieldCheck,
  Bot,
  Sparkles,
  Newspaper,
  Bitcoin,
  DollarSign,
  Coins,
  ExternalLink,
  Zap,
  Copy as CopyIcon,
  Activity,
  Percent,
  BarChart3,
  Calculator,
} from "lucide-react";
import useSEO from "@/hooks/useSEO";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const VANTAGE_URL = "https://fwd.cx/Yj25BCrDzEHB";
const TELEGRAM_URL = "https://t.me/GoldAndMarkets";
const COPY_TRADING_URL = "https://fwd.cx/Yj25BCrDzEHB";

type Category = "Forex" | "Gold" | "Crypto";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  category: Category;
  tags: string[];
  publishedAt: number;
  url?: string;
}

// Fallback pool used only if the live news edge function is unreachable.
const newsPool: Omit<NewsItem, "id" | "publishedAt">[] = [
  { title: "EUR/USD holds gains as traders reprice ECB rate path", source: "FX Wire", category: "Forex", tags: ["EURUSD", "ECB", "Rates"] },
  { title: "USD/JPY spikes on BoJ intervention rumors", source: "Market Pulse", category: "Forex", tags: ["USDJPY", "BoJ"] },
  { title: "Gold (XAUUSD) breaks $2,450 as safe-haven demand returns", source: "Metals Daily", category: "Gold", tags: ["XAUUSD", "Safe-Haven"] },
  { title: "GBP/USD tests resistance ahead of UK CPI print", source: "FX Wire", category: "Forex", tags: ["GBPUSD", "CPI"] },
  { title: "Bitcoin reclaims $95K as ETF inflows accelerate", source: "Crypto Feed", category: "Crypto", tags: ["BTC", "ETF"] },
  { title: "Ethereum surges on Layer-2 adoption metrics", source: "Crypto Feed", category: "Crypto", tags: ["ETH", "L2"] },
  { title: "XAUUSD consolidates below all-time high — breakout watch", source: "Metals Daily", category: "Gold", tags: ["XAUUSD", "Breakout"] },
  { title: "AUD/USD rallies on strong China trade data", source: "Market Pulse", category: "Forex", tags: ["AUDUSD", "China"] },
  { title: "Solana leads altcoin rally, +12% in 24h", source: "Crypto Feed", category: "Crypto", tags: ["SOL", "Altcoins"] },
  { title: "Gold miners outperform as XAUUSD volatility jumps", source: "Metals Daily", category: "Gold", tags: ["XAUUSD", "Miners"] },
  { title: "DXY softens — risk assets catch a bid across FX and crypto", source: "Macro Desk", category: "Forex", tags: ["DXY", "Risk-On"] },
  { title: "AI trading bots dominate Q3 volume in crypto perps", source: "Crypto Feed", category: "Crypto", tags: ["AI", "Perps"] },
];

const catIcon = (c: Category) => (c === "Crypto" ? Bitcoin : c === "Gold" ? Coins : DollarSign);
const catStyle = (c: Category) =>
  c === "Crypto"
    ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
    : c === "Gold"
    ? "bg-yellow-500/10 text-yellow-700 border-yellow-500/20"
    : "bg-blue-500/10 text-blue-600 border-blue-500/20";

const seedNews = (): NewsItem[] => {
  const now = Date.now();
  return newsPool.slice(0, 8).map((n, i) => ({
    ...n,
    id: `${now}-${i}`,
    publishedAt: now - i * 1000 * 60 * (3 + Math.floor(Math.random() * 9)),
  }));
};

const timeAgo = (ts: number) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return `${h}h ago`;
};

const Trading = () => {
  const { t } = useLanguage();

  useSEO({
    title: "NICS AI Trading — AI-Powered Forex, Gold & Crypto Signals | AI Byte Consult",
    description:
      "NICS AI Trading — AI-powered trading, Vantage partnership, copy trading, and a live news hub for Forex, Gold (XAUUSD) and Crypto. Join our Telegram community.",
    canonical: "https://aibyteconsult.com/trading",
    ogImage: "https://aibyteconsult.com/og-trading.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Service",
      name: "NICS AI Trading",
      provider: { "@type": "Organization", "name": "AI Byte Consult Ltd" },
      description:
        "AI-powered trading platform with Vantage partnership, copy trading, and a live Forex, Gold and Crypto news hub.",
      url: "https://aibyteconsult.com/trading",
    },
  });

  const [filter, setFilter] = useState<"All" | Category>("All");
  const [news, setNews] = useState<NewsItem[]>(() => seedNews());
  const [newsLoading, setNewsLoading] = useState<boolean>(true);
  const [newsLive, setNewsLive] = useState<boolean>(false);

  // ROI Calculator state — based on historical algorithm avg monthly return.
  const [deposit, setDeposit] = useState<number>(2500);
  const AVG_MONTHLY_RETURN = 0.084; // 8.4% avg historical monthly (illustrative)
  const monthlyProfit = deposit * AVG_MONTHLY_RETURN;
  const yearlyProfit = deposit * (Math.pow(1 + AVG_MONTHLY_RETURN, 12) - 1);
  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("market-news");
        if (cancelled) return;
        if (error) throw error;
        const items = (data?.items ?? []) as NewsItem[];
        if (items.length > 0) {
          setNews(items);
          setNewsLive(true);
        }
      } catch (e) {
        console.warn("market-news fetch failed, using fallback", e);
      } finally {
        if (!cancelled) setNewsLoading(false);
      }
    };
    load();
    // Refresh every 5 minutes
    const id = setInterval(load, 5 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const filtered = useMemo(
    () => (filter === "All" ? news : news.filter((n) => n.category === filter)),
    [news, filter]
  );

  const materials = [
    { icon: BookOpen, titleKey: "trading.vantage.mat1.title", descKey: "trading.vantage.mat1.desc" },
    { icon: Download, titleKey: "trading.vantage.mat2.title", descKey: "trading.vantage.mat2.desc" },
    { icon: ShieldCheck, titleKey: "trading.vantage.mat3.title", descKey: "trading.vantage.mat3.desc" },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[32rem] h-[32rem] bg-green-500/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t("trading.badge")}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
              {t("trading.hero.title1")} <span className="text-gradient-gold">{t("trading.hero.title2")}</span>{" "}
              {t("trading.hero.title3")}
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("trading.hero.desc")}</p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                  <Send className="mr-2 w-4 h-4" />
                  {t("trading.cta.telegram")}
                </Button>
              </a>
              <a href={VANTAGE_URL} target="_blank" rel="noopener noreferrer sponsored">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-2">
                  {t("trading.cta.vantage")}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </a>
            </div>

            <div className="flex flex-wrap gap-2 justify-center pt-6">
              {["trading.badge.ai", "trading.badge.forex", "trading.badge.gold", "trading.badge.crypto"].map((k) => (
                <Badge key={k} variant="outline" className="border-primary/20 text-primary/80 bg-primary/5">
                  {t(k)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TradingView Ticker Tape — live market prices */}
      <TradingViewTicker />

      {/* Live Stats Widget */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { icon: Percent, value: "74%", label: t("trading.stats.winrate"), color: "text-green-600" },
              { icon: Users, value: "1,420+", label: t("trading.stats.copiers"), color: "text-primary" },
              { icon: BarChart3, value: "+12.4%", label: t("trading.stats.month"), color: "text-green-600" },
              { icon: Activity, value: "24/7", label: t("trading.stats.uptime"), color: "text-primary" },
            ].map((s, i) => (
              <Card
                key={i}
                className="card-hover bg-card border-border/50 hover:border-primary/30"
              >
                <CardContent className="p-5 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-gold flex items-center justify-center flex-shrink-0">
                    <s.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className={`text-xl md:text-2xl font-semibold ${s.color}`}>
                      {s.value}
                      <span className="relative inline-flex h-2 w-2 ml-2 -translate-y-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">{s.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vantage Partnership */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
              {t("trading.vantage.badge")}
            </Badge>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              {t("trading.vantage.title1")} <span className="text-gradient-gold">{t("trading.vantage.title2")}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("trading.vantage.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
            {materials.map((m, i) => (
              <Card key={i} className="card-hover bg-card border-border/50 hover:border-primary/30">
                <CardHeader>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-gold flex items-center justify-center mb-4">
                    <m.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{t(m.titleKey)}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-muted-foreground">{t(m.descKey)}</CardDescription>
                  <div className="pt-2">
                    <a href={VANTAGE_URL} target="_blank" rel="noopener noreferrer sponsored">
                      <Button variant="outline" size="sm" className="rounded-full">
                        <Download className="mr-2 w-4 h-4" />
                        {t("trading.vantage.download")}
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="max-w-6xl mx-auto">
            <Card className="bg-gradient-to-br from-card via-card to-green-500/5 border-green-500/30 overflow-hidden">
              <div className="grid md:grid-cols-[1fr_auto] gap-6 p-6 items-center">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700">{t("trading.vantage.partner")}</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">{t("trading.vantage.cta.title")}</h3>
                  <p className="text-muted-foreground">{t("trading.vantage.cta.desc")}</p>
                  <div className="pt-1">
                    <a href={VANTAGE_URL} target="_blank" rel="noopener noreferrer sponsored">
                      <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full">
                        {t("trading.vantage.cta.button")}
                        <ExternalLink className="ml-2 w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </div>
                <div className="flex justify-center md:justify-end">
                  {/* Image removed by request */}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Copy Trading */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <Card className="bg-gradient-to-br from-card via-card to-primary/5 border-primary/30 overflow-hidden">
              <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 items-center">
                <div className="space-y-6">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {t("trading.copy.badge")}
                  </Badge>
                  <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                    {t("trading.copy.title1")}{" "}
                    <span className="text-gradient-gold">{t("trading.copy.title2")}</span>
                  </h2>
                  <p className="text-lg text-muted-foreground">{t("trading.copy.desc")}</p>
                  <ul className="space-y-3">
                    {["trading.copy.b1", "trading.copy.b2", "trading.copy.b3", "trading.copy.b4"].map((k) => (
                      <li key={k} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Zap className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-foreground">{t(k)}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2">
                    <a href={COPY_TRADING_URL} target="_blank" rel="noopener noreferrer sponsored">
                      <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-8">
                        <CopyIcon className="mr-2 w-4 h-4" />
                        {t("trading.copy.cta")}
                      </Button>
                    </a>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-gold opacity-10 rounded-3xl blur-2xl" />
                  <div className="relative rounded-3xl border border-border/50 bg-card/80 backdrop-blur p-6 space-y-5">
                    {/* ROI Calculator */}
                    <div className="space-y-4 pb-5 border-b border-border/50">
                      <div className="flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-primary" />
                        <span className="font-semibold">{t("trading.roi.title")}</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-muted-foreground">
                          {t("trading.roi.deposit")}
                        </span>
                        <span className="text-lg font-semibold text-foreground">
                          {fmt(deposit)}
                        </span>
                      </div>
                      <Slider
                        value={[deposit]}
                        min={500}
                        max={10000}
                        step={100}
                        onValueChange={(v) => setDeposit(v[0])}
                        aria-label={t("trading.roi.deposit")}
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>$500</span>
                        <span>$10,000</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="rounded-xl bg-muted/40 p-3">
                          <div className="text-[11px] text-muted-foreground">
                            {t("trading.roi.monthly")}
                          </div>
                          <div className="text-lg font-semibold text-green-600">
                            +{fmt(monthlyProfit)}
                          </div>
                        </div>
                        <div className="rounded-xl bg-muted/40 p-3">
                          <div className="text-[11px] text-muted-foreground">
                            {t("trading.roi.yearly")}
                          </div>
                          <div className="text-lg font-semibold text-green-600">
                            +{fmt(yearlyProfit)}
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">
                        {t("trading.roi.disclaimer")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-primary" />
                        <span className="font-semibold">{t("trading.copy.card.title")}</span>
                      </div>
                      <Badge className="bg-green-500/10 text-green-600 border-green-500/20" variant="secondary">
                        LIVE
                      </Badge>
                    </div>
                    {[
                      { name: "NICS Alpha Bot", pnl: "+38.4%", trades: 214 },
                      { name: "XAUUSD Momentum", pnl: "+21.7%", trades: 96 },
                      { name: "BTC Trend Follower", pnl: "+52.1%", trades: 47 },
                    ].map((s) => (
                      <div key={s.name} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                        <div>
                          <div className="font-medium text-sm">{s.name}</div>
                          <div className="text-xs text-muted-foreground">{s.trades} trades</div>
                        </div>
                        <div className="text-green-600 font-semibold">{s.pnl}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Live News Hub */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
              <Newspaper className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t("trading.news.badge")}</span>
              <span className="relative flex h-2 w-2 ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              {t("trading.news.title1")} <span className="text-gradient-gold">{t("trading.news.title2")}</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("trading.news.subtitle")}</p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {(["All", "Forex", "Gold", "Crypto"] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                    filter === c
                      ? "bg-foreground text-background border-foreground"
                      : "bg-card text-muted-foreground border-border hover:border-primary/30"
                  }`}
                >
                  {c === "All" ? t("trading.news.filter.all") : c}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {filtered.map((n) => {
                const Icon = catIcon(n.category);
                const CardInner = (
                  <CardContent className="p-4 md:p-5">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Badge variant="outline" className={catStyle(n.category)}>
                              {n.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{n.source}</span>
                            <span className="text-xs text-muted-foreground">· {timeAgo(n.publishedAt)}</span>
                          </div>
                          <div className="font-medium text-foreground">{n.title}</div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {n.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        {n.url && (
                          <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </CardContent>
                );
                const cardClass =
                  "card-hover bg-card border-border/50 hover:border-primary/30 animate-fade-in block";
                return n.url ? (
                  <a
                    key={n.id}
                    href={n.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Card className={cardClass}>{CardInner}</Card>
                  </a>
                ) : (
                  <Card key={n.id} className={cardClass}>
                    {CardInner}
                  </Card>
                );
              })}
              {newsLoading && news.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-8">
                  {t("trading.news.loading")}
                </div>
              )}
              {!newsLoading && !newsLive && (
                <p className="text-center text-[11px] text-muted-foreground pt-2">
                  {t("trading.news.offline")}
                </p>
              )}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-6">{t("trading.news.disclaimer")}</p>
          </div>
        </div>
      </section>

      {/* Telegram Community */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="relative overflow-hidden border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card">
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-green-500/20 rounded-full blur-3xl" />
              <div className="relative p-8 md:p-12 text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-gold">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
                  {t("trading.telegram.title1")}{" "}
                  <span className="text-gradient-gold">{t("trading.telegram.title2")}</span>
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("trading.telegram.desc")}</p>
                <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span>{t("trading.telegram.stat1")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span>{t("trading.telegram.stat2")}</span>
                  </div>
                </div>
                <div className="pt-2">
                  <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background rounded-full px-10">
                      <Send className="mr-2 w-4 h-4" />
                      {t("trading.telegram.cta")}
                    </Button>
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Trading;
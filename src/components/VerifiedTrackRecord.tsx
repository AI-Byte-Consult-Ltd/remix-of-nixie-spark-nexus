import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

type PeriodStats = {
  closedSignals: number;
  wins: number;
  losses: number;
  breakeven: number;
  winRatePercent: number;
  totalR: number;
  expectancyR: number;
  averageMfeR: number;
  averageMaeR: number;
};

type PerformanceResponse = {
  product: string;
  verified: boolean;
  source: string;
  generatedAt: string;
  performance: Record<"7d" | "30d" | "90d" | "all", PeriodStats>;
};

const ENDPOINT = "https://n8n.aibyteconsult.com/webhook/nics-public-performance";

const PERIODS: { key: keyof PerformanceResponse["performance"]; labelKey: string }[] = [
  { key: "7d", labelKey: "track.period.7d" },
  { key: "30d", labelKey: "track.period.30d" },
  { key: "90d", labelKey: "track.period.90d" },
  { key: "all", labelKey: "track.period.all" },
];

const VerifiedTrackRecord = () => {
  const { t } = useLanguage();
  const [data, setData] = useState<PerformanceResponse | null>(null);
  const [error, setError] = useState(false);
  const [period, setPeriod] = useState<keyof PerformanceResponse["performance"]>("30d");

  useEffect(() => {
    let cancelled = false;
    fetch(ENDPOINT)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((json: PerformanceResponse) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error || (data && !data.performance?.[period])) {
    return null;
  }

  const stats = data?.performance?.[period];

  return (
    <section className="py-24 relative bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            <BadgeCheck className="w-3.5 h-3.5" />
            {t("track.badge")}
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-foreground">
            {t("track.title1")} <span className="text-gradient-gold">{t("track.title2")}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t("track.subtitle")}</p>
        </div>

        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                period === p.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/40"
              }`}
            >
              {t(p.labelKey)}
            </button>
          ))}
        </div>

        {!data ? (
          <div className="text-center text-sm text-muted-foreground">{t("track.loading")}</div>
        ) : (
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border/50">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-semibold text-foreground">{stats.closedSignals}</div>
                <div className="text-xs text-muted-foreground mt-1">{t("track.closedSignals")}</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-semibold text-foreground">{stats.winRatePercent}%</div>
                <div className="text-xs text-muted-foreground mt-1">{t("track.winRate")}</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50">
              <CardContent className="pt-6 text-center">
                <div
                  className={`flex items-center justify-center gap-1 text-3xl font-semibold ${
                    stats.expectancyR > 0
                      ? "text-green-600"
                      : stats.expectancyR < 0
                        ? "text-red-600"
                        : "text-foreground"
                  }`}
                >
                  {stats.expectancyR > 0 ? (
                    <TrendingUp className="w-6 h-6" />
                  ) : stats.expectancyR < 0 ? (
                    <TrendingDown className="w-6 h-6" />
                  ) : (
                    <Minus className="w-6 h-6" />
                  )}
                  {stats.expectancyR > 0 ? "+" : ""}
                  {stats.expectancyR}R
                </div>
                <div className="text-xs text-muted-foreground mt-1">{t("track.expectancy")}</div>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/50">
              <CardContent className="pt-6 text-center">
                <div
                  className={`text-3xl font-semibold ${
                    stats.totalR > 0 ? "text-green-600" : stats.totalR < 0 ? "text-red-600" : "text-foreground"
                  }`}
                >
                  {stats.totalR > 0 ? "+" : ""}
                  {stats.totalR}R
                </div>
                <div className="text-xs text-muted-foreground mt-1">{t("track.totalR")}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8 max-w-xl mx-auto">{t("track.disclaimer")}</p>
      </div>
    </section>
  );
};

export default VerifiedTrackRecord;

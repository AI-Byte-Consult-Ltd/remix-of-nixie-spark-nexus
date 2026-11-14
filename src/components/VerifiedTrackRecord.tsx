import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { BadgeCheck, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { usePublicPerformance, type PerformanceResponse, type PeriodStats } from "@/lib/publicPerformance";
import TrackRecordAnalytics from "@/components/trading/TrackRecordAnalytics";

const PERIODS: { key: keyof PerformanceResponse["performance"]; labelKey: string }[] = [
  { key: "7d", labelKey: "track.period.7d" },
  { key: "30d", labelKey: "track.period.30d" },
  { key: "90d", labelKey: "track.period.90d" },
  { key: "all", labelKey: "track.period.all" },
];

// Shown instead of numbers when the statistics endpoint does not answer. The
// section itself always stays on the page: every "Verified statistics" button
// scrolls to it, and a hidden section turned those buttons into dead ones
// (2026-11-14). Honest state, no placeholder numbers.
const OFFLINE: Record<Language, { text: string; retry: string }> = {
  en: { text: "Statistics are temporarily unavailable. No numbers are shown until the live data is back.", retry: "Try again" },
  ru: { text: "Статистика временно недоступна. Пока живые данные не вернутся, цифры не показываем.", retry: "Обновить" },
  de: { text: "Die Statistik ist vorübergehend nicht verfügbar. Ohne Live-Daten zeigen wir keine Zahlen.", retry: "Erneut versuchen" },
  fr: { text: "Les statistiques sont temporairement indisponibles. Aucun chiffre n'est affiché sans données en direct.", retry: "Réessayer" },
  ar: { text: "الإحصاءات غير متاحة مؤقتاً. لا نعرض أي أرقام حتى تعود البيانات المباشرة.", retry: "إعادة المحاولة" },
  zh: { text: "统计数据暂时不可用。实时数据恢复之前不显示任何数字。", retry: "重试" },
  pl: { text: "Statystyki są chwilowo niedostępne. Bez danych na żywo nie pokazujemy liczb.", retry: "Spróbuj ponownie" },
  tr: { text: "İstatistikler geçici olarak kullanılamıyor. Canlı veri dönene kadar rakam göstermiyoruz.", retry: "Tekrar dene" },
  it: { text: "Le statistiche sono temporaneamente non disponibili. Senza dati in tempo reale non mostriamo numeri.", retry: "Riprova" },
  bg: { text: "Статистиката временно не е достъпна. Докато живите данни не се върнат, не показваме числа.", retry: "Опитай отново" },
  es: { text: "Las estadísticas no están disponibles temporalmente. No mostramos cifras hasta que vuelvan los datos en vivo.", retry: "Reintentar" },
  pt: { text: "As estatísticas estão temporariamente indisponíveis. Não mostramos números até os dados em tempo real voltarem.", retry: "Tentar novamente" },
};

const SECTION_ID = "track-record";

const VerifiedTrackRecord = () => {
  const { t, language } = useLanguage();
  const { data, error, retry } = usePublicPerformance();
  const [period, setPeriod] = useState<keyof PerformanceResponse["performance"]>("all");
  const { hash } = useLocation();
  const sectionRef = useRef<HTMLElement>(null);
  const userMoved = useRef(false);

  // Arriving from another page with #track-record (the button on
  // /nics-trading-software): the router does not scroll to a hash by itself.
  // Scroll once on arrival and once more when the data lands, because the
  // hero strip above appears at that moment and shifts the page; never after
  // the visitor has started scrolling on their own.
  useEffect(() => {
    const stop = () => {
      userMoved.current = true;
    };
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchmove", stop, { passive: true });
    window.addEventListener("keydown", stop);
    return () => {
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
      window.removeEventListener("keydown", stop);
    };
  }, []);
  const ready = Boolean(data) || error;
  useEffect(() => {
    if (hash !== `#${SECTION_ID}` || userMoved.current) return;
    const id = window.setTimeout(() => sectionRef.current?.scrollIntoView(), 50);
    return () => window.clearTimeout(id);
  }, [hash, ready]);

  const offline = error || Boolean(data && !data.performance?.[period]);
  const offlineText = OFFLINE[language] ?? OFFLINE.en;

  const tiered = data?.performance?.[period];

  const renderStatGrid = (stats: PeriodStats, muted: boolean) => (
    <div className={`max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 ${muted ? "opacity-80" : ""}`}>
      <Card className={`bg-card ${muted ? "border-border/30" : "border-border/50"}`}>
        <CardContent className="pt-6 text-center">
          <div className={`font-semibold text-foreground ${muted ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}>
            {stats.closedSignals}
          </div>
          <div className="text-xs text-muted-foreground mt-1">{t("track.closedSignals")}</div>
        </CardContent>
      </Card>
      <Card className={`bg-card ${muted ? "border-border/30" : "border-border/50"}`}>
        <CardContent className="pt-6 text-center">
          <div className={`font-semibold text-foreground ${muted ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}>
            {stats.winRatePercent}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">{t("track.winRate")}</div>
        </CardContent>
      </Card>
      <Card className={`bg-card ${muted ? "border-border/30" : "border-border/50"}`}>
        <CardContent className="pt-6 text-center">
          <div
            className={`flex items-center justify-center gap-1 font-semibold ${muted ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"} ${
              stats.expectancyR > 0 ? "text-green-600" : stats.expectancyR < 0 ? "text-red-600" : "text-foreground"
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
            {(Math.round(stats.expectancyR * 100) / 100).toFixed(2)}R
          </div>
          <div className="text-xs text-muted-foreground mt-1">{t("track.expectancy")}</div>
        </CardContent>
      </Card>
      <Card className={`bg-card ${muted ? "border-border/30" : "border-border/50"}`}>
        <CardContent className="pt-6 text-center">
          <div
            className={`font-semibold ${muted ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"} ${
              stats.totalR > 0 ? "text-green-600" : stats.totalR < 0 ? "text-red-600" : "text-foreground"
            }`}
          >
            {stats.totalR > 0 ? "+" : ""}
            {(Math.round(stats.totalR * 10) / 10).toFixed(1)}R
          </div>
          <div className="text-xs text-muted-foreground mt-1">{t("track.totalR")}</div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <section id={SECTION_ID} ref={sectionRef} className="py-24 relative bg-muted/30 scroll-mt-24">
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

        {offline ? (
          <div className="mx-auto max-w-xl rounded-2xl border border-border/60 bg-card p-6 text-center">
            <p className="flex items-center justify-center gap-2 text-sm font-medium text-foreground">
              <span className="h-2 w-2 rounded-full bg-muted-foreground" />
              offline
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{offlineText.text}</p>
            <button
              type="button"
              onClick={retry}
              className="mt-4 rounded-full border border-border px-4 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/40"
            >
              {offlineText.retry}
            </button>
          </div>
        ) : data?.trades?.length ? (
          // Since 2026-11-04: full analytics (equity curve, drawdown, profit
          // factor, per-instrument table, calendar periods) from the real
          // closed-signal list. The four-card fallback below stays for an API
          // that does not return the list yet.
          <div className="max-w-5xl mx-auto">
            <TrackRecordAnalytics trades={data.trades} language={language} variant="site" />
          </div>
        ) : (
          <>
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
              <div className="space-y-10">
                <div>
                  <div className="text-center mb-4">
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                      <span className="w-2 h-2 rounded-full bg-green-600" />
                      {t("track.tier.confirmed")}
                    </span>
                  </div>
                  {renderStatGrid(tiered.confirmed, false)}
                </div>
              </div>
            )}
          </>
        )}

        <p className="text-center text-xs text-muted-foreground mt-8 max-w-xl mx-auto">{t("track.disclaimer")}</p>
      </div>
    </section>
  );
};

export default VerifiedTrackRecord;

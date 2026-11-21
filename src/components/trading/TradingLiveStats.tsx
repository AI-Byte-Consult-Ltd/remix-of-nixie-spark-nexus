import { ArrowDown } from "lucide-react";
import type { Language } from "@/contexts/LanguageContext";
import { usePublicPerformance } from "@/lib/publicPerformance";

// Hero strip of /trading: the real all-time figures of the signals that passed
// the quality gate, from the same public endpoint as the Verified Track
// Record section below. Nothing is shown while loading or if the endpoint is down: no
// placeholder numbers.

interface StatsStrings {
  title: string;
  closed: string;
  winRate: string;
  totalR: string;
  more: string;
}

const strings: Record<Language, StatsStrings> = {
  en: { title: "All time · trades that passed the quality gate", closed: "closed trades", winRate: "win rate", totalR: "total R", more: "Full track record" },
  ru: { title: "За всё время · сделки, прошедшие фильтр качества", closed: "закрытых сделок", winRate: "прибыльных", totalR: "итог в R", more: "Вся статистика" },
  de: { title: "Gesamter Zeitraum · Trades, die den Qualitätsfilter bestanden haben", closed: "geschlossene Trades", winRate: "Trefferquote", totalR: "Summe R", more: "Gesamte Bilanz" },
  fr: { title: "Depuis le début · trades ayant passé le filtre qualité", closed: "trades clôturés", winRate: "taux de réussite", totalR: "total R", more: "Historique complet" },
  ar: { title: "طوال الفترة · الصفقات التي اجتازت فلتر الجودة", closed: "صفقة مغلقة", winRate: "نسبة الربح", totalR: "إجمالي R", more: "السجل الكامل" },
  zh: { title: "全部时间 · 通过质量筛选的分析", closed: "已平仓交易", winRate: "胜率", totalR: "累计 R", more: "完整业绩记录" },
  pl: { title: "Cały okres · transakcje, które przeszły filtr jakości", closed: "zamkniętych transakcji", winRate: "skuteczność", totalR: "suma R", more: "Pełne wyniki" },
  tr: { title: "Tüm zamanlar · kalite filtresinden geçen işlemler", closed: "kapanan işlem", winRate: "kazanma oranı", totalR: "toplam R", more: "Tüm sonuçlar" },
  it: { title: "Da sempre · operazioni che hanno superato il filtro qualità", closed: "operazioni chiuse", winRate: "tasso di successo", totalR: "totale R", more: "Storico completo" },
  bg: { title: "За цялото време · сделки, преминали филтъра за качество", closed: "затворени сделки", winRate: "печеливши", totalR: "общо R", more: "Пълна статистика" },
  es: { title: "Desde el inicio · operaciones que pasaron el filtro de calidad", closed: "operaciones cerradas", winRate: "tasa de acierto", totalR: "total R", more: "Historial completo" },
  pt: { title: "Desde o início · operações que passaram no filtro de qualidade", closed: "operações fechadas", winRate: "taxa de acerto", totalR: "total R", more: "Histórico completo" },
};

const TradingLiveStats = ({ lang }: { lang: Language }) => {
  const s = strings[lang] ?? strings.en;
  const { data } = usePublicPerformance();
  const stats = data?.performance?.["all"]?.confirmed;
  if (!stats || stats.closedSignals === 0) return null;

  const r = Math.round(stats.totalR * 10) / 10;
  const rClass = r > 0 ? "text-green-600" : r < 0 ? "text-red-600" : "text-foreground";

  return (
    <div className="mt-8 max-w-xl rounded-2xl border border-border/70 bg-card/70 p-4 backdrop-blur animate-in fade-in slide-in-from-bottom-2 duration-700">
      <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
        {s.title}
      </p>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div>
          <p className="text-2xl font-semibold">{stats.closedSignals}</p>
          <p className="text-xs text-muted-foreground">{s.closed}</p>
        </div>
        <div>
          <p className="text-2xl font-semibold">{stats.winRatePercent}%</p>
          <p className="text-xs text-muted-foreground">{s.winRate}</p>
        </div>
        <div>
          <p className={`text-2xl font-semibold ${rClass}`}>
            {r > 0 ? "+" : ""}
            {r}R
          </p>
          <p className="text-xs text-muted-foreground">{s.totalR}</p>
        </div>
      </div>
      <a href="#track-record" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
        {s.more}
        <ArrowDown className="h-3.5 w-3.5" />
      </a>
    </div>
  );
};

export default TradingLiveStats;

import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  Clock3,
  RefreshCw,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { statusLabels, type Translation } from "./i18n";
import type { AppLanguage, SignalRow, SizingResult } from "./types";
import { formatDate, formatMoney, formatNumber, freshnessTone } from "./utils";

interface SignalCardProps {
  signal: SignalRow;
  language: AppLanguage;
  t: Translation;
  sizing?: SizingResult | null;
  sizingLoading?: boolean;
  onCalculate: (signalId: string) => void;
  onRefresh: (signalId: string) => void;
}

const statusTone = (status: string) => {
  if (status === "TP1_REACHED") return "border-emerald-400/30 text-emerald-300";
  if (status === "EXPIRED" || status === "PRICE_MOVED") {
    return "border-rose-400/30 text-rose-300";
  }
  if (status === "IN_ENTRY") return "border-sky-400/30 text-sky-300";
  return "border-amber-300/30 text-amber-200";
};

export const SignalCard = ({
  signal,
  language,
  t,
  sizing,
  sizingLoading = false,
  onCalculate,
  onRefresh,
}: SignalCardProps) => {
  const long = signal.direction === "LONG";
  const rawStatus = signal.liveStatus ?? "ACTIVE";
  const status = statusLabels[language][rawStatus] ?? rawStatus;
  const hitTargets = new Set(signal.hitTargets ?? []);
  const targets = [signal.tp1, signal.tp2, signal.tp3, signal.tp4];
  const ownSizing = sizing ?? null;

  return (
    <Card className="overflow-hidden border-white/10 bg-white/[0.045] text-white shadow-none">
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-3 border-b border-white/10 p-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold">{signal.label || signal.symbol}</span>
              <Badge
                className={cn(
                  "border-0",
                  long ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/15 text-rose-300",
                )}
              >
                {long ? (
                  <TrendingUp className="mr-1 h-3 w-3" />
                ) : (
                  <TrendingDown className="mr-1 h-3 w-3" />
                )}
                {signal.direction}
              </Badge>
              {signal.accessType && (
                <Badge variant="secondary" className="bg-white/5 text-slate-400">
                  {signal.accessType}
                </Badge>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {signal.symbol} · {signal.marketGroup}
            </p>
          </div>
          <Badge variant="outline" className={statusTone(rawStatus)}>
            {status}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-px bg-white/10">
          <div className="bg-[#0e1119] p-4">
            <p className="text-[11px] uppercase tracking-wider text-slate-500">{t.lastPrice}</p>
            <p className="mt-1 font-mono text-lg">{formatNumber(signal.lastPrice, 6)}</p>
            <p className="mt-1 text-[10px] text-slate-600">
              {formatDate(signal.priceAsOf, language)}
            </p>
          </div>
          <div className="bg-[#0e1119] p-4">
            <p className="text-[11px] uppercase tracking-wider text-slate-500">{t.entry}</p>
            <p className="mt-1 font-mono text-sm">
              {formatNumber(signal.entryLow, 6)} – {formatNumber(signal.entryHigh, 6)}
            </p>
            <p className="mt-1 text-[10px] text-slate-600">
              {t.distance}: {formatNumber(signal.distanceFromEntry, 6)}
            </p>
          </div>
        </div>

        <div className="space-y-4 border-b border-white/10 p-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500">{t.plan}</p>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
              <div className="rounded-xl border border-rose-400/20 bg-rose-400/[0.07] p-2.5">
                <p className="text-[10px] text-rose-300/70">{t.stopLoss}</p>
                <p className="mt-1 font-mono text-xs text-rose-200">
                  {formatNumber(signal.stopLoss, 6)}
                </p>
              </div>
              {targets.map((target, index) => {
                if (target === null || target === undefined) return null;
                const targetNumber = index + 1;
                const hit = hitTargets.has(targetNumber);
                return (
                  <div
                    key={`${signal.signalId}-tp-${targetNumber}`}
                    className={cn(
                      "rounded-xl border p-2.5",
                      hit
                        ? "border-emerald-400/25 bg-emerald-400/10"
                        : "border-white/10 bg-black/10",
                    )}
                  >
                    <p className={cn("text-[10px]", hit ? "text-emerald-300" : "text-slate-500")}>
                      TP{targetNumber}
                      {hit && <CheckCircle2 className="ml-1 inline h-3 w-3" />}
                    </p>
                    <p className="mt-1 font-mono text-xs">{formatNumber(target, 6)}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {signal.freshness && (
              <>
                <Badge variant="outline" className={freshnessTone(signal.freshness.fiveMinute?.fresh)}>
                  {t.feed5m} · {formatNumber(signal.freshness.fiveMinute?.ageMinutes, 1)}m
                </Badge>
                <Badge variant="outline" className={freshnessTone(signal.freshness.fifteenMinute?.fresh)}>
                  {t.feed15m} · {formatNumber(signal.freshness.fifteenMinute?.ageMinutes, 1)}m
                </Badge>
                <Badge
                  variant="outline"
                  className={freshnessTone(signal.freshness.bothFresh)}
                >
                  {signal.freshness.bothFresh ? t.dataFresh : t.dataStale}
                </Badge>
              </>
            )}
            {signal.breakevenActivated && (
              <Badge variant="outline" className="border-sky-400/25 bg-sky-400/10 text-sky-300">
                {t.breakeven}: {t.activeBreakeven}
              </Badge>
            )}
          </div>

          <div className="grid gap-1 text-[11px] text-slate-500 sm:grid-cols-3">
            <span>{t.publishedAt}: {formatDate(signal.publishedAt, language)}</span>
            <span>{t.acceptedAt}: {formatDate(signal.acceptedAt, language)}</span>
            <span>{t.lastChecked}: {formatDate(signal.lastCheckedAt, language)}</span>
          </div>
        </div>

        {ownSizing && (
          <div className="border-b border-white/10 bg-black/15 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Calculator className="h-4 w-4 text-amber-300" />
              <p className="text-sm font-medium">{t.sizing}</p>
            </div>
            {!ownSizing.available ? (
              <div className="flex gap-2 rounded-xl border border-slate-400/15 bg-white/[0.025] p-3 text-xs leading-5 text-slate-400">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
                <span>{t.sizingUnavailable}</span>
              </div>
            ) : (
              <>
                {ownSizing.minimumLotWarning && (
                  <div className="mb-3 flex gap-2 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] p-3 text-xs leading-5 text-rose-200">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{t.minimumLotWarning}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {[
                    [t.riskAmount, formatMoney(ownSizing.riskAmount, ownSizing.accountCurrency, language)],
                    [t.mathLot, formatNumber(ownSizing.mathematicalLot, 4)],
                    [t.brokerLot, formatNumber(ownSizing.brokerStepLot, 4)],
                    [
                      t.lossAtMinLot,
                      formatMoney(ownSizing.lossAtMinimumLot, ownSizing.accountCurrency, language),
                    ],
                    [
                      t.margin,
                      formatMoney(ownSizing.estimatedMargin, ownSizing.marginCurrency, language),
                    ],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-white/[0.025] p-2.5">
                      <p className="text-[10px] text-slate-500">{label}</p>
                      <p className="mt-1 text-xs font-medium">{value}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[11px] leading-5 text-slate-500">
                  {t.specification}: {ownSizing.brokerSymbol || ownSizing.symbol || "MT5"}
                  {" · "}min {formatNumber(ownSizing.volumeMin, 4)}
                  {" · "}step {formatNumber(ownSizing.volumeStep, 4)}
                  {" · "}{formatDate(ownSizing.specificationUpdatedAt, language)}
                  {ownSizing.methodologyVersion ? ` · ${ownSizing.methodologyVersion}` : ""}
                </p>
              </>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex items-start gap-2 text-xs text-slate-400">
            <Clock3 className="h-3.5 w-3.5" />
            <span className="space-y-1">
              <span className="block">{t.validUntil}: {formatDate(signal.validUntil, language)}</span>
              <span className="block text-amber-200/80">
                {t.tradeExpiresAt}: {formatDate(signal.tradeExpiresAt, language)}
              </span>
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={sizingLoading}
              onClick={() => onCalculate(signal.signalId)}
              className="border-amber-300/20 bg-amber-300/[0.06] text-amber-200 hover:bg-amber-300/10 hover:text-amber-100"
            >
              <Calculator className="mr-1.5 h-3.5 w-3.5" />
              {t.sizeScenario}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRefresh(signal.signalId)}
              className="text-slate-300 hover:bg-white/5 hover:text-white"
            >
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
              {t.refresh}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

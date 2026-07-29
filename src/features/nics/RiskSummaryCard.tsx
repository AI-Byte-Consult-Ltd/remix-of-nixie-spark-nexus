import { AlertTriangle, Link2, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Translation } from "./i18n";
import type { RiskSummary } from "./types";
import { formatNumber } from "./utils";

interface RiskSummaryCardProps {
  summary: RiskSummary;
  t: Translation;
}

const RiskBar = ({
  value,
  limit,
  warning,
}: {
  value: number;
  limit: number;
  warning: boolean;
}) => {
  const width = Math.min(100, limit > 0 ? (value / limit) * 100 : 0);

  return (
    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]">
      <div
        className={cn("h-full rounded-full", warning ? "bg-rose-400" : "bg-emerald-400")}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};

export const RiskSummaryCard = ({ summary, t }: RiskSummaryCardProps) => {
  const groups = Object.entries(summary.byCorrelationGroup ?? {}).sort(
    ([, left], [, right]) => right.plannedRiskPercent - left.plannedRiskPercent,
  );

  return (
    <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between gap-3 text-base">
          <span>{t.plannedRisk}</span>
          <Badge
            className={cn(
              "border-0",
              summary.totalLimitExceeded
                ? "bg-rose-400/15 text-rose-300"
                : "bg-emerald-400/10 text-emerald-300",
            )}
          >
            {summary.totalLimitExceeded ? (
              <AlertTriangle className="mr-1 h-3 w-3" />
            ) : (
              <ShieldCheck className="mr-1 h-3 w-3" />
            )}
            {summary.totalLimitExceeded ? t.aboveLimit : t.withinLimit}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-2xl font-semibold">
                {formatNumber(summary.plannedTotalRiskPercent, 2)}%
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {summary.activeScenarioCount} · {t.active.toLowerCase()}
              </p>
            </div>
            <p className="text-xs text-slate-500">
              max {formatNumber(summary.maxTotalRiskPercent, 2)}%
            </p>
          </div>
          <RiskBar
            value={summary.plannedTotalRiskPercent}
            limit={summary.maxTotalRiskPercent}
            warning={summary.totalLimitExceeded}
          />
        </div>

        <div>
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium">
                <Link2 className="h-4 w-4 text-sky-300" />
                {t.correlatedExposure}
              </p>
              <p className="mt-2 text-xl font-semibold">
                {formatNumber(summary.largestCorrelatedRiskPercent, 2)}%
              </p>
            </div>
            <p className="text-xs text-slate-500">
              max {formatNumber(summary.maxCorrelatedRiskPercent, 2)}%
            </p>
          </div>
          <RiskBar
            value={summary.largestCorrelatedRiskPercent}
            limit={summary.maxCorrelatedRiskPercent}
            warning={summary.correlationLimitExceeded}
          />
        </div>

        {groups.length > 0 && (
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-wider text-slate-500">
              {t.correlationGroups}
            </p>
            <div className="flex flex-wrap gap-2">
              {groups.map(([group, block]) => (
                <Badge key={group} variant="outline" className="border-white/10 text-slate-300">
                  {group.replace("_", " ")} · {formatNumber(block.plannedRiskPercent, 2)}%
                </Badge>
              ))}
            </div>
          </div>
        )}

        <p className="text-[11px] leading-5 text-slate-500">{t.riskBasis}</p>
      </CardContent>
    </Card>
  );
};

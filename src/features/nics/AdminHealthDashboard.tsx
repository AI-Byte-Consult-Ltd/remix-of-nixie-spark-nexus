import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Cloud,
  Database,
  Radio,
  Send,
  Server,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Translation } from "./i18n";
import type { AdminHealth, AppLanguage } from "./types";
import { formatDate, formatNumber } from "./utils";

interface AdminHealthDashboardProps {
  health: AdminHealth;
  language: AppLanguage;
  t: Translation;
}

const statusStyle = (status: string) => {
  if (status === "HEALTHY") {
    return {
      icon: CheckCircle2,
      badge: "bg-emerald-400/10 text-emerald-300",
      ring: "border-emerald-300/20",
    };
  }

  if (status === "OFFLINE") {
    return {
      icon: AlertTriangle,
      badge: "bg-rose-400/10 text-rose-300",
      ring: "border-rose-300/20",
    };
  }

  return {
    icon: AlertTriangle,
    badge: "bg-amber-400/10 text-amber-300",
    ring: "border-amber-300/20",
  };
};

export const AdminHealthDashboard = ({
  health,
  language,
  t,
}: AdminHealthDashboardProps) => {
  const status = String(health.overallStatus ?? "OFFLINE").toUpperCase();
  const style = statusStyle(status);
  const StatusIcon = style.icon;
  const statusLabel =
    status === "HEALTHY"
      ? t.healthy
      : status === "OFFLINE"
        ? t.offline
        : t.degraded;

  return (
    <section className="space-y-4">
      <div
        className={cn(
          "overflow-hidden rounded-[28px] border bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.18),transparent_42%),linear-gradient(145deg,#141923,#0b0d13)] p-5",
          style.ring,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-sky-300/80">
              {t.systemHealth}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <StatusIcon className="h-7 w-7 text-sky-300" />
              <p className="text-2xl font-semibold">{statusLabel}</p>
            </div>
          </div>
          <Badge className={cn("border-0", style.badge)}>{status}</Badge>
        </div>
        <p className="mt-5 text-xs text-slate-500">
          {t.updated}: {formatDate(health.checkedAt, language, true)}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between gap-3 text-base">
              <span className="flex items-center gap-2">
                <Server className="h-4 w-4 text-sky-300" />
                {t.alibabaVps}
              </span>
              <Badge
                className={cn(
                  "border-0",
                  health.alibaba.online
                    ? "bg-emerald-400/10 text-emerald-300"
                    : "bg-rose-400/10 text-rose-300",
                )}
              >
                {health.alibaba.online ? t.healthy : t.offline}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {[
              [t.mt5Heartbeat, `${formatNumber(health.alibaba.ageSeconds ?? 0, 1)}s`],
              [t.sourceInstance, health.alibaba.sourceInstance || "—"],
              [t.bridgeVersion, health.alibaba.bridgeVersion || "—"],
              [t.brokerServer, health.alibaba.accountServer || "—"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between gap-4">
                <span className="text-slate-500">{label}</span>
                <span className="text-right text-slate-200">{value}</span>
              </div>
            ))}
            <div className="space-y-2 border-t border-white/10 pt-3">
              {health.alibaba.symbols.map((symbol) => (
                <div key={symbol.symbol} className="flex items-center justify-between gap-3 text-xs">
                  <span>{symbol.brokerSymbol || symbol.symbol}</span>
                  <span className="text-slate-500">
                    {formatNumber(symbol.ageSeconds ?? 0, 1)}s
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between gap-3 text-base">
              <span className="flex items-center gap-2">
                <Database className="h-4 w-4 text-sky-300" />
                {t.brokerSpecs}
              </span>
              <Badge
                className={cn(
                  "border-0",
                  health.specifications.allComplete
                    ? "bg-emerald-400/10 text-emerald-300"
                    : "bg-amber-400/10 text-amber-300",
                )}
              >
                {health.specifications.complete}/{health.specifications.total}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {health.specifications.symbols.map((symbol) => (
              <div
                key={symbol.symbol}
                className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/10 p-3"
              >
                <div>
                  <p className="text-sm">{symbol.brokerSymbol || symbol.symbol}</p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    {formatDate(symbol.updatedAt, language, true)}
                  </p>
                </div>
                <Badge
                  className={cn(
                    "border-0",
                    symbol.complete
                      ? "bg-emerald-400/10 text-emerald-300"
                      : "bg-amber-400/10 text-amber-300",
                  )}
                >
                  {symbol.complete ? t.complete : t.degraded}
                </Badge>
              </div>
            ))}
            {!health.specifications.allComplete && (
              <p className="text-xs leading-5 text-amber-200/80">
                {t.requiresBridgeUpgrade}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          {
            icon: Activity,
            title: t.coreScan,
            value: formatDate(health.core.lastScanAt, language, true),
            caption: health.core.runId || "—",
          },
          {
            icon: Radio,
            title: t.personalDelivery,
            value: `${health.delivery.failures24h + health.delivery.lifecycleFailures24h} · ${t.failures24h}`,
            caption: `${t.lastSeen}: ${formatDate(health.delivery.lastLifecycleAt, language, true)}`,
          },
          {
            icon: Send,
            title: t.publicChannels,
            value: `${health.channels.sentToday} · ${t.sentToday}`,
            caption: `${t.failures24h}: ${health.channels.failuresToday}`,
          },
        ].map(({ icon: Icon, title, value, caption }) => (
          <Card key={title} className="border-white/10 bg-white/[0.045] text-white shadow-none">
            <CardContent className="p-4">
              <Icon className="h-4 w-4 text-sky-300" />
              <p className="mt-4 text-sm font-medium">{title}</p>
              <p className="mt-2 text-xs text-slate-300">{value}</p>
              <p className="mt-2 text-[11px] leading-4 text-slate-500">{caption}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-white/10 bg-white/[0.035] text-white shadow-none">
        <CardContent className="flex gap-3 p-4">
          <Cloud className="mt-0.5 h-4 w-4 shrink-0 text-sky-300" />
          <p className="text-xs leading-5 text-slate-400">{t.channelPolicy}</p>
        </CardContent>
      </Card>
    </section>
  );
};

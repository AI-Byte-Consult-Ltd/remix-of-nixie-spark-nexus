import type { ReactNode } from "react";
import { Inbox, Radar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Translation } from "./i18n";
import type { AppLanguage, RequestedSignalRow, SignalRow } from "./types";
import { formatDate, formatNumber, signedR } from "./utils";

/*
 * 2026-11-11: "Requested signals". Every signal the user ordered (in the
 * app or with the bot's button) over 30 days, in every state. One data
 * model with Telegram: [07 APP] reads signal_deliveries, so a signal shows
 * here as soon as it is stored for the user, before or without Telegram,
 * and accept / decline here or in Telegram is the same decision.
 * A signal that is still open is drawn with the full SignalCard (accept,
 * decline, position size); the rest are compact rows with their outcome.
 */

const CLOSED = new Set(["STOP_LOSS", "BREAKEVEN", "TP4_COMPLETE", "TIME_EXIT"]);

type Tone = "amber" | "emerald" | "rose" | "slate";

const stateOf = (row: RequestedSignalRow, t: Translation): { label: string; tone: Tone } => {
  const decision = String(row.userDecision ?? "").toUpperCase();
  const status = String(row.status ?? "").toUpperCase();
  if (CLOSED.has(status)) {
    const r = Number(row.realizedR);
    return {
      label: `${t.stClosed}${Number.isFinite(r) ? ` · ${signedR(r)}` : ""}`,
      tone: r > 0 ? "emerald" : r < 0 ? "rose" : "slate",
    };
  }
  if (decision === "DECLINED") return { label: t.stDeclined, tone: "slate" };
  if (decision === "ACCEPTED") return { label: t.stAccepted, tone: "emerald" };
  const windowOpen = !row.validUntil || new Date(row.validUntil).getTime() > Date.now();
  if (decision === "PENDING" && status === "OPEN" && windowOpen) return { label: t.stWaiting, tone: "amber" };
  return { label: t.stExpired, tone: "slate" };
};

const toneClass: Record<Tone, string> = {
  amber: "border-amber-300/40 bg-amber-300/10 text-amber-200",
  emerald: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  rose: "border-rose-400/40 bg-rose-400/10 text-rose-300",
  slate: "border-white/15 bg-white/[0.04] text-slate-400",
};

interface RequestedSignalsPanelProps {
  rows: RequestedSignalRow[];
  activeSignals: SignalRow[];
  t: Translation;
  language: AppLanguage;
  renderSignal: (signal: SignalRow) => ReactNode;
  onOrder: () => void;
}

export const RequestedSignalsPanel = ({
  rows,
  activeSignals,
  t,
  language,
  renderSignal,
  onOrder,
}: RequestedSignalsPanelProps) => {
  const active = new Map(activeSignals.map((signal) => [signal.signalId, signal]));

  return (
    <section className="space-y-3">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-2xl">
          <h1 className="text-xl font-semibold">{t.requested}</h1>
          <p className="mt-1 text-xs leading-5 text-slate-500">{t.requestedLead}</p>
        </div>
        <Button size="sm" onClick={onOrder} className="bg-amber-400 text-black hover:bg-amber-300">
          <Radar className="mr-1.5 h-4 w-4" />
          {t.request}
        </Button>
      </div>

      {rows.length === 0 && (
        <Card className="border-dashed border-white/10 bg-white/[0.025] text-white">
          <CardContent className="flex flex-col items-center gap-2 p-8 text-center text-sm text-slate-500">
            <Inbox className="h-5 w-5" />
            {t.requestedEmpty}
          </CardContent>
        </Card>
      )}

      {rows.map((row) => {
        const live = active.get(row.signalId);
        const weak = String(row.setupQuality ?? "").toUpperCase() === "WEAK";
        const failedTelegram = String(row.deliveryStatus ?? "").toUpperCase() === "FAILED";
        if (live) {
          return (
            <div key={row.signalId} className="space-y-1.5">
              {(weak || failedTelegram) && (
                <div className="flex flex-wrap gap-1.5 px-1">
                  {weak && (
                    <Badge variant="outline" className={toneClass.amber}>
                      {t.notStrong}
                    </Badge>
                  )}
                  {failedTelegram && (
                    <Badge variant="outline" className={toneClass.slate}>
                      {t.telegramFailed}
                    </Badge>
                  )}
                </div>
              )}
              {renderSignal(live)}
            </div>
          );
        }
        const state = stateOf(row, t);
        return (
          <Card key={row.signalId} className="border-white/10 bg-white/[0.025] text-white">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{row.label || row.symbol}</span>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      row.direction === "LONG" ? "text-emerald-300" : "text-rose-300",
                    )}
                  >
                    {row.direction}
                  </span>
                  {weak && (
                    <Badge variant="outline" className={cn("text-[10px]", toneClass.amber)}>
                      {t.notStrong}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {formatDate(row.deliveredAt ?? row.createdAt, language)}
                  {" · "}
                  {t.entryLabel} {formatNumber(row.entryLow, 5)}–{formatNumber(row.entryHigh, 5)}
                </p>
              </div>
              <Badge variant="outline" className={cn("whitespace-nowrap", toneClass[state.tone])}>
                {state.label}
              </Badge>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
};

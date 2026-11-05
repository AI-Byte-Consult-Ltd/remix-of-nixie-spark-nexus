import { CheckCircle2, Clock3, ExternalLink, Loader2, Radar, ScanSearch, XCircle } from "lucide-react";
import { BROKER_REFERRAL_URL, openExternal } from "./externalLinks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Translation } from "./i18n";
import type { MarketRow } from "./types";

/*
 * "Order a signal" screen: analysis of one instrument (item 4) and an
 * extra scan of every market in the user's access (item 5). Both run the
 * same NICS engine as the bot's "Get signal" button, through [07 APP].
 */

export type RequestPhase = "sending" | "waiting" | "done" | "no_result" | "rejected" | "failed";

export interface RequestState {
  key: string;
  label: string;
  phase: RequestPhase;
  status?: string;
}

interface SignalRequestPanelProps {
  markets: MarketRow[];
  t: Translation;
  request: RequestState | null;
  onRequest: (scope: "instrument" | "scan", market?: string, symbol?: string, label?: string) => void;
  onOpenSignals: () => void;
}

export const requestStatusText = (t: Translation, state: RequestState): string => {
  if (state.phase === "sending") return t.requestWaiting;
  if (state.phase === "waiting") return `${t.requestQueued} ${t.requestWaiting}`;
  if (state.phase === "done") return t.requestDone;
  if (state.phase === "no_result") return t.requestNoResult;
  if (state.phase === "failed") return t.requestFailed;
  switch (state.status) {
    case "TOO_SOON":
      return t.requestTooSoon;
    case "NO_ACCESS":
      return t.requestNoAccess;
    case "MARKET_NOT_INCLUDED":
      return t.requestNotIncluded;
    case "MARKET_CLOSED":
      return t.requestClosed;
    default:
      return t.requestInvalid;
  }
};

export const RequestStatusBanner = ({
  state,
  t,
  onOpenSignals,
}: {
  state: RequestState;
  t: Translation;
  onOpenSignals: () => void;
}) => {
  const busy = state.phase === "sending" || state.phase === "waiting";
  const good = state.phase === "done";
  const bad = state.phase === "rejected" || state.phase === "failed";
  const Icon = busy ? Loader2 : good ? CheckCircle2 : bad ? XCircle : Clock3;
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3",
        good
          ? "border-emerald-400/25 bg-emerald-400/[0.07]"
          : bad
            ? "border-rose-400/25 bg-rose-400/[0.07]"
            : "border-amber-300/25 bg-amber-300/[0.06]",
      )}
      role="status"
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", busy && "animate-spin", good ? "text-emerald-300" : bad ? "text-rose-300" : "text-amber-300")} />
        <div>
          <p className="text-sm font-medium">{state.label}</p>
          <p className="mt-0.5 text-xs leading-5 text-slate-300">{requestStatusText(t, state)}</p>
        </div>
      </div>
      {good && (
        <Button size="sm" onClick={onOpenSignals} className="bg-emerald-400 text-black hover:bg-emerald-300">
          {t.openSignals}
        </Button>
      )}
    </div>
  );
};

export const SignalRequestPanel = ({ markets, t, request, onRequest, onOpenSignals }: SignalRequestPanelProps) => {
  const busy = request?.phase === "sending" || request?.phase === "waiting";

  return (
    <section className="space-y-4">
      <div className="rounded-[28px] border border-amber-300/20 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_45%),linear-gradient(145deg,#151923,#0b0d13)] p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-300/10 text-amber-300">
            <Radar className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold">{t.request}</h1>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{t.requestLead}</p>
      </div>

      {request && <RequestStatusBanner state={request} t={t} onOpenSignals={onOpenSignals} />}

      <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="flex items-start gap-3">
            <ScanSearch className="mt-0.5 h-5 w-5 text-sky-300" />
            <div>
              <p className="font-medium">{t.extraScan}</p>
              <p className="mt-1 max-w-xl text-xs leading-5 text-slate-400">{t.extraScanLead}</p>
            </div>
          </div>
          <Button
            disabled={busy}
            onClick={() => onRequest("scan", undefined, undefined, t.extraScan)}
            className="bg-sky-400 text-black hover:bg-sky-300"
          >
            {request?.key === "scan" && busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanSearch className="mr-2 h-4 w-4" />}
            {t.runScan}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-2">
        {markets.map((market) => (
          <Card key={market.key} className="border-white/10 bg-white/[0.045] text-white shadow-none">
            <CardContent className="p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="font-medium">{market.label}</p>
                {market.selected && (
                  <Badge variant="outline" className="border-amber-300/30 text-amber-300">
                    {t.subscribed}
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                {(market.instruments ?? market.symbols.map((symbol) => ({ symbol, label: symbol, open: market.open, brokerSymbol: null as string | null }))).map((item) => {
                  const key = `${market.key}:${item.symbol}`;
                  return (
                    <div key={key} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/10 px-3 py-2">
                      <div className="flex items-center gap-2">
                        <span className={cn("h-2 w-2 rounded-full", item.open ? "bg-emerald-400" : "bg-slate-600")} />
                        <span className="text-sm">{item.label}</span>
                        {item.brokerSymbol && item.brokerSymbol !== item.label && (
                          <span className="text-[11px] text-slate-500" title={t.brokerSymbolHint}>
                            {item.brokerSymbol}
                          </span>
                        )}
                        {!item.open && <span className="text-[11px] text-slate-500">{t.closedShort}</span>}
                      </div>
                      <div className="flex items-center gap-1">
                      {BROKER_REFERRAL_URL && (
                        <Button
                          size="sm"
                          variant="ghost"
                          title={`${t.openAtBroker}: ${item.brokerSymbol || item.label}`}
                          aria-label={t.openAtBroker}
                          onClick={() => openExternal(BROKER_REFERRAL_URL)}
                          className="h-8 px-2 text-sky-300 hover:bg-sky-300/10 hover:text-sky-200"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={busy || !item.open}
                        onClick={() => onRequest("instrument", market.key, item.symbol, item.label)}
                        className="h-8 text-amber-200 hover:bg-amber-300/10 hover:text-amber-100"
                      >
                        {request?.key === key && busy ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Radar className="mr-1.5 h-3.5 w-3.5" />}
                        {t.analyse}
                      </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

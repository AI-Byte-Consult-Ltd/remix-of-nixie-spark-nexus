import { useEffect, useState } from "react";
import type { TradeRow } from "@/lib/trackRecordMetrics";

export type PeriodStats = {
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

// 2026-10-28, owner's instruction: WEAK signals are no longer delivered
// automatically and are excluded from every statistic, so the endpoint only
// returns signals that cleared the quality gate. "overall" is kept by the API
// for older clients and is now identical to "confirmed"; the site shows only
// "confirmed".
export type TieredPeriodStats = {
  confirmed: PeriodStats;
  overall?: PeriodStats;
};

export type PerformanceResponse = {
  product: string;
  verified: boolean;
  source: string;
  generatedAt: string;
  performance: Record<"7d" | "30d" | "90d" | "all", TieredPeriodStats>;
  // Since 2026-11-04: every closed gated signal, oldest first, as
  // [closedAtEpochSeconds, symbol, assetClass, realizedR]. Source for the
  // equity curve, drawdown, per-instrument table and calendar periods.
  tradeFields?: string[];
  trades?: TradeRow[];
};

const ENDPOINT = "https://n8n.aibyteconsult.com/webhook/nics-public-performance";

// One request per page view, shared by every component that shows the track
// record (the hero strip and the full Verified Track Record section).
let request: Promise<PerformanceResponse> | null = null;
const loadPerformance = () => {
  if (!request) {
    request = fetch(ENDPOINT)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .catch((error) => {
        request = null;
        throw error;
      });
  }
  return request;
};

export const usePublicPerformance = () => {
  const [data, setData] = useState<PerformanceResponse | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    loadPerformance()
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  // A failed request is not cached (see loadPerformance), so a retry asks the
  // endpoint again.
  const retry = () => {
    setError(false);
    setAttempt((n) => n + 1);
  };

  return { data, error, retry };
};

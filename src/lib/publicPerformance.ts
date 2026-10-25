import { useEffect, useState } from "react";

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

// 2026-10-10, owner's instruction: STRONG/RELAXED ("confirmed") and WEAK
// signals used to be blended into one number, which diluted the real gated
// track record. Each tier now carries its own full stats; "overall" (the
// old blended figure) is kept too, shown smaller, never shown alone.
export type TieredPeriodStats = {
  confirmed: PeriodStats;
  weak: PeriodStats;
  overall: PeriodStats;
};

export type PerformanceResponse = {
  product: string;
  verified: boolean;
  source: string;
  generatedAt: string;
  performance: Record<"7d" | "30d" | "90d" | "all", TieredPeriodStats>;
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
  }, []);

  return { data, error };
};

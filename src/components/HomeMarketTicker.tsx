import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, Circle } from "lucide-react";

type Quote = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  currency: string;
};

const REFRESH_MS = 15_000;

function formatPrice(q: Quote): string {
  const abs = Math.abs(q.price);
  const digits = abs >= 1000 ? 2 : abs >= 10 ? 2 : abs >= 1 ? 3 : 4;
  return q.price.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/**
 * Home page market ticker — real quotes from our `market-quotes` edge function,
 * refreshed every 15s. Clicking the strip opens the NICS AI Trading page.
 */
const HomeMarketTicker = () => {
  const [items, setItems] = useState<Quote[]>([]);
  const [live, setLive] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("market-quotes");
        if (cancelled) return;
        if (!error && data?.items?.length) {
          setItems(data.items as Quote[]);
          setLive(true);
          setUpdatedAt(Date.now());
        }
      } catch {
        // keep previous data
      }
    };

    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  if (items.length === 0) {
    return (
      <div className="border-y border-border/50 bg-card/40 backdrop-blur">
        <div className="h-11 flex items-center justify-center text-xs text-muted-foreground">
          Loading live market data…
        </div>
      </div>
    );
  }

  // Duplicate the list so the marquee loops seamlessly.
  const loop = [...items, ...items];

  return (
    <Link
      to="/trading"
      aria-label="Open NICS AI Trading"
      className="relative block group border-y border-border/50 bg-card/40 backdrop-blur overflow-hidden"
    >
      <div className="flex items-center">
        {/* Live badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 border-r border-border/50 bg-background/60">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                live ? "bg-green-500" : "bg-muted-foreground"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                live ? "bg-green-500" : "bg-muted-foreground"
              }`}
            />
          </span>
          <span className="text-[10px] font-semibold tracking-wider uppercase text-foreground/80">
            Live
          </span>
        </div>

        {/* Scrolling track */}
        <div className="relative flex-1 overflow-hidden">
          <div
            className="flex whitespace-nowrap animate-marquee group-hover:[animation-play-state:paused]"
            style={{ animationDuration: `${Math.max(30, items.length * 4)}s` }}
          >
            {loop.map((q, i) => {
              const up = q.changePct >= 0;
              return (
                <div
                  key={`${q.symbol}-${i}`}
                  className="flex items-center gap-2 px-4 py-2.5 border-r border-border/30"
                >
                  <span className="text-xs font-semibold text-foreground">
                    {q.name}
                  </span>
                  <span className="text-xs font-mono text-foreground/90">
                    {formatPrice(q)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-0.5 text-[11px] font-medium ${
                      up ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {up ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {up ? "+" : ""}
                    {q.changePct.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trailing hint */}
        <div className="hidden md:flex items-center gap-1 px-3 py-2 border-l border-border/50 bg-background/60 text-[11px] font-medium text-foreground/70 group-hover:text-primary transition-colors">
          NICS AI Trading →
        </div>
      </div>
    </Link>
  );
};

export default HomeMarketTicker;
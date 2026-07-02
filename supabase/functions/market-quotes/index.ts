import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

/**
 * Market quotes aggregator — pulls real-time quotes from Yahoo Finance
 * (public chart endpoint, no API key). Cached 10s in-memory to avoid abuse.
 */

type Quote = {
  symbol: string;   // Yahoo symbol
  name: string;     // Display name
  price: number;
  change: number;   // absolute change
  changePct: number;
  currency: string;
};

const SYMBOLS: { symbol: string; name: string }[] = [
  { symbol: "AAPL", name: "Apple" },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "GOOGL", name: "Alphabet" },
  { symbol: "AMZN", name: "Amazon" },
  { symbol: "META", name: "Meta" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "GC=F", name: "Gold" },
  { symbol: "SI=F", name: "Silver" },
  { symbol: "BTC-USD", name: "Bitcoin" },
  { symbol: "ETH-USD", name: "Ethereum" },
  { symbol: "EURUSD=X", name: "EUR/USD" },
  { symbol: "GBPUSD=X", name: "GBP/USD" },
  { symbol: "USDJPY=X", name: "USD/JPY" },
];

let cache: { at: number; data: Quote[] } | null = null;
const CACHE_MS = 10_000;

async function fetchQuote(symbol: string, name: string): Promise<Quote | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1m&range=1d`;
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AIByteConsultBot/1.0; +https://aibyteconsult.com)",
        Accept: "application/json",
      },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const result = json?.chart?.result?.[0];
    const meta = result?.meta;
    if (!meta) return null;
    const price = Number(meta.regularMarketPrice);
    const prev = Number(meta.chartPreviousClose ?? meta.previousClose);
    if (!isFinite(price) || !isFinite(prev) || prev === 0) return null;
    const change = price - prev;
    const changePct = (change / prev) * 100;
    return {
      symbol,
      name,
      price,
      change,
      changePct,
      currency: meta.currency ?? "USD",
    };
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (cache && Date.now() - cache.at < CACHE_MS) {
      return new Response(
        JSON.stringify({ items: cache.data, cached: true, at: cache.at }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const results = await Promise.all(
      SYMBOLS.map((s) => fetchQuote(s.symbol, s.name)),
    );
    const items = results.filter((q): q is Quote => q !== null);

    if (items.length === 0 && cache) {
      // Upstream flaky — return last known good
      return new Response(
        JSON.stringify({ items: cache.data, cached: true, stale: true, at: cache.at }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    cache = { at: Date.now(), data: items };

    return new Response(
      JSON.stringify({ items, cached: false, at: cache.at }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message, items: [] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
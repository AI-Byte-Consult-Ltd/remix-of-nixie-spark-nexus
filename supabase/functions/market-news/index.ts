import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

type Category = "Forex" | "Gold" | "Crypto";

interface NewsItem {
  id: string;
  title: string;
  source: string;
  category: Category;
  tags: string[];
  url: string;
  publishedAt: number; // ms epoch
}

// ---------- CryptoCompare (no API key required) ----------
async function fetchCrypto(): Promise<NewsItem[]> {
  try {
    const r = await fetch(
      "https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest",
      { headers: { "User-Agent": "NICS-AI-Trading/1.0" } },
    );
    if (!r.ok) return [];
    const j = await r.json();
    const arr: any[] = Array.isArray(j?.Data) ? j.Data : [];
    return arr.slice(0, 20).map((n) => ({
      id: `cc-${n.id}`,
      title: String(n.title ?? "").trim(),
      source: String(n.source_info?.name ?? n.source ?? "CryptoCompare"),
      category: "Crypto" as Category,
      tags: String(n.categories ?? "")
        .split("|")
        .map((t: string) => t.trim())
        .filter(Boolean)
        .slice(0, 4),
      url: String(n.url ?? ""),
      publishedAt: Number(n.published_on ?? 0) * 1000,
    })).filter((n) => n.title && n.url);
  } catch {
    return [];
  }
}

// ---------- Google News RSS (no API key required) ----------
function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function stripCdata(s: string): string {
  const m = s.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  return m ? m[1] : s;
}

function extract(tag: string, xml: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = xml.match(re);
  return m ? decodeEntities(stripCdata(m[1].trim())) : "";
}

async function fetchRss(
  query: string,
  category: Category,
  tags: string[],
): Promise<NewsItem[]> {
  try {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(
      query,
    )}&hl=en-US&gl=US&ceid=US:en`;
    const r = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 NICS-AI-Trading/1.0" },
    });
    if (!r.ok) return [];
    const xml = await r.text();
    const items = xml.match(/<item[\s\S]*?<\/item>/g) ?? [];
    return items.slice(0, 15).map((it, idx) => {
      const title = extract("title", it);
      const link = extract("link", it);
      const pubDate = extract("pubDate", it);
      const source = extract("source", it) || "Google News";
      // title often ends with " - Source"; trim it
      const cleanTitle = title.replace(/\s+-\s+[^-]+$/, "").trim();
      return {
        id: `gn-${category}-${idx}-${link.slice(-20)}`,
        title: cleanTitle || title,
        source,
        category,
        tags,
        url: link,
        publishedAt: pubDate ? new Date(pubDate).getTime() : Date.now(),
      };
    }).filter((n) => n.title && n.url);
  } catch {
    return [];
  }
}

// Simple in-memory cache per isolate — 5 min TTL
let cache: { at: number; data: NewsItem[] } | null = null;
const TTL_MS = 5 * 60 * 1000;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (cache && Date.now() - cache.at < TTL_MS) {
      return new Response(
        JSON.stringify({ items: cache.data, cached: true }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=300",
          },
        },
      );
    }

    const [crypto, forex, gold] = await Promise.all([
      fetchCrypto(),
      fetchRss("forex EURUSD OR GBPUSD OR USDJPY", "Forex", ["Forex"]),
      fetchRss("gold XAUUSD OR \"gold price\"", "Gold", ["XAUUSD", "Gold"]),
    ]);

    const merged = [...crypto, ...forex, ...gold]
      .filter((n) => n.publishedAt > 0)
      .sort((a, b) => b.publishedAt - a.publishedAt)
      .slice(0, 40);

    cache = { at: Date.now(), data: merged };

    return new Response(JSON.stringify({ items: merged, cached: false }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (err) {
    console.error("market-news error", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch news", items: [] }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
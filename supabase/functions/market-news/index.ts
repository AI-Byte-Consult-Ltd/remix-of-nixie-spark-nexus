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
  url: string,
  category: Category,
  tags: string[],
  label: string,
): Promise<NewsItem[]> {
  try {
    const r = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; NICS-AI-Trading/1.0; +https://aibyteconsult.com)",
        Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
      },
      redirect: "follow",
    });
    if (!r.ok) {
      console.warn(`RSS ${label} HTTP ${r.status}`);
      return [];
    }
    const xml = await r.text();
    const items = xml.match(/<item[\s\S]*?<\/item>/g) ?? [];
    console.log(`RSS ${label} items=${items.length} xmlLen=${xml.length}`);
    return items.slice(0, 15).map((it, idx) => {
      const title = extract("title", it);
      let link = extract("link", it);
      if (!link) {
        // Some feeds put the link in <guid> or as an <atom:link href="..."/>
        const guid = extract("guid", it);
        if (/^https?:\/\//.test(guid)) link = guid;
      }
      const pubDate = extract("pubDate", it);
      const source = extract("source", it) || label;
      const cleanTitle = title.replace(/\s+-\s+[^-]+$/, "").trim();
      return {
        id: `rss-${category}-${idx}-${link.slice(-24)}`,
        title: cleanTitle || title,
        source,
        category,
        tags,
        url: link,
        publishedAt: pubDate ? new Date(pubDate).getTime() : Date.now(),
      };
    }).filter((n) => n.title && n.url);
  } catch (e) {
    console.error(`RSS ${label} fetch error`, e);
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
      fetchRss(
        "https://cointelegraph.com/rss",
        "Crypto",
        ["Crypto", "BTC", "ETH"],
        "Cointelegraph",
      ),
      fetchRss(
        "https://www.investing.com/rss/news_1.rss",
        "Forex",
        ["Forex"],
        "Investing.com Forex",
      ),
      fetchRss(
        "https://www.investing.com/rss/news_285.rss",
        "Gold",
        ["XAUUSD", "Gold", "Commodities"],
        "Investing.com Commodities",
      ),
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
import { useEffect, useState } from "react";
import { ExternalLink, Loader2, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Translation } from "./i18n";
import type { AppLanguage } from "./types";
import { openExternal } from "./externalLinks";

/*
 * Alexander's articles from Substack and Medium, read from their RSS feeds
 * by the public n8n endpoint nics-articles (feeds have no CORS, so the
 * browser can't read them directly). New posts show up without a release.
 */

const ARTICLES_URL = "https://n8n.aibyteconsult.com/webhook/nics-articles";

interface Article {
  source: "substack" | "medium" | string;
  title: string;
  url: string;
  summary?: string;
  image?: string | null;
  publishedAt?: string | null;
}

const LOCALES: Record<AppLanguage, string> = { ru: "ru-RU", bg: "bg-BG", en: "en-GB", es: "es-ES" };

export const ArticlesPanel = ({ t, language }: { t: Translation; language: AppLanguage }) => {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(ARTICLES_URL)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((result: { ok?: boolean; articles?: Article[] }) => {
        if (cancelled) return;
        if (!result?.ok || !Array.isArray(result.articles)) throw new Error("bad payload");
        setArticles(result.articles.filter((a) => /^https:\/\//.test(a.url)));
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (value?: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? ""
      : date.toLocaleDateString(LOCALES[language], { day: "numeric", month: "long", year: "numeric" });
  };

  return (
    <section className="space-y-4">
      <div className="rounded-[28px] border border-sky-300/20 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_45%),linear-gradient(145deg,#151923,#0b0d13)] p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-300/10 text-sky-300">
            <Newspaper className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold">{t.articles}</h1>
        </div>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{t.articlesLead}</p>
      </div>

      {!articles && !failed && (
        <div className="flex justify-center py-6 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}
      {failed && <p className="text-sm text-rose-200">{t.articlesError}</p>}
      {articles && articles.length === 0 && <p className="text-sm text-slate-400">{t.articlesEmpty}</p>}

      <div className="grid gap-3 md:grid-cols-2">
        {articles?.map((article) => (
          <Card
            key={article.url}
            className="overflow-hidden border-white/10 bg-white/[0.045] text-white shadow-none"
          >
            <button
              type="button"
              onClick={() => openExternal(article.url)}
              className="block w-full text-left transition hover:bg-white/[0.03]"
            >
              {article.image && (
                <img
                  src={article.image}
                  alt=""
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                  className="h-40 w-full object-cover"
                />
              )}
              <CardContent className="space-y-2 p-4">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <Badge variant="outline" className="border-white/15 capitalize text-slate-300">
                    {article.source === "substack" ? "Substack" : article.source === "medium" ? "Medium" : article.source}
                  </Badge>
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <p className="font-medium leading-6">{article.title}</p>
                {article.summary && <p className="text-xs leading-5 text-slate-400">{article.summary}</p>}
                <span className="inline-flex items-center gap-1 text-xs text-sky-300">
                  {t.readArticle}
                  <ExternalLink className="h-3 w-3" />
                </span>
              </CardContent>
            </button>
          </Card>
        ))}
      </div>
    </section>
  );
};

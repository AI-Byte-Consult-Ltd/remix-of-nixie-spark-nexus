import { useEffect, useState } from "react";
import { ExternalLink, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCabinetOutletContext } from "./CabinetLayout";

/*
 * Trading journal: the latest 10 posts of the NICS Telegram channel, always
 * fresh (n8n [42 PUBLIC] Channel Feed reads the channel's public preview).
 * Russian readers get the Russian channel, everyone else the English one.
 */

const FEED_URL = "https://n8n.aibyteconsult.com/webhook/nics-channel-feed";

interface ChannelPost {
  id: number;
  url: string;
  text: string;
  photo?: string | null;
  publishedAt?: string | null;
}

const MORE: Record<string, { open: string; error: string }> = {
  ru: { open: "Открыть в Telegram", error: "Не удалось загрузить посты канала. Попробуйте позже." },
  bg: { open: "Отвори в Telegram", error: "Публикациите не можаха да се заредят. Опитайте по-късно." },
  es: { open: "Abrir en Telegram", error: "No se pudieron cargar las publicaciones. Inténtalo más tarde." },
  en: { open: "Open in Telegram", error: "Could not load the channel posts. Please try again later." },
};

const CabinetJournal = () => {
  const { t, language } = useCabinetOutletContext();
  const channel = language === "ru" ? "trader_notes_fx" : "TravelTradeBook";
  const channelUrl = `https://t.me/${channel}`;
  const more = MORE[language] ?? MORE.en;
  const [posts, setPosts] = useState<ChannelPost[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setPosts(null);
    setFailed(false);
    fetch(`${FEED_URL}?channel=${channel}`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((result: { ok?: boolean; posts?: ChannelPost[] }) => {
        if (cancelled) return;
        if (!result?.ok || !Array.isArray(result.posts)) throw new Error("bad payload");
        setPosts(result.posts.filter((post) => /^https:\/\/t\.me\//.test(post.url)));
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [channel]);

  const formatDate = (value?: string | null) => {
    if (!value) return "";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? ""
      : date.toLocaleString(language, { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gradient-gold">{t("journalTitle")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("journalLead")}</p>
        </div>
        <Button asChild variant="outline">
          <a href={channelUrl} target="_blank" rel="noopener noreferrer">
            <Send className="mr-2 h-4 w-4" />
            {t("journalOpenChannel")}
          </a>
        </Button>
      </div>

      {!posts && !failed && (
        <div className="flex justify-center py-10 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}
      {failed && <p className="text-sm text-destructive">{more.error}</p>}

      <div className="space-y-4">
        {posts?.map((post) => (
          <Card key={post.id} className="overflow-hidden border-border bg-card">
            {post.photo && (
              <img
                src={post.photo}
                alt=""
                loading="lazy"
                referrerPolicy="no-referrer"
                className="max-h-80 w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}
            <CardContent className="space-y-3 p-5">
              <p className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>
              <p className="whitespace-pre-line text-sm leading-6 text-foreground">{post.text}</p>
              <a
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                {more.open}
                <ExternalLink className="h-3 w-3" />
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CabinetJournal;

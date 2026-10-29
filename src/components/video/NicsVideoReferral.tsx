import { useEffect, useState } from "react";
import { Check, Copy, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Language } from "@/contexts/LanguageContext";
import type { Account } from "@/features/account/account";
import { fetchReferral, type ReferralInfo } from "@/features/referral/videoReferral";

// "Invite a friend" card for a signed-in NICS Video user: their own link and
// how many friends already paid. Bonus rules live in n8n [38 VIDEO] Referrals.
const text = {
  en: {
    title: "Invite a friend: +10 credits",
    body: "Share your link. For every friend who pays for any NICS Video plan, you get 10 credits, that is one more package.",
    copy: "Copy",
    copied: "Copied",
    count: (n: number) => `Friends who paid: ${n}`,
  },
  ru: {
    title: "Пригласите друга: +10 кредитов",
    body: "Поделитесь своей ссылкой. За каждого друга, который оплатит любой тариф NICS Video, вы получите 10 кредитов, это ещё один пакет.",
    copy: "Копировать",
    copied: "Скопировано",
    count: (n: number) => `Оплативших друзей: ${n}`,
  },
  bg: {
    title: "Поканете приятел: +10 кредита",
    body: "Споделете своя линк. За всеки приятел, който плати план в NICS Video, получавате 10 кредита, това е още един пакет.",
    copy: "Копирай",
    copied: "Копирано",
    count: (n: number) => `Приятели, които платиха: ${n}`,
  },
};

const NicsVideoReferral = ({ account, lang }: { account: Account; lang: Language }) => {
  const t = lang === "ru" ? text.ru : lang === "bg" ? text.bg : text.en;
  const [info, setInfo] = useState<ReferralInfo | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    setInfo(null);
    fetchReferral(account.session).then((r) => alive && setInfo(r));
    return () => {
      alive = false;
    };
  }, [account.session]);

  if (!info) return null;
  const prefix = lang === "ru" || lang === "bg" ? `/${lang}` : "";
  const link = `https://aibyteconsult.com${prefix}/nics-video?ref=${info.code}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the link is still selectable */
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-primary/25 bg-card p-5 shadow-card">
      <div className="flex items-center gap-2 font-semibold text-foreground">
        <Gift className="h-5 w-5 text-primary" />
        {t.title}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t.body}</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          readOnly
          value={link}
          onFocus={(e) => e.currentTarget.select()}
          className="min-w-0 flex-1 rounded-full border border-input bg-background px-4 py-2 text-sm"
          aria-label={t.title}
        />
        <Button type="button" variant="outline" className="rounded-full" onClick={copy}>
          {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
          {copied ? t.copied : t.copy}
        </Button>
      </div>
      {info.bonuses > 0 && <p className="mt-2 text-sm text-muted-foreground">{t.count(info.bonuses)}</p>}
    </div>
  );
};

export default NicsVideoReferral;

import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Gift, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";

// n8n [32 WEB] Lead Magnet Funnel: anti-bot checks, saves the lead, emails the
// checklist at once and 3 follow-ups over a week (ru/en/bg, others get en).
const LEAD_MAGNET_URL = "https://n8n.aibyteconsult.com/webhook/lead-magnet";

export type LeadMagnetProduct = "video" | "trader";
type Lang = "en" | "ru" | "bg";

interface Copy {
  badge: string;
  title: string;
  text: string;
  bullets: string[];
  placeholder: string;
  consent: string;
  privacy: string;
  submit: string;
  sending: string;
  success: (email: string) => string;
  errorEmail: string;
  errorConsent: string;
  errorGeneric: string;
}

const common = {
  en: {
    badge: "Free",
    placeholder: "Your email",
    privacy: "Privacy policy",
    submit: "Get the checklist",
    sending: "Sending...",
    success: (email: string) => `Done! The checklist is on its way to ${email}. If you don't see it in a minute, check the Spam folder.`,
    errorEmail: "Please enter a valid email.",
    errorConsent: "Please tick the box so we can send you the checklist.",
    errorGeneric: "Could not send right now. Please try again in a minute.",
  },
  ru: {
    badge: "Бесплатно",
    placeholder: "Ваш email",
    privacy: "Политика конфиденциальности",
    submit: "Получить чек-лист",
    sending: "Отправляем...",
    success: (email: string) => `Готово! Чек-лист уже летит на ${email}. Если письма нет через минуту, загляните в «Спам».`,
    errorEmail: "Введите корректный email.",
    errorConsent: "Отметьте согласие, чтобы мы могли прислать чек-лист.",
    errorGeneric: "Не получилось отправить. Попробуйте ещё раз через минуту.",
  },
  bg: {
    badge: "Безплатно",
    placeholder: "Вашият имейл",
    privacy: "Политика за поверителност",
    submit: "Вземете чек-листа",
    sending: "Изпращаме...",
    success: (email: string) => `Готово! Чек-листът пътува към ${email}. Ако не го видите до минута, проверете папка „Спам“.`,
    errorEmail: "Въведете валиден имейл.",
    errorConsent: "Отбележете съгласието, за да ви изпратим чек-листа.",
    errorGeneric: "Не успяхме да изпратим. Опитайте отново след минута.",
  },
};

const copy: Record<LeadMagnetProduct, Record<Lang, Copy>> = {
  video: {
    en: {
      ...common.en,
      title: "Filming checklist for your phone",
      text: "10 rules that make phone clips turn into a finished video with no manual editing. We email it to you in a minute.",
      bullets: ["How long each clip should be", "Light, angles and movement", "A cover title that works"],
      consent: "I agree to receive the checklist and 3 short emails about NICS Video. Unsubscribe in one click.",
    },
    ru: {
      ...common.ru,
      title: "Чек-лист съёмки на телефон",
      text: "10 правил, по которым клипы с телефона собираются в готовый ролик без ручного монтажа. Пришлём на email за минуту.",
      bullets: ["Какой длины снимать клипы", "Свет, планы и движение", "Заголовок для обложки"],
      consent: "Согласен получить чек-лист и 3 коротких письма о NICS Video. Отписка в один клик.",
    },
    bg: {
      ...common.bg,
      title: "Чек-лист за снимане с телефон",
      text: "10 правила, с които клиповете от телефона стават готово видео без ръчен монтаж. Изпращаме го на имейла ви до минута.",
      bullets: ["Колко дълги да са клиповете", "Светлина, планове и движение", "Заглавие за корицата"],
      consent: "Съгласен съм да получа чек-листа и 3 кратки писма за NICS Video. Отписване с едно кликване.",
    },
  },
  trader: {
    en: {
      ...common.en,
      title: "Risk checklist before trading any signals",
      text: "9 rules that protect your account with any signals, ours or anyone else's. We email it to you in a minute.",
      bullets: ["Position size from the stop", "Daily loss limit in R", "How to read signal statistics"],
      consent: "I agree to receive the checklist and 3 short emails about NICS AI Trader. Unsubscribe in one click.",
    },
    ru: {
      ...common.ru,
      title: "Чек-лист риска перед торговлей по сигналам",
      text: "9 правил, которые защищают депозит с любыми сигналами, нашими или чужими. Пришлём на email за минуту.",
      bullets: ["Размер лота от стопа", "Дневной лимит убытка в R", "Как читать статистику сигналов"],
      consent: "Согласен получить чек-лист и 3 коротких письма о NICS AI Trader. Отписка в один клик.",
    },
    bg: {
      ...common.bg,
      title: "Чек-лист за риска преди търговия по сигнали",
      text: "9 правила, които пазят сметката ви с всякакви сигнали, наши или чужди. Изпращаме го на имейла ви до минута.",
      bullets: ["Размер на лота от стопа", "Дневен лимит на загубата в R", "Как да четете статистиката на сигналите"],
      consent: "Съгласен съм да получа чек-листа и 3 кратки писма за NICS AI Trader. Отписване с едно кликване.",
    },
  },
};

const EMAIL_RE = /^[^\s@,]+@[^\s@,]+\.[a-z]{2,24}$/i;

function leadSource(product: LeadMagnetProduct): string {
  try {
    const utm = new URLSearchParams(window.location.search).get("utm_source");
    if (utm) return `${product}_${utm}`.slice(0, 40);
  } catch {
    // ignore
  }
  return `site_${product}`;
}

const LeadMagnet = ({ product }: { product: LeadMagnetProduct }) => {
  const { language } = useLanguage();
  const lang: Lang = language === "ru" || language === "bg" ? language : "en";
  const c = copy[product][lang];
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [sentTo, setSentTo] = useState("");
  const [error, setError] = useState("");
  const openedAt = useRef(Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) return setError(c.errorEmail);
    if (!consent) return setError(c.errorConsent);
    setError("");
    setStatus("sending");
    try {
      const response = await fetch(LEAD_MAGNET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: value,
          product,
          lang,
          src: leadSource(product),
          consent: true,
          website,
          elapsed_ms: Date.now() - openedAt.current,
        }),
      });
      if (!response.ok) throw new Error(`Lead magnet failed with status ${response.status}`);
      setSentTo(value);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setError(c.errorGeneric);
      setStatus("idle");
    }
  };

  return (
    <section id="checklist" className="py-20 bg-background scroll-mt-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-10 shadow-card">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div className="space-y-4">
              <Badge variant="outline" className="border-primary/40 text-primary">
                <Gift className="mr-2 h-3.5 w-3.5" />
                {c.badge}
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-semibold text-foreground leading-tight">{c.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{c.text}</p>
              <ul className="space-y-2">
                {c.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {status === "done" ? (
              <div role="status" className="rounded-2xl border border-primary/30 bg-background/60 p-6 text-center space-y-3">
                <Mail className="mx-auto h-8 w-8 text-primary" />
                <p className="text-foreground leading-relaxed">{c.success(sentTo)}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="relative space-y-4">
                <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", top: "auto", width: 1, height: 1, overflow: "hidden" }}>
                  <label htmlFor={`lm-website-${product}`}>Website</label>
                  <input id={`lm-website-${product}`} name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                </div>
                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  aria-label={c.placeholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={c.placeholder}
                  disabled={status === "sending"}
                  className="h-12 bg-background border-border focus:border-primary rounded-full px-6"
                />
                <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 accent-[hsl(var(--primary))]"
                  />
                  <span>
                    {c.consent}{" "}
                    <Link to="/privacy" className="underline hover:text-primary">{c.privacy}</Link>
                  </span>
                </label>
                {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
                <Button type="submit" size="lg" disabled={status === "sending"} className="w-full rounded-full bg-gradient-gold text-white font-semibold">
                  {status === "sending" ? c.sending : c.submit}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadMagnet;

import { useEffect, useState } from "react";
import { CheckCircle2, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import SEO from "@/components/SEO";

/*
 * /trial?t=<token>&lang=ru|bg|en|es -- NICS AI Trader card subscription.
 * The bot ([39 TRADER] Card Subscription in n8n) sends a personal link with a
 * one-time token. Revolut needs an e-mail to create a customer, so this page
 * asks for it, shows the exact terms and redirects to Revolut's hosted
 * checkout. Approved by Alexander 2026-11-04: 1.99 EUR for 7 days, then
 * 19.99 EUR every month, cancel any time in the bot. After payment Revolut
 * sends the buyer back here with &done=1.
 *
 * Posts text/plain JSON (no CORS preflight), same as the other site forms.
 */
const ENDPOINT = "https://n8n.aibyteconsult.com/webhook/nics-trader-sub";
const BOT = "https://t.me/nics_ai_bot";

type Lang = "en" | "ru" | "bg" | "es";
type Variation = "trial" | "monthly";

const copy: Record<Lang, {
  titleTrial: string;
  titleMonthly: string;
  points: (v: Variation) => string[];
  emailLabel: string;
  emailHint: string;
  agree: (v: Variation) => string;
  pay: (v: Variation) => string;
  secure: string;
  loading: string;
  doneTitle: string;
  doneText: string;
  backToBot: string;
  expired: string;
  alreadyActive: string;
  errEmail: string;
  errAgree: string;
  errPayment: string;
  noToken: string;
  risk: string;
}> = {
  ru: {
    titleTrial: "7 дней NICS AI Trader за 1,99 €",
    titleMonthly: "Подписка NICS AI Trader за 19,99 € в месяц",
    points: (v) => v === "trial"
      ? ["Сегодня спишется 1,99 €: полный доступ ко всем рынкам на 7 дней.", "Через 7 дней подписка продлится сама: 19,99 € каждый месяц.", "За сутки до первого списания 19,99 € напомним в боте и на e-mail.", "Отменить можно в любой момент одной кнопкой в боте: Меню → Тарифы → Моя подписка. Доступ сохранится до конца оплаченного периода."]
      : ["Сегодня спишется 19,99 €: полный доступ ко всем рынкам на месяц.", "Подписка продлевается сама каждый месяц за 19,99 €.", "Отменить можно в любой момент одной кнопкой в боте: Меню → Тарифы → Моя подписка. Доступ сохранится до конца оплаченного периода."],
    emailLabel: "E-mail для чеков и напоминаний",
    emailHint: "Пишем только о платежах по этой подписке.",
    agree: (v) => v === "trial"
      ? "Я согласен: 1,99 € сейчас, затем 19,99 € каждый месяц, пока я не отменю подписку."
      : "Я согласен: 19,99 € каждый месяц, пока я не отменю подписку.",
    pay: (v) => (v === "trial" ? "Оплатить 1,99 € картой" : "Оплатить 19,99 € картой"),
    secure: "Оплата на защищённой странице Revolut. Данные карты мы не видим и не храним.",
    loading: "Проверяем ссылку…",
    doneTitle: "Спасибо! Оплата обрабатывается",
    doneText: "Через несколько минут бот пришлёт подтверждение и откроет доступ ко всем рынкам.",
    backToBot: "Вернуться в бот",
    expired: "Эта ссылка устарела. Откройте бот и нажмите «Тарифы» ещё раз, бот пришлёт новую.",
    alreadyActive: "У вас уже есть активная подписка. Управлять ей можно в боте: Меню → Тарифы → Моя подписка.",
    errEmail: "Проверьте e-mail.",
    errAgree: "Отметьте согласие с условиями.",
    errPayment: "Не получилось открыть оплату. Попробуйте ещё раз через минуту.",
    noToken: "Ссылка на оплату приходит из Telegram-бота. Откройте бот и нажмите «Тарифы».",
    risk: "Торговля связана с риском потерь. Сигналы не являются инвестиционным советом.",
  },
  bg: {
    titleTrial: "7 дни NICS AI Trader за 1,99 €",
    titleMonthly: "Абонамент NICS AI Trader за 19,99 € на месец",
    points: (v) => v === "trial"
      ? ["Днес се таксуват 1,99 €: пълен достъп до всички пазари за 7 дни.", "След 7 дни абонаментът се подновява сам: 19,99 € всеки месец.", "Ден преди първото плащане от 19,99 € ще ви напомним в бота и по e-mail.", "Можете да откажете по всяко време с един бутон в бота: Меню → Тарифи → Моят абонамент. Достъпът остава до края на платения период."]
      : ["Днес се таксуват 19,99 €: пълен достъп до всички пазари за месец.", "Абонаментът се подновява сам всеки месец за 19,99 €.", "Можете да откажете по всяко време с един бутон в бота: Меню → Тарифи → Моят абонамент. Достъпът остава до края на платения период."],
    emailLabel: "E-mail за касови бележки и напомняния",
    emailHint: "Пишем само за плащанията по този абонамент.",
    agree: (v) => v === "trial"
      ? "Съгласен съм: 1,99 € сега, след това 19,99 € всеки месец, докато не откажа абонамента."
      : "Съгласен съм: 19,99 € всеки месец, докато не откажа абонамента.",
    pay: (v) => (v === "trial" ? "Плати 1,99 € с карта" : "Плати 19,99 € с карта"),
    secure: "Плащането е на защитената страница на Revolut. Не виждаме и не пазим данните на картата.",
    loading: "Проверяваме линка…",
    doneTitle: "Благодарим! Плащането се обработва",
    doneText: "След няколко минути ботът ще изпрати потвърждение и ще отвори достъпа до всички пазари.",
    backToBot: "Обратно към бота",
    expired: "Този линк е изтекъл. Отворете бота и натиснете „Тарифи“ отново, ботът ще изпрати нов.",
    alreadyActive: "Вече имате активен абонамент. Управлявайте го в бота: Меню → Тарифи → Моят абонамент.",
    errEmail: "Проверете e-mail адреса.",
    errAgree: "Отбележете съгласието с условията.",
    errPayment: "Не успяхме да отворим плащането. Опитайте отново след минута.",
    noToken: "Линкът за плащане идва от Telegram бота. Отворете бота и натиснете „Тарифи“.",
    risk: "Търговията е свързана с риск от загуби. Сигналите не са инвестиционен съвет.",
  },
  en: {
    titleTrial: "7 days of NICS AI Trader for €1.99",
    titleMonthly: "NICS AI Trader subscription, €19.99 per month",
    points: (v) => v === "trial"
      ? ["Today you pay €1.99: full access to every market for 7 days.", "After 7 days the subscription renews automatically: €19.99 every month.", "One day before the first €19.99 charge we remind you in the bot and by e-mail.", "Cancel any time with one button in the bot: Menu → Plans → My subscription. Your access stays until the end of the paid period."]
      : ["Today you pay €19.99: full access to every market for a month.", "The subscription renews automatically every month at €19.99.", "Cancel any time with one button in the bot: Menu → Plans → My subscription. Your access stays until the end of the paid period."],
    emailLabel: "E-mail for receipts and reminders",
    emailHint: "We only write about payments for this subscription.",
    agree: (v) => v === "trial"
      ? "I agree: €1.99 now, then €19.99 every month until I cancel."
      : "I agree: €19.99 every month until I cancel.",
    pay: (v) => (v === "trial" ? "Pay €1.99 by card" : "Pay €19.99 by card"),
    secure: "You pay on Revolut's secure page. We never see or store your card details.",
    loading: "Checking your link…",
    doneTitle: "Thank you! Your payment is being processed",
    doneText: "In a few minutes the bot will confirm it and open access to every market.",
    backToBot: "Back to the bot",
    expired: "This link has expired. Open the bot and tap \"Plans\" again to get a new one.",
    alreadyActive: "You already have an active subscription. Manage it in the bot: Menu → Plans → My subscription.",
    errEmail: "Please check the e-mail address.",
    errAgree: "Please confirm that you agree to the terms.",
    errPayment: "Could not open the payment. Please try again in a minute.",
    noToken: "The payment link comes from the Telegram bot. Open the bot and tap \"Plans\".",
    risk: "Trading involves risk of loss. Signals are not investment advice.",
  },
  es: {
    titleTrial: "7 días de NICS AI Trader por 1,99 €",
    titleMonthly: "Suscripción NICS AI Trader, 19,99 € al mes",
    points: (v) => v === "trial"
      ? ["Hoy pagas 1,99 €: acceso completo a todos los mercados durante 7 días.", "Después de 7 días la suscripción se renueva sola: 19,99 € cada mes.", "Un día antes del primer cobro de 19,99 € te avisamos en el bot y por e-mail.", "Cancela cuando quieras con un botón en el bot: Menú → Planes → Mi suscripción. Tu acceso sigue hasta el final del periodo pagado."]
      : ["Hoy pagas 19,99 €: acceso completo a todos los mercados durante un mes.", "La suscripción se renueva sola cada mes por 19,99 €.", "Cancela cuando quieras con un botón en el bot: Menú → Planes → Mi suscripción. Tu acceso sigue hasta el final del periodo pagado."],
    emailLabel: "E-mail para recibos y recordatorios",
    emailHint: "Solo escribimos sobre los pagos de esta suscripción.",
    agree: (v) => v === "trial"
      ? "Acepto: 1,99 € ahora y después 19,99 € cada mes hasta que cancele."
      : "Acepto: 19,99 € cada mes hasta que cancele.",
    pay: (v) => (v === "trial" ? "Pagar 1,99 € con tarjeta" : "Pagar 19,99 € con tarjeta"),
    secure: "Pagas en la página segura de Revolut. Nunca vemos ni guardamos los datos de tu tarjeta.",
    loading: "Comprobando el enlace…",
    doneTitle: "¡Gracias! Estamos procesando el pago",
    doneText: "En unos minutos el bot lo confirmará y abrirá el acceso a todos los mercados.",
    backToBot: "Volver al bot",
    expired: "Este enlace ha caducado. Abre el bot y toca «Planes» otra vez para recibir uno nuevo.",
    alreadyActive: "Ya tienes una suscripción activa. Gestiónala en el bot: Menú → Planes → Mi suscripción.",
    errEmail: "Revisa el e-mail.",
    errAgree: "Confirma que aceptas las condiciones.",
    errPayment: "No se pudo abrir el pago. Inténtalo de nuevo en un minuto.",
    noToken: "El enlace de pago llega desde el bot de Telegram. Abre el bot y toca «Planes».",
    risk: "El trading implica riesgo de pérdidas. Las señales no son asesoramiento de inversión.",
  },
};

const readParams = () => {
  try {
    const p = new URLSearchParams(window.location.search);
    const token = (p.get("t") || "").toLowerCase().replace(/[^a-f0-9]/g, "").slice(0, 64);
    const l = (p.get("lang") || "").toLowerCase();
    const lang: Lang = l === "ru" || l === "bg" || l === "es" ? l : "en";
    return { token, lang, done: p.get("done") === "1" };
  } catch {
    return { token: "", lang: "en" as Lang, done: false };
  }
};

const post = async (body: Record<string, unknown>) => {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=UTF-8" },
    body: JSON.stringify(body),
  });
  return (await res.json()) as { ok: boolean; error?: string; variation?: Variation; language?: string; checkout_url?: string };
};

type Status = "loading" | "form" | "done" | "expired" | "active" | "notoken";

const Trial = () => {
  const [{ token, lang: urlLang, done }] = useState(readParams);
  const [lang, setLang] = useState<Lang>(urlLang);
  const [status, setStatus] = useState<Status>(done ? "done" : token ? "loading" : "notoken");
  const [variation, setVariation] = useState<Variation>("trial");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const c = copy[lang];

  useEffect(() => {
    if (done || !token) return;
    let cancelled = false;
    post({ action: "info", token })
      .then((r) => {
        if (cancelled) return;
        const l = r.language;
        if (l === "ru" || l === "bg" || l === "en" || l === "es") setLang(l);
        if (r.ok) {
          setVariation(r.variation === "monthly" ? "monthly" : "trial");
          setStatus("form");
        } else {
          setStatus(r.error === "already_active" ? "active" : "expired");
        }
      })
      .catch(() => !cancelled && setStatus("expired"));
    return () => {
      cancelled = true;
    };
  }, [done, token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!/^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i.test(email.trim())) {
      setError(c.errEmail);
      return;
    }
    if (!agree) {
      setError(c.errAgree);
      return;
    }
    setBusy(true);
    try {
      const r = await post({ action: "start", token, email: email.trim(), agree: true });
      if (r.ok && r.checkout_url && /^https:\/\//.test(r.checkout_url)) {
        window.location.href = r.checkout_url;
        return;
      }
      if (r.error === "already_active") setStatus("active");
      else if (r.error === "expired" || r.error === "not_found") setStatus("expired");
      else setError(r.error === "email" ? c.errEmail : r.error === "agree" ? c.errAgree : c.errPayment);
    } catch {
      setError(c.errPayment);
    }
    setBusy(false);
  };

  const title = variation === "trial" ? c.titleTrial : c.titleMonthly;

  return (
    <>
      <SEO title={`${title} — AI Byte Consult`} description={c.points(variation)[0]} canonical="https://aibyteconsult.com/trial" htmlLang={lang} noindex />
      <main className="min-h-screen bg-background px-4 py-10">
        <div className="mx-auto flex max-w-md flex-col gap-6">
          {status === "loading" && (
            <p className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" /> {c.loading}
            </p>
          )}

          {(status === "expired" || status === "active" || status === "notoken") && (
            <div className="rounded-2xl border border-primary/25 bg-card p-6 text-center shadow-card">
              <p className="leading-relaxed text-foreground">{status === "active" ? c.alreadyActive : status === "notoken" ? c.noToken : c.expired}</p>
              <a href={BOT} className="mt-5 inline-block rounded-xl bg-gradient-gold px-5 py-3 font-semibold text-white">{c.backToBot}</a>
            </div>
          )}

          {status === "done" && (
            <div className="rounded-2xl border border-primary/25 bg-card p-6 text-center shadow-card">
              <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
              <h1 className="mt-4 text-xl font-semibold text-foreground">{c.doneTitle}</h1>
              <p className="mt-2 leading-relaxed text-muted-foreground">{c.doneText}</p>
              <a href={BOT} className="mt-5 inline-block rounded-xl bg-gradient-gold px-5 py-3 font-semibold text-white">{c.backToBot}</a>
            </div>
          )}

          {status === "form" && (
            <form onSubmit={submit} className="flex flex-col gap-5 rounded-2xl border border-primary/25 bg-card p-6 shadow-card">
              <h1 className="text-2xl font-semibold leading-snug text-foreground">{title}</h1>
              <ul className="flex flex-col gap-3">
                {c.points(variation).map((p) => (
                  <li key={p} className="flex gap-3 text-sm leading-relaxed text-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-foreground">{c.emailLabel}</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border border-primary/25 bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
                />
                <span className="text-xs text-muted-foreground">{c.emailHint}</span>
              </label>

              <label className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-primary" />
                <span>{c.agree(variation)}</span>
              </label>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={busy}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-gold px-5 py-3.5 font-semibold text-white disabled:opacity-60"
              >
                {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <CreditCard className="h-5 w-5" />}
                {c.pay(variation)}
              </button>
              <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{c.secure}</span>
              </p>
            </form>
          )}

          <p className="text-center text-xs leading-relaxed text-muted-foreground">{c.risk}</p>
        </div>
      </main>
    </>
  );
};

export default Trial;

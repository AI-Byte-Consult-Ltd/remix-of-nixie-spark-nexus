import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import type { Language } from "@/contexts/LanguageContext";

// n8n [24 VIDEO] Checkout. Prices are decided server-side from the plan id;
// the amounts shown on the page must match that workflow's PLAN_PRICES.
export const NICS_VIDEO_CHECKOUT_URL = "https://n8n.aibyteconsult.com/webhook/nics-video-checkout";

export type NicsVideoPlanId = "nics_video_demo" | "nics_video_basic" | "nics_video_pro";

export interface CheckoutPlan {
  id: NicsVideoPlanId;
  name: string;
  price: string;
}

interface Props {
  plan: CheckoutPlan | null;
  onClose: () => void;
  lang: Language;
}

const text = {
  en: {
    demoTitle: "Start your free demo",
    demoDesc: "3 days, up to 2 packages. We will email you how to send your footage.",
    payTitle: "Subscribe",
    payDesc: "You will be redirected to a secure Revolut checkout. Charged in EUR.",
    name: "Name",
    email: "Email",
    submitDemo: "Start demo",
    submitPay: "Continue to payment",
    error: "Something went wrong. Please try again or write to info@aibyteconsult.com.",
    demoExists: "A demo has already been started with this email.",
    demoDone: "Your demo is registered. We will email you within one business day with how to send your footage.",
    payOpened: "The Revolut checkout opened in a new tab. After payment we will email you to activate your plan.",
    payLink: "Open checkout again",
    close: "Close",
  },
  ru: {
    demoTitle: "Начать бесплатное демо",
    demoDesc: "3 дня, до 2 пакетов. Мы напишем вам на email, как передать исходники.",
    payTitle: "Оформить подписку",
    payDesc: "Оплата на защищённой странице Revolut, списание в евро.",
    name: "Имя",
    email: "Email",
    submitDemo: "Начать демо",
    submitPay: "Перейти к оплате",
    error: "Что-то пошло не так. Попробуйте ещё раз или напишите на info@aibyteconsult.com.",
    demoExists: "Демо на этот email уже было оформлено.",
    demoDone: "Демо оформлено. В течение рабочего дня мы напишем вам на email, как передать исходники.",
    payOpened: "Страница оплаты Revolut открылась в новой вкладке. После оплаты мы напишем вам на email и активируем тариф.",
    payLink: "Открыть оплату ещё раз",
    close: "Закрыть",
  },
};

const NicsVideoCheckout = ({ plan, onClose, lang }: Props) => {
  const t = lang === "ru" ? text.ru : text.en;
  const isDemo = plan?.id === "nics_video_demo";
  const [form, setForm] = useState({ name: "", email: "", website: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  useEffect(() => {
    if (plan) {
      setBusy(false);
      setError(null);
      setDone(false);
      setCheckoutUrl(null);
    }
  }, [plan]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan || busy) return;
    // Opened synchronously so the popup blocker treats it as user-initiated.
    const tab = isDemo ? null : window.open("about:blank", "_blank");
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(NICS_VIDEO_CHECKOUT_URL, {
        method: "POST",
        // A simple content type avoids a cross-origin preflight, same as callCabinetApi.
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: JSON.stringify({ action: isDemo ? "demo" : "order", plan: plan.id, language: lang, ...form }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; checkout_url?: string } | null;
      if (!res.ok || !data?.ok) {
        tab?.close();
        setError(data?.error === "demo_exists" ? t.demoExists : t.error);
        return;
      }
      if (!isDemo && data.checkout_url) {
        setCheckoutUrl(data.checkout_url);
        if (tab) tab.location.href = data.checkout_url;
        else window.location.href = data.checkout_url;
      }
      setDone(true);
    } catch {
      tab?.close();
      setError(t.error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={!!plan} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isDemo ? t.demoTitle : t.payTitle}
            {plan && !isDemo ? ` · ${plan.name} ${plan.price}` : ""}
          </DialogTitle>
          <DialogDescription>{isDemo ? t.demoDesc : t.payDesc}</DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="space-y-4 text-center py-2">
            <CheckCircle2 className="w-10 h-10 mx-auto text-primary" />
            <p className="text-muted-foreground">{isDemo ? t.demoDone : t.payOpened}</p>
            {checkoutUrl && (
              <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full rounded-full bg-foreground hover:bg-foreground/90 text-background">
                  <CreditCard className="mr-2 w-4 h-4" />
                  {t.payLink}
                </Button>
              </a>
            )}
            <Button variant="outline" className="w-full rounded-full border-2" onClick={onClose}>
              {t.close}
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nv-name">{t.name}</Label>
              <Input id="nv-name" required maxLength={100} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nv-email">{t.email}</Label>
              <Input id="nv-email" type="email" required maxLength={200} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </div>
            {/* Honeypot: hidden from people, bots fill it in. */}
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
              value={form.website}
              onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={busy} className="w-full rounded-full bg-foreground hover:bg-foreground/90 text-background">
              {busy ? <Loader2 className="mr-2 w-4 h-4 animate-spin" /> : !isDemo && <CreditCard className="mr-2 w-4 h-4" />}
              {isDemo ? t.submitDemo : t.submitPay}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NicsVideoCheckout;

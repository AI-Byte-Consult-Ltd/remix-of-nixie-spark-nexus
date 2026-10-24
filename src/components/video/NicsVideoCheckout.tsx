import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import type { Language } from "@/contexts/LanguageContext";
import { readAccount } from "@/features/account/account";

// n8n [24 VIDEO] Checkout. Prices are decided server-side from the plan id;
// the amounts shown on the page must match that workflow's PLAN_PRICES.
export const NICS_VIDEO_CHECKOUT_URL = "https://n8n.aibyteconsult.com/webhook/nics-video-checkout";

export type NicsVideoPlanId = "nics_video_demo" | "nics_video_basic" | "nics_video_pro" | "nics_video_max";

export interface CheckoutPlan {
  id: NicsVideoPlanId;
  name: string;
  price: string;
}

interface Props {
  plan: CheckoutPlan | null;
  onClose: () => void;
  lang: Language;
  // Called with the email once the demo or order went through, so the page can
  // prefill the upload form.
  onStarted?: (email: string) => void;
}

const text = {
  en: {
    demoTitle: "Get 10 free credits",
    demoDesc: "Enough for 1 package, valid 30 days. Upload your footage right on this page.",
    payTitle: "Subscribe",
    payDesc: "You will be redirected to a secure Revolut checkout. Charged in EUR.",
    name: "Name",
    email: "Email",
    submitDemo: "Get credits",
    submitPay: "Continue to payment",
    error: "Something went wrong. Please try again or write to info@aibyteconsult.com.",
    demoExists: "Free credits have already been claimed with this email.",
    demoDone: "Your 10 free credits are active. Upload your footage on this page with the same email.",
    payOpened: "The Revolut checkout opened in a new tab. A few minutes after payment your credits are active: upload your footage on this page with the same email.",
    payLink: "Open checkout again",
    upload: "Upload footage",
    close: "Close",
  },
  ru: {
    demoTitle: "Получить 10 бесплатных кредитов",
    demoDesc: "Хватит на 1 пакет, действуют 30 дней. Исходники загружаются прямо на этой странице.",
    payTitle: "Оформить подписку",
    payDesc: "Оплата на защищённой странице Revolut, списание в евро.",
    name: "Имя",
    email: "Email",
    submitDemo: "Получить кредиты",
    submitPay: "Перейти к оплате",
    error: "Что-то пошло не так. Попробуйте ещё раз или напишите на info@aibyteconsult.com.",
    demoExists: "Бесплатные кредиты на этот email уже были получены.",
    demoDone: "10 бесплатных кредитов активны. Загрузите исходники на этой странице с тем же email.",
    payOpened: "Страница оплаты Revolut открылась в новой вкладке. Через несколько минут после оплаты кредиты активируются: загрузите исходники на этой странице с тем же email.",
    payLink: "Открыть оплату ещё раз",
    upload: "Загрузить исходники",
    close: "Закрыть",
  },
};

const NicsVideoCheckout = ({ plan, onClose, lang, onStarted }: Props) => {
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
      const signedIn = readAccount();
      if (signedIn) setForm((f) => ({ ...f, email: f.email || signedIn.email }));
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
      onStarted?.(form.email.trim());
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
            {isDemo ? (
              <a href="#studio" onClick={onClose} className="block">
                <Button className="w-full rounded-full bg-foreground hover:bg-foreground/90 text-background">{t.upload}</Button>
              </a>
            ) : (
              <Button variant="outline" className="w-full rounded-full border-2" onClick={onClose}>
                {t.close}
              </Button>
            )}
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

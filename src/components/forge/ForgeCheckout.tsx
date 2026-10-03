import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle2, CreditCard, Loader2 } from "lucide-react";
import { DELIVERY_DAYS, fmtEur } from "@/data/forgeCatalog";
import { createOrder, reportPaid } from "@/lib/forgeApi";
import { fill, type ForgeText } from "./forgeI18n";
import type { Language } from "@/contexts/LanguageContext";

export interface PendingOrder {
  kind: "catalog" | "custom";
  itemId?: string;
  itemName: string;
  price: number;
  /** Shipping for this order (catalog pieces can have their own). */
  shipping: number;
  color: string;
  text?: string;
  sizeCm?: number;
  generationId?: string;
  /** Revolut link for price + shipping; empty = not connected yet. */
  revolutUrl: string;
}

interface Props {
  order: PendingOrder | null;
  onClose: () => void;
  t: ForgeText;
  lang: Language;
}

const ForgeCheckout = ({ order, onClose, t, lang }: Props) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", address: "", website: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState<{ ref: string; total: number } | null>(null);
  const [paidSent, setPaidSent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || busy) return;
    setBusy(true);
    setError(false);
    try {
      const res = await createOrder({
        kind: order.kind,
        itemId: order.itemId,
        color: order.color,
        text: order.text,
        sizeCm: order.sizeCm,
        generationId: order.generationId,
        ...form,
        lang,
      });
      setSaved({ ref: res.ref, total: res.total });
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  };

  const markPaid = async () => {
    if (!saved) return;
    try {
      await reportPaid(saved.ref, form.email);
    } catch {
      /* the order is saved either way; the owner still sees it */
    }
    setPaidSent(true);
  };

  const close = () => {
    setSaved(null);
    setPaidSent(false);
    setError(false);
    onClose();
  };

  const total = order ? order.price + order.shipping : 0;

  return (
    <Dialog open={!!order} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {order && !saved && (
          <form onSubmit={submit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{t.checkoutTitle}</DialogTitle>
              <DialogDescription>
                {order.itemName}
                {order.sizeCm ? ` · ${order.sizeCm} cm` : ""}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="forge-name">{t.fName}</Label>
                <Input id="forge-name" required minLength={2} maxLength={80} value={form.name} onChange={set("name")} autoComplete="name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="forge-email">{t.fEmail}</Label>
                <Input id="forge-email" type="email" required maxLength={120} value={form.email} onChange={set("email")} autoComplete="email" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="forge-phone">{t.fPhone}</Label>
                <Input id="forge-phone" type="tel" maxLength={40} value={form.phone} onChange={set("phone")} autoComplete="tel" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="forge-country">{t.fCountry}</Label>
                <Input id="forge-country" required minLength={2} maxLength={60} value={form.country} onChange={set("country")} autoComplete="country-name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="forge-address">{t.fAddress}</Label>
                <Textarea id="forge-address" required minLength={8} maxLength={300} rows={3} value={form.address} onChange={set("address")} autoComplete="street-address" />
              </div>
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={form.website}
                onChange={set("website")}
                className="hidden"
              />
            </div>

            <div className="rounded-xl bg-muted/50 p-4 text-sm space-y-1.5">
              <div className="flex justify-between"><span>{order.itemName}</span><span>€{fmtEur(order.price)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>{t.shipping}</span><span>€{fmtEur(order.shipping)}</span></div>
              <div className="flex justify-between font-semibold text-base pt-1.5 border-t border-border"><span>{t.total}</span><span>€{fmtEur(total)}</span></div>
              <p className="text-muted-foreground pt-1">{fill(t.delivery, { days: DELIVERY_DAYS })}</p>
            </div>

            {error && <p className="text-sm text-destructive">{t.orderError}</p>}

            <Button type="submit" size="lg" disabled={busy} className="w-full rounded-full bg-foreground hover:bg-foreground/90 text-background">
              {busy ? (<><Loader2 className="mr-2 w-4 h-4 animate-spin" />{t.placing}</>) : t.placeOrder}
            </Button>
          </form>
        )}

        {order && saved && (
          <div className="space-y-5 text-center py-2">
            <DialogHeader>
              <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-gold flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <DialogTitle>{fill(t.payTitle, { ref: saved.ref })}</DialogTitle>
              <DialogDescription className="leading-relaxed">
                {order.revolutUrl
                  ? fill(t.payHint, { ref: saved.ref, total: `€${fmtEur(saved.total)}` })
                  : t.payPending}
              </DialogDescription>
            </DialogHeader>

            {order.revolutUrl && !paidSent && (
              <div className="space-y-3">
                <a href={order.revolutUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <Button size="lg" className="w-full rounded-full bg-foreground hover:bg-foreground/90 text-background">
                    <CreditCard className="mr-2 w-4 h-4" />
                    {t.payRevolut} · €{fmtEur(saved.total)}
                  </Button>
                </a>
                <Button variant="outline" size="lg" className="w-full rounded-full border-2" onClick={markPaid}>
                  {t.iPaid}
                </Button>
              </div>
            )}

            {paidSent && <p className="text-sm text-muted-foreground">{t.paidThanks}</p>}

            <Button variant="ghost" onClick={close}>{t.close}</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgeCheckout;

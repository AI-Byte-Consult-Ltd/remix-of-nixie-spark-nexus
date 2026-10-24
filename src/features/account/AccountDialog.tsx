import { type ReactNode, useEffect, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Language } from "@/contexts/LanguageContext";
import { type AccountError, sendCode, signOut, trustEmail, useAccount, validEmail, verifyCode } from "./account";

const copy = {
  en: {
    title: "Sign in",
    text: "Enter your email: we send a 6-digit code to it. You stay signed in on this device.",
    email: "you@example.com",
    sendCode: "Get the code",
    codeSent: (e: string) => `We sent a code to ${e}. It works for 15 minutes; check the spam folder too.`,
    code: "6-digit code",
    verify: "Sign in",
    otherEmail: "Use another email",
    resend: "Send again",
    signedIn: (e: string) => `Signed in as ${e}`,
    notVerified: "Email is not confirmed yet: sign-in by code turns on soon.",
    signOut: "Sign out",
    errors: {
      email: "Enter a valid email.",
      code: "Enter the 6 digits from the email.",
      wrong_code: "Wrong or expired code. Check it or ask for a new one.",
      too_many: "Too many codes for this email. Try again in an hour.",
      session: "Please sign in again.",
      network: "No connection to the server. Try again.",
      mail_unavailable: "",
    } as Record<AccountError, string>,
  },
  ru: {
    title: "Вход",
    text: "Укажите email: пришлём на него 6-значный код. На этом устройстве вход сохранится.",
    email: "you@example.com",
    sendCode: "Получить код",
    codeSent: (e: string) => `Отправили код на ${e}. Он действует 15 минут; загляните и в спам.`,
    code: "Код из 6 цифр",
    verify: "Войти",
    otherEmail: "Другой email",
    resend: "Отправить ещё раз",
    signedIn: (e: string) => `Вы вошли как ${e}`,
    notVerified: "Email пока не подтверждён: вход по коду скоро включится.",
    signOut: "Выйти",
    errors: {
      email: "Введите корректный email.",
      code: "Введите 6 цифр из письма.",
      wrong_code: "Код неверный или устарел. Проверьте его или запросите новый.",
      too_many: "Слишком много кодов на этот email. Попробуйте через час.",
      session: "Войдите заново.",
      network: "Нет связи с сервером. Попробуйте ещё раз.",
      mail_unavailable: "",
    } as Record<AccountError, string>,
  },
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lang: Language;
  // Extra lines under the title, e.g. the credit balance and prices.
  children?: ReactNode;
  onSignedIn?: (email: string) => void;
}

const AccountDialog = ({ open, onOpenChange, lang, children, onSignedIn }: Props) => {
  const t = lang === "ru" ? copy.ru : copy.en;
  const account = useAccount();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setStep("email");
    setEmail(account?.email ?? "");
    setCode("");
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const requestCode = async () => {
    if (!validEmail(email)) return setError(t.errors.email);
    setBusy(true);
    setError(null);
    const r = await sendCode(email, lang);
    setBusy(false);
    if (r.ok) {
      setStep("code");
      setCode("");
      return;
    }
    if (r.error === "mail_unavailable") {
      // Codes cannot be sent yet: keep the old way (email on trust) working.
      trustEmail(email);
      onSignedIn?.(email.trim().toLowerCase());
      return;
    }
    setError(t.errors[r.error ?? "network"]);
  };

  const submitCode = async () => {
    const digits = code.replace(/\D/g, "");
    if (digits.length !== 6) return setError(t.errors.code);
    setBusy(true);
    setError(null);
    const r = await verifyCode(email, digits);
    setBusy(false);
    if (r.ok) onSignedIn?.(email.trim().toLowerCase());
    else setError(t.errors[r.error ?? "network"]);
  };

  // Already signed in with a confirmed email and not switching to another one.
  const nothingToDo = step === "email" && Boolean(account?.session) && account?.email === email.trim().toLowerCase();

  return (
    <Dialog open={open} onOpenChange={(o) => !busy && onOpenChange(o)}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            {t.title}
          </DialogTitle>
          <DialogDescription>{step === "code" ? t.codeSent(email.trim().toLowerCase()) : t.text}</DialogDescription>
        </DialogHeader>
        {children}
        {account && step === "email" && (
          <div className="rounded-lg border border-border/60 p-3 text-sm space-y-2">
            <div className="font-medium break-all">{t.signedIn(account.email)}</div>
            {!account.session && <div className="text-xs text-muted-foreground">{t.notVerified}</div>}
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => signOut()}>
              {t.signOut}
            </Button>
          </div>
        )}
        <form
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (step === "email") requestCode();
            else submitCode();
          }}
        >
          {step === "email" ? (
            <Input type="email" autoFocus value={email} maxLength={200} placeholder={t.email} onChange={(e) => setEmail(e.target.value)} />
          ) : (
            <Input
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              value={code}
              maxLength={6}
              placeholder={t.code}
              className="text-center text-lg tracking-[0.4em] placeholder:tracking-normal placeholder:text-sm"
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex flex-wrap gap-2">
            {!nothingToDo && (
              <Button type="submit" className="rounded-full" disabled={busy}>
                {busy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {step === "email" ? t.sendCode : t.verify}
              </Button>
            )}
            {step === "code" && (
              <>
                <Button type="button" variant="ghost" className="rounded-full" disabled={busy} onClick={requestCode}>
                  {t.resend}
                </Button>
                <Button type="button" variant="ghost" className="rounded-full" disabled={busy} onClick={() => setStep("email")}>
                  {t.otherEmail}
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AccountDialog;

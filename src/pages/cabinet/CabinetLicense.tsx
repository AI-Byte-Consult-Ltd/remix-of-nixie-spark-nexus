import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Copy, Download, Gift, KeyRound, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCabinetOutletContext } from "./CabinetLayout";
import {
  callLicenseApi,
  isDesktopApp,
  licenseStrings,
  type GiftKey,
  type MyKeyResult,
} from "@/features/cabinet/license";

const formatDate = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
};

const CopyButton = ({ value, label, doneLabel }: { value: string; label: string; doneLabel: string }) => {
  const [done, setDone] = useState(false);
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        void navigator.clipboard?.writeText(value).then(() => {
          setDone(true);
          window.setTimeout(() => setDone(false), 2000);
        });
      }}
    >
      {done ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
      {done ? doneLabel : label}
    </Button>
  );
};

// "Windows app license": the subscriber's own key, and for admins the gift
// keys (one month or no expiry). Backend: n8n [39 TRADER] License Keys.
const CabinetLicense = () => {
  const { session, language, logout } = useCabinetOutletContext();
  const s = licenseStrings(language);
  const [mine, setMine] = useState<MyKeyResult | null>(null);
  const [failed, setFailed] = useState(false);
  const [gifts, setGifts] = useState<GiftKey[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [newGift, setNewGift] = useState<GiftKey | null>(null);
  const [adminError, setAdminError] = useState(false);

  const handleError = useCallback(
    (error: unknown) => {
      const code = (error as { code?: string })?.code;
      if (code === "SESSION_INVALID" || code === "SESSION_EXPIRED") logout();
    },
    [logout],
  );

  const loadGifts = useCallback(async () => {
    const result = await callLicenseApi<{ gifts: GiftKey[] }>("admin_list", {}, session);
    setGifts(result.gifts ?? []);
  }, [session]);

  useEffect(() => {
    callLicenseApi<MyKeyResult>("my_key", {}, session)
      .then((result) => {
        setMine(result);
        if (result.isAdmin) void loadGifts().catch(() => setAdminError(true));
      })
      .catch((error) => {
        handleError(error);
        setFailed(true);
      });
  }, [session, loadGifts, handleError]);

  const gift = async (period: "month" | "forever") => {
    setBusy(period);
    setAdminError(false);
    try {
      const result = await callLicenseApi<{ gift: GiftKey | null }>("admin_gift", { period, note }, session);
      setNewGift(result.gift);
      setNote("");
      await loadGifts();
    } catch (error) {
      handleError(error);
      setAdminError(true);
    } finally {
      setBusy(null);
    }
  };

  const revoke = async (id: number) => {
    setBusy(`revoke-${id}`);
    try {
      await callLicenseApi("admin_revoke", { id }, session);
      await loadGifts();
    } catch (error) {
      handleError(error);
      setAdminError(true);
    } finally {
      setBusy(null);
    }
  };

  const giftStatus = (g: GiftKey) => {
    if (g.revoked) return <Badge variant="outline" className="border-rose-400/40 text-rose-400">{s.statusRevoked}</Badge>;
    if (!g.forever && g.expiresAt && new Date(g.expiresAt).getTime() < Date.now())
      return <Badge variant="outline">{s.statusExpired}</Badge>;
    if (g.redeemedAt || g.devices > 0)
      return <Badge variant="outline" className="border-emerald-400/40 text-emerald-500">{s.statusUsed} {g.redeemedBy || ""}</Badge>;
    return <Badge variant="outline">{s.statusActive}</Badge>;
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
          <KeyRound className="h-6 w-6 text-primary" />
          {s.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{s.lead}</p>
      </div>

      {!mine && !failed && (
        <div className="flex justify-center py-8 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}
      {failed && <p className="text-sm text-destructive">{s.error}</p>}

      {mine && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-base">{s.yourKey}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mine.eligible && mine.key ? (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <code className="rounded-lg border border-border bg-muted px-3 py-2 font-mono text-lg tracking-wider text-foreground">
                    {mine.key}
                  </code>
                  <CopyButton value={mine.key} label={s.copy} doneLabel={s.copied} />
                </div>
                <div className="grid gap-1 text-sm text-muted-foreground">
                  <p>
                    {mine.validUntil ? `${s.validUntil} ${formatDate(mine.validUntil)}. ${s.validWhileSub}.` : s.forever}
                  </p>
                  <p>
                    {s.devices}: {mine.devices ?? 0}
                    {mine.isAdmin ? "" : " / 2"}
                  </p>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{s.howTo}</p>
                {!isDesktopApp() && (
                  <div className="space-y-2 border-t border-border pt-4">
                    <Button asChild>
                      <a href="/downloads/NICS-AI-Trader-Setup.exe" download>
                        <Download className="mr-2 h-4 w-4" />
                        {s.download}
                      </a>
                    </Button>
                    <p className="text-xs text-muted-foreground">{s.downloadNote}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">{s.notEligible}</p>
                <Button asChild>
                  <Link to="/cabinet/subscription">{s.buy}</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {mine?.isAdmin && (
        <Card className="border-primary/30 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gift className="h-5 w-5 text-primary" />
              {s.adminTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{s.adminLead}</p>
            <Input value={note} maxLength={120} onChange={(event) => setNote(event.target.value)} placeholder={s.note} />
            <div className="flex flex-wrap gap-2">
              <Button disabled={busy !== null} onClick={() => void gift("month")}>
                {busy === "month" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {s.giftMonth}
              </Button>
              <Button disabled={busy !== null} variant="outline" onClick={() => void gift("forever")}>
                {busy === "forever" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {s.giftForever}
              </Button>
            </div>
            {adminError && <p className="text-sm text-destructive">{s.error}</p>}
            {newGift && (
              <div className="flex flex-wrap items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                <span className="text-sm text-muted-foreground">{s.newKey}:</span>
                <code className="font-mono text-base tracking-wider text-foreground">{newGift.key}</code>
                <CopyButton value={newGift.key} label={s.copy} doneLabel={s.copied} />
                <span className="text-xs text-muted-foreground">
                  {newGift.forever ? s.forever : `${s.monthUntil} ${formatDate(newGift.expiresAt)}`}
                </span>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <p className="text-sm font-medium text-foreground">{s.gifts}</p>
              {gifts.length === 0 && <p className="text-sm text-muted-foreground">{s.noGifts}</p>}
              {gifts.map((g) => (
                <div
                  key={g.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="font-mono text-sm text-foreground">{g.key}</code>
                      {giftStatus(g)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {g.forever ? s.forever : `${s.monthUntil} ${formatDate(g.expiresAt)}`}
                      {g.note ? ` · ${g.note}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <CopyButton value={g.key} label={s.copy} doneLabel={s.copied} />
                    {!g.revoked && (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={busy !== null}
                        onClick={() => void revoke(g.id)}
                        className="text-destructive"
                      >
                        {s.revoke}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CabinetLicense;

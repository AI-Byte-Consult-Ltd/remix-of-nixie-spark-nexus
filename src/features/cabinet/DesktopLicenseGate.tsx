import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { KeyRound, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { licenseStrings, reasonText, type DesktopLicenseState } from "./license";
import type { CabinetLanguage } from "./types";

// Shown in the Windows app instead of the Trader screens until a valid
// license key is on this computer.
export const DesktopLicenseGate = ({
  language,
  state,
  onActivate,
}: {
  language: CabinetLanguage;
  state: DesktopLicenseState;
  onActivate: (key: string) => Promise<string | null>;
}) => {
  const s = licenseStrings(language);
  const [key, setKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState<string | null>(null);

  if (state.status === "checking") {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        {s.checking}
      </div>
    );
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!key.trim()) return;
    setBusy(true);
    setReason(await onActivate(key));
    setBusy(false);
  };

  const message = reasonText(s, reason ?? (state.status === "needed" ? state.reason : null));

  return (
    <div className="mx-auto max-w-lg py-8">
      <Card className="border-primary/30 bg-card">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary">
              <KeyRound className="h-5 w-5" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">{s.gateTitle}</h1>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">{s.gateLead}</p>
          <form onSubmit={(event) => void submit(event)} className="space-y-3">
            <Input
              value={key}
              onChange={(event) => setKey(event.target.value.toUpperCase())}
              placeholder={s.keyPlaceholder}
              autoComplete="off"
              spellCheck={false}
              className="font-mono tracking-wider"
            />
            {message && <p className="text-sm text-destructive">{message}</p>}
            <Button type="submit" disabled={busy || !key.trim()} className="w-full">
              {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {s.activate}
            </Button>
          </form>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/cabinet/license">{s.openLicensePage}</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/cabinet/subscription">{s.buy}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

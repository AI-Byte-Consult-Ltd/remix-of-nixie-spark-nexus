import { FormEvent } from "react";
import { Loader2, Settings2, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Translation } from "./i18n";
import type { RiskProfile } from "./types";

interface RiskProfileFormProps {
  value: RiskProfile;
  t: Translation;
  saving: boolean;
  saved: boolean;
  onChange: (value: RiskProfile) => void;
  onSubmit: (event: FormEvent) => void;
}

export const RiskProfileForm = ({
  value,
  t,
  saving,
  saved,
  onChange,
  onSubmit,
}: RiskProfileFormProps) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-400/10 text-amber-300">
          <WalletCards className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">{t.risk}</h1>
          <p className="text-xs text-slate-500">{t.riskNote}</p>
        </div>
      </div>
    </section>

    <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
      <CardContent className="space-y-5 p-5">
        <div className="grid grid-cols-[1fr_110px] gap-3">
          <div className="space-y-2">
            <Label htmlFor="balance" className="text-xs text-slate-400">
              {t.balance}
            </Label>
            <Input
              id="balance"
              type="number"
              min={1}
              max={1_000_000_000}
              step="0.01"
              inputMode="decimal"
              value={value.accountBalance ?? ""}
              onChange={(event) =>
                onChange({
                  ...value,
                  accountBalance: event.target.value ? Number(event.target.value) : null,
                })
              }
              className="border-white/10 bg-black/20 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-slate-400">{t.currency}</Label>
            <Select
              value={value.accountCurrency}
              onValueChange={(accountCurrency) => onChange({ ...value, accountCurrency })}
            >
              <SelectTrigger className="border-white/10 bg-black/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["EUR", "USD", "GBP", "BGN"].map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="remember-balance" className="text-sm text-slate-300">
              {t.rememberBalance}
            </Label>
            <Switch
              id="remember-balance"
              checked={value.rememberBalance}
              onCheckedChange={(rememberBalance) => onChange({ ...value, rememberBalance })}
            />
          </div>
          <p className="mt-2 text-[11px] leading-5 text-slate-500">{t.privacyBalance}</p>
        </div>

        {[
          { key: "riskPercent", label: t.riskPerTrade, min: 0.1, max: 5, step: 0.05 },
          { key: "maxTotalRiskPercent", label: t.totalRisk, min: 0.5, max: 20, step: 0.25 },
          {
            key: "maxCorrelatedRiskPercent",
            label: t.correlatedRisk,
            min: 0.25,
            max: 10,
            step: 0.25,
          },
        ].map(({ key, label, min, max, step }) => (
          <div key={key} className="space-y-2">
            <Label htmlFor={key} className="text-xs text-slate-400">
              {label}
            </Label>
            <Input
              id={key}
              type="number"
              min={min}
              max={max}
              step={step}
              value={value[key as keyof RiskProfile] as number}
              onChange={(event) =>
                onChange({
                  ...value,
                  [key]: Number(event.target.value),
                })
              }
              className="border-white/10 bg-black/20 text-white"
            />
          </div>
        ))}

        <Button
          type="submit"
          disabled={saving}
          className="w-full bg-amber-400 text-black hover:bg-amber-300"
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Settings2 className="mr-2 h-4 w-4" />
          )}
          {t.save}
        </Button>
        {saved && <p className="text-center text-xs text-emerald-300">✓ {t.saved}</p>}
      </CardContent>
    </Card>
  </form>
);

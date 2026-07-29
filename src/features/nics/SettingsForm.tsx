import { FormEvent } from "react";
import { Loader2, Save, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import type { UserPreferences } from "./types";

interface SettingsFormProps {
  value: UserPreferences;
  t: Translation;
  saving: boolean;
  saved: boolean;
  onChange: (value: UserPreferences) => void;
  onSubmit: (event: FormEvent) => void;
}

export const SettingsForm = ({
  value,
  t,
  saving,
  saved,
  onChange,
  onSubmit,
}: SettingsFormProps) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-400/10 text-sky-300">
          <Settings2 className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-semibold">{t.settings}</h1>
          <p className="text-xs text-slate-500">NICS AI Trader</p>
        </div>
      </div>
    </section>

    <Card className="border-white/10 bg-white/[0.045] text-white shadow-none">
      <CardContent className="space-y-5 p-5">
        <div className="space-y-2">
          <Label className="text-xs text-slate-400">{t.experienceMode}</Label>
          <Select
            value={value.experienceMode}
            onValueChange={(experienceMode: UserPreferences["experienceMode"]) =>
              onChange({ ...value, experienceMode })
            }
          >
            <SelectTrigger className="border-white/10 bg-black/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BEGINNER">{t.beginner}</SelectItem>
              <SelectItem value="PROFESSIONAL">{t.professional}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-slate-400">{t.signalFrequency}</Label>
          <Select
            value={value.signalFrequency}
            onValueChange={(signalFrequency: UserPreferences["signalFrequency"]) =>
              onChange({ ...value, signalFrequency })
            }
          >
            <SelectTrigger className="border-white/10 bg-black/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">{t.allSignals}</SelectItem>
              <SelectItem value="IMPORTANT">{t.importantOnly}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="quiet-hours" className="text-sm text-slate-300">
              {t.quietHours}
            </Label>
            <Switch
              id="quiet-hours"
              checked={value.quietHoursEnabled}
              onCheckedChange={(quietHoursEnabled) => onChange({ ...value, quietHoursEnabled })}
            />
          </div>
          {value.quietHoursEnabled && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="quiet-start" className="text-xs text-slate-500">
                  {t.from}
                </Label>
                <Input
                  id="quiet-start"
                  type="time"
                  value={value.quietHoursStart}
                  onChange={(event) =>
                    onChange({ ...value, quietHoursStart: event.target.value })
                  }
                  className="border-white/10 bg-black/20 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiet-end" className="text-xs text-slate-500">
                  {t.until}
                </Label>
                <Input
                  id="quiet-end"
                  type="time"
                  value={value.quietHoursEnd}
                  onChange={(event) => onChange({ ...value, quietHoursEnd: event.target.value })}
                  className="border-white/10 bg-black/20 text-white"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/10 p-4">
          <Checkbox
            id="risk-disclosure"
            checked={value.riskDisclosureAccepted}
            disabled={value.riskDisclosureAccepted}
            onCheckedChange={(checked) =>
              onChange({ ...value, riskDisclosureAccepted: checked === true })
            }
            className="mt-0.5 border-white/20"
          />
          <Label htmlFor="risk-disclosure" className="text-xs leading-5 text-slate-400">
            {t.disclosure}
          </Label>
        </div>

        <Button
          type="submit"
          disabled={saving || !value.riskDisclosureAccepted}
          className="w-full bg-amber-400 text-black hover:bg-amber-300"
        >
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {t.saveSettings}
        </Button>
        {saved && <p className="text-center text-xs text-emerald-300">✓ {t.saved}</p>}
      </CardContent>
    </Card>
  </form>
);

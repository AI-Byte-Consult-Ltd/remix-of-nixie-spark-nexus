import { ShieldAlert } from "lucide-react";
import type { Translation } from "./i18n";

// Shown under every screen of the Trader app (Alexander, 2026-11-04).
export const RiskDisclaimer = ({ t }: { t: Translation }) => (
  <aside className="mt-6 flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
    <p className="text-[11px] leading-5 text-slate-500">
      <span className="font-medium text-slate-400">{t.disclaimerTitle}. </span>
      {t.disclaimer}
    </p>
  </aside>
);

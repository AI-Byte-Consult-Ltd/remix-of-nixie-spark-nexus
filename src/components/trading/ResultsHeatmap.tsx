import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  SESSION_KEYS,
  hourHeatmap,
  weekdaySessionHeatmap,
  type HeatCell,
  type Trade,
} from "@/lib/trackRecordMetrics";
import { heatmapText } from "./heatmapI18n";

// Results heatmaps built from the same closed strong signals as the rest of
// the track record (it receives the already filtered list): instrument x hour
// of the signal and weekday x session. Colour is diverging around zero:
// green = average R above 0, red = below, grey = no signals. Cells with fewer
// than MIN_SIGNALS signals are drawn pale, so a single lucky trade does not
// look like a pattern.

const MIN_SIGNALS = 3;
const POS = [16, 185, 129]; // emerald-500, same as the equity curve
const NEG = [244, 63, 94]; // rose-500

type Metric = "avgR" | "winRate";

type Props = {
  trades: Trade[];
  language?: string;
  variant?: "site" | "app";
};

const signed = (value: number, digits = 2) => `${value > 0 ? "+" : ""}${value.toFixed(digits)}`;

const ResultsHeatmap = ({ trades, language, variant = "site" }: Props) => {
  const text = heatmapText(language);
  const app = variant === "app";
  const [metric, setMetric] = useState<Metric>("avgR");
  const [active, setActive] = useState<{ label: string; cell: HeatCell } | null>(null);

  const hourRows = useMemo(() => hourHeatmap(trades), [trades]);
  const weekGrid = useMemo(() => weekdaySessionHeatmap(trades), [trades]);
  // Weekend rows only when there are weekend signals (crypto).
  const weekdays = useMemo(
    () => weekGrid.map((cells, i) => ({ i, cells })).filter(({ i, cells }) => i < 5 || cells.some((c) => c.n > 0)),
    [weekGrid],
  );

  const ui = {
    card: app
      ? "rounded-2xl border border-white/10 bg-white/[0.045] text-white"
      : "rounded-xl border border-border/50 bg-card",
    muted: app ? "text-slate-500" : "text-muted-foreground",
    strong: app ? "text-white" : "text-foreground",
    empty: app ? "rgba(255,255,255,0.04)" : "hsl(var(--muted) / 0.6)",
    chip: (on: boolean) =>
      cn(
        "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
        app
          ? on
            ? "bg-amber-300 text-slate-950 border-amber-300"
            : "border-white/10 text-slate-400 hover:border-white/25"
          : on
            ? "bg-primary text-primary-foreground border-primary"
            : "border-border text-muted-foreground hover:border-primary/40",
      ),
  };

  // Diverging scale: intensity grows with distance from the neutral point.
  const colorOf = (cell: HeatCell) => {
    if (!cell.n) return ui.empty;
    const value = metric === "avgR" ? cell.totalR / cell.n : cell.wins / cell.n - 0.5;
    const full = metric === "avgR" ? 0.5 : 0.25; // +0.5R or 75% win rate = full colour
    const strength = Math.min(1, Math.abs(value) / full);
    const [r, g, b] = value >= 0 ? POS : NEG;
    const alpha = (cell.n < MIN_SIGNALS ? 0.08 : 0.14) + strength * (cell.n < MIN_SIGNALS ? 0.2 : 0.76);
    return `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
  };

  const valueOf = (cell: HeatCell) =>
    metric === "avgR" ? `${signed(cell.totalR / cell.n)}R` : `${Math.round((100 * cell.wins) / cell.n)}%`;

  const describe = (cell: HeatCell) =>
    cell.n
      ? `${cell.n} ${text.signals} · ${text.avgR} ${signed(cell.totalR / cell.n)}R · ${text.winRate} ${Math.round(
          (100 * cell.wins) / cell.n,
        )}% · Σ ${signed(cell.totalR, 1)}R${cell.n < MIN_SIGNALS ? ` · ${text.fewSignals}` : ""}`
      : `0 ${text.signals}`;

  const cellProps = (label: string, cell: HeatCell) => ({
    title: `${label}: ${describe(cell)}`,
    onMouseEnter: () => setActive({ label, cell }),
    onClick: () => setActive({ label, cell }),
    style: { background: colorOf(cell) },
  });

  if (!trades.length) return null;

  return (
    <div className={cn(ui.card, "space-y-6 p-4 sm:p-5")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={cn("font-medium", ui.strong)}>{text.resultsTitle}</p>
          <p className={cn("mt-1 max-w-2xl text-xs", ui.muted)}>{text.resultsNote}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className={ui.chip(metric === "avgR")} onClick={() => setMetric("avgR")}>
            {text.avgR}
          </button>
          <button type="button" className={ui.chip(metric === "winRate")} onClick={() => setMetric("winRate")}>
            {text.winRate}
          </button>
        </div>
      </div>

      {/* Instrument x hour */}
      <div>
        <p className={cn("mb-2 text-xs font-medium uppercase tracking-wide", ui.muted)}>{text.byHour}</p>
        <div className="overflow-x-auto pb-1" onMouseLeave={() => setActive(null)}>
          <table className="border-separate" style={{ borderSpacing: 2 }}>
            <thead>
              <tr>
                <th />
                {Array.from({ length: 24 }, (_, h) => (
                  <th key={h} className={cn("w-6 min-w-6 text-center text-[10px] font-normal tabular-nums", ui.muted)}>
                    {h % 3 === 0 ? String(h).padStart(2, "0") : ""}
                  </th>
                ))}
                <th className={cn("pl-2 text-right text-[10px] font-normal", ui.muted)}>Σ</th>
              </tr>
            </thead>
            <tbody>
              {hourRows.map((row) => {
                const name = row.symbol ?? text.allInstruments;
                return (
                  <tr key={name}>
                    <td
                      className={cn(
                        "whitespace-nowrap pr-2 text-xs",
                        row.symbol ? ui.strong : "font-semibold",
                        !row.symbol && ui.strong,
                      )}
                    >
                      {name}
                    </td>
                    {row.cells.map((cell, h) => (
                      <td
                        key={h}
                        {...cellProps(`${name} · ${String(h).padStart(2, "0")}:00`, cell)}
                        className="h-6 w-6 min-w-6 cursor-pointer rounded-[4px]"
                      />
                    ))}
                    <td className={cn("pl-2 text-right text-[11px] tabular-nums", ui.muted)}>{row.total.n}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className={cn("mt-1 text-[11px]", ui.muted)}>{text.hourAxis}</p>
      </div>

      {/* Weekday x session */}
      <div>
        <p className={cn("mb-2 text-xs font-medium uppercase tracking-wide", ui.muted)}>{text.byWeekday}</p>
        <div className="overflow-x-auto pb-1" onMouseLeave={() => setActive(null)}>
          <table className="w-full min-w-[340px] border-separate" style={{ borderSpacing: 3 }}>
            <thead>
              <tr>
                <th />
                {SESSION_KEYS.map((key) => (
                  <th key={key} className={cn("px-1 text-center text-[11px] font-normal", ui.muted)}>
                    {text.sessions[key]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {weekdays.map(({ i, cells }) => (
                <tr key={i}>
                  <td className={cn("pr-2 text-xs", ui.strong)}>{text.weekdays[i]}</td>
                  {cells.map((cell, s) => (
                    <td
                      key={s}
                      {...cellProps(`${text.weekdays[i]} · ${text.sessions[SESSION_KEYS[s]]}`, cell)}
                      className={cn(
                        "h-9 cursor-pointer rounded-[4px] text-center text-[11px] tabular-nums",
                        ui.strong,
                        cell.n < MIN_SIGNALS && "opacity-70",
                      )}
                    >
                      {cell.n ? valueOf(cell) : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={cn("mt-1 text-[11px]", ui.muted)}>{text.sessionHint}</p>
      </div>

      <p className={cn("min-h-[1.25rem] text-xs tabular-nums", active ? ui.strong : ui.muted)} aria-live="polite">
        {active ? `${active.label}: ${describe(active.cell)}` : text.tapHint}
      </p>
    </div>
  );
};

export default ResultsHeatmap;

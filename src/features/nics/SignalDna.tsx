import { useMemo } from "react";
import { Dna } from "lucide-react";
import { DnaHelix, type DnaRung } from "@/components/dna/DnaHelix";
import { cn } from "@/lib/utils";
import type { AppLanguage, PerformanceBlock, SignalHistoryRow, SignalRow } from "./types";
import { formatNumber } from "./utils";

/*
 * 2026-11-11 (Alexander): the DNA spiral everywhere in the Trader app.
 *  - MyDnaPanel: "Моё ДНК" on the statistics screen, big like his
 *    reference. One bridge = one of the user's real closed signals, oldest
 *    at the bottom-left, newest at the top-right; green = profit, red =
 *    loss, grey = zero. Bright knots mark results of 2R and more.
 *  - DashboardDna: the same helix, smaller, behind the dashboard greeting.
 *  - SignalDnaStrip: a thin helix on every signal card. Bridges: stop,
 *    entry, TP1..TP4; a target lights only when it was really hit.
 * The totals shown come from the same performance block as the rest of
 * the statistics screen, not from a separate count.
 */

const TEXT: Record<
  AppLanguage,
  { title: string; lead: string; win: string; loss: string; flat: string; empty: string; signals: string; strip: string; order: string }
> = {
  ru: {
    title: "Моё ДНК",
    lead: "Спираль из вашей реальной истории сигналов. Каждый мостик это один закрытый сигнал: зелёный в плюс, красный в минус, серый в ноль. Яркие узлы это результаты от 2R.",
    win: "В плюс",
    loss: "В минус",
    flat: "В ноль",
    empty: "Пока нет закрытых сигналов. Спираль начнёт собираться с первого результата.",
    signals: "сигналов",
    strip: "ДНК сигнала",
    order: "Старые снизу слева, новые сверху справа",
  },
  bg: {
    title: "Моето ДНК",
    lead: "Спирала от вашата реална история на сигналите. Всеки мост е един затворен сигнал: зелен на печалба, червен на загуба, сив на нула. Ярките възли са резултати от 2R нагоре.",
    win: "Печалба",
    loss: "Загуба",
    flat: "Нула",
    empty: "Още няма затворени сигнали. Спиралата ще започне да се изгражда от първия резултат.",
    signals: "сигнала",
    strip: "ДНК на сигнала",
    order: "Старите долу вляво, новите горе вдясно",
  },
  en: {
    title: "My DNA",
    lead: "A spiral built from your real signal history. Each bridge is one closed signal: green in profit, red in loss, grey at zero. Bright knots are results of 2R or more.",
    win: "Profit",
    loss: "Loss",
    flat: "Zero",
    empty: "No closed signals yet. The spiral starts growing with your first result.",
    signals: "signals",
    strip: "Signal DNA",
    order: "Oldest bottom left, newest top right",
  },
  es: {
    title: "Mi ADN",
    lead: "Una espiral hecha con tu historial real de señales. Cada puente es una señal cerrada: verde en ganancia, rojo en pérdida, gris en cero. Los nudos brillantes son resultados de 2R o más.",
    win: "Ganancia",
    loss: "Pérdida",
    flat: "Cero",
    empty: "Aún no hay señales cerradas. La espiral empieza a crecer con tu primer resultado.",
    signals: "señales",
    strip: "ADN de la señal",
    order: "Las antiguas abajo a la izquierda, las nuevas arriba a la derecha",
  },
  pt: {
    title: "Meu DNA",
    lead: "Uma espiral feita com o seu histórico real de sinais. Cada ponte é um sinal fechado: verde no lucro, vermelho na perda, cinza no zero. Os nós brilhantes são resultados de 2R ou mais.",
    win: "Lucro",
    loss: "Perda",
    flat: "Zero",
    empty: "Ainda não há sinais fechados. A espiral começa a crescer com o seu primeiro resultado.",
    signals: "sinais",
    strip: "DNA do sinal",
    order: "Os antigos em baixo à esquerda, os novos em cima à direita",
  },
};

export const dnaText = (language: AppLanguage) => TEXT[language] ?? TEXT.en;

const MAX_RUNGS = 72;

const timeOf = (row: SignalHistoryRow) => Date.parse(row.closedAt || row.publishedAt || row.createdAt || "") || 0;

/** History rows -> bridges, oldest first, at most the latest MAX_RUNGS. */
export const historyRungs = (history: SignalHistoryRow[], max = MAX_RUNGS): DnaRung[] =>
  [...history]
    .filter((row) => Number.isFinite(Number(row.realizedR)))
    .sort((a, b) => timeOf(a) - timeOf(b))
    .slice(-max)
    .map((row) => {
      const r = Number(row.realizedR);
      return {
        tone: r > 0 ? "win" : r < 0 ? "loss" : "flat",
        strength: Math.min(1, 0.35 + Math.abs(r) / 3),
      } satisfies DnaRung;
    });

export const MyDnaPanel = ({
  history,
  total,
  language,
}: {
  history: SignalHistoryRow[];
  total: PerformanceBlock | null | undefined;
  language: AppLanguage;
}) => {
  const tx = dnaText(language);
  const rungs = useMemo(() => historyRungs(history), [history]);
  const has = rungs.length > 0;
  const totalR = Number(total?.totalR ?? 0);

  return (
    <section className="overflow-hidden rounded-[28px] border border-violet-300/15 bg-[radial-gradient(circle_at_30%_15%,rgba(45,212,170,0.12),transparent_45%),radial-gradient(circle_at_80%_85%,rgba(244,114,160,0.12),transparent_45%),linear-gradient(160deg,#0f1424,#06080e)] text-white">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-400/10 text-emerald-300">
            <Dna className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{tx.title}</h2>
            <p className="text-xs text-slate-400">
              {total?.closedSignals ?? rungs.length} {tx.signals}
              {total ? ` · ${totalR > 0 ? "+" : ""}${formatNumber(totalR, 1)}R · ${formatNumber(total.winRatePercent, 1)}%` : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px]">
          {[
            ["bg-emerald-400", tx.win, total?.wins],
            ["bg-rose-400", tx.loss, total?.losses],
            ["bg-slate-400", tx.flat, total?.breakeven],
          ].map(([dot, label, value]) => (
            <span key={label as string} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-slate-300">
              <span className={cn("h-2 w-2 rounded-full", dot as string)} />
              {label as string}
              {value != null ? ` · ${value}` : ""}
            </span>
          ))}
        </div>
      </div>
      <div className="relative h-[380px] sm:h-[460px]">
        <DnaHelix
          rungs={has ? rungs : undefined}
          bridges={14}
          from={[0.03, 0.93]}
          to={[0.97, 0.08]}
          radius={0.09}
          taper={[0.6, 1.2]}
          turns={has ? Math.max(2.2, Math.min(4.5, rungs.length / 9)) : 3}
          speed={0.5}
          density={3600}
          intensity={has ? 1 : 0.45}
          ariaLabel={tx.title}
        />
        {!has && (
          <p className="absolute inset-x-6 bottom-6 text-center text-sm text-slate-400">{tx.empty}</p>
        )}
      </div>
      <p className="px-5 pb-5 text-[11px] leading-4 text-slate-500">
        {tx.lead} {has ? tx.order + "." : ""}
      </p>
    </section>
  );
};

export const DashboardDna = ({ history }: { history: SignalHistoryRow[] }) => {
  const rungs = useMemo(() => historyRungs(history, 40), [history]);
  const has = rungs.length >= 3;
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 w-[70%] sm:w-[58%]" aria-hidden="true">
      <DnaHelix
        rungs={has ? rungs : undefined}
        bridges={10}
        from={[0.0, 0.95]}
        to={[1.02, 0.05]}
        radius={0.11}
        taper={[0.6, 1.15]}
        turns={2.4}
        speed={0.5}
        density={1800}
        intensity={0.85}
      />
    </div>
  );
};

export const SignalDnaStrip = ({ signal, language }: { signal: SignalRow; language: AppLanguage }) => {
  const tx = dnaText(language);
  const hit = new Set(signal.hitTargets ?? []);
  const rungs = useMemo<DnaRung[]>(() => {
    const list: DnaRung[] = [
      // Active signals never show a hit stop, so the stop bridge stays dim.
      { tone: "stop", lit: false, strength: 0.7 },
      { tone: "entry", lit: true, strength: 0.8 },
    ];
    [signal.tp1, signal.tp2, signal.tp3, signal.tp4].forEach((tp, i) => {
      if (tp === null || tp === undefined || tp === "") return;
      list.push({ tone: "win", lit: hit.has(i + 1), strength: 0.6 + i * 0.12 });
    });
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signal.signalId, (signal.hitTargets ?? []).join(","), signal.tp1, signal.tp2, signal.tp3, signal.tp4]);

  return (
    <div className="relative h-20 border-b border-white/10 bg-[linear-gradient(90deg,#0b0f1a,#0d1220_50%,#0b0f1a)]">
      <DnaHelix
        rungs={rungs}
        from={[0.03, 0.5]}
        to={[0.97, 0.5]}
        radius={0.03}
        taper={[1, 1]}
        turns={4}
        intensity={1.6}
        speed={signal.direction === "LONG" ? 0.6 : -0.6}
        density={1800}
        areaPerDust={35}
        maxDpr={2}
      />
      <span className="pointer-events-none absolute left-3 top-1.5 text-[9px] uppercase tracking-[0.18em] text-slate-500">
        {tx.strip}
      </span>
    </div>
  );
};

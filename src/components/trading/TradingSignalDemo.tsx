import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Language } from "@/contexts/LanguageContext";

// Hero card of /trading: an illustrative signal that plays out on a small
// chart. The scenario cycles through the four supported markets; the price
// line draws itself from Entry and the TP chips light up as it crosses each
// level. Shapes only, no prices: real levels exist only inside a real signal
// (the card says so under the buttons). Each scenario stops at a different
// target, so the demo does not suggest that every signal reaches TP4.

interface DemoStrings {
  example: string;
  buy: string;
  sell: string;
  reached: (tp: string) => string;
  inProgress: string;
}

const strings: Record<Language, DemoStrings> = {
  en: { example: "EXAMPLE", buy: "BUY MARKET", sell: "SELL MARKET", reached: (tp) => `${tp} reached`, inProgress: "Tracking the signal…" },
  ru: { example: "ПРИМЕР", buy: "ПОКУПКА ПО РЫНКУ", sell: "ПРОДАЖА ПО РЫНКУ", reached: (tp) => `${tp} достигнут`, inProgress: "Сигнал отслеживается…" },
  de: { example: "BEISPIEL", buy: "MARKTKAUF", sell: "MARKTVERKAUF", reached: (tp) => `${tp} erreicht`, inProgress: "Signal wird verfolgt…" },
  fr: { example: "EXEMPLE", buy: "ACHAT AU MARCHÉ", sell: "VENTE AU MARCHÉ", reached: (tp) => `${tp} atteint`, inProgress: "Suivi du signal…" },
  ar: { example: "مثال", buy: "شراء بسعر السوق", sell: "بيع بسعر السوق", reached: (tp) => `تم بلوغ ${tp}`, inProgress: "جارٍ تتبّع الإشارة…" },
  zh: { example: "示例", buy: "市价买入", sell: "市价卖出", reached: (tp) => `已到达 ${tp}`, inProgress: "正在跟踪信号…" },
  pl: { example: "PRZYKŁAD", buy: "KUPNO PO RYNKU", sell: "SPRZEDAŻ PO RYNKU", reached: (tp) => `${tp} osiągnięty`, inProgress: "Śledzenie sygnału…" },
  tr: { example: "ÖRNEK", buy: "PİYASA ALIŞ", sell: "PİYASA SATIŞ", reached: (tp) => `${tp} ulaşıldı`, inProgress: "Sinyal izleniyor…" },
  it: { example: "ESEMPIO", buy: "ACQUISTO A MERCATO", sell: "VENDITA A MERCATO", reached: (tp) => `${tp} raggiunto`, inProgress: "Monitoraggio del segnale…" },
  bg: { example: "ПРИМЕР", buy: "ПОКУПКА ПО ПАЗАРНА ЦЕНА", sell: "ПРОДАЖБА ПО ПАЗАРНА ЦЕНА", reached: (tp) => `${tp} е достигнат`, inProgress: "Сигналът се проследява…" },
  es: { example: "EJEMPLO", buy: "COMPRA A MERCADO", sell: "VENTA A MERCADO", reached: (tp) => `${tp} alcanzado`, inProgress: "Siguiendo la señal…" },
  pt: { example: "EXEMPLO", buy: "COMPRA A MERCADO", sell: "VENDA A MERCADO", reached: (tp) => `${tp} atingido`, inProgress: "Acompanhando o sinal…" },
};

// Chart coordinates (viewBox 300 x 122, smaller y = higher price) for a LONG
// signal; a SHORT one is the same picture mirrored vertically.
const ENTRY = 84;
const SL = 104;
const TPS = [66, 50, 34, 18];
const BASE_PATH: [number, number][] = [
  [0, 84], [25, 88], [45, 80], [65, 90], [85, 74], [110, 68], [130, 72], [150, 56],
  [170, 60], [195, 46], [215, 50], [240, 36], [260, 40], [285, 22], [300, 18],
];

interface Scenario {
  market: "gold" | "forex" | "brent" | "bitcoin";
  pair?: string;
  long: boolean;
  target: number; // index of the last TP the line reaches
}

const SCENARIOS: Scenario[] = [
  { market: "gold", long: true, target: 3 },
  { market: "forex", pair: "EUR/USD", long: false, target: 1 },
  { market: "brent", long: true, target: 2 },
  { market: "bitcoin", long: false, target: 0 },
];

const mirror = (y: number) => 122 - y;

// Squeeze the base path so it ends exactly on the scenario's target level.
const pathFor = (s: Scenario): [number, number][] => {
  const scale = (ENTRY - TPS[s.target]) / (ENTRY - TPS[3]);
  return BASE_PATH.map(([x, y]) => {
    const yy = ENTRY - (ENTRY - y) * scale;
    return [x, s.long ? yy : mirror(yy)];
  });
};

const yAt = (points: [number, number][], x: number) => {
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    if (x <= x1) return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
  }
  return points[points.length - 1][1];
};

const DRAW_MS = 4200;
const HOLD_MS = 2200;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

interface Props {
  lang: Language;
  label: string;
  marketNames: Record<Scenario["market"], string>;
  orderTypeLabel: string;
  entryLabel: string;
  entryValue: string;
  slLabel: string;
  slValue: string;
  validLabel: string;
  validValue: string;
  accept: string;
  skip: string;
  note: string;
}

const TradingSignalDemo = ({
  lang,
  label,
  marketNames,
  orderTypeLabel,
  entryLabel,
  entryValue,
  slLabel,
  slValue,
  validLabel,
  validValue,
  accept,
  skip,
  note,
}: Props) => {
  const s = strings[lang] ?? strings.en;
  const [still] = useState(prefersReducedMotion);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(still ? 1 : 0);
  const frame = useRef<number>();

  useEffect(() => {
    if (still) return;
    let start: number | null = null;
    const tick = (now: number) => {
      if (start === null) start = now;
      const elapsed = now - start;
      if (elapsed >= DRAW_MS + HOLD_MS) {
        start = now;
        setIndex((i) => (i + 1) % SCENARIOS.length);
        setProgress(0);
      } else {
        setProgress(Math.min(1, elapsed / DRAW_MS));
      }
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [still]);

  const scenario = SCENARIOS[index];
  const points = pathFor(scenario);
  const levelY = (y: number) => (scenario.long ? y : mirror(y));
  const x = progress * 300;
  const y = yAt(points, x);
  // A level counts as reached once the line has touched it at any point so
  // far, not only where the line is right now.
  const touched = (py: number, tpY: number) => (scenario.long ? py <= levelY(tpY) + 0.5 : py >= levelY(tpY) - 0.5);
  const reachedCount = TPS.filter((tpY, i) => {
    if (i > scenario.target) return false;
    for (let px = 0; px < x; px += 5) if (touched(yAt(points, px), tpY)) return true;
    return touched(y, tpY);
  }).length;
  const polyline = points.map(([px, py]) => `${px},${py}`).join(" ");
  const pair = `${scenario.pair ?? marketNames[scenario.market]} · ${scenario.long ? "LONG" : "SHORT"}`;

  return (
    <div className="rounded-[2rem] border border-border/70 bg-card/90 p-3 shadow-2xl shadow-primary/10 backdrop-blur">
      <div className="rounded-[1.5rem] border border-border/60 bg-background p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <h2 key={pair} className="mt-2 text-2xl font-semibold animate-in fade-in duration-500">{pair}</h2>
          </div>
          <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/10">{s.example}</Badge>
        </div>

        <div className="mt-5 rounded-2xl border border-border/60 p-3">
          <svg viewBox="0 0 300 122" className="h-36 w-full" aria-hidden="true">
            <defs>
              <clipPath id="nics-demo-reveal">
                <rect x="0" y="0" width={x} height="122" />
              </clipPath>
            </defs>
            <g strokeDasharray="4 4" strokeWidth="1">
              {TPS.map((tpY, i) => (
                <line
                  key={tpY}
                  x1="0"
                  x2="300"
                  y1={levelY(tpY)}
                  y2={levelY(tpY)}
                  className={i < reachedCount ? "stroke-green-500" : "stroke-green-500/40"}
                />
              ))}
              <line x1="0" x2="300" y1={levelY(ENTRY)} y2={levelY(ENTRY)} className="stroke-primary" />
              <line x1="0" x2="300" y1={levelY(SL)} y2={levelY(SL)} className="stroke-red-500/70" />
            </g>
            <polyline
              points={polyline}
              fill="none"
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="stroke-foreground"
              clipPath="url(#nics-demo-reveal)"
            />
            <circle cx={x} cy={y} r="4" className={reachedCount > 0 ? "fill-green-500" : "fill-primary"} />
          </svg>
          <div className="mt-2 grid grid-cols-4 gap-2 text-center text-xs font-semibold">
            {TPS.map((tpY, i) => (
              <span
                key={tpY}
                className={`rounded-lg py-1.5 transition-colors duration-300 ${
                  i < reachedCount ? "bg-green-500/15 text-green-600" : "bg-muted text-muted-foreground"
                }`}
              >
                TP{i + 1}
              </span>
            ))}
          </div>
          <p className="mt-2 h-4 text-center text-xs text-muted-foreground">
            {reachedCount > 0 ? s.reached(`TP${reachedCount}`) : s.inProgress}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="col-span-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
            <p className="text-xs text-muted-foreground">{orderTypeLabel}</p>
            <p className="mt-0.5 font-semibold">{scenario.long ? s.buy : s.sell}</p>
          </div>
          <div className="rounded-xl border border-border/60 px-4 py-3">
            <p className="text-xs text-muted-foreground">{entryLabel}</p>
            <p className="mt-0.5 font-semibold">{entryValue}</p>
          </div>
          <div className="rounded-xl border border-border/60 px-4 py-3">
            <p className="text-xs text-muted-foreground">{slLabel}</p>
            <p className="mt-0.5 font-semibold">{slValue}</p>
          </div>
          <div className="col-span-2 rounded-xl border border-border/60 px-4 py-3">
            <p className="text-xs text-muted-foreground">{validLabel}</p>
            <p className="mt-0.5 font-semibold">{validValue}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button className="rounded-xl" tabIndex={-1}>{accept}</Button>
          <Button variant="outline" className="rounded-xl" tabIndex={-1}>{skip}</Button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">{note}</p>
      </div>
    </div>
  );
};

export default TradingSignalDemo;

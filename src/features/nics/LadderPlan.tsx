import { Layers, Lock } from "lucide-react";
import type { AppLanguage, SignalRow, SizingResult } from "./types";
import { formatNumber } from "./utils";

/*
 * NICS Ladder (Pro tariff, 2026-11-12).
 * Five entry levels from the entry-zone edge towards the stop, 0.5R deep,
 * volume 13/17/20/23/27 % (more at the better price) and one common stop.
 * If every level fills, the loss at the stop equals the normal risk of one
 * entry; the total volume is about 1.4x the single-entry lot. Exit: close
 * the whole ladder at TP1, cancel unfilled orders.
 * Shadow test 2026-11-11 (781 strong signals): about the same result as one
 * entry and about half the maximum drawdown, so it is shown as a risk tool.
 * The same rules build the ladder block in the Telegram card
 * (n8n [03 DELIVERY] "Add NICS Ladder") -- keep both in sync.
 */
export const LADDER_SHARES = [13, 17, 20, 23, 27] as const;
const LADDER_DEPTH_R = 0.5;

export const PRO_ACCESS_MODES = ["PAID", "ADMIN"];

export interface LadderLevel {
  price: number;
  share: number;
  /** price distance from this level to the common stop */
  distance: number;
}

const decimalsOf = (values: unknown[]) =>
  Math.min(
    6,
    Math.max(
      0,
      ...values.map((value) => {
        const text = String(Number(value));
        return text.includes(".") && !text.includes("e") ? text.split(".")[1].length : 0;
      }),
    ),
  );

export const buildLadder = (signal: SignalRow): LadderLevel[] | null => {
  const direction = signal.direction === "LONG" ? 1 : signal.direction === "SHORT" ? -1 : 0;
  const low = Math.min(Number(signal.entryLow), Number(signal.entryHigh));
  const high = Math.max(Number(signal.entryLow), Number(signal.entryHigh));
  const stop = Number(signal.stopLoss);
  const top = direction > 0 ? high : low;
  const risk = Math.abs(top - stop);
  if (!direction || !Number.isFinite(top) || !Number.isFinite(stop) || !(risk > 0)) return null;
  if (direction * (top - stop) <= 0) return null;
  const decimals = decimalsOf([
    signal.entryLow,
    signal.entryHigh,
    signal.stopLoss,
    signal.tp1,
    signal.tp2,
    signal.tp3,
    signal.tp4,
  ].filter((value) => value !== null && value !== undefined));
  return LADDER_SHARES.map((share, index) => {
    const depth = (LADDER_DEPTH_R * index) / (LADDER_SHARES.length - 1);
    return {
      price: Number((top - direction * depth * risk).toFixed(decimals)),
      share,
      distance: (1 - depth) * risk,
    };
  });
};

/* Lots per level from the user's own sizing (same risk as one entry). */
const ladderLots = (levels: LadderLevel[], sizing?: SizingResult | null) => {
  if (!sizing?.available || !sizing.riskAmount || !sizing.lossPerLot || !sizing.stopDistance) return null;
  // money per 1 lot per 1 price unit, from the user's own broker specification
  const valuePerUnit = sizing.lossPerLot / sizing.stopDistance;
  const weighted = levels.reduce((sum, level) => sum + (level.share / 100) * level.distance, 0);
  if (!(weighted > 0) || !(valuePerUnit > 0)) return null;
  const totalLot = sizing.riskAmount / (valuePerUnit * weighted);
  const step = sizing.volumeStep && sizing.volumeStep > 0 ? sizing.volumeStep : 0.01;
  const minimum = sizing.volumeMin && sizing.volumeMin > 0 ? sizing.volumeMin : step;
  const lots = levels.map((level) => {
    const raw = (totalLot * level.share) / 100;
    return Math.floor(raw / step + 1e-9) * step;
  });
  const tooSmall = lots.some((lot) => lot < minimum - 1e-12);
  const stepDecimals = decimalsOf([step]);
  return { lots: lots.map((lot) => Number(lot.toFixed(stepDecimals))), tooSmall };
};

const texts: Record<
  AppLanguage,
  {
    title: string;
    intro: string;
    level: string;
    volume: string;
    lot: string;
    exit: string;
    honest: string;
    tooSmall: string;
    locked: string;
  }
> = {
  ru: {
    title: "Лестница входа NICS Ladder",
    intro: "5 заявок от края зоны входа к стопу. Стоп общий для всех уровней.",
    level: "Уровень",
    volume: "Доля объёма",
    lot: "Лот",
    exit: "Выход: закрыть всю лестницу на TP1, неисполненные заявки снять. Если исполнятся все 5 уровней, убыток на SL равен вашему обычному риску; общий объём лестницы = 1,4 × обычного лота.",
    honest: "Это инструмент снижения риска, а не дополнительной прибыли. На истории 781 сильного сигнала результат как у одного входа, максимальная просадка примерно вдвое меньше.",
    tooSmall: "При вашем риске лестница не помещается в минимальный лот брокера — используйте один вход.",
    locked: "Лестница входа NICS Ladder доступна в тарифе Pro.",
  },
  bg: {
    title: "Стълба за вход NICS Ladder",
    intro: "5 поръчки от ръба на зоната за вход към стопа. Стопът е общ за всички нива.",
    level: "Ниво",
    volume: "Дял от обема",
    lot: "Лот",
    exit: "Изход: затворете цялата стълба на TP1, неизпълнените поръчки отменете. Ако се изпълнят и 5-те нива, загубата при SL е равна на обичайния ви риск; общият обем = 1,4 × обичайния лот.",
    honest: "Това е инструмент за по-нисък риск, не за допълнителна печалба. По историята на 781 силни сигнала резултатът е като при един вход, а максималният спад е около два пъти по-малък.",
    tooSmall: "При вашия риск стълбата не се побира в минималния лот на брокера — използвайте един вход.",
    locked: "Стълбата за вход NICS Ladder е достъпна в тарифа Pro.",
  },
  en: {
    title: "NICS Ladder entry",
    intro: "5 orders from the edge of the entry zone towards the stop. One common stop for all levels.",
    level: "Level",
    volume: "Volume share",
    lot: "Lot",
    exit: "Exit: close the whole ladder at TP1 and cancel unfilled orders. If all 5 levels fill, the loss at SL equals your normal risk; total ladder volume = 1.4 × your normal lot.",
    honest: "This is a risk-reduction tool, not extra profit. On 781 past strong signals the result matched a single entry, with about half the maximum drawdown.",
    tooSmall: "At your risk the ladder does not fit the broker's minimum lot — use a single entry.",
    locked: "NICS Ladder entry is available in the Pro plan.",
  },
  es: {
    title: "Entrada escalonada NICS Ladder",
    intro: "5 órdenes desde el borde de la zona de entrada hacia el stop. Un stop común para todos los niveles.",
    level: "Nivel",
    volume: "Parte del volumen",
    lot: "Lote",
    exit: "Salida: cerrar toda la escalera en TP1 y cancelar las órdenes no ejecutadas. Si se ejecutan los 5 niveles, la pérdida en el SL es igual a su riesgo habitual; volumen total = 1,4 × su lote normal.",
    honest: "Es una herramienta para reducir el riesgo, no para ganar más. En 781 señales fuertes pasadas el resultado fue igual al de una sola entrada, con cerca de la mitad de la caída máxima.",
    tooSmall: "Con su riesgo la escalera no cabe en el lote mínimo del bróker: use una sola entrada.",
    locked: "La entrada escalonada NICS Ladder está disponible en el plan Pro.",
  },
  pt: {
    title: "Entrada escalonada NICS Ladder",
    intro: "5 ordens da borda da zona de entrada em direção ao stop. Um stop comum para todos os níveis.",
    level: "Nível",
    volume: "Parte do volume",
    lot: "Lote",
    exit: "Saída: fechar toda a escada no TP1 e cancelar as ordens não executadas. Se os 5 níveis forem executados, a perda no SL é igual ao seu risco habitual; volume total = 1,4 × o seu lote normal.",
    honest: "É uma ferramenta para reduzir o risco, não para ganhar mais. Em 781 sinais fortes passados o resultado foi igual ao de uma única entrada, com cerca de metade da queda máxima.",
    tooSmall: "Com o seu risco a escada não cabe no lote mínimo da corretora — use uma única entrada.",
    locked: "A entrada escalonada NICS Ladder está disponível no plano Pro.",
  },
};

/* The ladder only makes sense before the trade has moved on. */
const ladderApplies = (signal: SignalRow) => {
  const quality = String(signal.setupQuality ?? "STRONG").toUpperCase();
  if (quality === "WEAK") return false;
  if (signal.breakevenActivated) return false;
  if ((signal.hitTargets ?? []).length > 0) return false;
  const status = String(signal.liveStatus ?? "ACTIVE");
  return status === "ACTIVE" || status === "IN_ENTRY" || status === "WAITING_ENTRY";
};

interface LadderPlanProps {
  signal: SignalRow;
  language: AppLanguage;
  isPro: boolean;
  sizing?: SizingResult | null;
}

export const LadderPlan = ({ signal, language, isPro, sizing }: LadderPlanProps) => {
  if (!ladderApplies(signal)) return null;
  const tx = texts[language] ?? texts.en;
  if (!isPro) {
    return (
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-xs text-slate-500">
        <Lock className="h-3.5 w-3.5 shrink-0" />
        <span>{tx.locked}</span>
      </div>
    );
  }
  const levels = buildLadder(signal);
  if (!levels) return null;
  const lots = ladderLots(levels, sizing);
  return (
    <div className="border-b border-white/10 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Layers className="h-4 w-4 text-violet-300" />
        <p className="text-sm font-medium">{tx.title}</p>
        <span className="rounded-full bg-violet-400/15 px-2 py-0.5 text-[10px] font-medium text-violet-200">
          Pro
        </span>
      </div>
      <p className="text-[11px] leading-5 text-slate-400">{tx.intro}</p>
      <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/[0.04] text-[10px] uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">{tx.level}</th>
              <th className="px-3 py-2 font-medium">{tx.volume}</th>
              {lots && <th className="px-3 py-2 font-medium">{tx.lot}</th>}
            </tr>
          </thead>
          <tbody>
            {levels.map((level, index) => (
              <tr key={`${signal.signalId}-ladder-${index}`} className="border-t border-white/5">
                <td className="px-3 py-2 font-mono">
                  {index + 1}) {formatNumber(level.price, 6)}
                </td>
                <td className="px-3 py-2 font-mono text-slate-300">{level.share}%</td>
                {lots && <td className="px-3 py-2 font-mono text-slate-300">{lots.lots[index]}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {lots?.tooSmall && <p className="mt-2 text-[11px] leading-5 text-amber-300">{tx.tooSmall}</p>}
      <p className="mt-2 text-[11px] leading-5 text-slate-400">{tx.exit}</p>
      <p className="mt-1 text-[11px] leading-5 text-slate-500">{tx.honest}</p>
    </div>
  );
};

import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { heatmapText, type VolumeRangeKey } from "./heatmapI18n";

// Volume-by-price heatmap from our own live broker candles (n8n
// [40 PUBLIC] Market Heatmaps API). Each column is a candle, each row a price
// level; the brighter the cell, the more tick activity there. On the right,
// the volume profile with the busiest price (POC) and the 70% value area.
// Tick volume, not exchange volume: the page says so.

const ENDPOINT = "https://n8n.aibyteconsult.com/webhook/nics-market-heatmap";
const RANGES: VolumeRangeKey[] = ["1d", "3d", "2w", "1m"];
const SYMBOLS = [
  "XAU/USD", "XAG/USD", "UKOUSDft", "US100", "US500", "GER40", "NVIDIA", "TSLA", "SPCX",
  "EUR/USD", "GBP/USD", "USD/JPY", "USD/CHF", "USD/CAD", "AUD/USD", "USD/CNH", "EUR/JPY", "GBP/JPY",
  "BTC/USD", "ETH/USD",
];
const LABELS: Record<string, string> = { UKOUSDft: "Brent", SPCX: "SpaceX" };
const label = (s: string) => LABELS[s] ?? s;

type HeatmapResponse = {
  status: "ok" | "no-data";
  symbol: string;
  timeframe: string;
  digits: number;
  priceLow: number;
  priceHigh: number;
  rowCount: number;
  columns: [number, number][];
  cells: number[][];
  profile: number[];
  poc: number;
  valueAreaLow: number;
  valueAreaHigh: number;
  lastPrice: number;
  lastCandleAt: string;
};

type Props = { language?: string; variant?: "site" | "app" };

// Sequential, one hue (amber), light to strong. Same hue as the app accent.
const AMBER = [251, 191, 36];
const PROFILE_W = 56;
const AXIS_W = 64;
const HEIGHT = 300;

const VolumeHeatmap = ({ language, variant = "site" }: Props) => {
  const text = heatmapText(language);
  const app = variant === "app";
  const [symbol, setSymbol] = useState("XAU/USD");
  const [range, setRange] = useState<VolumeRangeKey>("1d");
  const [data, setData] = useState<HeatmapResponse | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "offline">("loading");
  const [hover, setHover] = useState<{ col: number; row: number } | null>(null);
  const [width, setWidth] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    setState("loading");
    setHover(null);
    fetch(`${ENDPOINT}?symbol=${encodeURIComponent(symbol)}&range=${range}`)
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(String(response.status)))))
      .then((json: HeatmapResponse) => {
        if (cancelled) return;
        setData(json);
        setState("ok");
      })
      .catch(() => !cancelled && setState("offline"));
    return () => {
      cancelled = true;
    };
  }, [symbol, range]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setWidth(el.clientWidth));
    observer.observe(el);
    setWidth(el.clientWidth);
    return () => observer.disconnect();
  }, []);

  const ok = state === "ok" && data?.status === "ok" && data.columns.length > 0;
  const fmt = (value: number) => (data ? value.toFixed(data.digits) : String(value));
  const timeFormat = useMemo(
    () =>
      new Intl.DateTimeFormat(language || "en", {
        timeZone: "Europe/Sofia",
        ...(range === "1d" ? {} : { day: "numeric", month: "short" }),
        hour: "2-digit",
        minute: "2-digit",
      }),
    [language, range],
  );

  // Draw.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !ok || !data || width < 100) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(HEIGHT * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${HEIGHT}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, HEIGHT);

    const ink = getComputedStyle(canvas).color || (app ? "#e2e8f0" : "#111");
    const plotW = width - AXIS_W - PROFILE_W - 8;
    const cols = data.columns.length;
    const rows = data.rowCount;
    const cw = plotW / cols;
    const rh = HEIGHT / rows;
    const yOf = (price: number) => HEIGHT - ((price - data.priceLow) / (data.priceHigh - data.priceLow)) * HEIGHT;

    // Surface behind the cells.
    ctx.fillStyle = app ? "rgba(255,255,255,0.03)" : "rgba(127,127,127,0.06)";
    ctx.fillRect(AXIS_W, 0, plotW, HEIGHT);

    // Cells: intensity 0..100 -> amber alpha.
    for (let c = 0; c < cols; c++) {
      const column = data.cells[c];
      for (let r = 0; r < rows; r++) {
        const v = column[r];
        if (!v) continue;
        ctx.fillStyle = `rgba(${AMBER[0]},${AMBER[1]},${AMBER[2]},${(0.08 + 0.92 * (v / 100)).toFixed(3)})`;
        ctx.fillRect(AXIS_W + c * cw, HEIGHT - (r + 1) * rh, Math.ceil(cw), Math.ceil(rh));
      }
    }

    // Value area band edges and POC.
    ctx.save();
    ctx.strokeStyle = ink;
    ctx.globalAlpha = 0.35;
    ctx.setLineDash([2, 4]);
    for (const p of [data.valueAreaLow, data.valueAreaHigh]) {
      ctx.beginPath();
      ctx.moveTo(AXIS_W, yOf(p));
      ctx.lineTo(AXIS_W + plotW + 8 + PROFILE_W, yOf(p));
      ctx.stroke();
    }
    ctx.globalAlpha = 0.8;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(AXIS_W, yOf(data.poc));
    ctx.lineTo(AXIS_W + plotW + 8 + PROFILE_W, yOf(data.poc));
    ctx.stroke();
    ctx.restore();

    // Close price line.
    ctx.save();
    ctx.strokeStyle = ink;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    data.columns.forEach(([, close], c) => {
      const x = AXIS_W + (c + 0.5) * cw;
      const y = Math.max(0, Math.min(HEIGHT, yOf(close)));
      if (c === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();

    // Volume profile on the right.
    const px = AXIS_W + plotW + 8;
    for (let r = 0; r < rows; r++) {
      const v = data.profile[r];
      if (!v) continue;
      const inVA = (r + 0.5) * ((data.priceHigh - data.priceLow) / rows) + data.priceLow;
      const strong = inVA >= data.valueAreaLow && inVA <= data.valueAreaHigh;
      ctx.fillStyle = `rgba(${AMBER[0]},${AMBER[1]},${AMBER[2]},${strong ? 0.85 : 0.35})`;
      ctx.fillRect(px, HEIGHT - (r + 1) * rh + 0.5, (PROFILE_W * v) / 100, Math.max(1, rh - 1));
    }

    // Price axis labels.
    ctx.fillStyle = ink;
    ctx.globalAlpha = 0.65;
    ctx.font = "11px ui-sans-serif, system-ui, sans-serif";
    ctx.textBaseline = "middle";
    ctx.textAlign = "right";
    for (let i = 0; i <= 4; i++) {
      const p = data.priceLow + ((data.priceHigh - data.priceLow) * i) / 4;
      ctx.fillText(fmt(p), AXIS_W - 6, Math.max(7, Math.min(HEIGHT - 7, yOf(p))));
    }
    ctx.globalAlpha = 1;

    // Hover crosshair.
    if (hover) {
      ctx.save();
      ctx.strokeStyle = ink;
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 1;
      const x = AXIS_W + (hover.col + 0.5) * cw;
      const y = HEIGHT - (hover.row + 0.5) * rh;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, HEIGHT);
      ctx.moveTo(AXIS_W, y);
      ctx.lineTo(AXIS_W + plotW, y);
      ctx.stroke();
      ctx.restore();
    }
  }, [ok, data, width, hover, app]); // eslint-disable-line react-hooks/exhaustive-deps

  const onPointer = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!ok || !data) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - AXIS_W;
    const plotW = width - AXIS_W - PROFILE_W - 8;
    if (x < 0 || x > plotW) return setHover(null);
    const col = Math.min(data.columns.length - 1, Math.max(0, Math.floor((x / plotW) * data.columns.length)));
    const row = Math.min(data.rowCount - 1, Math.max(0, Math.floor(((HEIGHT - (event.clientY - rect.top)) / HEIGHT) * data.rowCount)));
    setHover({ col, row });
  };

  const hoverText = () => {
    if (!ok || !data || !hover) return text.tapHint;
    const [t] = data.columns[hover.col];
    const step = (data.priceHigh - data.priceLow) / data.rowCount;
    const lo = data.priceLow + hover.row * step;
    return `${timeFormat.format(new Date(t * 1000))} · ${text.price} ${fmt(lo)}–${fmt(lo + step)} · ${text.volume} ${
      data.cells[hover.col][hover.row]
    }/100`;
  };

  const ui = {
    card: app
      ? "rounded-2xl border border-white/10 bg-white/[0.045] text-white"
      : "rounded-xl border border-border/50 bg-card",
    muted: app ? "text-slate-500" : "text-muted-foreground",
    strong: app ? "text-white" : "text-foreground",
    chip: (on: boolean) =>
      cn(
        "px-3 py-1 rounded-full text-xs font-medium border transition-colors whitespace-nowrap",
        app
          ? on
            ? "bg-amber-300 text-slate-950 border-amber-300"
            : "border-white/10 text-slate-400 hover:border-white/25"
          : on
            ? "bg-primary text-primary-foreground border-primary"
            : "border-border text-muted-foreground hover:border-primary/40",
      ),
    select: app
      ? "rounded-full border border-white/10 bg-transparent px-3 py-1 text-xs text-slate-300"
      : "rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground",
  };

  return (
    <div className={cn(ui.card, "space-y-4 p-4 sm:p-5")}>
      <div>
        <p className={cn("font-medium", ui.strong)}>{text.volumeTitle}</p>
        <p className={cn("mt-1 max-w-2xl text-xs", ui.muted)}>{text.volumeNote}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          aria-label={text.price}
          value={symbol}
          onChange={(event) => setSymbol(event.target.value)}
          className={ui.select}
        >
          {SYMBOLS.map((s) => (
            <option key={s} value={s} className="text-slate-900">
              {label(s)}
            </option>
          ))}
        </select>
        {RANGES.map((key) => (
          <button key={key} type="button" onClick={() => setRange(key)} className={ui.chip(range === key)}>
            {text.ranges[key]}
          </button>
        ))}
      </div>

      {ok && data ? (
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs tabular-nums">
          <span className={ui.muted}>
            {text.lastPrice}: <span className={ui.strong}>{fmt(data.lastPrice)}</span>
          </span>
          <span className={ui.muted}>
            {text.poc}: <span className={ui.strong}>{fmt(data.poc)}</span>
          </span>
          <span className={ui.muted}>
            {text.valueArea}:{" "}
            <span className={ui.strong}>
              {fmt(data.valueAreaLow)} – {fmt(data.valueAreaHigh)}
            </span>
          </span>
        </div>
      ) : null}

      <div ref={wrapRef} className="relative w-full" style={{ height: HEIGHT }}>
        {ok ? (
          <canvas
            ref={canvasRef}
            className={cn("block touch-none", ui.strong)}
            onPointerMove={onPointer}
            onPointerDown={onPointer}
            onPointerLeave={() => setHover(null)}
            role="img"
            aria-label={`${text.volumeTitle} ${label(symbol)}`}
          />
        ) : (
          <div className={cn("flex h-full items-center justify-center text-sm", ui.muted)}>
            {state === "loading" ? text.loading : state === "offline" ? text.offline : text.noData}
          </div>
        )}
      </div>

      {ok && data ? (
        <div className={cn("flex justify-between text-[11px] tabular-nums", ui.muted)} style={{ paddingLeft: AXIS_W, paddingRight: PROFILE_W + 8 }}>
          <span>{timeFormat.format(new Date(data.columns[0][0] * 1000))}</span>
          <span>{timeFormat.format(new Date(data.columns[data.columns.length - 1][0] * 1000))}</span>
        </div>
      ) : null}

      <p className={cn("min-h-[1.25rem] text-xs tabular-nums", hover ? ui.strong : ui.muted)} aria-live="polite">
        {hoverText()}
      </p>
      <p className={cn("text-[11px]", ui.muted)}>{text.tickNote}</p>
    </div>
  );
};

export default VolumeHeatmap;

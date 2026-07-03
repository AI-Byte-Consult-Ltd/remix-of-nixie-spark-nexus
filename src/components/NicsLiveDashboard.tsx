import { useEffect, useMemo, useState } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from "recharts";
import { Badge } from "@/components/ui/badge";

interface Props {
  compact?: boolean;
}

const SAMPLES = [
  "The tokenizer processes input sequences through byte-pair encoding...",
  "Cross-lingual transfer enables seamless multilingual reasoning...",
  "Distributed batch pipeline synchronizing with Azure F-series node...",
  "Speculative decoding path selected for low-latency inference...",
  "Checkpoint verified. Resuming multilingual training epoch...",
];

const INPUTS = [
  { input: ["The", "multilingual", "model", "processes"], tokens: [134, 95, 916, 47, 774, 319], preds: [["input", 0.38], ["sequences", 0.27], ["tokens", 0.19], ["data", 0.09]] },
  { input: ["Cross-lingual", "transfer", "enables"], tokens: [129, 87, 919, 53, 774, 316], preds: [["seamless", 0.35], ["efficient", 0.28], ["dynamic", 0.15], ["robust", 0.12]] },
  { input: ["Attention", "layers", "align"], tokens: [451, 209, 88, 33, 612], preds: [["weights", 0.41], ["tokens", 0.22], ["heads", 0.18], ["values", 0.11]] },
] as const;

function seedLoss(): { i: number; loss: number }[] {
  const arr: { i: number; loss: number }[] = [];
  let l = 3.6;
  for (let i = 0; i < 40; i++) {
    l = Math.max(0.75, l - 0.06 - Math.random() * 0.04 + (Math.random() < 0.15 ? 0.05 : 0));
    arr.push({ i, loss: +l.toFixed(3) });
  }
  return arr;
}

const NicsLiveDashboard = ({ compact = false }: Props) => {
  const [step, setStep] = useState(419012);
  const [trainLoss, setTrainLoss] = useState(0.792);
  const [valLoss, setValLoss] = useState(0.833);
  const [tokensPerSec, setTps] = useState(12665);
  const [lr] = useState(0.00015);
  const [chart, setChart] = useState(() => seedLoss());
  const [sampleIdx, setSampleIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [inputIdx, setInputIdx] = useState(0);

  // metrics ticker
  useEffect(() => {
    const id = setInterval(() => {
      setStep((s) => s + Math.floor(20 + Math.random() * 40));
      setTrainLoss((v) => +Math.max(0.7, v + (Math.random() - 0.55) * 0.01).toFixed(3));
      setValLoss((v) => +Math.max(0.72, v + (Math.random() - 0.55) * 0.012).toFixed(3));
      setTps(() => 11000 + Math.floor(Math.random() * 4000));
      setChart((c) => {
        const next = [...c.slice(1), { i: c[c.length - 1].i + 1, loss: +Math.max(0.7, c[c.length - 1].loss + (Math.random() - 0.55) * 0.02).toFixed(3) }];
        return next;
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  // typewriter
  useEffect(() => {
    const text = SAMPLES[sampleIdx];
    if (typed.length < text.length) {
      const id = setTimeout(() => setTyped(text.slice(0, typed.length + 1)), 30);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setTyped("");
      setSampleIdx((i) => (i + 1) % SAMPLES.length);
    }, 2200);
    return () => clearTimeout(id);
  }, [typed, sampleIdx]);

  // stream logs
  useEffect(() => {
    const id = setInterval(() => {
      const t = new Date().toLocaleTimeString();
      const msgs = [
        `step=${step} loss=${trainLoss} lr=${lr}`,
        `checkpoint_sync: step_${Math.floor(step / 5000) * 5000} verified`,
        `azure_node: health check passed (100% compute)`,
        `val_loss updated: ${valLoss}`,
        `monitoring stream synchronized`,
      ];
      setLogs((prev) => [`[${t}] ${msgs[Math.floor(Math.random() * msgs.length)]}`, ...prev].slice(0, 6));
    }, 2000);
    return () => clearInterval(id);
  }, [step, trainLoss, valLoss, lr]);

  useEffect(() => {
    const id = setInterval(() => setInputIdx((i) => (i + 1) % INPUTS.length), 4000);
    return () => clearInterval(id);
  }, []);

  const progress = useMemo(() => Math.min(100, (step / 2_000_000) * 100), [step]);
  const perception = INPUTS[inputIdx];

  return (
    <div className="rounded-2xl border border-primary/20 bg-card text-foreground font-mono p-5 md:p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-foreground">NICS Live Core</div>
        <div className="flex items-center gap-2 text-[11px] tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-green-400">TRAINING ACTIVE</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-4">
        <Row k="STEP" v={`${step.toLocaleString()} / 2,000,000`} />
        <Row k="TRAIN LOSS" v={trainLoss.toFixed(3)} />
        <Row k="VAL LOSS" v={valLoss.toFixed(3)} />
        <Row k="LANG BATCH" v="EN / RU / BG / ES" />
        {!compact && <Row k="TOKENS/SEC" v={tokensPerSec.toLocaleString()} />}
        {!compact && <Row k="LEARNING RATE" v={lr.toFixed(5)} />}
        <Row k="CHECKPOINT" v={`step_${Math.floor(step / 5000) * 5000}`} />
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>PROGRESS</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-primary/10 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary/70 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Loss chart */}
      <div className="mb-4">
        <div className="text-[10px] text-muted-foreground mb-1">LOSS TREND</div>
        <div className="h-24 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chart}>
              <YAxis hide domain={["dataMin - 0.1", "dataMax + 0.1"]} />
              <Tooltip
                contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", fontSize: 11 }}
                labelStyle={{ color: "hsl(var(--primary))" }}
                formatter={(v: number) => [v, "loss"]}
              />
              <Line type="monotone" dataKey="loss" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live output */}
      <div className="rounded-lg border border-border/60 bg-muted/40 p-3 mb-4">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-1">
          LIVE OUTPUT <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
        </div>
        <div className="text-xs text-foreground min-h-[2.5rem]">
          &gt; {typed}<span className="animate-pulse">▊</span>
        </div>
      </div>

      {/* Model perception */}
      {!compact && (
        <div className="rounded-lg border border-border/60 bg-muted/40 p-3 mb-4 space-y-2">
          <div className="text-[10px] text-muted-foreground">WHAT THE MODEL SEES</div>
          <div>
            <div className="text-[10px] text-muted-foreground mb-1">INPUT</div>
            <div className="flex flex-wrap gap-1">
              {perception.input.map((w) => (
                <span key={w} className="px-1.5 py-0.5 rounded bg-primary/10 text-xs">{w}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground mb-1">TOKEN IDS</div>
            <div className="text-xs tracking-wider text-foreground/80">{perception.tokens.join(" ")}</div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground mb-1">PREDICTIONS</div>
            <div className="space-y-1">
              {perception.preds.map(([w, p]) => (
                <div key={w as string} className="flex items-center gap-2 text-xs">
                  <div className="w-16 h-1 bg-primary/10 rounded overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${(p as number) * 100}%` }} />
                  </div>
                  <span className="flex-1">{w as string}</span>
                  <span className="text-primary">{(p as number).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stream log */}
      {!compact && (
        <div className="rounded-lg border border-border/60 bg-muted/50 p-3">
          <div className="text-[10px] text-muted-foreground mb-1">STREAM LOG</div>
          <div className="space-y-0.5 text-[11px] text-muted-foreground">
            {logs.map((l, i) => (
              <div key={i} className="truncate">{l}</div>
            ))}
            {logs.length === 0 && <div className="text-muted-foreground/60">awaiting stream…</div>}
          </div>
        </div>
      )}

      {compact && (
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">Independent AI Stack</Badge>
          <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">Multilingual Core</Badge>
          <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">Azure Runtime</Badge>
        </div>
      )}
    </div>
  );
};

const Row = ({ k, v }: { k: string; v: string }) => (
  <>
    <div className="text-muted-foreground tracking-wider">{k}</div>
    <div className="text-right text-foreground tabular-nums">{v}</div>
  </>
);

export default NicsLiveDashboard;
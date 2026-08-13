import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface Props {
  compact?: boolean;
}

// Real numbers from the first verified nics-text-nano training run
// (nics-ai-lab, experiment exp-0001). No live backend yet -- see
// docs/architecture.md's no-mock-data rule: until a real telemetry API
// exists, this panel shows a static, honest snapshot instead of
// simulated "live" activity.
const SNAPSHOT = {
  model: "nics-text-nano",
  status: "First run complete",
  parameters: "868,992",
  architecture: "4-layer Transformer, CPU-trained",
  dataset: "Tiny Shakespeare (public domain)",
  trainLoss: "3.914",
  valLoss: "3.988",
  hardware: "CPU only, no GPU",
};

const NicsLiveDashboard = ({ compact = false }: Props) => {
  return (
    <div className="rounded-2xl border border-primary/20 bg-card text-foreground font-mono p-5 md:p-6 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-foreground">NICS AI Lab</div>
        <div className="flex items-center gap-2 text-[11px] tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400" />
          </span>
          <span className="text-sky-400">VERIFIED SNAPSHOT</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-4">
        <Row k="MODEL" v={SNAPSHOT.model} />
        <Row k="STATUS" v={SNAPSHOT.status} />
        <Row k="PARAMETERS" v={SNAPSHOT.parameters} />
        <Row k="DATASET" v={SNAPSHOT.dataset} />
        {!compact && <Row k="ARCHITECTURE" v={SNAPSHOT.architecture} />}
        {!compact && <Row k="HARDWARE" v={SNAPSHOT.hardware} />}
        <Row k="TRAIN LOSS" v={SNAPSHOT.trainLoss} />
        <Row k="VAL LOSS" v={SNAPSHOT.valLoss} />
      </div>

      {/* Honest state note */}
      <div className="rounded-lg border border-border/60 bg-muted/40 p-3 mb-4">
        <div className="text-xs text-foreground leading-relaxed">
          Trained from random initialisation, no pretrained weights. Not
          currently training continuously -- this is a snapshot of the most
          recent completed run, not a live feed.
        </div>
      </div>

      <a
        href="https://github.com/AI-Byte-Consult-Ltd/nics-ai-lab"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-[11px] text-primary hover:underline"
      >
        Full training logs &amp; checkpoints on GitHub <ExternalLink className="w-3 h-3" />
      </a>

      {compact && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">Independent AI Stack</Badge>
          <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">From-Scratch Training</Badge>
          <Badge variant="outline" className="border-primary/30 text-primary text-[10px]">Open Provenance</Badge>
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

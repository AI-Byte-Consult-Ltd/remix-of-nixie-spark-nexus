import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// The honest-state note and the GitHub link in the page language (2026-11-22).
const NOTE: Record<string, { note: string; logs: string }> = {
  en: { note: "Trained from random initialisation, no pretrained weights. Not currently training continuously -- this is a snapshot of the most recent completed run, not a live feed.", logs: "Full training logs & checkpoints on GitHub" },
  ru: { note: "Обучена со случайной инициализации, без предобученных весов. Сейчас не обучается непрерывно: это снимок последнего завершённого запуска, а не живые данные.", logs: "Полные логи обучения и чекпойнты на GitHub" },
  bg: { note: "Обучен от случайна инициализация, без предварително обучени тегла. В момента не се обучава непрекъснато: това е моментна снимка от последното завършено обучение, а не данни на живо.", logs: "Пълни логове от обучението и чекпойнти в GitHub" },
  de: { note: "Ab zufälliger Initialisierung trainiert, ohne vortrainierte Gewichte. Derzeit kein laufendes Training: Dies ist ein Stand des letzten abgeschlossenen Laufs, kein Live-Feed.", logs: "Vollständige Trainingslogs und Checkpoints auf GitHub" },
  es: { note: "Entrenado desde una inicialización aleatoria, sin pesos preentrenados. Ahora no se entrena de forma continua: es una instantánea del último entrenamiento completado, no datos en directo.", logs: "Registros completos de entrenamiento y checkpoints en GitHub" },
  fr: { note: "Entraîné à partir d'une initialisation aléatoire, sans poids pré-entraînés. Pas d'entraînement en continu pour l'instant : il s'agit d'un instantané du dernier entraînement terminé, pas d'un flux en direct.", logs: "Journaux d'entraînement complets et checkpoints sur GitHub" },
  it: { note: "Addestrato da inizializzazione casuale, senza pesi preaddestrati. Al momento non si addestra in modo continuo: è un'istantanea dell'ultimo ciclo completato, non un flusso in tempo reale.", logs: "Log di addestramento completi e checkpoint su GitHub" },
  pl: { note: "Trenowany od losowej inicjalizacji, bez wstępnie wytrenowanych wag. Obecnie nie trenuje się w sposób ciągły: to migawka ostatniego ukończonego treningu, a nie dane na żywo.", logs: "Pełne logi treningu i checkpointy na GitHubie" },
  pt: { note: "Treinado a partir de inicialização aleatória, sem pesos pré-treinados. No momento não treina de forma contínua: é um retrato do último treinamento concluído, não dados ao vivo.", logs: "Logs completos de treinamento e checkpoints no GitHub" },
  tr: { note: "Rastgele başlatmadan, önceden eğitilmiş ağırlık olmadan eğitildi. Şu an sürekli eğitilmiyor: bu, son tamamlanan eğitimin anlık görüntüsüdür, canlı veri değildir.", logs: "Tüm eğitim kayıtları ve checkpoint'ler GitHub'da" },
  zh: { note: "从随机初始化开始训练，未使用任何预训练权重。目前没有持续训练：这是最近一次完成训练的快照，而不是实时数据。", logs: "完整训练日志和检查点见 GitHub" },
  ar: { note: "مدرَّب من تهيئة عشوائية، بلا أوزان مدرَّبة مسبقًا. لا يتدرّب حاليًا بشكل مستمر: هذه لقطة من آخر عملية تدريب مكتملة، وليست بثًا مباشرًا.", logs: "سجلات التدريب الكاملة ونقاط الحفظ على GitHub" },
};

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
  dataset: "Project Gutenberg (public domain)",
  trainLoss: "3.914",
  valLoss: "3.988",
  hardware: "CPU only, no GPU",
};

const NicsLiveDashboard = ({ compact = false }: Props) => {
  const { language } = useLanguage();
  const tx = NOTE[language] ?? NOTE.en;
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
          {tx.note}
        </div>
      </div>

      <a
        href="https://github.com/AI-Byte-Consult-Ltd/nics-ai-lab"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-[11px] text-primary hover:underline"
      >
        {tx.logs} <ExternalLink className="w-3 h-3" />
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

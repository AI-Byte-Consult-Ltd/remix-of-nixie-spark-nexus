import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, Wand2, RotateCw, Check } from "lucide-react";
import {
  COLOR_IDS,
  COLOR_HEX,
  DAILY_TRIES,
  REVOLUT_SIZE_LINKS,
  SHIPPING_EUR,
  SIZE_OPTIONS,
  type ColorId,
} from "@/data/forgeCatalog";
import {
  ForgeApiError,
  fileToJpegDataUrl,
  getGeneration,
  startGeneration,
  startModel,
  type ForgeStyle,
} from "@/lib/forgeApi";
import ModelViewer from "./ModelViewer";
import { fill, type ForgeText } from "./forgeI18n";
import type { PendingOrder } from "./ForgeCheckout";

type Phase = "upload" | "generating" | "pick" | "building" | "model";

const STYLES: ForgeStyle[] = ["pet", "self", "object", "other"];
const POLL_IMAGES_MS = 3000;
const POLL_MODEL_MS = 4000;
const MAX_POLLS = 120;

interface Props {
  t: ForgeText;
  onOrder: (o: PendingOrder) => void;
}

const ForgeStudio = ({ t, onOrder }: Props) => {
  const [phase, setPhase] = useState<Phase>("upload");
  const [photo, setPhoto] = useState<string>("");
  const [style, setStyle] = useState<ForgeStyle>("pet");
  const [note, setNote] = useState("");
  const [genId, setGenId] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [triesLeft, setTriesLeft] = useState<number | null>(null);
  const [modelUrl, setModelUrl] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [size, setSize] = useState<number>(SIZE_OPTIONS[1].cm);
  const [color, setColor] = useState<ColorId>("white");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  // Bumping this token cancels any polling loop still running.
  const runRef = useRef(0);
  useEffect(() => () => { runRef.current += 1; }, []);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage("");
    try {
      setPhoto(await fileToJpegDataUrl(file));
    } catch {
      setMessage(t.photoError);
    }
  };

  const generate = async () => {
    if (!photo || busy) return;
    setBusy(true);
    setMessage("");
    const run = ++runRef.current;
    try {
      const res = await startGeneration(photo, style, note.trim());
      setGenId(res.generationId);
      setTriesLeft(res.remaining);
      setImages([]);
      setSelected(null);
      setPhase("generating");
      for (let i = 0; i < MAX_POLLS; i++) {
        await sleep(POLL_IMAGES_MS);
        if (runRef.current !== run) return;
        const s = await getGeneration(res.generationId, false);
        if (s.status === "done") {
          const full = await getGeneration(res.generationId, true);
          if (runRef.current !== run) return;
          setImages(full.images ?? []);
          setPhase("pick");
          return;
        }
        if (s.status === "failed") throw new ForgeApiError("gen_failed", 200);
      }
      throw new ForgeApiError("gen_failed", 200);
    } catch (err) {
      const code = err instanceof ForgeApiError ? err.code : "";
      setMessage(code === "not_configured" ? t.studioOffline : code === "limit_reached" ? t.limitReached : t.genFailed);
      setPhase("upload");
    } finally {
      setBusy(false);
    }
  };

  const buildModel = async () => {
    if (selected === null || busy) return;
    setBusy(true);
    setMessage("");
    setProgress(null);
    const run = ++runRef.current;
    setPhase("building");
    try {
      await startModel(genId, selected);
      for (let i = 0; i < MAX_POLLS; i++) {
        await sleep(POLL_MODEL_MS);
        if (runRef.current !== run) return;
        const s = await getGeneration(genId, false);
        if (s.model?.progress != null) setProgress(s.model.progress);
        if (s.model?.status === "SUCCEEDED" && s.model.url) {
          setModelUrl(s.model.url);
          setPhase("model");
          return;
        }
        if (s.model?.status === "FAILED" || s.model?.status === "CANCELED") throw new ForgeApiError("model_failed", 200);
      }
      throw new ForgeApiError("model_failed", 200);
    } catch (err) {
      const code = err instanceof ForgeApiError ? err.code : "";
      setMessage(code === "not_configured" ? t.studioOffline : t.modelFailed);
      setPhase("pick");
    } finally {
      setBusy(false);
    }
  };

  const retry = () => {
    runRef.current += 1;
    setPhase("upload");
    setMessage("");
  };

  const order = () => {
    const opt = SIZE_OPTIONS.find((s) => s.cm === size);
    if (!opt) return;
    onOrder({
      kind: "custom",
      itemName: `${t.studioTitle} · ${opt.cm} cm`,
      price: opt.price,
      shipping: SHIPPING_EUR,
      color,
      sizeCm: opt.cm,
      generationId: genId,
      revolutUrl: REVOLUT_SIZE_LINKS[opt.cm] ?? "",
    });
  };

  const steps = [t.stepUpload, t.stepPick, t.stepModel, t.stepPay];
  const stepIndex = phase === "upload" || phase === "generating" ? 0 : phase === "pick" ? 1 : phase === "building" ? 2 : 3;

  return (
    <section id="studio" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
              <Wand2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t.studioBadge}</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">{t.studioTitle}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t.studioSubtitle}</p>
          </div>

          <ol className="flex items-center justify-center gap-2 sm:gap-4 mb-8 text-sm">
            {steps.map((s, i) => (
              <li key={s} className={`flex items-center gap-2 ${i <= stepIndex ? "text-foreground" : "text-muted-foreground"}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${i <= stepIndex ? "bg-gradient-gold text-white" : "bg-muted"}`}>
                  {i + 1}
                </span>
                <span className="hidden sm:inline">{s}</span>
              </li>
            ))}
          </ol>

          <Card className="bg-card border-border/50">
            <CardContent className="pt-6 space-y-6">
              {message && (
                <p role="status" className="text-sm rounded-lg bg-muted px-4 py-3 text-foreground">{message}</p>
              )}

              {phase === "upload" && (
                <div className="space-y-6">
                  <label
                    htmlFor="forge-photo"
                    className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border hover:border-primary/60 transition-colors cursor-pointer p-6 text-center"
                  >
                    {photo ? (
                      <img src={photo} alt="" className="max-h-56 rounded-xl object-contain" />
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-primary" />
                        <span className="font-medium text-foreground">{t.uploadLabel}</span>
                        <span className="text-sm text-muted-foreground max-w-sm">{t.uploadHint}</span>
                      </>
                    )}
                    <input id="forge-photo" type="file" accept="image/jpeg,image/png" className="sr-only" onChange={onFile} />
                  </label>

                  <fieldset className="space-y-2">
                    <legend className="text-sm font-medium text-foreground">{t.typeLabel}</legend>
                    <div className="flex flex-wrap gap-2">
                      {STYLES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          aria-pressed={style === s}
                          onClick={() => setStyle(s)}
                          className={`px-4 py-2 rounded-full text-sm border-2 transition-colors ${style === s ? "border-primary bg-accent text-primary font-medium" : "border-border text-muted-foreground hover:border-primary/40"}`}
                        >
                          {t.types[s]}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="space-y-2">
                    <label htmlFor="forge-note" className="text-sm font-medium text-foreground">{t.noteLabel}</label>
                    <Textarea id="forge-note" rows={2} maxLength={200} value={note} placeholder={t.notePh} onChange={(e) => setNote(e.target.value)} />
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Button size="lg" disabled={!photo || busy} onClick={generate} className="w-full sm:w-auto rounded-full px-8 bg-foreground hover:bg-foreground/90 text-background">
                      <Wand2 className="mr-2 w-4 h-4" />
                      {t.generate}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {triesLeft !== null ? fill(t.triesLeft, { n: triesLeft, total: DAILY_TRIES }) : fill(t.triesLeft, { n: DAILY_TRIES, total: DAILY_TRIES })}
                    </span>
                  </div>
                </div>
              )}

              {phase === "generating" && (
                <div className="flex flex-col items-center gap-4 py-12 text-center">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="text-muted-foreground">{t.generating}</p>
                </div>
              )}

              {phase === "pick" && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-foreground text-center">{t.pickOne}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {images.map((src, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-pressed={selected === i}
                        onClick={() => setSelected(i)}
                        className={`relative rounded-2xl overflow-hidden border-4 transition-colors ${selected === i ? "border-primary" : "border-transparent hover:border-primary/40"}`}
                      >
                        <img src={src} alt={`${i + 1}`} className="w-full aspect-square object-cover" />
                        {selected === i && (
                          <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                            <Check className="w-4 h-4" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button size="lg" disabled={selected === null || busy} onClick={buildModel} className="rounded-full px-8 bg-foreground hover:bg-foreground/90 text-background">
                      {t.buildModel}
                    </Button>
                    <Button size="lg" variant="outline" onClick={retry} className="rounded-full px-8 border-2">
                      <RotateCw className="mr-2 w-4 h-4" />
                      {t.tryAgain}
                    </Button>
                  </div>
                  {triesLeft !== null && (
                    <p className="text-sm text-muted-foreground text-center">{fill(t.triesLeft, { n: triesLeft, total: DAILY_TRIES })}</p>
                  )}
                </div>
              )}

              {phase === "building" && (
                <div className="flex flex-col items-center gap-4 py-12 text-center">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="text-muted-foreground">
                    {t.buildingModel}
                    {progress !== null ? ` ${progress}%` : ""}
                  </p>
                </div>
              )}

              {phase === "model" && (
                <div className="space-y-6">
                  <div className="h-80 sm:h-96 rounded-2xl bg-muted/60 overflow-hidden">
                    <ModelViewer src={modelUrl} alt={t.studioTitle} />
                  </div>
                  <p className="text-sm text-muted-foreground text-center">{t.rotateHint}</p>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-foreground">{t.sizeTitle}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {SIZE_OPTIONS.map((s) => (
                        <button
                          key={s.cm}
                          type="button"
                          aria-pressed={size === s.cm}
                          onClick={() => setSize(s.cm)}
                          className={`rounded-2xl border-2 p-4 text-center transition-colors ${size === s.cm ? "border-primary bg-accent" : "border-border hover:border-primary/40"}`}
                        >
                          <div className="text-lg font-semibold text-foreground">{s.cm} cm</div>
                          <div className="text-primary font-medium">€{s.price}</div>
                          <div className="text-xs text-muted-foreground">+ €{SHIPPING_EUR}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">{t.optColor}</div>
                    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.optColor}>
                      {COLOR_IDS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          role="radio"
                          aria-checked={color === c}
                          aria-label={t.colors[c]}
                          title={t.colors[c]}
                          onClick={() => setColor(c)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform ${color === c ? "border-primary scale-110 ring-2 ring-primary/30" : "border-border"}`}
                          style={{ backgroundColor: COLOR_HEX[c] }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button size="lg" onClick={order} className="rounded-full px-8 bg-foreground hover:bg-foreground/90 text-background">
                      {t.confirmOrder}
                    </Button>
                    <Button size="lg" variant="outline" onClick={() => { setPhase("pick"); setMessage(""); }} className="rounded-full px-8 border-2">
                      {t.pickOne}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ForgeStudio;

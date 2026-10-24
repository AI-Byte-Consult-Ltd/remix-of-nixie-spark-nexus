// Speech recognition for NICS Studio captions. Runs Whisper (base, 8-bit) in a
// Web Worker on the visitor's device; the model and the ONNX runtime are served
// from our own site (public/models, public/ort), nothing goes to a third party.
import { env, pipeline, type AutomaticSpeechRecognitionPipeline } from "@huggingface/transformers";

// pipeline() is overloaded per task; typing it loosely keeps TypeScript from
// expanding every overload into one huge union.
const createPipeline = pipeline as unknown as (task: string, model: string, options: object) => Promise<AutomaticSpeechRecognitionPipeline>;

env.allowRemoteModels = false;
env.allowLocalModels = true;
env.localModelPath = "/models/";
env.useBrowserCache = true;
if (env.backends.onnx.wasm) env.backends.onnx.wasm.wasmPaths = "/ort/";

let asr: Promise<AutomaticSpeechRecognitionPipeline> | null = null;

const load = () => {
  asr ??= createPipeline("automatic-speech-recognition", "whisper-base", {
    dtype: { encoder_model: "q8", decoder_model_merged: "q8" },
    device: "wasm",
    progress_callback: (p: { status: string; progress?: number; file?: string }) => {
      if (p.status === "progress" && p.file?.endsWith(".onnx")) {
        self.postMessage({ type: "loading", file: p.file, progress: (p.progress ?? 0) / 100 });
      }
    },
  });
  return asr;
};

interface Chunk {
  text: string;
  timestamp: [number, number | null];
}

self.onmessage = async (e: MessageEvent<{ audio: Float32Array; language: string | null }>) => {
  try {
    const transcriber = await load();
    self.postMessage({ type: "running" });
    const out = (await transcriber(e.data.audio, {
      chunk_length_s: 30,
      stride_length_s: 5,
      return_timestamps: true,
      ...(e.data.language ? { language: e.data.language, task: "transcribe" } : {}),
    })) as { text: string; chunks?: Chunk[] };
    self.postMessage({ type: "done", chunks: out.chunks ?? [] });
  } catch (err) {
    self.postMessage({ type: "error", message: err instanceof Error ? err.message : String(err) });
  }
};

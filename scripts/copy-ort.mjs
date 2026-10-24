// Copies the ONNX Runtime WebAssembly files used by @huggingface/transformers
// into public/ort, so NICS Studio's speech recognition loads them from our own
// site instead of a public CDN. public/ort is generated, not committed.
import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";

const from = path.resolve("node_modules/@huggingface/transformers/dist");
const to = path.resolve("public/ort");
await mkdir(to, { recursive: true });
for (const name of ["ort-wasm-simd-threaded.jsep.mjs", "ort-wasm-simd-threaded.jsep.wasm"]) {
  await copyFile(path.join(from, name), path.join(to, name));
}
console.log("Copied ONNX Runtime files to public/ort.");

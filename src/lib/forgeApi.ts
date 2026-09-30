import { FORGE_API_BASE } from "@/data/forgeCatalog";

export type ForgeStyle = "pet" | "self" | "object" | "other";

export interface ForgeModelState {
  status: "PENDING" | "IN_PROGRESS" | "SUCCEEDED" | "FAILED" | "CANCELED";
  progress: number | null;
  error: string | null;
  url: string | null;
}

export interface ForgeGenerationState {
  ok: boolean;
  generationId: string;
  status: "pending" | "done" | "failed";
  error: string | null;
  chosenIndex: number | null;
  model: ForgeModelState | null;
  images?: string[];
}

export class ForgeApiError extends Error {
  constructor(public code: string, public httpStatus: number) {
    super(code);
  }
}

const CLIENT_KEY = "nics-forge-client";

export const getClientId = (): string => {
  try {
    let id = localStorage.getItem(CLIENT_KEY);
    if (!id) {
      id = "c" + crypto.randomUUID().replace(/-/g, "");
      localStorage.setItem(CLIENT_KEY, id);
    }
    return id;
  } catch {
    return "c" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }
};

const call = async <T,>(path: string, init?: RequestInit): Promise<T> => {
  let res: Response;
  try {
    res = await fetch(`${FORGE_API_BASE}/${path}`, init);
  } catch {
    throw new ForgeApiError("network", 0);
  }
  let data: { ok?: boolean; error?: string } | null = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON error */
  }
  if (!res.ok || !data || data.ok === false) {
    throw new ForgeApiError(data?.error ?? "server", res.status);
  }
  return data as unknown as T;
};

const post = <T,>(path: string, body: unknown) =>
  call<T>(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

/** Downscale a photo in the browser: smaller upload, cheaper generation. */
export const fileToJpegDataUrl = (file: File, maxSide = 1024): Promise<string> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("canvas"));
        return;
      }
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image"));
    };
    img.src = url;
  });

export const startGeneration = (photo: string, style: ForgeStyle, note: string) =>
  post<{ ok: true; generationId: string; remaining: number; dailyLimit: number }>("forge-generate", {
    clientId: getClientId(),
    photo,
    style,
    note,
  });

export const getGeneration = (id: string, withImages: boolean) =>
  call<ForgeGenerationState>(`forge-status?id=${encodeURIComponent(id)}${withImages ? "&images=1" : ""}`);

export const startModel = (generationId: string, index: number) =>
  post<{ ok: true }>("forge-model-start", { generationId, index });

export interface OrderPayload {
  kind: "catalog" | "custom";
  itemId?: string;
  color: string;
  text?: string;
  sizeCm?: number;
  generationId?: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  lang: string;
  website: string; // honeypot, must stay empty
}

export const createOrder = (payload: OrderPayload) =>
  post<{ ok: true; ref: string; total: number }>("forge-order", payload);

export const reportPaid = (ref: string, email: string) => post<{ ok: true }>("forge-paid", { ref, email });

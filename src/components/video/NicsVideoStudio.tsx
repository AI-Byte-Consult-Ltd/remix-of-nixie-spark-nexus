import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Download, Film, Loader2, Upload } from "lucide-react";
import type { Language } from "@/contexts/LanguageContext";

// n8n [26 VIDEO] Jobs API + [27 VIDEO] File Transfer. Files travel in parts of
// at most PART_SIZE bytes; the server checks access (demo or paid order for the
// email) on create, and a worker picks the job up once all parts are in.
const API = "https://n8n.aibyteconsult.com/webhook";
const PART_SIZE = 3 * 1024 * 1024;
const MAX_FILES = 20;
const MAX_FILE_BYTES = 1024 * 1024 * 1024;
const MAX_TOTAL_BYTES = 1500 * 1024 * 1024;
const EXTENSIONS = [".mp4", ".mov", ".avi", ".mkv", ".m4v", ".3gp"];
const STORAGE_KEY = "nicsVideoJob";
const POLL_MS = 10000;

type Phase = "form" | "uploading" | "tracking";

interface JobRef {
  jobId: string;
  key: string;
}

interface OutputFile {
  name: string;
  size: number;
  parts: number;
}

interface JobStatus {
  status: "uploading" | "queued" | "processing" | "done" | "failed" | "expired";
  stage: string | null;
  ahead: number | null;
  outputs: OutputFile[] | null;
  title: string | null;
}

interface Props {
  lang: Language;
  email: string;
  onEmailChange: (email: string) => void;
  onNeedAccess: () => void;
}

const text = {
  en: {
    heading: "Upload your footage",
    intro: "Use the email of your demo or subscription. You will get a Short (9:16), a Long video (16:9) and covers.",
    email: "Email",
    title: "Cover title",
    titleEn: "Cover title in English (optional)",
    files: "Video files",
    filesHint: "Up to 20 clips, 1.5 GB in total. MP4, MOV, AVI, MKV, M4V, 3GP.",
    submit: "Upload and start",
    uploading: "Uploading",
    keepOpen: "Keep this page open until the upload finishes.",
    queued: (ahead: number) => (ahead > 0 ? `In the queue, ${ahead} ahead of you.` : "In the queue, you are next."),
    processing: "Editing your video",
    done: "Your package is ready",
    failed: "Processing failed. We have been notified and will get back to you by email.",
    expired: "This job has expired. Files are kept for 7 days.",
    leaveNote: "You can close this page: it will remember the job, and the link from the email opens it too.",
    download: "Download",
    downloading: "Downloading",
    newJob: "New upload",
    errors: {
      no_access: "No active demo or subscription for this email. Start a free demo or pick a plan below.",
      demo_used: "Your demo packages are used up. Pick a plan to continue.",
      limit_reached: "You have used all packages of your plan for this month.",
      job_in_progress: "You already have a job in progress. Wait for it to finish.",
      email: "Check the email address.",
      files_count: "Choose between 1 and 20 video files.",
      file_type: "Only MP4, MOV, AVI, MKV, M4V and 3GP files are supported.",
      file_size: "Each file must be under 1 GB.",
      total_size: "The files are larger than 1.5 GB in total.",
      incomplete_upload: "Some parts did not upload. Please try again.",
      network: "Connection problem. Please try again.",
      generic: "Something went wrong. Please try again or write to info@aibyteconsult.com.",
    } as Record<string, string>,
    stages: {
      queued: "Waiting for a free editor",
      claimed: "Starting",
      download: "Receiving files",
      analyze: "Analysing scenes",
      plan: "Planning the edit",
      render_long: "Rendering the long video",
      render_shorts: "Rendering the Short",
      covers: "Making covers",
      upload: "Finishing",
    } as Record<string, string>,
    getAccess: "Get access",
  },
  ru: {
    heading: "Загрузите исходники",
    intro: "Укажите email демо или подписки. Вы получите Short (9:16), длинное видео (16:9) и обложки.",
    email: "Email",
    title: "Заголовок для обложки",
    titleEn: "Заголовок на английском (необязательно)",
    files: "Видеофайлы",
    filesHint: "До 20 клипов, всего до 1,5 ГБ. MP4, MOV, AVI, MKV, M4V, 3GP.",
    submit: "Загрузить и начать",
    uploading: "Загрузка",
    keepOpen: "Не закрывайте страницу, пока идёт загрузка.",
    queued: (ahead: number) => (ahead > 0 ? `В очереди, перед вами ${ahead}.` : "В очереди, вы следующий."),
    processing: "Монтируем видео",
    done: "Пакет готов",
    failed: "Обработка не удалась. Мы уже знаем об этом и напишем вам на email.",
    expired: "Срок хранения задачи истёк. Файлы хранятся 7 дней.",
    leaveNote: "Страницу можно закрыть: она запомнит задачу, а ссылка из письма откроет её снова.",
    download: "Скачать",
    downloading: "Скачивание",
    newJob: "Новая загрузка",
    errors: {
      no_access: "Для этого email нет активного демо или подписки. Начните бесплатное демо или выберите тариф ниже.",
      demo_used: "Пакеты демо израсходованы. Выберите тариф, чтобы продолжить.",
      limit_reached: "Все пакеты тарифа в этом месяце израсходованы.",
      job_in_progress: "У вас уже есть задача в работе. Дождитесь её завершения.",
      email: "Проверьте email.",
      files_count: "Выберите от 1 до 20 видеофайлов.",
      file_type: "Поддерживаются только MP4, MOV, AVI, MKV, M4V и 3GP.",
      file_size: "Каждый файл должен быть меньше 1 ГБ.",
      total_size: "Суммарный размер файлов больше 1,5 ГБ.",
      incomplete_upload: "Часть файлов не загрузилась. Попробуйте ещё раз.",
      network: "Проблема со связью. Попробуйте ещё раз.",
      generic: "Что-то пошло не так. Попробуйте ещё раз или напишите на info@aibyteconsult.com.",
    } as Record<string, string>,
    stages: {
      queued: "Ждём свободного монтажёра",
      claimed: "Начинаем",
      download: "Получаем файлы",
      analyze: "Анализируем сцены",
      plan: "Составляем монтаж",
      render_long: "Рендерим длинное видео",
      render_shorts: "Рендерим Short",
      covers: "Делаем обложки",
      upload: "Завершаем",
    } as Record<string, string>,
    getAccess: "Получить доступ",
  },
};

class ApiError extends Error {}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Retries network errors and 5xx: large uploads over home Wi-Fi drop now and then.
async function request(url: string, init: RequestInit, retries = 4): Promise<Response> {
  for (let attempt = 0; ; attempt++) {
    try {
      const res = await fetch(url, init);
      if (res.status < 500 || attempt === retries) return res;
    } catch {
      if (attempt === retries) throw new ApiError("network");
    }
    await sleep(2000 * 2 ** attempt);
  }
}

async function postJson(path: string, body: unknown) {
  const res = await request(`${API}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok) throw new ApiError(data?.error || "generic");
  return data;
}

function readSavedJob(): JobRef | null {
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("job");
  const key = params.get("key");
  if (jobId && key) return { jobId, key };
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved?.jobId && saved?.key) return saved;
  } catch {
    // Storage blocked or corrupt: start fresh.
  }
  return null;
}

function saveJob(job: JobRef | null) {
  try {
    if (job) localStorage.setItem(STORAGE_KEY, JSON.stringify(job));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Not fatal: the email link still opens the job.
  }
}

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 * 1024 ? `${(bytes / 1024 ** 3).toFixed(1)} GB` : `${Math.max(1, Math.round(bytes / 1024 ** 2))} MB`;

const NicsVideoStudio = ({ lang, email, onEmailChange, onNeedAccess }: Props) => {
  const t = lang === "ru" ? text.ru : text.en;
  const [phase, setPhase] = useState<Phase>("form");
  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadPct, setUploadPct] = useState(0);
  const [job, setJob] = useState<JobRef | null>(null);
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [downloads, setDownloads] = useState<Record<string, number | string>>({});
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = readSavedJob();
    if (saved) {
      setJob(saved);
      setPhase("tracking");
    }
  }, []);

  const loadStatus = useCallback(async (ref: JobRef) => {
    const res = await request(`${API}/nics-video-status?job=${encodeURIComponent(ref.jobId)}&key=${encodeURIComponent(ref.key)}`, {}, 2);
    const data = await res.json().catch(() => null);
    if (res.status === 404) return null;
    if (!res.ok || !data?.ok) throw new ApiError("generic");
    return data as JobStatus;
  }, []);

  useEffect(() => {
    if (phase !== "tracking" || !job) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = async () => {
      try {
        const s = await loadStatus(job);
        if (stopped) return;
        if (!s || s.status === "uploading") {
          // Unknown or never submitted (the upload was interrupted): back to the form.
          saveJob(null);
          setJob(null);
          setPhase("form");
          return;
        }
        setStatus(s);
        if (s.status === "queued" || s.status === "processing") timer = setTimeout(tick, POLL_MS);
      } catch {
        if (!stopped) timer = setTimeout(tick, POLL_MS * 3);
      }
    };
    tick();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [phase, job, loadStatus]);

  const pickFiles = (list: FileList | null) => {
    setError(null);
    setFiles(Array.from(list ?? []));
  };

  const validate = (): string | null => {
    if (!files.length || files.length > MAX_FILES) return "files_count";
    if (files.some((f) => !EXTENSIONS.some((ext) => f.name.toLowerCase().endsWith(ext)))) return "file_type";
    if (files.some((f) => f.size <= 0 || f.size > MAX_FILE_BYTES)) return "file_size";
    if (files.reduce((sum, f) => sum + f.size, 0) > MAX_TOTAL_BYTES) return "total_size";
    return null;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const invalid = validate();
    if (invalid) {
      setError(invalid);
      return;
    }
    setError(null);
    setPhase("uploading");
    setUploadPct(0);
    try {
      const created = await postJson("nics-video-create", {
        email,
        title,
        titleEn,
        lang,
        files: files.map((f) => ({ name: f.name, size: f.size })),
      });
      const ref = { jobId: String(created.jobId), key: String(created.key) };
      const totalParts = files.reduce((sum, f) => sum + Math.ceil(f.size / PART_SIZE), 0);
      let sent = 0;
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const parts = Math.ceil(file.size / PART_SIZE);
        for (let part = 0; part < parts; part++) {
          const res = await request(
            `${API}/nics-video-upload?job=${ref.jobId}&key=${ref.key}&file=${index}&part=${part}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/octet-stream" },
              body: file.slice(part * PART_SIZE, (part + 1) * PART_SIZE),
            },
          );
          if (!res.ok) throw new ApiError("generic");
          sent++;
          setUploadPct(Math.round((sent / totalParts) * 100));
        }
      }
      await postJson("nics-video-submit", ref);
      saveJob(ref);
      setJob(ref);
      setStatus(null);
      setFiles([]);
      if (fileInput.current) fileInput.current.value = "";
      setPhase("tracking");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "generic");
      setPhase("form");
    }
  };

  const download = async (file: OutputFile) => {
    if (!job || typeof downloads[file.name] === "number") return;
    try {
      const chunks: Blob[] = [];
      for (let part = 0; part < file.parts; part++) {
        setDownloads((d) => ({ ...d, [file.name]: Math.round((part / file.parts) * 100) }));
        const res = await request(
          `${API}/nics-video-download?job=${job.jobId}&key=${job.key}&name=${encodeURIComponent(file.name)}&part=${part}`,
          {},
        );
        if (!res.ok) throw new ApiError("generic");
        chunks.push(await res.blob());
      }
      const type = file.name.endsWith(".png") ? "image/png" : "video/mp4";
      const url = URL.createObjectURL(new Blob(chunks, { type }));
      const a = document.createElement("a");
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      setDownloads((d) => ({ ...d, [file.name]: "done" }));
    } catch {
      setDownloads((d) => ({ ...d, [file.name]: "error" }));
    }
  };

  const reset = () => {
    saveJob(null);
    setJob(null);
    setStatus(null);
    setDownloads({});
    setError(null);
    setPhase("form");
    if (window.location.search.includes("job=")) window.history.replaceState(null, "", window.location.pathname + "#studio");
  };

  const accessError = error === "no_access" || error === "demo_used" || error === "limit_reached";

  return (
    <Card className="bg-card border-border/50 shadow-card">
      <CardContent className="pt-8 pb-8 space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-foreground flex items-center gap-3">
            <Film className="w-6 h-6 text-primary" />
            {t.heading}
          </h3>
          <p className="text-muted-foreground">{t.intro}</p>
        </div>

        {phase === "form" && (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nvs-email">{t.email}</Label>
              <Input id="nvs-email" type="email" required maxLength={200} value={email} onChange={(e) => onEmailChange(e.target.value)} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nvs-title">{t.title}</Label>
                <Input id="nvs-title" maxLength={80} value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nvs-title-en">{t.titleEn}</Label>
                <Input id="nvs-title-en" maxLength={80} value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nvs-files">{t.files}</Label>
              <Input
                id="nvs-files"
                ref={fileInput}
                type="file"
                multiple
                required
                accept={EXTENSIONS.join(",") + ",video/*"}
                onChange={(e) => pickFiles(e.target.files)}
              />
              <p className="text-sm text-muted-foreground">
                {files.length > 0 ? `${files.length} · ${formatSize(files.reduce((s, f) => s + f.size, 0))}. ` : ""}
                {t.filesHint}
              </p>
            </div>
            {error && (
              <div className="flex gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{t.errors[error] ?? t.errors.generic}</span>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <Button type="submit" size="lg" className="rounded-full px-8 bg-foreground hover:bg-foreground/90 text-background">
                <Upload className="mr-2 w-4 h-4" />
                {t.submit}
              </Button>
              {accessError && (
                <Button type="button" size="lg" variant="outline" className="rounded-full px-8 border-2" onClick={onNeedAccess}>
                  {t.getAccess}
                </Button>
              )}
            </div>
          </form>
        )}

        {phase === "uploading" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              {t.uploading} · {uploadPct}%
            </div>
            <Progress value={uploadPct} />
            <p className="text-sm text-muted-foreground">{t.keepOpen}</p>
          </div>
        )}

        {phase === "tracking" && (
          <div className="space-y-4">
            {!status && <Loader2 className="w-5 h-5 animate-spin text-primary" />}
            {status && (status.status === "queued" || status.status === "processing") && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-foreground">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  {status.status === "queued" ? t.queued(status.ahead ?? 0) : `${t.processing}: ${t.stages[status.stage ?? ""] ?? status.stage}`}
                </div>
                <p className="text-sm text-muted-foreground">{t.leaveNote}</p>
              </div>
            )}
            {status?.status === "done" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-foreground font-medium">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  {t.done}
                  {status.title ? ` · ${status.title}` : ""}
                </div>
                <ul className="space-y-2">
                  {(status.outputs ?? []).map((f) => {
                    const state = downloads[f.name];
                    return (
                      <li key={f.name} className="flex items-center justify-between gap-3 rounded-lg border border-border/50 px-4 py-3">
                        <span className="text-sm text-foreground break-all">
                          {f.name} <span className="text-muted-foreground">· {formatSize(f.size)}</span>
                        </span>
                        <Button size="sm" variant="outline" className="rounded-full shrink-0" onClick={() => download(f)} disabled={typeof state === "number"}>
                          {typeof state === "number" ? (
                            <>
                              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                              {state}%
                            </>
                          ) : (
                            <>
                              {state === "done" ? <CheckCircle2 className="mr-2 w-4 h-4" /> : <Download className="mr-2 w-4 h-4" />}
                              {t.download}
                            </>
                          )}
                        </Button>
                      </li>
                    );
                  })}
                </ul>
                {Object.values(downloads).includes("error") && <p className="text-sm text-destructive">{t.errors.network}</p>}
              </div>
            )}
            {status?.status === "failed" && <p className="text-destructive">{t.failed}</p>}
            {status?.status === "expired" && <p className="text-muted-foreground">{t.expired}</p>}
            {status && status.status !== "queued" && status.status !== "processing" && (
              <Button variant="outline" className="rounded-full border-2" onClick={reset}>
                <Upload className="mr-2 w-4 h-4" />
                {t.newJob}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NicsVideoStudio;

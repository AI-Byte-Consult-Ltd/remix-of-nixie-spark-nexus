// Saved NICS Studio projects, kept in the browser's IndexedDB on the user's
// device: the project itself, the agent chat, and the source files. Every call
// can fail (private window, blocked or full storage), so callers treat a
// failure as "not saved" and keep working.
import type { Clip, Music, Project } from "./model";
import type { AgentMessage } from "./AgentPanel";

const DB_NAME = "nics-studio";
const PROJECTS = "projects";
const FILES = "files";

type StoredClip = Omit<Clip, "file" | "url"> & { fileKey: string; type: string };
type StoredMusic = Omit<Music, "file" | "url"> & { fileKey: string; type: string };
type StoredProject = Omit<Project, "clips" | "music"> & { clips: StoredClip[]; music: StoredMusic | null };

export interface SavedSummary {
  id: string;
  title: string;
  updatedAt: number;
  duration: number;
  thumb: string | null;
}

interface SavedRecord extends SavedSummary {
  project: StoredProject;
  messages: AgentMessage[];
}

export interface LoadedProject {
  project: Project;
  messages: AgentMessage[];
}

let dbPromise: Promise<IDBDatabase> | null = null;

const openDb = () => {
  if (!dbPromise) {
    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(PROJECTS)) db.createObjectStore(PROJECTS, { keyPath: "id" });
        if (!db.objectStoreNames.contains(FILES)) db.createObjectStore(FILES);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    }).catch((err) => {
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
};

const done = (tx: IDBTransaction) =>
  new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });

const result = <T>(req: IDBRequest<T>) =>
  new Promise<T>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

// One key per source file, shared by every clip cut from it.
const fileIds = new WeakMap<File, string>();
const fileId = (f: File) => {
  let id = fileIds.get(f);
  if (!id) {
    id = Math.random().toString(36).slice(2, 12);
    fileIds.set(f, id);
  }
  return id;
};
const fileKey = (projectId: string, f: File) => `${projectId}/${fileId(f)}`;
const projectRange = (projectId: string) => IDBKeyRange.bound(`${projectId}/`, `${projectId}/￿`);

export const newProjectId = () => `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

export const listProjects = async (): Promise<SavedSummary[]> => {
  const db = await openDb();
  const all = await result(db.transaction(PROJECTS).objectStore(PROJECTS).getAll() as IDBRequest<SavedRecord[]>);
  return all
    .map(({ id, title, updatedAt, duration, thumb }) => ({ id, title, updatedAt, duration, thumb }))
    .sort((a, b) => b.updatedAt - a.updatedAt);
};

export const saveProject = async (
  id: string,
  p: Project,
  messages: AgentMessage[],
  meta: { duration: number; thumb: string | null },
) => {
  const db = await openDb();
  const files = new Map<string, File>();
  const clips = p.clips.map(({ file, url: _url, ...rest }) => {
    const key = fileKey(id, file);
    files.set(key, file);
    return { ...rest, fileKey: key, type: file.type };
  });
  let music: StoredMusic | null = null;
  if (p.music) {
    const { file, url: _url, ...rest } = p.music;
    const key = fileKey(id, file);
    files.set(key, file);
    music = { ...rest, fileKey: key, type: file.type };
  }
  const tx = db.transaction([PROJECTS, FILES], "readwrite");
  const fileStore = tx.objectStore(FILES);
  const existing = new Set((await result(fileStore.getAllKeys(projectRange(id)))).map(String));
  files.forEach((file, key) => {
    if (!existing.has(key)) fileStore.put(file, key);
  });
  existing.forEach((key) => {
    if (!files.has(key)) fileStore.delete(key);
  });
  const record: SavedRecord = {
    id,
    title: p.title,
    updatedAt: Date.now(),
    duration: meta.duration,
    thumb: meta.thumb,
    project: { ...p, clips, music },
    messages,
  };
  tx.objectStore(PROJECTS).put(record);
  await done(tx);
};

export const loadProject = async (id: string): Promise<LoadedProject | null> => {
  const db = await openDb();
  const tx = db.transaction([PROJECTS, FILES]);
  const record = await result(tx.objectStore(PROJECTS).get(id) as IDBRequest<SavedRecord | undefined>);
  if (!record) return null;
  const fileStore = tx.objectStore(FILES);
  const blobs = new Map<string, Blob>();
  const keys = [...record.project.clips.map((c) => c.fileKey), ...(record.project.music ? [record.project.music.fileKey] : [])];
  for (const key of new Set(keys)) {
    const blob = await result(fileStore.get(key) as IDBRequest<Blob | undefined>);
    if (blob) blobs.set(key, blob);
  }
  // Files and URLs are rebuilt once per source, so clips cut from one file
  // share it again.
  const restored = new Map<string, { file: File; url: string }>();
  const restore = (key: string, name: string, type: string) => {
    let r = restored.get(key);
    const blob = blobs.get(key);
    if (!r && blob) {
      const file = blob instanceof File ? blob : new File([blob], name, { type });
      r = { file, url: URL.createObjectURL(file) };
      fileIds.set(file, key.slice(key.indexOf("/") + 1));
      restored.set(key, r);
    }
    return r;
  };
  const clips: Clip[] = [];
  for (const { fileKey: key, type, ...c } of record.project.clips) {
    const r = restore(key, c.name, type);
    if (r) clips.push({ ...c, ...r });
  }
  let music: Music | null = null;
  if (record.project.music) {
    const { fileKey: key, type, ...m } = record.project.music;
    const r = restore(key, m.name, type);
    if (r) music = { ...m, ...r };
  }
  return { project: { ...record.project, clips, music }, messages: record.messages ?? [] };
};

export const deleteProject = async (id: string) => {
  const db = await openDb();
  const tx = db.transaction([PROJECTS, FILES], "readwrite");
  tx.objectStore(PROJECTS).delete(id);
  tx.objectStore(FILES).delete(projectRange(id));
  await done(tx);
};

// Ask the browser not to clear saved projects under storage pressure.
export const requestPersistence = () => {
  try {
    navigator.storage?.persist?.().catch(() => {});
  } catch {
    /* not supported */
  }
};

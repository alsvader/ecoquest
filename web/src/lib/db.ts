import type { LogEntry, Progress } from "./types";

const DB_NAME = "ecoquest";
const DB_VERSION = 1;
const STORES = ["kv", "photos", "logs"] as const;

export interface StoredPhoto {
  id: string;
  missionId: string;
  blob: Blob;
  createdAt: number;
}

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") return reject(new Error("indexedDB unavailable"));
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      db.createObjectStore("kv", { keyPath: "id" });
      db.createObjectStore("photos", { keyPath: "id" });
      db.createObjectStore("logs", { keyPath: "id", autoIncrement: true });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(
  store: (typeof STORES)[number],
  mode: IDBTransactionMode,
  fn: (s: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const db = await open();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(store, mode);
      const req = fn(tx.objectStore(store));
      tx.oncomplete = () => resolve(req.result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

export const getProgress = () => run<Progress | undefined>("kv", "readonly", (s) => s.get("current"));
export const saveProgress = (p: Progress) => run("kv", "readwrite", (s) => s.put(p)).then(() => undefined);

export const savePhoto = (photo: StoredPhoto) => run("photos", "readwrite", (s) => s.put(photo)).then(() => undefined);
export const getPhoto = (id: string) => run<StoredPhoto | undefined>("photos", "readonly", (s) => s.get(id));
export const deletePhoto = (id: string) => run("photos", "readwrite", (s) => s.delete(id)).then(() => undefined);

export const appendLog = (e: LogEntry) => run("logs", "readwrite", (s) => s.add(e)).then(() => undefined);
export const getLogs = () => run<LogEntry[]>("logs", "readonly", (s) => s.getAll());

/** Borrado total: progreso, fotos y registro (FR-12). */
export async function clearAll(): Promise<void> {
  const db = await open();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([...STORES], "readwrite");
      for (const s of STORES) tx.objectStore(s).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}

/** Borra solo las fotos (progreso y registro se conservan). «Borrar mis fotos» (RF-12). */
export async function clearPhotos(): Promise<void> {
  await run("photos", "readwrite", (s) => s.clear());
}

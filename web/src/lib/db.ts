import { parseProgress } from "./session";
import type { LogEntry, Progress } from "./types";

const DB_NAME = "ecoquest";
const DB_VERSION = 1;
/** Tope de entradas del registro local (se conservan las más recientes). */
export const MAX_LOGS = 500;
const STORES = ["kv", "photos", "logs"] as const;

/** El almacenamiento local está lleno (cuota excedida) al guardar una foto. */
export class StorageQuotaError extends Error {
  constructor() {
    super("storage quota exceeded");
    this.name = "StorageQuotaError";
  }
}

function isQuotaError(e: unknown): boolean {
  return (
    typeof e === "object" && e !== null && (e as { name?: string }).name === "QuotaExceededError"
  );
}

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
    req.onsuccess = () => {
      const db = req.result;
      // Otra pestaña pide actualizar/borrar la base: cerrar para no bloquearla.
      db.onversionchange = () => db.close();
      resolve(db);
    };
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error("indexedDB blocked by another connection"));
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

/** Progreso guardado, o null si no hay o su forma es inválida (datos corruptos). */
export const getProgress = () =>
  run<unknown>("kv", "readonly", (s) => s.get("current")).then((raw) => parseProgress(raw));
export const saveProgress = (p: Progress) => run("kv", "readwrite", (s) => s.put(p)).then(() => undefined);

export const savePhoto = (photo: StoredPhoto) =>
  run("photos", "readwrite", (s) => s.put(photo))
    .then(() => undefined)
    .catch((e) => {
      throw isQuotaError(e) ? new StorageQuotaError() : e;
    });
export const getPhoto = (id: string) => run<StoredPhoto | undefined>("photos", "readonly", (s) => s.get(id));
export const deletePhoto = (id: string) => run("photos", "readwrite", (s) => s.delete(id)).then(() => undefined);

export async function appendLog(e: LogEntry): Promise<void> {
  const db = await open();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("logs", "readwrite");
      const store = tx.objectStore("logs");
      store.add(e);
      // Recorta a las últimas MAX_LOGS entradas (claves autoincrementales: las más antiguas primero).
      const count = store.count();
      count.onsuccess = () => {
        const extra = count.result - MAX_LOGS;
        if (extra <= 0) return;
        let left = extra;
        const cursor = store.openCursor();
        cursor.onsuccess = () => {
          const c = cursor.result;
          if (!c || left-- <= 0) return;
          c.delete();
          c.continue();
        };
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}
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

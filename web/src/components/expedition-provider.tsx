"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { MissionId } from "@/data/expedition";
import { clearAll, clearPhotos, deletePhoto, getProgress, savePhoto, saveProgress } from "@/lib/db";
import {
  applyClassification,
  applyManual,
  applyPending,
  createProgress,
  finishProgress,
} from "@/lib/session";
import type { ClassifyResponse, Progress } from "@/lib/types";

interface Ctx {
  loaded: boolean;
  storageOk: boolean;
  progress: Progress | null;
  start: () => void;
  recordPhoto: (id: MissionId, blob: Blob) => Promise<string>;
  recordResult: (id: MissionId, resp: ClassifyResponse, photoId: string) => void;
  recordPending: (id: MissionId, photoId: string) => void;
  markManual: (id: MissionId) => void;
  finish: () => void;
  /** Borra las fotos guardadas; las misiones conservan su estado pero sin foto. */
  deletePhotos: () => Promise<void>;
  deleteEverything: () => Promise<void>;
}

const ExpeditionContext = createContext<Ctx | null>(null);

export function useExpedition(): Ctx {
  const ctx = useContext(ExpeditionContext);
  if (!ctx) throw new Error("useExpedition fuera de ExpeditionProvider");
  return ctx;
}

export function ExpeditionProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgressState] = useState<Progress | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const ref = useRef<Progress | null>(null);

  useEffect(() => {
    getProgress()
      .then((p) => {
        ref.current = p ?? null;
        setProgressState(p ?? null);
      })
      .catch(() => setStorageOk(false))
      .finally(() => setLoaded(true));
  }, []);

  const commit = useCallback((next: Progress | null) => {
    ref.current = next;
    setProgressState(next);
    if (next) saveProgress(next).catch(() => setStorageOk(false));
  }, []);

  const mutate = useCallback(
    (fn: (p: Progress) => Progress) => {
      if (ref.current) commit(fn(ref.current));
    },
    [commit],
  );

  const value = useMemo<Ctx>(
    () => ({
      loaded,
      storageOk,
      progress,
      start: () => commit(createProgress(Date.now())),
      recordPhoto: async (id, blob) => {
        const previous = ref.current?.missions[id].photoId;
        const photoId = `${id}-${Date.now()}`;
        await savePhoto({ id: photoId, missionId: id, blob, createdAt: Date.now() }).catch(() => setStorageOk(false));
        if (previous) deletePhoto(previous).catch(() => undefined);
        return photoId;
      },
      recordResult: (id, resp, photoId) => mutate((p) => applyClassification(p, id, resp, photoId, Date.now())),
      recordPending: (id, photoId) => mutate((p) => applyPending(p, id, photoId, Date.now())),
      markManual: (id) => mutate((p) => applyManual(p, id, Date.now())),
      finish: () => mutate((p) => finishProgress(p, Date.now())),
      deletePhotos: async () => {
        await clearPhotos();
        mutate((p) => ({
          ...p,
          missions: Object.fromEntries(
            Object.entries(p.missions).map(([k, r]) => [k, { ...r, photoId: undefined }]),
          ) as Progress["missions"],
        }));
      },
      deleteEverything: async () => {
        await clearAll();
        ref.current = null;
        setProgressState(null);
      },
    }),
    [loaded, storageOk, progress, commit, mutate],
  );

  return <ExpeditionContext.Provider value={value}>{children}</ExpeditionContext.Provider>;
}

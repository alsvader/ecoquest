"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { MissionId } from "@/data/expedition";
import { clearAll, clearPhotos, deletePhoto, getProgress, savePhoto, saveProgress } from "@/lib/db";
import {
  applyClassification,
  applyManual,
  applyPending,
  createProgress,
  finishProgress,
} from "@/lib/session";
import { track } from "@/lib/track";
import type { ClassifyResponse, Progress } from "@/lib/types";

interface State {
  loaded: boolean;
  storageOk: boolean;
  progress: Progress | null;
}

interface Actions {
  /** Empieza una expedición nueva: borra las fotos anteriores y reemplaza el progreso. */
  start: () => Promise<void>;
  /** Guarda la foto; rechaza si no se pudo guardar (la UI muestra el error de lectura). */
  recordPhoto: (id: MissionId, blob: Blob) => Promise<string>;
  recordResult: (id: MissionId, resp: ClassifyResponse, photoId: string) => void;
  recordPending: (id: MissionId, photoId: string) => void;
  markManual: (id: MissionId) => void;
  finish: () => void;
  /** Borra las fotos guardadas; las misiones conservan su estado pero sin foto. */
  deletePhotos: () => Promise<void>;
  deleteEverything: () => Promise<void>;
}

type Ctx = State & Actions;

// Estado y acciones van en contextos separados: las acciones son estables y no provocan renders.
const StateContext = createContext<State | null>(null);
const ActionsContext = createContext<Actions | null>(null);

export function useExpeditionActions(): Actions {
  const ctx = useContext(ActionsContext);
  if (!ctx) throw new Error("useExpeditionActions fuera de ExpeditionProvider");
  return ctx;
}

export function useExpedition(): Ctx {
  const state = useContext(StateContext);
  const actions = useContext(ActionsContext);
  if (!state || !actions) throw new Error("useExpedition fuera de ExpeditionProvider");
  return useMemo(() => ({ ...state, ...actions }), [state, actions]);
}

/**
 * Manejador compartido de «Comenzar»: registra el toque, crea la expedición y entra a la sesión.
 * `starting` evita dobles toques mientras se limpian las fotos anteriores.
 */
export function useStartExpedition(event: string) {
  const { start } = useExpeditionActions();
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const begin = useCallback(async () => {
    setStarting(true);
    track(event);
    try {
      await start();
      router.push("/sesion");
    } finally {
      setStarting(false);
    }
  }, [event, start, router]);
  return { begin, starting };
}

export function ExpeditionProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgressState] = useState<Progress | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const ref = useRef<Progress | null>(null);
  // Si ya hubo un start/commit/borrado, el resultado tardío de getProgress está obsoleto.
  const touched = useRef(false);

  useEffect(() => {
    getProgress()
      .then((p) => {
        if (touched.current) return;
        ref.current = p ?? null;
        setProgressState(p ?? null);
      })
      .catch(() => setStorageOk(false))
      .finally(() => setLoaded(true));
  }, []);

  const commit = useCallback((next: Progress | null) => {
    touched.current = true;
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

  const actions = useMemo<Actions>(
    () => ({
      start: async () => {
        touched.current = true;
        await clearPhotos().catch(() => undefined);
        commit(createProgress(Date.now()));
      },
      recordPhoto: async (id, blob) => {
        const previous = ref.current?.missions[id].photoId;
        const photoId = `${id}-${Date.now()}`;
        try {
          await savePhoto({ id: photoId, missionId: id, blob, createdAt: Date.now() });
        } catch (e) {
          setStorageOk(false);
          throw e;
        }
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
        touched.current = true;
        ref.current = null;
        setProgressState(null);
      },
    }),
    [commit, mutate],
  );

  const state = useMemo<State>(() => ({ loaded, storageOk, progress }), [loaded, storageOk, progress]);

  return (
    <ActionsContext.Provider value={actions}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </ActionsContext.Provider>
  );
}

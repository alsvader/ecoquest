import { EDEN_EXPEDITION, MISSION_IDS, type MissionId } from "@/data/expedition";
import type { ClassifyResponse, MissionRecord, MissionStatus, Progress } from "./types";

export function createProgress(now: number): Progress {
  const missions = {} as Progress["missions"];
  for (const id of MISSION_IDS) missions[id] = { missionId: id, status: "todo", attempts: 0 };
  return { id: "current", expeditionId: EDEN_EXPEDITION.id, startedAt: now, missions };
}

function update(p: Progress, id: MissionId, patch: Partial<MissionRecord>, now: number): Progress {
  const prev = p.missions[id];
  if (!prev) return p;
  return {
    ...p,
    missions: { ...p.missions, [id]: { ...prev, ...patch, updatedAt: now } },
  };
}

export function applyClassification(
  p: Progress,
  id: MissionId,
  resp: ClassifyResponse,
  photoId: string,
  now: number,
): Progress {
  return update(
    p,
    id,
    {
      status: resp.status,
      attempts: p.missions[id].attempts + 1,
      photoId,
      targetScore: resp.target_score,
      scores: resp.scores,
      model: resp.model,
      serverLatencyMs: resp.latency_ms,
    },
    now,
  );
}

/** Evidencia guardada que no pudo analizarse (error de red/servicio). */
export function applyPending(p: Progress, id: MissionId, photoId: string, now: number): Progress {
  return update(
    p,
    id,
    {
      status: "pending_upload",
      attempts: p.missions[id].attempts + 1,
      photoId,
      targetScore: undefined,
      scores: undefined,
      serverLatencyMs: undefined,
    },
    now,
  );
}

/** Marcado manual: nunca cuenta como verificado. */
export function applyManual(p: Progress, id: MissionId, now: number): Progress {
  return update(p, id, { status: "manual_unverified" }, now);
}

export function finishProgress(p: Progress, now: number): Progress {
  return p.endedAt ? p : { ...p, endedAt: now };
}

export type BadgeId = "full" | "some" | "manual" | "none";

export interface Summary {
  total: number;
  verified: number;
  manual: number;
  pending: number;
  durationMs: number;
  badge: BadgeId;
}

export function badgeFor(verified: number, manual: number, total: number): BadgeId {
  if (verified === total && total > 0) return "full";
  if (verified > 0) return "some";
  if (manual > 0) return "manual";
  return "none";
}

export function computeSummary(p: Progress, now: number): Summary {
  const records = MISSION_IDS.map((id) => p.missions[id]);
  const count = (s: MissionStatus) => records.filter((r) => r.status === s).length;
  const verified = count("confirmed");
  const manual = count("manual_unverified");
  const total = records.length;
  return {
    total,
    verified,
    manual,
    pending: total - verified - manual,
    durationMs: Math.max(0, (p.endedAt ?? now) - p.startedAt),
    badge: badgeFor(verified, manual, total),
  };
}

/** Misiones cerradas: confirmadas o marcadas manualmente (progreso de la sesión). */
export function doneCount(p: Progress): number {
  return MISSION_IDS.filter((id) => ["confirmed", "manual_unverified"].includes(p.missions[id].status)).length;
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Valida la forma de un progreso cargado de IndexedDB; devuelve null si está corrupto. */
export function parseProgress(raw: unknown): Progress | null {
  const r = raw as Partial<Progress> | null | undefined;
  if (!r || typeof r !== "object" || r.id !== "current") return null;
  if (typeof r.expeditionId !== "string" || typeof r.startedAt !== "number" || !Number.isFinite(r.startedAt)) return null;
  if (r.endedAt !== undefined && typeof r.endedAt !== "number") return null;
  if (!r.missions || typeof r.missions !== "object") return null;
  for (const id of MISSION_IDS) {
    const m = r.missions[id] as Partial<MissionRecord> | undefined;
    if (!m || typeof m !== "object" || m.missionId !== id || typeof m.status !== "string" || typeof m.attempts !== "number") {
      return null;
    }
  }
  return r as Progress;
}

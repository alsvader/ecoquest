import type { MissionId } from "@/data/expedition";

export type ApiStatus = "confirmed" | "inconclusive" | "unconfirmed";
export type ScoreKey = MissionId | "distractor";

/** Respuesta de POST /classify según el contrato de PLAN.md. */
export interface ClassifyResponse {
  mission_id: MissionId;
  status: ApiStatus;
  /** Softmax sobre categorías candidatas. NO es una probabilidad calibrada. */
  scores: Partial<Record<ScoreKey, number>>;
  target_score: number;
  model: { name: string; license: string };
  latency_ms: number;
}

/** Estado de una misión en el cliente. */
export type MissionStatus =
  | "todo"
  | ApiStatus
  | "pending_upload"
  | "manual_unverified";

/** Estados visuales del sistema de diseño (§3.1). Fuente única; status-badge debe importarlo de aquí. */
export type MissionResult = "match" | "unsure" | "retry" | "manual";

export interface MissionRecord {
  missionId: MissionId;
  status: MissionStatus;
  attempts: number;
  photoId?: string;
  targetScore?: number;
  scores?: ClassifyResponse["scores"];
  model?: ClassifyResponse["model"];
  serverLatencyMs?: number;
  updatedAt?: number;
}

export interface Progress {
  id: "current";
  expeditionId: string;
  startedAt: number;
  endedAt?: number;
  missions: Record<MissionId, MissionRecord>;
}

export interface LogEntry {
  id?: number;
  ts: number;
  type: string;
  missionId?: MissionId;
  /** Interacción de UI (toque/acción) frente a evento de sistema. */
  interaction: boolean;
  data?: Record<string, string | number | boolean | null>;
}

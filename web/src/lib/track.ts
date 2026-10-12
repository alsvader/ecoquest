import { appendLog } from "./db";
import type { LogEntry } from "./types";
import type { MissionId } from "@/data/expedition";

/** Registra localmente una interacción o evento; nunca lanza ni se envía a ningún servidor. */
export function track(
  type: string,
  opts: { missionId?: MissionId; interaction?: boolean; data?: LogEntry["data"] } = {},
): void {
  const entry: LogEntry = {
    ts: Date.now(),
    type,
    missionId: opts.missionId,
    interaction: opts.interaction ?? true,
    data: opts.data,
  };
  appendLog(entry).catch(() => undefined);
}

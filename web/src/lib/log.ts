import type { LogEntry } from "./types";

export interface LogSummary {
  events: number;
  interactions: number;
  classifications: number;
  avgRoundTripMs: number | null;
  maxRoundTripMs: number | null;
}

/** Resume el registro para el informe de la prueba (interacciones y latencias). */
export function summarizeLog(entries: LogEntry[]): LogSummary {
  const latencies = entries
    .filter((e) => e.type === "classify_result" && typeof e.data?.roundTripMs === "number")
    .map((e) => e.data!.roundTripMs as number);
  return {
    events: entries.length,
    interactions: entries.filter((e) => e.interaction).length,
    classifications: entries.filter((e) => e.type === "classify_result" || e.type === "classify_error").length,
    avgRoundTripMs: latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : null,
    maxRoundTripMs: latencies.length ? Math.max(...latencies) : null,
  };
}

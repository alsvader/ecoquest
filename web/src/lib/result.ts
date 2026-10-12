import type { DictKey } from "@/i18n";
import type { ApiError } from "./api";
import type { MissionResult } from "@/components/eq/status-badge";
import type { MissionStatus } from "./types";

export interface StatusView {
  titleKey: DictKey;
  bodyKey: DictKey;
  labelKey: DictKey;
  tone: "success" | "warning" | "danger" | "neutral";
  /** Acciones que ofrece la UI para este estado. */
  canRetry: boolean;
  canMarkManual: boolean;
  canResend: boolean;
  /** La misión se considera cerrada (no hace falta más acción). */
  done: boolean;
}

export function statusView(status: MissionStatus): StatusView {
  switch (status) {
    case "confirmed":
      return { titleKey: "status.match", bodyKey: "result.match.body", labelKey: "status.match", tone: "success", canRetry: false, canMarkManual: false, canResend: false, done: true };
    case "inconclusive":
      return { titleKey: "status.unsure", bodyKey: "result.unsure.body", labelKey: "status.unsure", tone: "warning", canRetry: true, canMarkManual: false, canResend: false, done: false };
    case "unconfirmed":
      return { titleKey: "status.unsure", bodyKey: "result.unsure.body", labelKey: "status.unsure", tone: "danger", canRetry: true, canMarkManual: true, canResend: false, done: false };
    case "pending_upload":
      return { titleKey: "status.retry", bodyKey: "result.retry.body", labelKey: "status.retry", tone: "warning", canRetry: true, canMarkManual: true, canResend: true, done: false };
    case "manual_unverified":
      return { titleKey: "status.manual", bodyKey: "result.manual.body", labelKey: "status.manual", tone: "neutral", canRetry: true, canMarkManual: false, canResend: false, done: true };
    default:
      return { titleKey: "status.todo", bodyKey: "status.todo", labelKey: "status.todo", tone: "neutral", canRetry: false, canMarkManual: false, canResend: false, done: false };
  }
}

export function errorMessageKey(e: ApiError): DictKey {
  switch (e.kind) {
    case "network":
      return "error.network";
    case "rate_limit":
      return "error.rateLimit";
    case "bad_request":
      return "error.badRequest";
    case "invalid_response":
      return "error.invalidResponse";
    default:
      return "error.server";
  }
}

/** Formatea el índice de similitud SIN porcentaje, para no sugerir probabilidad. */
export function formatSimilarity(score: number): string {
  return score.toFixed(2);
}

/**
 * Mapeo de estados del cliente a los 4 estados visuales del sistema de diseño (§3.1).
 * confirmed→match; inconclusive/unconfirmed→unsure; pending_upload→retry; manual_unverified→manual.
 * `todo` no tiene estado visual (misión pendiente). Los errores sin evidencia guardada
 * (foto inválida, 400) también se muestran como `retry` desde la pantalla de la misión.
 */
export function toResult(status: MissionStatus): MissionResult | undefined {
  switch (status) {
    case "confirmed":
      return "match";
    case "inconclusive":
    case "unconfirmed":
      return "unsure";
    case "pending_upload":
      return "retry";
    case "manual_unverified":
      return "manual";
    default:
      return undefined;
  }
}

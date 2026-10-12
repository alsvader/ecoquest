import type { MissionId } from "@/data/expedition";
import { getMission, isMissionId } from "@/data/expedition";
import { ALLOWED_TYPES, API_URL, IS_PRODUCTION, MAX_UPLOAD_BYTES, MOCK_API, REQUEST_TIMEOUT_MS, isInsecureApiUrl } from "./config";
import type { ApiStatus, ClassifyResponse } from "./types";

export type ApiErrorKind = "network" | "timeout" | "rate_limit" | "bad_request" | "server" | "invalid_response";

export class ApiError extends Error {
  constructor(
    public kind: ApiErrorKind,
    message: string,
    public httpStatus?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** Los errores de red/servicio permiten guardar la evidencia como pendiente (FR-13). */
export function isRetryableError(e: unknown): boolean {
  return e instanceof ApiError && (e.kind === "network" || e.kind === "timeout" || e.kind === "server" || e.kind === "rate_limit");
}

const STATUSES: ApiStatus[] = ["confirmed", "inconclusive", "unconfirmed"];

const unit = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 1;

/** Valida la forma y los rangos de la respuesta según el contrato. */
export function parseClassifyResponse(raw: unknown): ClassifyResponse {
  const r = raw as Record<string, unknown> | null;
  const model = r?.model as Record<string, unknown> | undefined;
  const scores = r?.scores as Record<string, unknown> | undefined;
  const plainScores =
    !!scores &&
    typeof scores === "object" &&
    !Array.isArray(scores) &&
    (Object.getPrototypeOf(scores) === Object.prototype || Object.getPrototypeOf(scores) === null) &&
    Object.values(scores).every(unit);
  if (
    !r ||
    typeof r.mission_id !== "string" ||
    !isMissionId(r.mission_id) ||
    !STATUSES.includes(r.status as ApiStatus) ||
    !unit(r.target_score) ||
    !plainScores ||
    typeof r.latency_ms !== "number" ||
    !Number.isFinite(r.latency_ms) ||
    r.latency_ms < 0 ||
    !model ||
    typeof model !== "object" ||
    typeof model.name !== "string" ||
    typeof model.license !== "string"
  ) {
    throw new ApiError("invalid_response", "invalid response shape");
  }
  return r as unknown as ClassifyResponse;
}

async function readErrorDetail(res: Response): Promise<string> {
  try {
    const body = (await res.json()) as { error?: unknown };
    if (typeof body.error === "string") return body.error;
  } catch {
    /* cuerpo no JSON */
  }
  return `HTTP ${res.status}`;
}

export async function classifyReal(
  image: Blob,
  missionId: MissionId,
  fetchImpl: typeof fetch = fetch,
  baseUrl: string = API_URL,
  signal?: AbortSignal,
): Promise<ClassifyResponse> {
  if (isInsecureApiUrl(baseUrl)) throw new ApiError("network", "insecure API url");
  if (!(ALLOWED_TYPES as readonly string[]).includes(image.type)) throw new ApiError("bad_request", "unsupported image type");
  if (image.size <= 0 || image.size > MAX_UPLOAD_BYTES) throw new ApiError("bad_request", "image size out of range");

  const form = new FormData();
  form.append("image", image, "photo.jpg");
  form.append("mission_id", missionId);

  const controller = new AbortController();
  // Cancelación externa (botón «Cancelar»): aborta el fetch de verdad, sin contar como timeout.
  const onExternalAbort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  else signal?.addEventListener("abort", onExternalAbort, { once: true });
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);
  // El temporizador cubre también la lectura del cuerpo.
  try {
    let res: Response;
    try {
      res = await fetchImpl(`${baseUrl}/classify`, { method: "POST", body: form, signal: controller.signal });
    } catch {
      throw timedOut ? new ApiError("timeout", "request timed out") : new ApiError("network", "network error");
    }

    if (res.ok) {
      let json: unknown;
      try {
        json = await res.json();
      } catch {
        throw timedOut ? new ApiError("timeout", "request timed out") : new ApiError("invalid_response", "invalid json", res.status);
      }
      return parseClassifyResponse(json);
    }
    const detail = await readErrorDetail(res);
    if (res.status === 429) throw new ApiError("rate_limit", detail, 429);
    if (res.status >= 400 && res.status < 500) throw new ApiError("bad_request", detail, res.status);
    throw new ApiError("server", detail, res.status);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", onExternalAbort);
  }
}

/**
 * Estado del mock según el umbral de la misión (data/expedition, espejo de inference/app/thresholds.json).
 * El umbral «inconclusive» del mock es la mitad del de confirmación; así se mantiene sincronizado.
 */
export function mockStatus(targetScore: number, missionId: MissionId): ApiStatus {
  const confirm = getMission(missionId).threshold;
  if (targetScore >= confirm) return "confirmed";
  if (targetScore >= confirm / 2) return "inconclusive";
  return "unconfirmed";
}

/**
 * Mock determinista. Para demos, el nombre del archivo manda:
 * contiene "error" -> fallo de red; "confirmed" / "inconclusive" / "unconfirmed" -> ese estado.
 * Si no, el resultado depende del tamaño del archivo.
 */
export async function classifyMock(
  image: Blob,
  missionId: MissionId,
  fileName = "",
  delayMs = 700,
  signal?: AbortSignal,
): Promise<ClassifyResponse> {
  await new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, delayMs);
    signal?.addEventListener("abort", () => { clearTimeout(timer); reject(new ApiError("network", "aborted")); }, { once: true });
  });
  const name = fileName.toLowerCase();
  if (name.includes("error")) throw new ApiError("network", "mock network error");

  let target: number;
  if (name.includes("unconfirmed")) target = 0.12;
  else if (name.includes("inconclusive")) target = 0.4;
  else if (name.includes("confirmed")) target = 0.78;
  else target = [0.78, 0.4, 0.12][image.size % 3];

  const rest = 1 - target;
  const others = (["leaf", "flower", "roots"] as const).filter((m) => m !== missionId);
  const scores: ClassifyResponse["scores"] = {
    [missionId]: target,
    [others[0]]: rest * 0.3,
    [others[1]]: rest * 0.2,
    distractor: rest * 0.5,
  };
  return {
    mission_id: missionId,
    status: mockStatus(target, missionId),
    scores,
    target_score: target,
    model: { name: "mock (sin modelo real)", license: "n/a" },
    latency_ms: delayMs,
  };
}

export function classify(image: Blob, missionId: MissionId, fileName?: string, signal?: AbortSignal): Promise<ClassifyResponse> {
  if (MOCK_API && IS_PRODUCTION) {
    const msg = "NEXT_PUBLIC_MOCK_API=true no está permitido en producción: reconstruye con NEXT_PUBLIC_MOCK_API=false.";
    console.error(`[EcoQuest] ${msg}`);
    throw new Error(msg);
  }
  return MOCK_API ? classifyMock(image, missionId, fileName, 700, signal) : classifyReal(image, missionId, fetch, API_URL, signal);
}

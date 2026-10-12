import type { MissionId } from "@/data/expedition";
import { isMissionId } from "@/data/expedition";
import { API_URL, MOCK_API, REQUEST_TIMEOUT_MS } from "./config";
import type { ApiStatus, ClassifyResponse } from "./types";

export type ApiErrorKind = "network" | "rate_limit" | "bad_request" | "server" | "invalid_response";

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
  return e instanceof ApiError && (e.kind === "network" || e.kind === "server" || e.kind === "rate_limit");
}

const STATUSES: ApiStatus[] = ["confirmed", "inconclusive", "unconfirmed"];

/** Valida la forma de la respuesta según el contrato. */
export function parseClassifyResponse(raw: unknown): ClassifyResponse {
  const r = raw as Record<string, unknown> | null;
  const model = r?.model as Record<string, unknown> | undefined;
  if (
    !r ||
    typeof r.mission_id !== "string" ||
    !isMissionId(r.mission_id) ||
    !STATUSES.includes(r.status as ApiStatus) ||
    typeof r.target_score !== "number" ||
    typeof r.scores !== "object" ||
    r.scores === null ||
    typeof r.latency_ms !== "number" ||
    !model ||
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
): Promise<ClassifyResponse> {
  const form = new FormData();
  form.append("image", image, "photo.jpg");
  form.append("mission_id", missionId);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetchImpl(`${baseUrl}/classify`, { method: "POST", body: form, signal: controller.signal });
  } catch {
    throw new ApiError("network", "network error");
  } finally {
    clearTimeout(timer);
  }

  if (res.ok) {
    let json: unknown;
    try {
      json = await res.json();
    } catch {
      throw new ApiError("invalid_response", "invalid json", res.status);
    }
    return parseClassifyResponse(json);
  }
  const detail = await readErrorDetail(res);
  if (res.status === 429) throw new ApiError("rate_limit", detail, 429);
  if (res.status >= 400 && res.status < 500) throw new ApiError("bad_request", detail, res.status);
  throw new ApiError("server", detail, res.status);
}

/** Umbrales provisionales SOLO del mock (los reales viven en inference/app/thresholds.json). */
const MOCK_THRESHOLDS = { confirm: 0.5, inconclusive: 0.3 };

export function mockStatus(targetScore: number): ApiStatus {
  if (targetScore >= MOCK_THRESHOLDS.confirm) return "confirmed";
  if (targetScore >= MOCK_THRESHOLDS.inconclusive) return "inconclusive";
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
): Promise<ClassifyResponse> {
  await new Promise((r) => setTimeout(r, delayMs));
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
    status: mockStatus(target),
    scores,
    target_score: target,
    model: { name: "mock (sin modelo real)", license: "n/a" },
    latency_ms: delayMs,
  };
}

export function classify(image: Blob, missionId: MissionId, fileName?: string): Promise<ClassifyResponse> {
  return MOCK_API ? classifyMock(image, missionId, fileName) : classifyReal(image, missionId);
}

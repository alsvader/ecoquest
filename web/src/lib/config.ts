export const MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === "true";
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");
export const REQUEST_TIMEOUT_MS = 30_000;
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_SIDE = 1024;
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
/** Modelo declarado hasta que el servidor responda (FR-15). */
export const DEFAULT_MODEL = { name: "google/siglip2-base-patch16-256", license: "apache-2.0" };

export const IS_PRODUCTION = process.env.NODE_ENV === "production";

/** En producción la API debe ir por https (salvo localhost, útil para probar el build en local). */
export function isInsecureApiUrl(url: string, isProd: boolean = IS_PRODUCTION): boolean {
  if (!isProd) return false;
  try {
    const u = new URL(url);
    if (u.protocol === "https:") return false;
    return !["localhost", "127.0.0.1", "[::1]"].includes(u.hostname);
  } catch {
    return true;
  }
}

if (isInsecureApiUrl(API_URL)) {
  console.error(`[EcoQuest] NEXT_PUBLIC_API_URL debe usar https en producción (recibido: ${API_URL}).`);
}

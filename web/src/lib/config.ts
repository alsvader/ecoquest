export const MOCK_API = process.env.NEXT_PUBLIC_MOCK_API === "true";
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/+$/, "");
export const REQUEST_TIMEOUT_MS = 30_000;
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGE_SIDE = 1024;
export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
/** Modelo declarado hasta que el servidor responda (FR-15). */
export const DEFAULT_MODEL = { name: "google/siglip2-base-patch16-256", license: "apache-2.0" };

import { ALLOWED_TYPES, MAX_IMAGE_SIDE, MAX_UPLOAD_BYTES } from "./config";

export function isAllowedType(type: string): boolean {
  return (ALLOWED_TYPES as readonly string[]).includes(type);
}

/** Calcula el tamaño reducido manteniendo proporción; nunca amplía. */
export function fitWithin(width: number, height: number, maxSide = MAX_IMAGE_SIDE) {
  const longest = Math.max(width, height);
  if (longest <= maxSide) return { width, height };
  const scale = maxSide / longest;
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

export function withinUploadLimit(size: number): boolean {
  return size <= MAX_UPLOAD_BYTES;
}

/**
 * Reduce la imagen en cliente (FR-4). Si el navegador no puede decodificarla,
 * devuelve el original (el servidor valida tipo y tamaño).
 */
export async function compressImage(file: Blob, maxSide = MAX_IMAGE_SIDE, quality = 0.82): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const { width, height } = fitWithin(bitmap.width, bitmap.height, maxSide);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob) return file;
    return blob.size < file.size || !isAllowedType(file.type) ? blob : file;
  } catch {
    return file;
  }
}

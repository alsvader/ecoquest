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

export type ImageErrorKind = "decode" | "canvas" | "encode";

/** La imagen no pudo recodificarse en el cliente; NUNCA se devuelve el original (puede traer EXIF/GPS). */
export class ImageError extends Error {
  constructor(
    public kind: ImageErrorKind,
    message: string,
  ) {
    super(message);
    this.name = "ImageError";
  }
}

/**
 * Reduce la imagen en cliente (FR-4) y SIEMPRE la recodifica con canvas: así se eliminan los
 * metadatos EXIF/GPS (privacidad). Si no se puede decodificar o recodificar, lanza ImageError
 * en lugar de devolver el original.
 */
export async function compressImage(file: Blob, maxSide = MAX_IMAGE_SIDE, quality = 0.82): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new ImageError("decode", "cannot decode image");
  }
  try {
    const { width, height } = fitWithin(bitmap.width, bitmap.height, maxSide);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new ImageError("canvas", "no 2d context");
    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob) throw new ImageError("encode", "cannot encode image");
    return blob;
  } catch (e) {
    if (e instanceof ImageError) throw e;
    throw new ImageError("canvas", "canvas error");
  } finally {
    bitmap.close();
  }
}

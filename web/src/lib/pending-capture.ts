/**
 * Pasa la foto elegida en «Misiones» a la pantalla de la misión (módulo en memoria; sin persistir).
 * La cámara solo puede abrirse con un toque, así que el archivo se captura en la lista y se analiza al llegar.
 */
let pending: File | null = null;

export function setPendingCapture(file: File): void {
  pending = file;
}

export function takePendingCapture(): File | null {
  const f = pending;
  pending = null;
  return f;
}

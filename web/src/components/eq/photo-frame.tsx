import { PixelIcon } from "./pixel-icon";

/** Marco de foto con esquinas de visor (§7.10). Sin texto encima de la foto. */
export function PhotoFrame({ src, alt }: { src?: string | null; alt: string }) {
  const c = "absolute h-[22px] w-[22px] border-white";
  return (
    // Proporción 16:9 (≈234 px en columna móvil): el alto es estable aunque la foto aún no cargue.
    <div className="relative aspect-video w-full flex-none overflow-hidden border-3 border-tinta bg-[#3A7D2C]">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} width={640} height={360} decoding="async" className="h-full w-full object-cover" />
      ) : (
        // Estado vacío: visor con cámara (decorativo; el contexto lo da el texto de la pantalla).
        <div aria-hidden="true" className="flex h-full w-full items-center justify-center opacity-70">
          <PixelIcon name="camera" scale={6} flat />
        </div>
      )}
      <span aria-hidden="true" className={`${c} left-2 top-2 border-l-4 border-t-4`} />
      <span aria-hidden="true" className={`${c} right-2 top-2 border-r-4 border-t-4`} />
      <span aria-hidden="true" className={`${c} bottom-2 left-2 border-b-4 border-l-4`} />
      <span aria-hidden="true" className={`${c} bottom-2 right-2 border-b-4 border-r-4`} />
    </div>
  );
}

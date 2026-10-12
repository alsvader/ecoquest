/** Marco de foto con esquinas de visor (§7.10). Sin texto encima de la foto. */
export function PhotoFrame({ src, alt }: { src?: string | null; alt: string }) {
  const c = "absolute h-[22px] w-[22px] border-white";
  return (
    // TODO(diseño): 220 px es la adaptación sugerida por el doc (en el mockup son 150 px de 280).
    <div className="relative h-[220px] flex-none overflow-hidden border-3 border-tinta bg-[#3A7D2C]">
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      )}
      <span aria-hidden="true" className={`${c} left-2 top-2 border-l-4 border-t-4`} />
      <span aria-hidden="true" className={`${c} right-2 top-2 border-r-4 border-t-4`} />
      <span aria-hidden="true" className={`${c} bottom-2 left-2 border-b-4 border-l-4`} />
      <span aria-hidden="true" className={`${c} bottom-2 right-2 border-b-4 border-r-4`} />
    </div>
  );
}

import { Icon } from "../icon";

const LOCKED = [
  { title: "Más parques y duraciones", text: "Nuevas expediciones en otros espacios." },
  { title: "Nuevas misiones", text: "Solo las que la IA valide bien." },
  { title: "Bitácora de naturaleza", text: "Tus hallazgos, guardados en tu teléfono." },
  { title: "Descripciones breves", text: "Un modelo multimodal abierto que describa tus hallazgos." },
  { title: "Modo sin conexión", text: "Si los teléfonos lo aguantan." },
  { title: "Mapas y rutas abiertas", text: "Con datos abiertos y verificados." },
];

/** Sección 10 · Próximos niveles. */
export function Roadmap() {
  return (
    <section id="roadmap" className="border-b-4 border-tinta bg-papel py-20 lg:py-28" aria-labelledby="roadmap-title">
      <div className="wrap">
        <div className="max-w-[820px]">
          <p className="eyebrow">PRÓXIMOS NIVELES</p>
          <h2 id="roadmap-title" className="h2 mt-6">El mapa apenas empieza.</h2>
          <p className="lead mt-5">Ideas a explorar después del piloto, sin fechas ni promesas. Cada una entra solo si funciona en pruebas reales.</p>
        </div>
        <ol className="mt-14 grid grid-cols-1 gap-x-6 gap-y-6 xs:grid-cols-2 xs:gap-y-10 lg:grid-cols-4">
          <li className="flex items-center gap-2 text-left xs:col-span-2 xs:flex-col xs:gap-0 xs:text-center lg:col-span-1">
            <div className="badge badge-xs xs:badge-sm" role="img" aria-label="Insignia desbloqueada: Descubre el Edén">
              <div className="ring"></div><div className="inner"></div>
              <div className="content"><Icon name="tree" size={40} className="px-shadow" /><span className="pix hidden text-[8px] leading-[1.4] xs:block">Descubre<br />el Edén</span></div>
            </div>
            <div><h3 className="mt-2 text-[21px] leading-tight"><span className="pix block text-[12px]">MUNDO 1</span>Descubre el Edén</h3>
            <p className="mt-1.5 text-[16px] leading-snug xs:max-w-[260px]">Expedición piloto en Villahermosa.</p></div>
          </li>
          {LOCKED.map((l) => (
            <li key={l.title} className="flex items-center gap-2 text-left xs:flex-col xs:gap-0 xs:text-center">
              <div className="badge badge-xs xs:badge-sm locked" role="img" aria-label="Nivel bloqueado"><div className="ring"></div><div className="inner"></div><div className="content"><span className="pix text-[20px] leading-none">?</span><span className="pix hidden text-[9px] xs:block">Próxima</span></div></div>
              <div><h3 className="mt-1 text-[19px] leading-tight">{l.title}</h3><p className="mt-1.5 text-[16px] leading-snug">{l.text}</p></div>
            </li>
          ))}
        </ol>
        <p className="mt-14 text-[17px] font-bold">¿Tienes una idea de nivel? Propónla en el repo.</p>
      </div>
    </section>
  );
}

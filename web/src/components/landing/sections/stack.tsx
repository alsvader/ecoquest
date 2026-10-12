import Image from "next/image";

const FLOW_ARROW =
  "px absolute -bottom-10 left-1/2 -translate-x-1/2 rotate-90 lg:-right-[33px] lg:bottom-auto lg:left-auto lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0 lg:rotate-0";

function FlowArrow() {
  return <Image src="/landing/icons/arrow.svg" width={24} height={21} alt="" unoptimized className={FLOW_ARROW} />;
}

const NODE = "relative flex min-h-[110px] items-center border-4 border-tinta p-4 text-[17px] font-bold leading-snug shadow-brutal";

/** Sección 8 · Bajo el capó. */
export function Stack() {
  return (
    <section id="stack" className="border-b-4 border-tinta bg-papel py-20 lg:py-28" aria-labelledby="stack-title">
      <div className="wrap">
        <div className="max-w-[820px]">
          <p className="eyebrow">BAJO EL CAPÓ</p>
          <h2 id="stack-title" className="h2 mt-6">Simple por fuera. Abierto por dentro.</h2>
        </div>
        <figure className="mt-12" aria-label="Diagrama de arquitectura de EcoQuest">
          <ol className="grid gap-12 lg:grid-cols-6 lg:gap-9">
            <li className={`${NODE} bg-lima`}>Tú en el parque<FlowArrow /></li>
            <li className={`${NODE} bg-white`}>Web móvil (expedición, misiones, cámara)<FlowArrow /></li>
            <li className={`${NODE} bg-white`}>API de clasificación (Python + Transformers)<FlowArrow />
              {/* flecha punteada: la foto se descarta */}
              <span className="absolute -right-3 top-full hidden h-14 border-l-4 border-dashed border-tinta lg:left-1/2 lg:block" aria-hidden="true"></span>
            </li>
            <li className={`${NODE} bg-glitch`}>SigLIP2 · pesos abiertos<FlowArrow /></li>
            <li className={`${NODE} bg-voltio`}>Reglas de misión + estado<FlowArrow /></li>
            <li className={`${NODE} bg-white`}>Progreso guardado en tu teléfono</li>
          </ol>
          <figcaption className="mt-10 lg:ml-[calc((100%-180px)/6*2+72px)] lg:mt-14">
            <span className="inline-flex items-center gap-3 border-4 border-dashed border-tinta bg-white px-4 py-3 text-[16px] font-bold"><span aria-hidden="true" className="whitespace-nowrap font-pixel text-[14px]">- - &gt;</span>La foto se descarta tras el análisis</span>
          </figcaption>
        </figure>

        <ul className="mt-14 flex flex-wrap gap-3" aria-label="Stack">
          <li className="pix border-3 border-tinta bg-white px-3 py-2 text-[12px] shadow-brutal-sm">Next.js</li>
          <li className="pix border-3 border-tinta bg-white px-3 py-2 text-[12px] shadow-brutal-sm">TypeScript</li>
          <li className="pix border-3 border-tinta bg-white px-3 py-2 text-[12px] shadow-brutal-sm">Tailwind CSS</li>
          <li className="pix border-3 border-tinta bg-white px-3 py-2 text-[12px] shadow-brutal-sm">shadcn/ui</li>
          <li className="pix border-3 border-tinta bg-white px-3 py-2 text-[12px] shadow-brutal-sm">IndexedDB</li>
          <li className="pix border-3 border-tinta bg-white px-3 py-2 text-[12px] shadow-brutal-sm">Python</li>
          <li className="pix border-3 border-tinta bg-glitch px-3 py-2 text-[12px] shadow-brutal-sm">Transformers</li>
          <li className="pix border-3 border-tinta bg-glitch px-3 py-2 text-[12px] shadow-brutal-sm">SigLIP2</li>
        </ul>
        <p className="lead mt-10">La IA no es un adorno: sin SigLIP2 no hay validación de misiones. Y ninguna pieza decisiva depende de un modelo propietario.</p>
        <p className="mt-4 text-sm">Stack provisional; puede cambiar durante el desarrollo. Plataforma final (web móvil / PWA): [Por definir].</p>
      </div>
    </section>
  );
}

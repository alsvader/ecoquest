import { REPO_URL } from "../links";
import Image from "next/image";
import { Icon } from "../icon";

const STEP_ARROW =
  "px absolute -bottom-11 left-1/2 -translate-x-1/2 rotate-90 lg:-right-11 lg:bottom-auto lg:left-auto lg:top-1/2 lg:translate-x-0 lg:rotate-0";

function StepArrow() {
  return <Image src="/landing/icons/arrow.svg" width={32} height={28} alt="" unoptimized className={STEP_ARROW} />;
}

/** Sección 5 · IA abierta. */
export function IaAbierta() {
  return (
    <section id="ia-abierta" className="border-b-4 border-tinta bg-papel" aria-labelledby="ia-title">
      <div className="border-b-4 border-tinta bg-glitch py-16 lg:py-20">
        <div className="wrap">
          <p className="eyebrow">IA ABIERTA<span className="sep" aria-hidden="true"></span><span className="sr-only"> · </span>SIGLIP2</p>
          <h2 id="ia-title" className="h2 mt-6 max-w-[900px]">Una IA que dice «no estoy segura».</h2>
          <p className="lead mt-5 max-w-[820px]">EcoQuest usa SigLIP2, un modelo de pesos abiertos que compara tu foto con descripciones de texto. No adivina especies ni finge certezas: si no está segura, te lo dice.</p>
        </div>
      </div>

      <div className="wrap py-16 lg:py-24">
        {/* Bloque 1: pasos */}
        <ol className="grid gap-14 lg:grid-cols-3 lg:gap-14">
          <li className="card relative">
            <div className="flex items-center gap-3"><span className="pix flex h-10 w-10 items-center justify-center border-3 border-tinta bg-voltio text-[14px] shadow-brutal-sm">1</span><Icon name="camera" size={40} /></div>
            <h3 className="mt-4 text-[23px] leading-tight">Tomas la foto.</h3>
            <p className="mt-2 text-[17px] leading-snug">Se reduce en tu teléfono antes de enviarse.</p>
            <StepArrow />
          </li>
          <li className="card relative bg-glitch">
            <div className="flex items-center gap-3"><span className="pix flex h-10 w-10 items-center justify-center border-3 border-tinta bg-voltio text-[14px] shadow-brutal-sm">2</span><Icon name="eye" size={40} /></div>
            <h3 className="mt-4 text-[23px] leading-tight">SigLIP2 la compara.</h3>
            <p className="mt-2 text-[17px] leading-snug">Mide qué tanto se parece a la categoría de la misión («hoja», «flor visible», «tronco/raíces») frente a otras categorías de contraste.</p>
            <StepArrow />
          </li>
          <li className="card relative">
            <div className="flex items-center gap-3"><span className="pix flex h-10 w-10 items-center justify-center border-3 border-tinta bg-voltio text-[14px] shadow-brutal-sm">3</span><Icon name="check" size={40} /></div>
            <h3 className="mt-4 text-[23px] leading-tight">La misión decide.</h3>
            <p className="mt-2 text-[17px] leading-snug">Si el parecido supera el umbral de la misión, cuenta como coincidencia. Si no, te ofrece opciones.</p>
          </li>
        </ol>

        <div className="mt-20 grid items-start gap-14 lg:grid-cols-[auto_1fr] lg:gap-16">
          {/* Bloque 2: Pantalla 3 · Resultado de IA */}
          <figure className="flex flex-col items-center gap-6">
            <div className="phone phone-lima" role="img" aria-label="Pantalla de ejemplo de EcoQuest, Resultado de IA de la misión 2 de 3: estado No confirmado; la IA no está segura de que haya una flor visible; barra de parecido por debajo del umbral; botones Tomar otra foto y Marcar manualmente, no verificada">
              <div className="notch"></div>
              <div className="screen" aria-hidden="true">
                <div className="sbar"><span>10:03</span><span>▮▮▮ ▰</span></div>
                <div className="scr-body">
                  <div className="hud"><span className="pix">Misión 2/3</span><span className="pix border-2 border-tinta bg-glitch px-[5px] py-[3px]">IA</span></div>
                  <div className="relative h-[150px] flex-none overflow-hidden border-3 border-tinta bg-[#3a7d2c]">
                    <Icon name="leaf" size={72} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                    <span className="absolute left-2 top-2 h-[22px] w-[22px] border-l-4 border-t-4 border-white"></span><span className="absolute right-2 top-2 h-[22px] w-[22px] border-r-4 border-t-4 border-white"></span>
                    <span className="absolute bottom-2 left-2 h-[22px] w-[22px] border-b-4 border-l-4 border-white"></span><span className="absolute bottom-2 right-2 h-[22px] w-[22px] border-b-4 border-r-4 border-white"></span>
                  </div>
                  <span className="status self-start bg-voltio text-[15px]"><span className="s-ico">?</span>No confirmado</span>
                  <div className="text-[15px] font-bold leading-[1.3]">La IA no está segura de que haya una flor visible.</div>
                  <div className="border-3 border-tinta bg-white px-2.5 py-2 text-[13px]">Parecido con «flor visible»
                    <div className="relative mt-1.5 h-4 border-2 border-tinta bg-white"><i className="absolute inset-y-0 left-0 w-[28%] border-r-2 border-tinta bg-voltio"></i><span className="absolute -bottom-[5px] -top-[5px] left-[60%] border-l-[3px] border-dashed border-tinta"></span></div>
                    <div className="mt-1 text-[12px] font-medium leading-[1.3]">— — umbral de la misión</div>
                  </div>
                  <div className="flex-1"></div>
                  <span className="btn">Tomar otra foto</span>
                  <span className="btn btn-ghost min-h-12 whitespace-normal py-2 text-[14px] leading-tight">Marcar manualmente · no verificada</span>
                </div>
              </div>
            </div>
            <figcaption className="phone-cap mt-3 whitespace-normal text-center">Pantalla de ejemplo; el umbral real se definirá con pruebas.</figcaption>
          </figure>

          <div>
            {/* Bloque 3: estados */}
            <h3 className="text-[30px] leading-tight sm:text-[34px]">Cuatro resultados posibles. Todos honestos.</h3>
            <ul role="list" className="mt-7 grid gap-6 md:grid-cols-2">
              <li className="card p-5">
                <span className="status bg-lima text-[17px]"><span className="s-ico" aria-hidden="true"><Icon name="check" size={20} /></span>Coincidencia</span>
                <p className="mt-3.5 text-[17px] leading-snug"><b>«Parece una hoja. ¡Misión completada!»</b> Es tentativa: significa <i>se parece</i>, no <i>está verificado</i>.</p>
              </li>
              <li className="card p-5">
                <span className="status bg-voltio text-[17px]"><span className="s-ico" aria-hidden="true">?</span>No confirmado</span>
                <p className="mt-3.5 text-[17px] leading-snug"><b>«No estamos seguros. ¿Otra foto?»</b> La IA no encontró suficiente parecido.</p>
              </li>
              <li className="card p-5">
                <span className="status bg-lava text-[17px]"><span className="s-ico" aria-hidden="true"><Icon name="retry" size={20} /></span>Reintentar</span>
                <p className="mt-3.5 text-[17px] leading-snug"><b>«No pudimos analizar la foto. Inténtalo de nuevo.»</b> Falló la red, el servicio o la imagen.</p>
              </li>
              <li className="card p-5">
                <span className="status bg-turbo text-[17px]"><span className="s-ico" aria-hidden="true"><Icon name="hand" size={20} /></span><span>Revisión manual<small className="block text-[12px] font-bold uppercase tracking-[0.5px]">No verificada</small></span></span>
                <p className="mt-3.5 text-[17px] leading-snug">Tú marcas la misión y queda etiquetada así en tu progreso, resumen e insignia. Sin trampas escondidas.</p>
              </li>
            </ul>

            {/* Bloque 4: lo que la IA no hace */}
            <div className="card card-lg mt-10">
              <h3 className="text-[26px] leading-tight">Lo que la IA no hace</h3>
              <ul role="list" className="mt-3 text-[17px] font-medium">
                <li className="li-x">No identifica especies ni da nombres científicos.</li>
                <li className="li-x">No convierte el parecido en un porcentaje de certeza.</li>
                <li className="li-x">No mide cuánto caminaste ni tu tiempo fuera de pantalla.</li>
                <li className="li-x">No guarda tus fotos después de analizarlas.</li>
              </ul>
            </div>

            <p className="mt-8 border-l-4 border-tinta pl-4 text-sm leading-relaxed">Modelo de referencia: <code className="break-all bg-tinta px-1.5 py-px font-mono text-[15px] text-lima">google/siglip2-base-patch16-256</code> (variante final por confirmar). La licencia de los pesos está en su ficha de Hugging Face. Inferencia en servidor con Python + Transformers. Pesos abiertos no significa offline: por ahora necesitas conexión.</p>
            <div className="mt-8">
              <a className="btn btn-sec" href={REPO_URL}>Ver cómo está hecho</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

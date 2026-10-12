import { REPO_URL } from "../links";
import Link from "next/link";
import { Icon } from "../icon";

/** Sección 12 · CTA final. */
export function JugarCta() {
  return (
    <section id="jugar" className="border-b-4 border-tinta bg-lima bg-dots py-20 lg:py-28" aria-labelledby="cta-title">
      <div className="wrap grid items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-20">
        <div>
          <p className="eyebrow">PRESIONA START</p>
          <h2 id="cta-title" className="mt-6 text-[48px] leading-[.98] tracking-[-1px] sm:text-[64px] lg:text-[88px] lg:tracking-[-2px]">Tu expedición empieza afuera.</h2>
          <p className="lead mt-6">Tres misiones, ~20 minutos y un parque esperándote. Lo único que tienes que hacer después es guardar el teléfono.</p>
          <div className="mt-9 flex flex-col gap-5 xs:flex-row xs:flex-wrap xs:items-center">
            <Link className="btn btn-lg min-h-[72px] px-10 text-[24px]" href="/jugar">¡Jugar la demo!</Link>
            <a className="btn btn-lg btn-sec" href={REPO_URL}>Ver el código</a>
          </div>
          <p className="mt-6 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm font-bold"><span>Sin cuenta</span><span className="inline-block h-2 w-2 bg-tinta" aria-hidden="true"></span><span>Sin ubicación precisa</span><span className="inline-block h-2 w-2 bg-tinta" aria-hidden="true"></span><span>Fotos borrables</span></p>
          <p className="mt-8 inline-block -rotate-[1.5deg] bg-tinta px-4 py-2.5 font-display text-[22px] italic text-voltio shadow-[6px_6px_0_#FF3EA5] sm:text-[26px]" lang="en">The Real World Is Your Playground.</p>
        </div>
        <div className="flex justify-center">
          <figure className="badge" role="img" aria-label="Insignia Descubre el Edén, completada">
            <div className="ring"></div><div className="inner"></div>
            <div className="content"><Icon name="tree" size={50} className="px-shadow" /><span className="pix text-[11px] leading-[1.4]">Descubre<br />el Edén</span></div>
            <div className="ribbon">¡COMPLETADA!</div>
          </figure>
        </div>
      </div>
    </section>
  );
}

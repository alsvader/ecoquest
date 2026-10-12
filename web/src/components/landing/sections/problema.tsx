import { Icon } from "../icon";

/** Sección 2 · El problema. */
export function Problema() {
  return (
    <section id="problema" className="border-b-4 border-tinta bg-selva bg-dots-selva py-20 text-papel lg:py-28" aria-labelledby="problema-title">
      <div className="wrap grid items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div>
          <p className="eyebrow eyebrow-dark">EL PROBLEMA</p>
          <h2 id="problema-title" className="h2 mt-6 text-papel">Casi todas las apps quieren que no te vayas.</h2>
          <p className="lead mt-6 text-papel">Feeds infinitos, rachas, notificaciones: muchas experiencias digitales te premian por seguir mirando. EcoQuest juega al revés: usa el teléfono solo para arrancar la aventura y la IA para interpretar lo que encuentras, no para retenerte.</p>
        </div>
        <div className="relative grid gap-12 text-tinta sm:grid-cols-2 sm:gap-14">
          <article className="card card-lg relative">
            <h3 className="text-[26px] leading-tight line-through decoration-[5px]">El juego de siempre</h3>
            <ul role="list" className="mt-4 text-[17px] font-medium">
              <li className="li-x">Te premia por quedarte</li>
              <li className="li-x">Te llama de vuelta con notificaciones</li>
              <li className="li-x">La pantalla es el mundo</li>
            </ul>
          </article>
          <span className="sticker z-10 -my-6 justify-self-center bg-voltio px-4 py-2 text-[22px] sm:absolute sm:left-1/2 sm:top-1/2 sm:my-0 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:-rotate-6" aria-hidden="true">VS</span>
          <article className="card card-lg bg-lima">
            <h3 className="flex items-center gap-2.5 text-[26px] leading-tight"><Icon name="leaf" size={32} />EcoQuest</h3>
            <ul role="list" className="mt-4 text-[17px] font-medium">
              <li className="li-ok">Te premia por salir y observar</li>
              <li className="li-ok">Sin feeds ni notificaciones que te jalen</li>
              <li className="li-ok">El mundo es la pantalla… bueno, el parque</li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}

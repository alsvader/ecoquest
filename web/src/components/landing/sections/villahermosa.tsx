import { Icon } from "../icon";

/** Sección 7 · Hecho en Villahermosa. */
export function Villahermosa() {
  return (
    <section id="villahermosa" className="border-b-4 border-tinta bg-selva bg-dots-selva py-20 text-papel lg:py-28" aria-labelledby="vhsa-title">
      <div className="wrap grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="eyebrow eyebrow-dark">HECHO EN VILLAHERMOSA</p>
          <h2 id="vhsa-title" className="h2 mt-6 text-papel">Nuestro primer mundo es tropical.</h2>
          <p className="lead mt-6 text-papel">EcoQuest nace en Villahermosa, Tabasco, y su primera expedición vive en el Parque Tomás Garrido Canabal. Calor, humedad y lluvias forman parte del nivel, por eso las misiones son cortas y flexibles.</p>
          <ul role="list" className="mt-8 flex flex-wrap gap-3 text-tinta">
            <li className="border-3 border-tinta bg-voltio px-3.5 py-2 text-[16px] font-bold shadow-brutal-sm">Lleva agua</li>
            <li className="border-3 border-tinta bg-voltio px-3.5 py-2 text-[16px] font-bold shadow-brutal-sm">Ve con calzado para terreno mojado</li>
            <li className="border-3 border-tinta bg-voltio px-3.5 py-2 text-[16px] font-bold shadow-brutal-sm">Si llueve fuerte, deja la partida para otro día</li>
          </ul>
          <p className="mt-8 text-sm text-papel">Antes de jugar, respeta el reglamento y horarios del parque.</p>
        </div>
        <div className="flex flex-col gap-10">
          {/* «Mapa» estilizado: no es un mapa real, sin coordenadas */}
          <figure className="relative h-[300px] border-4 border-tinta bg-lima shadow-brutal-lg sm:h-[340px]" role="img" aria-label="Ilustración pixel del Parque Tomás Garrido Canabal (no es un mapa real)">
            <div className="absolute inset-x-0 top-[46%] h-0 border-t-4 border-dashed border-tinta" aria-hidden="true"></div>
            <div className="absolute inset-y-0 left-[38%] w-0 border-l-4 border-dashed border-tinta" aria-hidden="true"></div>
            <div className="absolute bottom-6 right-6 h-[90px] w-[38%] border-4 border-tinta bg-glitch" aria-hidden="true"></div>
            <Icon name="tree" size={60} className="px-shadow absolute left-[8%] top-[10%]" />
            <Icon name="tree" size={40} className="px-shadow absolute left-[20%] top-[60%]" />
            <Icon name="tree" size={50} className="px-shadow absolute right-[12%] top-[8%]" />
            <Icon name="flower" size={32} className="px-shadow absolute left-[52%] top-[18%]" />
            <Icon name="leaf" size={32} className="px-shadow absolute bottom-[12%] left-[6%]" />
            <div className="absolute left-1/2 top-[46%] flex -translate-x-1/2 sm:left-[38%] -translate-y-full flex-col items-center" aria-hidden="true">
              <span className="max-w-[85%] whitespace-normal border-3 border-tinta bg-white px-3 py-2 text-center text-[15px] font-bold leading-tight text-tinta shadow-brutal-sm">Parque Tomás Garrido Canabal</span>
              <Icon name="pin" size={40} className="px-shadow mt-1" />
            </div>
            <span className="sticker absolute -bottom-4 left-5 bg-voltio" aria-hidden="true">MUNDO 1</span>
          </figure>
          {/* Evidencia de la salida real: se reemplaza cuando exista (D10) */}
          <div className="border-4 border-dashed border-papel p-6">
            <p className="text-[20px] font-bold leading-snug text-papel">Próximamente: la bitácora de nuestra primera salida, con aciertos y errores.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

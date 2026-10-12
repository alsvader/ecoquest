import { Icon, type LandingIconName } from "../icon";

const RULES: { bar: string; icon: LandingIconName; title: string; text: string }[] = [
  { bar: "bg-lima", icon: "phone", title: "Screen-last", text: "Pocas pantallas, casi nada que escribir y una acción principal por pantalla. La app es el menú de pausa; el juego está afuera." },
  { bar: "bg-glitch", icon: "eye", title: "Explora antes de capturar", text: "Una foto cuando encuentras algo, no una ráfaga. Mira primero; dispara después." },
  { bar: "bg-lava", icon: "warn", title: "Seguridad y respeto ambiental", text: "No toques fauna, no recolectes ni arranques, quédate en senderos y zonas permitidas, y lejos del borde del agua." },
  { bar: "bg-turbo", icon: "lock", title: "Privacidad por defecto", text: "Sin cuenta, sin correo, sin ubicación precisa. Tu progreso vive en tu teléfono y puedes borrar tus fotos cuando quieras." },
];

/** Sección 6 · Reglas de la partida. */
export function Principios() {
  return (
    <section id="principios" className="overflow-x-clip border-b-4 border-tinta bg-papel py-20 lg:py-28" aria-labelledby="reglas-title">
      <div className="wrap">
        <div className="relative block pr-0 sm:inline-block sm:pr-6">
          <p className="eyebrow">REGLAS DE LA PARTIDA</p>
          <h2 id="reglas-title" className="h2 mt-6">Jugamos limpio.</h2>
          <span className="sticker sticker-r relative mt-5 bg-turbo text-[15px] sm:absolute sm:-right-36 sm:top-[66px] sm:mt-0" aria-hidden="true">REGLAS</span>
        </div>
        <ul role="list" className="mt-12 grid gap-8 md:grid-cols-2">
          {RULES.map((r) => (
            <li key={r.title} className="flex flex-col border-4 border-tinta bg-white shadow-brutal">
              <div className={`h-5 border-b-4 border-tinta ${r.bar}`} aria-hidden="true"></div>
              <div className="flex items-start gap-4 p-6"><Icon name={r.icon} size={48} className="px-shadow" /><div><h3 className="text-[24px] leading-tight">{r.title}</h3><p className="mt-2 text-[17px] leading-snug">{r.text}</p></div></div>
            </li>
          ))}
        </ul>
        <p className="mt-10 text-[17px] font-bold">Hecho para leerse bajo el sol de Tabasco: alto contraste, letras grandes, botones grandes.</p>
      </div>
    </section>
  );
}

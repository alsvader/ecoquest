import { ISSUES_URL, REPO_URL } from "../links";
/** Sección 9 · Open source · Contribuye. */
export function Contribuye() {
  return (
    <section id="contribuye" className="border-b-4 border-tinta bg-tinta py-20 lg:py-28" aria-labelledby="contribuye-title">
      <div className="wrap">
        <div className="relative border-4 border-tinta bg-turbo p-6 shadow-[10px_10px_0_0_#000,10px_10px_0_4px_#B6FF3B] sm:p-10 lg:p-14">
          <span className="sticker sticker-r absolute -top-5 right-4 bg-voltio text-[14px] sm:right-10">HACKTOBERFEST 2026</span>
          <p className="eyebrow mt-4 sm:mt-0">OPEN SOURCE</p>
          <h2 id="contribuye-title" className="h2 mt-6 max-w-[860px]">Player 2, únete a la partida.</h2>
          <p className="lead mt-5 max-w-[760px]">EcoQuest es código abierto. Si te late la idea de una IA que te saca a pasear, hay misiones secundarias para ti.</p>
          <ul className="mt-10 grid gap-7 md:grid-cols-3">
            <li className="card">
              <span className="pix text-[12px]">MISIÓN SECUNDARIA</span>
              <h3 className="mt-2 text-[23px] leading-tight">Nuevas misiones</h3>
              <p className="mt-2 text-[17px] leading-snug">Propón misiones visuales y ayúdanos a probarlas con fotos reales.</p>
            </li>
            <li className="card">
              <span className="pix text-[12px]">MISIÓN SECUNDARIA</span>
              <h3 className="mt-2 text-[23px] leading-tight">Pruebas del modelo</h3>
              <p className="mt-2 text-[17px] leading-snug">Comparte casos difíciles: fotos ambiguas, negativas o con mala luz. Así afinamos umbrales.</p>
            </li>
            <li className="card">
              <span className="pix text-[12px]">MISIÓN SECUNDARIA</span>
              <h3 className="mt-2 text-[23px] leading-tight">Accesibilidad e idiomas</h3>
              <p className="mt-2 text-[17px] leading-snug">Mejora contraste, lectura en exterior y traducciones.</p>
            </li>
          </ul>
          <div className="mt-10 flex flex-col gap-5 xs:flex-row xs:flex-wrap">
            <a className="btn" href={REPO_URL}>Ver el código</a>
            <a className="btn btn-sec" href={ISSUES_URL}>Abrir un issue</a>
          </div>
          <p className="mt-8 text-[17px] font-bold">Licencia del código: [Por definir] · Créditos y licencias del modelo y dependencias en el README.</p>
          <p className="mt-2 text-sm font-medium">Fotos de prueba: solo con derechos de uso claros y sin personas identificables.</p>
        </div>
      </div>
    </section>
  );
}

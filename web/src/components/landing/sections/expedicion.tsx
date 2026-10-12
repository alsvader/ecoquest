import Link from "next/link";
import { Icon } from "../icon";

/** Sección 4 · Expedición piloto. */
export function Expedicion() {
  return (
    <section id="expedicion" className="border-b-4 border-tinta bg-voltio py-20 lg:py-28" aria-labelledby="expedicion-title">
      <div className="wrap">
        <div className="max-w-[860px]">
          <p className="eyebrow">EXPEDICIÓN PILOTO<span className="sep" aria-hidden="true"></span><span className="sr-only"> · </span>MUNDO 1</p>
          <h2 id="expedicion-title" className="h2 mt-6">Descubre el Edén</h2>
          <p className="lead mt-5">Parque Tomás Garrido Canabal, Villahermosa, Tabasco. ~20 minutos · 3 misiones · 1 insignia.</p>
        </div>

        <div className="mt-12 grid items-start gap-14 xl:grid-cols-12 xl:gap-10">
          {/* Ficha de cartucho + aviso */}
          <div className="flex flex-col gap-7 xl:col-span-5">
            <div className="card card-lg p-0">
              <div className="flex items-center justify-between border-b-4 border-tinta bg-tinta px-5 py-3">
                <span className="flex gap-2" aria-hidden="true"><i className="block h-3 w-3 bg-lima"></i><i className="block h-3 w-3 bg-voltio"></i><i className="block h-3 w-3 bg-turbo"></i><i className="block h-3 w-3 bg-glitch"></i></span>
                <Icon name="tree" size={30} />
              </div>
              <dl className="divide-y-3 divide-tinta px-5">
            <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:items-baseline"><dt className="pix text-[13px]">LUGAR:</dt><dd className="text-[18px] font-bold leading-snug">Parque Tomás Garrido Canabal</dd></div>
            <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:items-baseline"><dt className="pix text-[13px]">DURACIÓN:</dt><dd className="text-[18px] font-bold">~20 min</dd></div>
            <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:items-baseline"><dt className="pix text-[13px]">MISIONES:</dt><dd className="text-[18px] font-bold">3</dd></div>
            <div className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:items-baseline"><dt className="pix text-[13px]">RECOMPENSA:</dt><dd className="text-[18px] font-bold leading-snug">Insignia «Descubre el Edén»</dd></div>
              </dl>
            </div>
            <aside className="border-4 border-tinta bg-lava p-5 shadow-brutal" aria-labelledby="aviso-title">
              <h3 id="aviso-title" className="pix flex items-center gap-2.5 text-[14px]"><Icon name="warn" size={28} /><span><span className="sr-only">Aviso: </span>ANTES DE SALIR</span></h3>
              <p className="mt-3 text-[18px] font-medium leading-snug">No toques fauna ni arranques plantas. Quédate en senderos y zonas permitidas, y lejos del borde del agua.</p>
            </aside>
            <p className="text-sm font-medium">Las misiones pueden ajustarse tras las pruebas en el parque: si la IA no las valida bien, las cambiamos.</p>
            <div>
              <Link className="btn" href="/jugar">¡Empezar la expedición!</Link>
            </div>
          </div>

          {/* Pantalla 2 · Misiones */}
          <figure className="flex flex-col items-center gap-6 xl:col-span-4">
            <div className="phone phone-lima" role="img" aria-label="Pantalla de ejemplo de EcoQuest, Misiones: progreso 1 de 3; hoja de gran tamaño con estado Coincidencia; flor y árbol pendientes; recordatorio de guardar el teléfono y botón Capturar hallazgo">
              <div className="notch"></div>
              <div className="screen" aria-hidden="true">
                <div className="sbar"><span>9:52</span><span>▮▮▮ ▰</span></div>
                <div className="scr-body">
                  <div className="hud"><span className="pix">Descubre el Edén</span><span className="pix">1/3</span></div>
                  <div className="xp h-[30px]"><i className="on"></i><i></i><i></i></div>
                  <div className="mini bg-[#F2FFE0]"><div className="ico bg-lima"><Icon name="leaf" size={24} /></div><div><b>Hoja de gran tamaño</b><span className="st bg-lima">Coincidencia</span></div></div>
                  <div className="mini"><div className="ico bg-turbo"><Icon name="flower" size={24} /></div><div><b>Flor y sus colores</b><span className="st">Pendiente</span></div></div>
                  <div className="mini"><div className="ico bg-voltio"><Icon name="tree" size={30} /></div><div><b>Árbol con raíces visibles</b><span className="st">Pendiente</span></div></div>
                  <div className="border-3 border-tinta bg-glitch px-2.5 py-[9px] text-[13px] font-bold leading-[1.3]">Guarda el teléfono. Sácalo solo cuando encuentres algo.</div>
                  <div className="flex-1"></div>
                  <span className="btn btn-ia"><Icon name="camera" size={24} />Capturar hallazgo</span>
                </div>
              </div>
            </div>
            <figcaption className="phone-cap mt-3">Pantallas y datos de ejemplo.</figcaption>
          </figure>

          {/* Insignia */}
          <div className="flex justify-center xl:col-span-3 xl:pt-10">
            <figure className="badge" role="img" aria-label="Insignia Descubre el Edén">
              <div className="ring"></div><div className="inner"></div>
              <div className="content"><Icon name="tree" size={50} className="px-shadow" /><span className="pix text-[11px] leading-[1.4]">Descubre<br />el Edén</span></div>
              <div className="ribbon">INSIGNIA</div>
            </figure>
          </div>
        </div>

        {/* MissionCards */}
        <ul role="list" className="mt-16 grid gap-8 md:grid-cols-3">
        <li className="grid grid-cols-[64px_1fr] gap-3.5 border-4 border-tinta bg-white p-3.5 shadow-brutal">
          <div className="flex h-16 w-16 items-center justify-center border-3 border-tinta bg-lima"><Icon name="leaf" size={40} /></div>
          <div><span className="pix text-[12px]">MISIÓN 1/3</span><h3 className="mb-1.5 mt-1 text-[21px] leading-[1.1]">Encuentra una hoja de gran tamaño</h3><p className="text-[16px] leading-snug">Busca una hoja que te sorprenda por su tamaño. Tómale una foto; no la arranques.</p></div>
          <div className="col-span-full flex items-center justify-between gap-2.5 border-t-3 border-tinta pt-3"><span className="chip">Pendiente</span><Icon name="camera" size={24} /></div>
        </li>
        <li className="grid grid-cols-[64px_1fr] gap-3.5 border-4 border-tinta bg-white p-3.5 shadow-brutal">
          <div className="flex h-16 w-16 items-center justify-center border-3 border-tinta bg-turbo"><Icon name="flower" size={40} /></div>
          <div><span className="pix text-[12px]">MISIÓN 2/3</span><h3 className="mb-1.5 mt-1 text-[21px] leading-[1.1]">Descubre una flor y registra sus colores</h3><p className="text-[16px] leading-snug">Encuentra una flor y fotografíala de cerca, sin cortarla.</p></div>
          <div className="col-span-full flex items-center justify-between gap-2.5 border-t-3 border-tinta pt-3"><span className="chip">Pendiente</span><Icon name="camera" size={24} /></div>
        </li>
        <li className="grid grid-cols-[64px_1fr] gap-3.5 border-4 border-tinta bg-white p-3.5 shadow-brutal">
          <div className="flex h-16 w-16 items-center justify-center border-3 border-tinta bg-voltio"><Icon name="tree" size={50} /></div>
          <div><span className="pix text-[12px]">MISIÓN 3/3</span><h3 className="mb-1.5 mt-1 text-[21px] leading-[1.1]">Encuentra un árbol con raíces visibles</h3><p className="text-[16px] leading-snug">Busca raíces que salgan del suelo y captúralas desde el sendero.</p></div>
          <div className="col-span-full flex items-center justify-between gap-2.5 border-t-3 border-tinta pt-3"><span className="chip">Pendiente</span><Icon name="camera" size={24} /></div>
        </li>
        </ul>
      </div>
    </section>
  );
}

import { REPO_URL } from "../links";
import Link from "next/link";
import { Icon } from "../icon";

/** Sección 1 · Hero. */
export function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden border-b-4 border-tinta bg-lima bg-dots lg:h-[804px]" aria-labelledby="hero-title">
      <Icon name="flower" size={40} className="px-shadow absolute left-[38px] top-[40px] hidden lg:block" />
      <Icon name="star" size={32} className="px-shadow absolute left-[706px] top-[700px] hidden lg:block" />
      <Icon name="heart" size={32} className="px-shadow absolute left-[1396px] top-[720px] hidden xl:block" />

      <div className="wrap relative grid items-center gap-6 pb-16 pt-12 lg:h-full lg:grid-cols-[1.12fr_1fr] lg:py-0">
        {/* Izquierda */}
        <div>
          <p className="eyebrow">RETO TOUCH GRASS<span className="sep" aria-hidden="true"></span><span className="sr-only"> · </span>HACKTOBERFEST 2026</p>
          <h1 id="hero-title" className="mb-[22px] mt-[26px] max-w-[700px] text-[44px] leading-[.98] tracking-[-1px] sm:text-[60px] lg:text-[78px] lg:tracking-[-1.5px]">
            Guarda el teléfono. <span className="mt-2.5 inline-block border-4 border-tinta bg-white px-3 shadow-[6px_6px_0_#000]">El parque es el nivel.</span>
          </h1>
          <p className="max-w-[600px] text-[19px] font-medium leading-normal sm:text-[20px]">EcoQuest convierte una caminata en una expedición de ~20 minutos: tres misiones, unas cuantas fotos y una insignia al final. Una IA de pesos abiertos interpreta tus hallazgos; tú pones los pasos.</p>
          <div className="mt-8 flex flex-col gap-5 xs:flex-row xs:flex-wrap xs:items-center">
            <Link className="btn btn-lg leading-normal" href="/jugar">¡Jugar la demo!</Link>
            <a className="btn btn-lg btn-sec leading-normal" href={REPO_URL}>Ver el código</a>
          </div>
          <div className="mt-[30px] max-w-[560px]" aria-hidden="true">
            <div className="xp-cont"><div className="fill" style={{ width: "58%" }}></div><span className="lbl">EXP</span></div>
          </div>
          <p className="mt-[18px] flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm font-bold leading-normal"><span>Sin cuenta</span><span className="inline-block h-2 w-2 bg-tinta" aria-hidden="true"></span><span>Sin ubicación precisa</span><span className="inline-block h-2 w-2 bg-tinta" aria-hidden="true"></span><span>Código abierto</span></p>
        </div>

        {/* Derecha: arte */}
        <div className="relative mx-auto mt-10 w-full max-w-[380px] lg:mt-0 lg:h-full lg:max-w-none">
          <p className="relative z-0 mx-auto -mb-6 w-[262px] -rotate-3 border-4 border-tinta bg-tinta px-[22px] pb-[22px] pt-5 text-voltio shadow-[8px_8px_0_0_#FF3EA5] lg:absolute lg:left-[-6px] lg:top-[118px] lg:m-0">
            <q className="block font-display text-[30px] italic leading-[1.08] [quotes:none]" lang="en">The Real World Is Your Playground.</q>
          </p>

          <div aria-hidden="true" className="absolute left-[536px] top-[150px] hidden h-[104px] w-[104px] rotate-6 items-center justify-center border-4 border-tinta bg-voltio shadow-brutal lg:flex"><Icon name="tree" size={70} /></div>
          <div aria-hidden="true" className="absolute left-[548px] top-[452px] hidden h-[84px] w-[84px] -rotate-[5deg] items-center justify-center border-4 border-tinta bg-turbo shadow-brutal lg:flex"><Icon name="flower" size={56} /></div>
          <div aria-hidden="true" className="absolute left-[96px] top-[596px] hidden h-[76px] w-[76px] rotate-[4deg] items-center justify-center border-4 border-tinta bg-glitch shadow-brutal lg:flex"><Icon name="eye" size={48} /></div>

          {/* Teléfono: Pantalla 1 · Bienvenida */}
          <figure className="relative z-10 mx-auto w-[296px] pb-16 lg:absolute lg:left-[218px] lg:top-[62px] lg:pb-0">
            <div className="phone" role="img" aria-label="Pantalla de ejemplo de EcoQuest, Bienvenida: expedición Descubre el Edén en el Parque Tomás Garrido Canabal, ~20 min y 3 misiones, aviso de seguridad y botón ¡Comenzar!">
              <div className="notch"></div>
              <div className="screen" aria-hidden="true">
                <div className="sbar"><span>9:41</span><span>▮▮▮ ▰</span></div>
                <div className="scr-body bg-lima">
                  <div className="pix mt-1.5 text-[23px] leading-[1.15] [text-shadow:3px_3px_0_#fff]">ECO<br />QUEST</div>
                  <div className="-rotate-[1.5deg] self-start bg-tinta px-[9px] py-1.5 font-display text-[15px] leading-[1.35] text-voltio">The Real World Is Your Playground.</div>
                  <div className="border-3 border-tinta bg-white px-[11px] py-2.5 shadow-[4px_4px_0_#000]">
                    <span className="pix text-[9px]">Expedición</span>
                    <div className="scr-title my-1">Descubre el Edén</div>
                    <div className="text-[13.5px] font-bold leading-[1.3]">Parque Tomás Garrido Canabal<br />~20 min · 3 misiones</div>
                  </div>
                  <div className="safety"><b><span className="warn-ico">⚠</span> ANTES DE SALIR</b>No toques fauna ni arranques plantas. Quédate en senderos y lejos del borde del agua.</div>
                  <div className="flex-1"></div>
                  <span className="btn">¡Comenzar!</span>
                  <div className="text-center text-[12px] font-medium leading-[1.3]">Sin cuenta · Sin ubicación precisa</div>
                </div>
              </div>
            </div>
            <figcaption className="phone-cap absolute left-1/2 top-[640px] -translate-x-1/2 leading-normal">Pantalla de ejemplo. Prototipo en construcción.</figcaption>
          </figure>

          {/* Tarjeta de misión flotante (estilo Pantalla 2 · Misiones) */}
          <div aria-hidden="true" className="absolute left-[-14px] top-[388px] z-20 hidden w-[240px] -rotate-2 grid-cols-[44px_1fr] items-center gap-2.5 border-3 border-tinta bg-white p-[9px] shadow-brutal lg:grid">
            <div className="flex h-11 w-11 items-center justify-center border-2 border-tinta bg-lima"><Icon name="leaf" size={32} /></div>
            <div><span className="pix block text-[10px]">MISIÓN 1/3</span><b className="block text-[15px] leading-[1.15]">Hoja de gran tamaño</b><span className="chip mt-1 text-[11px]">Pendiente</span></div>
          </div>

          {/* Stickers ±2° */}
          <span className="sticker absolute right-[-6px] top-[150px] z-20 bg-voltio lg:left-[430px] lg:right-auto lg:top-[40px]">SCREEN-LAST</span>
          <span className="sticker sticker-r absolute left-[-6px] top-[520px] z-20 bg-glitch lg:left-[6px] lg:top-[510px]">IA ABIERTA <span className="sep" aria-hidden="true"></span><span className="sr-only">·</span> SIGLIP2</span>
          <span className="sticker absolute right-[-6px] top-[700px] z-20 bg-turbo lg:left-[496px] lg:right-auto lg:top-[572px]">SIN CUENTA</span>
        </div>
      </div>
    </section>
  );
}

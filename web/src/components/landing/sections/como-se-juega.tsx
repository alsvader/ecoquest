import Image from "next/image";
import { Icon } from "../icon";

/** Sección 3 · Cómo se juega. */
export function ComoSeJuega() {
  return (
    <section id="como-se-juega" className="border-b-4 border-tinta bg-papel py-20 lg:py-28" aria-labelledby="como-title">
      <div className="wrap">
        <div className="max-w-[820px]">
          <p className="eyebrow">CÓMO SE JUEGA</p>
          <h2 id="como-title" className="h2 mt-6">Cuatro niveles. Cero manuales.</h2>
          <p className="lead mt-5">La app aparece solo al principio, cuando encuentras algo y al final. Lo demás pasa con el teléfono en la bolsa.</p>
        </div>

        {/* Mapa de niveles (XpBar segmentada, decorativa) */}
        <div className="xp mt-12 h-12" aria-hidden="true">
          <i className="flex items-center justify-center border-solid bg-lima font-pixel text-[13px] font-bold">1</i>
          <i className="flex items-center justify-center border-solid bg-voltio font-pixel text-[13px] font-bold">2</i>
          <i className="flex items-center justify-center border-solid bg-glitch font-pixel text-[13px] font-bold">3</i>
          <i className="flex items-center justify-center border-solid bg-turbo font-pixel text-[13px] font-bold">4</i>
        </div>

        <ol className="mt-10 grid gap-14 md:grid-cols-2 md:gap-x-12 lg:grid-cols-4 lg:gap-x-12">
        <li className="relative flex flex-col border-4 border-tinta bg-white shadow-brutal">
          <div className="pix border-b-4 border-tinta bg-lima px-4 py-2.5 text-[14px]">NIVEL 1</div>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <Icon name="star" size={48} className="px-shadow" />
            <h3 className="text-[23px] leading-[1.1]">Elige tu expedición</h3>
            <p className="text-[17px] leading-snug">Abre EcoQuest, revisa tus 3 misiones y lee el aviso de seguridad. Sin registro.</p>
          </div>
          <Image src="/landing/icons/arrow.svg" width={32} height={28} alt="" unoptimized className="px absolute -bottom-11 left-1/2 -translate-x-1/2 rotate-90 md:hidden lg:-right-10 lg:bottom-auto lg:left-auto lg:top-1/2 lg:block lg:translate-x-0 lg:rotate-0" />
        </li>
        <li className="relative flex flex-col border-4 border-tinta bg-white shadow-brutal">
          <div className="pix border-b-4 border-tinta bg-voltio px-4 py-2.5 text-[14px]">NIVEL 2</div>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <Icon name="phone" size={48} className="px-shadow" />
            <h3 className="text-[23px] leading-[1.1]">Guarda el teléfono</h3>
            <p className="text-[17px] leading-snug">Camina, mira, escucha. Sácalo solo cuando encuentres algo.</p>
          </div>
          <Image src="/landing/icons/arrow.svg" width={32} height={28} alt="" unoptimized className="px absolute -bottom-11 left-1/2 -translate-x-1/2 rotate-90 md:hidden lg:-right-10 lg:bottom-auto lg:left-auto lg:top-1/2 lg:block lg:translate-x-0 lg:rotate-0" />
        </li>
        <li className="relative flex flex-col border-4 border-tinta bg-white shadow-brutal">
          <div className="pix border-b-4 border-tinta bg-glitch px-4 py-2.5 text-[14px]">NIVEL 3</div>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <Icon name="camera" size={48} className="px-shadow" />
            <h3 className="text-[23px] leading-[1.1]">Captura tu hallazgo</h3>
            <p className="text-[17px] leading-snug">Una foto por misión. La IA abierta te dice si se parece a lo que buscabas… o si no está segura.</p>
          </div>
          <Image src="/landing/icons/arrow.svg" width={32} height={28} alt="" unoptimized className="px absolute -bottom-11 left-1/2 -translate-x-1/2 rotate-90 md:hidden lg:-right-10 lg:bottom-auto lg:left-auto lg:top-1/2 lg:block lg:translate-x-0 lg:rotate-0" />
        </li>
        <li className="relative flex flex-col border-4 border-tinta bg-white shadow-brutal">
          <div className="pix border-b-4 border-tinta bg-turbo px-4 py-2.5 text-[14px]">NIVEL 4</div>
          <div className="flex flex-1 flex-col gap-3 p-5">
            <Icon name="medal" size={48} className="px-shadow" />
            <h3 className="text-[23px] leading-[1.1]">Gana tu insignia</h3>
            <p className="text-[17px] leading-snug">Ve tu resumen de hallazgos y el tiempo en sesión. Expedición completada.</p>
          </div>
        </li>
        </ol>
        <p className="mt-12 inline-flex items-center gap-3 border-3 border-tinta bg-white px-4 py-3 text-[17px] font-bold shadow-brutal-sm"><Icon name="check" size={24} />Sin feeds, sin rachas, sin notificaciones que te llamen de vuelta.</p>
      </div>
    </section>
  );
}

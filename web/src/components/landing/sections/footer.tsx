import Link from "next/link";
import { README_URL, REPO_URL } from "../links";
import { Icon } from "../icon";

/** Sección 13 · Footer. */
export function Footer() {
  return (
    <footer className="bg-tinta py-16 text-papel" aria-labelledby="footer-title">
      <div className="wrap">
        <div className="flex flex-col gap-5 border-b-4 border-papel pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-[60px] w-[60px] items-center justify-center border-3 border-papel bg-lima"><Icon name="leaf" size={40} /></span>
            <h2 id="footer-title" className="font-pixel text-[26px] font-bold leading-[1.08] [text-shadow:3px_3px_0_#0A5C2B]"><span aria-hidden="true">ECO<br />QUEST</span><span className="sr-only">EcoQuest</span></h2>
          </div>
          <p className="font-display text-[22px] italic text-voltio" lang="en">The Real World Is Your Playground.</p>
        </div>
        <div className="grid gap-10 py-10 md:grid-cols-3 md:gap-12">
          <div>
            <h3 className="pix text-[14px] text-lima">Proyecto</h3>
            <ul className="mt-4 space-y-3 text-[16px] leading-snug">
              <li>Hecho por <b>Aarón López Sosa</b> en Villahermosa, Tabasco.</li>
              <li>Proyecto para el reto semanal <b>Touch Grass</b> de <b>Hacktoberfest 2026</b>.</li>
              <li>Estado: <b>prototipo en construcción</b>.</li>
            </ul>
          </div>
          <div>
            <h3 className="pix text-[14px] text-lima">Créditos y licencias</h3>
            <ul className="mt-4 space-y-3 text-[16px] leading-snug">
              <li><b>Modelo:</b> SigLIP2 (<code className="break-all text-[14px] text-lima">google/siglip2-base-patch16-256</code>, variante final [Por definir]) — pesos abiertos publicados por Google en Hugging Face. Licencia: [Por definir].</li>
              <li><b>Código de EcoQuest:</b> licencia [Por definir].</li>
              <li><b>Fuentes:</b> Silkscreen, Archivo Black y Space Grotesk — licencias [Por definir: verificar].</li>
              <li><b>Dependencias:</b> Next.js, Tailwind CSS, shadcn/ui, Transformers y más — lista completa con licencias en el README.</li>
              <li><b>Servicio de inferencia:</b> [Por definir].</li>
            </ul>
          </div>
          <div>
            <h3 className="pix text-[14px] text-lima">Enlaces</h3>
            <ul className="mt-4 space-y-3 text-[16px] leading-snug">
              <li><Link href="/jugar" className="underline decoration-2 underline-offset-4 hover:text-lima">Demo</Link>: [Por definir]</li>
              <li><a href={REPO_URL} className="underline decoration-2 underline-offset-4 hover:text-lima">Repositorio en GitHub</a>: [Por definir]</li>
              <li><a href={README_URL} className="underline decoration-2 underline-offset-4 hover:text-lima">README / documentación</a>: [Por definir]</li>
              <li>Hacktoberfest: <a href="https://hacktoberfest.com/" className="break-all text-voltio underline decoration-2 underline-offset-4 hover:text-lima">https://hacktoberfest.com/</a></li>
              <li>SigLIP2 en Hugging Face: <a href="https://huggingface.co/google/siglip2-base-patch16-256" className="break-all text-voltio underline decoration-2 underline-offset-4 hover:text-lima">https://huggingface.co/google/siglip2-base-patch16-256</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t-4 border-papel pt-8 text-[15px] leading-snug">
          <p>EcoQuest no está afiliado al Parque Tomás Garrido Canabal ni a las autoridades del parque. Juega con responsabilidad y respeta el reglamento del lugar.</p>
          <p className="mt-2">Sin cookies de rastreo: [Por definir — confirmar antes de publicar].</p>
        </div>
      </div>
    </footer>
  );
}

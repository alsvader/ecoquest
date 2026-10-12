import type { ReactNode } from "react";
import { Icon } from "../icon";

const ITEMS: { q: string; a: ReactNode }[] = [
  { q: "¿Necesito crear una cuenta?", a: "No. Sin cuenta, sin correo y sin ubicación precisa. Tu progreso se guarda en tu teléfono." },
  { q: "¿Cuánto cuesta?", a: "Es un prototipo en construcción y la demo se abre sin crear cuenta. Todavía no hemos publicado ningún precio." },
  { q: "¿Tengo que instalar algo?", a: "Está pensada como web móvil: la abres desde el navegador." },
  { q: "¿La IA identifica plantas o especies?", a: "No. Solo estima si tu foto se parece a la categoría de la misión («hoja», «flor visible», «tronco/raíces»). Nunca te dará un nombre científico como verdad." },
  { q: "¿Qué pasa si la IA se equivoca?", a: "Puedes tomar otra foto o marcar la misión a mano. Si la marcas tú, queda como «Revisión manual · No verificada», a la vista en tu resumen e insignia." },
  { q: "¿Qué hacen con mis fotos?", a: "Se reducen en tu teléfono, se envían para analizarse y el servidor las descarta después. Puedes borrar tus fotos y todos tus datos locales cuando quieras." },
  { q: "¿Funciona sin internet?", a: "Por ahora no: el análisis corre en un servidor. Guardar fotos para analizarlas después está en evaluación." },
  { q: "¿Puedo jugar fuera de Villahermosa?", a: "El piloto está diseñado para el Parque Tomás Garrido Canabal. Las misiones son de cosas comunes en muchos parques, pero no garantizamos que funcionen igual en otros lugares." },
  { q: "¿Mide cuánto caminé o mi tiempo sin pantalla?", a: "No. Solo muestra el tiempo en sesión, desde que empiezas hasta que terminas la expedición." },
  { q: "¿En qué idioma está?", a: "Por ahora, en español." },
  {
    q: "¿Qué modelo usan y con qué licencia?",
    a: (
      <>
        SigLIP2 de pesos abiertos (referencia: <code className="break-all bg-tinta px-1.5 py-px font-mono text-[15px] text-lima">google/siglip2-base-patch16-256</code>). La variante final aún está por confirmar; la licencia de los pesos está en su ficha de Hugging Face y los créditos, en el README.
      </>
    ),
  },
];

/** Id estable por pregunta (para enlaces directos): minúsculas, sin acentos ni signos. */
const slug = (q: string) => "faq-" + q.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Sección 11 · FAQ. */
export function Faq() {
  return (
    <section id="faq" className="border-b-4 border-tinta bg-papel py-20 lg:py-28" aria-labelledby="faq-title">
      <div className="wrap grid gap-12 lg:grid-cols-[360px_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title" className="h2 mt-6">Preguntas antes de salir.</h2>
          <Icon name="eye" size={64} className="px-shadow mt-8 hidden lg:block" />
        </div>
        <div className="flex flex-col gap-5">
          {ITEMS.map((it) => (
            <details key={it.q} id={slug(it.q)} className="faq"><summary>{it.q}<span className="plus" aria-hidden="true"><Icon name="plus" size={20} /></span></summary><div className="ans">{it.a}</div></details>
          ))}
        </div>
      </div>
    </section>
  );
}

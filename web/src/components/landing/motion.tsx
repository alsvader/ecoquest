"use client";

import { useEffect } from "react";

/** Bloques que se revelan al entrar al viewport (solo los de más arriba: sus hijos heredan la entrada). */
const TARGETS =
  "main > section:not(#inicio) :is(.eyebrow, h2, h3, p, li, .btn, .sticker, .card, .xp, article, details, figure, img.px-shadow)";
const STAGGER_MS = 90;
const MAX_QUEUE_MS = 700;
const DURATION_MS = 700;

/**
 * Entradas al hacer scroll. Sin JS (o con `prefers-reduced-motion`) todo queda visible: el estado oculto
 * solo se aplica aquí, y únicamente a lo que todavía está por debajo del pliegue (cero parpadeo).
 * Los bloques se encadenan con 90 ms entre uno y otro (cola); al terminar se quita `data-reveal` para no dejar
 * transiciones residuales sobre hover/active de los componentes.
 */
export function LandingMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const all = Array.from(document.querySelectorAll<HTMLElement>(TARGETS));
    const targets = all.filter((el) => !all.some((o) => o !== el && o.contains(el)) && el.getBoundingClientRect().top + window.scrollY > window.innerHeight);
    if (!targets.length) return;

    const root = document.querySelector(".landing");
    targets.forEach((el) => el.setAttribute("data-reveal", ""));
    root?.classList.add("motion-ready");

    const timers = new Set<number>();
    // Cola de entrada: cada bloque arranca al menos STAGGER_MS después del anterior, aunque el scroll los
    // traiga a la vez (secciones cortas donde título y cajas caben en la misma pantalla).
    let nextSlot = 0;
    const onIntersect = (entries: IntersectionObserverEntry[]) => {
      entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
        .forEach((e) => {
          const el = e.target as HTMLElement;
          const now = performance.now();
          const start = Math.max(now, nextSlot);
          const delay = Math.min(start - now, MAX_QUEUE_MS);
          nextSlot = now + delay + STAGGER_MS;
          io.unobserve(el);
          tallIo.unobserve(el);
          el.style.setProperty("--reveal-delay", `${Math.round(delay)}ms`);
          el.classList.add("is-in");
          const t = window.setTimeout(() => {
            el.removeAttribute("data-reveal");
            el.classList.remove("is-in");
            el.style.removeProperty("--reveal-delay");
            timers.delete(t);
          }, delay + DURATION_MS + 50);
          timers.add(t);
        });
    };
    // Bloques normales: esperan a que ≥50 % esté a la vista. Bloques altos (no podrían llegar nunca al 50 %
    // dentro de la franja útil): basta con que asome el 5 %.
    const io = new IntersectionObserver(onIntersect, { rootMargin: "0px 0px -22% 0px", threshold: [0.5, 0.99] });
    const tallIo = new IntersectionObserver(onIntersect, { rootMargin: "0px 0px -22% 0px", threshold: 0.05 });
    const usable = window.innerHeight * 0.78;
    targets.forEach((el) => (el.getBoundingClientRect().height * 0.5 > usable ? tallIo : io).observe(el));

    return () => {
      io.disconnect();
      tallIo.disconnect();
      timers.forEach(clearTimeout);
      root?.classList.remove("motion-ready");
      targets.forEach((el) => {
        el.removeAttribute("data-reveal");
        el.classList.remove("is-in");
      });
    };
  }, []);

  return null;
}

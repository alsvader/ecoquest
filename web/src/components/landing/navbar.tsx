"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./icon";

const LINKS = [
  { href: "#como-se-juega", label: "Cómo se juega" },
  { href: "#expedicion", label: "La expedición" },
  { href: "#ia-abierta", label: "IA abierta" },
  { href: "#contribuye", label: "Contribuye" },
  { href: "#faq", label: "FAQ" },
];

/** Sección 0 · Navbar. El menú móvil replica src/main.js de la landing HTML (aria-expanded, Esc, cierre ≥1024px). */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = (m: MediaQueryListEvent) => m.matches && setOpen(false);
    // Clic/toque fuera del header cierra el menú.
    const onDown = (e: PointerEvent) => {
      if (open && headerRef.current && !headerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    mq.addEventListener("change", onMq);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      mq.removeEventListener("change", onMq);
    };
  }, [open]);

  // Al abrir: foco al primer enlace y contenido principal inerte (no se puede tabular detrás del menú).
  useEffect(() => {
    const main = document.getElementById("contenido");
    main?.toggleAttribute("inert", open);
    if (open) menuRef.current?.querySelector("a")?.focus();
    return () => main?.removeAttribute("inert");
  }, [open]);

  // Sección visible → aria-current en el enlace correspondiente.
  useEffect(() => {
    const els = LINKS.map((l) => document.getElementById(l.href.slice(1))).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setCurrent(`#${hit.target.id}`);
        else if (window.scrollY < 200) setCurrent(null);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const label = open ? "Cerrar menú" : "Abrir menú";

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b-4 border-tinta bg-papel">
      <nav className="wrap flex h-[76px] items-center justify-between gap-3 lg:h-[92px] lg:gap-6" aria-label="Principal">
        <a href="#inicio" className="flex items-center gap-3.5 no-underline" aria-label="EcoQuest, ir al inicio">
          <Icon name="leaf" size={40} eager className="px-shadow hidden sm:inline-block" />
          <span className="font-pixel text-[18px] font-bold leading-[1.08] tracking-[-0.5px] [text-shadow:3px_3px_0_var(--color-lima)] lg:text-[21px]" aria-hidden="true">
            ECO<br />QUEST
          </span>
        </a>
        <ul role="list" className="hidden items-center gap-1.5 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}><a className="nav-link" href={l.href} aria-current={current === l.href ? "location" : undefined}>{l.label}</a></li>
          ))}
        </ul>
        <div className="flex items-center gap-2.5 sm:gap-4">
          <Link className="btn btn-sm px-3 text-[15px] xs:px-4 xs:text-sm lg:px-[18px] lg:leading-normal" href="/jugar">¡Jugar la demo!</Link>
          <button
            id="menu-btn"
            ref={btnRef}
            type="button"
            className={`flex h-12 w-12 items-center justify-center border-3 border-tinta shadow-brutal-sm transition-[transform,box-shadow] duration-snap active:translate-x-[3px] active:translate-y-[3px] active:shadow-none lg:hidden ${open ? "bg-voltio" : "bg-white"}`}
            aria-controls="menu-movil"
            aria-expanded={open}
            aria-label={label}
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden="true" className="flex flex-col gap-[5px]"><i className="block h-[4px] w-6 bg-tinta" /><i className="block h-[4px] w-6 bg-tinta" /><i className="block h-[4px] w-6 bg-tinta" /></span>
          </button>
        </div>
      </nav>
      <div id="menu-movil" ref={menuRef} className="border-t-4 border-tinta bg-papel lg:hidden" hidden={!open} onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
        <ul role="list" className="wrap flex flex-col gap-3 py-5">
          {LINKS.map((l) => (
            <li key={l.href}><a className="flex min-h-tap items-center border-3 border-tinta bg-white px-4 text-[19px] font-bold shadow-brutal-sm" href={l.href} aria-current={current === l.href ? "location" : undefined}>{l.label}</a></li>
          ))}
        </ul>
      </div>
    </header>
  );
}

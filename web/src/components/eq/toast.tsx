"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { t } from "@/i18n";
import { PixelIcon, type PixelIconName } from "./pixel-icon";

const V = {
  ok: { bg: "bg-lima", icon: "check" as PixelIconName, role: "status", autoMs: 8000 },
  xp: { bg: "bg-voltio", icon: "star" as PixelIconName, role: "status", autoMs: 8000 },
  info: { bg: "bg-glitch", icon: "eye" as PixelIconName, role: "status", autoMs: 0 },
  warn: { bg: "bg-lava", icon: "warn" as PixelIconName, role: "alert", autoMs: 0 },
} as const;

export type EqToastVariant = keyof typeof V;

/**
 * Confirmación breve (§7.6). Sin sonido ni vibración. `ok`/`xp` se cierran solas a los 8 s;
 * `warn` se queda hasta que se cierre con el botón; `info` lo desmonta quien lo muestra.
 * Accesibilidad: el contenedor en vivo (sr-only) se monta vacío y el texto se inyecta después,
 * porque los lectores de pantalla suelen ignorar un `role=status/alert` que nace con contenido.
 */
export function EqToast({ variant, title, children }: { variant: EqToastVariant; title: string; children?: React.ReactNode }) {
  const v = V[variant];
  const [closed, setClosed] = useState(false);
  const [announce, setAnnounce] = useState("");
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setTimeout(() => setAnnounce(visualRef.current?.textContent ?? ""), 150);
    return () => clearTimeout(id);
  });

  useEffect(() => {
    if (!v.autoMs) return;
    const id = setTimeout(() => setClosed(true), v.autoMs);
    return () => clearTimeout(id);
  }, [v.autoMs]);

  return (
    <>
      <div role={v.role} className="sr-only">
        {closed ? "" : announce}
      </div>
      {!closed && (
        <div className={cn("flex w-full max-w-[420px] items-start gap-3 border-4 border-tinta px-3.5 py-3 text-tinta shadow-brutal", v.bg)}>
          {/* El contenido va oculto al lector (ya se anuncia por el contenedor en vivo); el botón de cierre no. */}
          <div ref={visualRef} aria-hidden="true" className="flex min-w-0 flex-1 items-start gap-3">
            <span className="flex h-9 w-9 flex-none items-center justify-center border-3 border-tinta bg-white">
              <PixelIcon name={v.icon} scale={4} flat />
            </span>
            <div className="min-w-0 flex-1">
              <b className="block font-display text-[18px] font-normal">{title}</b>
              {children && <span className="text-sm leading-[1.35]">{children}</span>}
            </div>
          </div>
          {variant !== "info" && (
            <button
              type="button"
              onClick={() => setClosed(true)}
              aria-label={t("common.close")}
              className="-my-1 -mr-1.5 flex h-11 w-11 flex-none cursor-pointer items-center justify-center border-3 border-tinta bg-white font-pixel text-pixel-sm font-bold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-tinta"
            >
              <span aria-hidden="true">✕</span>
            </button>
          )}
        </div>
      )}
    </>
  );
}

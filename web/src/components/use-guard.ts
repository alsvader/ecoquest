"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useExpedition } from "./expedition-provider";

/**
 * Guarda de pantallas de sesión. Sin progreso redirige a `/jugar` (única entrada al juego).
 * `stage`:
 * - "active" (por defecto): requiere una expedición en curso; si ya terminó, va a `/resumen`.
 * - "ended": requiere una expedición terminada; si sigue en curso, va a `/sesion`.
 */
export function useRequireProgress(stage: "active" | "ended" = "active") {
  const { loaded, progress } = useExpedition();
  const router = useRouter();
  const ended = !!progress?.endedAt;
  const wrongStage = !!progress && (stage === "active" ? ended : !ended);
  useEffect(() => {
    if (!loaded) return;
    if (!progress) router.replace("/jugar");
    else if (wrongStage) router.replace(stage === "active" ? "/resumen" : "/sesion");
  }, [loaded, progress, wrongStage, stage, router]);
  return { ready: loaded && !!progress && !wrongStage, progress };
}

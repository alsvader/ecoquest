"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useExpedition } from "./expedition-provider";

/** Redirige al inicio de la expedición si no hay sesión activa. */
export function useRequireProgress() {
  const { loaded, progress } = useExpedition();
  const router = useRouter();
  useEffect(() => {
    if (loaded && !progress) router.replace("/expedicion");
  }, [loaded, progress, router]);
  return { ready: loaded && !!progress, progress };
}

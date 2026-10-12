"use client";

import { useNow } from "@/components/use-now";
import { t } from "@/i18n";
import { formatDuration } from "@/lib/session";

/** Tiempo en sesión. Aislado para que el tic de cada segundo solo re-renderice este párrafo. */
export function Elapsed({ startedAt }: { startedAt: number }) {
  const now = useNow();
  return <p className="text-center text-sm font-bold">{t("session.elapsed", { time: now === null ? "0:00" : formatDuration(now - startedAt) })}</p>;
}

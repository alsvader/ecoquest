"use client";

import { useEffect } from "react";
import { t } from "@/i18n";
import { track } from "@/lib/track";

/**
 * Registra la vista de pantalla en el registro local y, si se da `title` (ya traducido),
 * fija `document.title` como «título · EcoQuest» (las páginas son client components).
 */
export function useScreenView(name: string, title?: string) {
  useEffect(() => {
    track("screen_view", { interaction: false, data: { screen: name } });
  }, [name]);
  useEffect(() => {
    if (title) document.title = `${title} · ${t("app.name")}`;
  }, [title]);
}

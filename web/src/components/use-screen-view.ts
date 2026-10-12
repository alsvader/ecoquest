"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

/** Registra la vista de pantalla en el registro local. */
export function useScreenView(name: string) {
  useEffect(() => {
    track("screen_view", { interaction: false, data: { screen: name } });
  }, [name]);
}

import { loadFont as loadArchivo } from "@remotion/google-fonts/ArchivoBlack";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";
import { loadFont as loadPixel } from "@remotion/google-fonts/Silkscreen";
import { loadFont as loadGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import timeline from "./timeline.json";

/** Paleta de web/src/app/tokens.css. Regla de oro: los colores brillantes siempre llevan texto negro. */
export const C = {
  lima: "#B6FF3B",
  amarillo: "#FFE600",
  rosa: "#FF3EA5",
  cian: "#00E5FF",
  naranja: "#FF7A00",
  selva: "#0A5C2B",
  tinta: "#000000",
  papel: "#FFFBEF",
  blanco: "#FFFFFF",
} as const;
export type Color = (typeof C)[keyof typeof C];

export const F = {
  pixel: loadPixel("normal", { weights: ["700"], subsets: ["latin", "latin-ext"] }).fontFamily,
  display: loadArchivo("normal", { weights: ["400"], subsets: ["latin", "latin-ext"] }).fontFamily,
  mono: loadMono("normal", { weights: ["500", "700"], subsets: ["latin"] }).fontFamily,
  body: loadGrotesk("normal", { weights: ["400", "500", "700"], subsets: ["latin", "latin-ext"] }).fontFamily,
};

export const FPS = timeline.fps;
/** 120 BPM a 30 fps: un tiempo = 15 cuadros, un compás = 60. Los golpes visuales caen en múltiplos de BEAT. */
export const BEAT = (60 / timeline.bpm) * FPS;
export const BAR = BEAT * 4;

export const SCENES = timeline.scenes.reduce<{ id: string; from: number; frames: number }[]>((acc, s) => {
  const prev = acc[acc.length - 1];
  acc.push({ id: s.id, frames: s.frames, from: prev ? prev.from + prev.frames : 0 });
  return acc;
}, []);
export const TOTAL_FRAMES = SCENES.reduce((n, s) => n + s.frames, 0);

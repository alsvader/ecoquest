import { Archivo_Black, Silkscreen, Space_Grotesk } from "next/font/google";

/** Opción B del sistema de diseño (§4.2): next/font autoalojado, variables CSS. */
export const fontPixel = Silkscreen({
  weight: "700", // solo se usa el 700 (el doc también lista 400; no se usa en ningún componente)
  subsets: ["latin", "latin-ext"], // necesario para Á É Í Ó Ú Ñ
  display: "swap",
  variable: "--font-pixel",
});

export const fontDisplay = Archivo_Black({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-display",
});

export const fontBody = Space_Grotesk({
  weight: ["400", "500", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-body",
});

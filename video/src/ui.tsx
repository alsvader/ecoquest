import type { CSSProperties, ReactNode } from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { EASE_OUT, usePop } from "./fx";
import { C, F } from "./theme";

export type IconName =
  | "arrow" | "camera" | "check" | "eye" | "flower" | "hand" | "heart" | "leaf" | "lock"
  | "medal" | "phone" | "pin" | "plus" | "retry" | "star" | "tree" | "warn";

export function PixelIcon({ name, size = 64, style }: { name: IconName; size?: number; style?: CSSProperties }) {
  return <Img src={staticFile(`icons/${name}.svg`)} style={{ width: size, height: size, imageRendering: "pixelated", display: "block", ...style }} />;
}

/** Caja neo-brutalista: borde negro grueso y sombra desplazada sin difuminar. */
export function Box({ children, bg = C.blanco, shadow = 12, border = 5, style }: { children?: ReactNode; bg?: string; shadow?: number; border?: number; style?: CSSProperties }) {
  return (
    <div style={{ background: bg, border: `${border}px solid ${C.tinta}`, boxShadow: `${shadow}px ${shadow}px 0 0 ${C.tinta}`, ...style }}>
      {children}
    </div>
  );
}

/** Etiqueta pixel en MAYÚSCULAS (estilo HUD / sticker). */
export function Sticker({ children, bg = C.amarillo, color = C.tinta, size = 28, rotate = -3, style }: { children: ReactNode; bg?: string; color?: string; size?: number; rotate?: number; style?: CSSProperties }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.45,
        padding: `${size * 0.42}px ${size * 0.7}px`,
        background: bg,
        color,
        border: `4px solid ${C.tinta}`,
        boxShadow: `7px 7px 0 0 ${C.tinta}`,
        fontFamily: F.pixel,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: size * 0.12,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Sticker que entra con resorte desde una dirección y luego flota. */
export function FlyIn({ children, delay = 0, from = [0, 300], rotate = 0, float = 8, style }: { children: ReactNode; delay?: number; from?: [number, number]; rotate?: number; float?: number; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const p = usePop(delay, { damping: 12, stiffness: 160 });
  const bob = Math.sin((frame - delay) / 14) * float * Math.min(1, p);
  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(${from[0] * (1 - p)}px, ${from[1] * (1 - p) + bob}px) rotate(${rotate * (1 - p)}deg) scale(${0.4 + 0.6 * p})`,
        opacity: Math.min(1, p * 3),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** Línea de texto que sube desde una máscara (tipografía cinética). */
export function Rise({ children, delay = 0, dur = 14, style }: { children: ReactNode; delay?: number; dur?: number; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.08em", ...style }}>
      <div style={{ transform: `translateY(${(1 - p) * 110}%) rotate(${(1 - p) * 4}deg)`, transformOrigin: "left bottom" }}>{children}</div>
    </div>
  );
}

/** Marco de teléfono neo-brutalista (pantalla 390×844). */
export const PHONE_RATIO = 844 / 390;
export function Phone({ width = 420, children, shadow = C.lima, style }: { width?: number; children: ReactNode; shadow?: string; style?: CSSProperties }) {
  const bezel = width * 0.04;
  const h = width * PHONE_RATIO;
  return (
    <div style={{ position: "relative", width: width + bezel * 2, height: h + bezel * 2 + width * 0.06, ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.tinta,
          border: `5px solid ${C.tinta}`,
          boxShadow: `${width * 0.045}px ${width * 0.045}px 0 0 ${shadow}, ${width * 0.045}px ${width * 0.045}px 0 5px ${C.tinta}`,
        }}
      />
      {/* Barra de estado */}
      <div style={{ position: "absolute", left: bezel, right: bezel, top: bezel, height: width * 0.06, background: C.blanco, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${width * 0.04}px`, fontFamily: F.body, fontWeight: 700, fontSize: width * 0.033 }}>
        <span>9:41</span>
        <div style={{ width: width * 0.3, height: "100%", background: C.tinta }} />
        <span style={{ letterSpacing: -1 }}>▮▮▮</span>
      </div>
      <div style={{ position: "absolute", left: bezel, top: bezel + width * 0.06, width, height: h, overflow: "hidden", background: C.papel }}>{children}</div>
    </div>
  );
}

/** Captura dentro del teléfono (llena la pantalla). */
export function Screen({ src, style }: { src: string; style?: CSSProperties }) {
  return <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", ...style }} />;
}

/** Ventana de navegador neo-brutalista. */
export function Browser({ width = 1240, height = 775, url = "localhost:3000", children, style }: { width?: number; height?: number; url?: string; children: ReactNode; style?: CSSProperties }) {
  const bar = 58;
  return (
    <div style={{ width, height: height + bar, background: C.blanco, border: `5px solid ${C.tinta}`, boxShadow: `18px 18px 0 0 ${C.tinta}`, position: "relative", overflow: "hidden", ...style }}>
      <div style={{ height: bar, borderBottom: `5px solid ${C.tinta}`, background: C.papel, display: "flex", alignItems: "center", gap: 12, padding: "0 18px" }}>
        {[C.rosa, C.amarillo, C.lima].map((c) => (
          <div key={c} style={{ width: 20, height: 20, background: c, border: `3px solid ${C.tinta}` }} />
        ))}
        <div style={{ marginLeft: 16, flex: 1, height: 34, border: `3px solid ${C.tinta}`, background: C.blanco, display: "flex", alignItems: "center", gap: 10, padding: "0 14px", fontFamily: F.body, fontWeight: 500, fontSize: 18 }}>
          <PixelIcon name="lock" size={18} />
          {url}
        </div>
      </div>
      <div style={{ position: "absolute", top: bar, left: 0, width, height, overflow: "hidden" }}>{children}</div>
    </div>
  );
}

export const T = {
  display: (size: number, color: string = C.tinta): CSSProperties => ({ fontFamily: F.display, fontSize: size, lineHeight: 0.98, color, letterSpacing: -size * 0.02 }),
  body: (size: number, color: string = C.tinta, weight = 500): CSSProperties => ({ fontFamily: F.body, fontSize: size, fontWeight: weight, lineHeight: 1.3, color }),
  pixel: (size: number, color: string = C.tinta): CSSProperties => ({ fontFamily: F.pixel, fontWeight: 700, fontSize: size, color, letterSpacing: size * 0.12, textTransform: "uppercase" }),
};

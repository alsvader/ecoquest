import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./theme";

// ── Curvas ───────────────────────────────────────────────────────────────────
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);

/** Resorte "seco" (neo-brutalismo: entra rápido, rebota poco). */
export function usePop(delay = 0, config: { damping?: number; stiffness?: number; mass?: number } = {}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 180, mass: 0.8, ...config } });
}

/** 0→1 lineal con easing entre dos cuadros. */
export function useRamp(from: number, to: number, easing = EASE_OUT) {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
}

// ── Fondo con retícula de puntos que deriva + viñeta ────────────────────────
export function DotBg({ bg, dot = "rgba(0,0,0,0.13)", size = 34, drift = 0.6, children }: { bg: string; dot?: string; size?: number; drift?: number; children?: ReactNode }) {
  const frame = useCurrentFrame();
  const o = frame * drift;
  return (
    <AbsoluteFill style={{ backgroundColor: bg }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${dot} 2.2px, transparent 2.6px)`,
          backgroundSize: `${size}px ${size}px`,
          backgroundPosition: `${o}px ${o * 0.5}px`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
}

export function Vignette({ strength = 0.35 }: { strength?: number }) {
  return (
    <AbsoluteFill
      style={{ pointerEvents: "none", background: `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,${strength}) 100%)` }}
    />
  );
}

/** Grano de película: ruido SVG que cambia de semilla cada 2 cuadros. */
export function Grain({ opacity = 0.07 }: { opacity?: number }) {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 12;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "multiply", opacity }}>
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
}

/** Cámara: empuje lento + sacudida opcional en cuadros de impacto. */
export function Camera({
  children,
  zoom = [1, 1.05],
  duration,
  shakes = [],
  rotate = 0,
}: {
  children: ReactNode;
  zoom?: [number, number];
  duration: number;
  shakes?: number[];
  rotate?: number;
}) {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, duration], zoom, { easing: Easing.inOut(Easing.quad) });
  let dx = 0;
  let dy = 0;
  for (const at of shakes) {
    const t = frame - at;
    if (t >= 0 && t < 12) {
      const amp = 18 * (1 - t / 12) ** 2;
      dx += (random(`sx${at}-${t}`) - 0.5) * 2 * amp;
      dy += (random(`sy${at}-${t}`) - 0.5) * 2 * amp;
    }
  }
  const r = interpolate(frame, [0, duration], [-rotate, rotate]);
  return (
    <AbsoluteFill style={{ transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(${r}deg)` }}>{children}</AbsoluteFill>
  );
}

// ── Transición de píxeles (cubre la mitad final de una escena y la inicial de la siguiente) ──
export const WIPE = 20;
export function PixelWipe({ color, cols, rows, dir = 1 }: { color: string; cols?: number; rows?: number; dir?: 1 | -1 }) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  // Celdas casi cuadradas en cualquier orientación: 16 × 9 en horizontal, 9 × 16 en vertical.
  const portrait = height > width;
  cols ??= portrait ? 9 : 16;
  rows ??= portrait ? 16 : 9;
  const T = WIPE;
  const cw = width / cols;
  const ch = height / rows;
  const cells: ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cc = dir === 1 ? c : cols - 1 - c;
      const jitter = random(`w${r}-${c}`) * 0.08;
      const d = ((cc + r) / (cols + rows - 2) * 0.22 + jitter) * T;
      const inn = interpolate(frame, [d, d + 0.2 * T], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const out = interpolate(frame, [T / 2 + d, T / 2 + d + 0.2 * T], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const s = inn * (1 - out);
      if (s <= 0) continue;
      cells.push(
        <div
          key={`${r}-${c}`}
          style={{
            position: "absolute",
            left: c * cw,
            top: r * ch,
            width: cw + 1,
            height: ch + 1,
            transform: `scale(${s})`,
            background: color,
            outline: s < 1 ? `4px solid ${C.tinta}` : undefined,
          }}
        />,
      );
    }
  }
  return <AbsoluteFill style={{ pointerEvents: "none" }}>{cells}</AbsoluteFill>;
}

/** Texto con separación RGB (cian/rosa) en ráfagas de glitch. */
export function Glitch({ children, at = [], style }: { children: ReactNode; at?: number[]; style?: CSSProperties }) {
  const frame = useCurrentFrame();
  let k = 0;
  for (const a of at) {
    const t = frame - a;
    if (t >= 0 && t < 8) k = Math.max(k, 1 - t / 8);
  }
  const j = k > 0 ? (random(`g${frame}`) - 0.5) * 2 : 0;
  const off = 14 * k;
  const slice = k > 0 ? random(`gs${frame}`) * 100 : 0;
  return (
    <div style={{ position: "relative", display: "inline-block", ...style }}>
      {k > 0 && (
        <>
          <div style={{ position: "absolute", inset: 0, color: C.cian, transform: `translate(${-off + j * 6}px, ${j * 3}px)`, mixBlendMode: "multiply", clipPath: `inset(${slice}% 0 ${Math.max(0, 70 - slice)}% 0)` }}>
            {children}
          </div>
          <div style={{ position: "absolute", inset: 0, color: C.rosa, transform: `translate(${off - j * 6}px, ${-j * 3}px)`, mixBlendMode: "multiply" }}>
            {children}
          </div>
        </>
      )}
      <div style={{ position: "relative", transform: `translateX(${j * 8 * k}px)` }}>{children}</div>
    </div>
  );
}

/** Ráfaga de confeti pixel desde (x, y). */
export function PixelBurst({ at, x, y, count = 36, colors = [C.lima, C.amarillo, C.rosa, C.cian, C.naranja], spread = 520 }: { at: number; x: number; y: number; count?: number; colors?: string[]; spread?: number }) {
  const frame = useCurrentFrame();
  const t = frame - at;
  if (t < 0 || t > 50) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const a = random(`ba${at}-${i}`) * Math.PI * 2;
        const v = 0.35 + random(`bv${at}-${i}`) * 0.65;
        const p = 1 - (1 - Math.min(1, t / 28)) ** 3;
        const px = x + Math.cos(a) * spread * v * p;
        const py = y + Math.sin(a) * spread * v * p * 0.8 + 0.35 * t * t * 0.5;
        const size = 10 + Math.floor(random(`bs${at}-${i}`) * 3) * 8;
        const op = interpolate(t, [30, 50], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: px,
              top: py,
              width: size,
              height: size,
              background: colors[i % colors.length],
              border: `3px solid ${C.tinta}`,
              opacity: op,
              transform: `rotate(${Math.round(random(`br${i}`) * 4) * 90 + t * 4}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
}

/** Destello blanco de obturador. */
export function Flash({ at, duration = 10, color = "#fff" }: { at: number; duration?: number; color?: string }) {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at, at + 1, at + duration], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (o <= 0) return null;
  return <AbsoluteFill style={{ background: color, opacity: o, pointerEvents: "none" }} />;
}

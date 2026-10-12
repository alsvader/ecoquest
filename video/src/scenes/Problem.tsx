import type { CSSProperties } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Camera, DotBg, EASE_IN_OUT, EASE_OUT, Glitch, PixelBurst, usePop, Vignette } from "../fx";
import { C } from "../theme";
import { Box, PixelIcon, Rise, T } from "../ui";

export const SLAM_1 = 30; // «SCREEN TIME.»
export const STRIKE = 120; // tachado
export const SWAP = 135; // cambia el mensaje
export const SLAM_2 = 165; // «LESS.»

export function Slam({ at, bg, size = 140, children }: { at: number; bg: string; size?: number; children: string }) {
  const p = usePop(at, { damping: 13, stiffness: 260 });
  return (
    <div style={{ display: "inline-block", transform: `scale(${2.2 - 1.2 * p}) rotate(${-2 * p}deg)`, opacity: p > 0.02 ? 1 : 0, transformOrigin: "left center" }}>
      <Box bg={bg} shadow={16} border={6} style={{ padding: "6px 28px 12px", ...T.display(size) }}>
        {children}
      </Box>
    </div>
  );
}

/** `style` cambia la posición (por defecto, a la derecha del texto). */
export function Counter({ style }: { style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const outside = frame >= SWAP + 10;
  // Minutos de pantalla: suben sin parar; luego caen y el contador pasa a «tiempo afuera».
  const up = interpolate(frame, [SLAM_1, STRIKE], [124, 372], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN_OUT });
  const mins = outside ? Math.round(interpolate(frame, [SWAP + 10, SLAM_2 + 10], [0, 20], { extrapolateRight: "clamp", easing: EASE_OUT })) : Math.round(interpolate(frame, [SWAP, SWAP + 10], [up, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const enter = usePop(10);
  const flip = usePop(SWAP + 10, { damping: 12 });
  const bars = [0.42, 0.55, 0.5, 0.71, 0.66, 0.82, Math.min(1, up / 372)];
  return (
    <div style={{ position: "absolute", right: 110, top: 250, ...style, transform: `translateX(${(1 - enter) * 700}px) rotate(${3 - 1 * flip}deg)` }}>
      <Box bg={outside ? C.lima : C.tinta} shadow={18} border={6} style={{ width: 470, padding: 32, outline: outside ? undefined : `6px solid ${C.naranja}`, outlineOffset: -18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, ...T.pixel(24, outside ? C.tinta : C.naranja) }}>
          <PixelIcon name={outside ? "tree" : "phone"} size={52} />
          {outside ? "Time outside" : "Screen time today"}
        </div>
        <Glitch at={[STRIKE, SWAP]}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18, marginTop: 22 }}>
            <span style={{ ...T.pixel(88, outside ? C.tinta : C.blanco), letterSpacing: 2 }}>{outside ? m : `${h}:${String(m).padStart(2, "0")}`}</span>
            <span style={T.pixel(26, outside ? C.tinta : C.naranja)}>{outside ? "min" : "hrs"}</span>
          </div>
        </Glitch>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 150, marginTop: 24 }}>
          {bars.map((b, i) => {
            const grow = interpolate(frame, [14 + i * 4, 30 + i * 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });
            const v = outside ? (i === 6 ? 1 : 0.12) : b * grow;
            return <div key={i} style={{ flex: 1, height: `${v * 100}%`, background: outside ? C.tinta : i === 6 ? C.naranja : C.blanco, border: `4px solid ${outside ? C.tinta : C.blanco}` }} />;
          })}
        </div>
      </Box>
    </div>
  );
}

export function Problem() {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [STRIKE, STRIKE + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });
  const out = interpolate(frame, [SWAP, SWAP + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN_OUT });

  return (
    <DotBg bg={C.selva} dot="rgba(255,255,255,0.10)" drift={-0.6}>
      <Camera duration={240} zoom={[1, 1.06]} shakes={[SLAM_1 + 3, STRIKE + 2, SLAM_2 + 3]}>
        <AbsoluteFill style={{ padding: "190px 150px" }}>
          {frame < SWAP + 14 && (
            <div style={{ transform: `translateY(${-out * 260}px)`, opacity: 1 - out, filter: `blur(${out * 10}px)` }}>
              <Rise delay={4} style={T.display(124, C.blanco)}>Most apps want</Rise>
              <Rise delay={14} style={{ ...T.display(124, C.blanco), marginBottom: 26 }}>more of your</Rise>
              <div style={{ position: "relative", display: "inline-block" }}>
                <Slam at={SLAM_1} bg={C.amarillo}>SCREEN TIME.</Slam>
                <div style={{ position: "absolute", left: -20, right: -40, top: "48%", height: 30, background: C.naranja, border: `5px solid ${C.tinta}`, transform: `scaleX(${strike}) rotate(-3deg)`, transformOrigin: "left center" }} />
              </div>
            </div>
          )}
          {frame >= SWAP && (
            <div>
              <Rise delay={SWAP + 4} style={T.display(124, C.blanco)}>EcoQuest wants</Rise>
              <Rise delay={SWAP + 14} style={{ ...T.display(124, C.blanco), marginBottom: 26 }}>you to use it</Rise>
              <Slam at={SLAM_2} bg={C.lima}>LESS.</Slam>
            </div>
          )}
        </AbsoluteFill>
        <Counter />
        <PixelBurst at={SLAM_2} x={430} y={760} count={34} />
        <div style={{ position: "absolute", left: 150, bottom: 110, opacity: interpolate(frame, [190, 206], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `translateY(${interpolate(frame, [190, 206], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT })}px)`, ...T.body(42, C.blanco) }}>
          A 20‑minute expedition. Your phone stays in your pocket.
        </div>
      </Camera>
      <Vignette strength={0.45} />
    </DotBg>
  );
}

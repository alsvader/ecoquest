import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import results from "../../public/shots/classify-results.json";
import { Camera, DotBg, EASE_IN_OUT, EASE_OUT, usePop, Vignette } from "../fx";
import { BEAT, C, F } from "../theme";
import { Box, FlyIn, PixelIcon, Rise, Sticker, T, type IconName } from "../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const SWITCH = 150; // fase A (arquitectura) → fase B (respuesta real + umbrales)

// ── Fase A · arquitectura ────────────────────────────────────────────────────
export const NODES: { icon: IconName; bg: string; title: string; sub: string }[] = [
  { icon: "phone", bg: C.lima, title: "Phone · PWA", sub: "Downscales the photo on the device" },
  { icon: "arrow", bg: C.amarillo, title: "FastAPI · /classify", sub: "In memory. Never written to disk" },
  { icon: "eye", bg: C.cian, title: "SigLIP2", sub: "Image ↔ text similarity, on CPU" },
];
const NODE_W = 470;
const GAP = 120;
const ROW_X = (1920 - (NODE_W * 3 + GAP * 2)) / 2;
const ROW_Y = 600;

function Node({ i }: { i: number }) {
  const n = NODES[i];
  const p = usePop(20 + i * BEAT, { damping: 13, stiffness: 170 });
  return (
    <div style={{ position: "absolute", left: ROW_X + i * (NODE_W + GAP), top: ROW_Y, transform: `translateY(${(1 - p) * 500}px) scale(${0.6 + 0.4 * p})`, opacity: p > 0.02 ? 1 : 0 }}>
      <Box bg={C.blanco} shadow={14} border={6} style={{ width: NODE_W, padding: 26, display: "flex", gap: 22, alignItems: "center" }}>
        <Box bg={n.bg} shadow={0} border={5} style={{ padding: 12, flexShrink: 0 }}>
          <PixelIcon name={n.icon} size={76} />
        </Box>
        <div>
          <div style={T.display(36)}>{n.title}</div>
          <div style={{ ...T.body(22), marginTop: 6 }}>{n.sub}</div>
        </div>
      </Box>
    </div>
  );
}

function Wire({ i }: { i: number }) {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [40 + i * BEAT, 52 + i * BEAT], [0, 1], { ...clamp, easing: EASE_OUT });
  const x = ROW_X + NODE_W + i * (NODE_W + GAP) + 14;
  return (
    <div style={{ position: "absolute", left: x, top: ROW_Y + 70, width: GAP - 20, height: 12, background: C.blanco, transform: `scaleX(${draw})`, transformOrigin: "left", border: `3px solid ${C.tinta}` }}>
      <div style={{ position: "absolute", right: -16, top: -14, width: 0, height: 0, borderTop: "17px solid transparent", borderBottom: "17px solid transparent", borderLeft: `22px solid ${C.blanco}` }} />
    </div>
  );
}

/** Foto que viaja al modelo y estado que regresa al teléfono. */
function Packets() {
  const frame = useCurrentFrame();
  const startX = ROW_X + 60;
  const endX = ROW_X + 2 * (NODE_W + GAP) + 60;
  const go = interpolate(frame, [72, 104], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const back = interpolate(frame, [110, 138], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const y = ROW_Y - 110;
  return (
    <>
      {frame >= 70 && frame < 110 && (
        <div style={{ position: "absolute", left: startX + (endX - startX) * go, top: y - Math.sin(go * Math.PI) * 60, transform: `rotate(${go * 360}deg)` }}>
          <Img src={staticFile("photos/flower.jpg")} style={{ width: 92, height: 92, objectFit: "cover", border: `5px solid ${C.tinta}`, boxShadow: `6px 6px 0 ${C.lima}` }} />
        </div>
      )}
      {frame >= 108 && (
        <div style={{ position: "absolute", left: endX + (startX - endX) * back, top: y + 10 - Math.sin(back * Math.PI) * 60 }}>
          <Sticker bg={C.lima} size={22} rotate={-3}>✓ confirmed</Sticker>
        </div>
      )}
    </>
  );
}

// ── Fase B · respuesta real del servicio + barras con umbral ─────────────────
// Respuesta real de POST /classify capturada por scripts/capture.mjs (sin mission_id, que repite el comando).
const { mission_id: _omit, ...response } = results.flower;
const JSON_TEXT = JSON.stringify(response, null, 2);
const CMD = "$ curl -F image=@flower.jpg -F mission_id=flower \\\n    localhost:8000/classify";

/** `style` cambia la posición; el tamaño del recuadro y del texto se puede reducir para el formato vertical. */
export function Terminal({ style, width = 900, height = 690, fontSize = 24 }: { style?: CSSProperties; width?: number; height?: number; fontSize?: number }) {
  const frame = useCurrentFrame();
  const t = frame - SWITCH - 8;
  const cmd = CMD.slice(0, Math.max(0, Math.floor(t * 3.2)));
  const body = JSON_TEXT.slice(0, Math.max(0, Math.floor((t - 26) * 12)));
  const p = usePop(SWITCH, { damping: 15, stiffness: 140 });
  const cursor = Math.floor(frame / 8) % 2 === 0;
  return (
    <div style={{ position: "absolute", left: 110, top: 270, ...style, transform: `translateX(${(1 - p) * -1100}px) rotate(-1deg)` }}>
      <Box bg="#0b0b0b" shadow={16} border={6} style={{ width, height, outline: `4px solid ${C.cian}`, outlineOffset: -16, padding: "34px 40px", fontFamily: F.mono, fontSize, lineHeight: 1.42, color: C.blanco, whiteSpace: "pre-wrap" }}>
        <div style={{ color: C.lima }}>{cmd}{t > 0 && cmd.length < CMD.length && cursor ? "▌" : ""}</div>
        <div style={{ marginTop: 14 }}>
          {colorize(body)}
          {body.length > 0 && cursor ? <span style={{ color: C.cian }}>▌</span> : null}
        </div>
      </Box>
    </div>
  );
}

function colorize(s: string): ReactNode[] {
  return s.split(/("[^"]*"\s*:|"[^"]*"|\b\d+(?:\.\d+)?\b)/g).map((part, i) => {
    if (/^"[^"]*"\s*:$/.test(part)) return <span key={i} style={{ color: C.cian }}>{part}</span>;
    if (/^"/.test(part)) return <span key={i} style={{ color: C.amarillo }}>{part}</span>;
    if (/^\d/.test(part)) return <span key={i} style={{ color: C.rosa }}>{part}</span>;
    return <span key={i}>{part}</span>;
  });
}

const BARS: { id: keyof typeof results; icon: IconName; label: string; threshold: number }[] = [
  { id: "leaf", icon: "leaf", label: "Large leaf", threshold: 0.7 },
  { id: "flower", icon: "flower", label: "Flower", threshold: 0.5 },
  { id: "roots", icon: "tree", label: "Visible roots", threshold: 0.6 },
];

export function ThresholdBars({ style, photo = 104, gap = 30 }: { style?: CSSProperties; photo?: number; gap?: number }) {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 1090, top: 300, width: 720, display: "flex", flexDirection: "column", gap, ...style }}>
      {BARS.map((b, i) => {
        const at = SWITCH + 30 + i * BEAT;
        const e = interpolate(frame, [at, at + 12], [0, 1], { ...clamp, easing: EASE_OUT });
        const fill = interpolate(frame, [at + 8, at + 30], [0, results[b.id].target_score], { ...clamp, easing: EASE_OUT });
        const over = fill >= b.threshold;
        return (
          <div key={b.id} style={{ opacity: e, transform: `translateX(${(1 - e) * 200}px)` }}>
            <Box bg={C.blanco} shadow={10} border={5} style={{ padding: "18px 22px", display: "flex", gap: 20, alignItems: "center" }}>
              <Img src={staticFile(`photos/${b.id}.jpg`)} style={{ width: photo, height: photo, objectFit: "cover", border: `4px solid ${C.tinta}` }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center", ...T.display(30) }}>
                    <PixelIcon name={b.icon} size={34} />
                    {b.label}
                  </div>
                  <div style={{ ...T.pixel(16), background: over ? C.lima : C.papel, border: `3px solid ${C.tinta}`, padding: "4px 8px" }}>{over ? "✓ match" : "…"}</div>
                </div>
                <div style={{ position: "relative", height: 30, marginTop: 14, border: `4px solid ${C.tinta}`, background: C.papel }}>
                  <div style={{ height: "100%", width: `${fill * 100}%`, background: C.lima, borderRight: fill > 0 ? `4px solid ${C.tinta}` : undefined }} />
                  <div style={{ position: "absolute", top: -10, bottom: -10, left: `${b.threshold * 100}%`, borderLeft: `5px dashed ${C.tinta}` }} />
                </div>
              </div>
            </Box>
          </div>
        );
      })}
      <div style={{ ...T.body(26, C.blanco), opacity: interpolate(frame, [SWITCH + 80, SWITCH + 92], [0, 1], clamp) }}>
        Dashed line = the mission’s threshold. A softmax similarity, not a calibrated probability, so the app never shows a %.
      </div>
    </div>
  );
}

export function AI() {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [SWITCH - 12, SWITCH], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const phaseA = frame < SWITCH;
  return (
    <DotBg bg={C.tinta} dot="rgba(0,229,255,0.16)" drift={0.6}>
      <Camera duration={300} zoom={[1.02, 1.06]} shakes={[SWITCH]}>
        <AbsoluteFill style={{ padding: "90px 110px" }}>
          <FlyIn from={[-300, 0]} float={0} style={{ position: "relative" }}>
            <Sticker bg={C.cian} size={24} rotate={-2}>■ How it works</Sticker>
          </FlyIn>
          <div style={{ marginTop: 30, display: "flex", gap: 28, alignItems: "baseline" }}>
            <Rise delay={6} style={T.display(100, C.blanco)}>Open‑weight AI</Rise>
            <Rise delay={12} style={T.display(100, C.cian)}>at the core.</Rise>
          </div>
        </AbsoluteFill>

        {phaseA && (
          <AbsoluteFill style={{ opacity: 1 - out, transform: `translateY(${out * -80}px) scale(${1 - out * 0.08})` }}>
            <FlyIn delay={BEAT} from={[400, 0]} float={4} style={{ left: 110, top: 330 }}>
              <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                <Box bg={C.blanco} shadow={10} border={5} style={{ padding: "14px 22px", fontFamily: F.mono, fontWeight: 700, fontSize: 32 }}>google/siglip2-base-patch16-256</Box>
                <Sticker bg={C.amarillo} size={22} rotate={3}>Apache‑2.0</Sticker>
                <Sticker bg={C.rosa} size={22} rotate={-3}>Zero‑shot</Sticker>
              </div>
            </FlyIn>
            {[0, 1].map((i) => (
              <Wire key={i} i={i} />
            ))}
            {[0, 1, 2].map((i) => (
              <Node key={i} i={i} />
            ))}
            <Packets />
            <div style={{ position: "absolute", left: 110, bottom: 110, ...T.body(30, C.blanco), opacity: interpolate(frame, [100, 112], [0, 1], clamp) }}>
              Without the model there is no way to check a finding. It is the product, not a decoration.
            </div>
          </AbsoluteFill>
        )}
        {!phaseA && (
          <>
            <Terminal />
            <ThresholdBars />
          </>
        )}
      </Camera>
      <Vignette strength={0.5} />
    </DotBg>
  );
}

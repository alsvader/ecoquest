import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Camera, DotBg, EASE_IN_OUT, EASE_OUT, usePop, Vignette } from "../../fx";
import { NODES, SWITCH, Terminal, ThresholdBars } from "../../scenes/AI";
import { BEAT, C, F } from "../../theme";
import { Box, FlyIn, PixelIcon, Rise, Sticker, T } from "../../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ── Fase A · arquitectura en columna (PWA ↓ FastAPI ↓ SigLIP2) ─────────────────
const NODE_W = 880;
const NODE_H = 150;
const GAP = 90;
const COL_X = (1080 - NODE_W) / 2;
const COL_Y = 720;
const nodeY = (i: number) => COL_Y + i * (NODE_H + GAP);

function Node({ i }: { i: number }) {
  const n = NODES[i];
  const p = usePop(20 + i * BEAT, { damping: 13, stiffness: 170 });
  return (
    <div style={{ position: "absolute", left: COL_X, top: nodeY(i), transform: `translateX(${(1 - p) * (i % 2 === 0 ? -1 : 1) * 900}px) scale(${0.6 + 0.4 * p})`, opacity: p > 0.02 ? 1 : 0 }}>
      <Box bg={C.blanco} shadow={14} border={6} style={{ width: NODE_W, height: NODE_H, boxSizing: "border-box", padding: "0 26px", display: "flex", gap: 24, alignItems: "center" }}>
        <Box bg={n.bg} shadow={0} border={5} style={{ padding: 12, flexShrink: 0 }}>
          <PixelIcon name={n.icon} size={76} />
        </Box>
        <div>
          <div style={T.display(40)}>{n.title}</div>
          <div style={{ ...T.body(26), marginTop: 6 }}>{n.sub}</div>
        </div>
      </Box>
    </div>
  );
}

/** Flecha vertical entre nodos, alineada con los iconos. */
function Wire({ i }: { i: number }) {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [40 + i * BEAT, 52 + i * BEAT], [0, 1], { ...clamp, easing: EASE_OUT });
  return (
    <div style={{ position: "absolute", left: COL_X + 26 + 55 - 6, top: nodeY(i) + NODE_H + 16, width: 12, height: GAP - 44, background: C.blanco, transform: `scaleY(${draw})`, transformOrigin: "top", border: `3px solid ${C.tinta}` }}>
      <div style={{ position: "absolute", bottom: -24, left: -14, width: 0, height: 0, borderLeft: "17px solid transparent", borderRight: "17px solid transparent", borderTop: `22px solid ${C.blanco}` }} />
    </div>
  );
}

/** Foto que baja al modelo y estado que sube al teléfono, por el carril derecho. */
function Packets() {
  const frame = useCurrentFrame();
  const startY = nodeY(0) + 30;
  const endY = nodeY(2) + 30;
  const x = COL_X + NODE_W - 170;
  const go = interpolate(frame, [72, 104], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const back = interpolate(frame, [110, 138], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  return (
    <>
      {frame >= 70 && frame < 110 && (
        <div style={{ position: "absolute", top: startY + (endY - startY) * go, left: x + Math.sin(go * Math.PI) * 60, transform: `rotate(${go * 360}deg)` }}>
          <Img src={staticFile("photos/flower.jpg")} style={{ width: 92, height: 92, objectFit: "cover", border: `5px solid ${C.tinta}`, boxShadow: `6px 6px 0 ${C.lima}` }} />
        </div>
      )}
      {frame >= 108 && (
        <div style={{ position: "absolute", top: endY + 20 + (startY - endY) * back, left: x - 160 + Math.sin(back * Math.PI) * 60 }}>
          <Sticker bg={C.lima} size={22} rotate={-3}>✓ confirmed</Sticker>
        </div>
      )}
    </>
  );
}

export function AI() {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [SWITCH - 12, SWITCH], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const phaseA = frame < SWITCH;
  return (
    <DotBg bg={C.tinta} dot="rgba(0,229,255,0.16)" drift={0.6}>
      <Camera duration={300} zoom={[1.02, 1.06]} shakes={[SWITCH]}>
        <AbsoluteFill style={{ padding: "230px 80px 0" }}>
          <FlyIn from={[-300, 0]} float={0} style={{ position: "relative" }}>
            <Sticker bg={C.cian} size={24} rotate={-2}>■ How it works</Sticker>
          </FlyIn>
          {/* En la fase B el título sale para dejarle la pantalla a la respuesta real. */}
          {phaseA && (
            <div style={{ marginTop: 30, opacity: 1 - out, transform: `translateY(${out * -120}px)` }}>
              <Rise delay={6} style={T.display(100, C.blanco)}>Open‑weight AI</Rise>
              <Rise delay={12} style={T.display(100, C.cian)}>at the core.</Rise>
            </div>
          )}
        </AbsoluteFill>

        {phaseA && (
          <AbsoluteFill style={{ opacity: 1 - out, transform: `translateY(${out * -80}px) scale(${1 - out * 0.08})` }}>
            <FlyIn delay={BEAT} from={[400, 0]} float={4} style={{ left: 80, top: 540 }}>
              <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                <Box bg={C.blanco} shadow={10} border={5} style={{ padding: "12px 18px", fontFamily: F.mono, fontWeight: 700, fontSize: 28 }}>google/siglip2-base-patch16-256</Box>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <Sticker bg={C.amarillo} size={20} rotate={3}>Apache‑2.0</Sticker>
                  <Sticker bg={C.rosa} size={20} rotate={-3}>Zero‑shot</Sticker>
                </div>
              </div>
            </FlyIn>
            {[0, 1].map((i) => (
              <Wire key={i} i={i} />
            ))}
            {[0, 1, 2].map((i) => (
              <Node key={i} i={i} />
            ))}
            <Packets />
            <div style={{ position: "absolute", left: 80, width: 840, top: nodeY(2) + NODE_H + 60, ...T.body(30, C.blanco), opacity: interpolate(frame, [100, 112], [0, 1], clamp) }}>
              Without the model there is no way to check a finding. It is the product, not a decoration.
            </div>
          </AbsoluteFill>
        )}
        {!phaseA && (
          <>
            <Terminal style={{ left: 80, top: 300 }} width={920} height={610} fontSize={20} />
            <ThresholdBars style={{ left: 80, top: 965, width: 920 }} photo={80} gap={20} />
          </>
        )}
      </Camera>
      <Vignette strength={0.5} />
    </DotBg>
  );
}

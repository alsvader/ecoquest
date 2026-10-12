import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Camera, EASE_OUT, PixelBurst, usePop } from "../fx";
import { BEAT, C } from "../theme";
import { Box, FlyIn, Phone, PixelIcon, Rise, Screen, Sticker, T } from "../ui";

/** Rayos giratorios de "recompensa" (estilo videojuego). */
export function Sunburst({ cx = 560, cy = 640 }: { cx?: number; cy?: number }) {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.amarillo, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: cx - 1600,
          top: cy - 1600,
          width: 3200,
          height: 3200,
          background: `repeating-conic-gradient(from ${frame * 0.6}deg, rgba(255,255,255,0.45) 0deg 9deg, transparent 9deg 18deg)`,
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(circle at ${cx}px ${cy}px, transparent 30%, rgba(255,230,0,0.9) 75%)` }} />
    </AbsoluteFill>
  );
}

/** Insignia de doble rombo (web/src/components/eq/insignia.tsx), redibujada a escala de video. */
export function Insignia({ cx = 560, cy = 640 }: { cx?: number; cy?: number }) {
  const frame = useCurrentFrame();
  const p = usePop(18, { damping: 11, stiffness: 120 });
  const ribbon = usePop(36, { damping: 9, stiffness: 240 });
  const float = Math.sin(frame / 15) * 8;
  const S = 330;
  return (
    <div style={{ position: "absolute", left: cx - S / 2, top: cy - S / 2 + float, width: S, height: S, transform: `scale(${p}) rotate(${(1 - p) * -540}deg)` }}>
      <div style={{ position: "absolute", inset: 0, transform: "rotate(45deg)", background: C.amarillo, border: `8px solid ${C.tinta}`, boxShadow: `16px 16px 0 ${C.tinta}` }} />
      <div style={{ position: "absolute", inset: 56, transform: "rotate(45deg)", background: C.lima, border: `8px solid ${C.tinta}` }} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 10 }}>
        <PixelIcon name="tree" size={110} />
        <div style={{ ...T.pixel(20), textAlign: "center", lineHeight: 1.3 }}>Descubre<br />el Edén</div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: "50%", bottom: -36, transform: `translateX(-50%) scale(${ribbon}) rotate(-4deg)` }}>
        <Sticker bg={C.rosa} size={26} rotate={0}>Insignia</Sticker>
      </div>
    </div>
  );
}

export function Badge() {
  const frame = useCurrentFrame();
  const phone = usePop(BEAT * 2, { damping: 15, stiffness: 130 });
  return (
    <AbsoluteFill>
      <Sunburst />
      <Camera duration={180} zoom={[1.04, 1]} shakes={[30]}>
        <AbsoluteFill style={{ padding: "80px 110px" }}>
          <Rise delay={2} style={T.display(112)}>Expedition</Rise>
          <Rise delay={8} style={T.display(112)}>complete!</Rise>
        </AbsoluteFill>
        <Insignia />
        <PixelBurst at={30} x={560} y={640} count={60} spread={760} />
        <div style={{ position: "absolute", left: 980, top: 300, opacity: interpolate(frame, [54, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }), transform: `translateY(${interpolate(frame, [54, 66], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT })}px)`, width: 380 }}>
          <div style={T.body(34, C.tinta, 700)}>Your findings, time in session, and a badge.</div>
          <div style={{ ...T.body(28), marginTop: 16 }}>Results are visual estimates. They don’t identify species.</div>
        </div>
        <div style={{ position: "absolute", left: 1420, top: 70, transform: `translateY(${(1 - phone) * 1100}px) rotate(4deg) scale(0.86)`, transformOrigin: "center top" }}>
          <Phone width={380} shadow={C.rosa}>
            <Screen src="shots/app-07-resumen.png" />
          </Phone>
        </div>
        <FlyIn delay={BEAT * 6} from={[0, 300]} rotate={-20} style={{ left: 980, top: 600 }}>
          <Sticker bg={C.blanco} size={24} rotate={-3}>
            <PixelIcon name="check" size={30} /> 3/3 missions
          </Sticker>
        </FlyIn>
        <FlyIn delay={BEAT * 7} from={[0, 300]} rotate={20} style={{ left: 800, top: 930 }}>
          <Box bg={C.rosa} shadow={7} border={4} style={{ padding: "12px 18px", ...T.pixel(22), transform: "rotate(2deg)" }}>
            Delete your photos anytime
          </Box>
        </FlyIn>
      </Camera>
    </AbsoluteFill>
  );
}

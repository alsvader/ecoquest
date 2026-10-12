import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Camera, EASE_OUT, PixelBurst, usePop } from "../../fx";
import { Insignia, Sunburst } from "../../scenes/Badge";
import { BEAT, C } from "../../theme";
import { Box, FlyIn, Phone, PixelIcon, Rise, Screen, Sticker, T } from "../../ui";

// Insignia a la izquierda y resumen en el teléfono a la derecha, debajo del título.
const BADGE = { cx: 320, cy: 800 };

export function Badge() {
  const frame = useCurrentFrame();
  const phone = usePop(BEAT * 2, { damping: 15, stiffness: 130 });
  const text = interpolate(frame, [54, 66], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <Sunburst {...BADGE} />
      <Camera duration={180} zoom={[1.04, 1]} shakes={[30]}>
        <AbsoluteFill style={{ padding: "230px 80px 0" }}>
          <Rise delay={2} style={T.display(112)}>Expedition</Rise>
          <Rise delay={8} style={T.display(112)}>complete!</Rise>
        </AbsoluteFill>
        <Insignia {...BADGE} />
        <PixelBurst at={30} x={BADGE.cx} y={BADGE.cy} count={60} spread={700} />
        <div style={{ position: "absolute", left: 600, top: 500, transform: `translateY(${(1 - phone) * 1500}px) rotate(4deg) scale(0.72)`, transformOrigin: "center top" }}>
          <Phone width={380} shadow={C.rosa}>
            <Screen src="shots/app-07-resumen.png" />
          </Phone>
        </div>
        <div style={{ position: "absolute", left: 80, top: 1170, width: 900, opacity: text, transform: `translateY(${interpolate(text, [0, 1], [30, 0], { easing: EASE_OUT })}px)` }}>
          <div style={T.body(38, C.tinta, 700)}>Your findings, time in session, and a badge.</div>
          <div style={{ ...T.body(30), marginTop: 12 }}>Results are visual estimates. They don’t identify species.</div>
        </div>
        <FlyIn delay={BEAT * 6} from={[0, 300]} rotate={-20} style={{ left: 80, top: 1390 }}>
          <Sticker bg={C.blanco} size={22} rotate={-3}>
            <PixelIcon name="check" size={28} /> 3/3 missions
          </Sticker>
        </FlyIn>
        <FlyIn delay={BEAT * 7} from={[0, 300]} rotate={20} style={{ left: 440, top: 1400 }}>
          <Box bg={C.rosa} shadow={7} border={4} style={{ padding: "12px 18px", ...T.pixel(18), transform: "rotate(2deg)" }}>
            Delete your photos anytime
          </Box>
        </FlyIn>
      </Camera>
    </AbsoluteFill>
  );
}

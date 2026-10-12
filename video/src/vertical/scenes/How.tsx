import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camera, DotBg, usePop } from "../../fx";
import { STEPS, XpBar } from "../../scenes/How";
import { BEAT, C } from "../../theme";
import { Box, FlyIn, PixelIcon, Rise, Sticker, T } from "../../ui";

/** Tarjeta horizontal: en vertical las tres reglas se apilan y entran alternando desde los lados. */
function Card({ i }: { i: number }) {
  const s = STEPS[i];
  const p = usePop(BEAT * 2 + i * BEAT, { damping: 12, stiffness: 170 });
  const frame = useCurrentFrame();
  const bob = Math.sin((frame + i * 20) / 18) * 5;
  const side = i % 2 === 0 ? -1 : 1;
  return (
    <div style={{ transform: `translate(${(1 - p) * side * 1100}px, ${bob}px) rotate(${(1 - p) * side * 20 + (i - 1) * 1.2}deg)`, opacity: p > 0.02 ? 1 : 0 }}>
      <Box bg={C.blanco} shadow={16} border={6} style={{ position: "relative", width: 880, padding: 30, display: "flex", gap: 28, alignItems: "flex-start" }}>
        <Box bg={s.bg} shadow={6} border={5} style={{ padding: 16, flexShrink: 0 }}>
          <PixelIcon name={s.icon} size={92} />
        </Box>
        <div style={{ flex: 1 }}>
          <div style={{ ...T.display(48), paddingRight: 110 }}>{s.title}</div>
          <div style={{ ...T.body(30), marginTop: 12 }}>{s.body}</div>
        </div>
        <div style={{ position: "absolute", right: 26, top: 18, ...T.pixel(56), letterSpacing: 2, WebkitTextStroke: `3px ${C.tinta}`, color: s.bg, textShadow: `5px 5px 0 ${C.tinta}` }}>{s.n}</div>
      </Box>
    </div>
  );
}

export function How() {
  return (
    <DotBg bg={C.papel} drift={0.5}>
      <Camera duration={180} zoom={[1.03, 1]} shakes={[BEAT * 2 + 6, BEAT * 3 + 6, BEAT * 4 + 6]}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 240 }}>
          <FlyIn from={[0, -200]} style={{ position: "relative" }}>
            <Sticker bg={C.tinta} color={C.lima} size={28} rotate={-2}>
              ■ How to play
            </Sticker>
          </FlyIn>
          <Rise delay={6} style={{ ...T.display(84), marginTop: 34, textAlign: "center" }}>Three steps.</Rise>
          <Rise delay={10} style={{ ...T.display(84), textAlign: "center" }}>Zero doomscrolling.</Rise>
          <div style={{ display: "flex", flexDirection: "column", gap: 44, marginTop: 60 }}>
            {[0, 1, 2].map((i) => (
              <Card key={i} i={i} />
            ))}
          </div>
        </AbsoluteFill>
        <XpBar style={{ left: 90, right: 90, top: 1350, bottom: undefined }} />
        <FlyIn delay={150} from={[-300, 0]} rotate={-30} style={{ left: 90, top: 1430 }}>
          <Sticker bg={C.rosa} size={26} rotate={-4}>
            +1 Badge
          </Sticker>
        </FlyIn>
      </Camera>
    </DotBg>
  );
}

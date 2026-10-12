import type { CSSProperties } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Camera, DotBg, EASE_OUT, Glitch, PixelBurst, usePop } from "../../fx";
import { Letter, PixelIris, PressStart, START } from "../../scenes/Intro";
import { C } from "../../theme";
import { Box, FlyIn, PixelIcon, Sticker, T } from "../../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const TAGLINE = ["The Real World", "Is Your Playground."];

export function Intro() {
  const frame = useCurrentFrame();
  const leaf = usePop(START + 4, { damping: 10, stiffness: 200 });
  const bands = TAGLINE.map((_, i) => interpolate(frame, [66 + i * 6, 84 + i * 6], [0, 1], { ...clamp, easing: EASE_OUT }));
  const under = interpolate(frame, [86, 98], [0, 1], { ...clamp, easing: EASE_OUT });
  const logo: CSSProperties = { ...T.pixel(180, C.tinta), letterSpacing: 12, lineHeight: 1, textShadow: `10px 10px 0 ${C.blanco}`, textAlign: "center" };

  return (
    <AbsoluteFill style={{ background: C.tinta }}>
      <DotBg bg={C.lima} drift={0.8}>
        <Camera duration={180} zoom={[1.08, 1]} shakes={[52, 70]}>
          {/* Stickers de fondo */}
          <FlyIn delay={84} from={[500, -200]} rotate={40} style={{ right: 90, top: 300 }}>
            <Box bg={C.amarillo} style={{ padding: 20, transform: "rotate(6deg)" }}>
              <PixelIcon name="tree" size={110} />
            </Box>
          </FlyIn>
          <FlyIn delay={90} from={[-500, 200]} rotate={-40} style={{ left: 80, top: 1330 }}>
            <Box bg={C.rosa} style={{ padding: 18, transform: "rotate(-7deg)" }}>
              <PixelIcon name="flower" size={92} />
            </Box>
          </FlyIn>
          <FlyIn delay={96} from={[400, 300]} rotate={30} style={{ right: 170, top: 1360 }}>
            <Box bg={C.cian} style={{ padding: 14, transform: "rotate(5deg)" }}>
              <PixelIcon name="eye" size={72} />
            </Box>
          </FlyIn>
          <FlyIn delay={102} from={[-300, -300]} style={{ left: 80, top: 250 }}>
            <Sticker bg={C.tinta} color={C.lima} size={26} rotate={-4}>
              ■ Touch Grass · Week 1
            </Sticker>
          </FlyIn>
          <FlyIn delay={108} from={[-300, -300]} style={{ left: 110, top: 350 }}>
            <Sticker bg={C.rosa} size={24} rotate={3}>
              Hacktoberfest 2026
            </Sticker>
          </FlyIn>
          <FlyIn delay={114} from={[0, 300]} style={{ left: 290, top: 1400 }}>
            <Sticker bg={C.cian} size={24} rotate={-3}>
              Open-weight AI
            </Sticker>
          </FlyIn>

          {/* Logotipo apilado: hoja arriba, ECO / QUEST y el lema en dos franjas */}
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", paddingBottom: 40 }}>
            <div style={{ transform: `scale(${leaf}) rotate(${(1 - leaf) * -120}deg)` }}>
              <PixelIcon name="leaf" size={190} style={{ filter: `drop-shadow(10px 10px 0 ${C.tinta})` }} />
            </div>
            <Glitch at={[54, 126, 150]} style={{ marginTop: 30 }}>
              <div style={logo}>
                {"ECO".split("").map((ch, i) => (
                  <Letter key={i} ch={ch} delay={START + 8 + i * 3} />
                ))}
                <br />
                {"QUEST".split("").map((ch, i) => (
                  <Letter key={i} ch={ch} delay={START + 16 + i * 3} />
                ))}
              </div>
            </Glitch>
            <div style={{ position: "relative", marginTop: 56, transform: "rotate(-2deg)", display: "flex", flexDirection: "column", alignItems: "center" }}>
              {TAGLINE.map((line, i) => (
                <div key={line} style={{ clipPath: `inset(0 ${100 - bands[i] * 100}% 0 0)`, background: C.tinta, padding: "16px 36px", ...T.display(62, C.amarillo) }}>
                  {line}
                </div>
              ))}
              <div style={{ position: "absolute", left: 16, bottom: -16, height: 14, width: `${under * 100}%`, background: C.rosa }} />
            </div>
          </AbsoluteFill>
          <PixelBurst at={54} x={540} y={720} count={40} />
        </Camera>
      </DotBg>
      <PixelIris />
      <PressStart />
    </AbsoluteFill>
  );
}

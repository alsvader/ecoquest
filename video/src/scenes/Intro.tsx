import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { Camera, DotBg, EASE_OUT, Glitch, PixelBurst, usePop } from "../fx";
import { C } from "../theme";
import { Box, FlyIn, PixelIcon, Sticker, T } from "../ui";

export const START = 30; // "PRESS START" → se abre el nivel

export function Letter({ ch, delay }: { ch: string; delay: number }) {
  const p = usePop(delay, { damping: 11, stiffness: 220 });
  return (
    <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * -380}px) rotate(${(1 - p) * -18}deg)`, opacity: p > 0.01 ? 1 : 0 }}>
      {ch}
    </span>
  );
}

/** Retícula negra que se disuelve en píxeles desde el centro (apertura tipo iris). */
export function PixelIris() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const [cols, rows] = width > height ? [24, 14] : [14, 24];
  const cw = width / cols;
  const ch = height / rows;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dx = (c + 0.5 - cols / 2) / (cols / 2);
      const dy = (r + 0.5 - rows / 2) / (rows / 2);
      const d = Math.sqrt(dx * dx + dy * dy);
      const s = 1 - interpolate(frame, [START + d * 12, START + d * 12 + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      if (s <= 0) continue;
      cells.push(<div key={`${r}-${c}`} style={{ position: "absolute", left: c * cw, top: r * ch, width: cw + 1, height: ch + 1, background: C.tinta, transform: `scale(${s})` }} />);
    }
  }
  return <AbsoluteFill>{cells}</AbsoluteFill>;
}

export function PressStart() {
  const frame = useCurrentFrame();
  if (frame > START + 4) return null;
  const blink = Math.floor(frame / 6) % 2 === 0 || frame > START - 6;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 34 }}>
      <div style={{ ...T.pixel(26, C.rosa) }}>Hacktoberfest 2026 · Touch Grass</div>
      <div style={{ ...T.pixel(64, C.lima), opacity: blink ? 1 : 0, transform: frame >= START - 6 ? `scale(${1 + (frame - (START - 6)) * 0.04})` : undefined }}>▶ Press start</div>
    </AbsoluteFill>
  );
}

export function Intro() {
  const frame = useCurrentFrame();
  const leaf = usePop(START + 4, { damping: 10, stiffness: 200 });
  const band = interpolate(frame, [66, 84], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });
  const under = interpolate(frame, [80, 92], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });
  const logo = { ...T.pixel(200, C.tinta), letterSpacing: 14, lineHeight: 1, textShadow: `12px 12px 0 ${C.blanco}` };

  return (
    <AbsoluteFill style={{ background: C.tinta }}>
      <DotBg bg={C.lima} drift={0.8}>
        <Camera duration={180} zoom={[1.08, 1]} shakes={[52, 70]}>
          {/* Stickers de fondo */}
          <FlyIn delay={84} from={[500, -200]} rotate={40} style={{ right: 110, top: 170 }}>
            <Box bg={C.amarillo} style={{ padding: 22, transform: "rotate(6deg)" }}>
              <PixelIcon name="tree" size={120} />
            </Box>
          </FlyIn>
          <FlyIn delay={90} from={[-500, 200]} rotate={-40} style={{ left: 120, bottom: 100 }}>
            <Box bg={C.rosa} style={{ padding: 20, transform: "rotate(-7deg)" }}>
              <PixelIcon name="flower" size={100} />
            </Box>
          </FlyIn>
          <FlyIn delay={96} from={[400, 300]} rotate={30} style={{ right: 150, bottom: 110 }}>
            <Box bg={C.cian} style={{ padding: 16, transform: "rotate(5deg)" }}>
              <PixelIcon name="eye" size={80} />
            </Box>
          </FlyIn>
          <FlyIn delay={102} from={[-300, -300]} style={{ left: 100, top: 80 }}>
            <Sticker bg={C.tinta} color={C.lima} size={26} rotate={-4}>
              ■ Touch Grass · Week 1
            </Sticker>
          </FlyIn>
          <FlyIn delay={108} from={[300, -300]} style={{ right: 330, top: 80 }}>
            <Sticker bg={C.rosa} size={24} rotate={4}>
              Hacktoberfest 2026
            </Sticker>
          </FlyIn>
          <FlyIn delay={114} from={[0, 300]} style={{ right: 330, bottom: 120 }}>
            <Sticker bg={C.cian} size={24} rotate={-3}>
              Open-weight AI
            </Sticker>
          </FlyIn>

          {/* Logotipo */}
          <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 40, marginTop: -60 }}>
              <div style={{ transform: `scale(${leaf}) rotate(${(1 - leaf) * -120}deg)` }}>
                <PixelIcon name="leaf" size={230} style={{ filter: `drop-shadow(12px 12px 0 ${C.tinta})` }} />
              </div>
              <Glitch at={[54, 126, 150]}>
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
            </div>
            <div style={{ position: "relative", marginTop: 56, transform: "rotate(-2deg)" }}>
              <div style={{ clipPath: `inset(0 ${100 - band * 100}% 0 0)`, background: C.tinta, padding: "22px 44px", ...T.display(60, C.amarillo) }}>
                The Real World Is Your Playground.
              </div>
              <div style={{ position: "absolute", left: 16, bottom: -16, height: 14, width: `${under * 100}%`, background: C.rosa }} />
            </div>
          </AbsoluteFill>
          <PixelBurst at={54} x={960} y={420} count={40} />
        </Camera>
      </DotBg>
      <PixelIris />
      <PressStart />
    </AbsoluteFill>
  );
}

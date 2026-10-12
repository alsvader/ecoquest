import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Camera, DotBg, EASE_OUT, Glitch, PixelBurst, usePop } from "../fx";
import { BEAT, C, F } from "../theme";
import { Box, FlyIn, PixelIcon, Rise, Sticker, T } from "../ui";

const CLOSE = 200; // el nivel se cierra en píxeles → «GO OUTSIDE»

/** Retícula negra que se cierra hacia el centro (espejo del iris de la intro). */
function PixelClose() {
  const frame = useCurrentFrame();
  const cols = 24;
  const rows = 14;
  const cw = 1920 / cols;
  const ch = 1080 / rows;
  const cells = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dx = (c + 0.5 - cols / 2) / (cols / 2);
      const dy = (r + 0.5 - rows / 2) / (rows / 2);
      const d = 1.5 - Math.sqrt(dx * dx + dy * dy);
      const s = interpolate(frame, [CLOSE + d * 10, CLOSE + d * 10 + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      if (s <= 0) continue;
      cells.push(<div key={`${r}-${c}`} style={{ position: "absolute", left: c * cw, top: r * ch, width: cw + 1, height: ch + 1, background: C.tinta, transform: `scale(${s})` }} />);
    }
  }
  return <AbsoluteFill>{cells}</AbsoluteFill>;
}

export function Outro() {
  const frame = useCurrentFrame();
  const slam = usePop(BEAT * 2, { damping: 12, stiffness: 240 });
  const repo = usePop(BEAT * 5, { damping: 13, stiffness: 180 });
  const credits = interpolate(frame, [BEAT * 7, BEAT * 7 + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const end = frame >= CLOSE + 22;
  const blink = Math.floor(frame / 6) % 2 === 0;

  return (
    <AbsoluteFill style={{ background: C.tinta }}>
      <DotBg bg={C.lima} drift={0.8}>
        <Camera duration={240} zoom={[1, 1.06]} shakes={[BEAT * 2 + 4]}>
          <AbsoluteFill style={{ padding: "110px 130px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <PixelIcon name="leaf" size={70} style={{ filter: `drop-shadow(5px 5px 0 ${C.tinta})` }} />
              <div style={{ ...T.pixel(40), letterSpacing: 6, lineHeight: 1, textShadow: `4px 4px 0 ${C.blanco}` }}>ECO<br />QUEST</div>
            </div>
            <Rise delay={6} style={{ ...T.display(126), marginTop: 40 }}>Put the phone away.</Rise>
            <div style={{ display: "inline-block", alignSelf: "flex-start", marginTop: 24, transform: `scale(${2.2 - 1.2 * slam}) rotate(${-1.5 * slam}deg)`, transformOrigin: "left center", opacity: slam > 0.02 ? 1 : 0 }}>
              <Box bg={C.blanco} shadow={18} border={7} style={{ padding: "4px 30px 14px", ...T.display(116) }}>
                The park is the level.
              </Box>
            </div>
          </AbsoluteFill>

          <div style={{ position: "absolute", left: 130, bottom: 150, transform: `translateY(${(1 - repo) * 400}px)`, display: "flex", gap: 30, alignItems: "center" }}>
            <Box bg={C.tinta} shadow={10} border={5} style={{ padding: "18px 30px", display: "flex", gap: 18, alignItems: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 42, color: C.lima }}>
              <PixelIcon name="star" size={46} />
              github.com/alsvader/ecoquest
            </Box>
          </div>
          <FlyIn delay={BEAT * 6} from={[400, 0]} rotate={20} style={{ right: 130, bottom: 160 }}>
            <Sticker bg={C.rosa} size={26} rotate={-4}>Hacktoberfest 2026</Sticker>
          </FlyIn>
          <FlyIn delay={BEAT * 6 + 6} from={[400, 0]} rotate={-20} style={{ right: 170, bottom: 250 }}>
            <Sticker bg={C.amarillo} size={26} rotate={3}>Touch Grass · Week 1</Sticker>
          </FlyIn>
          <FlyIn delay={BEAT * 3} from={[300, -300]} rotate={30} style={{ right: 100, top: 70 }}>
            <Box bg={C.amarillo} style={{ padding: 18, transform: "rotate(6deg)" }}>
              <PixelIcon name="tree" size={90} />
            </Box>
          </FlyIn>
          <div style={{ position: "absolute", left: 130, right: 130, bottom: 50, opacity: credits * 0.85, ...T.body(19) }}>
            Test photos via Wikimedia Commons: Mandu joshi (CC0) · ImagePerson (CC BY 4.0) · David E Mead (CC0). MVP in progress: outdoor test in Villahermosa still pending.
          </div>
          <PixelBurst at={BEAT * 2 + 2} x={800} y={560} count={40} spread={800} />
        </Camera>
      </DotBg>
      <PixelClose />
      {end && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 30 }}>
          <Glitch at={[CLOSE + 22]}>
            <div style={{ ...T.pixel(80, C.lima), opacity: blink || frame < CLOSE + 30 ? 1 : 0.2, transform: `scale(${interpolate(frame, [CLOSE + 22, CLOSE + 32], [1.3, 1], { extrapolateRight: "clamp", easing: EASE_OUT })})` }}>▶ Go outside</div>
          </Glitch>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
}

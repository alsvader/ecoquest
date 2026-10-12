import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Camera, DotBg, EASE_OUT, Glitch, PixelBurst, usePop } from "../../fx";
import { CLOSE, PixelClose } from "../../scenes/Outro";
import { BEAT, C, F } from "../../theme";
import { Box, FlyIn, PixelIcon, Rise, Sticker, T } from "../../ui";

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
          <AbsoluteFill style={{ padding: "240px 80px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <PixelIcon name="leaf" size={70} style={{ filter: `drop-shadow(5px 5px 0 ${C.tinta})` }} />
              <div style={{ ...T.pixel(40), letterSpacing: 6, lineHeight: 1, textShadow: `4px 4px 0 ${C.blanco}` }}>ECO<br />QUEST</div>
            </div>
            <Rise delay={6} style={{ ...T.display(124), marginTop: 44 }}>Put the</Rise>
            <Rise delay={10} style={T.display(124)}>phone away.</Rise>
            <div style={{ display: "inline-block", alignSelf: "flex-start", marginTop: 30, transform: `scale(${2.2 - 1.2 * slam}) rotate(${-1.5 * slam}deg)`, transformOrigin: "left center", opacity: slam > 0.02 ? 1 : 0 }}>
              <Box bg={C.blanco} shadow={18} border={7} style={{ padding: "4px 30px 14px", ...T.display(112) }}>
                The park is
                <br />
                the level.
              </Box>
            </div>
          </AbsoluteFill>

          <div style={{ position: "absolute", left: 80, top: 1040, transform: `translateY(${(1 - repo) * 700}px)` }}>
            <Box bg={C.tinta} shadow={10} border={5} style={{ padding: "18px 28px", display: "flex", gap: 18, alignItems: "center", fontFamily: F.mono, fontWeight: 700, fontSize: 40, color: C.lima }}>
              <PixelIcon name="star" size={44} />
              github.com/alsvader/ecoquest
            </Box>
          </div>
          <FlyIn delay={BEAT * 6} from={[-400, 0]} rotate={20} style={{ left: 80, top: 1190 }}>
            <Sticker bg={C.rosa} size={26} rotate={-4}>Hacktoberfest 2026</Sticker>
          </FlyIn>
          <FlyIn delay={BEAT * 6 + 6} from={[400, 0]} rotate={-20} style={{ left: 300, top: 1280 }}>
            <Sticker bg={C.amarillo} size={26} rotate={3}>Touch Grass · Week 1</Sticker>
          </FlyIn>
          <FlyIn delay={BEAT * 3} from={[300, -300]} rotate={30} style={{ right: 90, top: 240 }}>
            <Box bg={C.amarillo} style={{ padding: 18, transform: "rotate(6deg)" }}>
              <PixelIcon name="tree" size={90} />
            </Box>
          </FlyIn>
          <div style={{ position: "absolute", left: 80, width: 840, top: 1385, opacity: credits * 0.85, ...T.body(22) }}>
            Test photos via Wikimedia Commons: Mandu joshi (CC0) · ImagePerson (CC BY 4.0) · David E Mead (CC0). MVP in progress: outdoor test in Villahermosa still pending.
          </div>
          <PixelBurst at={BEAT * 2 + 2} x={480} y={820} count={40} spread={700} />
        </Camera>
      </DotBg>
      <PixelClose />
      {end && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 30 }}>
          <Glitch at={[CLOSE + 22]}>
            <div style={{ ...T.pixel(76, C.lima), opacity: blink || frame < CLOSE + 30 ? 1 : 0.2, transform: `scale(${interpolate(frame, [CLOSE + 22, CLOSE + 32], [1.3, 1], { extrapolateRight: "clamp", easing: EASE_OUT })})` }}>▶ Go outside</div>
          </Glitch>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
}

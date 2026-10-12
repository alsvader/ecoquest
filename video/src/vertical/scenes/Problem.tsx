import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Camera, DotBg, EASE_IN_OUT, EASE_OUT, PixelBurst, Vignette } from "../../fx";
import { Counter, Slam, SLAM_1, SLAM_2, STRIKE, SWAP } from "../../scenes/Problem";
import { C } from "../../theme";
import { Rise, T } from "../../ui";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const LINE = T.display(112, C.blanco);

export function Problem() {
  const frame = useCurrentFrame();
  const strike = interpolate(frame, [STRIKE, STRIKE + 8], [0, 1], { ...clamp, easing: EASE_OUT });
  const out = interpolate(frame, [SWAP, SWAP + 12], [0, 1], { ...clamp, easing: EASE_IN_OUT });

  return (
    <DotBg bg={C.selva} dot="rgba(255,255,255,0.10)" drift={-0.6}>
      <Camera duration={240} zoom={[1, 1.06]} shakes={[SLAM_1 + 3, STRIKE + 2, SLAM_2 + 3]}>
        <AbsoluteFill style={{ padding: "250px 80px 0" }}>
          {frame < SWAP + 14 && (
            <div style={{ transform: `translateY(${-out * 260}px)`, opacity: 1 - out, filter: `blur(${out * 10}px)` }}>
              <Rise delay={4} style={LINE}>Most apps</Rise>
              <Rise delay={10} style={LINE}>want more</Rise>
              <Rise delay={14} style={{ ...LINE, marginBottom: 30 }}>of your</Rise>
              <div style={{ position: "relative", display: "inline-block" }}>
                <Slam at={SLAM_1} bg={C.amarillo} size={100}>SCREEN TIME.</Slam>
                <div style={{ position: "absolute", left: -20, right: -30, top: "48%", height: 26, background: C.naranja, border: `5px solid ${C.tinta}`, transform: `scaleX(${strike}) rotate(-3deg)`, transformOrigin: "left center" }} />
              </div>
            </div>
          )}
          {frame >= SWAP && (
            <div>
              <Rise delay={SWAP + 4} style={LINE}>EcoQuest</Rise>
              <Rise delay={SWAP + 10} style={LINE}>wants you</Rise>
              <Rise delay={SWAP + 14} style={{ ...LINE, marginBottom: 30 }}>to use it</Rise>
              <Slam at={SLAM_2} bg={C.lima} size={100}>LESS.</Slam>
            </div>
          )}
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 250, top: 830, transform: "scale(1.2)", transformOrigin: "left top" }}>
          <Counter style={{ left: 0, top: 0, right: undefined }} />
        </div>
        <PixelBurst at={SLAM_2} x={250} y={720} count={34} />
        <div style={{ position: "absolute", left: 80, width: 820, top: 1360, opacity: interpolate(frame, [190, 206], [0, 1], clamp), transform: `translateY(${interpolate(frame, [190, 206], [30, 0], { ...clamp, easing: EASE_OUT })}px)`, ...T.body(40, C.blanco) }}>
          A 20‑minute expedition. Your phone stays in your pocket.
        </div>
      </Camera>
      <Vignette strength={0.45} />
    </DotBg>
  );
}

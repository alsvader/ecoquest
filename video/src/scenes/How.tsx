import type { CSSProperties } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Camera, DotBg, EASE_OUT, usePop } from "../fx";
import { BEAT, C } from "../theme";
import { Box, FlyIn, PixelIcon, Rise, Sticker, T, type IconName } from "../ui";

export const STEPS: { n: string; bg: string; icon: IconName; title: string; body: string }[] = [
  { n: "01", bg: C.lima, icon: "pin", title: "Pick a mission", body: "Choose the expedition and read the safety notice first." },
  { n: "02", bg: C.cian, icon: "phone", title: "Pocket the phone", body: "Walk and look around. The camera opens only when you find something." },
  { n: "03", bg: C.rosa, icon: "camera", title: "Snap the find", body: "An open-weight AI model checks if your photo fits the mission." },
];

function Card({ i }: { i: number }) {
  const s = STEPS[i];
  const delay = BEAT * 2 + i * BEAT;
  const p = usePop(delay, { damping: 12, stiffness: 170 });
  const frame = useCurrentFrame();
  const bob = Math.sin((frame + i * 20) / 18) * 6;
  return (
    <div style={{ transform: `translateY(${(1 - p) * 700 + bob}px) rotate(${(1 - p) * (i - 1) * 25 + (i - 1) * 1.5}deg)`, opacity: p > 0.02 ? 1 : 0 }}>
      <Box bg={C.blanco} shadow={16} border={6} style={{ width: 480, height: 470, padding: 34, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box bg={s.bg} shadow={6} border={5} style={{ padding: 18 }}>
            <PixelIcon name={s.icon} size={96} />
          </Box>
          <div style={{ ...T.pixel(70), letterSpacing: 2, WebkitTextStroke: `3px ${C.tinta}`, color: s.bg, textShadow: `5px 5px 0 ${C.tinta}` }}>{s.n}</div>
        </div>
        <div style={T.display(54)}>{s.title}</div>
        <div style={T.body(30)}>{s.body}</div>
      </Box>
    </div>
  );
}

export function XpBar({ style }: { style?: CSSProperties }) {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [100, 150], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_OUT });
  const enter = usePop(90);
  const segs = 24;
  return (
    <div style={{ position: "absolute", left: 220, right: 220, bottom: 90, ...style, transform: `scaleX(${enter})`, transformOrigin: "left" }}>
      <Box bg={C.blanco} shadow={8} border={5} style={{ height: 56, display: "flex", alignItems: "center", gap: 6, padding: "0 8px" }}>
        {Array.from({ length: segs }, (_, k) => (
          <div key={k} style={{ flex: 1, height: 34, background: k / segs < fill ? C.amarillo : "transparent", border: k / segs < fill ? `3px solid ${C.tinta}` : "3px solid transparent" }} />
        ))}
        <div style={{ ...T.pixel(26), marginLeft: 16, marginRight: 10 }}>EXP</div>
      </Box>
    </div>
  );
}

export function How() {
  return (
    <DotBg bg={C.papel} drift={0.5}>
      <Camera duration={180} zoom={[1.03, 1]} shakes={[BEAT * 2 + 6, BEAT * 3 + 6, BEAT * 4 + 6]}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 80 }}>
          <FlyIn from={[0, -200]} style={{ position: "relative" }}>
            <Sticker bg={C.tinta} color={C.lima} size={28} rotate={-2}>
              ■ How to play
            </Sticker>
          </FlyIn>
          <Rise delay={6} style={{ ...T.display(84), marginTop: 30 }}>
            Three steps. Zero doomscrolling.
          </Rise>
          <div style={{ display: "flex", gap: 70, marginTop: 64 }}>
            {[0, 1, 2].map((i) => (
              <Card key={i} i={i} />
            ))}
          </div>
        </AbsoluteFill>
        <XpBar />
        <FlyIn delay={150} from={[300, 0]} rotate={30} style={{ right: 110, bottom: 140 }}>
          <Sticker bg={C.rosa} size={26} rotate={6}>
            +1 Badge
          </Sticker>
        </FlyIn>
      </Camera>
    </DotBg>
  );
}

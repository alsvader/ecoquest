import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camera, DotBg, usePop } from "../fx";
import { BEAT, C } from "../theme";
import { Box, FlyIn, PixelIcon, Rise, Sticker, T, type IconName } from "../ui";

const MISSIONS: { icon: IconName; bg: string; title: string }[] = [
  { icon: "leaf", bg: C.lima, title: "Find a large leaf" },
  { icon: "flower", bg: C.rosa, title: "Discover a flower and its colors" },
  { icon: "tree", bg: C.cian, title: "Find a tree with visible roots" },
];

function MissionCard({ i }: { i: number }) {
  const m = MISSIONS[i];
  const frame = useCurrentFrame();
  const p = usePop(BEAT * 3 + i * BEAT, { damping: 13, stiffness: 150 });
  const bob = Math.sin((frame + i * 25) / 16) * 5;
  return (
    <div style={{ perspective: 1400 }}>
      <div style={{ transform: `rotateY(${(1 - p) * 95}deg) translateY(${bob}px) rotate(${(i - 1) * -1.2}deg)`, transformOrigin: "left center", opacity: p > 0.03 ? 1 : 0 }}>
        <Box bg={C.blanco} shadow={14} border={6} style={{ width: 520, padding: 28, display: "flex", gap: 24, alignItems: "flex-start" }}>
          <Box bg={m.bg} shadow={0} border={5} style={{ padding: 14, flexShrink: 0 }}>
            <PixelIcon name={m.icon} size={88} />
          </Box>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={T.pixel(20)}>Mission {i + 1}/3</div>
            <div style={{ ...T.display(38), lineHeight: 1.05 }}>{m.title}</div>
            <div style={{ alignSelf: "flex-start", border: `3px solid ${C.tinta}`, padding: "4px 10px", ...T.body(20, C.tinta, 700) }}>PENDING</div>
          </div>
        </Box>
      </div>
    </div>
  );
}

export function Missions() {
  const pin = usePop(10, { damping: 9, stiffness: 200 });
  return (
    <DotBg bg={C.amarillo} drift={-0.5}>
      <Camera duration={180} zoom={[1, 1.05]} shakes={[BEAT * 3 + 5, BEAT * 4 + 5, BEAT * 5 + 5]}>
        <AbsoluteFill style={{ padding: "110px 130px" }}>
          <FlyIn from={[-300, 0]} style={{ position: "relative" }}>
            <Sticker bg={C.tinta} color={C.amarillo} size={26} rotate={-2}>■ Pilot expedition</Sticker>
          </FlyIn>
          <div style={{ display: "flex", alignItems: "center", gap: 36, marginTop: 34 }}>
            <Rise delay={6} style={T.display(150)}>Descubre el Edén</Rise>
            <div style={{ transform: `translateY(${(1 - pin) * -300}px)`, opacity: pin > 0.02 ? 1 : 0 }}>
              <Box bg={C.rosa} shadow={10} style={{ padding: 16, transform: "rotate(8deg)" }}>
                <PixelIcon name="pin" size={92} />
              </Box>
            </div>
          </div>
          <Rise delay={16} style={{ ...T.body(40, C.tinta, 700), marginTop: 18 }}>
            Parque Tomás Garrido Canabal · Villahermosa, Tabasco, Mexico
          </Rise>
          <Rise delay={22} style={{ ...T.pixel(30), marginTop: 18 }}>~20 min · 3 missions · 1 badge</Rise>
          <div style={{ display: "flex", gap: 46, marginTop: 90 }}>
            {[0, 1, 2].map((i) => (
              <MissionCard key={i} i={i} />
            ))}
          </div>
        </AbsoluteFill>
      </Camera>
    </DotBg>
  );
}

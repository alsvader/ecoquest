import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camera, DotBg, Glitch, usePop } from "../fx";
import { BEAT, C, F } from "../theme";
import { Box, PixelIcon, Rise, Sticker, T, type IconName } from "../ui";

const ITEMS: { icon: IconName; bg: string; text: string; rot: number }[] = [
  { icon: "lock", bg: C.rosa, text: "No accounts", rot: -2 },
  { icon: "pin", bg: C.cian, text: "No precise location", rot: 1.5 },
  { icon: "phone", bg: C.lima, text: "Progress stays on your phone", rot: -1 },
  { icon: "eye", bg: C.amarillo, text: "Server never stores photos", rot: 2 },
  { icon: "hand", bg: C.naranja, text: "Manual marks say «Unverified»", rot: -1.5 },
  { icon: "star", bg: C.blanco, text: "Apache‑2.0 model · MIT code", rot: 1 },
];
const FIRST = 24;

function Item({ i }: { i: number }) {
  const it = ITEMS[i];
  const p = usePop(FIRST + i * BEAT, { damping: 12, stiffness: 260 });
  return (
    <div style={{ transform: `scale(${2 - p}) rotate(${it.rot}deg)`, opacity: p > 0.05 ? Math.min(1, p * 2) : 0 }}>
      <Box bg={it.bg} shadow={12} border={6} style={{ padding: "16px 26px", display: "flex", alignItems: "center", gap: 22 }}>
        <PixelIcon name={it.icon} size={52} />
        <span style={T.display(40)}>{it.text}</span>
      </Box>
    </div>
  );
}

export function Principles() {
  const frame = useCurrentFrame();
  const term = usePop(FIRST + ITEMS.length * BEAT, { damping: 13, stiffness: 200 });
  const cmd = "$ docker compose up --build -d";
  const typed = cmd.slice(0, Math.max(0, Math.floor((frame - (FIRST + ITEMS.length * BEAT + 4)) * 2)));
  return (
    <DotBg bg={C.papel} drift={-0.6}>
      <Camera duration={180} zoom={[1, 1.05]} shakes={ITEMS.map((_, i) => FIRST + i * BEAT + 4)}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 80 }}>
          <Sticker bg={C.tinta} color={C.lima} size={26} rotate={-2}>■ Principles</Sticker>
          <div style={{ display: "flex", gap: 30, marginTop: 30 }}>
            <Rise delay={4} style={T.display(100)}>Built honest.</Rise>
            <Glitch at={[40, 100]}>
              <Rise delay={10} style={{ ...T.display(100), background: C.lima, padding: "0 18px", border: `6px solid ${C.tinta}` }}>Built open.</Rise>
            </Glitch>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "30px 40px", width: 1720, marginTop: 56 }}>
            {ITEMS.map((_, i) => (
              <Item key={i} i={i} />
            ))}
          </div>
          <div style={{ marginTop: 50, transform: `translateY(${(1 - term) * 300}px)`, opacity: term > 0.02 ? 1 : 0 }}>
            <Box bg={C.tinta} shadow={12} border={6} style={{ padding: "22px 40px", minWidth: 900, fontFamily: F.mono, fontWeight: 700, fontSize: 40, color: C.lima, outline: `4px solid ${C.lima}`, outlineOffset: -14 }}>
              {typed}
              {Math.floor(frame / 8) % 2 === 0 ? "▌" : " "}
            </Box>
          </div>
        </AbsoluteFill>
      </Camera>
    </DotBg>
  );
}

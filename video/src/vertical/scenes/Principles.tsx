import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camera, DotBg, Glitch, usePop } from "../../fx";
import { FIRST, Item, ITEMS } from "../../scenes/Principles";
import { BEAT, C, F } from "../../theme";
import { Box, Rise, Sticker, T } from "../../ui";

export function Principles() {
  const frame = useCurrentFrame();
  const term = usePop(FIRST + ITEMS.length * BEAT, { damping: 13, stiffness: 200 });
  const cmd = "$ docker compose up --build -d";
  const typed = cmd.slice(0, Math.max(0, Math.floor((frame - (FIRST + ITEMS.length * BEAT + 4)) * 2)));
  return (
    <DotBg bg={C.papel} drift={-0.6}>
      <Camera duration={180} zoom={[1, 1.05]} shakes={ITEMS.map((_, i) => FIRST + i * BEAT + 4)}>
        <AbsoluteFill style={{ alignItems: "center", paddingTop: 240 }}>
          <Sticker bg={C.tinta} color={C.lima} size={26} rotate={-2}>■ Principles</Sticker>
          <Rise delay={4} style={{ ...T.display(100), marginTop: 30 }}>Built honest.</Rise>
          <Glitch at={[40, 100]} style={{ marginTop: 14 }}>
            <Rise delay={10} style={{ ...T.display(100), background: C.lima, padding: "0 18px", border: `6px solid ${C.tinta}` }}>Built open.</Rise>
          </Glitch>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, marginTop: 50 }}>
            {ITEMS.map((_, i) => (
              <Item key={i} i={i} size={34} />
            ))}
          </div>
          <div style={{ marginTop: 44, transform: `translateY(${(1 - term) * 300}px)`, opacity: term > 0.02 ? 1 : 0 }}>
            <Box bg={C.tinta} shadow={12} border={6} style={{ padding: "20px 34px", minWidth: 800, fontFamily: F.mono, fontWeight: 700, fontSize: 36, color: C.lima, outline: `4px solid ${C.lima}`, outlineOffset: -14 }}>
              {typed}
              {Math.floor(frame / 8) % 2 === 0 ? "▌" : " "}
            </Box>
          </div>
        </AbsoluteFill>
      </Camera>
    </DotBg>
  );
}

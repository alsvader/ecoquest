import { AbsoluteFill } from "remotion";
import { Camera, DotBg, usePop } from "../../fx";
import { MissionCard } from "../../scenes/Missions";
import { BEAT, C } from "../../theme";
import { Box, FlyIn, PixelIcon, Rise, Sticker, T } from "../../ui";

export function Missions() {
  const pin = usePop(10, { damping: 9, stiffness: 200 });
  return (
    <DotBg bg={C.amarillo} drift={-0.5}>
      <Camera duration={180} zoom={[1, 1.05]} shakes={[BEAT * 3 + 5, BEAT * 4 + 5, BEAT * 5 + 5]}>
        <AbsoluteFill style={{ padding: "240px 90px 0" }}>
          <FlyIn from={[-300, 0]} style={{ position: "relative" }}>
            <Sticker bg={C.tinta} color={C.amarillo} size={26} rotate={-2}>■ Pilot expedition</Sticker>
          </FlyIn>
          <Rise delay={6} style={{ ...T.display(140), marginTop: 34 }}>Descubre</Rise>
          <div style={{ display: "flex", alignItems: "center", gap: 36 }}>
            <Rise delay={10} style={T.display(140)}>el Edén</Rise>
            <div style={{ transform: `translateY(${(1 - pin) * -300}px)`, opacity: pin > 0.02 ? 1 : 0 }}>
              <Box bg={C.rosa} shadow={10} style={{ padding: 14, transform: "rotate(8deg)" }}>
                <PixelIcon name="pin" size={84} />
              </Box>
            </div>
          </div>
          <Rise delay={16} style={{ ...T.body(36, C.tinta, 700), marginTop: 22, width: 880 }}>
            Parque Tomás Garrido Canabal · Villahermosa, Tabasco, Mexico
          </Rise>
          <Rise delay={22} style={{ ...T.pixel(28), marginTop: 18 }}>~20 min · 3 missions · 1 badge</Rise>
          <div style={{ display: "flex", flexDirection: "column", gap: 34, marginTop: 56 }}>
            {[0, 1, 2].map((i) => (
              <MissionCard key={i} i={i} width={880} />
            ))}
          </div>
        </AbsoluteFill>
      </Camera>
    </DotBg>
  );
}

import { interpolate, useCurrentFrame } from "remotion";
import { Camera, DotBg, EASE_IN_OUT, PixelBurst, usePop, Vignette } from "../../fx";
import { CAPTIONS, clamp, P, PromptPanel, Push, Viewfinder } from "../../scenes/Flow";
import { C } from "../../theme";
import { Box, FlyIn, Phone, PixelIcon, Rise, Screen, Sticker, T } from "../../ui";

const PW = 380; // ancho de pantalla del teléfono
const PHONE_W = PW * 1.08; // con bisel
const CENTER_X = (1080 - PHONE_W) / 2;
// Posición del teléfono principal: centrado, a la izquierda durante el análisis y achicado en el trío final.
const BASE = { x: CENTER_X, top: 600, scale: 0.95 };
const SCAN = { x: 40, scale: 0.8 };
const TRIO = { top: 400, scale: 0.68, gap: 330 };

/** Texto de cada paso arriba del teléfono. */
function Caption() {
  const frame = useCurrentFrame();
  const c = CAPTIONS.find((k) => frame >= k.at - 2 && frame < k.until);
  if (!c) return null;
  const out = interpolate(frame, [c.until - 6, c.until], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 80, top: 230, width: 920, opacity: 1 - out, transform: `translateY(${-out * 40}px)` }}>
      <FlyIn key={c.step} delay={c.at} from={[200, 0]} float={0} style={{ position: "relative" }}>
        <Sticker bg={c.bg} size={24} rotate={-2}>{c.step}</Sticker>
      </FlyIn>
      <Rise key={`t${c.step}`} delay={c.at + 3} style={{ ...T.display(88), marginTop: 26 }}>{c.title}</Rise>
      <Rise key={`b${c.step}`} delay={c.at + 8} dur={16} style={{ ...T.body(34), marginTop: 18 }}>{c.body}</Rise>
    </div>
  );
}

function SidePhone({ src, side, label }: { src: string; side: -1 | 1; label: string }) {
  const p = usePop(P.trio + 6 + (side === 1 ? 6 : 0), { damping: 14, stiffness: 140 });
  const tag = usePop(P.trio + 24 + (side === 1 ? 6 : 0), { damping: 10, stiffness: 220 });
  return (
    <div style={{ position: "absolute", left: 540 + side * TRIO.gap - PHONE_W / 2, top: TRIO.top, transform: `translateY(${(1 - p) * 1500}px) scale(${TRIO.scale}) rotate(${side * 3}deg)`, transformOrigin: "center top" }}>
      <Phone width={PW} shadow={side === -1 ? C.amarillo : C.rosa}>
        <Screen src={src} />
      </Phone>
      <div style={{ position: "absolute", top: -60, left: "50%", transform: `translateX(-50%) scale(${tag * 1.5}) rotate(${side * 4}deg)` }}>
        <Sticker bg={C.lima} size={30} rotate={0}>✓ {label}</Sticker>
      </div>
    </div>
  );
}

export function Flow() {
  const frame = useCurrentFrame();
  const enter = usePop(0, { damping: 15, stiffness: 120 });
  const scan = interpolate(frame, [P.camera, P.camera + 14, P.result, P.result + 14], [0, 1, 1, 0], { ...clamp, easing: EASE_IN_OUT });
  const trio = interpolate(frame, [P.trio, P.trio + 18], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const tag = usePop(P.result + 8, { damping: 9, stiffness: 240 });
  const midTag = usePop(P.trio + 30, { damping: 10, stiffness: 220 });
  const mainX = BASE.x + (SCAN.x - BASE.x) * scan;
  const mainScale = interpolate(trio, [0, 1], [BASE.scale + (SCAN.scale - BASE.scale) * scan, TRIO.scale]);
  const mainTop = interpolate(trio, [0, 1], [BASE.top, TRIO.top]);
  const panel = interpolate(frame, [P.result, P.result + 10], [0, 1], clamp);

  return (
    <DotBg bg={C.lima} drift={0.7}>
      <Camera duration={360} zoom={[1, 1.04]} shakes={[P.shutter + 1, P.result + 10]}>
        <Caption />
        {frame >= P.scan && frame < P.result + 10 && (
          <div style={{ position: "absolute", left: 430, top: 620, width: 520, opacity: 1 - panel, transform: `translateX(${panel * 200}px)` }}>
            <PromptPanel />
          </div>
        )}
        {frame >= P.trio && (
          <>
            <SidePhone src="shots/app-05-resultado-leaf.png" side={-1} label="Leaf" />
            <SidePhone src="shots/app-05-resultado-roots.png" side={1} label="Roots" />
          </>
        )}
        <div style={{ position: "absolute", left: mainX, top: mainTop, transform: `translateY(${(1 - enter) * 1500}px) scale(${mainScale}) rotate(${(1 - trio) * -2}deg)`, transformOrigin: "center top" }}>
          <Phone width={PW} shadow={C.tinta}>
            <Screen src="shots/app-01-bienvenida.png" />
            <Push at={P.session}>
              <Screen src="shots/app-02-sesion.png" />
            </Push>
            <Push at={P.mission}>
              <Screen src="shots/app-03-mision-flower.png" />
            </Push>
            <Push at={P.camera}>
              <Viewfinder />
            </Push>
            <Push at={P.result}>
              <Screen src="shots/app-05-resultado-flower.png" />
            </Push>
          </Phone>
          {frame >= P.result && frame < P.trio + 4 && (
            <div style={{ position: "absolute", left: -150, top: 600, transform: `scale(${tag}) rotate(${-8 + 4 * tag}deg)` }}>
              <Box bg={C.amarillo} shadow={12} border={6} style={{ padding: "18px 26px", display: "flex", alignItems: "center", gap: 16, ...T.pixel(40) }}>
                <PixelIcon name="check" size={56} />
                Match!
              </Box>
            </div>
          )}
          {frame >= P.trio && (
            <div style={{ position: "absolute", top: -60, left: "50%", transform: `translateX(-50%) scale(${midTag * 1.5})` }}>
              <Sticker bg={C.lima} size={30} rotate={0}>✓ Flower</Sticker>
            </div>
          )}
        </div>
        <PixelBurst at={P.result + 6} x={540} y={900} count={44} spread={620} />
        <PixelBurst at={P.trio + 30} x={540} y={700} count={50} spread={700} />
        {frame >= P.trio + 30 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 1080, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, opacity: interpolate(frame, [P.trio + 30, P.trio + 42], [0, 1], clamp) }}>
            <Sticker bg={C.tinta} color={C.lima} size={28} rotate={-2}>Real screenshots</Sticker>
            <Sticker bg={C.tinta} color={C.lima} size={28} rotate={1}>Real model output · 3 of 3</Sticker>
          </div>
        )}
      </Camera>
      <Vignette strength={0.25} />
    </DotBg>
  );
}

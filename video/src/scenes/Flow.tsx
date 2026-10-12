import type { ReactNode } from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import results from "../../public/shots/classify-results.json";
import { Camera, DotBg, EASE_IN_OUT, EASE_OUT, Flash, PixelBurst, usePop, Vignette } from "../fx";
import { C } from "../theme";
import { Box, FlyIn, Phone, PixelIcon, Rise, Screen, Sticker, T } from "../ui";

// Fases (cuadros locales a la escena, alineadas a tiempos de 15 cuadros)
const P = { welcome: 0, session: 60, mission: 120, camera: 165, shutter: 180, scan: 188, result: 255, trio: 300 } as const;
const PW = 380; // ancho de pantalla del teléfono

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Pantalla que entra empujando desde la derecha. */
function Push({ at, children }: { at: number; children: ReactNode }) {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const x = interpolate(frame, [at, at + 12], [100, 0], { ...clamp, easing: EASE_OUT });
  return <AbsoluteFill style={{ transform: `translateX(${x}%)`, boxShadow: x > 0 ? "-12px 0 0 rgba(0,0,0,0.85)" : undefined }}>{children}</AbsoluteFill>;
}

/** Visor de cámara + análisis: foto real, obturador y barrido de "IA". */
function Viewfinder() {
  const frame = useCurrentFrame();
  const scan = interpolate(frame, [P.scan, P.scan + 34, P.scan + 35, P.scan + 62], [0, 1, 0, 1], clamp);
  const pix = frame >= P.scan && frame < P.result ? 1 : 0;
  const zoom = interpolate(frame, [P.camera, P.shutter], [1.25, 1.08], { ...clamp, easing: EASE_OUT });
  const corner = (s: React.CSSProperties) => <div style={{ position: "absolute", width: 46, height: 46, borderColor: C.blanco, borderStyle: "solid", borderWidth: 0, ...s }} />;
  return (
    <AbsoluteFill style={{ background: C.tinta }}>
      <Img src={staticFile("photos/flower.jpg")} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }} />
      {pix > 0 && (
        <AbsoluteFill style={{ backgroundImage: `linear-gradient(${C.cian}22 2px, transparent 2px), linear-gradient(90deg, ${C.cian}22 2px, transparent 2px)`, backgroundSize: "19px 19px" }} />
      )}
      {pix > 0 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: `${scan * 100}%`, height: 6, background: C.cian, boxShadow: `0 0 30px 12px ${C.cian}99` }} />
      )}
      {corner({ left: 24, top: 70, borderLeftWidth: 7, borderTopWidth: 7 })}
      {corner({ right: 24, top: 70, borderRightWidth: 7, borderTopWidth: 7 })}
      {corner({ left: 24, bottom: 150, borderLeftWidth: 7, borderBottomWidth: 7 })}
      {corner({ right: 24, bottom: 150, borderRightWidth: 7, borderBottomWidth: 7 })}
      <div style={{ position: "absolute", top: 18, left: 18, right: 18, display: "flex", justifyContent: "space-between", ...T.pixel(15, C.blanco) }}>
        <span>Misión 2/3</span>
        <span style={{ background: C.cian, color: C.tinta, padding: "2px 8px", border: `3px solid ${C.tinta}` }}>IA</span>
      </div>
      {frame < P.shutter + 4 ? (
        <div style={{ position: "absolute", bottom: 34, left: "50%", marginLeft: -40, width: 80, height: 80, borderRadius: 40, background: C.blanco, border: `8px solid ${C.tinta}`, outline: `5px solid ${C.blanco}`, transform: `scale(${frame >= P.shutter - 3 && frame < P.shutter + 3 ? 0.85 : 1})` }} />
      ) : (
        <div style={{ position: "absolute", bottom: 30, left: 18, right: 18 }}>
          <Box bg={C.cian} shadow={6} border={4} style={{ padding: "12px 14px", ...T.body(17, C.tinta, 700) }}>
            Analizando con IA abierta…
            <div style={{ ...T.body(14, C.tinta, 500) }}>SigLIP2 compara tu foto con la misión.</div>
          </Box>
        </div>
      )}
      <Flash at={P.shutter} duration={8} />
    </AbsoluteFill>
  );
}

const SCORES = results.flower.scores;
const PROMPTS: { cat: keyof typeof SCORES; text: string; win?: boolean }[] = [
  { cat: "flower", text: "a close-up photo of a blooming flower with petals", win: true },
  { cat: "leaf", text: "a photo of a large green leaf" },
  { cat: "roots", text: "a photo of a tree trunk with exposed roots" },
  { cat: "distractor", text: "a photo of a person · the sky · a palm trunk…" },
];

function PromptPanel() {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 34 }}>
      {PROMPTS.map((p, i) => {
        const at = P.scan + 6 + i * 6;
        const e = interpolate(frame, [at, at + 10], [0, 1], { ...clamp, easing: EASE_OUT });
        const bar = interpolate(frame, [P.scan + 40, P.scan + 62], [0, SCORES[p.cat]], { ...clamp, easing: EASE_OUT });
        const lit = p.win && frame >= P.scan + 62;
        return (
          <div key={p.cat} style={{ opacity: e, transform: `translateX(${(1 - e) * 120}px)` }}>
            <Box bg={lit ? C.lima : C.blanco} shadow={lit ? 10 : 6} border={4} style={{ padding: "12px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 20 }}>
                <span style={{ ...T.body(24, C.tinta, 500), fontStyle: "italic" }}>“{p.text}”</span>
                <span style={T.pixel(16)}>{p.cat}</span>
              </div>
              <div style={{ height: 16, border: `3px solid ${C.tinta}`, background: C.papel }}>
                <div style={{ height: "100%", width: `${bar * 100}%`, background: p.win ? C.tinta : "#888" }} />
              </div>
            </Box>
          </div>
        );
      })}
    </div>
  );
}

const CAPTIONS: { at: number; until: number; step: string; title: string; body: string; bg: string }[] = [
  { at: P.welcome + 8, until: P.session, step: "Step 1", title: "Safety first.", body: "Don’t touch wildlife or pull plants. Stay on the trails. Then: ¡Comenzar!", bg: C.naranja },
  { at: P.session, until: P.mission, step: "Step 2", title: "Phone away.", body: "Three missions, one list. Take the phone out only when you find something.", bg: C.cian },
  { at: P.mission, until: P.camera, step: "Step 3", title: "Found a flower?", body: "Each mission gives one clear instruction. Look first, then shoot.", bg: C.rosa },
  { at: P.camera, until: P.result, step: "Step 4", title: "Snap. Classify.", body: "Zero‑shot: SigLIP2 compares your photo with text prompts.", bg: C.cian },
  { at: P.result, until: P.trio, step: "Match", title: "Mission complete!", body: "A visual estimate, not a verification. No percentages: just a bar and the mission’s threshold.", bg: C.lima },
];

function Caption() {
  const frame = useCurrentFrame();
  const c = CAPTIONS.find((k) => frame >= k.at - 2 && frame < k.until);
  if (!c) return null;
  const out = interpolate(frame, [c.until - 6, c.until], [0, 1], clamp);
  return (
    <div style={{ position: "absolute", left: 870, top: c.step === "Step 4" ? 120 : 250, width: 900, opacity: 1 - out, transform: `translateY(${-out * 40}px)` }}>
      <FlyIn key={c.step} delay={c.at} from={[200, 0]} float={0} style={{ position: "relative" }}>
        <Sticker bg={c.bg} size={24} rotate={-2}>{c.step}</Sticker>
      </FlyIn>
      <Rise key={`t${c.step}`} delay={c.at + 3} style={{ ...T.display(c.step === "Step 4" ? 96 : 120), marginTop: 30 }}>{c.title}</Rise>
      <Rise key={`b${c.step}`} delay={c.at + 8} dur={16} style={{ ...T.body(38), marginTop: 22, width: 820 }}>{c.body}</Rise>
      {c.step === "Step 4" && <PromptPanel />}
    </div>
  );
}

function SidePhone({ src, side, label }: { src: string; side: -1 | 1; label: string }) {
  const p = usePop(P.trio + 6 + (side === 1 ? 6 : 0), { damping: 14, stiffness: 140 });
  const tag = usePop(P.trio + 24 + (side === 1 ? 6 : 0), { damping: 10, stiffness: 220 });
  return (
    <div style={{ position: "absolute", left: 960 + side * 520 - (PW * 1.08) / 2, top: 130, transform: `translateY(${(1 - p) * 1100}px) scale(0.79) rotate(${side * 3}deg)`, transformOrigin: "center top" }}>
      <Phone width={PW} shadow={side === -1 ? C.amarillo : C.rosa}>
        <Screen src={src} />
      </Phone>
      <div style={{ position: "absolute", top: -40, left: "50%", transform: `translateX(-50%) scale(${tag * 1.25}) rotate(${side * 4}deg)` }}>
        <Sticker bg={C.lima} size={30} rotate={0}>✓ {label}</Sticker>
      </div>
    </div>
  );
}

export function Flow() {
  const frame = useCurrentFrame();
  const enter = usePop(0, { damping: 15, stiffness: 120 });
  const trio = interpolate(frame, [P.trio, P.trio + 18], [0, 1], { ...clamp, easing: EASE_IN_OUT });
  const tag = usePop(P.result + 8, { damping: 9, stiffness: 240 });
  const midTag = usePop(P.trio + 30, { damping: 10, stiffness: 220 });
  const baseX = 300;
  const mainX = interpolate(trio, [0, 1], [baseX, 960 - (PW * 1.08) / 2]);
  const mainScale = interpolate(trio, [0, 1], [1, 0.79]);

  return (
    <DotBg bg={C.lima} drift={0.7}>
      <Camera duration={360} zoom={[1, 1.04]} shakes={[P.shutter + 1, P.result + 10]}>
        <Caption />
        {frame >= P.trio && (
          <>
            <SidePhone src="shots/app-05-resultado-leaf.png" side={-1} label="Leaf" />
            <SidePhone src="shots/app-05-resultado-roots.png" side={1} label="Roots" />
          </>
        )}
        <div style={{ position: "absolute", left: mainX, top: interpolate(trio, [0, 1], [70, 130]), transform: `translateY(${(1 - enter) * 1100}px) scale(${mainScale}) rotate(${(1 - trio) * -2}deg)`, transformOrigin: "center top" }}>
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
            <div style={{ position: "absolute", left: -150, top: 560, transform: `scale(${tag}) rotate(${-8 + 4 * tag}deg)` }}>
              <Box bg={C.amarillo} shadow={12} border={6} style={{ padding: "18px 26px", display: "flex", alignItems: "center", gap: 16, ...T.pixel(40) }}>
                <PixelIcon name="check" size={56} />
                Match!
              </Box>
            </div>
          )}
          {frame >= P.trio && (
            <div style={{ position: "absolute", top: -40, left: "50%", transform: `translateX(-50%) scale(${midTag * 1.58})` }}>
              <Sticker bg={C.lima} size={30} rotate={0}>✓ Flower</Sticker>
            </div>
          )}
        </div>
        <PixelBurst at={P.result + 6} x={500} y={330} count={44} spread={620} />
        <PixelBurst at={P.trio + 30} x={960} y={500} count={50} spread={900} />
        {frame >= P.trio + 30 && (
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", opacity: interpolate(frame, [P.trio + 30, P.trio + 42], [0, 1], clamp) }}>
            <Sticker bg={C.tinta} color={C.lima} size={26} rotate={0}>Real screenshots · real model output · 3 of 3</Sticker>
          </div>
        )}
      </Camera>
      <Vignette strength={0.25} />
    </DotBg>
  );
}

import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Camera, DotBg, EASE_IN_OUT, EASE_OUT, usePop, Vignette } from "../../fx";
import { SCROLL_FROM, SCROLL_TO } from "../../scenes/Landing";
import { BEAT, C } from "../../theme";
import { Browser, FlyIn, Rise, Sticker, T } from "../../ui";

// Ventana más alta que ancha: la landing (1440 × 13555 a 1x) se ve completa a lo ancho y recorre lo mismo que en horizontal.
const W = 880;
const H = 760;
const FULL_SCALE = W / 1440;
const SCROLL_MAX = 5370 * FULL_SCALE;

function scrollAt(f: number) {
  return interpolate(f, [SCROLL_FROM, SCROLL_TO], [0, SCROLL_MAX], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN_OUT });
}

function Page() {
  const frame = useCurrentFrame();
  const y = scrollAt(frame);
  const blur = Math.min(14, Math.abs(scrollAt(frame + 1) - y) * 0.2);
  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="vblur-v" x="0" y="-5%" width="100%" height="110%">
          <feGaussianBlur stdDeviation={`0 ${blur}`} />
        </filter>
      </svg>
      <Img src={staticFile("shots/landing-full.png")} style={{ position: "absolute", left: 0, top: 0, width: W, height: 13555 * FULL_SCALE, transform: `translateY(${-y}px)`, filter: blur > 0.5 ? "url(#vblur-v)" : undefined }} />
    </>
  );
}

export function Landing() {
  const frame = useCurrentFrame();
  const enter = usePop(4, { damping: 16, stiffness: 120 });
  const ry = interpolate(frame, [0, 240], [-14, -5], { easing: EASE_OUT });
  const rx = interpolate(frame, [0, 240], [8, 3]);
  const glare = interpolate(frame, [30, 70], [-60, 160], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IN_OUT });

  return (
    <DotBg bg={C.selva} dot="rgba(255,255,255,0.10)" drift={0.5}>
      <Camera duration={240} zoom={[1, 1.05]}>
        <AbsoluteFill style={{ padding: "230px 90px 0" }}>
          <FlyIn from={[-300, 0]} style={{ position: "relative" }}>
            <Sticker bg={C.lima} size={24} rotate={-3}>■ The site</Sticker>
          </FlyIn>
          <div style={{ display: "flex", gap: 26, marginTop: 30 }}>
            <Rise delay={8} style={T.display(104, C.blanco)}>Meet</Rise>
            <Rise delay={16} style={T.display(104, C.lima)}>EcoQuest.</Rise>
          </div>
          <Rise delay={30} dur={18} style={{ ...T.body(34, C.blanco), marginTop: 22, width: 860 }}>
            A mobile‑first web app for real‑world expeditions. Open source, no account needed.
          </Rise>
        </AbsoluteFill>

        <AbsoluteFill style={{ perspective: 2400 }}>
          <div style={{ position: "absolute", left: 100, top: 640, transform: `translateY(${(1 - enter) * 1400}px) rotateY(${ry}deg) rotateX(${rx}deg)`, transformOrigin: "center center", transformStyle: "preserve-3d" }}>
            <Browser width={W} height={H} url="ecoquest · localhost:3000">
              <Page />
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(105deg, transparent ${glare - 18}%, rgba(255,255,255,0.55) ${glare}%, transparent ${glare + 18}%)`, pointerEvents: "none" }} />
            </Browser>
          </div>
        </AbsoluteFill>

        <FlyIn delay={BEAT * 3} from={[0, -260]} rotate={-20} style={{ right: 70, top: 590 }}>
          <Sticker bg={C.cian} size={24} rotate={3}>Next.js · TypeScript</Sticker>
        </FlyIn>
        <FlyIn delay={BEAT * 4} from={[-300, 200]} rotate={20} style={{ left: 50, top: 1050 }}>
          <Sticker bg={C.amarillo} size={24} rotate={-5}>MIT license</Sticker>
        </FlyIn>
        <FlyIn delay={BEAT * 5} from={[0, 300]} rotate={-20} style={{ left: 380, top: 1420 }}>
          <Sticker bg={C.rosa} size={24} rotate={-2}>Mobile‑first PWA</Sticker>
        </FlyIn>
      </Camera>
      <Vignette strength={0.4} />
    </DotBg>
  );
}

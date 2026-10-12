import type { FC } from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Grain, PixelWipe, WIPE } from "./fx";
import { AI } from "./scenes/AI";
import { Badge } from "./scenes/Badge";
import { Flow } from "./scenes/Flow";
import { How } from "./scenes/How";
import { Intro } from "./scenes/Intro";
import { Landing } from "./scenes/Landing";
import { Missions } from "./scenes/Missions";
import { Outro } from "./scenes/Outro";
import { Principles } from "./scenes/Principles";
import { Problem } from "./scenes/Problem";
import { C, SCENES } from "./theme";

const VIEWS: Record<string, FC> = { intro: Intro, problem: Problem, how: How, landing: Landing, missions: Missions, flow: Flow, ai: AI, badge: Badge, principles: Principles, outro: Outro };
/** Color de la transición de píxeles que entra a cada escena. */
const WIPES: Record<string, string> = { problem: C.selva, how: C.amarillo, landing: C.rosa, missions: C.cian, flow: C.lima, ai: C.tinta, badge: C.amarillo, principles: C.rosa, outro: C.lima };

export type PromoProps = { music: boolean };

export const Promo: FC<PromoProps> = ({ music }) => (
  <AbsoluteFill style={{ background: C.tinta }}>
    {SCENES.map(({ id, from, frames }) => {
      const View = VIEWS[id];
      return (
        <Sequence key={id} name={id} from={from} durationInFrames={frames}>
          <View />
        </Sequence>
      );
    })}
    {SCENES.slice(1).map(({ id, from }, i) => (
      <Sequence key={`wipe-${id}`} name={`wipe → ${id}`} from={from - WIPE / 2} durationInFrames={WIPE}>
        <PixelWipe color={WIPES[id] ?? C.lima} dir={i % 2 === 0 ? 1 : -1} />
      </Sequence>
    ))}
    <Grain opacity={0.06} />
    {music && <Audio src={staticFile("audio/soundtrack.wav")} />}
  </AbsoluteFill>
);

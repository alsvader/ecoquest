import type { FC } from "react";
import { AbsoluteFill } from "remotion";
import { Cut, type PromoProps, type SceneViews } from "../Promo";
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

const VIEWS: SceneViews = { intro: Intro, problem: Problem, how: How, landing: Landing, missions: Missions, flow: Flow, ai: AI, badge: Badge, principles: Principles, outro: Outro };

/**
 * Zonas que tapan la interfaz de Reels y TikTok (aproximadas, unión de ambas):
 * arriba 220 px, abajo 420 px y la columna de botones a la derecha (140 px desde y = 700).
 */
export const SAFE = { top: 220, bottom: 420, right: 140, rightFrom: 700 } as const;

function SafeZone() {
  const fill = "rgba(255,0,80,0.28)";
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: SAFE.top, background: fill }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: SAFE.bottom, background: fill }} />
      <div style={{ position: "absolute", right: 0, width: SAFE.right, top: SAFE.rightFrom, bottom: SAFE.bottom, background: fill }} />
    </AbsoluteFill>
  );
}

export type VerticalProps = PromoProps & { safeZone: boolean };

export const Vertical: FC<VerticalProps> = ({ music, safeZone }) => (
  <Cut views={VIEWS} music={music}>
    {safeZone && <SafeZone />}
  </Cut>
);

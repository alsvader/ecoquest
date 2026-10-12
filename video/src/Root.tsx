import { Composition } from "remotion";
import { Promo } from "./Promo";
import { FPS, TOTAL_FRAMES } from "./theme";
import { Vertical } from "./vertical/Vertical";

export const RemotionRoot = () => (
  <>
    <Composition id="EcoQuestPromo" component={Promo} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1920} height={1080} defaultProps={{ music: true }} />
    {/* Corte 9:16 para Instagram Reels y TikTok: misma línea de tiempo y misma música. */}
    <Composition id="EcoQuestVertical" component={Vertical} durationInFrames={TOTAL_FRAMES} fps={FPS} width={1080} height={1920} defaultProps={{ music: true, safeZone: false }} />
  </>
);

"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Hud } from "@/components/eq/hud";
import { MissionCard } from "@/components/eq/mission-card";
import { PixelIcon } from "@/components/eq/pixel-icon";
import { Screen, ScreenLoading } from "@/components/eq/screen";
import { XpBar } from "@/components/eq/xp-bar";
import { useExpedition } from "@/components/expedition-provider";
import { useRequireProgress } from "@/components/use-guard";
import { useNow } from "@/components/use-now";
import { useScreenView } from "@/components/use-screen-view";
import { EDEN_EXPEDITION } from "@/data/expedition";
import { t } from "@/i18n";
import { setPendingCapture } from "@/lib/pending-capture";
import { toResult } from "@/lib/result";
import { doneCount, formatDuration } from "@/lib/session";
import { track } from "@/lib/track";

export default function SessionPage() {
  useScreenView("session");
  const router = useRouter();
  const now = useNow();
  const { finish } = useExpedition();
  const { ready, progress } = useRequireProgress();
  const cameraRef = useRef<HTMLInputElement>(null);
  if (!ready || !progress) return <ScreenLoading label={t("common.loading")} />;

  const missions = EDEN_EXPEDITION.missions;
  const total = missions.length;
  const done = doneCount(progress);
  const allDone = done === total;
  // Misión a la que va «Capturar hallazgo»: la primera sin cerrar.
  const next = missions.find((m) => !["confirmed", "manual_unverified"].includes(progress.missions[m.id].status));

  function finishExpedition() {
    if (!allDone && !window.confirm(t("session.finishConfirm"))) return;
    track("tap_finish");
    finish();
    router.push("/resumen");
  }

  return (
    <Screen bg="bg-papel">
      <Hud left={t(EDEN_EXPEDITION.titleKey)} right={t("session.hudCount", { done, total })} />
      <XpBar
        hideHeader
        segments={missions.map((m) => toResult(progress.missions[m.id].status) ?? "pending")}
      />
      <ul className="flex flex-col gap-3">
        {missions.map((m, i) => (
          <li key={m.id}>
            <MissionCard
              compact
              index={i + 1}
              total={total}
              icon={m.icon}
              title={t(m.listKey)}
              result={toResult(progress.missions[m.id].status)}
              href={`/mision/${m.id}`}
              onNavigate={() => track("tap_mission", { missionId: m.id })}
            />
          </li>
        ))}
      </ul>
      <p className="border-3 border-tinta bg-glitch px-3 py-2.5 text-base font-bold leading-[1.3]">
        <span aria-hidden="true">📵 </span>
        {t("session.stow")}
      </p>
      <p className="text-center text-sm font-bold">
        {t("session.elapsed", { time: now === null ? "0:00" : formatDuration(now - progress.startedAt) })}
      </p>
      <div className="flex-1" />

      {/* La cámara trasera se abre con este toque (RF-05); el análisis ocurre en la pantalla de la misión. */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="hidden"
        data-testid="camera-input"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file || !next) return;
          setPendingCapture(file);
          router.push(`/mision/${next.id}`);
        }}
      />
      {allDone ? (
        <Button block onClick={finishExpedition}>
          {t("session.finish")}
        </Button>
      ) : (
        <>
          <Button
            variant="ia"
            block
            onClick={() => {
              track("tap_open_camera", { missionId: next?.id });
              cameraRef.current?.click();
            }}
          >
            <PixelIcon name="camera" scale={3} flat />
            {t("session.capture")}
          </Button>
          <Button variant="ghost" size="sm" block onClick={finishExpedition}>
            {t("session.finish")}
          </Button>
        </>
      )}
    </Screen>
  );
}

"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmAction } from "@/components/eq/confirm-action";
import { Elapsed } from "@/components/eq/elapsed";
import { Hud } from "@/components/eq/hud";
import { MissionCard } from "@/components/eq/mission-card";
import { PixelIcon } from "@/components/eq/pixel-icon";
import { Screen, ScreenLoading } from "@/components/eq/screen";
import { XpBar } from "@/components/eq/xp-bar";
import { useExpedition } from "@/components/expedition-provider";
import { useRequireProgress } from "@/components/use-guard";
import { useScreenView } from "@/components/use-screen-view";
import { EDEN_EXPEDITION, type MissionId } from "@/data/expedition";
import { t } from "@/i18n";
import { setPendingCapture } from "@/lib/pending-capture";
import { toResult } from "@/lib/result";
import { doneCount } from "@/lib/session";
import { track } from "@/lib/track";

export default function SessionPage() {
  useScreenView("session", t("title.session"));
  const { finish } = useExpedition();
  const router = useRouter();
  const { ready, progress } = useRequireProgress("active");
  const cameraRef = useRef<HTMLInputElement>(null);
  const [selectedId, setSelectedId] = useState<MissionId | null>(null);
  if (!ready || !progress) return <ScreenLoading label={t("common.loading")} />;

  const missions = EDEN_EXPEDITION.missions;
  const total = missions.length;
  const done = doneCount(progress);
  const allDone = done === total;
  // «Capturar hallazgo» va a la misión elegida; por defecto, la primera sin cerrar.
  const pending = missions.filter((m) => !["confirmed", "manual_unverified"].includes(progress.missions[m.id].status));
  const target = pending.find((m) => m.id === selectedId) ?? pending[0];

  function finishExpedition() {
    track("tap_finish");
    // replace: «atrás» desde el resumen no vuelve a una sesión ya terminada.
    finish();
    router.replace("/resumen");
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
      <p className="flex items-center gap-2.5 border-3 border-tinta bg-glitch px-3 py-2.5 text-base font-bold leading-[1.3]">
        <PixelIcon name="eye" scale={3} flat className="flex-none" />
        <span>{t("session.stow")}</span>
      </p>
      <Elapsed startedAt={progress.startedAt} />
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
          if (!file || !target) return;
          setPendingCapture(file);
          router.push(`/mision/${target.id}`);
        }}
      />
      {allDone ? (
        <Button block onClick={finishExpedition}>
          {t("session.finish")}
        </Button>
      ) : (
        <>
          {pending.length > 1 && (
            <fieldset className="flex flex-col gap-1.5">
              <legend className="mb-1.5 text-sm font-bold">{t("session.captureFor")}</legend>
              <div className="flex gap-2">
                {pending.map((m) => (
                  <Button
                    key={m.id}
                    size="sm"
                    variant={m.id === target?.id ? "primary" : "secondary"}
                    aria-pressed={m.id === target?.id}
                    className="flex-1 px-2"
                    onClick={() => setSelectedId(m.id)}
                  >
                    {t(m.shortKey)}
                  </Button>
                ))}
              </div>
            </fieldset>
          )}
          <Button
            variant="ia"
            block
            onClick={() => {
              track("tap_open_camera", { missionId: target?.id });
              cameraRef.current?.click();
            }}
          >
            <PixelIcon name="camera" scale={3} flat />
            {t("session.capture")}
          </Button>
          <ConfirmAction
            variant="ghost"
            label={t("session.finish")}
            message={t("session.finishConfirm")}
            confirmLabel={t("session.finishYes")}
            onConfirm={finishExpedition}
          />
        </>
      )}
    </Screen>
  );
}

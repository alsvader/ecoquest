"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MissionCard } from "@/components/eq/mission-card";
import { SafetyNotice } from "@/components/eq/safety-notice";
import { Screen } from "@/components/eq/screen";
import { useExpedition } from "@/components/expedition-provider";
import { useScreenView } from "@/components/use-screen-view";
import { EDEN_EXPEDITION } from "@/data/expedition";
import { t } from "@/i18n";
import { track } from "@/lib/track";

/** Ficha de la expedición con las tres misiones completas (el flujo principal empieza en «/»). */
export default function ExpeditionPage() {
  useScreenView("expedition");
  const router = useRouter();
  const { start } = useExpedition();
  const total = EDEN_EXPEDITION.missions.length;

  return (
    <Screen bg="bg-papel">
      <header>
        <span className="font-pixel text-pixel-sm font-bold uppercase tracking-[0.5px]">{t("welcome.expeditionLabel")}</span>
        <h1 className="font-display text-2xl leading-[1.05]">{t(EDEN_EXPEDITION.titleKey)}</h1>
        <p className="mt-1 text-base font-bold leading-[1.3]">
          {t(EDEN_EXPEDITION.placeKey)} · {t("expedition.duration", { min: EDEN_EXPEDITION.durationMin, count: total })}
        </p>
      </header>
      <ol className="flex flex-col gap-3">
        {EDEN_EXPEDITION.missions.map((m, i) => (
          <li key={m.id}>
            <MissionCard index={i + 1} total={total} icon={m.icon} title={t(m.titleKey)} description={t(m.hintKey)} />
          </li>
        ))}
      </ol>
      <SafetyNotice />
      <div className="flex-1" />
      <Button
        block
        onClick={() => {
          track("tap_begin_expedition");
          start();
          router.push("/sesion");
        }}
      >
        {t("expedition.begin")}
      </Button>
    </Screen>
  );
}

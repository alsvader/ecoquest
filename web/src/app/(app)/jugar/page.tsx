"use client";

import Link from "next/link";
import { Button, LinkButton } from "@/components/ui/button";
import { ConfirmAction } from "@/components/eq/confirm-action";
import { SafetyNotice } from "@/components/eq/safety-notice";
import { Screen } from "@/components/eq/screen";
import { useExpedition, useStartExpedition } from "@/components/expedition-provider";
import { useScreenView } from "@/components/use-screen-view";
import { EDEN_EXPEDITION } from "@/data/expedition";
import { t } from "@/i18n";
import { track } from "@/lib/track";

export default function WelcomePage() {
  useScreenView("welcome", t("title.welcome"));
  const { progress, loaded } = useExpedition();
  const { begin, starting } = useStartExpedition("tap_start");
  const inProgress = loaded && progress && !progress.endedAt;

  return (
    <Screen bg="bg-lima">
      <h1 className="mt-1.5 font-pixel text-pixel-lg font-bold leading-[1.15] [text-shadow:3px_3px_0_#fff]">
        {t("welcome.logoTop")}
        <br />
        {t("welcome.logoBottom")}
      </h1>
      <p className="-rotate-[1.5deg] self-start bg-tinta px-2 py-1.5 font-display text-base text-voltio">{t("app.tagline")}</p>
      <section className="border-3 border-tinta bg-white p-3 shadow-brutal">
        <span className="font-pixel text-pixel-sm font-bold uppercase">{t("welcome.expeditionLabel")}</span>
        <h2 className="my-1 font-display text-2xl leading-[1.05]">{t(EDEN_EXPEDITION.titleKey)}</h2>
        <p className="text-base font-bold leading-[1.3]">
          {t(EDEN_EXPEDITION.placeKey)}
          <br />
          {t("expedition.duration", { min: EDEN_EXPEDITION.durationMin, count: EDEN_EXPEDITION.missions.length })}
        </p>
      </section>
      <SafetyNotice />
      <div className="flex-1" />
      {!loaded ? (
        // Hasta leer el progreso guardado no sabemos si hay expedición en curso: no ofrecemos «¡Comenzar!».
        <Button block disabled>
          {t("common.loading")}
        </Button>
      ) : inProgress ? (
        <>
          <LinkButton href="/sesion" block onClick={() => track("tap_resume")}>
            {t("welcome.resume")}
          </LinkButton>
          <ConfirmAction
            label={t("welcome.restart")}
            message={t("welcome.restartConfirm")}
            confirmLabel={t("welcome.restartYes")}
            onConfirm={begin}
          />
        </>
      ) : (
        <Button block disabled={starting} onClick={() => void begin()}>
          {t("welcome.start")}
        </Button>
      )}
      <p className="text-center text-sm font-medium">{t("welcome.note")}</p>
      <Link href="/datos" className="mx-auto flex min-h-12 items-center px-2 text-sm font-bold underline underline-offset-4">
        {t("nav.privacy")}
      </Link>
    </Screen>
  );
}

"use client";

import { useEffect, useState } from "react";
import { LinkButton, Button } from "@/components/ui/button";
import { EqCard } from "@/components/eq/card";
import { ConfirmAction } from "@/components/eq/confirm-action";
import { Screen } from "@/components/eq/screen";
import { EqToast } from "@/components/eq/toast";
import { useExpedition } from "@/components/expedition-provider";
import { useScreenView } from "@/components/use-screen-view";
import { DEFAULT_MODEL } from "@/lib/config";
import { getLogs } from "@/lib/db";
import { summarizeLog, type LogSummary } from "@/lib/log";
import { t } from "@/i18n";
import { track } from "@/lib/track";
import type { LogEntry } from "@/lib/types";

export default function DataPage() {
  useScreenView("data", t("title.data"));
  const { deleteEverything, storageOk } = useExpedition();
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [logState, setLogState] = useState<"loading" | "ok" | "error">("loading");
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getLogs()
      .then((e) => {
        if (cancelled) return;
        setEntries(e);
        setLogState("ok");
      })
      .catch(() => {
        if (!cancelled) setLogState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [deleted]);

  const summary: LogSummary = summarizeLog(entries);

  function exportLog() {
    track("tap_export_log");
    const blob = new Blob([JSON.stringify({ summary, entries }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ecoquest-registro.json";
    // Algunos navegadores (Firefox, iOS) solo descargan si el <a> está en el documento.
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <Screen bg="bg-papel">
      <h1 className="font-display text-2xl leading-[1.05]">{t("data.title")}</h1>
      <p className="text-base">{t("data.privacy")}</p>
      {!storageOk && <EqToast variant="warn" title={t("data.storageTitle")}>{t("data.storageUnavailable")}</EqToast>}

      <EqCard className="p-3.5">
        <h2 className="font-display text-lg">{t("data.modelTitle")}</h2>
        <p className="mt-1 text-base">{t("data.modelBody", { name: DEFAULT_MODEL.name, license: DEFAULT_MODEL.license })}</p>
      </EqCard>

      <EqCard className="p-3.5">
        <h2 className="font-display text-lg">{t("data.logTitle")}</h2>
        {logState === "loading" && <p className="mt-1 text-base">{t("data.logLoading")}</p>}
        {logState === "error" && <p className="mt-1 text-base font-bold">{t("data.logError")}</p>}
        {logState === "ok" && (
          <>
            <p className="mt-1 text-base">
              {t("data.logBody", { count: summary.events, interactions: summary.interactions, classifications: summary.classifications })}
            </p>
            <p className="mt-1 text-base font-medium">
              {summary.avgRoundTripMs === null
                ? t("data.latencyNone")
                : t("data.latencyBody", { avg: summary.avgRoundTripMs, max: summary.maxRoundTripMs ?? 0 })}
            </p>
          </>
        )}
        <Button variant="ia" size="sm" block className="mt-3" disabled={logState !== "ok"} onClick={exportLog}>
          {t("data.export")}
        </Button>
      </EqCard>

      <EqCard className="bg-lava p-3.5">
        <h2 className="font-display text-lg">{t("data.deleteTitle")}</h2>
        <p className="mt-1 text-base">{t("data.deleteBody")}</p>
        {/* Región en vivo siempre montada; el texto aparece al borrar. */}
        <p role="status" className={deleted ? "mt-2 text-base font-bold" : "sr-only"}>
          {deleted ? t("data.deleted") : null}
        </p>
        <div className="mt-3">
          <ConfirmAction
            label={t("data.delete")}
            message={t("data.deleteConfirm")}
            confirmLabel={t("data.deleteYes")}
            errorMessage={t("data.deleteError")}
            onConfirm={async () => {
              await deleteEverything();
              setDeleted(true);
            }}
          />
        </div>
      </EqCard>
      <div className="flex-1" />
      <LinkButton href="/jugar" block>
        {t("data.back")}
      </LinkButton>
    </Screen>
  );
}

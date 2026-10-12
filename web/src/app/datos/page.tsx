"use client";

import { useEffect, useState } from "react";
import { Button, LinkButton } from "@/components/ui/button";
import { EqCard } from "@/components/eq/card";
import { Screen } from "@/components/eq/screen";
import { EqToast } from "@/components/eq/toast";
import { useExpedition } from "@/components/expedition-provider";
import { useScreenView } from "@/components/use-screen-view";
import { DEFAULT_MODEL } from "@/lib/config";
import { clearAll, getLogs } from "@/lib/db";
import { summarizeLog, type LogSummary } from "@/lib/log";
import { t } from "@/i18n";
import { track } from "@/lib/track";
import type { LogEntry } from "@/lib/types";

export default function DataPage() {
  useScreenView("data");
  const { deleteEverything, storageOk } = useExpedition();
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [deleted, setDeleted] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    getLogs().then(setEntries).catch(() => undefined);
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
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Screen bg="bg-papel">
      <h1 className="font-display text-2xl leading-[1.05]">{t("data.title")}</h1>
      <p className="text-base">{t("data.privacy")}</p>
      {!storageOk && <EqToast variant="warn" title={t("data.title")}>{t("data.storageUnavailable")}</EqToast>}

      <EqCard className="p-3.5">
        <h2 className="font-display text-lg">{t("data.modelTitle")}</h2>
        <p className="mt-1 text-base">{t("data.modelBody", { name: DEFAULT_MODEL.name, license: DEFAULT_MODEL.license })}</p>
      </EqCard>

      <EqCard className="p-3.5">
        <h2 className="font-display text-lg">{t("data.logTitle")}</h2>
        <p className="mt-1 text-base">
          {t("data.logBody", { count: summary.events, interactions: summary.interactions, classifications: summary.classifications })}
        </p>
        <p className="mt-1 text-base font-medium">
          {summary.avgRoundTripMs === null
            ? t("data.latencyNone")
            : t("data.latencyBody", { avg: summary.avgRoundTripMs, max: summary.maxRoundTripMs ?? 0 })}
        </p>
        <Button variant="ia" size="sm" block className="mt-3" onClick={exportLog}>
          {t("data.export")}
        </Button>
      </EqCard>

      <EqCard className="bg-lava p-3.5">
        <h2 className="font-display text-lg">{t("data.deleteTitle")}</h2>
        <p className="mt-1 text-base">{t("data.deleteBody")}</p>
        {deleted && (
          <p role="status" className="mt-2 text-base font-bold">
            {t("data.deleted")}
          </p>
        )}
        {!confirming ? (
          <Button variant="secondary" size="sm" block className="mt-3" onClick={() => setConfirming(true)}>
            {t("data.delete")}
          </Button>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            <p className="text-base font-bold">{t("data.deleteConfirm")}</p>
            <Button
              variant="secondary"
              size="sm"
              block
              onClick={async () => {
                await deleteEverything().catch(() => clearAll());
                setConfirming(false);
                setDeleted(true);
              }}
            >
              {t("data.delete")}
            </Button>
          </div>
        )}
      </EqCard>
      <div className="flex-1" />
      <LinkButton href="/" block>
        {t("data.back")}
      </LinkButton>
    </Screen>
  );
}

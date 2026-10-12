"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Insignia } from "@/components/eq/insignia";
import { Screen, ScreenLoading } from "@/components/eq/screen";
import { PendingChip, StatusBadge } from "@/components/eq/status-badge";
import { EqToast } from "@/components/eq/toast";
import { useExpedition } from "@/components/expedition-provider";
import { useRequireProgress } from "@/components/use-guard";
import { useScreenView } from "@/components/use-screen-view";
import { EDEN_EXPEDITION } from "@/data/expedition";
import { t, type DictKey } from "@/i18n";
import { toResult } from "@/lib/result";
import { computeSummary, formatDuration } from "@/lib/session";
import { track } from "@/lib/track";

export default function SummaryPage() {
  useScreenView("summary");
  const router = useRouter();
  const { deletePhotos } = useExpedition();
  const { ready, progress } = useRequireProgress();
  const [photosDeleted, setPhotosDeleted] = useState(false);
  if (!ready || !progress) return <ScreenLoading label={t("common.loading")} />;

  const s = computeSummary(progress, progress.endedAt ?? progress.startedAt);
  const allDone = s.verified + s.manual === s.total;

  return (
    <Screen bg="bg-voltio">
      <h1 className="text-center font-display text-2xl leading-[1.05]">
        {t(allDone ? "summary.titleDone" : "summary.titlePartial")}
      </h1>
      <div className="flex flex-col items-center">
        <Insignia size="sm" ribbon={t("insignia.ribbon")} locked={s.badge === "none"} hasManual={s.manual > 0} />
        {s.badge !== "none" && (
          <p className="mt-3 text-center text-lg font-bold">{t(`badge.${s.badge}.name` as DictKey)}</p>
        )}
      </div>
      <ul className="border-3 border-tinta bg-white px-3 py-1 shadow-brutal">
        {EDEN_EXPEDITION.missions.map((m) => {
          const result = toResult(progress.missions[m.id].status);
          return (
            <li key={m.id} className="flex items-center justify-between gap-1.5 border-b-2 border-tinta py-2 text-base font-bold last:border-b-0">
              <span>{t(m.summaryKey)}</span>
              {result ? <StatusBadge size="chip" result={result} /> : <PendingChip />}
            </li>
          );
        })}
      </ul>
      <p className="text-center text-base font-bold">{t("summary.time", { time: formatDuration(s.durationMs) })}</p>
      <p className="text-center text-sm font-medium">{t("summary.note")}</p>
      {photosDeleted && (
        <EqToast variant="ok" title={t("summary.photosDeleted")}>
          {t("summary.photosDeletedBody")}
        </EqToast>
      )}
      <div className="flex-1" />
      <Button
        block
        onClick={() => {
          track("tap_finish_summary");
          router.push("/jugar");
        }}
      >
        {t("summary.finish")}
      </Button>
      <Button
        variant="secondary"
        size="sm"
        block
        disabled={photosDeleted}
        onClick={async () => {
          if (!window.confirm(t("summary.deletePhotosConfirm"))) return;
          track("tap_delete_photos");
          await deletePhotos().catch(() => undefined);
          setPhotosDeleted(true);
        }}
      >
        {t("summary.deletePhotos")}
      </Button>
    </Screen>
  );
}

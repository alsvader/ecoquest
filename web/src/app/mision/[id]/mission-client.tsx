"use client";

import { useEffect, useRef, useState } from "react";
import { Button, LinkButton } from "@/components/ui/button";
import { EqToast } from "@/components/eq/toast";
import { Hud, IaChip } from "@/components/eq/hud";
import { MissionCard } from "@/components/eq/mission-card";
import { PhotoFrame } from "@/components/eq/photo-frame";
import { PixelIcon } from "@/components/eq/pixel-icon";
import { Screen, ScreenLoading } from "@/components/eq/screen";
import { StatusBadge, type MissionResult } from "@/components/eq/status-badge";
import { useExpedition } from "@/components/expedition-provider";
import { useRequireProgress } from "@/components/use-guard";
import { useScreenView } from "@/components/use-screen-view";
import { EDEN_EXPEDITION, getMission, type MissionId } from "@/data/expedition";
import { t } from "@/i18n";
import { ApiError, classify, isRetryableError } from "@/lib/api";
import { getPhoto } from "@/lib/db";
import { compressImage, isAllowedType, withinUploadLimit } from "@/lib/image";
import { takePendingCapture } from "@/lib/pending-capture";
import { errorMessageKey, statusView, toResult } from "@/lib/result";
import { doneCount } from "@/lib/session";
import { track } from "@/lib/track";

function usePhotoUrl(photoId?: string) {
  const [state, setState] = useState<{ id: string; url: string } | null>(null);
  useEffect(() => {
    if (!photoId) return;
    let revoked = false;
    let url = "";
    getPhoto(photoId)
      .then((p) => {
        if (!p || revoked) return;
        url = URL.createObjectURL(p.blob);
        setState({ id: photoId, url });
      })
      .catch(() => undefined);
    return () => {
      revoked = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [photoId]);
  return state && state.id === photoId ? state.url : null;
}

/**
 * Panel de similitud (§8.3). SIN números ni porcentajes: la similitud no es una probabilidad (RNF-07).
 * La barra y la línea de umbral son decorativas; el sentido va en texto para lector de pantalla.
 */
function SimilarityPanel({ score, threshold, target, match }: { score: number; threshold: number; target: string; match: boolean }) {
  const clamp = (n: number) => `${Math.min(100, Math.max(0, n * 100))}%`;
  return (
    <div className="border-3 border-tinta bg-white px-3 py-2.5 text-base">
      {t("result.sim.title", { target })}
      <div className="relative mt-1.5 h-4 border-2 border-tinta bg-white" aria-hidden="true">
        <i className={`absolute inset-y-0 left-0 border-r-2 border-tinta ${match ? "bg-lima" : "bg-voltio"}`} style={{ width: clamp(score) }} />
        <span className="absolute -bottom-[5px] -top-[5px] border-l-[3px] border-dashed border-tinta" style={{ left: clamp(threshold) }} />
      </div>
      <p className="mt-1 text-sm font-medium">
        <span aria-hidden="true">— — </span>
        {t("result.sim.threshold")}
      </p>
      <p className="sr-only">{t(match ? "result.sim.above" : "result.sim.below")}</p>
      <p className="mt-1 text-sm">{t("result.disclaimer")}</p>
    </div>
  );
}

export function MissionClient({ missionId }: { missionId: MissionId }) {
  useScreenView(`mission_${missionId}`);
  const mission = getMission(missionId);
  const index = EDEN_EXPEDITION.missions.findIndex((m) => m.id === missionId) + 1;
  const total = EDEN_EXPEDITION.missions.length;
  const { ready, progress } = useRequireProgress();
  const { recordPhoto, recordResult, recordPending, markManual } = useExpedition();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [justMatched, setJustMatched] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const consumedPending = useRef(false);
  const record = progress?.missions[missionId];
  const photoUrl = usePhotoUrl(record?.photoId);

  const previewRef = useRef<string | null>(null);
  useEffect(() => () => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
  }, []);

  function showPreview(blob: Blob) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = URL.createObjectURL(blob);
    setPreview(previewRef.current);
  }

  async function send(blob: Blob, photoId: string, fileName?: string) {
    setBusy(true);
    setMessage(null);
    setJustMatched(false);
    showPreview(blob);
    const t0 = performance.now();
    try {
      const resp = await classify(blob, missionId, fileName);
      const roundTripMs = Math.round(performance.now() - t0);
      recordResult(missionId, resp, photoId);
      setJustMatched(resp.status === "confirmed");
      track("classify_result", {
        missionId,
        interaction: false,
        data: { status: resp.status, targetScore: resp.target_score, serverLatencyMs: resp.latency_ms, roundTripMs, bytes: blob.size },
      });
    } catch (e) {
      const err = e instanceof ApiError ? e : new ApiError("server", "unknown");
      track("classify_error", {
        missionId,
        interaction: false,
        data: { kind: err.kind, httpStatus: err.httpStatus ?? null, roundTripMs: Math.round(performance.now() - t0) },
      });
      if (isRetryableError(err)) recordPending(missionId, photoId);
      setMessage(t(errorMessageKey(err), { detail: err.message }));
    } finally {
      setBusy(false);
    }
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setMessage(null);
    track("photo_selected", { missionId, data: { bytes: file.size } });
    if (!isAllowedType(file.type)) return setMessage(t("capture.invalidType"));
    const blob = await compressImage(file);
    if (!withinUploadLimit(blob.size)) return setMessage(t("capture.tooLarge"));
    try {
      const photoId = await recordPhoto(missionId, blob);
      await send(blob, photoId, file.name);
    } catch {
      setMessage(t("capture.readError"));
    }
  }

  // Foto tomada desde «Misiones» (Capturar hallazgo): se analiza al llegar aquí.
  useEffect(() => {
    if (!ready || consumedPending.current) return;
    consumedPending.current = true;
    const file = takePendingCapture();
    if (file) void Promise.resolve().then(() => onFile(file));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  if (!ready || !record || !progress) return <ScreenLoading label={t("common.loading")} />;

  async function resend() {
    if (!record?.photoId) return;
    track("tap_resend", { missionId });
    const stored = await getPhoto(record.photoId).catch(() => undefined);
    if (!stored) return setMessage(t("capture.readError"));
    await send(stored.blob, stored.id);
  }

  const view = statusView(record.status);
  const started = record.status !== "todo";
  // Estado visual: errores sin evidencia guardada (foto inválida, 400…) también son «Reintentar».
  const result: MissionResult | undefined = toResult(record.status) ?? (message ? "retry" : undefined);
  const canResend = view.canResend && !!record.photoId;
  const canManual = result === "unsure" || view.canMarkManual;
  const showSimilarity = (result === "match" || result === "unsure") && record.targetScore !== undefined;
  const shownPhoto = busy ? preview : photoUrl;

  const inputs = (
    <>
      {/* Inputs de cámara/galería (FR-3). capture abre la cámara trasera en móvil. */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="hidden"
        data-testid="camera-input"
        onChange={(e) => {
          void onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          void onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </>
  );

  const openCamera = (event: string) => () => {
    track(event, { missionId });
    cameraRef.current?.click();
  };
  const back = (
    <LinkButton href="/sesion" variant="ghost" size="sm" block onClick={() => track("tap_back_to_session", { missionId })}>
      {t("result.back")}
    </LinkButton>
  );

  // ── Analizando
  if (busy) {
    return (
      <Screen bg="bg-papel">
        {inputs}
        <Hud left={t("mission.hud", { n: index, total })} right={<IaChip />} />
        <PhotoFrame src={shownPhoto} alt={t("capture.photoAlt")} />
        <EqToast variant="info" title={t("result.analyzingTitle")}>
          {t("result.analyzingBody")}
        </EqToast>
        <div className="flex-1" />
        <Button block disabled>
          {t("result.analyzing")}
        </Button>
      </Screen>
    );
  }

  // ── Misión sin foto todavía
  if (!result) {
    return (
      <Screen bg="bg-papel">
        {inputs}
        <Hud left={t("mission.hud", { n: index, total })} right={t(mission.shortKey)} />
        <MissionCard index={index} total={total} icon={mission.icon} title={t(mission.titleKey)} description={t(mission.hintKey)} />
        <p className="text-sm font-medium">{t("capture.tips")}</p>
        <div className="flex-1" />
        <Button variant="ia" block onClick={openCamera("tap_open_camera")}>
          <PixelIcon name="camera" scale={3} flat />
          {t("capture.camera")}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          block
          onClick={() => {
            track("tap_gallery", { missionId });
            galleryRef.current?.click();
          }}
        >
          {t("capture.gallery")}
        </Button>
        {back}
      </Screen>
    );
  }

  const explanation =
    result === "match"
      ? t("result.match.body", { seen: t(mission.seenKey) })
      : result === "unsure"
        ? t("result.unsure.body", { maybe: t(mission.maybeKey) })
        : result === "manual"
          ? t("result.manual.body")
          : message ?? t("result.retry.body");

  return (
    <Screen bg="bg-papel">
      {inputs}
      <Hud left={t("mission.hud", { n: index, total })} right={<IaChip />} />
      {justMatched && result === "match" && (
        <EqToast variant="ok" title={t("result.toast.okTitle")}>
          {t("result.toast.okBody", { seen: t(mission.seenKey), done: doneCount(progress), total })}
        </EqToast>
      )}
      {message && result !== "retry" && <EqToast variant="warn" title={t("error.toastTitle")}>{message}</EqToast>}
      {(shownPhoto || started) && <PhotoFrame src={shownPhoto} alt={t("capture.photoAlt")} />}
      <div aria-live="polite" className="flex flex-col gap-3">
        <StatusBadge result={result} className="self-start" />
        <p className="text-lg font-bold leading-[1.3]">{explanation}</p>
        {result === "match" && <p className="text-sm font-medium">{t("result.match.tentative")}</p>}
        {result === "unsure" && <p className="text-base font-medium">{t("result.unsure.alt")}</p>}
        {result === "retry" && canResend && <p className="text-base font-medium">{t("result.retry.saved")}</p>}
      </div>
      {showSimilarity && (
        <SimilarityPanel
          score={record.targetScore!}
          threshold={mission.threshold}
          target={t(mission.targetKey)}
          match={result === "match"}
        />
      )}
      <div className="flex-1" />

      {result === "match" || result === "manual" ? (
        <>
          <LinkButton href="/sesion" block onClick={() => track("tap_back_to_session", { missionId })}>
            {t("result.next")}
          </LinkButton>
          <Button variant="ghost" size="sm" block onClick={openCamera("tap_retake")}>
            {t("result.retake")}
          </Button>
        </>
      ) : (
        <>
          {canResend ? (
            <Button block onClick={() => void resend()}>
              {t("result.resend")}
            </Button>
          ) : (
            <Button block onClick={openCamera("tap_retry")}>
              {t("result.retake")}
            </Button>
          )}
          {canResend && (
            <Button variant="secondary" size="sm" block onClick={openCamera("tap_retry")}>
              {t("result.retake")}
            </Button>
          )}
          {canManual && (
            <Button
              variant="ghost"
              size="sm"
              block
              onClick={() => {
                track("tap_mark_manual", { missionId });
                markManual(missionId);
              }}
            >
              {t("result.markManual")}
            </Button>
          )}
          {!started && (
            <Button
              variant="ghost"
              size="sm"
              block
              onClick={() => {
                track("tap_gallery", { missionId });
                galleryRef.current?.click();
              }}
            >
              {t("capture.gallery")}
            </Button>
          )}
          {back}
        </>
      )}
    </Screen>
  );
}

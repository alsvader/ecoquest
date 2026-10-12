"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { t, type DictKey } from "@/i18n";
import { ApiError, classify, isRetryableError } from "@/lib/api";
import { getPhoto, StorageQuotaError } from "@/lib/db";
import { REQUEST_TIMEOUT_MS } from "@/lib/config";
import { compressImage, isAllowedType, withinUploadLimit } from "@/lib/image";
import { takePendingCapture } from "@/lib/pending-capture";
import { errorMessageKey, statusView, toResult } from "@/lib/result";
import { doneCount } from "@/lib/session";
import { track } from "@/lib/track";

/** Título específico por tipo de error (en vez de «Sin conexión» para todo). */
function errorTitleKey(e: ApiError): DictKey {
  if (e.kind === "network" && e.message === "timeout") return "error.title.timeout";
  switch (e.kind) {
    case "network":
      return "error.title.network";
    case "rate_limit":
      return "error.title.rateLimit";
    case "bad_request":
      return "error.title.badRequest";
    case "invalid_response":
      return "error.title.invalidResponse";
    default:
      return "error.title.server";
  }
}

/** Margen sobre el timeout interno de `classify`: garantiza que la UI nunca quede colgada. */
const ANALYSIS_TIMEOUT_MS = REQUEST_TIMEOUT_MS + 5_000;

class CancelledError extends Error {}

/** Rechaza en cuanto la señal se aborta; el resultado tardío de `p` se ignora. */
function withAbort<T>(p: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    if (signal.aborted) return reject(signal.reason);
    signal.addEventListener("abort", () => reject(signal.reason), { once: true });
    p.then(resolve, reject);
  });
}

interface ErrorState {
  titleKey: DictKey;
  body: string;
}

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
  const mission = getMission(missionId);
  const index = EDEN_EXPEDITION.missions.findIndex((m) => m.id === missionId) + 1;
  const total = EDEN_EXPEDITION.missions.length;
  useScreenView(`mission_${missionId}`, t("title.mission", { mission: t(mission.shortKey) }));
  const router = useRouter();
  const { ready, progress } = useRequireProgress("active");
  const { recordPhoto, recordResult, recordPending, markManual } = useExpedition();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const message = error?.body ?? null;
  const [justMatched, setJustMatched] = useState(false);
  const [justManual, setJustManual] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const prevPhase = useRef<string | null>(null);
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

  /** Analiza `blob` con timeout y cancelación. Siempre termina con `busy = false`. */
  async function send(blob: Blob, photoId: string, controller: AbortController, fileName?: string) {
    const t0 = performance.now();
    try {
      const resp = await withAbort(classify(blob, missionId, fileName, controller.signal), controller.signal);
      const roundTripMs = Math.round(performance.now() - t0);
      recordResult(missionId, resp, photoId);
      setJustMatched(resp.status === "confirmed");
      track("classify_result", {
        missionId,
        interaction: false,
        data: { status: resp.status, targetScore: resp.target_score, serverLatencyMs: resp.latency_ms, roundTripMs, bytes: blob.size },
      });
    } catch (e) {
      if (e instanceof CancelledError) {
        track("analysis_cancelled", { missionId });
        // La foto ya está guardada: queda como «Reintentar» para poder reenviarla.
        recordPending(missionId, photoId);
        setError({ titleKey: "error.title.network", body: t("capture.cancelled") });
        return;
      }
      const err = e instanceof ApiError ? e : new ApiError("server", "unknown");
      track("classify_error", {
        missionId,
        interaction: false,
        data: { kind: err.kind, httpStatus: err.httpStatus ?? null, roundTripMs: Math.round(performance.now() - t0) },
      });
      if (isRetryableError(err)) recordPending(missionId, photoId);
      const timedOut = err.kind === "network" && err.message === "timeout";
      setError({
        titleKey: errorTitleKey(err),
        body: timedOut ? t("error.timeout") : t(errorMessageKey(err), { detail: err.message }),
      });
    }
  }

  /** Corre `work` en estado «Analizando» con su AbortController (timeout + botón Cancelar). */
  async function analyze(work: (controller: AbortController) => Promise<void>) {
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = setTimeout(() => controller.abort(new ApiError("network", "timeout")), ANALYSIS_TIMEOUT_MS);
    setBusy(true);
    setError(null);
    setJustMatched(false);
    setJustManual(false);
    try {
      await work(controller);
    } finally {
      clearTimeout(timer);
      if (abortRef.current === controller) abortRef.current = null;
      setBusy(false);
    }
  }

  function cancelAnalysis() {
    abortRef.current?.abort(new CancelledError());
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    track("photo_selected", { missionId, data: { bytes: file.size } });
    // «Analizando» desde el primer instante (antes de comprimir/guardar) y con la foto elegida ya visible.
    await analyze(async (controller) => {
      const fail = (body: string) => setError({ titleKey: "error.title.photo", body });
      if (!isAllowedType(file.type)) return fail(t("capture.invalidType"));
      showPreview(file);
      let blob: Blob;
      let photoId: string;
      try {
        blob = await withAbort(compressImage(file), controller.signal);
        if (!withinUploadLimit(blob.size)) return fail(t("capture.tooLarge"));
        photoId = await recordPhoto(missionId, blob);
      } catch (e) {
        if (e instanceof CancelledError) return;
        if (e instanceof ApiError) return setError({ titleKey: errorTitleKey(e), body: t("error.timeout") });
        if (e instanceof StorageQuotaError) return fail(t("capture.storageFull"));
        return fail(t("capture.readError"));
      }
      await send(blob, photoId, controller, file.name);
    });
  }

  // Foto tomada desde «Misiones» (Capturar hallazgo): se analiza al llegar aquí.
  useEffect(() => {
    if (!ready || consumedPending.current) return;
    consumedPending.current = true;
    const file = takePendingCapture();
    if (file) void Promise.resolve().then(() => onFile(file));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // Al cambiar el resultado (tras analizar, marcar a mano…) el foco pasa al encabezado del resultado.
  const result: MissionResult | undefined = record ? toResult(record.status) ?? (message ? "retry" : undefined) : undefined;
  const phase = busy ? "busy" : (result ?? "none");
  useEffect(() => {
    const prev = prevPhase.current;
    prevPhase.current = phase;
    if (prev && prev !== "none" && prev !== phase && phase !== "busy") headingRef.current?.focus();
  }, [phase]);

  if (!ready || !record || !progress) return <ScreenLoading label={t("common.loading")} />;

  async function resend() {
    if (!record?.photoId) return;
    track("tap_resend", { missionId });
    const photoId = record.photoId;
    await analyze(async (controller) => {
      const stored = await getPhoto(photoId).catch(() => undefined);
      if (!stored) return setError({ titleKey: "error.title.photo", body: t("capture.readError") });
      showPreview(stored.blob);
      await send(stored.blob, stored.id, controller);
    });
  }

  const view = statusView(record.status);
  const canResend = view.canResend && !!record.photoId;
  const canManual = result === "unsure" || view.canMarkManual;
  const showSimilarity = (result === "match" || result === "unsure") && record.targetScore !== undefined;
  // `preview ?? photoUrl`: evita un cuadro en blanco entre el fin del análisis y la carga de la foto guardada.
  const shownPhoto = preview ?? photoUrl;
  const started = record.status !== "todo";

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
  const openGallery = () => {
    track("tap_gallery", { missionId });
    galleryRef.current?.click();
  };
  // «Volver» no apila historial: si hay pantalla previa (la lista de misiones) se retrocede; si no (entrada directa), se reemplaza.
  const goBack = () => {
    track("tap_back_to_session", { missionId });
    if (window.history.length > 1) router.back();
    else router.replace("/sesion");
  };
  const back = (
    <Button variant="ghost" size="sm" block onClick={goBack}>
      {t("result.back")}
    </Button>
  );
  const galleryButton = (
    <Button variant="secondary" size="sm" block onClick={openGallery}>
      {t("capture.gallery")}
    </Button>
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
        <Button variant="secondary" size="sm" block onClick={cancelAnalysis}>
          {t("result.cancel")}
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
        {galleryButton}
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
      {justManual && result === "manual" && (
        <EqToast variant="xp" title={t("result.toast.manualTitle")}>
          {t("result.toast.manualBody")}
        </EqToast>
      )}
      {error && result !== "retry" && (
        <EqToast key={error.body} variant="warn" title={t(error.titleKey)}>
          {error.body}
        </EqToast>
      )}
      {(shownPhoto || started) && <PhotoFrame src={shownPhoto} alt={t("capture.photoAlt")} />}
      <div className="flex flex-col gap-3">
        <StatusBadge result={result} className="self-start" />
        {error && result === "retry" && <p className="text-sm font-bold">{t(error.titleKey)}</p>}
        <h2 ref={headingRef} tabIndex={-1} className="text-lg font-bold leading-[1.3] outline-none">
          {explanation}
        </h2>
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
          <Button block onClick={goBack}>
            {t("result.next")}
          </Button>
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
          {/* Siempre se ofrece la galería, también tras un fallo o un «no confirmado». */}
          {galleryButton}
          {canManual && (
            <Button
              variant="ghost"
              size="sm"
              block
              onClick={() => {
                track("tap_mark_manual", { missionId });
                markManual(missionId);
                setJustManual(true);
              }}
            >
              {t("result.markManual")}
            </Button>
          )}
          {back}
        </>
      )}
    </Screen>
  );
}

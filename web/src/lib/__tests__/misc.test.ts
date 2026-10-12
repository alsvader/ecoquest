import { describe, expect, it } from "vitest";
import { EDEN_EXPEDITION, isMissionId } from "@/data/expedition";
import { es } from "@/i18n/es";
import { t, translate } from "@/i18n";
import { fitWithin, isAllowedType, withinUploadLimit } from "../image";
import { summarizeLog } from "../log";
import { formatSimilarity, statusView } from "../result";

describe("expedición", () => {
  it("tiene las 3 misiones y todas sus claves existen en el diccionario", () => {
    expect(EDEN_EXPEDITION.missions.map((m) => m.id)).toEqual(["leaf", "flower", "roots"]);
    for (const m of EDEN_EXPEDITION.missions) for (const k of [m.titleKey, m.hintKey, m.shortKey]) expect(es[k]).toBeTruthy();
    expect(isMissionId("flower")).toBe(true);
    expect(isMissionId("tree")).toBe(false);
  });
});

describe("i18n", () => {
  it("interpola variables", () => expect(t("summary.time", { time: "1:00" })).toContain("1:00"));
  it("el aviso de seguridad cubre fauna, plantas y agua", () => {
    expect(t("safety.body")).toMatch(/fauna/i);
    expect(t("safety.body")).toMatch(/plantas/i);
    expect(t("safety.body")).toMatch(/agua/i);
  });
  it("nunca habla de «tiempo fuera de pantalla»", () => {
    for (const [k, v] of Object.entries(es)) expect(v, k).not.toMatch(/fuera de pantalla/i);
  });
  it("deja el marcador si falta la variable", () => expect(translate("es", "summary.time")).toContain("{time}"));
  it("ningún texto presenta la similitud como probabilidad o porcentaje", () => {
    for (const [k, v] of Object.entries(es)) {
      if (k === "result.disclaimer" || k === "data.modelBody") continue; // únicos textos que niegan explícitamente la probabilidad
      expect(v, k).not.toMatch(/probabilidad|%/i);
    }
  });
});

describe("imagen", () => {
  it("fitWithin reduce sin ampliar", () => {
    expect(fitWithin(4000, 3000, 1024)).toEqual({ width: 1024, height: 768 });
    expect(fitWithin(800, 600, 1024)).toEqual({ width: 800, height: 600 });
  });
  it("valida tipo y tamaño", () => {
    expect(isAllowedType("image/webp")).toBe(true);
    expect(isAllowedType("image/gif")).toBe(false);
    expect(withinUploadLimit(5 * 1024 * 1024)).toBe(true);
    expect(withinUploadLimit(5 * 1024 * 1024 + 1)).toBe(false);
  });
});

describe("resultado", () => {
  it("opciones por estado", () => {
    expect(statusView("confirmed")).toMatchObject({ canRetry: false, done: true });
    expect(statusView("inconclusive")).toMatchObject({ canRetry: true, canMarkManual: false });
    expect(statusView("unconfirmed")).toMatchObject({ canRetry: true, canMarkManual: true });
    expect(statusView("pending_upload")).toMatchObject({ canResend: true });
  });
  it("el índice no lleva porcentaje", () => expect(formatSimilarity(0.6234)).toBe("0.62"));
});

describe("registro", () => {
  it("resume interacciones y latencias", () => {
    const s = summarizeLog([
      { ts: 1, type: "tap_start", interaction: true },
      { ts: 2, type: "screen_view", interaction: false },
      { ts: 3, type: "classify_result", interaction: false, data: { roundTripMs: 1000 } },
      { ts: 4, type: "classify_result", interaction: false, data: { roundTripMs: 3000 } },
      { ts: 5, type: "classify_error", interaction: false },
    ]);
    expect(s).toMatchObject({ events: 5, interactions: 1, classifications: 3, avgRoundTripMs: 2000, maxRoundTripMs: 3000 });
  });
  it("sin latencias", () => expect(summarizeLog([]).avgRoundTripMs).toBeNull());
});

import { describe, expect, it } from "vitest";
import { applyClassification, applyManual, applyPending, badgeFor, computeSummary, createProgress, doneCount, finishProgress, formatDuration } from "../session";
import type { ClassifyResponse } from "../types";

const resp = (status: ClassifyResponse["status"]): ClassifyResponse => ({
  mission_id: "leaf",
  status,
  scores: { leaf: 0.6 },
  target_score: 0.6,
  model: { name: "m", license: "l" },
  latency_ms: 100,
});

describe("session", () => {
  it("crea progreso con 3 misiones pendientes", () => {
    const p = createProgress(1000);
    expect(Object.keys(p.missions)).toHaveLength(3);
    expect(Object.values(p.missions).every((m) => m.status === "todo")).toBe(true);
  });
  it("aplica clasificación e incrementa intentos sin mutar", () => {
    const p = createProgress(0);
    const q = applyClassification(p, "leaf", resp("inconclusive"), "ph1", 5);
    expect(p.missions.leaf.status).toBe("todo");
    expect(q.missions.leaf).toMatchObject({ status: "inconclusive", attempts: 1, photoId: "ph1" });
    expect(applyClassification(q, "leaf", resp("confirmed"), "ph2", 6).missions.leaf.attempts).toBe(2);
  });
  it("pendiente conserva foto y limpia scores", () => {
    let p = applyClassification(createProgress(0), "leaf", resp("unconfirmed"), "a", 1);
    p = applyPending(p, "leaf", "b", 2);
    expect(p.missions.leaf).toMatchObject({ status: "pending_upload", photoId: "b", targetScore: undefined });
  });
  it("marcado manual nunca cuenta como verificado", () => {
    const p = applyManual(createProgress(0), "roots", 3);
    const s = computeSummary(p, 10);
    expect(s).toMatchObject({ verified: 0, manual: 1, pending: 2, badge: "manual" });
    expect(doneCount(p)).toBe(1);
  });
  it("insignias", () => {
    expect(badgeFor(3, 0, 3)).toBe("full");
    expect(badgeFor(1, 2, 3)).toBe("some");
    expect(badgeFor(0, 1, 3)).toBe("manual");
    expect(badgeFor(0, 0, 3)).toBe("none");
  });
  it("duración usa endedAt al terminar", () => {
    const p = finishProgress(createProgress(1000), 61_000);
    expect(computeSummary(p, 999_999).durationMs).toBe(60_000);
    expect(finishProgress(p, 70_000).endedAt).toBe(61_000);
  });
  it("formatDuration", () => {
    expect(formatDuration(65_000)).toBe("1:05");
    expect(formatDuration(0)).toBe("0:00");
  });
});

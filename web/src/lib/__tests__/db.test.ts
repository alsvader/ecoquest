import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { MAX_LOGS, appendLog, clearAll, getLogs, getPhoto, getProgress, savePhoto, saveProgress } from "../db";
import { createProgress } from "../session";

describe("IndexedDB", () => {
  beforeEach(() => clearAll());

  it("guarda y lee progreso, fotos y registro", async () => {
    await saveProgress(createProgress(42));
    await savePhoto({ id: "p1", missionId: "leaf", blob: new Blob(["x"]), createdAt: 1 });
    await appendLog({ ts: 1, type: "tap", interaction: true });
    expect((await getProgress())?.startedAt).toBe(42);
    expect((await getPhoto("p1"))?.missionId).toBe("leaf");
    expect(await getLogs()).toHaveLength(1);
  });

  it("clearAll borra todo (progreso, fotos y registro)", async () => {
    await saveProgress(createProgress(1));
    await savePhoto({ id: "p1", missionId: "leaf", blob: new Blob(["x"]), createdAt: 1 });
    await appendLog({ ts: 1, type: "tap", interaction: true });
    await clearAll();
    expect(await getProgress()).toBeNull();
    expect(await getPhoto("p1")).toBeUndefined();
    expect(await getLogs()).toHaveLength(0);
  });

  it("appendLog conserva solo las últimas MAX_LOGS entradas", async () => {
    for (let i = 0; i < MAX_LOGS + 5; i++) await appendLog({ ts: i, type: "tap", interaction: true });
    const logs = await getLogs();
    expect(logs).toHaveLength(MAX_LOGS);
    expect(logs[0].ts).toBe(5);
  });

  it("getProgress devuelve null si el dato guardado es inválido", async () => {
    await saveProgress({ id: "current", expeditionId: "x", startedAt: 1, missions: {} } as never);
    expect(await getProgress()).toBeNull();
  });
});

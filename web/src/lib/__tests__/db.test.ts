import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { appendLog, clearAll, getLogs, getPhoto, getProgress, savePhoto, saveProgress } from "../db";
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
    expect(await getProgress()).toBeUndefined();
    expect(await getPhoto("p1")).toBeUndefined();
    expect(await getLogs()).toHaveLength(0);
  });
});

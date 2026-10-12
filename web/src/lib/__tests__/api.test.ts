import { describe, expect, it, vi } from "vitest";
import { ApiError, classifyMock, classifyReal, isRetryableError, mockStatus, parseClassifyResponse } from "../api";

const okBody = {
  mission_id: "flower",
  status: "confirmed",
  scores: { flower: 0.62, leaf: 0.11, roots: 0.03, distractor: 0.24 },
  target_score: 0.62,
  model: { name: "google/siglip2-base-patch16-256", license: "apache-2.0" },
  latency_ms: 840,
};
const blob = new Blob(["abc"], { type: "image/jpeg" });
const resp = (status: number, body: unknown) =>
  Promise.resolve(new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } }));

describe("parseClassifyResponse", () => {
  it("acepta el contrato", () => expect(parseClassifyResponse(okBody).status).toBe("confirmed"));
  it("rechaza estado inválido", () => expect(() => parseClassifyResponse({ ...okBody, status: "maybe" })).toThrow(ApiError));
  it("rechaza mission_id inválido", () => expect(() => parseClassifyResponse({ ...okBody, mission_id: "x" })).toThrow(ApiError));
  it("rechaza null", () => expect(() => parseClassifyResponse(null)).toThrow(ApiError));
});

describe("classifyReal", () => {
  it("envía multipart a /classify con image y mission_id", async () => {
    const f = vi.fn(() => resp(200, okBody));
    const r = await classifyReal(blob, "flower", f as unknown as typeof fetch, "http://api.test");
    expect(r.target_score).toBe(0.62);
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("http://api.test/classify");
    expect(init.method).toBe("POST");
    const form = init.body as FormData;
    expect(form.get("mission_id")).toBe("flower");
    expect(form.get("image")).toBeInstanceOf(Blob);
  });
  it.each([
    [400, "bad_request", false],
    [429, "rate_limit", true],
    [500, "server", true],
  ])("HTTP %i -> %s", async (status, kind, retryable) => {
    const f = vi.fn(() => resp(status, { error: "boom" }));
    const err = await classifyReal(blob, "leaf", f as unknown as typeof fetch, "http://x").catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err.kind).toBe(kind);
    expect(err.message).toBe("boom");
    expect(isRetryableError(err)).toBe(retryable);
  });
  it("fallo de red -> network (reintentable)", async () => {
    const f = vi.fn(() => Promise.reject(new TypeError("fail")));
    const err = await classifyReal(blob, "leaf", f as unknown as typeof fetch, "http://x").catch((e) => e);
    expect(err.kind).toBe("network");
    expect(isRetryableError(err)).toBe(true);
  });
  it("respuesta 200 con forma inválida", async () => {
    const f = vi.fn(() => resp(200, { nope: 1 }));
    const err = await classifyReal(blob, "leaf", f as unknown as typeof fetch, "http://x").catch((e) => e);
    expect(err.kind).toBe("invalid_response");
  });
});

describe("classifyMock", () => {
  it("cumple el contrato y suma ~1", async () => {
    const r = await classifyMock(blob, "roots", "confirmed.jpg", 0);
    expect(parseClassifyResponse(r).status).toBe("confirmed");
    const sum = Object.values(r.scores).reduce((a, b) => a + (b ?? 0), 0);
    expect(sum).toBeCloseTo(1, 5);
    expect(r.scores.roots).toBe(r.target_score);
  });
  it.each([["inconclusive.jpg", "inconclusive"], ["unconfirmed.jpg", "unconfirmed"]])("%s", async (name, status) => {
    expect((await classifyMock(blob, "leaf", name, 0)).status).toBe(status);
  });
  it("error en el nombre simula caída de red", async () => {
    await expect(classifyMock(blob, "leaf", "error.jpg", 0)).rejects.toMatchObject({ kind: "network" });
  });
  it("umbrales del mock", () => {
    expect(mockStatus(0.5)).toBe("confirmed");
    expect(mockStatus(0.3)).toBe("inconclusive");
    expect(mockStatus(0.29)).toBe("unconfirmed");
  });
});

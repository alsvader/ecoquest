import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ImageError, compressImage } from "../image";

const original = new Blob(["original-with-exif"], { type: "image/jpeg" });
const reencoded = new Blob(["x"], { type: "image/jpeg" });

function stubBrowser(opts: { bitmap?: boolean; ctx?: boolean; blob?: Blob | null }) {
  const close = vi.fn();
  vi.stubGlobal(
    "createImageBitmap",
    opts.bitmap === false ? vi.fn().mockRejectedValue(new Error("bad")) : vi.fn().mockResolvedValue({ width: 4000, height: 2000, close }),
  );
  const canvas = {
    width: 0,
    height: 0,
    getContext: () => (opts.ctx === false ? null : { drawImage: vi.fn() }),
    toBlob: (cb: (b: Blob | null) => void) => cb(opts.blob === undefined ? reencoded : opts.blob),
  };
  vi.stubGlobal("document", { createElement: () => canvas });
  return { canvas, close };
}

describe("compressImage", () => {
  beforeEach(() => vi.unstubAllGlobals());
  afterEach(() => vi.unstubAllGlobals());

  it("devuelve siempre el blob recodificado, aunque sea mayor que el original", async () => {
    const big = new Blob(["y".repeat(500)], { type: "image/jpeg" });
    const { canvas, close } = stubBrowser({ blob: big });
    const out = await compressImage(original);
    expect(out).toBe(big);
    expect(out).not.toBe(original);
    expect(canvas.width).toBe(1024);
    expect(canvas.height).toBe(512);
    expect(close).toHaveBeenCalled();
  });
  it("rechaza si no se puede decodificar (no devuelve el original)", async () => {
    stubBrowser({ bitmap: false });
    await expect(compressImage(original)).rejects.toMatchObject({ name: "ImageError", kind: "decode" });
  });
  it("rechaza sin contexto 2D", async () => {
    stubBrowser({ ctx: false });
    const err = await compressImage(original).catch((e) => e);
    expect(err).toBeInstanceOf(ImageError);
    expect(err.kind).toBe("canvas");
  });
  it("rechaza si toBlob devuelve null", async () => {
    stubBrowser({ blob: null });
    await expect(compressImage(original)).rejects.toMatchObject({ kind: "encode" });
  });
});

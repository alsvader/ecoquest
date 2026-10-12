// Renderiza cuadros sueltos para revisar la composición sin rehacer el bundle por cada cuadro.
// Uso: node scripts/stills.mjs 120 480 900   → out/stills/f-0120.png …
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out", "stills");
mkdirSync(out, { recursive: true });
const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: join(root, "src", "index.ts"), publicDir: join(root, "public") });
const inputProps = { music: false };
const composition = await selectComposition({ serveUrl, id: "EcoQuestPromo", inputProps });
for (const frame of frames) {
  const output = join(out, `f-${String(frame).padStart(4, "0")}.png`);
  await renderStill({ composition, serveUrl, frame, output, inputProps });
  console.log(output);
}

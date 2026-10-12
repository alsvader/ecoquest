// Copia las fotos de prueba (Wikimedia Commons) que usa el video. No se versionan: ver .gitignore y CREDITS.md.
// Si faltan, descárgalas primero: cd inference && python scripts/download_samples.py samples_external
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "..", "inference", "samples_external");
const out = join(root, "public", "photos");
mkdirSync(out, { recursive: true });

const PHOTOS = { "leaf.jpg": "leaf/leaf_08.jpg", "flower.jpg": "flower/flower_10.jpg", "roots.jpg": "roots/roots_01.jpg" };
for (const [name, rel] of Object.entries(PHOTOS)) {
  const from = join(src, rel);
  if (!existsSync(from)) throw new Error(`Falta ${from}. Descarga las muestras (ver comentario arriba).`);
  copyFileSync(from, join(out, name));
  console.log(`${rel} → public/photos/${name}`);
}

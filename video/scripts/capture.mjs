// Capturas reales de la landing y de la app para el video (Playwright · Chromium headless).
// Requiere el stack corriendo (docker compose up -d) en http://localhost:3000 y las fotos en public/photos
// (npm run photos). Uso: npm run capture   ·   BASE_URL=http://localhost:3000 npm run capture
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "public", "shots");
const PHOTOS = join(root, "public", "photos");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
mkdirSync(OUT, { recursive: true });

const NO_MOTION = "*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}";

async function settle(page, ms = 700) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(ms);
}

// CHROME=/ruta/a/chrome para reutilizar un Chromium ya instalado en vez de `npx playwright install`.
const browser = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});

// ── Landing · escritorio 1440×900 @2x (con sus animaciones de entrada terminadas) ──
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await settle(page, 3000);
  await page.screenshot({ path: join(OUT, "landing-hero.png") });
  await page.addStyleTag({ content: "header{position:static!important}" });
  for (const id of ["problema", "como-se-juega", "expedicion", "ia-abierta", "principios", "stack", "roadmap"]) {
    const el = page.locator(`#${id}`);
    if ((await el.count()) === 0) continue;
    await el.scrollIntoViewIfNeeded();
    await settle(page, 1800);
    await el.screenshot({ path: join(OUT, `landing-${id}.png`) });
    console.log("landing", id);
  }
  await ctx.close();
}

// ── Landing · página completa a 1x (para el paneo vertical) ──────────────────
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.addStyleTag({ content: NO_MOTION + "header{position:static!important}" });
  await settle(page, 1000);
  await page.screenshot({ path: join(OUT, "landing-full.png"), fullPage: true });
  await ctx.close();
}

// ── App móvil 390×844 @3x · flujo real contra el servicio de inferencia ──────
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  const shot = async (name, full = false) => {
    await settle(page, 500);
    await page.screenshot({ path: join(OUT, `app-${name}.png`), fullPage: full });
    console.log("app", name);
  };

  await page.goto(BASE + "/jugar", { waitUntil: "networkidle" });
  await page.addStyleTag({ content: NO_MOTION });
  await page.getByRole("button", { name: "¡Comenzar!" }).waitFor();
  await shot("01-bienvenida");
  await shot("01-bienvenida-full", true);

  await page.getByRole("button", { name: "¡Comenzar!" }).click();
  await page.waitForURL("**/sesion");
  await shot("02-sesion");

  const results = {};
  for (const id of ["leaf", "flower", "roots"]) {
    await page.goto(`${BASE}/mision/${id}`, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: NO_MOTION });
    await shot(`03-mision-${id}`);
    const resp = page.waitForResponse((r) => r.url().includes("/classify"), { timeout: 60_000 });
    await page.getByTestId("camera-input").setInputFiles(join(PHOTOS, `${id}.jpg`));
    const r = await resp;
    results[id] = await r.json().catch(() => null);
    await page.getByRole("button", { name: "Seguir explorando" }).waitFor({ timeout: 30_000 }).catch(() => {});
    await shot(`05-resultado-${id}`);
    await shot(`05-resultado-${id}-full`, true);
  }
  writeFileSync(join(OUT, "classify-results.json"), JSON.stringify(results, null, 2));
  console.log("classify", JSON.stringify(results));

  await page.goto(BASE + "/sesion", { waitUntil: "networkidle" });
  await page.addStyleTag({ content: NO_MOTION });
  await shot("06-sesion-completa");

  // El resumen solo existe al terminar la expedición.
  await page.getByRole("button", { name: "Terminar expedición" }).click();
  // Con misiones pendientes pide confirmación; con las tres completas va directo.
  const yes = page.getByRole("button", { name: "Sí, terminar" });
  await Promise.race([page.waitForURL("**/resumen"), yes.click()]).catch(() => {});
  await page.waitForURL("**/resumen");
  await page.addStyleTag({ content: NO_MOTION });
  await shot("07-resumen");
  await shot("07-resumen-full", true);
  await ctx.close();
}

await browser.close();

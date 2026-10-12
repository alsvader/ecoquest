// Banda sonora chiptune original + efectos, sintetizada aquí mismo (sin muestras ni licencias de terceros).
// 120 BPM, La menor (Am–F–C–G), sincronizada con src/timeline.json. Uso: npm run music → public/audio/soundtrack.wav
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import timeline from "../src/timeline.json" with { type: "json" };

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SR = 44100;
const FPS = timeline.fps;
const BEAT = 60 / timeline.bpm; // s
const BAR = BEAT * 4;
const STARTS = {};
let acc = 0;
for (const s of timeline.scenes) {
  STARTS[s.id] = acc / FPS;
  acc += s.frames;
}
const TOTAL = acc / FPS;
const f2s = (f) => f / FPS;
const N = Math.ceil((TOTAL + 0.5) * SR);
const L = new Float32Array(N);
const R = new Float32Array(N);
const duck = new Float32Array(N).fill(1); // sidechain del bombo

// ── PRNG determinista ────────────────────────────────────────────────────────
let seed = 1337;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const midi = (m) => 440 * 2 ** ((m - 69) / 12);

// ── Osciladores y envolventes ────────────────────────────────────────────────
const wave = {
  square: (p, duty = 0.5) => ((p % 1) < duty ? 1 : -1),
  tri: (p) => 1 - 4 * Math.abs((p % 1) - 0.5),
  saw: (p) => 2 * (p % 1) - 1,
  sine: (p) => Math.sin(2 * Math.PI * p),
};

function put(i, v, pan = 0, sc = 0) {
  if (i < 0 || i >= N) return;
  const g = sc ? 1 - sc + sc * duck[i] : 1;
  L[i] += v * g * Math.min(1, 1 - pan);
  R[i] += v * g * Math.min(1, 1 + pan);
}

/** Nota con ataque/caída, deslizamiento opcional, vibrato y filtro paso bajo de un polo. */
function tone(t, dur, freq, { type = "square", vol = 0.2, duty = 0.5, attack = 0.005, release = 0.05, pan = 0, slideTo, vibrato = 0, lp = 0, sc = 0, detune = 0 } = {}) {
  const i0 = Math.floor(t * SR);
  const n = Math.floor((dur + release) * SR);
  let phase = 0;
  let y = 0;
  const a = lp ? 1 - Math.exp((-2 * Math.PI * lp) / SR) : 1;
  for (let k = 0; k < n; k++) {
    const tt = k / SR;
    const f0 = slideTo ? freq * (slideTo / freq) ** Math.min(1, tt / dur) : freq;
    const f = f0 * (1 + vibrato * Math.sin(2 * Math.PI * 5.5 * tt) * Math.min(1, tt / 0.15)) * (1 + detune);
    phase += f / SR;
    let env = tt < attack ? tt / attack : tt < dur ? 1 : Math.max(0, 1 - (tt - dur) / release);
    const x = wave[type](phase, duty) * env;
    y += a * (x - y);
    put(i0 + k, y * vol, pan, sc);
  }
}

/** Ruido con envolvente exponencial y filtros simples (hats, caja, golpes). */
function noise(t, dur, { vol = 0.2, decay = 30, hp = 0, lp = 0, pan = 0, sc = 0, lpTo } = {}) {
  const i0 = Math.floor(t * SR);
  const n = Math.floor(dur * SR);
  let yl = 0;
  let prev = 0;
  let yh = 0;
  for (let k = 0; k < n; k++) {
    const tt = k / SR;
    const cut = lpTo ? lp * (lpTo / lp) ** (tt / dur) : lp;
    const a = cut ? 1 - Math.exp((-2 * Math.PI * cut) / SR) : 1;
    let x = rnd();
    yl += a * (x - yl);
    x = cut ? yl : x;
    if (hp) {
      const rc = 1 / (2 * Math.PI * hp);
      const al = rc / (rc + 1 / SR);
      yh = al * (yh + x - prev);
      prev = x;
      x = yh;
    }
    put(i0 + k, x * vol * Math.exp(-decay * tt), pan, sc);
  }
}

// ── Batería ──────────────────────────────────────────────────────────────────
function kick(t, vol = 0.9) {
  tone(t, 0.22, 150, { type: "sine", vol, slideTo: 42, release: 0.08 });
  noise(t, 0.02, { vol: 0.25, decay: 200, lp: 3000 });
  const i0 = Math.floor(t * SR);
  for (let k = 0; k < 0.28 * SR; k++) {
    const d = 1 - 0.65 * Math.exp((-k / SR) * 9) * Math.min(1, k / (0.004 * SR));
    if (i0 + k < N) duck[i0 + k] = Math.min(duck[i0 + k], d);
  }
}
const snare = (t, vol = 0.32) => {
  noise(t, 0.22, { vol, decay: 18, hp: 900, lp: 7000 });
  tone(t, 0.06, 190, { type: "tri", vol: vol * 0.7, slideTo: 140, release: 0.04 });
};
const hat = (t, vol = 0.07, open = false) => noise(t, open ? 0.18 : 0.05, { vol, decay: open ? 14 : 70, hp: 7000, pan: 0.25 });

// ── Armonía ──────────────────────────────────────────────────────────────────
const CHORDS = [
  { root: 45, tones: [69, 72, 76] }, // Am
  { root: 41, tones: [65, 69, 72] }, // F
  { root: 48, tones: [67, 72, 76] }, // C
  { root: 43, tones: [67, 71, 74] }, // G
];
const chordAt = (t) => CHORDS[Math.floor(t / BAR + 1e-6) % 4];

// Motivo de la melodía (La menor pentatónica), corcheas; null = silencio, "-" = liga.
const MOTIF = [
  [76, null, 79, 81, "-", 79, 76, 74],
  [72, "-", 74, 76, "-", "-", 74, 72],
  [69, null, 72, 74, "-", 76, 79, 81],
  [79, "-", 76, 74, "-", "-", "-", null],
];

function bars(fromS, toS, fn) {
  const b0 = Math.round(fromS / BAR);
  const b1 = Math.round(toS / BAR);
  for (let b = b0; b < b1; b++) fn(b * BAR, b);
}

function groove(fromS, toS, { kickOn = true, snareOn = true, hats = true, bass = true, arp = true, pad = true, lead = false, fill = true } = {}) {
  bars(fromS, toS, (t, b) => {
    const ch = chordAt(t);
    if (pad) for (const m of ch.tones) for (const d of [-0.006, 0.006]) tone(t, BAR - 0.05, midi(m - 12), { type: "saw", vol: 0.028, attack: 0.25, release: 0.4, lp: 1400, detune: d, pan: d * 60, sc: 0.6 });
    for (let s = 0; s < 4; s++) {
      const tb = t + s * BEAT;
      if (kickOn) kick(tb);
      if (snareOn && (s === 1 || s === 3)) snare(tb);
      if (hats) {
        hat(tb + BEAT / 2, 0.075, s === 3);
        hat(tb + BEAT / 4, 0.03);
        hat(tb + (3 * BEAT) / 4, 0.03);
      }
    }
    if (bass)
      for (let e = 0; e < 8; e++) {
        const m = ch.root + (e % 4 === 2 ? 12 : 0) + (e === 7 ? 7 : 0);
        tone(t + (e * BEAT) / 2, BEAT / 2 - 0.04, midi(m), { type: "square", duty: 0.5, vol: 0.13, lp: 700, release: 0.02, sc: 0.8 });
      }
    if (arp)
      for (let x = 0; x < 16; x++) {
        const tones = ch.tones;
        const m = tones[[0, 1, 2, 1][x % 4]] + (x >= 8 ? 12 : 0);
        const tt = t + (x * BEAT) / 4;
        const pan = x % 2 ? 0.35 : -0.35;
        tone(tt, BEAT / 4 - 0.02, midi(m), { type: "square", duty: 0.25, vol: 0.045, release: 0.03, lp: 3500, pan, sc: 0.5 });
        tone(tt + (3 * BEAT) / 4, BEAT / 4 - 0.02, midi(m), { type: "square", duty: 0.25, vol: 0.016, release: 0.03, lp: 2200, pan: -pan, sc: 0.5 }); // eco
      }
    if (lead) {
      const row = MOTIF[b % 4];
      for (let e = 0; e < 8; e++) {
        const n = row[e];
        if (typeof n !== "number") continue;
        let len = 1;
        while (row[e + len] === "-") len++;
        tone(t + (e * BEAT) / 2, (len * BEAT) / 2 - 0.03, midi(n), { type: "square", duty: 0.125, vol: 0.075, vibrato: 0.006, release: 0.08, lp: 4200, pan: 0.05 });
        tone(t + (e * BEAT) / 2 + BEAT * 0.75, (len * BEAT) / 2 - 0.03, midi(n), { type: "square", duty: 0.125, vol: 0.022, release: 0.08, lp: 2500, pan: -0.4 });
      }
    }
    // Redoble al final de cada 4 compases
    if (fill && snareOn && b % 4 === 3) for (let k = 0; k < 4; k++) snare(t + BAR - BEAT + (k * BEAT) / 4, 0.16 + k * 0.05);
  });
}

// ── Efectos ──────────────────────────────────────────────────────────────────
// Envolvente creciente e^(3t/dur): se escala por 1/20 para que el pico quede en `vol`.
const whoosh = (tEnd, dur = 0.45, vol = 0.22) => noise(tEnd - dur, dur, { vol: vol / 20, decay: -3 / dur, lp: 400, lpTo: 9000 });
function impact(t, vol = 1) {
  tone(t, 0.5, 70, { type: "sine", vol: 0.55 * vol, slideTo: 32, release: 0.3 });
  noise(t, 0.35, { vol: 0.28 * vol, decay: 9, lp: 2500 });
}
const blip = (t, m, vol = 0.09, d = 0.07) => tone(t, d, midi(m), { type: "square", duty: 0.25, vol, release: 0.02 });
function coin(t) {
  tone(t, 0.08, midi(83), { type: "square", duty: 0.5, vol: 0.12, release: 0.01 });
  tone(t + 0.08, 0.38, midi(88), { type: "square", duty: 0.5, vol: 0.12, release: 0.2 });
}
function shutter(t) {
  noise(t, 0.04, { vol: 0.4, decay: 80, hp: 1500 });
  noise(t + 0.07, 0.05, { vol: 0.3, decay: 70, hp: 2500 });
}
function riser(t0, t1, vol = 0.12) {
  noise(t0, t1 - t0, { vol: vol / 20, decay: -3 / (t1 - t0), lp: 300, lpTo: 8000 });
  tone(t0, t1 - t0, 220, { type: "saw", vol: vol * 0.25, slideTo: 1760, release: 0.02, lp: 3000 });
}
function glitch(t, vol = 0.12) {
  for (let k = 0; k < 6; k++) tone(t + k * 0.03, 0.022, midi(60 + Math.floor(Math.abs(rnd()) * 36)), { type: "square", duty: 0.5, vol, release: 0.004 });
}
function startJingle(t) {
  [72, 76, 79, 84, 88].forEach((m, i) => blip(t + i * 0.05, m, 0.1, 0.05));
}
function fanfare(t) {
  [72, 76, 79].forEach((m, i) => tone(t + i * 0.11, 0.09, midi(m), { type: "square", duty: 0.25, vol: 0.12, release: 0.02 }));
  for (const m of [72, 76, 79, 84]) tone(t + 0.33, 0.7, midi(m), { type: "square", duty: 0.25, vol: 0.06, vibrato: 0.008, release: 0.4 });
}

// ── Arreglo, escena por escena ───────────────────────────────────────────────
const S = STARTS;
// Intro: "press start" casi en silencio → arranque del ritmo en el compás 1.
for (let k = 0; k < 2; k++) blip(k * 0.2, 81, 0.05, 0.05);
tone(0, BAR - 0.3, midi(57), { type: "saw", vol: 0.04, attack: 0.6, release: 0.3, lp: 600 });
startJingle(f2s(28));
riser(f2s(30), BAR, 0.08);
groove(BAR, S.problem, { lead: true });
impact(f2s(54), 0.8);

// Problema: tensión (sin melodía), golpes en los «slams».
groove(S.problem, S.how, { arp: true, lead: false });
impact(S.problem + f2s(33));
glitch(S.problem + f2s(120));
impact(S.problem + f2s(122), 0.6);
impact(S.problem + f2s(168));
// Cómo se juega + landing + misiones: groove completo con melodía.
groove(S.how, S.landing, { lead: true });
[0, 1, 2].forEach((i) => blip(S.how + f2s(30 + i * 15 + 5), 76 + i * 3, 0.08));
groove(S.landing, S.missions, { lead: false });
groove(S.missions, S.flow, { lead: true });
[0, 1, 2].forEach((i) => blip(S.missions + f2s(45 + i * 15 + 5), 72 + i * 4, 0.08));

// Flujo de la app: cámara, análisis, coincidencia.
groove(S.flow, S.flow + 3 * BAR, { lead: false });
groove(S.flow + 3 * BAR, S.ai, { lead: false, kickOn: true, snareOn: false });
[60, 120, 165, 255].forEach((f) => whoosh(S.flow + f2s(f), 0.25, 0.12));
shutter(S.flow + f2s(180));
for (let k = 0; k < 10; k++) blip(S.flow + f2s(192) + k * 0.2, 84 + (k % 2) * 7, 0.035, 0.04);
coin(S.flow + f2s(258));
impact(S.flow + f2s(300), 0.7);
fanfare(S.flow + f2s(330));

// IA: quiebre (sin bombo) → subida → regresa todo en la respuesta real.
groove(S.ai, S.ai + 2 * BAR, { kickOn: false, snareOn: false, bass: false, lead: false });
groove(S.ai + 2 * BAR, S.ai + f2s(150), { kickOn: false, snareOn: false, lead: false, fill: false });
riser(S.ai + f2s(100), S.ai + f2s(150), 0.12);
whoosh(S.ai + f2s(104), 0.9, 0.1);
blip(S.ai + f2s(110), 88, 0.07);
impact(S.ai + f2s(150));
groove(S.ai + f2s(150), S.badge, { lead: false });

// Insignia: fanfarria + melodía.
groove(S.badge, S.principles, { lead: true });
fanfare(S.badge + f2s(30));
impact(S.badge + f2s(30), 0.7);

// Principios: un golpe por etiqueta.
groove(S.principles, S.outro, { lead: false });
for (let i = 0; i < 6; i++) blip(S.principles + f2s(24 + i * 15 + 4), 72 + [0, 3, 5, 7, 10, 12][i], 0.09, 0.09);

// Cierre: todo arriba; corte seco al cerrarse el nivel; campanita final.
groove(S.outro, S.outro + f2s(200), { lead: true });
impact(S.outro + f2s(34));
whoosh(S.outro + f2s(222), 0.6, 0.18);
[84, 88, 91, 96].forEach((m, i) => tone(S.outro + f2s(222) + i * 0.07, 1.2 - i * 0.07, midi(m), { type: "square", duty: 0.25, vol: 0.05, vibrato: 0.006, release: 1.2 }));

// Transiciones de escena: barrido de ruido que termina en cada corte.
for (const s of timeline.scenes.slice(1)) whoosh(STARTS[s.id], 0.42, 0.13);

// ── Master: saturación suave + normalizado a ≈ -14 LUFS ─────────────────────────
let peak = 0;
for (let i = 0; i < N; i++) {
  L[i] = Math.tanh(L[i] * 0.5);
  R[i] = Math.tanh(R[i] * 0.5);
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const gain = 0.64 / peak; // ≈ -14 LUFS integrado (estándar de YouTube/redes)
const out = Buffer.alloc(44 + N * 4);
out.write("RIFF", 0);
out.writeUInt32LE(36 + N * 4, 4);
out.write("WAVEfmt ", 8);
out.writeUInt32LE(16, 16);
out.writeUInt16LE(1, 20);
out.writeUInt16LE(2, 22);
out.writeUInt32LE(SR, 24);
out.writeUInt32LE(SR * 4, 28);
out.writeUInt16LE(4, 32);
out.writeUInt16LE(16, 34);
out.write("data", 36);
out.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  // Fundido de salida de 0.5 s al final del video
  const fade = Math.min(1, (N - i) / (0.5 * SR));
  out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i] * gain * fade)) * 32767), 44 + i * 4);
  out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i] * gain * fade)) * 32767), 46 + i * 4);
}
mkdirSync(join(root, "public", "audio"), { recursive: true });
writeFileSync(join(root, "public", "audio", "soundtrack.wav"), out);
console.log(`soundtrack.wav · ${TOTAL.toFixed(2)} s · pico previo ${peak.toFixed(2)}`);

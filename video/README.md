# video/ — promo en motion design

Video promocional de EcoQuest (1920×1080, 30 fps, ~76 s) para el reto **Touch Grass** de Hacktoberfest 2026. Está hecho con [Remotion](https://www.remotion.dev/) (React → video) y usa capturas **reales** de la landing y de la app, además de la respuesta real del servicio de inferencia (SigLIP2).

El texto del video está en inglés (la publicación en DEV es en inglés); las capturas de la app quedan en español, como la app.

## Escenas

| # | Escena | Qué muestra |
|---|---|---|
| 1 | `intro` | «Press start» → logotipo pixel, lema y stickers |
| 2 | `problem` | Tiempo en pantalla vs. tiempo afuera |
| 3 | `how` | Las tres reglas del juego + barra de EXP |
| 4 | `landing` | La landing en un navegador 3D con desplazamiento |
| 5 | `missions` | Expedición piloto «Descubre el Edén» y sus 3 misiones |
| 6 | `flow` | Flujo completo en el teléfono: bienvenida → misiones → cámara → análisis → coincidencia |
| 7 | `ai` | Arquitectura (PWA → FastAPI → SigLIP2), respuesta real de `/classify` y umbrales |
| 8 | `badge` | Resumen e insignia |
| 9 | `principles` | Sin cuentas, sin ubicación precisa, código y modelo abiertos |
| 10 | `outro` | «Put the phone away. The park is the level.» + repo |

Duración y orden de las escenas: `src/timeline.json` (lo leen el video y el generador de música). Todo está alineado a 120 BPM: un tiempo = 15 cuadros.

## Uso

Requiere Node 20+ (Remotion trae su propio ffmpeg).

```bash
cd video
npm install
npm run photos        # copia 3 fotos de prueba desde inference/samples_external (no se versionan)
npm run capture       # capturas reales; requiere `docker compose up -d` en la raíz (http://localhost:3000)
npm run music         # sintetiza la banda sonora → public/audio/soundtrack.wav
npm run studio        # vista previa interactiva
npm run render        # → out/ecoquest-promo.mp4
```

- Si faltan las fotos de prueba: `cd inference && python scripts/download_samples.py samples_external`.
- `npm run capture` usa el Chromium de Playwright; para reutilizar uno ya instalado: `CHROME=/ruta/a/chrome npm run capture`.
- Sin música: `npx remotion render src/index.ts EcoQuestPromo out/sin-musica.mp4 --props='{"music":false}'`.
- Cuadros sueltos para revisar: `npm run stills -- 120 600 1300` → `out/stills/`.

## Música y efectos

`scripts/make-music.mjs` genera una pista chiptune original (La menor, Am–F–C–G) y los efectos (obturador, «coin» de coincidencia, fanfarria de la insignia, golpes y barridos en cada corte) con osciladores y ruido, sin muestras de terceros. Queda a ≈ −14 LUFS. Si prefieres otra música, reemplaza `public/audio/soundtrack.wav` (misma duración) o renderiza sin música y edítala aparte.

## Créditos de las fotos de prueba

Las fotos que aparecen en la cámara, en las capturas de resultado y en la escena de IA son de Wikimedia Commons (ver `inference/samples_external/ATTRIBUTION.csv`):

- Hoja: *Zen of a Raindrop – Colocasia Leaf Beauty*, Mandu joshi, CC0.
- Flor: *Barbados Heliconia psittacorum Parrot Heliconia 1209*, ImagePerson, CC BY 4.0.
- Raíces: *Rubber fig (Ficus elastica) aerial roots*, David E Mead, CC0.

El video también lo indica en la escena final. Son fotos de internet, no del parque: la prueba en exteriores en Villahermosa sigue pendiente.

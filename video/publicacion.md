# Publicación en YouTube

Contenido listo para copiar al subir `out/ecoquest-promo.mp4` en [YouTube Studio](https://studio.youtube.com). El video está en inglés, así que el título y la descripción principales también; abajo va una traducción al español para la sección **Traducciones** de YouTube.

Antes de publicar, reemplaza `DEV_POST_URL` por el enlace del post en DEV (o borra esa línea si aún no está publicado). Después de subir el video, copia su ID al post (`{% youtube VIDEO_ID %}` en `post_hacktoberfest.md`).

## Archivos

| Qué | Archivo |
|---|---|
| Video (1920×1080, 30 fps, 76 s, H.264 + AAC) | `out/ecoquest-promo.mp4` (`npm run render`) |
| Miniatura (1280×720) | `out/thumbnail.png` (cuadro 170 del video) |

La miniatura personalizada requiere que el canal esté verificado por teléfono. Si no lo está, elige en Studio el cuadro del logotipo (alrededor del segundo 6).

## Título

Máximo 100 caracteres.

```text
EcoQuest: Put the Phone Away, the Park Is the Level | Hacktoberfest 2026 · Touch Grass
```

Alternativa más corta:

```text
EcoQuest: an open-weight AI that checks your park discoveries
```

## Descripción

```text
EcoQuest turns a walk in the park into an expedition: pick a mission, put your phone away, and photograph only what you find. An open-weight AI model (SigLIP2) checks if the photo matches the mission. No accounts, no precise location.

Hacktoberfest 2026 · Touch Grass challenge. Real app screenshots and real model output; not footage from the park (outdoor test pending).

Code: https://github.com/alsvader/ecoquest
DEV: DEV_POST_URL

0:00 Intro
0:14 How to play
0:28 The app, step by step
0:46 Open-weight AI (SigLIP2)
0:56 Badge and principles

Photos (Wikimedia Commons): Mandu joshi (CC0), ImagePerson (CC BY 4.0), David E Mead (CC0). Original music.

#Hacktoberfest #OpenSource #TouchGrass
```

Los tres hashtags del final aparecen arriba del título en YouTube; no agregues más de tres o dejan de mostrarse.

## Etiquetas

Campo «Etiquetas» (separadas por comas, máximo 500 caracteres):

```text
EcoQuest, Hacktoberfest, Hacktoberfest 2026, Touch Grass, open source, open-weight AI, SigLIP2, SigLIP, zero-shot classification, computer vision, Hugging Face, FastAPI, Next.js, PWA, Remotion, motion design, nature walk, outdoor app, Villahermosa, Tabasco, DEV challenge
```

## Configuración en Studio

| Campo | Valor |
|---|---|
| Visibilidad | **Oculto** (no listado) para incrustarlo en DEV sin que salga en el canal; **Público** si quieres que se encuentre |
| Público | No, no es contenido para niños |
| Contenido alterado o sintético | **No**: son capturas reales animadas, no personas, lugares ni hechos realistas generados |
| Promoción pagada | No |
| Categoría | Ciencia y tecnología |
| Idioma del video | Inglés |
| Licencia | Licencia estándar de YouTube |
| Permitir insertar | **Sí** (necesario para `{% youtube %}` en DEV) |
| Subtítulos | No hacen falta: el video no tiene narración, todo el texto está en pantalla |
| Pantalla final | Opcional: un elemento de video o de suscripción en los últimos 5–8 s (1:08–1:16), sobre la escena del repositorio |

La música es original, así que no debería activar reclamos de Content ID.

## Traducción al español (Traducciones → Español)

### Título

```text
EcoQuest: guarda el teléfono, el parque es el nivel | Hacktoberfest 2026 · Touch Grass
```

### Descripción

```text
EcoQuest convierte una caminata en el parque en una expedición: eliges una misión, guardas el teléfono y fotografías solo lo que encuentras. Un modelo de IA de pesos abiertos (SigLIP2) revisa si la foto corresponde a la misión. Sin cuentas ni ubicación precisa.

Reto Touch Grass de Hacktoberfest 2026. Capturas reales de la app y respuestas reales del modelo; no es una grabación en el parque (prueba en exteriores pendiente).

Código: https://github.com/alsvader/ecoquest
DEV: DEV_POST_URL

0:00 Intro
0:14 Cómo se juega
0:28 La app, paso a paso
0:46 IA de pesos abiertos (SigLIP2)
0:56 Insignia y principios

Fotos (Wikimedia Commons): Mandu joshi (CC0), ImagePerson (CC BY 4.0), David E Mead (CC0). Música original.

#Hacktoberfest #OpenSource #TouchGrass
```

## Notas

- **Capítulos:** YouTube exige que el primero empiece en 0:00 y que cada uno dure al menos 10 s; por eso algunas escenas del video van agrupadas. Si cambias `src/timeline.json`, recalcula los tiempos (30 cuadros = 1 s).
- **Datos que cambian:** las capturas y la respuesta de `/classify` salen de `npm run capture`. Si las vuelves a tomar, el JSON del video puede cambiar un poco (por ejemplo `latency_ms`), pero la descripción no menciona números, así que sigue siendo válida.

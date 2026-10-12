# Publicación en YouTube, Instagram y TikTok

Contenido listo para copiar al subir `out/ecoquest-promo.mp4` en [YouTube Studio](https://studio.youtube.com) y `out/ecoquest-promo-vertical.mp4` en Instagram Reels y TikTok (secciones al final). El video está en inglés, así que el título y la descripción principales también; abajo va una traducción al español para la sección **Traducciones** de YouTube.

Después de subir el video, copia su ID al post (`{% youtube VIDEO_ID %}` en `post_hacktoberfest.md`).

## Archivos

| Qué | Archivo |
|---|---|
| Video (1920×1080, 30 fps, 76 s, H.264 + AAC) | `out/ecoquest-promo.mp4` (`npm run render`) |
| Miniatura (1280×720) | `out/thumbnail.png` (cuadro 170 del video) |
| Video vertical para Reels y TikTok (1080×1920, 30 fps, 76 s, H.264 + AAC) | `out/ecoquest-promo-vertical.mp4` (`npm run render:vertical`) |
| Portada vertical (1080×1920) | `out/cover-vertical.png` (cuadro 150 del corte vertical) |

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
DEV: https://dev.to/alsvader/ecoquest-put-your-phone-away-and-let-an-open-model-check-your-discoveries-37m4

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
DEV: https://dev.to/alsvader/ecoquest-put-your-phone-away-and-let-an-open-model-check-your-discoveries-37m4

0:00 Intro
0:14 Cómo se juega
0:28 La app, paso a paso
0:46 IA de pesos abiertos (SigLIP2)
0:56 Insignia y principios

Fotos (Wikimedia Commons): Mandu joshi (CC0), ImagePerson (CC BY 4.0), David E Mead (CC0). Música original.

#Hacktoberfest #OpenSource #TouchGrass
```

## Instagram (Reels)

Sube `out/ecoquest-promo-vertical.mp4` como Reel. El pie de foto puede tener hasta 2200 caracteres, pero solo se ven las primeras dos líneas (unos 125 caracteres) antes de «más»: por eso la primera línea dice de qué reto es el proyecto y, en la misma frase, el gancho (que la app quiere que uses menos el teléfono). Los enlaces del pie de foto no se pueden tocar, pero se pueden copiar; por eso van completos. Instagram permite como máximo 5 hashtags por publicación.

### Pie de foto

```text
My Hacktoberfest 2026 project for the Touch Grass challenge: EcoQuest, an app that wants you to use your phone less.

Pick a mission, put your phone away and walk the park. Found a large leaf, a flower or a tree with visible roots? Snap it, and an open-weight AI model (SigLIP2) checks if the photo fits the mission.

No accounts. No precise location. MIT code, Apache-2.0 model.

Real app screenshots and real model output; the outdoor test in Villahermosa is still pending.

Code: https://github.com/alsvader/ecoquest
DEV: https://dev.to/alsvader/ecoquest-put-your-phone-away-and-let-an-open-model-check-your-discoveries-37m4

Photos via Wikimedia Commons: Mandu joshi (CC0), ImagePerson (CC BY 4.0), David E Mead (CC0). Original music.

#Hacktoberfest #OpenSource #TouchGrass #OpenWeightAI #IndieDev
```

### Pie de foto en español (alternativa)

```text
Mi proyecto para el reto Touch Grass de Hacktoberfest 2026: EcoQuest, una app que quiere que uses menos el teléfono.

Elige una misión, guarda el teléfono y recorre el parque. ¿Encontraste una hoja grande, una flor o un árbol con raíces visibles? Tómale una foto y un modelo de IA de pesos abiertos (SigLIP2) revisa si corresponde a la misión.

Sin cuentas. Sin ubicación precisa. Código MIT, modelo Apache-2.0.

Capturas reales de la app y respuestas reales del modelo; la prueba en exteriores en Villahermosa sigue pendiente.

Código: https://github.com/alsvader/ecoquest
DEV: https://dev.to/alsvader/ecoquest-put-your-phone-away-and-let-an-open-model-check-your-discoveries-37m4

Fotos de Wikimedia Commons: Mandu joshi (CC0), ImagePerson (CC BY 4.0), David E Mead (CC0). Música original.

#Hacktoberfest #OpenSource #TouchGrass #OpenWeightAI #IndieDev
```

### Configuración

| Campo | Valor |
|---|---|
| Portada | Sube `out/cover-vertical.png` (o elige el cuadro del logotipo, alrededor del segundo 5). En la cuadrícula del perfil se ve recortada al centro en 3:4, y el logotipo queda dentro |
| Audio | Original (la música es del proyecto); no agregues música de Instagram encima |
| Etiqueta de IA | **No**: son capturas reales animadas, no imágenes generadas |
| Compartir también en Facebook | Opcional |
| Calidad | En la app: Configuración → Uso de datos y calidad multimedia → activa **Subir con la máxima calidad** antes de publicar |

## TikTok

Sube `out/ecoquest-promo-vertical.mp4`. Los enlaces de la descripción tampoco se pueden tocar; van completos para que se puedan copiar. TikTok muestra una o dos líneas sobre el video, así que la descripción es más corta que la de Instagram y empieza igual: el reto y el gancho en la primera línea. Usa de 3 a 5 hashtags.

### Descripción

```text
My Hacktoberfest 2026 project for the Touch Grass challenge: EcoQuest, an app that wants you to use your phone less.

Pick a mission, pocket your phone, explore the park. Snap only what you find and an open-weight AI (SigLIP2) checks it. No accounts, no precise location.

Real app screenshots and real model output.

Code: https://github.com/alsvader/ecoquest
DEV: https://dev.to/alsvader/ecoquest-put-your-phone-away-and-let-an-open-model-check-your-discoveries-37m4

Photos: Wikimedia Commons (CC0 / CC BY 4.0, credits at the end). Original music.

#Hacktoberfest #OpenSource #TouchGrass #TechTok #AI
```

### Descripción en español (alternativa)

```text
Mi proyecto para el reto Touch Grass de Hacktoberfest 2026: EcoQuest, una app que quiere que uses menos el teléfono.

Elige una misión, guarda el teléfono y explora el parque. Fotografía solo lo que encuentres y una IA de pesos abiertos (SigLIP2) lo revisa. Sin cuentas ni ubicación precisa.

Capturas reales de la app y respuestas reales del modelo.

Código: https://github.com/alsvader/ecoquest
DEV: https://dev.to/alsvader/ecoquest-put-your-phone-away-and-let-an-open-model-check-your-discoveries-37m4

Fotos: Wikimedia Commons (CC0 / CC BY 4.0, créditos al final del video). Música original.

#Hacktoberfest #OpenSource #TouchGrass #TechTok #IA
```

### Configuración

| Campo | Valor |
|---|---|
| Portada | Elige el cuadro del logotipo (alrededor del segundo 5) o sube `out/cover-vertical.png` |
| Sonido | Original; no agregues sonidos de TikTok encima |
| Contenido generado por IA | **No** (mismo motivo que en Instagram) |
| Divulgar contenido / promoción de marca | No |
| Comentarios, dúo y stitch | Permitidos |
| Calidad | Activa **Permitir subidas en alta calidad** (Configuración → Datos o en la pantalla de publicación, según la versión) |

## Notas

- **Capítulos:** YouTube exige que el primero empiece en 0:00 y que cada uno dure al menos 10 s; por eso algunas escenas del video van agrupadas. Si cambias `src/timeline.json`, recalcula los tiempos (30 cuadros = 1 s).
- **Zonas seguras en vertical:** el corte vertical deja libres las zonas que tapan la interfaz de Reels y TikTok (arriba, abajo y la columna de botones de la derecha), así que la descripción puede ocupar las líneas de abajo sin tapar texto del video. Para revisarlas: `COMP=EcoQuestVertical SAFE=1 npm run stills -- 600 1250`.
- **Datos que cambian:** las capturas y la respuesta de `/classify` salen de `npm run capture`. Si las vuelves a tomar, el JSON del video puede cambiar un poco (por ejemplo `latency_ms`), pero la descripción no menciona números, así que sigue siendo válida.

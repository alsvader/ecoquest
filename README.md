# EcoQuest

> *The Real World Is Your Playground.*

EcoQuest convierte una caminata corta al aire libre en una expedición. Eliges una misión, guardas el teléfono, exploras y fotografías solo algunos hallazgos. Un modelo de IA de **pesos abiertos (SigLIP2)** estima si cada foto es compatible con la misión, y al final recibes un registro simple de tus descubrimientos.

Proyecto para el reto semanal **Touch Grass** de **Hacktoberfest 2026**. Expedición piloto: **«Descubre el Edén»**, en el Parque Tomás Garrido Canabal, Villahermosa, Tabasco, México (~20 min, 3 misiones).

## Estado del proyecto

MVP en desarrollo. Lo que existe hoy y lo que falta:

| Parte | Estado |
|---|---|
| Servicio de inferencia (`inference/`) | Implementado; 20 tests; probado con el modelo real y con imágenes sintéticas |
| App web móvil / PWA (`web/`) | Implementada con el diseño v2; 36 tests; flujo probado de punta a punta contra el servicio real en un navegador headless a 390 px |
| Calibración de umbrales (Fase 0) | **Preliminar.** Ajustados con 42 fotos de Wikimedia Commons (no del parque ni de un teléfono) y con prompts negativos elegidos viendo esas mismas fotos; sin validar con fotos reales del parque |
| Prueba en exterior en Villahermosa (Fase 3) | **Pendiente.** Aún no se ha probado en un teléfono real ni al aire libre |
| Dockerfile / despliegue | Sin probar |

Esto no es un producto terminado: los resultados del modelo son estimaciones y su calidad con fotos reales no está medida.

## Cómo funciona

```text
Web móvil / PWA (Next.js)  ──foto reducida──▶  API de clasificación (FastAPI)
                                                       │
                                                       ▼
                                          SigLIP2 (google/siglip2-base-patch16-256)
                                                       │
Progreso y resumen (IndexedDB, en tu teléfono) ◀── estado de la misión
```

1. Eliges la expedición y lees el aviso de seguridad.
2. Guardas el teléfono y exploras. La cámara se abre solo cuando encuentras algo.
3. La foto se reduce en el dispositivo y se envía al servicio, que la compara con descripciones de cada categoría visual.
4. El resultado es un estado: **Coincidencia** (tentativa), **No confirmado**, **Reintentar** (error de red o del servicio) o **Revisión manual · No verificada**.
5. Al final ves tus hallazgos, el tiempo en sesión y una insignia.

### Misiones del piloto

| Misión | Categoría visual | Nota |
|---|---|---|
| Encuentra una hoja de gran tamaño | `leaf` | No se infiere el tamaño físico a partir de una sola foto |
| Descubre una flor y registra sus colores | `flower` | Los colores solo se describen si son visibles |
| Encuentra un árbol con raíces visibles | `roots` | Evaluación tentativa; admite marcado manual |

## IA abierta: qué hace y qué no

- **Modelo:** [`google/siglip2-base-patch16-256`](https://huggingface.co/google/siglip2-base-patch16-256), licencia **Apache-2.0** (verificada el 2026-10-08 en Hugging Face; revísala antes de publicar). Es el componente central: sin él no hay validación de hallazgos.
- **Qué calcula:** una similitud imagen-texto, normalizada con softmax entre las categorías `flower`, `leaf`, `roots` y `distractor`.
- **Qué NO es:** no es una probabilidad calibrada, no identifica especies y no verifica nada. Por eso la interfaz no muestra números ni porcentajes, solo una barra con la línea de umbral de la misión.
- **Dónde corre:** en un servidor propio (la inferencia no es local ni offline). Open-weight no implica offline.
- **Marcado manual:** si la IA falla, puedes marcar una misión a mano. Queda etiquetada «No verificada» en el progreso, el resumen y la insignia.

## Estructura del repositorio

```
ecoquest/
├── inference/   API FastAPI + SigLIP2 (README propio con endpoints, variables y benchmark)
├── web/         App Next.js + TypeScript + Tailwind v4 (README propio con estructura y diseño)
├── docs/design/ Brief y sistema de diseño (v2 es el que usa la app)
├── EcoQuest_Propuesta.md   Propuesta original y evaluación de alternativas
├── EcoQuest_PRD.md         Requisitos del producto
└── PLAN.md                 Plan de trabajo y contrato de la API
```

## Puesta en marcha local

Requisitos: Node.js 20+ y Python 3.12. El primer arranque del servicio descarga ~1.5 GB de pesos a la caché de Hugging Face.

**1. Servicio de inferencia**

```bash
cd inference
python3.12 -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
pytest                                   # modelo mockeado; no descarga nada
ALLOWED_ORIGINS=http://localhost:3000 uvicorn app.main:app --port 8000
```

**2. App web**

```bash
cd web
npm install
cp .env.example .env.local
# NEXT_PUBLIC_MOCK_API=true  → sin backend (clasificador simulado)
# NEXT_PUBLIC_MOCK_API=false → usa el servicio en NEXT_PUBLIC_API_URL (por defecto http://localhost:8000)
npm run dev                              # http://localhost:3000
```

`NEXT_PUBLIC_*` se incorpora en tiempo de build: si cambias el modo, vuelve a compilar (`npm run build`). Para probar la cámara en un teléfono real, la página necesita servirse por HTTPS o desde la misma red con un origen permitido en `ALLOWED_ORIGINS`.

Verificación de cada parte: `web`: `npm run lint && npm run typecheck && npm test && npm run build`; `inference`: `pytest`.

## Contrato de la API

`POST /classify` (multipart: `image` JPEG/PNG/WebP ≤ 5 MB, `mission_id` ∈ `leaf|flower|roots`) devuelve `status` (`confirmed | inconclusive | unconfirmed`), `scores`, `target_score`, el modelo usado y `latency_ms`. Detalle completo en [`PLAN.md`](PLAN.md) y [`inference/README.md`](inference/README.md).

## Calibración de umbrales (Fase 0)

Los umbrales por misión viven en `inference/app/thresholds.json` y son **provisionales**. Para calibrarlos:

1. Reúne 15–30 fotos con derechos de uso claros (idealmente tuyas) en `inference/samples/<categoría>/`, con las categorías `flower`, `leaf`, `roots` y `distractor` (incluye casos negativos y ambiguos).
2. Ejecuta `python scripts/benchmark.py samples --csv resultados.csv` desde `inference/`.
3. Ajusta los umbrales y copia el mismo valor a `web/src/data/expedition.ts` (hoy es un valor espejo mantenido a mano, usado solo para dibujar la línea de umbral).

## Privacidad y seguridad

- Sin cuentas y sin ubicación. Progreso, fotos y registro de la sesión viven en IndexedDB de tu dispositivo.
- La foto reducida se envía al servicio solo para inferir; se procesa en memoria y no se escribe a disco ni se registra en logs.
- Desde la app puedes **borrar tus fotos** o **borrar todos los datos** (`/datos`) y exportar el registro de la sesión.
- Aviso de seguridad antes de empezar: no tocar fauna ni arrancar plantas, quedarse en senderos y lejos del borde del agua. Antes de una salida, consulta horarios y reglas del parque (incluidas las de fotografía).
- «Tiempo en sesión» es el tiempo de la sesión en la app; no se mide el tiempo real fuera de la pantalla ni la distancia caminada.

## Fuera del MVP

Cuentas, rankings, generación ilimitada de misiones con IA, reconocimiento de especies, rutas y mapas, audio de aves, inferencia offline garantizada y publicación en tiendas de apps.

## Limitaciones conocidas

- Umbrales sin calibrar y sin evaluación con fotos reales; pueden aparecer falsos positivos y falsos negativos.
- Límite de tasa del servicio en memoria y por proceso (no se comparte entre réplicas).
- PWA básica: manifest e icono, sin service worker ni modo offline.
- Dockerfile sin construir ni probar; sin medición de latencia en hardware de producción (en CPU local fue de ~80–105 ms por imagen, sin contar red).
- Sin pruebas con lectores de pantalla, en dispositivo real ni a 360 px de ancho.

## Licencias y créditos

- **Modelo:** SigLIP2 (`google/siglip2-base-patch16-256`), Apache-2.0.
- **Fuentes:** Silkscreen, Archivo Black y Space Grotesk, bajo SIL Open Font License 1.1.
- **Dependencias:** FastAPI, Starlette, Uvicorn, Transformers, PyTorch, Pillow, Next.js, React, Tailwind CSS, entre otras; verifica versiones y licencias exactas al publicar.
- **Licencia del código de este repositorio:** [MIT](LICENSE). Los modelos, las fuentes y las fotos de terceros conservan sus propias licencias, indicadas arriba.
- **Fotos de calibración:** deben tener derechos de uso claros y atribución cuando la licencia la exija.

## Prueba en exterior y demo

Pendiente. Cuando se realice, aquí se documentarán la fecha, el lugar, el teléfono usado, cuántos pasos de interfaz hizo falta dar, los aciertos y errores del modelo y la valoración cualitativa (¿motivó a observar más el entorno o distrajo?), junto con el video o las fotos de la salida.

## Referencias

[Hacktoberfest](https://hacktoberfest.com/) · [SigLIP2](https://huggingface.co/google/siglip2-base-patch16-256) · [Transformers](https://huggingface.co/docs/transformers/) · [Next.js](https://nextjs.org/)

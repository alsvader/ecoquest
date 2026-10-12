# EcoQuest

[English](README.md) · **Español (México)**

> *The Real World Is Your Playground.*

EcoQuest convierte una caminata corta al aire libre en una expedición. Eliges una misión, guardas el teléfono, exploras y fotografías solo algunos hallazgos. Un modelo de IA de **pesos abiertos (SigLIP2)** estima si cada foto es compatible con la misión, y al final recibes un registro simple de tus descubrimientos.

Proyecto para el reto semanal **Touch Grass** de **Hacktoberfest 2026**. Expedición piloto: **«Descubre el Edén»**, en el Parque Tomás Garrido Canabal, Villahermosa, Tabasco, México (~20 min, 3 misiones).

## Estado del proyecto

MVP en desarrollo. Lo que existe hoy y lo que falta:

| Parte | Estado |
|---|---|
| Servicio de inferencia (`inference/`) | Implementado; 27 tests; probado con el modelo real y con imágenes sintéticas |
| App web móvil / PWA (`web/`) | Implementada con el diseño v2; 36 tests; flujo probado de punta a punta contra el servicio real en un navegador headless a 390 px |
| Calibración de umbrales (Fase 0) | **Preliminar.** Ajustados con 42 fotos de Wikimedia Commons (no del parque ni de un teléfono) y con prompts negativos elegidos viendo esas mismas fotos; sin validar con fotos reales del parque |
| Prueba en exterior en Villahermosa (Fase 3) | **Pendiente.** Aún no se ha probado en un teléfono real ni al aire libre |
| Dockerfiles / despliegue | Imágenes construidas y ejecutadas en local (arm64) con `docker compose`; recursos del servidor medidos, ver [docs/despliegue.md](docs/despliegue.md). **No se ha desplegado ni probado en un proveedor de hosting ni en x86_64** |

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

### Opción A: Docker (los dos servicios)

Requiere Docker Desktop (o Docker Engine con Compose v2). **No** necesitas Node.js ni Python.

```bash
docker compose up --build -d     # construye las imágenes y levanta ambos servicios
```

Después abre **http://localhost:3000** (landing en `/`, la app en `/jugar`). Usa `localhost`, no `127.0.0.1`: CORS solo permite el origen `http://localhost:3000`.

```bash
docker compose ps                # estado y salud de cada servicio
docker compose logs -f inference # logs del servicio de IA
docker compose down              # detiene y quita los contenedores (las imágenes se conservan)
```

- **Primera construcción:** ~8 minutos, porque descarga ~1.5 GB de pesos del modelo; las siguientes usan la caché. La imagen de inferencia pesa 4.58 GB y la de la web, 305 MB. El conjunto queda sano ~15 s después de arrancar.
- **Recursos:** la inferencia recibe por defecto 1.5 GB y 2 CPUs; la web, 512 MB y 1 CPU. El kernel mata el servicio de inferencia con 640 MB y necesita ~1 GB como mínimo (se recomiendan 2 GB); ver [docs/despliegue.md](docs/despliegue.md).
- **Puertos:** se publican solo en `127.0.0.1`. Otros dispositivos (un teléfono) no pueden alcanzarlos, y la cámara del teléfono requiere HTTPS, así que probar en un teléfono exige un servidor o un túnel con HTTPS (no probado).

La configuración son variables de entorno, por ejemplo `INFERENCE_CPUS=4 docker compose up -d`:

| Variable | Por defecto | Qué hace |
|---|---|---|
| `PUBLIC_API_URL` | `http://localhost:8000` | URL de la API **tal como la ve el navegador**. Se incorpora a la imagen web al construirla: reconstruye (`--build`) si la cambias |
| `PUBLIC_SITE_URL` | `http://localhost:3000` | URL pública de la web (metaetiquetas OG/Twitter y canonical). Se incorpora al construir; defínela en producción |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | Orígenes que permite el CORS de la API; debe coincidir con la URL de la web |
| `RATE_LIMIT_PER_MINUTE` | `30` | Peticiones por minuto por cliente a `/classify` |
| `TRUST_PROXY` | `false` | Ponlo en `true` detrás de un proxy inverso; si no, todos los usuarios comparten una IP para el límite de tasa |
| `INFERENCE_MEM` / `INFERENCE_CPUS` | `1536m` / `2` | Límites del contenedor de inferencia |
| `WEB_MEM` / `WEB_CPUS` | `512m` / `1` | Límites del contenedor web |

Problemas frecuentes: si el puerto 3000 u 8000 está ocupado (por ejemplo por un servidor de desarrollo), detén ese proceso o cambia el mapeo de puertos en `compose.yaml`. Si la app llama a otra URL de la API, reconstruye con el `PUBLIC_API_URL` correcto.

Probado solo en arm64 con Docker Desktop; no en x86_64 ni en un proveedor de hosting.

### Opción B: sin Docker (desarrollo)

Requisitos: Node.js 20.9+ y Python 3.12. El primer arranque del servicio descarga ~1.5 GB de pesos a la caché de Hugging Face.

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

**Reproducir las cifras de este README.** Las fotos usadas hasta ahora (42 de calibración y 29 de validación) son de Wikimedia Commons y **no están en el repositorio**, porque sus licencias Creative Commons exigen atribución. La lista de cada foto (autor, licencia, URL de origen y `sha256`) sí se versiona en `inference/samples_external/ATTRIBUTION.csv` y `inference/samples_validation/ATTRIBUTION.csv`. Para descargarlas y repetir el benchmark:

```bash
cd inference
python scripts/download_samples.py samples_external
python scripts/download_samples.py samples_validation
python scripts/benchmark.py samples_external      # conjunto de calibración
python scripts/benchmark.py samples_validation    # conjunto de validación (no ajustes con él)
```

El descargador solo acepta https desde dominios de Wikimedia, valida cada archivo y avisa si una miniatura ya no coincide con su `sha256`. En la última ejecución ambos conjuntos se descargaron con hashes idénticos y el benchmark reprodujo 41/42 (calibración) y 28/29 (validación). Cada foto conserva su licencia y exige atribución si la reutilizas.

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
- Necesidades del servidor medidas solo en arm64 con Docker Desktop: el servicio de inferencia necesita al menos ~1 GB de RAM (el kernel lo mata con 640 MB; se recomiendan 2 GB) y tarda ~0.5 s por foto con 2 vCPUs o ~1.6 s con 1 vCPU, sin contar la red. Nada medido en x86_64 ni en un proveedor de hosting (detalle en [docs/despliegue.md](docs/despliegue.md)).
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

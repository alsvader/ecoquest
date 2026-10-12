# EcoQuest — servicio de inferencia

API FastAPI que puntúa fotos contra las misiones de EcoQuest (`leaf`, `flower`, `roots`) con
**SigLIP2** (`google/siglip2-base-patch16-256`, vía Transformers). Contrato en `../PLAN.md`.

## Uso rápido

```bash
cd inference
python3.12 -m venv .venv && source .venv/bin/activate     # o: uv venv --python 3.12 .venv
pip install -r requirements-dev.txt
pytest                                                     # modelo mockeado, no descarga nada
ALLOWED_ORIGINS=http://localhost:3000 uvicorn app.main:app --port 8000
```

El primer arranque descarga ~1.5 GB de pesos a la caché de Hugging Face.

```bash
curl -F image=@foto.jpg -F mission_id=flower http://localhost:8000/classify
curl http://localhost:8000/health
```

## Endpoints

- `POST /classify` (`multipart/form-data`): `image` (JPEG/PNG/WebP, máx. 5 MB), `mission_id` (`leaf|flower|roots`).
  Responde `{mission_id, status, scores, target_score, model, latency_ms}`.
  `scores` es un softmax sobre categorías candidatas (`flower, leaf, roots, distractor`); **no es una probabilidad calibrada**.
  Errores: `400` (tipo, tamaño o mission_id inválido, falta Content-Length), `429`, `500`; cuerpo `{"error": "..."}`.
- `GET /health` → `{"status":"ok","model":"..."}`.

`latency_ms` mide el tiempo dentro del handler (lectura + validación + inferencia), no la red.

## Variables de entorno

| Variable | Default | Descripción |
|---|---|---|
| `ALLOWED_ORIGINS` | vacío (CORS desactivado) | Orígenes permitidos, separados por coma |
| `RATE_LIMIT_PER_MINUTE` | `30` | Peticiones por minuto por cliente a `/classify` (en memoria, por proceso) |
| `TRUST_PROXY` | `false` | Si `true`, la clave del límite es el primer valor de `X-Forwarded-For` |
| `MODEL_NAME` | `google/siglip2-base-patch16-256` | Modelo HF (cambiarlo requiere revisar licencia y `MODEL_LICENSE`) |
| `PORT` | `8000` | Solo en Docker |

## Configuración del modelo

- `app/prompts.json`: prompts por categoría. Cada categoría toma el máx. de logits de sus prompts; luego softmax entre categorías.
- `app/thresholds.json`: umbrales por misión. **Provisionales, sin calibrar.** `target_score >= confirm` → `confirmed`;
  `>= inconclusive` → `inconclusive`; si no → `unconfirmed`. Recalibra con el benchmark.

## Benchmark (Fase 0)

```bash
# samples/<categoría>/*.jpg con categorías flower, leaf, roots, distractor
python scripts/benchmark.py samples --csv resultados.csv
```
Reporta scores por imagen, matriz de confusión, estado por misión, falsos positivos de distractores y latencia
(media/mediana/p95/máx; solo inferencia, tras calentamiento). `samples/` está en `.gitignore`: aporta fotos con derechos propios.

Las fotos externas usadas hasta ahora (calibración: `samples_external/`, 42; validación: `samples_validation/`, 29) vienen de
Wikimedia Commons y **no se versionan** (licencias CC con atribución); sí se versiona su lista (`ATTRIBUTION.csv`, con autor,
licencia, URL y `sha256`). Para recuperarlas y reproducir el benchmark:

```bash
python scripts/download_samples.py samples_external
python scripts/download_samples.py samples_validation
```

El script solo acepta https desde dominios de Wikimedia, valida cada archivo y avisa si el `sha256` no coincide. `samples_park/`
(fotos propias del parque) sigue ignorada por completo.

## Privacidad

Las imágenes se procesan solo en memoria: no se escriben a disco (se ajusta el umbral de spooling de Starlette
para que los archivos ≤ 5 MB no usen archivos temporales) ni se registran en logs (no se loguean nombres ni contenido).
Ojo: el log de acceso de uvicorn registra método y ruta, no cuerpos.

## Docker

```bash
docker build -t ecoquest-inference .
docker run -p 8000:8000 --memory 2g --cpus 2 \
  -e ALLOWED_ORIGINS=https://tu-app.vercel.app ecoquest-inference
```

Para levantar este servicio junto con la web, usa `docker compose up --build` desde la raíz del repositorio (ver el README raíz).

- La imagen descarga los pesos al construirse y arranca sin red (`HF_HUB_OFFLINE=1`): 4.58 GB, lista en ~5–14 s. Los pesos se descargan **antes** de copiar `app/`, así que un cambio de código no repite la descarga de ~1.5 GB.
- Corre como usuario no root (UID 1001) y tiene `HEALTHCHECK` sobre `/health`.
- **Recursos medidos** (arm64, Docker Desktop, PyTorch en CPU): con 640 MB el kernel lo mata al arrancar; con ~1 GB funciona pero sin margen (la memoria real del proceso es ~750–790 MB); se recomiendan 2 GB. Latencia por foto: ~1.6 s con 1 vCPU, ~0.5 s con 2 y ~0.2 s con 4. Atiende una foto a la vez. Detalle en [../docs/despliegue.md](../docs/despliegue.md).
- Detrás de un proxy inverso activa `TRUST_PROXY=true` (si no, el límite de tasa ve una sola IP).
- No la despliegues en funciones serverless convencionales. No se ha probado en x86_64 ni en un proveedor de hosting.

## Licencias

- **Modelo**: `google/siglip2-base-patch16-256` — **Apache-2.0**, verificado el 2026-10-08 en la API de Hugging Face
  (tag `license:apache-2.0`, modelo no restringido/gated). Referencia: arXiv:2502.14786. Revisa la ficha antes de publicar.
- Dependencias: FastAPI, Starlette, Uvicorn (MIT/BSD), Transformers (Apache-2.0), PyTorch (BSD-3), Pillow (HPND). Verifica versiones exactas al publicar.

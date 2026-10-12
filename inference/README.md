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

## Privacidad

Las imágenes se procesan solo en memoria: no se escriben a disco (se ajusta el umbral de spooling de Starlette
para que los archivos ≤ 5 MB no usen archivos temporales) ni se registran en logs (no se loguean nombres ni contenido).
Ojo: el log de acceso de uvicorn registra método y ruta, no cuerpos.

## Docker

```bash
docker build -t ecoquest-inference .
docker run -p 8000:8000 -e ALLOWED_ORIGINS=https://tu-app.vercel.app ecoquest-inference
```
La imagen descarga los pesos en build. La inferencia en CPU es viable pero no se ha medido en contenedor;
no la despliegues en funciones serverless convencionales. El Dockerfile no se ha construido/probado aquí.

## Licencias

- **Modelo**: `google/siglip2-base-patch16-256` — **Apache-2.0**, verificado el 2026-10-08 en la API de Hugging Face
  (tag `license:apache-2.0`, modelo no restringido/gated). Referencia: arXiv:2502.14786. Revisa la ficha antes de publicar.
- Dependencias: FastAPI, Starlette, Uvicorn (MIT/BSD), Transformers (Apache-2.0), PyTorch (BSD-3), Pillow (HPND). Verifica versiones exactas al publicar.

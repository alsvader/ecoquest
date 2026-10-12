# EcoQuest — Plan de trabajo del MVP

Basado en `EcoQuest_PRD.md`. Dos flujos en paralelo con carpetas separadas, unidos por el contrato de API.

## Estructura

```
ecoquest/
├── PLAN.md
├── EcoQuest_PRD.md
├── inference/   # Python + FastAPI + SigLIP2   (Agente A)
└── web/         # Next.js + TS + Tailwind + shadcn/ui, PWA (Agente B)
```

## Contrato de API (fuente de verdad para A y B)

`POST /classify` — `multipart/form-data`
- `image`: archivo JPEG/PNG/WebP, máx. 5 MB
- `mission_id`: `leaf` | `flower` | `roots`

Respuesta 200:
```json
{
  "mission_id": "flower",
  "status": "confirmed" | "inconclusive" | "unconfirmed",
  "scores": { "flower": 0.62, "leaf": 0.11, "roots": 0.03, "distractor": 0.24 },
  "target_score": 0.62,
  "model": { "name": "google/siglip2-base-patch16-256", "license": "apache-2.0" },
  "latency_ms": 840
}
```
- `scores`: softmax sobre categorías candidatas. NO es probabilidad calibrada; la UI nunca lo presenta como tal.
- `status`: según umbrales por misión (archivo `inference/app/thresholds.json`): `target_score >= confirm` → confirmed; `>= inconclusive` → inconclusive; si no → unconfirmed.
- Errores: 400 (tipo/tamaño/mission_id inválido), 429 (límite de tasa), 500. Cuerpo `{"error": "..."}`.
- `GET /health` → `{"status":"ok","model":"..."}`.
- CORS configurable por env `ALLOWED_ORIGINS`. Las imágenes no se escriben a disco ni se registran en logs.

## Flujos de trabajo

### Agente A — Inference (Fase 0 + parte de Fase 2)
1. FastAPI con `/classify` y `/health` según el contrato.
2. Carga de SigLIP2 con Transformers; prompts por categoría (flor, hoja, raíces/tronco + distractores) en `prompts.json`.
3. Umbrales iniciales provisionales en `thresholds.json` (se calibran luego con fotos reales).
4. Validación de entrada, límite de tasa, sin persistir imágenes.
5. Script `scripts/benchmark.py`: recibe una carpeta `samples/<categoría>/*.jpg`, reporta scores, matriz de aciertos y latencia. Las fotos reales las aporta el usuario (Fase 0).
6. Tests con pytest (validación, contrato, lógica de umbrales con el modelo mockeado), `requirements.txt`, Dockerfile, README propio.

### Agente B — Web (Fases 1 y 2)
1. Next.js (App Router) + TS + Tailwind + shadcn/ui, mobile-first, PWA básica (manifest).
2. Pantallas: bienvenida/seguridad → expedición «Descubre el Edén» → objetivos → sesión en curso (mínima, invita a guardar el teléfono) → captura → resultado → resumen final con insignia.
3. Misiones en `src/data/expedition.ts` (leaf, flower, roots).
4. Cliente de API con modo `NEXT_PUBLIC_MOCK_API=true` para desarrollar sin backend, y URL real por `NEXT_PUBLIC_API_URL`.
5. IndexedDB (progreso, resumen, fotos locales) con borrado total; sin cuentas ni ubicación.
6. Estados: confirmed / inconclusive (reintentar) / unconfirmed (reintentar o marcar manual «no verificada»); errores de red con evidencia pendiente.
7. Registro local de interacciones y latencias para el informe de la prueba.
8. Textos en un diccionario localizable (es por defecto).
9. Lint, typecheck, tests de la lógica con Vitest, build limpio.

## Lo que queda para ti (no automatizable)
- Fase 0 real: 15–30 fotos del parque (derechos propios) en `inference/samples/` y calibrar umbrales con el benchmark.
- Decisiones D2, D3, D6, D7 del PRD (teléfono, hosting de inferencia, idioma, fecha límite).
- Fase 3: salida a Villahermosa, grabación y notas.
- Fase 4: README raíz, video, reflexión (puedo redactar el borrador al terminar A y B).

## Integración (después de A y B)
Correr ambos localmente, probar una foto de punta a punta, ajustar CORS/URL, verificar el contrato.

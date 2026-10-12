# EcoQuest

[English](README.md) · [Español (México)](README.es-MX.md)

> *The Real World Is Your Playground.*

EcoQuest turns a short walk outdoors into an expedition. You pick a mission, put your phone away, explore, and photograph only a few findings. An **open-weight AI model (SigLIP2)** estimates whether each photo matches the mission, and at the end you get a simple record of your discoveries.

A project for the weekly **Touch Grass** challenge in **Hacktoberfest 2026**. Pilot expedition: **«Descubre el Edén»** (*Discover Eden*), in Parque Tomás Garrido Canabal, Villahermosa, Tabasco, Mexico (~20 min, 3 missions).

## Project status

MVP in development. What exists today and what is still missing:

| Part | Status |
|---|---|
| Inference service (`inference/`) | Implemented; 20 tests; tested with the real model and with synthetic images |
| Mobile web app / PWA (`web/`) | Implemented with the v2 design; 36 tests; full flow tested end to end against the real service in a headless browser at 390 px |
| Threshold calibration (Phase 0) | **Preliminary.** Tuned with 42 Wikimedia Commons photos (not from the park, not taken with a phone), and with negative prompts chosen while looking at those same photos; not validated with real park photos |
| Outdoor test in Villahermosa (Phase 3) | **Pending.** Not yet tested on a real phone or outdoors |
| Dockerfiles / deployment | Images built and run locally (arm64) with `docker compose`; server resources measured, see [docs/despliegue.md](docs/despliegue.md). **Not deployed or tested on a hosting provider or on x86_64** |

This is not a finished product: the model's results are estimates, and its quality on real photos has not been measured.

## How it works

```text
Mobile web / PWA (Next.js)  ──reduced photo──▶  Classification API (FastAPI)
                                                         │
                                                         ▼
                                            SigLIP2 (google/siglip2-base-patch16-256)
                                                         │
Progress and summary (IndexedDB, on your phone) ◀── mission status
```

1. You choose the expedition and read the safety notice.
2. You put your phone away and explore. The camera opens only when you find something.
3. The photo is downscaled on the device and sent to the service, which compares it with descriptions of each visual category.
4. The result is a status: **Match** (tentative), **Unconfirmed**, **Retry** (network or service error), or **Manual review · Unverified**.
5. At the end you see your findings, the time in session, and a badge.

> The app's interface is currently in Spanish (`es-MX`) only; this README is the English version of the project documentation.

### Pilot missions

| Mission | Visual category | Note |
|---|---|---|
| Find a large leaf | `leaf` | Physical size is not inferred from a single photo |
| Discover a flower and record its colors | `flower` | Colors are described only when visible |
| Find a tree with visible roots | `roots` | Tentative assessment; manual marking is allowed |

## Open AI: what it does and what it doesn't

- **Model:** [`google/siglip2-base-patch16-256`](https://huggingface.co/google/siglip2-base-patch16-256), **Apache-2.0** license (checked on 2026-10-08 on Hugging Face; re-check before publishing). It is the core component: without it there is no finding validation.
- **What it computes:** an image-text similarity, normalized with softmax across the categories `flower`, `leaf`, `roots`, and `distractor`.
- **What it is NOT:** it is not a calibrated probability, it does not identify species, and it verifies nothing. That is why the interface shows no numbers or percentages, only a bar with the mission's threshold line.
- **Where it runs:** on a server you control (inference is not local or offline). Open-weight does not mean offline.
- **Manual marking:** if the AI fails, you can mark a mission by hand. It is labeled «Unverified» in progress, the summary, and the badge.

## Repository structure

```
ecoquest/
├── inference/   FastAPI + SigLIP2 API (own README: endpoints, variables, benchmark)
├── web/         Next.js + TypeScript + Tailwind v4 app (own README: structure and design)
├── docs/design/ Brief and design system (v2 is the one the app uses)
├── EcoQuest_Propuesta.md   Original proposal and evaluation of alternatives (Spanish)
├── EcoQuest_PRD.md         Product requirements (Spanish)
└── PLAN.md                 Work plan and API contract (Spanish)
```

## Running locally

Requirements: Node.js 20.9+ and Python 3.12. The first start of the service downloads ~1.5 GB of weights into the Hugging Face cache.

**1. Inference service**

```bash
cd inference
python3.12 -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
pytest                                   # model mocked; downloads nothing
ALLOWED_ORIGINS=http://localhost:3000 uvicorn app.main:app --port 8000
```

**2. Web app**

```bash
cd web
npm install
cp .env.example .env.local
# NEXT_PUBLIC_MOCK_API=true  → no backend (simulated classifier)
# NEXT_PUBLIC_MOCK_API=false → uses the service at NEXT_PUBLIC_API_URL (default http://localhost:8000)
npm run dev                              # http://localhost:3000
```

`NEXT_PUBLIC_*` variables are baked in at build time: if you change the mode, rebuild (`npm run build`). To test the camera on a real phone, the page must be served over HTTPS or from the same network with an origin allowed in `ALLOWED_ORIGINS`.

Checks for each part: `web`: `npm run lint && npm run typecheck && npm test && npm run build`; `inference`: `pytest`.

With Docker: `docker compose up --build` starts both services (web on `http://localhost:3000`, API on `http://localhost:8000`); the first build downloads ~1.5 GB of model weights. `NEXT_PUBLIC_API_URL` is baked into the web image, so set `PUBLIC_API_URL` to the public URL of the API before building for a server.

## API contract

`POST /classify` (multipart: `image` as JPEG/PNG/WebP ≤ 5 MB, `mission_id` ∈ `leaf|flower|roots`) returns `status` (`confirmed | inconclusive | unconfirmed`), `scores`, `target_score`, the model used, and `latency_ms`. Full details in [`PLAN.md`](PLAN.md) (Spanish) and [`inference/README.md`](inference/README.md).

## Threshold calibration (Phase 0)

Per-mission thresholds live in `inference/app/thresholds.json` and are **provisional**. To calibrate them:

1. Gather 15–30 photos with clear usage rights (ideally your own) in `inference/samples/<category>/`, using the categories `flower`, `leaf`, `roots`, and `distractor` (include negative and ambiguous cases).
2. From `inference/`, run `python scripts/benchmark.py samples --csv results.csv`.
3. Adjust the thresholds and copy the same values to `web/src/data/expedition.ts` (currently a mirror value kept by hand, used only to draw the threshold line).

**Reproducing the numbers in this README.** The photos used so far (42 for calibration, 29 for validation) are from Wikimedia Commons and are **not stored in the repository** because their Creative Commons licenses require attribution. The list of each photo (author, license, source URL, `sha256`) is versioned in `inference/samples_external/ATTRIBUTION.csv` and `inference/samples_validation/ATTRIBUTION.csv`. To fetch them and re-run the benchmark:

```bash
cd inference
python scripts/download_samples.py samples_external
python scripts/download_samples.py samples_validation
python scripts/benchmark.py samples_external      # calibration set
python scripts/benchmark.py samples_validation    # validation set (do not tune on it)
```

The downloader only accepts HTTPS from Wikimedia domains, validates each file, and warns if a thumbnail no longer matches its `sha256`. When last run, both sets downloaded with identical hashes and the benchmark reproduced 41/42 (calibration) and 28/29 (validation). Each photo keeps its own license and needs attribution if you reuse it.

## Privacy and security

- No accounts and no location. Progress, photos, and the session log live in IndexedDB on your device.
- The reduced photo is sent to the service only for inference; it is processed in memory and is not written to disk or logged.
- From the app you can **delete your photos** or **delete all data** (`/datos`), and export the session log.
- Safety notice before starting: do not touch wildlife or pick plants, stay on trails and away from the water's edge. Before going out, check the park's hours and rules (including photography rules).
- "Time in session" is the time spent in the app; the app does not measure time away from the screen or distance walked.

## Out of scope for the MVP

Accounts, rankings, unlimited AI-generated missions, species recognition, routes and maps, bird audio, guaranteed offline inference, and publishing to app stores.

## Known limitations

- Uncalibrated thresholds and no evaluation on real photos; false positives and false negatives are expected.
- The service's rate limit is in memory and per process (not shared across replicas).
- Basic PWA: manifest and icon, no service worker and no offline mode.
- Server needs measured only on arm64 in Docker Desktop: the inference service needs at least ~1 GB of RAM (it is killed at 640 MB; 2 GB recommended) and takes ~0.5 s per photo with 2 vCPUs or ~1.6 s with 1 vCPU, excluding network. Nothing measured on x86_64 or a hosting provider (details in [docs/despliegue.md](docs/despliegue.md)).
- Not tested with screen readers, on real devices, or at 360 px wide.

## Licenses and credits

- **Model:** SigLIP2 (`google/siglip2-base-patch16-256`), Apache-2.0.
- **Fonts:** Silkscreen, Archivo Black, and Space Grotesk, under the SIL Open Font License 1.1.
- **Dependencies:** FastAPI, Starlette, Uvicorn, Transformers, PyTorch, Pillow, Next.js, React, Tailwind CSS, among others; verify exact versions and licenses before publishing.
- **Code license for this repository:** [MIT](LICENSE). Models, fonts, and third-party photos keep their own licenses, listed above.
- **Calibration photos:** must have clear usage rights and attribution where the license requires it.

## Outdoor test and demo

Pending. When it happens, this section will document the date, place, phone used, how many interface steps were needed, the model's hits and misses, and a qualitative assessment (did it encourage people to notice their surroundings, or distract them?), along with the video or photos from the outing.

## References

[Hacktoberfest](https://hacktoberfest.com/) · [SigLIP2](https://huggingface.co/google/siglip2-base-patch16-256) · [Transformers](https://huggingface.co/docs/transformers/) · [Next.js](https://nextjs.org/)

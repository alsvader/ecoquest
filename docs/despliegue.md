# Despliegue: recursos medidos del servidor

Mediciones hechas con Docker Desktop en un Mac con procesador Apple Silicon (**arm64**), con el modelo `google/siglip2-base-patch16-256` en CPU. Un servidor típico es **x86_64**: los tamaños y tiempos pueden variar, y no se han medido allí.

**Cómo se midió:** cada configuración arrancó la imagen con `--memory` y `--cpus`, se esperó a `/health`, se enviaron 24 fotos reales de `inference/samples_validation/` una tras otra (la primera incluye calentamiento) y después 4 peticiones simultáneas. La memoria sale de `memory.peak` y `memory.stat` del cgroup del contenedor. El límite de tasa se subió solo para la prueba.

## Servicio de inferencia (`inference/`)

| Límite | Resultado | Latencia por foto (servidor) |
|---|---|---|
| 640 MB | **Muere por falta de memoria al arrancar** (OOM, exit 137) | — |
| 768 MB | Funciona, pico 768 MB: sin margen | ~425 ms con 2 CPUs |
| 1 GB, 2 CPUs | Funciona; la memoria queda pegada al límite y la latencia sube | p50 ~535 ms, p95 ~1.0 s |
| 2 GB, 1 CPU | Funciona; pico ~1.2 GB contando caché de archivos | p50 ~1.6 s, p95 ~2.2 s, máx. 4.3 s |
| 2 GB, 2 CPUs | Funciona; pico ~970 MB | p50 ~0.5 s, p95 ~0.6 s |
| 4 GB, 4 CPUs | Funciona; pico ~870 MB | p50 ~0.2 s, p95 ~0.27 s |

- **Memoria real del proceso:** ~750–790 MB (memoria anónima). El resto de lo que reporta el contenedor es caché de los archivos del modelo, que el kernel libera si hace falta.
- **Mínimo para arrancar:** más de 640 MB. **Recomendado: 2 GB**, para tener margen. Los planes de 512 MB (por ejemplo el gratuito y el Starter de Render) no sirven.
- **CPU:** manda la latencia. 1 vCPU funciona pero tarda ~1.6 s por foto; con 2 vCPU baja a ~0.5 s.
- **Concurrencia:** una foto a la vez (la inferencia está protegida por un candado). Con 4 peticiones simultáneas en 1 CPU, la última tardó ~8.3 s; con 2 CPUs, ~2.5 s.
- **Arranque:** listo en 5–14 s con los pesos dentro de la imagen y sin red.
- **Imagen:** 4.58 GB sin comprimir (antes de optimizar eran 7.53 GB). Para el almacenamiento del servidor, estima ≥ 10 GB libres; el tamaño comprimido en el registro no se midió.
- **Seguridad:** corre como usuario no root (UID 1001). Tiene `HEALTHCHECK` (queda `healthy` en ~15 s).

## Web (`web/`)

- Imagen de **305 MB**, construida en dos etapas con `output: "standalone"`. Corre como usuario no root.
- **~48 MB de memoria** con un límite de 256 MB y 0.5 CPU. Arranca en ~2 s. Todas las rutas responden 200.
- `NEXT_PUBLIC_API_URL` se incorpora **al construir**: hay que reconstruir la imagen si cambia la URL pública de la API. También se usa para la política de seguridad (CSP `connect-src`).

## Qué cambió en el Dockerfile de inferencia

| Problema | Corrección |
|---|---|
| `chown -R` posterior duplicaba en otra capa los ~1.5 GB de pesos | El usuario `app` se crea antes y descarga el modelo con ese usuario |
| El código se copiaba antes del modelo: cualquier cambio en `app/` repetía la descarga de 1.5 GB | La descarga va antes de `COPY app` (comprobado: con un cambio de código, pip y el modelo salen de caché) |
| Sin caché de pip | `RUN --mount=type=cache` |
| Sin `HEALTHCHECK` | Añadido |
| `.dockerignore` no excluía `samples_external/`, `samples_validation/` ni `samples_park/` | Excluidas (evita meter tus fotos en la imagen) |

## Prueba de punta a punta con `docker compose`

`docker compose up --build` levanta ambos servicios con sus límites (`inference`: 1.5 GB y 2 CPUs; `web`: 512 MB y 1 CPU). Se comprobó con un navegador headless: la web (contenedor) llama a la API (contenedor), recibe 200, no hay errores de consola y la CSP no bloquea la llamada.

## Qué no se midió

- **x86_64:** todo se midió en arm64. El tamaño de PyTorch y el rendimiento pueden diferir.
- **Carga real:** solo 24 peticiones secuenciales y 4 simultáneas, con una sola foto por petición.
- **Plataformas concretas:** no se probó en Render, Hetzner ni otro proveedor.
- **Tamaño comprimido** de la imagen en un registro, y tiempo de construcción en un servidor remoto (aquí ~8 min en total, con la descarga del modelo).
- **GPU:** el Dockerfile usa PyTorch en CPU.

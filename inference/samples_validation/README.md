# samples_validation: conjunto de validacion independiente (held-out)

29 fotos externas de Wikimedia Commons (flower 7, leaf 6, roots 6, distractor 10), sin solapamiento
de archivos ni autores con `samples_external/` (conjunto de calibracion de prompts/umbrales).

- **Solo para medicion.** No usar para ajustar `app/prompts.json` ni `app/thresholds.json`.
  Seleccion y etiquetas congeladas antes de correr el modelo; no agregar ni quitar imagenes tras ver resultados.
- **No representativo** de las fotos de telefono en el parque (son fotos externas, varias de camara/estudio y de otros paises).
- **Atribucion obligatoria**: ver `ATTRIBUTION.csv` (autor, licencia CC0 / CC BY / CC BY-SA / dominio publico, URL de origen).
  No redistribuir sin revisar cada licencia (BY y BY-SA exigen atribucion; BY-SA exige misma licencia). Por eso las imagenes no se versionan: solo `ATTRIBUTION.csv` (con el `sha256` de cada archivo) y este README.
- Las imagenes son miniaturas de ~1024-1280 px descargadas de la API de Commons.
- Descarga: `python scripts/download_samples.py samples_validation`
- Uso: `.venv/bin/python scripts/benchmark.py samples_validation --csv <salida.csv>`

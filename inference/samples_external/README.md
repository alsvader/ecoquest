# samples_external — fotos externas para calibracion PRELIMINAR

Fotos de Wikimedia Commons (miniaturas de ~1024 px) con licencia reutilizable (CC0, dominio publico, CC BY, CC BY-SA).
Autor, licencia y URL de cada una: `ATTRIBUTION.csv`.

- Sirven SOLO para una calibracion preliminar de umbrales (`python scripts/benchmark.py samples_external`).
- NO representan fotos reales de telefono tomadas en el Parque Tomas Garrido Canabal: son fotos de internet, muestra pequena
  y mayormente de otras regiones. Los umbrales derivados son provisionales hasta contar con fotos propias.
- Las licencias deben respetarse (atribucion; CC BY-SA exige compartir igual). No redistribuir en el repo ni en la app sin revisar `ATTRIBUTION.csv`.
- **Las imagenes no estan en el repositorio**; solo `ATTRIBUTION.csv` (con el `sha256` de cada archivo) y este README. Recuperalas desde Wikimedia Commons con:
  `python scripts/download_samples.py samples_external`
  Si Wikimedia regenero alguna miniatura, el script avisa de que el `sha256` no coincide y los resultados pueden variar ligeramente.
- Categorias: `flower`, `leaf`, `roots`, `distractor` (mismo formato que `samples/`).

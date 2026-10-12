# Guía de fotos para calibrar EcoQuest en el parque

**Objetivo:** reunir fotos propias, tomadas con tu teléfono en el Parque Tomás Garrido Canabal, para medir y ajustar el clasificador (SigLIP2) en condiciones reales. Hoy solo se ha evaluado con fotos de internet.

**Cantidad:** 30–40 fotos en total (mínimo útil: 15). Tiempo estimado: 20–30 minutos.

## Antes de salir

- [ ] Usa **el mismo teléfono** que llevarás a la demo, con la cámara normal y sin filtros ni modo retrato.
- [ ] **iPhone:** Ajustes → Cámara → Formatos → **Más compatible**, para que guarde JPEG. El benchmark no lee HEIC.
- [ ] Consulta horarios y reglas del parque, incluida la fotografía.
- [ ] Lleva agua y protección: calor y humedad.

## Reglas de seguridad y respeto

- No toques ni arranques plantas, y no recolectes nada.
- Quédate en senderos y lejos del borde del agua.
- No te acerques a fauna.
- Evita personas identificables en primer plano. Si aparece alguien, repite la foto.

## Qué fotografiar

Toma cada foto **como lo haría un usuario real**: mirando el objeto y sacando la foto sin preparar nada. No busques la foto perfecta; queremos medir errores.

| Carpeta | Qué es | Cuántas | Ideas |
|---|---|---|---|
| `flower` | Una flor visible | 5–6 | De cerca y a media distancia. Flores de distintos colores. Una flor pequeña entre hojas |
| `leaf` | Una hoja grande como sujeto principal | 5–6 | Plátano, almendro, palmas de abanico, hojas de ficus. Una con la mano al lado para dar escala |
| `roots` | Un árbol con raíces o base con raíces visibles | 5–6 | Raíces tabulares, ficus con raíces aéreas, raíces levantando el suelo |
| `distractor` | Cualquier cosa que **no** cumple las misiones | 12–15 | Ver la lista de abajo |

### Negativos difíciles (lo más valioso para `distractor`)

Estos son los que confunden al modelo. Haz varios de cada uno que encuentres:

- Troncos **sin raíces visibles**: palmas, árboles de calle, troncos lisos.
- Hojas **pequeñas o finas**: ramas con hojas chicas, hojas compuestas, bambú, pasto alto.
- Plantas **sin flor** (arbustos, jardines verdes).
- **Flores falsas o pintadas**: murales, adornos, plástico, si encuentras.
- Frutos, semillas o vainas colgando de una rama.
- Escenas sin objetivo claro: sendero, banca, suelo, cielo, agua, edificios o letreros.

### Casos de borde (3–5 fotos, repartidas entre las categorías)

- Hoja a medio encuadrar o muy cerca del borde.
- Flor pequeña en una esquina de la imagen.
- Raíces parcialmente tapadas por pasto.
- Contraluz, sombra fuerte o foto un poco movida.

## Cómo guardarlas

Dos juegos de carpetas, ya creadas en `inference/samples_park/`:

```
inference/samples_park/
├── ajuste/     ← para ajustar prompts y umbrales
│   ├── flower/  leaf/  roots/  distractor/
└── reserva/    ← NO se usa para ajustar; solo para comprobar al final
    ├── flower/  leaf/  roots/  distractor/
```

**Reparte las fotos así:** ~2/3 en `ajuste` y ~1/3 en `reserva`, con la **misma mezcla** en ambas (también negativos difíciles). Hazlo **antes de ver los resultados del modelo**. La carpeta `reserva` sirve para saber si lo ajustado generaliza o solo se aprendió de memoria.

- **Etiqueta lo que se ve, no lo que esperas del modelo.** Si dudas, ponla en `distractor` y anótalo.
- **Formato:** JPEG, PNG o WebP. Nombres libres, por ejemplo `flower_01.jpg`.
- **No renombres ni muevas fotos después de ver resultados.** Si descubres una mal etiquetada, anótala sin moverla.
- **No las subas al repositorio.** La carpeta `samples_park/` ya está en `.gitignore`.

## Pasarlas al equipo

AirDrop, cable USB o Google Drive: lo que te resulte más fácil. Si tu teléfono las envía como HEIC, conviértelas a JPEG antes (en Mac: Vista Previa → Archivo → Exportar, o selecciona «Más compatible» en la cámara como arriba).

## Qué hago yo con ellas

1. Corro `python scripts/benchmark.py samples_park/ajuste` con la configuración actual y reporto aciertos, falsos positivos y negativos.
2. Ajusto prompts y umbrales **solo con `ajuste`**.
3. Compruebo con `reserva` si la mejora se mantiene.
4. Comparo con el conjunto de internet y documento los resultados, con sus límites.

Un resultado con 30–40 fotos tiene mucha incertidumbre. Sirve para ver errores y patrones, no para afirmar una precisión.

## Notas de la salida (rellena en el parque)

| Dato | Valor |
|---|---|
| Fecha y hora | |
| Clima y luz | |
| Teléfono | |
| Zona del parque | |
| Dificultades (permisos, acceso, calor) | |

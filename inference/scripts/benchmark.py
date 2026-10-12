#!/usr/bin/env python
"""Benchmark: samples/<categoria>/*.jpg -> scores, matriz de aciertos y latencia.

Categorias esperadas: flower, leaf, roots, distractor (cualquier otra carpeta se reporta
como categoria extra). Uso:  python scripts/benchmark.py samples [--csv out.csv]
"""
from __future__ import annotations

import argparse
import csv
import statistics as st
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from PIL import Image  # noqa: E402

from app.classifier import MODEL_NAME, SiglipClassifier, decide_status, load_thresholds  # noqa: E402

EXTS = {".jpg", ".jpeg", ".png", ".webp"}
CATS = ["flower", "leaf", "roots", "distractor"]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("folder", type=Path)
    ap.add_argument("--csv", type=Path, help="guardar resultados por imagen")
    ap.add_argument("--warmup", type=int, default=1)
    a = ap.parse_args()

    files = [(d.name, f) for d in sorted(a.folder.iterdir()) if d.is_dir()
             for f in sorted(d.iterdir()) if f.suffix.lower() in EXTS]
    if not files:
        print(f"No hay imagenes en {a.folder}/<categoria>/*.jpg", file=sys.stderr)
        return 1

    thresholds = load_thresholds()
    clf = SiglipClassifier()
    first = Image.open(files[0][1])
    for _ in range(a.warmup):
        clf.score(first)

    rows, lat = [], []
    for truth, path in files:
        img = Image.open(path)
        t0 = time.perf_counter()
        scores = clf.score(img)
        ms = (time.perf_counter() - t0) * 1000
        lat.append(ms)
        pred = max(scores, key=scores.get)
        status = decide_status(truth, scores[truth], thresholds) if truth in thresholds else "-"
        rows.append({"truth": truth, "file": str(path.relative_to(a.folder)), "pred": pred,
                     "status_for_truth_mission": status, "ms": round(ms, 1),
                     **{c: round(scores.get(c, 0), 3) for c in CATS}})
        print(f"{truth:10s} -> {pred:10s} {status:13s} {ms:7.0f} ms  {path.name}  "
              + " ".join(f"{c[:4]}={scores.get(c, 0):.2f}" for c in CATS))

    truths = sorted({r["truth"] for r in rows})
    preds = sorted(set(CATS) | {r["pred"] for r in rows})
    print(f"\nModelo: {MODEL_NAME}   Imagenes: {len(rows)}")
    print("\nMatriz de confusion (filas=real, columnas=argmax predicho)")
    print(f"{'':12s}" + "".join(f"{p:>12s}" for p in preds))
    for t in truths:
        print(f"{t:12s}" + "".join(f"{sum(1 for r in rows if r['truth'] == t and r['pred'] == p):12d}" for p in preds))
    ok = sum(1 for r in rows if r["truth"] == r["pred"])
    print(f"\nAciertos argmax: {ok}/{len(rows)} ({100 * ok / len(rows):.0f}%)")
    print("\nEstado por misión (solo imágenes de la categoría objetivo)")
    for t in truths:
        if t in thresholds:
            sub = [r["status_for_truth_mission"] for r in rows if r["truth"] == t]
            print(f"  {t}: " + ", ".join(f"{s}={sub.count(s)}" for s in ("confirmed", "inconclusive", "unconfirmed")))
    fp = [r for r in rows if r["truth"] == "distractor"
          and any(decide_status(m, r[m], thresholds) == "confirmed" for m in thresholds)]
    print(f"Distractores que alguna misión confirmaría (falsos positivos): {len(fp)}")
    lat_s = sorted(lat)
    print(f"\nLatencia (ms, solo inferencia, CPU/GPU local): media={st.mean(lat):.0f} "
          f"mediana={st.median(lat):.0f} p95={lat_s[min(len(lat_s) - 1, int(.95 * len(lat_s)))]:.0f} "
          f"max={max(lat):.0f}")
    if a.csv:
        with a.csv.open("w", newline="") as f:
            w = csv.DictWriter(f, fieldnames=list(rows[0]))
            w.writeheader()
            w.writerows(rows)
        print(f"CSV: {a.csv}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

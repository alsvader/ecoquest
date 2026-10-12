"""Descarga las fotos de calibracion/validacion listadas en un ATTRIBUTION.csv.

Las imagenes NO estan en el repositorio (tienen licencias CC que exigen atribucion); el CSV
guarda autor, licencia y URL de cada una. Este script las recupera desde Wikimedia Commons para
poder reproducir la calibracion con `scripts/benchmark.py`.

Uso (desde inference/):
    python scripts/download_samples.py samples_external
    python scripts/download_samples.py samples_validation --dry-run

Seguridad: solo descarga por https desde dominios de Wikimedia, limita el tamano, valida cada
archivo con Pillow antes de guardarlo y no escribe fuera de la carpeta de destino. Solo usa la
libreria estandar y Pillow (ya en requirements.txt).
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import io
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image

ALLOWED_HOSTS = {"upload.wikimedia.org", "thumb.wikimedia.org", "commons.wikimedia.org"}
ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}
MAX_BYTES = 10 * 1024 * 1024
# Wikimedia pide un User-Agent descriptivo (https://meta.wikimedia.org/wiki/User-Agent_policy).
USER_AGENT = "EcoQuest-sample-downloader/0.1 (https://github.com/alsvader/ecoquest; calibration research)"
DELAY_S = 1.0
RETRIES = 4


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    wait = 2.0
    for attempt in range(1, RETRIES + 1):
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = resp.read(MAX_BYTES + 1)
            if len(data) > MAX_BYTES:
                raise ValueError(f"mas de {MAX_BYTES // 1024 // 1024} MB")
            return data
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and attempt < RETRIES:
                retry_after = e.headers.get("Retry-After")
                time.sleep(float(retry_after) if retry_after and retry_after.isdigit() else wait)
                wait *= 2
                continue
            raise
        except urllib.error.URLError:
            if attempt < RETRIES:
                time.sleep(wait)
                wait *= 2
                continue
            raise
    raise RuntimeError("sin respuesta")


def check_url(url: str) -> None:
    parts = urllib.parse.urlparse(url)
    if parts.scheme != "https" or parts.hostname not in ALLOWED_HOSTS:
        raise ValueError(f"URL no permitida (solo https y dominios de Wikimedia): {url}")


def safe_target(dest: Path, rel: str) -> Path:
    target = (dest / rel).resolve()
    if dest.resolve() not in target.parents:
        raise ValueError(f"ruta fuera de la carpeta de destino: {rel}")
    return target


def validate_image(data: bytes) -> str:
    with Image.open(io.BytesIO(data)) as im:
        fmt = im.format or ""
        im.verify()
    if fmt not in ALLOWED_FORMATS:
        raise ValueError(f"formato no admitido: {fmt or 'desconocido'}")
    return fmt


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("folder", help="carpeta con ATTRIBUTION.csv (p. ej. samples_external)")
    ap.add_argument("--dest", help="carpeta de destino (por defecto, la misma carpeta)")
    ap.add_argument("--dry-run", action="store_true", help="solo lista lo que descargaria")
    ap.add_argument("--force", action="store_true", help="vuelve a descargar aunque el archivo exista")
    a = ap.parse_args()

    folder = Path(a.folder)
    csv_path = folder / "ATTRIBUTION.csv"
    if not csv_path.is_file():
        print(f"No existe {csv_path}", file=sys.stderr)
        return 2
    dest = Path(a.dest) if a.dest else folder
    rows = list(csv.DictReader(open(csv_path, encoding="utf-8", newline="")))

    ok = skipped = failed = hash_diff = 0
    for i, r in enumerate(rows, 1):
        rel, url, expected = r["archivo"], r["url_descarga"], (r.get("sha256") or "").strip()
        try:
            check_url(url)
            target = safe_target(dest, rel)
            if target.exists() and not a.force:
                skipped += 1
                continue
            if a.dry_run:
                print(f"[{i}/{len(rows)}] descargaria {rel}  <-  {url}")
                continue
            data = fetch(url)
            validate_image(data)
            digest = hashlib.sha256(data).hexdigest()
            if expected and digest != expected:
                hash_diff += 1
                print(f"  aviso: {rel} no coincide con el sha256 del CSV (Wikimedia pudo regenerar la miniatura)")
            target.parent.mkdir(parents=True, exist_ok=True)
            tmp = target.with_suffix(target.suffix + ".part")
            tmp.write_bytes(data)
            tmp.replace(target)
            ok += 1
            print(f"[{i}/{len(rows)}] ok  {rel}")
            time.sleep(DELAY_S)
        except Exception as e:  # noqa: BLE001 - se informa y se sigue con la siguiente
            failed += 1
            print(f"[{i}/{len(rows)}] ERROR {rel}: {e}", file=sys.stderr)

    print(f"\nDescargadas: {ok}  Ya existian: {skipped}  Con error: {failed}  sha256 distinto: {hash_diff}")
    print("Recuerda: cada foto conserva su licencia y exige atribucion; ver ATTRIBUTION.csv.")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())

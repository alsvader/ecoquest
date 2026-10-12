"""Comprobaciones de seguridad de scripts/download_samples.py (sin red)."""
import importlib.util
import io
from pathlib import Path

import pytest
from PIL import Image

_spec = importlib.util.spec_from_file_location(
    "download_samples", Path(__file__).parent.parent / "scripts" / "download_samples.py"
)
ds = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(ds)


@pytest.mark.parametrize(
    "url",
    [
        "http://upload.wikimedia.org/a.jpg",
        "https://evil.example.com/a.jpg",
        "https://upload.wikimedia.org.evil.com/a.jpg",
        "file:///etc/passwd",
    ],
)
def test_check_url_rechaza_urls_no_permitidas(url):
    with pytest.raises(ValueError):
        ds.check_url(url)


def test_check_url_acepta_wikimedia():
    ds.check_url("https://upload.wikimedia.org/wikipedia/commons/a/a1/X.jpg")
    ds.check_url("https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a1/X.jpg/1024px-X.jpg")


def test_safe_target_rechaza_rutas_fuera_del_destino(tmp_path):
    with pytest.raises(ValueError):
        ds.safe_target(tmp_path, "../fuera.jpg")
    assert ds.safe_target(tmp_path, "leaf/leaf_01.jpg").parent.name == "leaf"


def test_validate_image():
    buf = io.BytesIO()
    Image.new("RGB", (4, 4)).save(buf, "JPEG")
    assert ds.validate_image(buf.getvalue()) == "JPEG"
    with pytest.raises(Exception):
        ds.validate_image(b"<html>no soy una imagen</html>")
    gif = io.BytesIO()
    Image.new("P", (4, 4)).save(gif, "GIF")
    with pytest.raises(ValueError):
        ds.validate_image(gif.getvalue())

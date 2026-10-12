import pytest
from fastapi.testclient import TestClient

from app.classifier import decide_status, load_prompts, load_thresholds, softmax
from app.main import MAX_BYTES, create_app
from tests.conftest import FakeClassifier, make_image


def post(client, data=None, mission="flower", name="a.png", ctype="image/png", **kw):
    data = make_image() if data is None else data
    return client.post("/classify", files={"image": (name, data, ctype)},
                       data={"mission_id": mission}, **kw)


def test_health(client):
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok", "model": "google/siglip2-base-patch16-256"}


def test_contract_shape(client):
    r = post(client)
    assert r.status_code == 200
    b = r.json()
    assert set(b) == {"mission_id", "status", "scores", "target_score", "model", "latency_ms"}
    assert b["mission_id"] == "flower"
    assert b["target_score"] == b["scores"]["flower"] == 0.62
    assert set(b["scores"]) == {"flower", "leaf", "roots", "distractor"}
    assert b["model"] == {"name": "google/siglip2-base-patch16-256", "license": "apache-2.0"}
    assert isinstance(b["latency_ms"], int)
    assert b["status"] == "confirmed"


@pytest.mark.parametrize("fmt,ctype", [("JPEG", "image/jpeg"), ("PNG", "image/png"), ("WEBP", "image/webp")])
def test_accepts_formats(client, fmt, ctype):
    assert post(client, make_image(fmt), ctype=ctype).status_code == 200


def test_other_mission_uses_its_score(client, fake):
    fake.scores = {"flower": 0.1, "leaf": 0.45, "roots": 0.05, "distractor": 0.40}
    b = post(client, mission="leaf").json()
    assert b["target_score"] == 0.45 and b["status"] == "inconclusive"


def test_invalid_mission(client, fake):
    r = post(client, mission="tree")
    assert r.status_code == 400 and "error" in r.json()
    assert fake.calls == 0


def test_missing_fields(client):
    r = client.post("/classify", data={"mission_id": "leaf"})
    assert r.status_code == 400 and "error" in r.json()
    r = client.post("/classify", files={"image": ("a.png", make_image(), "image/png")})
    assert r.status_code == 400 and "error" in r.json()


def test_rejects_non_image(client, fake):
    r = post(client, b"hello world, not an image", name="a.png", ctype="image/png")
    assert r.status_code == 400 and "error" in r.json()
    assert fake.calls == 0


def test_rejects_gif(client):
    from io import BytesIO
    from PIL import Image
    buf = BytesIO(); Image.new("RGB", (8, 8)).save(buf, "GIF")
    assert post(client, buf.getvalue(), ctype="image/gif").status_code == 400


def test_rejects_corrupt_image(client):
    r = post(client, b"\x89PNG\r\n\x1a\n" + b"garbage" * 10)
    assert r.status_code == 400


def test_rejects_over_5mb(client, fake):
    big = make_image() + b"\0" * (MAX_BYTES + 10)
    r = post(client, big)
    assert r.status_code == 400 and "5 MB" in r.json()["error"]
    assert fake.calls == 0


def test_rate_limit(monkeypatch):
    monkeypatch.setenv("RATE_LIMIT_PER_MINUTE", "2")
    with TestClient(create_app(FakeClassifier())) as c:
        assert post(c).status_code == 200
        assert post(c).status_code == 200
        r = post(c)
        assert r.status_code == 429 and "error" in r.json()


def test_cors(monkeypatch):
    monkeypatch.setenv("ALLOWED_ORIGINS", "http://localhost:3000")
    with TestClient(create_app(FakeClassifier())) as c:
        ok = c.get("/health", headers={"Origin": "http://localhost:3000"})
        assert ok.headers["access-control-allow-origin"] == "http://localhost:3000"
        bad = c.get("/health", headers={"Origin": "http://evil.example"})
        assert "access-control-allow-origin" not in bad.headers
        pre = c.options("/classify", headers={"Origin": "http://localhost:3000",
                                              "Access-Control-Request-Method": "POST"})
        assert pre.status_code == 200


def test_internal_error_is_500_json(monkeypatch):
    monkeypatch.setenv("RATE_LIMIT_PER_MINUTE", "100")

    class Boom:
        def score(self, image):
            raise RuntimeError("x")

    with TestClient(create_app(Boom()), raise_server_exceptions=False) as c:
        r = post(c)
        assert r.status_code == 500 and r.json() == {"error": "Error interno del servidor."}


def test_does_not_log_or_write_images(client, caplog, tmp_path, monkeypatch):
    import os
    monkeypatch.chdir(tmp_path)
    caplog.set_level("DEBUG")
    post(client, name="secret-name.png")
    assert not any("secret-name" in r.getMessage() for r in caplog.records)
    assert os.listdir(tmp_path) == []


# --- logica de umbrales y datos de configuracion ---
def test_thresholds_logic():
    t = {"flower": {"confirm": 0.5, "inconclusive": 0.25}}
    assert decide_status("flower", 0.5, t) == "confirmed"
    assert decide_status("flower", 0.4999, t) == "inconclusive"
    assert decide_status("flower", 0.25, t) == "inconclusive"
    assert decide_status("flower", 0.2499, t) == "unconfirmed"


def test_thresholds_file_complete_and_ordered():
    t = load_thresholds()
    assert set(t) == {"leaf", "flower", "roots"}
    for v in t.values():
        assert 0 < v["inconclusive"] < v["confirm"] <= 1


def test_prompts_file_categories():
    p = load_prompts()
    assert set(p) == {"flower", "leaf", "roots", "distractor"}
    assert all(p[k] for k in p)


def test_softmax_sums_to_one():
    s = softmax({"a": 2.0, "b": 0.0, "c": -3.0})
    assert abs(sum(s.values()) - 1) < 1e-9 and s["a"] > s["b"] > s["c"]

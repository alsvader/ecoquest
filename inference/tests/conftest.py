import io

import pytest
from fastapi.testclient import TestClient
from PIL import Image

from app.main import create_app


class FakeClassifier:
    def __init__(self, scores=None):
        self.scores = scores or {"flower": 0.62, "leaf": 0.11, "roots": 0.03, "distractor": 0.24}
        self.calls = 0

    def score(self, image):
        self.calls += 1
        return dict(self.scores)


def make_image(fmt="PNG", size=(64, 64)) -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", size, (30, 160, 60)).save(buf, fmt)
    return buf.getvalue()


@pytest.fixture
def fake():
    return FakeClassifier()


@pytest.fixture
def client(fake, monkeypatch):
    monkeypatch.setenv("RATE_LIMIT_PER_MINUTE", "1000")
    with TestClient(create_app(fake)) as c:
        yield c

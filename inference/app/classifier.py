"""SigLIP2 zero-shot scoring. Las imagenes solo viven en memoria."""
from __future__ import annotations

import json
import math
import os
import threading
from pathlib import Path
from typing import Protocol

from PIL import Image

APP_DIR = Path(__file__).parent
MODEL_NAME = os.getenv("MODEL_NAME", "google/siglip2-base-patch16-256")
# Licencia verificada en la ficha del modelo en Hugging Face (tag license:apache-2.0).
MODEL_LICENSE = "apache-2.0"
MISSIONS = ("leaf", "flower", "roots")


def load_prompts(path: Path = APP_DIR / "prompts.json") -> dict[str, list[str]]:
    return json.loads(path.read_text(encoding="utf-8"))["categories"]


def load_thresholds(path: Path = APP_DIR / "thresholds.json") -> dict[str, dict[str, float]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    return {m: data[m] for m in MISSIONS}


def softmax(values: dict[str, float]) -> dict[str, float]:
    mx = max(values.values())
    exps = {k: math.exp(v - mx) for k, v in values.items()}
    total = sum(exps.values())
    return {k: v / total for k, v in exps.items()}


def decide_status(mission_id: str, target_score: float, thresholds: dict) -> str:
    t = thresholds[mission_id]
    if target_score >= t["confirm"]:
        return "confirmed"
    if target_score >= t["inconclusive"]:
        return "inconclusive"
    return "unconfirmed"


class Classifier(Protocol):
    def score(self, image: Image.Image) -> dict[str, float]:
        """Softmax sobre categorias (flower, leaf, roots, distractor)."""


class SiglipClassifier:
    def __init__(self, model_name: str = MODEL_NAME, prompts: dict[str, list[str]] | None = None):
        import torch
        from transformers import AutoModel, AutoProcessor

        self.torch = torch
        self.prompts = prompts or load_prompts()
        self.processor = AutoProcessor.from_pretrained(model_name)
        self.model = AutoModel.from_pretrained(model_name).eval()
        self._lock = threading.Lock()
        self._labels: list[str] = []
        texts: list[str] = []
        for cat, ps in self.prompts.items():
            for p in ps:
                self._labels.append(cat)
                texts.append(p)
        # SigLIP fue entrenado con padding a max_length=64.
        with torch.inference_mode():
            tok = self.processor(text=texts, padding="max_length", max_length=64,
                                 truncation=True, return_tensors="pt")
            self._text = self._norm(self._features(
                self.model.get_text_features(input_ids=tok["input_ids"])))
        self._scale = self.model.logit_scale.exp()
        self._bias = self.model.logit_bias

    @staticmethod
    def _features(out):
        return out if hasattr(out, "shape") else out.pooler_output

    @staticmethod
    def _norm(x):
        return x / x.norm(p=2, dim=-1, keepdim=True)

    def score(self, image: Image.Image) -> dict[str, float]:
        torch = self.torch
        with self._lock, torch.inference_mode():
            inputs = self.processor(images=image.convert("RGB"), return_tensors="pt")
            img = self._norm(self._features(
                self.model.get_image_features(pixel_values=inputs["pixel_values"])))
            logits = (img @ self._text.T) * self._scale + self._bias
        per_cat: dict[str, float] = {}
        for label, logit in zip(self._labels, logits[0].tolist()):
            per_cat[label] = max(logit, per_cat.get(label, -1e9))
        return softmax(per_cat)

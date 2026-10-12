# syntax=docker/dockerfile:1
FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 HF_HOME=/models
WORKDIR /srv

# Usuario sin privilegios; /models es suyo desde el inicio, así que no hace falta un chown
# posterior (que duplicaría en otra capa los ~1.5 GB de pesos).
RUN useradd --system --uid 1001 --create-home app \
    && mkdir /models && chown 1001:1001 /models

# torch CPU (más ligero). Para GPU, usa la imagen/índice de torch correspondiente.
COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install --extra-index-url https://download.pytorch.org/whl/cpu torch \
    && pip install -r requirements.txt

# Los pesos se descargan ANTES de copiar el código: un cambio en app/ no repite la descarga.
USER 1001:1001
RUN python -c "from transformers import AutoModel, AutoProcessor as P; n='google/siglip2-base-patch16-256'; P.from_pretrained(n); AutoModel.from_pretrained(n)"

COPY --chown=1001:1001 app ./app

ENV HF_HUB_OFFLINE=1
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD ["python", "-c", "import os,urllib.request as u; u.urlopen('http://127.0.0.1:%s/health' % os.environ.get('PORT','8000'), timeout=4)"]
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]

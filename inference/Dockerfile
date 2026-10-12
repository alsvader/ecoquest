FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1 HF_HOME=/models
WORKDIR /srv

# torch CPU (mas ligero). Para GPU, usa la imagen/indice de torch correspondiente.
COPY requirements.txt .
RUN pip install --extra-index-url https://download.pytorch.org/whl/cpu torch \
    && pip install -r requirements.txt

COPY app ./app
# Descarga los pesos en build para que el arranque no dependa de la red.
RUN python -c "from transformers import AutoModel, AutoProcessor as P; n='google/siglip2-base-patch16-256'; P.from_pretrained(n); AutoModel.from_pretrained(n)"

RUN useradd -m app && chown -R app /srv /models
USER app
ENV HF_HUB_OFFLINE=1
EXPOSE 8000
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]

FROM python:3.12-slim AS builder

WORKDIR /build
COPY gateway/requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

FROM python:3.12-slim AS runtime

RUN groupadd -r app && useradd -r -g app -d /app app

WORKDIR /app

COPY --from=builder /install /usr/local
COPY shared/ /app/shared/
COPY gateway/app/ /app/

RUN chown -R app:app /app

USER app

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health')" || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# Bootcamp Management System

This repository contains a containerized microservices baseline for a bootcamp management platform.

## Services

- **API Gateway** — single entry point, JWT validation, request routing
- **User Service** — authentication and roles
- **Bootcamp Service** — bootcamp scheduling and capacity
- **Registration Service** — student enrollment and slot validation
- **Showcase Service** — project submission and grading
- **Frontend** — Next.js role-based UI shell
- **PostgreSQL** — database-per-service pattern

## Quick Start (Local)

```bash
cd extracurricular
cp .env.example .env
docker compose up --build
```

- Gateway: http://localhost:8000
- Frontend: http://localhost:3000
- Health: http://localhost:8000/health

## Environment Variables

Copy `.env.example` to `.env` and update values before running in production:

```bash
cp .env.example .env
```

Never commit `.env` files. Required production secrets:

- `JWT_SECRET_KEY` — must not use the default value when `ENVIRONMENT=production`
- `POSTGRES_PASSWORD` — must not use `postgres` when `ENVIRONMENT=production`

## Production (Docker Compose on EC2)

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

The production overlay binds gateway and frontend to localhost only (for Nginx reverse proxy).

See `deploy/nginx/bootcamp.conf` for HTTPS-ready Nginx configuration.

## Kubernetes

Manifests are in `k8s/`. See `k8s/README.md` for apply order and configuration notes.

## CI/CD

GitHub Actions workflow `.github/workflows/deploy-ec2.yml` deploys on push to `main`.

Required GitHub Secrets:

| Secret | Description |
|--------|-------------|
| `EC2_HOST` | EC2 public IP or DNS |
| `EC2_USER` | SSH user (e.g. `ubuntu`) |
| `EC2_SSH_KEY` | Private SSH key |
| `JWT_SECRET_KEY` | Production JWT secret |
| `POSTGRES_PASSWORD` | Database password |
| `NEXT_PUBLIC_API_URL` | Public API URL (e.g. `https://your-domain.com/api`) |
| `CORS_ORIGINS` | Allowed CORS origins |

## Health Endpoints

Every service exposes:

- `GET /health` — service status
- `GET /live` — liveness probe
- `GET /ready` — readiness probe (includes DB check where applicable)

## End-to-end test flow

1. Register a user
   ```bash
   curl -X POST http://localhost:8000/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"student@example.com","full_name":"Student One","password":"123456","role":"student"}'
   ```

2. Log in and receive a JWT
   ```bash
   curl -X POST http://localhost:8000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"student@example.com","password":"123456"}'
   ```

3. Create a bootcamp using the token
   ```bash
   curl -X POST http://localhost:8000/api/v1/bootcamps/ \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <TOKEN>" \
     -d '{"title":"AI Bootcamp","description":"Intro to AI","location":"Accra","start_date":"2026-07-01T09:00:00","end_date":"2026-07-10T17:00:00","max_slots":20}'
   ```

4. Register for the bootcamp
   ```bash
   curl -X POST http://localhost:8000/api/v1/registrations/ \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <TOKEN>" \
     -d '{"student_id":1,"bootcamp_id":1}'
   ```

# Deployment Guide (AWS EC2)

This document describes how to deploy the Bootcamp Management System to your Ubuntu EC2 instance using Docker Compose and GitHub Actions.

## Environment Details

| Setting | Value |
|---------|-------|
| EC2 OS | Ubuntu |
| SSH user | `ubuntu` |
| Project path | `/home/ubuntu/bootcamp-management-system` |
| Compose directory | `/home/ubuntu/bootcamp-management-system/extracurricular` |
| Branch | `main` |
| Public IP | `15.188.62.236` |
| Deployment method | Docker Compose (`docker-compose.yml` + `docker-compose.prod.yml`) |

---

## Required GitHub Secrets

Configure these in your repository: **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Required | Example / Description |
|--------|----------|---------------------|
| `EC2_HOST` | Yes | `15.188.62.236` — public IP or DNS of your EC2 instance |
| `EC2_USER` | Yes | `ubuntu` |
| `EC2_SSH_KEY` | Yes | Full contents of your private SSH key (`.pem` file) |
| `POSTGRES_USER` | No | Defaults to `postgres` if not set |
| `POSTGRES_PASSWORD` | Yes | Strong random password for PostgreSQL |
| `JWT_SECRET_KEY` | Yes | Generate with `openssl rand -hex 32` |
| `NEXT_PUBLIC_API_URL` | Yes | Browser-accessible gateway URL (see below) |
| `CORS_ORIGINS` | Yes | Comma-separated allowed origins for the gateway |

### Choosing `NEXT_PUBLIC_API_URL` and `CORS_ORIGINS`

**With Nginx reverse proxy (recommended for production):**

```
NEXT_PUBLIC_API_URL=http://15.188.62.236/api
CORS_ORIGINS=http://15.188.62.236
```

**With a domain and HTTPS:**

```
NEXT_PUBLIC_API_URL=https://your-domain.com/api
CORS_ORIGINS=https://your-domain.com
```

**Direct port access (development only — not used with `docker-compose.prod.yml`):**

```
NEXT_PUBLIC_API_URL=http://15.188.62.236:8000
CORS_ORIGINS=http://15.188.62.236:3000
```

> `docker-compose.prod.yml` binds gateway and frontend to `127.0.0.1` only. Public access requires Nginx (see `deploy/nginx/bootcamp.conf`) or a load balancer in front of the instance.

---

## One-Time EC2 Setup

SSH into your instance:

```bash
ssh -i your-key.pem ubuntu@15.188.62.236
```

### 1. Install Docker

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-plugin git curl
sudo usermod -aG docker ubuntu
```

Log out and back in so the `docker` group applies.

Verify:

```bash
docker --version
docker compose version
```

### 2. Clone the repository

```bash
git clone <your-repo-url> /home/ubuntu/bootcamp-management-system
cd /home/ubuntu/bootcamp-management-system/extracurricular
```

### 3. (Optional) Manual first deploy

```bash
cp .env.example .env
# Edit .env with production values
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
curl http://127.0.0.1:8000/health
```

---

## CI/CD Pipeline

Workflow file: [`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml)

### Trigger

Runs automatically on every **push to `main`**.

### What the pipeline does

1. Checks out the repository (validation step).
2. SSHs into EC2 as `ubuntu@15.188.62.236`.
3. Verifies Docker and Docker Compose are installed.
4. Pulls the latest `main` branch at `/home/ubuntu/bootcamp-management-system`.
5. Detects the compose directory (`extracurricular/` or repo root).
6. Writes a production `.env` file from GitHub Secrets.
7. Runs `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build`.
8. Waits up to 150 seconds for `http://127.0.0.1:8000/health` to return OK.
9. On success: runs `docker image prune -f` to free disk space.
10. On failure: prints container status and logs from gateway, user_service, postgres, and frontend.

### Health check endpoint

The API Gateway exposes:

```
GET /health  →  {"status":"ok","service":"gateway"}
```

This is a lightweight liveness check that does not require authentication. The CI/CD pipeline uses it to confirm deployment success.

---

## Docker Compose Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Base stack — all services, networks, health checks, env var wiring |
| `docker-compose.prod.yml` | Production overlay — hides internal ports, binds gateway/frontend to localhost |

### Production overlay behaviour

- **Postgres** — not exposed publicly (no host port mapping).
- **Internal services** (user, bootcamp, registration, showcase) — not exposed publicly.
- **Gateway** — `127.0.0.1:8000` (for Nginx upstream).
- **Frontend** — `127.0.0.1:3000` (for Nginx upstream).

Run production stack:

```bash
cd /home/ubuntu/bootcamp-management-system/extracurricular
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

---

## Environment Variables During Deployment

The GitHub Actions workflow generates `.env` in the compose directory on each deploy. Docker Compose reads this file automatically for variable substitution.

Variables written during CI/CD:

| Variable | Source |
|----------|--------|
| `POSTGRES_USER` | GitHub Secret (default: `postgres`) |
| `POSTGRES_PASSWORD` | GitHub Secret |
| `JWT_SECRET_KEY` | GitHub Secret |
| `NEXT_PUBLIC_API_URL` | GitHub Secret (also passed as Docker build arg for frontend) |
| `CORS_ORIGINS` | GitHub Secret |
| `USER_DATABASE_URL` etc. | Constructed from Postgres credentials |
| `ENVIRONMENT` | Always `production` |

All services receive their configuration through `docker-compose.yml` `${VAR}` references, which resolve from `.env`.

---

## Manual Recovery After a Failed Deployment

### 1. Check GitHub Actions logs

Open the failed workflow run in GitHub → Actions. The SSH step prints container logs on failure.

### 2. SSH into EC2 and inspect

```bash
ssh -i your-key.pem ubuntu@15.188.62.236
cd /home/ubuntu/bootcamp-management-system/extracurricular

docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs --tail=100 gateway
curl -v http://127.0.0.1:8000/health
```

### 3. Common fixes

| Problem | Fix |
|---------|-----|
| `docker compose` not found | `sudo apt install -y docker-compose-plugin` |
| Permission denied on Docker | `sudo usermod -aG docker ubuntu`, then re-login |
| Gateway unhealthy | Check `JWT_SECRET_KEY` is set and not the default |
| Postgres unhealthy | Check `POSTGRES_PASSWORD` in `.env`; may need `docker compose down -v` on first init |
| Frontend build fails | Verify `NEXT_PUBLIC_API_URL` secret is set |
| Health check timeout | Services may need more startup time — check `docker compose ps` for `(unhealthy)` |
| Out of disk space | `docker system prune -af` (removes unused images/containers) |

### 4. Roll back to previous commit

```bash
cd /home/ubuntu/bootcamp-management-system
git log --oneline -5
git reset --hard <previous-commit-sha>
cd extracurricular
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

### 5. Full reset (destroys database data)

```bash
cd /home/ubuntu/bootcamp-management-system/extracurricular
docker compose -f docker-compose.yml -f docker-compose.prod.yml down -v
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

---

## Nginx Setup (Public Access)

With `docker-compose.prod.yml`, expose the app publicly through Nginx:

```bash
sudo apt install -y nginx
sudo cp deploy/nginx/proxy-params.conf /etc/nginx/snippets/proxy-params.conf
sudo cp deploy/nginx/bootcamp.conf /etc/nginx/sites-available/bootcamp
# Edit server_name to 15.188.62.236 or your domain
sudo ln -s /etc/nginx/sites-available/bootcamp /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Ensure EC2 security group allows inbound **80** and **443** (not 8000/3000 directly).

---

## Verify Deployment

```bash
# On EC2 (internal)
curl http://127.0.0.1:8000/health

# From your machine (via Nginx)
curl http://15.188.62.236/api/health
```

Expected response:

```json
{"status":"ok","service":"gateway"}
```

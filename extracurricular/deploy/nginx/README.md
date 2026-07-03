# Nginx reverse proxy for Bootcamp Management System

Exposes the app publicly on EC2 at **http://15.188.62.236**.

| Path | Backend |
|------|---------|
| `/` | Next.js frontend (`127.0.0.1:3000`) |
| `/api/` | API gateway (`127.0.0.1:8000`) |
| `/health` | Gateway health check |

## Prerequisites

1. Docker stack running with prod overlay:
   ```bash
   cd /home/ubuntu/bootcamp-management-system/extracurricular
   docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
   curl http://127.0.0.1:8000/health
   curl http://127.0.0.1:3000/
   ```

2. EC2 security group allows **inbound TCP 80** from `0.0.0.0/0` (or your IP range).

## One-time install on EC2

```bash
ssh -i your-key.pem ubuntu@15.188.62.236
cd /home/ubuntu/bootcamp-management-system
git pull origin main
bash extracurricular/deploy/nginx/install-nginx.sh
```

## Verify public access

From your local machine:

```bash
curl http://15.188.62.236/health
curl http://15.188.62.236/
```

Register a user via the API:

```bash
curl -X POST http://15.188.62.236/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","full_name":"Student One","password":"123456","role":"student"}'
```

## Update GitHub Secrets (required for frontend)

After Nginx is live, update these secrets and push to `main` to rebuild the frontend:

| Secret | Value |
|--------|-------|
| `NEXT_PUBLIC_API_URL` | `http://15.188.62.236/api` |
| `CORS_ORIGINS` | `http://15.188.62.236` |

The CI/CD pipeline will rebuild the frontend with the correct public API URL.

## HTTPS (optional, when you have a domain)

See `bootcamp-ssl.conf.example` and run:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

Then update `NEXT_PUBLIC_API_URL` and `CORS_ORIGINS` to use `https://your-domain.com`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| 502 Bad Gateway | Check Docker: `curl http://127.0.0.1:8000/health` |
| Connection refused on :80 | Open port 80 in EC2 security group |
| `nginx -t` fails | Run install script again after `git pull` |
| CORS errors in browser | Set `CORS_ORIGINS=http://15.188.62.236` and redeploy |
| Frontend calls wrong API | Set `NEXT_PUBLIC_API_URL=http://15.188.62.236/api` and redeploy |

## Files

| File | Purpose |
|------|---------|
| `bootcamp.conf` | Active HTTP config for EC2 IP |
| `proxy-params.conf` | Shared proxy headers |
| `install-nginx.sh` | Automated EC2 setup script |
| `bootcamp-ssl.conf.example` | HTTPS template for future domain |

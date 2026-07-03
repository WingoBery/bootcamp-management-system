#!/usr/bin/env bash
# Install and configure Nginx as reverse proxy for the Bootcamp Management System.
# Run on EC2 as ubuntu (uses sudo):
#   bash deploy/nginx/install-nginx.sh

set -euo pipefail

APP_DIR="${APP_DIR:-/home/ubuntu/bootcamp-management-system}"
NGINX_DIR="${APP_DIR}/extracurricular/deploy/nginx"
SITE_NAME="bootcamp"

if [ ! -f "${NGINX_DIR}/bootcamp.conf" ]; then
  echo "ERROR: ${NGINX_DIR}/bootcamp.conf not found."
  echo "Ensure the repo is cloned at ${APP_DIR} and pull the latest main branch."
  exit 1
fi

echo "==> Installing Nginx..."
sudo apt-get update -qq
sudo apt-get install -y nginx

echo "==> Installing proxy snippet..."
sudo mkdir -p /etc/nginx/snippets
sudo cp "${NGINX_DIR}/proxy-params.conf" /etc/nginx/snippets/proxy-params.conf

echo "==> Installing site config..."
sudo cp "${NGINX_DIR}/bootcamp.conf" "/etc/nginx/sites-available/${SITE_NAME}"

echo "==> Enabling site (disabling default)..."
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf "/etc/nginx/sites-available/${SITE_NAME}" "/etc/nginx/sites-enabled/${SITE_NAME}"

echo "==> Verifying Docker services are listening on localhost..."
if ! curl -fsS http://127.0.0.1:8000/health >/dev/null 2>&1; then
  echo "WARNING: Gateway not reachable at http://127.0.0.1:8000/health"
  echo "Start the stack first:"
  echo "  cd ${APP_DIR}/extracurricular"
  echo "  docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d"
fi

if ! curl -fsS http://127.0.0.1:3000/ >/dev/null 2>&1; then
  echo "WARNING: Frontend not reachable at http://127.0.0.1:3000/"
fi

echo "==> Testing Nginx configuration..."
sudo nginx -t

echo "==> Reloading Nginx..."
sudo systemctl enable nginx
sudo systemctl reload nginx

PUBLIC_IP="${PUBLIC_IP:-15.188.62.236}"
echo ""
echo "Nginx is configured."
echo "  Frontend:  http://${PUBLIC_IP}/"
echo "  API:       http://${PUBLIC_IP}/api/v1/..."
echo "  Health:    http://${PUBLIC_IP}/health"
echo ""
echo "Ensure EC2 security group allows inbound TCP 80 (and 443 later for HTTPS)."
echo ""
echo "Update GitHub Secrets and redeploy so the frontend uses the public API URL:"
echo "  NEXT_PUBLIC_API_URL=http://${PUBLIC_IP}/api"
echo "  CORS_ORIGINS=http://${PUBLIC_IP}"

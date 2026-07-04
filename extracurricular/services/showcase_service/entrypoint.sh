#!/bin/sh
set -e
cd /app

mkdir -p /app/uploads
chown -R app:app /app/uploads 2>/dev/null || true

echo "Waiting for database..."
su -s /bin/sh app -c "python /app/shared/wait_for_db.py"

echo "Running migrations..."
su -s /bin/sh app -c "python /app/shared/run_migrations.py showcases"

echo "Starting application..."
exec su -s /bin/sh app -c "exec uvicorn main:app --host 0.0.0.0 --port 8000"

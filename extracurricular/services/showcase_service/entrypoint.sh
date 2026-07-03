#!/bin/sh
set -e
cd /app

echo "Waiting for database..."
python /app/shared/wait_for_db.py

echo "Running migrations..."
python /app/shared/run_migrations.py showcases

echo "Starting application..."
exec uvicorn main:app --host 0.0.0.0 --port 8000

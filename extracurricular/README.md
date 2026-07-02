# Bootcamp Management System

This repository contains a containerized microservices baseline for a bootcamp management platform.

## Services
- User service for authentication and roles
- Bootcamp service for bootcamp scheduling and capacity
- Registration service for student enrollment and slot validation
- Showcase service for project submission and grading
- API gateway for routing requests

## Run locally

```bash
docker compose up --build
```

The gateway will be available at http://localhost:8000 and the frontend at http://localhost:3000.

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

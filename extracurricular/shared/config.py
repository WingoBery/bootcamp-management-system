import os


def require_env(name: str, default: str | None = None) -> str:
    value = os.getenv(name, default)
    if value is None or value == "":
        raise RuntimeError(f"Required environment variable '{name}' is not set")
    return value


def validate_production_secrets() -> None:
    environment = os.getenv("ENVIRONMENT", "development").lower()
    if environment != "production":
        return

    jwt_secret = os.getenv("JWT_SECRET_KEY", "")
    if jwt_secret in ("", "change-me-in-production"):
        raise RuntimeError("JWT_SECRET_KEY must be set to a secure value in production")

    postgres_password = os.getenv("POSTGRES_PASSWORD", "")
    if postgres_password in ("", "postgres"):
        raise RuntimeError("POSTGRES_PASSWORD must be changed in production")

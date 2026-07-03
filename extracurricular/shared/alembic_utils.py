def set_alembic_database_url(config, database_url: str | None) -> None:
    """Set sqlalchemy.url for Alembic, escaping % for ConfigParser."""
    if not database_url:
        raise RuntimeError("DATABASE_URL is not set")
    config.set_main_option("sqlalchemy.url", database_url.replace("%", "%%"))

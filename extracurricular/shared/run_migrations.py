import os
import subprocess
import sys

from sqlalchemy import create_engine, inspect


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: run_migrations.py <table_name>", file=sys.stderr)
        sys.exit(1)

    table_name = sys.argv[1]
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL is not set", file=sys.stderr)
        sys.exit(1)

    print(f"Running alembic upgrade head (table marker: {table_name})...")
    result = subprocess.run(["alembic", "upgrade", "head"], check=False)

    if result.returncode == 0:
        print("Alembic upgrade head succeeded")
        return

    print(f"Alembic upgrade failed with exit code {result.returncode}", file=sys.stderr)

    engine = create_engine(database_url, pool_pre_ping=True)
    if inspect(engine).has_table(table_name):
        print(f"Table '{table_name}' already exists; stamping alembic revision as head")
        stamp_result = subprocess.run(["alembic", "stamp", "head"], check=False)
        if stamp_result.returncode != 0:
            sys.exit(stamp_result.returncode)
        print("Alembic stamp head succeeded")
        return

    sys.exit(result.returncode)


if __name__ == "__main__":
    main()

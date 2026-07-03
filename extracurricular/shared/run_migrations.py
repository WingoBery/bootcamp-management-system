import subprocess
import sys


def main() -> None:
    if len(sys.argv) != 2:
        print("Usage: run_migrations.py <table_name>", file=sys.stderr)
        sys.exit(1)

    table_name = sys.argv[1]
    print(f"Running alembic upgrade head (table marker: {table_name})...")
    result = subprocess.run(["alembic", "upgrade", "head"], check=False)

    if result.returncode == 0:
        print("Alembic upgrade head succeeded")
        return

    print(f"Alembic upgrade failed with exit code {result.returncode}", file=sys.stderr)

    from sqlalchemy import inspect

    from database.connection import engine

    if inspect(engine).has_table(table_name):
        print(f"Table '{table_name}' already exists; stamping alembic revision as head")
        subprocess.run(["alembic", "stamp", "head"], check=True)
        print("Alembic stamp head succeeded")
        return

    sys.exit(result.returncode)


if __name__ == "__main__":
    main()

import os
import sys
import time

from sqlalchemy import create_engine, text


def main() -> None:
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("ERROR: DATABASE_URL is not set", file=sys.stderr)
        sys.exit(1)

    engine = create_engine(database_url, pool_pre_ping=True)
    max_attempts = 60

    for attempt in range(1, max_attempts + 1):
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))
            print("Database is reachable")
            return
        except Exception as exc:
            print(f"Database not ready (attempt {attempt}/{max_attempts}): {exc}")
            time.sleep(2)

    print("ERROR: Database did not become reachable in time", file=sys.stderr)
    sys.exit(1)


if __name__ == "__main__":
    main()

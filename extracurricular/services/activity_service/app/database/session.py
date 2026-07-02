from sqlalchemy.orm import sessionmaker
from database.connection import engine

Session = sessionmaker(
    autocommit = False,
    autoflush= False,
    bind = engine
)

def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()

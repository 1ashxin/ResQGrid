"""
WHAT THIS FILE DOES (plain English):
This file is the "phone line" between our FastAPI app and the PostgreSQL
database. It sets up the connection settings and gives every API route a
safe way to "borrow" a database session, use it, and hand it back when done.

Beginner note: think of the database like a filing cabinet full of folders
(tables). SQLAlchemy is a Python library that lets us open, read, and write
those folders using normal Python code instead of writing raw SQL by hand
every time.
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# python-dotenv reads the ".env" file (a private settings file that is never
# committed to git) and loads its values so we can read them with os.getenv().
load_dotenv()

# The database connection string. Format:
# postgresql://<username>:<password>@<host>:<port>/<database_name>
# We read it from .env instead of hardcoding it, so secrets never end up in git.
DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/resqgrid"
)

# The "engine" is the actual connection manager that knows how to talk to PostgreSQL.
engine = create_engine(DATABASE_URL)

# SessionLocal is a factory that creates new "conversations" (sessions) with
# the database. Every API request that needs the database creates one of
# these, uses it, then closes it.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base is the parent class every database table (model) in models.py will
# inherit from. It's how SQLAlchemy knows "this Python class represents a
# database table."
Base = declarative_base()


def get_db():
    """
    Simple explanation: this function hands a database session to whichever
    API route asks for it (FastAPI calls this automatically via "dependency
    injection"), and makes sure the session is always closed afterwards --
    even if something goes wrong along the way.

    Analogy: like borrowing a library book. You check it out, use it, and
    this function guarantees it always gets returned to the shelf.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

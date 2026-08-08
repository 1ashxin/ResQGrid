"""
WHAT THIS FILE DOES (plain English):
This is the front door of our backend. Running this file starts the whole
API server. It creates the FastAPI application, connects all the individual
routers (sos, volunteers, shelters, users) to it, and (for local
development convenience only) makes sure the database tables exist.

Beginner note: FastAPI is a Python framework for building web APIs -- code
that listens for HTTP requests (like a website's "back office") and replies
with JSON data instead of HTML pages. Uvicorn is the actual program that
runs this file and listens on a network port -- FastAPI is the recipe,
Uvicorn is the stove that cooks it.
"""

from fastapi import FastAPI

from .database import Base, engine
from .routers import sos, volunteers, shelters, users

# Creates any tables described in models.py that don't already exist yet.
# This is a convenient shortcut for local development. schema.sql (in the
# project root) is the "official" hand-written schema that Member 4 will
# extend with PostGIS -- once that's the source of truth, this line becomes
# optional.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ResQGrid API",
    description="Backend API for disaster relief coordination: SOS requests, volunteers, shelters, and user roles.",
    version="0.1.0",
)

# Each router below "plugs in" a group of related endpoints -- e.g.
# everything under /sos/... comes from routers/sos.py.
app.include_router(users.router)
app.include_router(sos.router)
app.include_router(volunteers.router)
app.include_router(shelters.router)


@app.get("/")
def read_root():
    """A simple health-check endpoint so you can confirm the server is running."""
    return {"status": "ok", "service": "ResQGrid API"}

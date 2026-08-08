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
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import geo, shelters, sos, users, volunteers

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

# Lets the frontend (running on a different port during development) call
# this API from the browser. Vite's default dev server ports are covered;
# without this, browsers block the requests even though the server itself
# would happily respond.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Each router below "plugs in" a group of related endpoints -- e.g.
# everything under /sos/... comes from routers/sos.py.
app.include_router(users.router)
app.include_router(sos.router)
app.include_router(volunteers.router)
app.include_router(shelters.router)
app.include_router(geo.router)


@app.get("/")
def read_root():
    """A simple health-check endpoint so you can confirm the server is running."""
    return {"status": "ok", "service": "ResQGrid API"}

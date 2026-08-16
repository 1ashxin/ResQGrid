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

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import geo, ngo, resources, shelters, sos, users, volunteers
from .seed import seed_database


def apply_schema_sql():
    """
    Runs schema.sql against the database on every startup. schema.sql is
    the source of truth -- it has the PostGIS `geography` columns and GIST
    indexes that app/models.py deliberately leaves out (see the comments in
    models.py next to current_lat/current_lng). Every statement in
    schema.sql uses IF NOT EXISTS, so re-running it on a database that
    already has the tables is a safe no-op.

    This exists because Base.metadata.create_all() below only knows about
    columns declared in models.py. If it ever runs first against a brand
    new, empty database (e.g. a fresh Supabase DB on first deploy), it
    would create sos_requests/volunteer_profiles/shelters WITHOUT the
    geography columns -- and every raw-SQL query in geo_spatial.py would
    then fail with "column does not exist". Running schema.sql first
    guarantees those columns exist no matter which environment boots first.
    """
    schema_path = Path(__file__).resolve().parent.parent / "schema.sql"
    sql = schema_path.read_text()

    raw_conn = engine.raw_connection()
    try:
        cursor = raw_conn.cursor()
        cursor.execute(sql)
        raw_conn.commit()
    finally:
        raw_conn.close()


apply_schema_sql()

# Creates any tables described in models.py that aren't in schema.sql yet
# (currently just security_audit_logs). Tables schema.sql already created
# above are left untouched.
Base.metadata.create_all(bind=engine)

# Loads the real NGO/shelter/resource data from BackEnd/seeds/*.csv. Safe to
# re-run (see seed.py) -- without this the dashboards come up with an empty
# shelters table. Seeding must never take the whole API down, so a failure
# here is reported and the server still starts.
try:
    seed_database()
except Exception as exc:  # noqa: BLE001 - startup must survive any seed failure
    print(f"WARNING: database seeding failed ({exc}). API starting without seed data.")

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
    # Vite auto-increments the port (5174, 5175, ...) if 5173 is already
    # taken by another running dev server, so a few extra ports are
    # allowed here too rather than hardcoding just one.
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):517[3-9]",
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
app.include_router(resources.router)
app.include_router(ngo.router)


@app.get("/")
def read_root():
    """A simple health-check endpoint so you can confirm the server is running."""
    return {"status": "ok", "service": "ResQGrid API"}

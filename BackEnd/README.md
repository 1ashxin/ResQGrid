# ResQGrid Backend

This is the FastAPI + PostgreSQL backend for ResQGrid. If you've never built
a backend before, read "Concepts in Plain English" below before running any
commands -- every new term is explained there first.

## What this backend actually does

This backend is a FastAPI web server. The frontend apps (`../FrontEnd`)
send it HTTP requests -- e.g. "create this SOS request" or "get all
shelters" -- and it validates the request, runs the needed logic, and
sends back a response as JSON data. A PostgreSQL database stores all of
that data permanently between requests: users, SOS requests, volunteer
profiles, and shelters all live there.

## Concepts in Plain English

- **API** -- a defined set of URLs the frontend is allowed to call to get or
  send data. Like a restaurant menu of things you can order.
- **FastAPI** -- the Python framework/library we use to build those URLs
  quickly, with automatic input checking and free interactive docs.
- **Uvicorn** -- the program that actually runs our FastAPI app and listens
  for incoming network requests, passing each one to FastAPI to handle.
- **PostgreSQL** -- the database where all data is permanently stored:
  users, SOS requests, volunteers, shelters.
- **SQLAlchemy (ORM)** -- a Python library that lets us read/write database
  rows using normal Python objects and classes, instead of writing raw SQL
  by hand for every query. ("ORM" = Object-Relational Mapper.)
-  **Pydantic schema** -- a strict definition of the fields and types a
  request must contain, checked before our code touches it, and used to
  shape the JSON we send back in responses.
- **bcrypt** -- an algorithm that turns a password into an irreversible
  scrambled hash, so we never store what a user actually typed.
- **Fernet encryption** -- a way to encrypt and decrypt text using one
  secret key. Used here to protect victims' name/phone/description.
- **.env file** -- a private text file (never committed to git) holding
  secrets like your database password and encryption key.
- **PostGIS** -- a PostgreSQL extension for geographic/location queries
  (e.g. "find every volunteer within 5 km").

## One-time setup

1. **Install Python 3.11+** if you don't have it: https://www.python.org/downloads/
2. **Install PostgreSQL** if you don't have it: https://www.postgresql.org/download/
   Then create a database, e.g. in a terminal:
   ```
   createdb resqgrid
   ```
3. **Install PostGIS** -- the spatial extension the SOS/volunteer/shelter
   location features (nearest-volunteer lookups, etc.) depend on.
   - Windows: open **Stack Builder** (bundled with the PostgreSQL
     installer, or launchable from the Start Menu) and install the
     "Spatial Extensions" > PostGIS package for your PostgreSQL version.
   - macOS/Linux: install the `postgis` package for your distro, e.g.
     `brew install postgis` or `apt install postgresql-<version>-postgis-3`.
4. **Database schema** -- `schema.sql` is the source of truth: it creates
   every table plus the PostGIS `geography(Point, 4326)` columns and
   spatial indexes the app relies on. You don't need to run it by hand --
   `app/main.py` applies it automatically every time the server starts
   (every statement uses `IF NOT EXISTS`, so re-running it is always
   safe, no matter how many times you restart the server). If you'd
   rather apply it yourself first, e.g. to inspect the tables before
   starting the server, you can still run:
   ```
   psql -U postgres -d resqgrid -f schema.sql
   ```
5. **Open a terminal in the `BackEnd` folder** and create a virtual
   environment (an isolated folder of Python packages just for this
   project, so it doesn't clash with anything else on your computer):
   ```
   python -m venv venv
   venv\Scripts\activate
   ```
6. **Install the required libraries:**
   ```
   pip install -r requirements.txt
   ```
7. **Create your secrets file:**
   ```
   copy .env.example .env
   ```
   Then open `.env` and set `DATABASE_URL` to match your PostgreSQL setup,
   and generate a real encryption key by running:
   ```
   python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
   ```
   Paste the output as the value of `FERNET_KEY` in `.env`.

## Running the server

```
uvicorn app.main:app --reload
```

- `--reload` restarts the server automatically whenever you save a code
  change -- handy while developing.
- Once running, open **http://127.0.0.1:8000/docs** in a browser. FastAPI
  automatically builds an interactive page there where you can try every
  endpoint by clicking buttons -- no extra tools needed to test the API.
- Login currently checks email/password but does not yet issue an auth
  token (e.g. JWT), and no endpoint is locked down by role yet. This is
  intentionally out of scope for Aug 6/7 (basic CRUD + schema) and is
  expected to be added once the core flow works end-to-end.

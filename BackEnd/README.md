# ResQGrid Backend (Member 3)

This is the FastAPI + PostgreSQL backend for ResQGrid. If you've never built
a backend before, read "Concepts in Plain English" below before running any
commands -- every new term is explained there first.

## What this backend actually does

Think of this backend as the "kitchen" behind a restaurant's dining room
(the frontend apps in `../FrontEnd`). Customers (victims, volunteers,
admins, NGOs) never walk into the kitchen -- they place orders (HTTP
requests) from their table, and the kitchen (this backend) prepares and
returns a response (JSON data), while the fridge (the PostgreSQL database)
stores everything long-term.

## Concepts in Plain English

- **API** -- a defined set of URLs the frontend is allowed to call to get or
  send data. Like a restaurant menu of things you can order.
- **FastAPI** -- the Python framework/library we use to build that menu of
  URLs quickly, with automatic input checking and free interactive docs.
- **Uvicorn** -- the program that actually runs our FastAPI app and listens
  for incoming requests. FastAPI is the recipe; Uvicorn is the stove.
- **PostgreSQL** -- the database (the "fridge") where all data is
  permanently stored: users, SOS requests, volunteers, shelters.
- **SQLAlchemy (ORM)** -- a Python library that lets us read/write database
  rows using normal Python objects and classes, instead of writing raw SQL
  by hand for every query. ("ORM" = Object-Relational Mapper.)
- **Pydantic schema** -- a strict "form template" that checks incoming JSON
  has the right fields and types before our code touches it, and shapes
  outgoing JSON responses.
- **bcrypt** -- an algorithm that turns a password into an irreversible
  scrambled hash, so we never store what a user actually typed.
- **Fernet encryption** -- a way to lock (encrypt) and unlock (decrypt) text
  using one secret key. Used here to protect victims' name/phone/description.
- **.env file** -- a private text file (never committed to git) holding
  secrets like your database password and encryption key.
- **PostGIS** -- a PostgreSQL extension for geographic/location queries
  (e.g. "find every volunteer within 5 km"). Not wired up yet -- look for
  the `MEMBER 4 HOOK` comments in `schema.sql`.

## Folder structure

```
BackEnd/
  app/
    main.py            <- starts the server, plugs in all the routers
    database.py        <- connects to PostgreSQL
    security.py         <- password hashing + Fernet encryption
    models.py            <- database table definitions (SQLAlchemy)
    schemas.py             <- API request/response shapes (Pydantic)
    routers/
      users.py              <- register / login / role management endpoints
      sos.py                  <- victim SOS request endpoints
      volunteers.py             <- volunteer profile endpoints
      shelters.py                <- shelter capacity endpoints
  schema.sql              <- hand-written SQL schema (PostGIS hooks for Member 4)
  requirements.txt        <- list of Python libraries this project needs
  .env.example             <- template for your local secrets file
```

## One-time setup

1. **Install Python 3.11+** if you don't have it: https://www.python.org/downloads/
2. **Install PostgreSQL** if you don't have it: https://www.postgresql.org/download/
   Then create a database, e.g. in a terminal:
   ```
   createdb resqgrid
   ```
3. **Open a terminal in the `BackEnd` folder** and create a virtual
   environment (an isolated folder of Python packages just for this
   project, so it doesn't clash with anything else on your computer):
   ```
   python -m venv venv
   venv\Scripts\activate
   ```
4. **Install the required libraries:**
   ```
   pip install -r requirements.txt
   ```
5. **Create your secrets file:**
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

-- WHAT THIS FILE DOES (plain English):
-- This is the master blueprint for our PostgreSQL database, written in raw
-- SQL. Our Python code (app/models.py) can auto-create matching tables for
-- local development, but this file is the readable, reviewable "source of
-- truth" -- and it's where Member 4 plugs in PostGIS spatial columns.
--
-- Beginner note: SQL is the language databases understand. "CREATE TABLE"
-- is like defining a new tab in a spreadsheet, with named, typed columns.

-- pgcrypto provides gen_random_uuid(), used below to auto-generate IDs.
-- (On PostgreSQL 13+, gen_random_uuid() ships in core and this is a no-op.)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enables PostGIS -- the geography(Point, 4326) columns below and the
-- ST_Distance/ST_DWithin spatial queries depend on this.
CREATE EXTENSION IF NOT EXISTS postgis;

-- -----------------------------------------------------------------------------
-- USERS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    role            TEXT NOT NULL CHECK (role IN ('victim', 'volunteer', 'admin', 'ngo')),
    created_at      TIMESTAMP NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- VOLUNTEER PROFILES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS volunteer_profiles (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id),
    full_name       TEXT NOT NULL,
    phone           TEXT NOT NULL,
    skills          TEXT,
    is_available    BOOLEAN NOT NULL DEFAULT TRUE,

    current_lat     DOUBLE PRECISION,
    current_lng     DOUBLE PRECISION,
    current_location geography(Point, 4326),

    created_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS volunteer_profiles_location_idx
    ON volunteer_profiles USING GIST (current_location);

-- -----------------------------------------------------------------------------
-- NGO PROFILES (Updated with PostGIS location fields)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ngo_profiles (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              UUID NOT NULL UNIQUE REFERENCES users(id),
    org_name             TEXT NOT NULL,
    registration_number TEXT NOT NULL,
    contact_person       TEXT NOT NULL,
    phone                TEXT NOT NULL,
    address              TEXT,

    -- Plain-number fallback location, mirrors volunteer_profiles/shelters.
    -- PostGIS spatial column kept in sync by app/geo_spatial.py's
    -- sync_ngo_geography (also used by seed_query.py).
    location_lat         DOUBLE PRECISION,
    location_lng         DOUBLE PRECISION,
    location             geography(Point, 4326),

    volunteer_count      INTEGER,
    operation_areas      TEXT,
    emergency_contact    TEXT,
    services             TEXT,

    created_at           TIMESTAMP NOT NULL DEFAULT now()
);

-- ngo_profiles already existed in deployed databases before the columns
-- above were added, and CREATE TABLE IF NOT EXISTS is a no-op against an
-- existing table -- so these retrofit already-deployed tables the same way
-- the CREATE TABLE above covers brand new ones. Safe to re-run: IF NOT
-- EXISTS makes each ALTER a no-op once the column exists.
ALTER TABLE ngo_profiles ADD COLUMN IF NOT EXISTS location_lat DOUBLE PRECISION;
ALTER TABLE ngo_profiles ADD COLUMN IF NOT EXISTS location_lng DOUBLE PRECISION;
ALTER TABLE ngo_profiles ADD COLUMN IF NOT EXISTS location geography(Point, 4326);

-- Spatial index for fast nearest-NGO lookups
CREATE INDEX IF NOT EXISTS ngo_profiles_location_idx
    ON ngo_profiles USING GIST (location);

-- -----------------------------------------------------------------------------
-- SOS REQUESTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sos_requests (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    victim_name           TEXT NOT NULL,
    victim_phone          TEXT NOT NULL,
    description           TEXT,

    location_lat          DOUBLE PRECISION NOT NULL,
    location_lng          DOUBLE PRECISION NOT NULL,
    location              geography(Point, 4326),

    status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'assigned', 'in_progress', 'resolved')),
    priority_score        DOUBLE PRECISION,

    assigned_volunteer_id UUID REFERENCES users(id),

    created_at            TIMESTAMP NOT NULL DEFAULT now(),
    updated_at            TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sos_requests_location_idx
    ON sos_requests USING GIST (location);

-- -----------------------------------------------------------------------------
-- SHELTERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS shelters (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                TEXT NOT NULL,
    address             TEXT,

    location_lat        DOUBLE PRECISION NOT NULL,
    location_lng        DOUBLE PRECISION NOT NULL,
    location            geography(Point, 4326),

    capacity_total      INTEGER NOT NULL,
    capacity_occupied   INTEGER NOT NULL DEFAULT 0,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,

    managed_by_user_id  UUID REFERENCES users(id),

    created_at          TIMESTAMP NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS shelters_location_idx
    ON shelters USING GIST (location);

-- -----------------------------------------------------------------------------
-- RESOURCES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS resources (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                TEXT NOT NULL,
    quantity            NUMERIC NOT NULL,
    unit                TEXT NOT NULL,

    status              TEXT NOT NULL DEFAULT 'good' CHECK (status IN ('good', 'moderate', 'low')),

    managed_by_user_id  UUID REFERENCES users(id),

    created_at          TIMESTAMP NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP NOT NULL DEFAULT now()
);

-- -----------------------------------------------------------------------------
-- INDEXES
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_sos_requests_status ON sos_requests(status);
CREATE INDEX IF NOT EXISTS idx_sos_requests_created_at ON sos_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_volunteer_profiles_is_available ON volunteer_profiles(is_available);

-- -----------------------------------------------------------------------------
-- DATA REPAIR: legacy uppercase enum values
-- -----------------------------------------------------------------------------
-- models.py maps these enums with values_callable, so they are stored as the
-- lowercase VALUE ('pending'), not the Python member NAME ('PENDING'). Rows
-- written before that mapping was added kept the uppercase name, and loading
-- one now raises LookupError: "'PENDING' is not among the defined enum
-- values" -- a 500 on GET /sos/ and GET /users/, i.e. every dashboard that
-- lists requests.
--
-- Normalising here (rather than in a one-off script) means any environment
-- carrying those legacy rows repairs itself on the next startup. Each
-- statement is a no-op once the values are already lowercase.
UPDATE users         SET role   = lower(role)   WHERE role   <> lower(role);
UPDATE sos_requests  SET status = lower(status) WHERE status <> lower(status);
UPDATE resources     SET status = lower(status) WHERE status <> lower(status);

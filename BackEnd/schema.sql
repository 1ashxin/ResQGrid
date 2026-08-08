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
-- ST_Distance/ST_DWithin spatial queries in app/geo_spatial.py depend on
-- this. Requires PostGIS to be installed on the PostgreSQL server itself
-- (see BackEnd/README.md for the install steps).
CREATE EXTENSION IF NOT EXISTS postgis;

-- Roles are restricted with a CHECK constraint instead of a native Postgres
-- ENUM type, so the list of allowed roles can be changed later without a
-- schema migration. (Kept in sync with app/models.py UserRole.)

CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    role            TEXT NOT NULL CHECK (role IN ('victim', 'volunteer', 'admin', 'ngo')),
    created_at      TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS volunteer_profiles (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id        UUID NOT NULL UNIQUE REFERENCES users(id),
    full_name      TEXT NOT NULL,
    phone          TEXT NOT NULL,
    skills         TEXT,
    is_available   BOOLEAN NOT NULL DEFAULT TRUE,

    -- Plain-number fallback location, always kept up to date by the API.
    current_lat    DOUBLE PRECISION,
    current_lng    DOUBLE PRECISION,

    -- PostGIS spatial column, kept in sync with current_lat/current_lng by
    -- the application (see app/geo_spatial.py and the routers that call
    -- it) rather than a DB trigger, so the sync logic lives in one place.
    current_location geography(Point, 4326),

    created_at     TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS volunteer_profiles_location_idx
    ON volunteer_profiles USING GIST (current_location);

CREATE TABLE IF NOT EXISTS sos_requests (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Encrypted at the application layer (see app/security.py
    -- EncryptedString) before it ever reaches this table -- these columns
    -- hold Fernet ciphertext, not plain text, so a raw SQL dump never
    -- exposes victim PII.
    victim_name           TEXT NOT NULL,
    victim_phone          TEXT NOT NULL,
    description           TEXT,

    location_lat          DOUBLE PRECISION NOT NULL,
    location_lng          DOUBLE PRECISION NOT NULL,

    -- PostGIS spatial column -- powers "find nearest volunteer to this SOS
    -- ping" via ST_DWithin/ST_Distance (app/geo_spatial.py) instead of
    -- manual lat/lng math. Kept in sync with location_lat/location_lng by
    -- the application.
    location              geography(Point, 4326),

    status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'assigned', 'in_progress', 'resolved')),
    priority_score        DOUBLE PRECISION,  -- filled in later by Member 5's AI priority engine

    assigned_volunteer_id UUID REFERENCES users(id),

    created_at            TIMESTAMP NOT NULL DEFAULT now(),
    updated_at            TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS sos_requests_location_idx
    ON sos_requests USING GIST (location);

CREATE TABLE IF NOT EXISTS shelters (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                TEXT NOT NULL,
    address             TEXT,

    location_lat        DOUBLE PRECISION NOT NULL,
    location_lng        DOUBLE PRECISION NOT NULL,

    -- PostGIS spatial column -- useful for "shelters within N km of this
    -- SOS ping" queries. Kept in sync with location_lat/location_lng by
    -- the application.
    location            geography(Point, 4326),

    capacity_total      INTEGER NOT NULL,
    capacity_occupied   INTEGER NOT NULL DEFAULT 0,

    -- Soft-delete flag: closed/decommissioned shelters are marked inactive
    -- instead of being deleted outright, so historical capacity data isn't lost.
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,

    managed_by_user_id  UUID REFERENCES users(id),

    created_at          TIMESTAMP NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP NOT NULL DEFAULT now()
);

-- Emergency supply inventory (drinking water, food packets, medical kits,
-- tents, etc.) -- tracked separately from shelters since one NGO's supply
-- run typically serves multiple shelters/camps. Helps prevent duplicate
-- supply drops (multiple NGOs sending the same thing to one place).
CREATE TABLE IF NOT EXISTS resources (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                TEXT NOT NULL,
    quantity            NUMERIC NOT NULL,
    unit                TEXT NOT NULL,

    -- Set directly by whoever manages the inventory (an NGO/admin), same
    -- as is_available on volunteers -- not auto-computed from quantity,
    -- since "low" means a different raw number for water (liters) than
    -- for medical kits (count).
    status              TEXT NOT NULL DEFAULT 'good' CHECK (status IN ('good', 'moderate', 'low')),

    managed_by_user_id  UUID REFERENCES users(id),

    created_at          TIMESTAMP NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP NOT NULL DEFAULT now()
);

-- Helpful indexes for queries we already know we'll run often (an index is
-- like a book's table of contents -- it lets Postgres jump straight to
-- matching rows instead of reading every row in the table).
CREATE INDEX IF NOT EXISTS idx_sos_requests_status ON sos_requests(status);
CREATE INDEX IF NOT EXISTS idx_sos_requests_created_at ON sos_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_volunteer_profiles_is_available ON volunteer_profiles(is_available);
CREATE INDEX IF NOT EXISTS shelters_location_idx ON shelters USING GIST (location);

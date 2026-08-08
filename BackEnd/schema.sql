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

-- ============================================================
-- MEMBER 4 HOOK: enable the PostGIS extension before adding any of the
-- spatial columns marked below. Requires PostGIS to be installed on the
-- PostgreSQL server first.
-- ============================================================
-- CREATE EXTENSION IF NOT EXISTS postgis;

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

    -- ============================================================
    -- MEMBER 4 HOOK: add a real spatial column here once PostGIS is
    -- enabled, e.g.:
    --   current_location geography(Point, 4326)
    -- Then keep it in sync with current_lat/current_lng (via app code or a
    -- trigger), and add a spatial index:
    --   CREATE INDEX volunteer_profiles_location_idx
    --     ON volunteer_profiles USING GIST (current_location);
    -- ============================================================

    created_at     TIMESTAMP NOT NULL DEFAULT now()
);

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

    -- ============================================================
    -- MEMBER 4 HOOK: add a real spatial column here once PostGIS is
    -- enabled, e.g.:
    --   location geography(Point, 4326)
    -- This is what will power "find nearest volunteer to this SOS ping"
    -- queries using ST_DWithin / ST_Distance instead of manual lat/lng math.
    -- ============================================================

    status                TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('pending', 'assigned', 'in_progress', 'resolved')),
    priority_score        DOUBLE PRECISION,  -- filled in later by Member 5's AI priority engine

    assigned_volunteer_id UUID REFERENCES users(id),

    created_at            TIMESTAMP NOT NULL DEFAULT now(),
    updated_at            TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shelters (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                TEXT NOT NULL,
    address             TEXT,

    location_lat        DOUBLE PRECISION NOT NULL,
    location_lng        DOUBLE PRECISION NOT NULL,

    -- ============================================================
    -- MEMBER 4 HOOK: add a real spatial column here once PostGIS is
    -- enabled, e.g.:
    --   location geography(Point, 4326)
    -- Useful for "shelters within N km of this SOS ping" queries.
    -- ============================================================

    capacity_total      INTEGER NOT NULL,
    capacity_occupied   INTEGER NOT NULL DEFAULT 0,

    -- Soft-delete flag: closed/decommissioned shelters are marked inactive
    -- instead of being deleted outright, so historical capacity data isn't lost.
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,

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

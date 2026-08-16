"""
WHAT THIS FILE DOES (plain English):
Loads the real relief data in BackEnd/seeds/*.csv (NGOs, their shelters, and
their resource inventories) into the database, so the dashboards have actual
shelters and NGOs to show instead of an empty table.

This runs automatically on server startup (see main.py) and is safe to run
over and over: rows that already exist are updated or skipped rather than
inserted a second time. That matters because none of these tables have a
unique constraint on name, so a plain INSERT would pile up 30 more shelters
on every single restart.

Uses the same SQLAlchemy engine as the rest of the app (database.py) and
Python's built-in csv module -- deliberately no asyncpg/pandas, so seeding
needs no dependencies beyond what requirements.txt already installs.
"""

import csv
import os
import uuid
from pathlib import Path

from sqlalchemy import text

from .database import engine
from .security import hash_password

# Every INSERT below supplies `id` and the timestamp columns explicitly rather
# than leaning on the DEFAULT gen_random_uuid()/now() written in schema.sql.
# Those defaults are not guaranteed to exist: if a database's tables were
# first created by SQLAlchemy's Base.metadata.create_all() (models.py keeps
# those defaults on the Python side, not the column), then schema.sql's
# CREATE TABLE IF NOT EXISTS is a permanent no-op against it and the columns
# never get a database-level default. The ORM routes don't notice because
# SQLAlchemy fills the values in Python -- raw SQL like this would hit a
# not-null violation on id, and NULL timestamps would then fail ShelterOut /
# ResourceOut validation on read. Setting them here works either way.

# Seeded NGO accounts all share one login password so the team can sign in as
# any NGO during a demo. Override via env var for anything resembling a real
# deployment -- this is a known, shared credential.
DEFAULT_NGO_PASSWORD = os.getenv("SEED_NGO_PASSWORD", "Password123!")

SEEDS_DIR = Path(__file__).resolve().parent.parent / "seeds"


def _read_csv(filename):
    path = SEEDS_DIR / filename
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def _seed_ngos(conn, hashed_password):
    """Creates a login account + profile per NGO. Keyed on the CSV's email."""
    ngo_user_ids = {}

    for row in _read_csv("ngos.csv"):
        email = row["suggested_login_email"].strip().lower()

        user_id = conn.execute(
            text("SELECT id FROM users WHERE email = :email"), {"email": email}
        ).scalar()

        if user_id is None:
            # Only brand-new accounts get the seed password -- never reset the
            # password on an account that already exists.
            user_id = conn.execute(
                text(
                    """
                    INSERT INTO users (id, email, hashed_password, role, created_at)
                    VALUES (:id, :email, :hashed_password, 'ngo', now())
                    RETURNING id
                    """
                ),
                {
                    "id": str(uuid.uuid4()),
                    "email": email,
                    "hashed_password": hashed_password,
                },
            ).scalar()

        ngo_user_ids[row["org_name"].strip()] = user_id

        conn.execute(
            text(
                """
                INSERT INTO ngo_profiles (
                    id, user_id, org_name, registration_number, contact_person,
                    phone, address, location_lat, location_lng, location,
                    volunteer_count, operation_areas, emergency_contact, services,
                    created_at
                ) VALUES (
                    :id, :user_id, :org_name, :registration_number, :contact_person,
                    :phone, :address, :lat, :lng,
                    ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
                    :volunteer_count, :operation_areas, :emergency_contact, :services,
                    now()
                )
                ON CONFLICT (user_id) DO UPDATE SET
                    org_name = EXCLUDED.org_name,
                    registration_number = EXCLUDED.registration_number,
                    contact_person = EXCLUDED.contact_person,
                    phone = EXCLUDED.phone,
                    address = EXCLUDED.address,
                    location_lat = EXCLUDED.location_lat,
                    location_lng = EXCLUDED.location_lng,
                    location = EXCLUDED.location,
                    volunteer_count = EXCLUDED.volunteer_count,
                    operation_areas = EXCLUDED.operation_areas,
                    emergency_contact = EXCLUDED.emergency_contact,
                    services = EXCLUDED.services
                """
            ),
            {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "org_name": row["org_name"].strip(),
                "registration_number": row["registration_number"].strip(),
                "contact_person": row["contact_person"].strip(),
                "phone": row["phone"].strip(),
                "address": f"{row['address']}, {row['city']}, {row['state']}",
                "lat": float(row["location_lat"]),
                "lng": float(row["location_lng"]),
                "volunteer_count": int(row["volunteer_count"]),
                "operation_areas": row["operation_areas"].strip(),
                "emergency_contact": row["emergency_contact"].strip(),
                "services": row["services"].strip(),
            },
        )

    return ngo_user_ids


def _seed_shelters(conn, ngo_user_ids):
    """
    Inserts shelters that aren't in the table yet, matched on name. Existing
    rows are left alone so live capacity_occupied edits made during a demo
    aren't wiped by the next restart.
    """
    for row in _read_csv("shelters.csv"):
        conn.execute(
            text(
                """
                INSERT INTO shelters (
                    id, name, address, location_lat, location_lng, location,
                    capacity_total, capacity_occupied, is_active, managed_by_user_id,
                    created_at, updated_at
                )
                SELECT
                    :id, :name, :address, :lat, :lng,
                    ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
                    :capacity_total, :capacity_occupied, :is_active, :managed_by,
                    now(), now()
                WHERE NOT EXISTS (
                    SELECT 1 FROM shelters WHERE name = :name
                )
                """
            ),
            {
                "id": str(uuid.uuid4()),
                "name": row["name"].strip(),
                "address": f"{row['address']}, {row['city']}, {row['state']}",
                "lat": float(row["location_lat"]),
                "lng": float(row["location_lng"]),
                "capacity_total": int(row["capacity_total"]),
                "capacity_occupied": int(row["capacity_occupied"]),
                "is_active": row["is_active"].strip().lower() == "true",
                "managed_by": ngo_user_ids.get(row["managed_by_ngo"].strip()),
            },
        )


def _seed_resources(conn, ngo_user_ids):
    """
    Same idea as shelters, but a resource is only unique per managing NGO --
    twelve different NGOs each stock "Drinking Water", and those are twelve
    genuinely different inventory rows.
    """
    for row in _read_csv("resources.csv"):
        managed_by = ngo_user_ids.get(row["managed_by_ngo"].strip())
        if managed_by is None:
            continue

        conn.execute(
            text(
                """
                INSERT INTO resources (
                    id, name, quantity, unit, status, managed_by_user_id,
                    created_at, updated_at
                )
                SELECT :id, :name, :quantity, :unit, :status, :managed_by, now(), now()
                WHERE NOT EXISTS (
                    SELECT 1 FROM resources
                    WHERE name = :name AND managed_by_user_id = :managed_by
                )
                """
            ),
            {
                "id": str(uuid.uuid4()),
                "name": row["name"].strip(),
                "quantity": float(row["quantity"]),
                "unit": row["unit"].strip(),
                "status": row["status"].strip().lower(),
                "managed_by": managed_by,
            },
        )


def seed_database():
    """
    Loads every seed CSV in one transaction -- either the whole relief dataset
    lands or none of it does, so a failure part-way through can't leave
    shelters pointing at NGOs that were rolled back.
    """
    # bcrypt is deliberately slow, so hash the shared demo password once here
    # rather than once per NGO row.
    hashed_password = hash_password(DEFAULT_NGO_PASSWORD)

    with engine.begin() as conn:
        ngo_user_ids = _seed_ngos(conn, hashed_password)
        _seed_shelters(conn, ngo_user_ids)
        _seed_resources(conn, ngo_user_ids)

    return len(ngo_user_ids)


if __name__ == "__main__":
    count = seed_database()
    print(f"Seeded {count} NGOs with their shelters and resources.")

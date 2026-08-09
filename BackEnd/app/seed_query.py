import os
import asyncio
import pandas as pd
import asyncpg
from fastapi import FastAPI, HTTPException, Query
from passlib.context import CryptContext
from contextlib import asynccontextmanager

# -----------------------------------------------------------------------------
# CONFIGURATION
# -----------------------------------------------------------------------------
DB_URI = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/resqgrid")
DEFAULT_PASSWORD = "Password123!"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
db_pool = None

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# -----------------------------------------------------------------------------
# DATABASE SEEDER FUNCTION
# -----------------------------------------------------------------------------
async def seed_database(pool: asyncpg.Pool):
    print("Checking and seeding database from CSVs...")
    hashed_pwd = get_password_hash(DEFAULT_PASSWORD)
    
    async with pool.acquire() as conn:
        async with conn.transaction():
            # 1. Seed NGOs
            ngos_df = pd.read_csv("ngos.csv")
            ngo_user_map = {}

            for _, row in ngos_df.iterrows():
                email = str(row["suggested_login_email"]).strip().lower()
                user = await conn.fetchrow("SELECT id FROM users WHERE email = $1", email)
                
                if not user:
                    user_id = await conn.fetchval(
                        """
                        INSERT INTO users (email, hashed_password, role)
                        VALUES ($1, $2, 'ngo')
                        RETURNING id
                        """,
                        email, hashed_pwd
                    )
                else:
                    user_id = user["id"]

                ngo_user_map[str(row["org_name"]).strip()] = user_id
                full_address = f"{row['address']}, {row['city']}, {row['state']}"

                await conn.execute(
                    """
                    INSERT INTO ngo_profiles (
                        user_id, org_name, registration_number, contact_person, phone,
                        address, location_lat, location_lng, location,
                        volunteer_count, operation_areas, emergency_contact, services
                    ) VALUES (
                        $1, $2, $3, $4, $5, $6, $7, $8,
                        ST_SetSRID(ST_MakePoint($8, $7), 4326)::geography,
                        $9, $10, $11, $12
                    )
                    ON CONFLICT (user_id) DO UPDATE SET
                        org_name = EXCLUDED.org_name,
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
                    """,
                    user_id,
                    str(row["org_name"]).strip(),
                    str(row["registration_number"]).strip(),
                    str(row["contact_person"]).strip(),
                    str(row["phone"]).strip(),
                    full_address,
                    float(row["location_lat"]),
                    float(row["location_lng"]),
                    int(row["volunteer_count"]),
                    str(row["operation_areas"]).strip(),
                    str(row["emergency_contact"]).strip(),
                    str(row["services"]).strip()
                )

            # 2. Seed Shelters
            shelters_df = pd.read_csv("shelters.csv")
            for _, row in shelters_df.iterrows():
                ngo_name = str(row["managed_by_ngo"]).strip()
                managed_by_id = ngo_user_map.get(ngo_name)
                full_address = f"{row['address']}, {row['city']}, {row['state']}"

                await conn.execute(
                    """
                    INSERT INTO shelters (
                        name, address, location_lat, location_lng, location,
                        capacity_total, capacity_occupied, is_active, managed_by_user_id
                    ) VALUES (
                        $1, $2, $3, $4,
                        ST_SetSRID(ST_MakePoint($4, $3), 4326)::geography,
                        $5, $6, $7, $8
                    )
                    """,
                    str(row["name"]).strip(),
                    full_address,
                    float(row["location_lat"]),
                    float(row["location_lng"]),
                    int(row["capacity_total"]),
                    int(row["capacity_occupied"]),
                    bool(row["is_active"]),
                    managed_by_id
                )

            # 3. Seed Resources
            resources_df = pd.read_csv("resources.csv")
            for _, row in resources_df.iterrows():
                ngo_name = str(row["managed_by_ngo"]).strip()
                managed_by_id = ngo_user_map.get(ngo_name)

                await conn.execute(
                    """
                    INSERT INTO resources (
                        name, quantity, unit, status, managed_by_user_id
                    ) VALUES ($1, $2, $3, $4, $5)
                    """,
                    str(row["name"]).strip(),
                    float(row["quantity"]),
                    str(row["unit"]).strip(),
                    str(row["status"]).strip().lower(),
                    managed_by_id
                )

    print("Database seeding completed successfully!")

# -----------------------------------------------------------------------------
# FASTAPI APPLICATION SETUP
# -----------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    global db_pool
    # Connect to database pool
    db_pool = await asyncpg.create_pool(DB_URI)
    
    # Auto-seed CSV data on startup
    await seed_database(db_pool)
    
    yield
    
    # Close pool on shutdown
    await db_pool.close()

app = FastAPI(title="ResQGrid Victim Emergency Finder API", lifespan=lifespan)

# -----------------------------------------------------------------------------
# VICTIM API ENDPOINT
# -----------------------------------------------------------------------------
@app.get("/victim/nearest-aid")
async def get_nearest_aid(
    lat: float = Query(..., description="Victim Latitude"),
    lng: float = Query(..., description="Victim Longitude")
):
    """
    Finds the nearest NGO, nearest active Shelter, and available resources 
    managed by that NGO relative to the victim's location.
    """
    async with db_pool.acquire() as conn:
        # 1. Get Nearest NGO
        ngo_row = await conn.fetchrow(
            """
            SELECT 
                user_id, org_name, contact_person, phone, emergency_contact, 
                services, address,
                ROUND((ST_Distance(location, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography) / 1000)::numeric, 2) AS distance_km
            FROM ngo_profiles
            WHERE location IS NOT NULL
            ORDER BY location <-> ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
            LIMIT 1
            """,
            lat, lng
        )

        # 2. Get Nearest Shelter
        shelter_row = await conn.fetchrow(
            """
            SELECT 
                id, name, address, capacity_occupied, capacity_total,
                ROUND((ST_Distance(location, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography) / 1000)::numeric, 2) AS distance_km
            FROM shelters
            WHERE is_active = TRUE AND location IS NOT NULL
            ORDER BY location <-> ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
            LIMIT 1
            """,
            lat, lng
        )

        # 3. Get Available Resources at the nearest NGO
        resources = []
        if ngo_row:
            resource_rows = await conn.fetch(
                """
                SELECT name, quantity, unit, status
                FROM resources
                WHERE managed_by_user_id = $1
                """,
                ngo_row["user_id"]
            )
            resources = [dict(r) for r in resource_rows]

        return {
            "nearest_ngo": dict(ngo_row) if ngo_row else None,
            "nearest_shelter": dict(shelter_row) if shelter_row else None,
            "ngo_resources": resources
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("seed_and_query:app", host="0.0.0.0", port=8000, reload=True)

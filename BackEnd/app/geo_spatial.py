from typing import List, Dict, Any, Optional

async def update_volunteer_location(
    db_pool, 
    user_id: str, 
    latitude: float, 
    longitude: float
) -> Optional[Dict[str, Any]]:
    """
    Updates dynamic location for a volunteer in volunteer_profiles.
    Keeps current_lat/current_lng and PostGIS current_location in sync.
    """
    query = """
        UPDATE volunteer_profiles
        SET 
            current_lat = $1,
            current_lng = $2,
            current_location = ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography
        WHERE user_id = $3
        RETURNING 
            id, 
            user_id, 
            full_name, 
            phone, 
            is_available, 
            current_lat AS latitude, 
            current_lng AS longitude;
    """
    row = await db_pool.fetchrow(query, latitude, longitude, user_id)
    return dict(row) if row else None


async def find_nearest_volunteers_to_sos(
    db_pool, 
    sos_id: str, 
    limit: int = 5, 
    max_radius_meters: int = 10000
) -> List[Dict[str, Any]]:
    """
    Finds nearest available volunteers to a specific SOS request ID using PostGIS.
    """
    query = """
        SELECT 
            vp.id AS profile_id,
            vp.user_id,
            vp.full_name,
            vp.phone,
            vp.skills,
            vp.current_lat AS latitude,
            vp.current_lng AS longitude,
            ROUND(ST_Distance(vp.current_location, s.location)::numeric, 2) AS distance_meters,
            ROUND((ST_Distance(vp.current_location, s.location) / 1000.0)::numeric, 2) AS distance_km
        FROM volunteer_profiles vp
        CROSS JOIN sos_requests s
        WHERE s.id = $1
          AND vp.is_available = TRUE
          AND vp.current_location IS NOT NULL
          AND ST_DWithin(vp.current_location, s.location, $2)
        ORDER BY distance_meters ASC
        LIMIT $3;
    """
    rows = await db_pool.fetch(query, sos_id, max_radius_meters, limit)
    return [dict(r) for r in rows]


async def find_nearest_volunteers_by_coords(
    db_pool, 
    latitude: float, 
    longitude: float, 
    limit: int = 5, 
    max_radius_meters: int = 10000
) -> List[Dict[str, Any]]:
    """
    Finds nearest available volunteers given raw coordinates.
    """
    query = """
        SELECT 
            vp.id AS profile_id,
            vp.user_id,
            vp.full_name,
            vp.phone,
            vp.skills,
            vp.current_lat AS latitude,
            vp.current_lng AS longitude,
            ROUND(ST_Distance(vp.current_location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography)::numeric, 2) AS distance_meters,
            ROUND((ST_Distance(vp.current_location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography) / 1000.0)::numeric, 2) AS distance_km
        FROM volunteer_profiles vp
        WHERE vp.is_available = TRUE
          AND vp.current_location IS NOT NULL
          AND ST_DWithin(vp.current_location, ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, $3)
        ORDER BY distance_meters ASC
        LIMIT $4;
    """
    rows = await db_pool.fetch(query, longitude, latitude, max_radius_meters, limit)
    return [dict(r) for r in rows]

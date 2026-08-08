"""
WHAT THIS FILE DOES (plain English):
Small helper for measuring the distance between two GPS points (latitude/
longitude pairs), used by the "nearest volunteer" and "nearby shelters"
spatial queries. This uses the Haversine formula -- plain Python math, no
database extension required.

MEMBER 4 HOOK: once PostGIS is enabled (see schema.sql), the queries that
use this function can be rewritten to use ST_DWithin / ST_Distance on a
geography(Point, 4326) column instead, which is faster at scale because
Postgres can use a spatial index rather than computing every distance in
Python. The API response shape (a `distance_km` field) is designed to stay
the same either way, so nothing on the frontend needs to change when that
swap happens.
"""
import math
from typing import List, Dict, Any, Optional

EARTH_RADIUS_KM = 6371.0


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Fallback Haversine calculation in Python if PostGIS is unavailable.
    """
    lat1_rad, lng1_rad, lat2_rad, lng2_rad = map(math.radians, (lat1, lng1, lat2, lng2))

    dlat = lat2_rad - lat1_rad
    dlng = lng2_rad - lng1_rad

    a = math.sin(dlat / 2) ** 2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlng / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))

    return EARTH_RADIUS_KM * c


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
    Fast indexed PostGIS proximity query: finds nearest available volunteers to an SOS ping.
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

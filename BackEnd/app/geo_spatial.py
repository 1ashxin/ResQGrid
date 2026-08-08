from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import text

def update_volunteer_location(
    db: Session, 
    user_id: str, 
    latitude: float, 
    longitude: float
) -> Optional[Dict[str, Any]]:
    """
    Updates dynamic location for a volunteer in volunteer_profiles.
    Keeps current_lat/current_lng and PostGIS current_location in sync using SQLAlchemy.
    """
    query = text("""
        UPDATE volunteer_profiles
        SET 
            current_lat = :lat,
            current_lng = :lng,
            current_location = ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
        WHERE user_id = :user_id
        RETURNING 
            id, 
            user_id, 
            full_name, 
            phone, 
            is_available, 
            current_lat AS latitude, 
            current_lng AS longitude;
    """)
    
    result = db.execute(query, {"lat": latitude, "lng": longitude, "user_id": user_id})
    row = result.fetchone()
    db.commit()
    
    return dict(row._mapping) if row else None


def find_nearest_volunteers_to_sos(
    db: Session, 
    sos_id: str, 
    limit: int = 5, 
    max_radius_meters: int = 10000
) -> List[Dict[str, Any]]:
    """
    Finds nearest available volunteers to an SOS request using PostGIS with SQLAlchemy.
    """
    query = text("""
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
        WHERE s.id = :sos_id
          AND vp.is_available = TRUE
          AND vp.current_location IS NOT NULL
          AND ST_DWithin(vp.current_location, s.location, :max_radius)
        ORDER BY distance_meters ASC
        LIMIT :limit;
    """)
    
    result = db.execute(query, {"sos_id": sos_id, "max_radius": max_radius_meters, "limit": limit})
    rows = result.fetchall()
    
    return [dict(r._mapping) for r in rows]

"""
WHAT THIS FILE DOES (plain English):
Exposes Member 4's PostGIS-based spatial queries (geo_spatial.py) as real
HTTP endpoints -- updating a volunteer's live location and finding the
nearest available volunteers to an SOS ping using PostGIS's ST_Distance/
ST_DWithin, instead of the plain-Python Haversine fallback already live in
routers/sos.py (see geo.py).

MEMBER 4 IN-PROGRESS: these endpoints query current_location / location
geography columns that don't exist in schema.sql yet. They'll load fine,
but calling them will fail with a database error ("column ... does not
exist") until PostGIS is enabled and those columns are added -- see the
MEMBER 4 HOOK comments in schema.sql. That part is still Member 4's setup
to finish; this file only fixes main.py's crash from referencing a router
module that was never committed.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from .. import schemas, geo_spatial
from ..database import get_db

router = APIRouter(prefix="/geo", tags=["Geo (PostGIS)"])


@router.patch("/volunteers/{user_id}/location")
def update_volunteer_location(
    user_id: str, payload: schemas.VolunteerLocationUpdate, db: Session = Depends(get_db)
):
    """
    PostGIS-backed alternative to PATCH /volunteers/{volunteer_id}/location.
    Note this one is keyed by the volunteer's *user_id*, not their profile
    id, matching how geo_spatial.py was written.
    """
    result = geo_spatial.update_volunteer_location(db, user_id, payload.current_lat, payload.current_lng)
    if not result:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    return result


@router.get("/sos/{sos_id}/nearest-volunteers")
def nearest_volunteers_postgis(
    sos_id: str, limit: int = 5, radius_meters: int = 10000, db: Session = Depends(get_db)
):
    """
    PostGIS-backed alternative to GET /sos/{sos_id}/nearest-volunteers (the
    Haversine version in routers/sos.py). Uses ST_DWithin with a spatial
    index instead of ranking every volunteer in Python -- faster once
    PostGIS is fully set up, same idea either way.
    """
    return geo_spatial.find_nearest_volunteers_to_sos(db, sos_id, limit, radius_meters)


@router.get("/nearest-shelters")
def nearest_shelters_postgis(
    lat: float = Query(..., description="Latitude of user/SOS ping"),
    lng: float = Query(..., description="Longitude of user/SOS ping"),
    radius_meters: float = Query(50000.0, description="Search radius in meters (default 50km)"),
    limit: int = Query(10, description="Max results"),
    db: Session = Depends(get_db)
):
    """
    PostGIS-backed spatial search for shelters nearest to given coordinates.
    """
    return geo_spatial.find_nearest_shelters(db, lat=lat, lng=lng, radius_meters=radius_meters, limit=limit)


@router.get("/nearest-ngos")
def nearest_ngos_postgis(
    lat: float = Query(..., description="Latitude of user/SOS ping"),
    lng: float = Query(..., description="Longitude of user/SOS ping"),
    radius_meters: float = Query(50000.0, description="Search radius in meters (default 50km)"),
    limit: int = Query(10, description="Max results"),
    db: Session = Depends(get_db)
):
    """
    PostGIS-backed spatial search for NGOs nearest to given coordinates.
    """
    return geo_spatial.find_nearest_ngos(db, lat=lat, lng=lng, radius_meters=radius_meters, limit=limit)


@router.get("/nearest-facilities")
def nearest_facilities_postgis(
    lat: float = Query(..., description="Latitude of user/SOS ping"),
    lng: float = Query(..., description="Longitude of user/SOS ping"),
    radius_meters: float = Query(50000.0, description="Search radius in meters (default 50km)"),
    limit: int = Query(5, description="Max results per category"),
    db: Session = Depends(get_db)
):
    """
    Consolidated PostGIS endpoint returning both nearest shelters and NGOs in a single payload.
    Ideal for rendering map markers on the frontend dashboard.
    """
    shelters = geo_spatial.find_nearest_shelters(db, lat=lat, lng=lng, radius_meters=radius_meters, limit=limit)
    ngos = geo_spatial.find_nearest_ngos(db, lat=lat, lng=lng, radius_meters=radius_meters, limit=limit)

    return {
        "success": True,
        "query_location": {"lat": lat, "lng": lng},
        "shelters": shelters,
        "ngos": ngos
    }

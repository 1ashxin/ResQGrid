"""
WHAT THIS FILE DOES (plain English):
This file defines the web addresses (endpoints) for NGO profiles:
registering organization details, and listing/looking them up. All
endpoints here start with "/ngo". Mirrors routers/volunteers.py's
create/list/get pattern -- no availability/location endpoints here since
those are volunteer-specific concepts.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from .. import models, schemas, geo_spatial
from ..database import get_db

router = APIRouter(prefix="/ngo", tags=["NGO Profiles"])


@router.post("/", response_model=schemas.NGOProfileOut, status_code=status.HTTP_201_CREATED)
def create_ngo_profile(payload: schemas.NGOProfileCreate, db: Session = Depends(get_db)):
    """
    Adds NGO-specific details (org name, registration number, contact
    person, etc.) for a user account that was already registered with
    role='ngo' via /users/register.
    """
    user = db.query(models.User).filter(models.User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role != models.UserRole.NGO:
        raise HTTPException(status_code=400, detail="User is not registered with the ngo role")

    existing = (
        db.query(models.NGOProfile)
        .filter(models.NGOProfile.user_id == payload.user_id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="This user already has an NGO profile")

    # Extracts location_lat/location_lng if present on payload schema
    lat = getattr(payload, "location_lat", None)
    lng = getattr(payload, "location_lng", None)

    profile = models.NGOProfile(
        user_id=payload.user_id,
        org_name=payload.org_name,
        registration_number=payload.registration_number,
        contact_person=payload.contact_person,
        phone=payload.phone,
        address=payload.address,
        location_lat=lat,
        location_lng=lng,
        volunteer_count=payload.volunteer_count,
        operation_areas=payload.operation_areas,
        emergency_contact=payload.emergency_contact,
        services=payload.services,
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)

    # Syncs PostGIS geography column if coordinates are available
    if lat is not None and lng is not None:
        geo_spatial.sync_ngo_geography(db, profile.id, lat, lng)

    return profile


@router.get("/", response_model=list[schemas.NGOProfileOut])
def list_ngo_profiles(db: Session = Depends(get_db)):
    """Returns every registered NGO profile."""
    return db.query(models.NGOProfile).all()


@router.get("/nearby")
def get_nearby_ngos(
    lat: float = Query(..., description="Latitude of user/SOS ping"),
    lng: float = Query(..., description="Longitude of user/SOS ping"),
    radius_km: float = Query(50.0, description="Search radius in kilometers"),
    limit: int = Query(10, description="Max results"),
    db: Session = Depends(get_db)
):
    """
    Returns NGOs within radius_km of given coordinates, sorted closest first.
    Uses PostGIS spatial index queries via geo_spatial.py.
    """
    radius_meters = radius_km * 1000.0
    return geo_spatial.find_nearest_ngos(
        db,
        lat=lat,
        lng=lng,
        radius_meters=radius_meters,
        limit=limit
    )


@router.get("/{ngo_id}", response_model=schemas.NGOProfileOut)
def get_ngo_profile(ngo_id: str, db: Session = Depends(get_db)):
    """Look up a single NGO profile by its ID."""
    profile = db.query(models.NGOProfile).filter(models.NGOProfile.id == ngo_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="NGO profile not found")
    return profile

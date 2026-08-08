"""
WHAT THIS FILE DOES (plain English):
This file defines the web addresses (endpoints) for volunteer profiles:
registering profile details, listing volunteers, and updating their
availability or current location. All endpoints here start with
"/volunteers".
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas, geo_spatial
from ..database import get_db

router = APIRouter(prefix="/volunteers", tags=["Volunteers"])


@router.post("/", response_model=schemas.VolunteerProfileOut, status_code=status.HTTP_201_CREATED)
def create_volunteer_profile(payload: schemas.VolunteerProfileCreate, db: Session = Depends(get_db)):
    """
    Adds volunteer-specific details (name, phone, skills) for a user account
    that was already registered with role='volunteer' via /users/register.
    """
    user = db.query(models.User).filter(models.User.id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role != models.UserRole.VOLUNTEER:
        raise HTTPException(status_code=400, detail="User is not registered with the volunteer role")

    existing = (
        db.query(models.VolunteerProfile)
        .filter(models.VolunteerProfile.user_id == payload.user_id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="This user already has a volunteer profile")

    profile = models.VolunteerProfile(
        user_id=payload.user_id,
        full_name=payload.full_name,
        phone=payload.phone,
        skills=payload.skills,
    )
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/", response_model=list[schemas.VolunteerProfileOut])
def list_volunteers(available_only: bool = False, db: Session = Depends(get_db)):
    """
    Returns volunteer profiles. Pass ?available_only=true to get just the
    volunteers currently marked available -- e.g. when looking for someone
    to assign to a new SOS request. Defaults to returning everyone, which
    is what the admin dashboard's full roster view uses.
    """
    query = db.query(models.VolunteerProfile)
    if available_only:
        query = query.filter(models.VolunteerProfile.is_available == True)
    return query.all()


@router.get("/{volunteer_id}", response_model=schemas.VolunteerProfileOut)
def get_volunteer(volunteer_id: str, db: Session = Depends(get_db)):
    """Look up a single volunteer profile by its ID."""
    profile = db.query(models.VolunteerProfile).filter(models.VolunteerProfile.id == volunteer_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Volunteer profile not found")
    return profile


@router.patch("/{volunteer_id}/availability", response_model=schemas.VolunteerProfileOut)
def update_availability(
    volunteer_id: str, payload: schemas.VolunteerAvailabilityUpdate, db: Session = Depends(get_db)
):
    """Marks a volunteer as available or busy."""
    profile = db.query(models.VolunteerProfile).filter(models.VolunteerProfile.id == volunteer_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Volunteer profile not found")
    profile.is_available = payload.is_available
    db.commit()
    db.refresh(profile)
    return profile


@router.patch("/{volunteer_id}/location", response_model=schemas.VolunteerProfileOut)
def update_location(
    volunteer_id: str, payload: schemas.VolunteerLocationUpdate, db: Session = Depends(get_db)
):
    """
    Updates a volunteer's current GPS location, keeping the PostGIS
    current_location column in sync so "nearest volunteer to this SOS
    ping" queries (see routers/geo.py) see fresh data regardless of
    whether this endpoint or the /geo/ one was used to update it.
    """
    profile = db.query(models.VolunteerProfile).filter(models.VolunteerProfile.id == volunteer_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Volunteer profile not found")
    profile.current_lat = payload.current_lat
    profile.current_lng = payload.current_lng
    db.commit()
    db.refresh(profile)

    geo_spatial.sync_volunteer_geography(db, profile.id, payload.current_lat, payload.current_lng)

    return profile

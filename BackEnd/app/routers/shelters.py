"""
WHAT THIS FILE DOES (plain English):
This file defines the web addresses (endpoints) for relief shelters:
creating a shelter, listing them, and updating how many people are
currently inside (capacity tracking). All endpoints here start with
"/shelters".
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..geo import haversine_km

router = APIRouter(prefix="/shelters", tags=["Shelters"])


@router.post("/", response_model=schemas.ShelterOut, status_code=status.HTTP_201_CREATED)
def create_shelter(payload: schemas.ShelterCreate, db: Session = Depends(get_db)):
    """Registers a new shelter/relief camp with its total capacity."""
    shelter = models.Shelter(
        name=payload.name,
        address=payload.address,
        location_lat=payload.location_lat,
        location_lng=payload.location_lng,
        capacity_total=payload.capacity_total,
        managed_by_user_id=payload.managed_by_user_id,
    )
    db.add(shelter)
    db.commit()
    db.refresh(shelter)
    return shelter


@router.get("/", response_model=list[schemas.ShelterOut])
def list_shelters(db: Session = Depends(get_db)):
    """Returns every shelter. Used by the map/dashboard to show capacity."""
    return db.query(models.Shelter).all()


@router.get("/nearby", response_model=list[schemas.ShelterWithDistanceOut])
def nearby_shelters(lat: float, lng: float, radius_km: float = 10, limit: int = 10, db: Session = Depends(get_db)):
    """
    Returns active shelters within radius_km of the given point, closest
    first. e.g. GET /shelters/nearby?lat=19.076&lng=72.8777&radius_km=5 --
    used to suggest where to route a victim/volunteer near a given SOS.

    MEMBER 4 HOOK: this filters/ranks every active shelter in Python using
    plain lat/lng math (see geo.haversine_km). Once PostGIS is enabled,
    this should become a single ST_DWithin query against a
    geography(Point) column with a GIST index instead, which scales far
    better with a large number of shelters -- the response shape
    (distance_km per shelter) should stay the same.

    NOTE: this route must stay registered before GET /{shelter_id} below,
    otherwise FastAPI would try to treat "nearby" as a shelter_id.
    """
    active_shelters = db.query(models.Shelter).filter(models.Shelter.is_active == True).all()

    within_radius = [
        (shelter, haversine_km(lat, lng, shelter.location_lat, shelter.location_lng))
        for shelter in active_shelters
    ]
    within_radius = [pair for pair in within_radius if pair[1] <= radius_km]
    within_radius.sort(key=lambda pair: pair[1])

    return [
        schemas.ShelterWithDistanceOut(
            **schemas.ShelterOut.model_validate(shelter).model_dump(),
            distance_km=round(distance, 2),
        )
        for shelter, distance in within_radius[:limit]
    ]


@router.get("/{shelter_id}", response_model=schemas.ShelterOut)
def get_shelter(shelter_id: str, db: Session = Depends(get_db)):
    """Look up a single shelter by its ID."""
    shelter = db.query(models.Shelter).filter(models.Shelter.id == shelter_id).first()
    if not shelter:
        raise HTTPException(status_code=404, detail="Shelter not found")
    return shelter


@router.patch("/{shelter_id}/capacity", response_model=schemas.ShelterOut)
def update_capacity(shelter_id: str, payload: schemas.ShelterCapacityUpdate, db: Session = Depends(get_db)):
    """
    Updates how many people are currently occupying a shelter. Rejects
    values that would overfill it past capacity_total, or dip below zero,
    so the dashboard number is always trustworthy.
    """
    shelter = db.query(models.Shelter).filter(models.Shelter.id == shelter_id).first()
    if not shelter:
        raise HTTPException(status_code=404, detail="Shelter not found")
    if payload.capacity_occupied > shelter.capacity_total:
        raise HTTPException(status_code=400, detail="Occupied count cannot exceed total capacity")
    if payload.capacity_occupied < 0:
        raise HTTPException(status_code=400, detail="Occupied count cannot be negative")
    shelter.capacity_occupied = payload.capacity_occupied
    db.commit()
    db.refresh(shelter)
    return shelter


@router.patch("/{shelter_id}/deactivate", response_model=schemas.ShelterOut)
def deactivate_shelter(shelter_id: str, db: Session = Depends(get_db)):
    """
    Soft-deletes a shelter by marking it inactive instead of removing the
    row, so its historical capacity data isn't lost. Used when a shelter
    closes or a relief camp is decommissioned.
    """
    shelter = db.query(models.Shelter).filter(models.Shelter.id == shelter_id).first()
    if not shelter:
        raise HTTPException(status_code=404, detail="Shelter not found")
    shelter.is_active = False
    db.commit()
    db.refresh(shelter)
    return shelter

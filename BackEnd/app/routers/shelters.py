"""
WHAT THIS FILE DOES (plain English):
This file defines the web addresses (endpoints) for relief shelters:
creating a shelter, listing them, and updating how many people are
currently inside (capacity tracking). All endpoints here start with
"/shelters".
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from .. import models, schemas, geo_spatial
from ..database import get_db

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

    # Keeps the PostGIS geography column in sync for "shelters near this
    # SOS ping" spatial queries.
    geo_spatial.sync_shelter_geography(db, shelter.id, payload.location_lat, payload.location_lng)

    return shelter


@router.get("/", response_model=list[schemas.ShelterOut])
def list_shelters(db: Session = Depends(get_db)):
    """Returns every shelter. Used by the map/dashboard to show capacity."""
    return db.query(models.Shelter).all()


@router.get("/nearby", response_model=list[schemas.ShelterWithDistanceOut])
def nearby_shelters(
    lat: float = Query(..., description="Latitude of point"),
    lng: float = Query(..., description="Longitude of point"),
    radius_km: float = Query(10.0, description="Search radius in kilometers"),
    limit: int = Query(10, description="Max results"),
    db: Session = Depends(get_db)
):
    """
    Returns active shelters within radius_km of the given point, closest first.
    e.g. GET /shelters/nearby?lat=19.076&lng=72.8777&radius_km=5

    Uses PostGIS ST_DWithin and ST_Distance spatial index queries via geo_spatial.py.
    """
    radius_meters = radius_km * 1000.0
    
    # Executes PostGIS spatial query indexed on shelter geography column
    results = geo_spatial.find_nearest_shelters(
        db, 
        lat=lat, 
        lng=lng, 
        radius_meters=radius_meters, 
        limit=limit
    )

    return [
        schemas.ShelterWithDistanceOut(
            id=r["id"],
            name=r["name"],
            address=r["address"],
            location_lat=r["location_lat"],
            location_lng=r["location_lng"],
            capacity_total=r["capacity_total"],
            capacity_occupied=r["capacity_occupied"],
            is_active=r["is_active"],
            distance_km=r["distance_km"]
        )
        for r in results
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

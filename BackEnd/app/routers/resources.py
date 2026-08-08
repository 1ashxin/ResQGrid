"""
WHAT THIS FILE DOES (plain English):
This file defines the web addresses (endpoints) for emergency supply
inventory (drinking water, food packets, medical kits, tents, etc.):
registering a resource, listing them, and updating quantity/status. All
endpoints here start with "/resources". Tracked separately from shelters
since one NGO's supply run typically serves multiple shelters/camps --
this is what lets the admin dashboard flag "running low" and helps avoid
multiple NGOs duplicating the same supply drop.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/resources", tags=["Resources"])


@router.post("/", response_model=schemas.ResourceOut, status_code=status.HTTP_201_CREATED)
def create_resource(payload: schemas.ResourceCreate, db: Session = Depends(get_db)):
    """Registers a new supply item being tracked, e.g. "Drinking Water", 1240, "L"."""
    resource = models.Resource(
        name=payload.name,
        quantity=payload.quantity,
        unit=payload.unit,
        status=payload.status,
        managed_by_user_id=payload.managed_by_user_id,
    )
    db.add(resource)
    db.commit()
    db.refresh(resource)
    return resource


@router.get("/", response_model=list[schemas.ResourceOut])
def list_resources(db: Session = Depends(get_db)):
    """Returns every tracked resource. Used by the admin dashboard's Resource Tracker."""
    return db.query(models.Resource).all()


@router.get("/{resource_id}", response_model=schemas.ResourceOut)
def get_resource(resource_id: str, db: Session = Depends(get_db)):
    """Look up a single resource by its ID."""
    resource = db.query(models.Resource).filter(models.Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource


@router.patch("/{resource_id}", response_model=schemas.ResourceOut)
def update_resource(resource_id: str, payload: schemas.ResourceUpdate, db: Session = Depends(get_db)):
    """
    Updates a resource's quantity and status together, e.g. after a supply
    drop or as stock depletes. status is set directly by whoever manages
    the inventory rather than computed automatically, since "low" means a
    different raw quantity for water (liters) than for medical kits (count).
    """
    resource = db.query(models.Resource).filter(models.Resource.id == resource_id).first()
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    resource.quantity = payload.quantity
    resource.status = payload.status
    db.commit()
    db.refresh(resource)
    return resource

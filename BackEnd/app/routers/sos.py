"""
WHAT THIS FILE DOES (plain English):
This file defines the web addresses (endpoints) for a victim's SOS (help)
requests: creating one, viewing them, updating their status, and assigning a
volunteer to help. All endpoints here start with "/sos".
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/sos", tags=["SOS Requests"])


@router.post("/", response_model=schemas.SOSRequestOut, status_code=status.HTTP_201_CREATED)
def create_sos_request(payload: schemas.SOSRequestCreate, db: Session = Depends(get_db)):
    """
    A victim (or the low-bandwidth SOS form) sends their name, phone,
    a description of their situation, and their location. The sensitive
    fields are automatically encrypted before hitting the database (see
    EncryptedString in security.py) -- we don't have to do anything extra
    here for that; SQLAlchemy handles it for us behind the scenes.
    """
    new_request = models.SOSRequest(
        victim_name=payload.victim_name,
        victim_phone=payload.victim_phone,
        description=payload.description,
        location_lat=payload.location_lat,
        location_lng=payload.location_lng,
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    return new_request


@router.get("/", response_model=list[schemas.SOSRequestOut])
def list_sos_requests(db: Session = Depends(get_db)):
    """
    Returns every SOS request ordered by priority_score (most urgent
    first). Requests that haven't been scored yet (priority_score is still
    null) are listed last, oldest-first, so nothing gets buried once
    scoring kicks in. Used by the admin/NGO dashboard to triage who to
    help first.
    """
    return (
        db.query(models.SOSRequest)
        .order_by(
            models.SOSRequest.priority_score.desc().nullslast(),
            models.SOSRequest.created_at.asc(),
        )
        .all()
    )


@router.get("/{sos_id}", response_model=schemas.SOSRequestOut)
def get_sos_request(sos_id: str, db: Session = Depends(get_db)):
    """Look up a single SOS request by its ID."""
    sos = db.query(models.SOSRequest).filter(models.SOSRequest.id == sos_id).first()
    if not sos:
        raise HTTPException(status_code=404, detail="SOS request not found")
    return sos


@router.patch("/{sos_id}/status", response_model=schemas.SOSRequestOut)
def update_sos_status(sos_id: str, payload: schemas.SOSStatusUpdate, db: Session = Depends(get_db)):
    """Moves an SOS request through its lifecycle, e.g. pending -> resolved."""
    sos = db.query(models.SOSRequest).filter(models.SOSRequest.id == sos_id).first()
    if not sos:
        raise HTTPException(status_code=404, detail="SOS request not found")
    sos.status = payload.status
    db.commit()
    db.refresh(sos)
    return sos


@router.patch("/{sos_id}/priority", response_model=schemas.SOSRequestOut)
def update_priority_score(sos_id: str, payload: schemas.SOSPriorityUpdate, db: Session = Depends(get_db)):
    """
    MEMBER 5 HOOK: this is where the AI priority engine pushes its computed
    urgency score for an SOS request (higher = more urgent). Once wired up,
    Member 5's scoring pipeline will call this endpoint after each new SOS
    request comes in, instead of a human setting it by hand.
    """
    sos = db.query(models.SOSRequest).filter(models.SOSRequest.id == sos_id).first()
    if not sos:
        raise HTTPException(status_code=404, detail="SOS request not found")
    sos.priority_score = payload.priority_score
    db.commit()
    db.refresh(sos)
    return sos


@router.patch("/{sos_id}/assign", response_model=schemas.SOSRequestOut)
def assign_volunteer(sos_id: str, payload: schemas.SOSAssignVolunteer, db: Session = Depends(get_db)):
    """
    Links a volunteer to this SOS request and automatically marks the
    request as 'assigned'.
    """
    sos = db.query(models.SOSRequest).filter(models.SOSRequest.id == sos_id).first()
    if not sos:
        raise HTTPException(status_code=404, detail="SOS request not found")

    volunteer = (
        db.query(models.User)
        .filter(
            models.User.id == payload.volunteer_user_id,
            models.User.role == models.UserRole.VOLUNTEER,
        )
        .first()
    )
    if not volunteer:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    sos.assigned_volunteer_id = volunteer.id
    sos.status = models.SOSStatus.ASSIGNED
    db.commit()
    db.refresh(sos)
    return sos

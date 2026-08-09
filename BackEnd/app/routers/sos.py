"""
WHAT THIS FILE DOES (plain English):
This file defines the web addresses (endpoints) for a victim's SOS (help)
requests: creating one, viewing them, updating their status, and assigning a
volunteer to help. All endpoints here start with "/sos".
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas, geo_spatial
from ..database import get_db
from ..geo import haversine_km
from core_security_and_logic.priority_engine import calculate_priority,priority_category
from ..audit import log_security_event

router = APIRouter(prefix="/sos", tags=["SOS Requests"])


@router.post("/", response_model=schemas.SOSRequestOut, status_code=status.HTTP_201_CREATED)
def create_sos_request(payload: schemas.SOSRequestCreate, db: Session = Depends(get_db)):
    """
    A victim (or the low-bandwidth SOS form) sends their name, phone,
    a description of their situation, and their location. The sensitive
    fields are automatically encrypted before hitting the database (see
    EncryptedString in security.py) -- we don't have to do anything extra
    here for that; SQLAlchemy handles it for us behind the scenes.

    priority_score is computed immediately from the description via
    Member 5's priority engine (core_security_and_logic/priority_engine.py),
    instead of staying null until someone calls PATCH /sos/{id}/priority by
    hand. That endpoint still exists for manual re-scoring/overrides.
    """
    new_request = models.SOSRequest(
        victim_name=payload.victim_name,
        victim_phone=payload.victim_phone,
        description=payload.description,
        location_lat=payload.location_lat,
        location_lng=payload.location_lng,
        priority_score=calculate_priority(payload.description),
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)
    new_request.priority = priority_category(new_request.priority_score)
    log_security_event(
    db=db,
    action="SOS_CREATED",
    resource="sos_request",
    resource_id=new_request.id,
    details="New SOS request created",
)
    # Keeps the PostGIS geography column in sync so nearest-volunteer
    # spatial queries (see routers/geo.py) work on this request too.
    geo_spatial.sync_sos_geography(db, new_request.id, payload.location_lat, payload.location_lng)

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

    log_security_event(
        db=db,
        action="SOS_STATUS_UPDATED",
        resource="sos_request",
        resource_id=sos_id,
        details=f"SOS status changed to {payload.status}",
    )

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


@router.get("/{sos_id}/nearest-volunteers", response_model=list[schemas.VolunteerWithDistanceOut])
def nearest_volunteers(sos_id: str, limit: int = 5, db: Session = Depends(get_db)):
    """
    Returns available volunteers ranked closest-first to this SOS request's
    location, so an admin/dispatcher can pick who to assign.

    MEMBER 4 HOOK: this ranks every available volunteer in Python using
    plain lat/lng math (see geo.haversine_km). Once PostGIS is enabled,
    this should become a single ST_Distance/ST_DWithin query against a
    geography(Point) column instead, which scales far better with a large
    volunteer roster -- the response shape (distance_km per volunteer)
    should stay the same.
    """
    sos = db.query(models.SOSRequest).filter(models.SOSRequest.id == sos_id).first()
    if not sos:
        raise HTTPException(status_code=404, detail="SOS request not found")

    candidates = (
        db.query(models.VolunteerProfile)
        .filter(
            models.VolunteerProfile.is_available == True,
            models.VolunteerProfile.current_lat.isnot(None),
            models.VolunteerProfile.current_lng.isnot(None),
        )
        .all()
    )

    ranked = sorted(
        candidates,
        key=lambda v: haversine_km(sos.location_lat, sos.location_lng, v.current_lat, v.current_lng),
    )[:limit]

    return [
        schemas.VolunteerWithDistanceOut(
            **schemas.VolunteerProfileOut.model_validate(v).model_dump(),
            distance_km=round(
                haversine_km(sos.location_lat, sos.location_lng, v.current_lat, v.current_lng), 2
            ),
        )
        for v in ranked
    ]


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

    log_security_event(
        db=db,
        action="SOS_ASSIGNED",
        resource="sos_request",
        resource_id=sos_id,
        user_id=volunteer.id,
        details="Volunteer assigned to SOS request",
    )

    return sos
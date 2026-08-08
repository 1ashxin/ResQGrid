"""
WHAT THIS FILE DOES (plain English):
This file defines the "shape" of data going IN to our API (what a client is
allowed to send us) and OUT of our API (what JSON we send back).

Beginner note: models.py describes the database tables. schemas.py
describes the API's request/response JSON. They look similar but do
different jobs -- think of models.py as the filing cabinet, and schemas.py
as the request form you fill in and the receipt you get handed back.

Pydantic is the library that powers this: it automatically checks incoming
data matches these shapes (e.g. rejects a request missing "email"), and
converts Python objects into clean JSON for responses.
"""

import enum
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


# These two enums are intentionally redefined here, separate from the ones
# in models.py. That keeps "what the API accepts/returns" decoupled from
# "how we store it in the database" -- a common pattern, even though right
# now the values are identical.
class UserRole(str, enum.Enum):
    VICTIM = "victim"
    VOLUNTEER = "volunteer"
    ADMIN = "admin"
    NGO = "ngo"


class SOSStatus(str, enum.Enum):
    PENDING = "pending"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"


class ResourceStatus(str, enum.Enum):
    GOOD = "good"
    MODERATE = "moderate"
    LOW = "low"


# ---------- User schemas ----------

class UserCreate(BaseModel):
    """What a client must send us to register a new account."""
    email: EmailStr
    password: str
    role: UserRole


class UserLogin(BaseModel):
    """What a client sends us to log in."""
    email: EmailStr
    password: str


class UserOut(BaseModel):
    """What we send back about a user. Notice: no password field, ever."""
    id: str
    email: EmailStr
    role: UserRole
    created_at: datetime

    # Lets Pydantic build this schema directly from a SQLAlchemy model
    # object (models.User), instead of only from a plain dict.
    model_config = ConfigDict(from_attributes=True)


class UserRoleUpdate(BaseModel):
    role: UserRole


# ---------- Volunteer schemas ----------

class VolunteerProfileCreate(BaseModel):
    user_id: str
    full_name: str
    phone: str
    skills: Optional[str] = None


class VolunteerLocationUpdate(BaseModel):
    current_lat: float
    current_lng: float


class VolunteerAvailabilityUpdate(BaseModel):
    is_available: bool


class VolunteerProfileOut(BaseModel):
    id: str
    user_id: str
    full_name: str
    phone: str
    skills: Optional[str] = None
    is_available: bool
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class VolunteerWithDistanceOut(VolunteerProfileOut):
    """Same as VolunteerProfileOut, plus how far this volunteer is from the
    point that was searched around (see GET /sos/{sos_id}/nearest-volunteers)."""
    distance_km: float


# ---------- SOS request schemas ----------

class SOSRequestCreate(BaseModel):
    victim_name: str
    victim_phone: str
    description: Optional[str] = None
    location_lat: float
    location_lng: float


class SOSStatusUpdate(BaseModel):
    status: SOSStatus


class SOSAssignVolunteer(BaseModel):
    volunteer_user_id: str


class SOSPriorityUpdate(BaseModel):
    priority_score: float


class SOSRequestOut(BaseModel):
    id: str
    victim_name: str
    victim_phone: str
    description: Optional[str] = None
    location_lat: float
    location_lng: float
    status: SOSStatus
    priority_score: Optional[float] = None
    assigned_volunteer_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ---------- Shelter schemas ----------

class ShelterCreate(BaseModel):
    name: str
    address: Optional[str] = None
    location_lat: float
    location_lng: float
    capacity_total: int
    managed_by_user_id: Optional[str] = None


class ShelterCapacityUpdate(BaseModel):
    capacity_occupied: int


class ShelterOut(BaseModel):
    id: str
    name: str
    address: Optional[str] = None
    location_lat: float
    location_lng: float
    capacity_total: int
    capacity_occupied: int
    is_active: bool
    managed_by_user_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ShelterWithDistanceOut(ShelterOut):
    """Same as ShelterOut, plus how far this shelter is from the point that
    was searched around (see GET /shelters/nearby)."""
    distance_km: float


# ---------- Resource (inventory) schemas ----------

class ResourceCreate(BaseModel):
    name: str
    quantity: float
    unit: str
    status: ResourceStatus = ResourceStatus.GOOD
    managed_by_user_id: Optional[str] = None


class ResourceUpdate(BaseModel):
    quantity: float
    status: ResourceStatus


class ResourceOut(BaseModel):
    id: str
    name: str
    quantity: float
    unit: str
    status: ResourceStatus
    managed_by_user_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

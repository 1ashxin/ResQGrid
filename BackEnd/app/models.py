"""
WHAT THIS FILE DOES (plain English):
This file describes the "shape" of our database tables using Python
classes. Each class below becomes one table in PostgreSQL. SQLAlchemy (our
database toolkit) reads these classes and knows how to create matching
tables, and how to convert between database rows and Python objects.

Beginner note: think of each class as a blueprint for one tab in a giant
shared spreadsheet -- the class name is the tab's name, and each
"Column(...)" line is one column header on that tab.
"""

import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Column, String, Text, Float, Integer, Numeric, Boolean, DateTime, ForeignKey, Enum as SAEnum
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .database import Base
from .security import EncryptedString


def generate_uuid():
    """Creates a random unique ID (UUID). Used as the default primary key for
    every table, so IDs can't be guessed or predicted by outsiders."""
    return str(uuid.uuid4())


def enum_values(enum_class):
    """
    Tells SQLAlchemy to store an Enum column's *value* ("pending") rather
    than its Python member *name* ("PENDING"), which is what it would use
    by default.

    This matters because schema.sql -- the source of truth that actually
    creates these tables -- constrains these columns to the lowercase
    values, e.g. CHECK (status IN ('pending', 'assigned', ...)). Without
    this, every INSERT sends 'PENDING' and Postgres rejects the whole row.
    The lowercase values are also what the API returns and what the
    frontend matches on, so they're the right thing to store.

    Passed to every SAEnum column below via values_callable=.
    """
    return [member.value for member in enum_class]


class UserRole(str, enum.Enum):
    """
    The four types of accounts in ResQGrid, per CLAUDE.md. Using a Python
    Enum means the database will reject any role value that isn't one of
    these four -- it protects us from typos like "Victem".
    """
    VICTIM = "victim"
    VOLUNTEER = "volunteer"
    ADMIN = "admin"
    NGO = "ngo"


class SOSStatus(str, enum.Enum):
    """The lifecycle stages of a victim's SOS (help) request."""
    PENDING = "pending"
    ASSIGNED = "assigned"
    IN_PROGRESS = "in_progress"
    RESOLVED = "resolved"


class ResourceStatus(str, enum.Enum):
    """How well-stocked a resource/inventory item currently is."""
    GOOD = "good"
    MODERATE = "moderate"
    LOW = "low"


class User(Base):
    """
    One row = one login account (volunteer, admin, or NGO staff).

    Victims usually do NOT need an account -- they just submit an SOS
    request (see SOSRequest below) without logging in -- but the 'victim'
    role still exists in case we later add optional victim accounts (e.g.
    to let a victim check their own request status).
    """
    __tablename__ = "users"

    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    # native_enum=False stores this as plain text in Postgres (matching
    # schema.sql's TEXT + CHECK approach) instead of a special Postgres ENUM
    # type, which is simpler to change later without a database migration.
    role = Column(SAEnum(UserRole, native_enum=False, values_callable=enum_values), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # One user can have one volunteer profile (only relevant if role == volunteer)
    volunteer_profile = relationship(
        "VolunteerProfile", back_populates="user", uselist=False
    )

    # One user can have one NGO profile (only relevant if role == ngo)
    ngo_profile = relationship(
        "NGOProfile", back_populates="user", uselist=False
    )


class VolunteerProfile(Base):
    """
    Extra details specific to volunteers, kept in their own table so the
    shared 'users' table stays simple across all four roles.
    """
    __tablename__ = "volunteer_profiles"

    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), unique=True, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    skills = Column(String, nullable=True)
    is_available = Column(Boolean, default=True)

    # Plain lat/lng (ordinary GPS coordinates), kept for simple display and
    # as the source of truth the API accepts. schema.sql also has a
    # current_location geography(Point, 4326) column for PostGIS spatial
    # queries -- it's not mapped here (no ORM column below) since nothing
    # writes to it via the ORM; app/geo_spatial.py keeps it in sync with
    # raw SQL instead, called from routers/volunteers.py and routers/geo.py.
    current_lat = Column(Float, nullable=True)
    current_lng = Column(Float, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="volunteer_profile")


class NGOProfile(Base):
    """
    Extra details specific to NGOs, kept in their own table so the shared
    'users' table stays simple across all four roles.
    """
    __tablename__ = "ngo_profiles"

    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), unique=True, nullable=False)
    org_name = Column(String, nullable=False)
    registration_number = Column(String, nullable=False)
    contact_person = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    address = Column(String, nullable=True)

    # Added geolocation fields matching VolunteerProfile and Shelter
    location_lat = Column(Float, nullable=True)
    location_lng = Column(Float, nullable=True)

    volunteer_count = Column(Integer, nullable=True)
    operation_areas = Column(String, nullable=True)
    emergency_contact = Column(String, nullable=True)
    services = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="ngo_profile")


class SOSRequest(Base):
    """
    One row = one cry for help from a victim.

    victim_name, victim_phone, and description use EncryptedString (defined
    in security.py), so they are scrambled before being saved to the
    database and only readable through our app with the correct FERNET_KEY.
    """
    __tablename__ = "sos_requests"

    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)

    victim_name = Column(EncryptedString, nullable=False)
    victim_phone = Column(EncryptedString, nullable=False)
    description = Column(EncryptedString, nullable=True)

    # Plain lat/lng, kept in sync with schema.sql's location geography
    # column via app/geo_spatial.py (see routers/sos.py's create endpoint).
    location_lat = Column(Float, nullable=False)
    location_lng = Column(Float, nullable=False)

    status = Column(
        SAEnum(SOSStatus, native_enum=False, values_callable=enum_values),
        default=SOSStatus.PENDING,
        nullable=False,
    )
    priority_score = Column(Float, nullable=True)  # filled in later by Member 5's AI priority engine

    assigned_volunteer_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Shelter(Base):
    """
    One row = one physical shelter/relief camp: where it is, how many people
    it can hold, and how many are currently there.
    """
    __tablename__ = "shelters"

    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    address = Column(String, nullable=True)

    # Plain lat/lng, kept in sync with schema.sql's location geography
    # column via app/geo_spatial.py (see routers/shelters.py's create endpoint).
    location_lat = Column(Float, nullable=False)
    location_lng = Column(Float, nullable=False)

    capacity_total = Column(Integer, nullable=False)
    capacity_occupied = Column(Integer, default=0, nullable=False)

    # Soft-delete flag: closed/decommissioned shelters are marked inactive
    # instead of being deleted outright, so historical capacity data isn't lost.
    is_active = Column(Boolean, default=True, nullable=False)

    managed_by_user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SecurityAuditLog(Base):
    """Records security-sensitive actions performed in the system."""
    __tablename__ = "security_audit_logs"

    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=True)
    action = Column(Text, nullable=False)
    resource = Column(Text, nullable=True)
    resource_id = Column(UUID(as_uuid=False), nullable=True)
    details = Column(Text, nullable=True)

    created_at = Column(DateTime, nullable=False, default=datetime.utcnow)


class Resource(Base):
    """
    One row = one type of emergency supply being tracked (e.g. "Drinking
    Water", quantity 1240, unit "L"). Tracked separately from shelters
    since a single NGO supply run typically serves multiple shelters/camps
    -- this is what lets the admin dashboard flag "Food Packets running
    low" instead of duplicate NGOs re-sending the same supplies.
    """
    __tablename__ = "resources"

    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    quantity = Column(Numeric, nullable=False)
    unit = Column(String, nullable=False)
    status = Column(
        SAEnum(ResourceStatus, native_enum=False, values_callable=enum_values),
        default=ResourceStatus.GOOD,
        nullable=False,
    )

    managed_by_user_id = Column(UUID(as_uuid=False), ForeignKey("users.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

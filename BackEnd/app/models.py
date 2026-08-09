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
    Column, String, Float, Integer, Boolean, DateTime, ForeignKey,
    Text, Enum as SAEnum
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from .database import Base
from .security import EncryptedString


def generate_uuid():
    """Creates a random unique ID (UUID). Used as the default primary key for
    every table, so IDs can't be guessed or predicted by outsiders."""
    return str(uuid.uuid4())


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
    role = Column(SAEnum(UserRole, native_enum=False), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # One user can have one volunteer profile (only relevant if role == volunteer)
    volunteer_profile = relationship(
        "VolunteerProfile", back_populates="user", uselist=False
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

    status = Column(SAEnum(SOSStatus, native_enum=False), default=SOSStatus.PENDING, nullable=False)
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

    location_lat = Column(Float, nullable=False)
    location_lng = Column(Float, nullable=False)

    capacity_total = Column(Integer, nullable=False)
    capacity_occupied = Column(Integer, default=0, nullable=False)

    is_active = Column(Boolean, default=True, nullable=False)

    managed_by_user_id = Column(
        UUID(as_uuid=False),
        ForeignKey("users.id"),
        nullable=True
    )

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )


class SecurityAuditLog(Base):
    """Records security-sensitive actions performed in the system."""

    __tablename__ = "security_audit_logs"

    id = Column(
        UUID(as_uuid=False),
        primary_key=True,
        default=generate_uuid,
    )

    user_id = Column(
        UUID(as_uuid=False),
        ForeignKey("users.id"),
        nullable=True,
    )

    action = Column(Text, nullable=False)
    resource = Column(Text, nullable=True)
    resource_id = Column(UUID(as_uuid=False), nullable=True)
    details = Column(Text, nullable=True)

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )
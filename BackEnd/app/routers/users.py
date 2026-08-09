"""
WHAT THIS FILE DOES (plain English):
This file defines the web addresses (endpoints) for creating accounts,
logging in, and managing what role a user has (victim / volunteer / admin /
ngo).

Beginner note: a "router" in FastAPI is just a bundle of related URL
endpoints, kept in their own file so main.py doesn't turn into one giant,
messy file. This router's endpoints all start with "/users".
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..security import hash_password, verify_password
from ..audit import log_security_event

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register_user(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Creates a new login account. The password is hashed (scrambled) before
    it's saved -- we never store what the user actually typed.
    """
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered")

    new_user = models.User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        role=payload.role,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@router.post("/login", response_model=schemas.UserOut)
def login_user(payload: schemas.UserLogin, db: Session = Depends(get_db)):
    """
    Checks an email + password against what's stored. If they match, we
    return the user's info (including their role) so the frontend knows
    which dashboard to show.

    Beginner note: this does NOT yet issue a login "token" (a wristband
    proving you're logged in on later requests, usually a JWT). That's a
    common next step, planned for once the basic flow is working
    end-to-end -- it is intentionally out of scope for Aug 6/7.
    """
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not verify_password(payload.password, user.hashed_password):
     raise HTTPException(status_code=401, detail="Incorrect email or password")
    log_security_event(
        db=db,
        action="LOGIN",
        resource="user",
        resource_id=user.id,
        user_id=user.id,
        details="User logged in successfully",
    )

    return user

@router.get("/", response_model=list[schemas.UserOut])
def list_users(role: schemas.UserRole | None = None, db: Session = Depends(get_db)):
    """
    Returns registered accounts. Pass ?role=volunteer (or victim/admin/ngo)
    to filter down to just that role. Used by the admin dashboard.
    """
    query = db.query(models.User)
    if role is not None:
        query = query.filter(models.User.role == role)
    return query.all()


@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: str, db: Session = Depends(get_db)):
    """Look up a single account by its ID."""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.patch("/{user_id}/role", response_model=schemas.UserOut)
def update_user_role(user_id: str, payload: schemas.UserRoleUpdate, db: Session = Depends(get_db)):
    """
    Changes a user's role, e.g. promoting someone to 'admin'.

    Beginner note: right now ANYONE can call this endpoint. Before this goes
    live it needs to be locked down so only an existing admin can change
    roles -- that belongs to the authentication/permissions work planned for
    a later day.
    """
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = payload.role
    db.commit()
    db.refresh(user)
    return user

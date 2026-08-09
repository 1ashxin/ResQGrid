from sqlalchemy.orm import Session

from .models import SecurityAuditLog


def log_security_event(
    db: Session,
    action: str,
    resource: str | None = None,
    resource_id: str | None = None,
    user_id: str | None = None,
    details: str | None = None,
):
    """Record a security-sensitive action in the audit log."""

    entry = SecurityAuditLog(
        user_id=user_id,
        action=action,
        resource=resource,
        resource_id=resource_id,
        details=details,
    )

    db.add(entry)
    db.commit()
    db.refresh(entry)

    return entry
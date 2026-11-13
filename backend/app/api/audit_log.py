
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.audit_log import AuditLog
from app.schemas.audit_log import AuditLogCreate, AuditLogResponse


router = APIRouter(
    prefix="/audit-logs",
    tags=["Audit Logs"]
)


@router.post("/", response_model=AuditLogResponse, status_code=201)
def create_audit_log(
    audit_data: AuditLogCreate,
    db: Session = Depends(get_db)
):
    audit = AuditLog(**audit_data.model_dump())

    db.add(audit)
    db.commit()
    db.refresh(audit)

    return audit


@router.get("/", response_model=list[AuditLogResponse])
def get_all_audit_logs(
    db: Session = Depends(get_db)
):
    return db.query(AuditLog).order_by(
        AuditLog.created_at.desc()
    ).all()


@router.get("/{audit_id}", response_model=AuditLogResponse)
def get_audit_log(
    audit_id: int,
    db: Session = Depends(get_db)
):
    audit = db.query(AuditLog).filter(
        AuditLog.id == audit_id
    ).first()

    if not audit:
        raise HTTPException(
            status_code=404,
            detail="Audit log not found"
        )

    return audit


@router.delete("/{audit_id}")
def delete_audit_log(
    audit_id: int,
    db: Session = Depends(get_db)
):
    audit = db.query(AuditLog).filter(
        AuditLog.id == audit_id
    ).first()

    if not audit:
        raise HTTPException(
            status_code=404,
            detail="Audit log not found"
        )

    db.delete(audit)
    db.commit()

    return {
        "message": "Audit log deleted successfully"
    }

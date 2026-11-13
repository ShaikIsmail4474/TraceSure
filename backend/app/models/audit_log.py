
from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    JSON
)
from sqlalchemy.sql import func

from app.database.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    entity_type = Column(
        String(100),
        nullable=False
    )

    entity_id = Column(
        Integer,
        nullable=False
    )

    action = Column(
        String(100),
        nullable=False
    )

    description = Column(
        Text,
        nullable=True
    )

    old_values = Column(
        JSON,
        nullable=True
    )

    new_values = Column(
        JSON,
        nullable=True
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )


from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.sql import func

from app.database.database import Base


class Recall(Base):
    __tablename__ = "recalls"

    id = Column(Integer, primary_key=True, index=True)

    recall_number = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )

    batch_id = Column(
        Integer,
        ForeignKey("batches.id"),
        nullable=False
    )

    reason = Column(Text, nullable=False)

    severity = Column(
        String(50),
        nullable=False,
        default="MEDIUM"
    )

    status = Column(
        String(50),
        nullable=False,
        default="OPEN"
    )

    initiated_date = Column(Date, nullable=True)
    resolved_date = Column(Date, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

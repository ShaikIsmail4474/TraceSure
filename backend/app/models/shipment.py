
from sqlalchemy import (
    Column, Integer, String, Date, DateTime, ForeignKey
)
from sqlalchemy.sql import func

from app.database.database import Base


class Shipment(Base):
    __tablename__ = "shipments"

    id = Column(Integer, primary_key=True, index=True)

    shipment_number = Column(
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

    origin = Column(String(200), nullable=False)
    destination = Column(String(200), nullable=False)

    carrier = Column(String(150), nullable=True)
    tracking_number = Column(String(150), nullable=True)

    shipped_date = Column(Date, nullable=True)
    expected_delivery_date = Column(Date, nullable=True)
    actual_delivery_date = Column(Date, nullable=True)

    status = Column(
        String(50),
        nullable=False,
        default="PENDING"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

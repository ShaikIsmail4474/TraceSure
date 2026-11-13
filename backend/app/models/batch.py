
from sqlalchemy import (
    Column, Integer, String, Date, DateTime, ForeignKey
)
from sqlalchemy.sql import func

from app.database.database import Base


class Batch(Base):
    __tablename__ = "batches"

    id = Column(Integer, primary_key=True, index=True)

    batch_number = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )

    product_id = Column(
        Integer,
        ForeignKey("products.id"),
        nullable=False
    )

    supplier_id = Column(
        Integer,
        ForeignKey("suppliers.id"),
        nullable=False
    )

    quantity = Column(Integer, nullable=False)

    manufacturing_date = Column(Date, nullable=True)
    expiry_date = Column(Date, nullable=True)

    status = Column(
        String(50),
        nullable=False,
        default="ACTIVE"
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

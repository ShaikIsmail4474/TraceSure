
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date


class ShipmentCreate(BaseModel):
    shipment_number: str
    batch_id: int
    origin: str
    destination: str
    carrier: Optional[str] = None
    tracking_number: Optional[str] = None
    shipped_date: Optional[date] = None
    expected_delivery_date: Optional[date] = None
    actual_delivery_date: Optional[date] = None
    status: str = "PENDING"


class ShipmentResponse(BaseModel):
    id: int
    shipment_number: str
    batch_id: int
    origin: str
    destination: str
    carrier: Optional[str] = None
    tracking_number: Optional[str] = None
    shipped_date: Optional[date] = None
    expected_delivery_date: Optional[date] = None
    actual_delivery_date: Optional[date] = None
    status: str

    model_config = ConfigDict(from_attributes=True)

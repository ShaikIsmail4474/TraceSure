
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import date


class BatchCreate(BaseModel):
    batch_number: str
    product_id: int
    supplier_id: int
    quantity: int = Field(gt=0)
    manufacturing_date: Optional[date] = None
    expiry_date: Optional[date] = None
    status: str = "ACTIVE"


class BatchResponse(BaseModel):
    id: int
    batch_number: str
    product_id: int
    supplier_id: int
    quantity: int
    manufacturing_date: Optional[date] = None
    expiry_date: Optional[date] = None
    status: str

    model_config = ConfigDict(from_attributes=True)

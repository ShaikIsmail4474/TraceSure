
from pydantic import BaseModel, ConfigDict
from typing import Optional


class ProductCreate(BaseModel):
    name: str
    sku: str
    description: Optional[str] = None
    category: Optional[str] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    sku: str
    description: Optional[str] = None
    category: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

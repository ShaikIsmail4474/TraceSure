
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date


class RecallCreate(BaseModel):
    recall_number: str
    batch_id: int
    reason: str
    severity: str = "MEDIUM"
    status: str = "OPEN"
    initiated_date: Optional[date] = None
    resolved_date: Optional[date] = None


class RecallResponse(BaseModel):
    id: int
    recall_number: str
    batch_id: int
    reason: str
    severity: str
    status: str
    initiated_date: Optional[date] = None
    resolved_date: Optional[date] = None

    model_config = ConfigDict(from_attributes=True)

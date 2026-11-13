
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.shipment import Shipment
from app.models.batch import Batch
from app.schemas.shipment import ShipmentCreate, ShipmentResponse


router = APIRouter(
    prefix="/shipments",
    tags=["Shipments"]
)


@router.post("/", response_model=ShipmentResponse, status_code=201)
def create_shipment(
    shipment_data: ShipmentCreate,
    db: Session = Depends(get_db)
):
    existing = db.query(Shipment).filter(
        Shipment.shipment_number == shipment_data.shipment_number
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Shipment number already exists"
        )

    batch = db.query(Batch).filter(
        Batch.id == shipment_data.batch_id
    ).first()

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Batch not found"
        )

    if (
        shipment_data.expected_delivery_date
        and shipment_data.shipped_date
        and shipment_data.expected_delivery_date < shipment_data.shipped_date
    ):
        raise HTTPException(
            status_code=400,
            detail="Expected delivery date cannot be before shipped date"
        )

    if (
        shipment_data.actual_delivery_date
        and shipment_data.shipped_date
        and shipment_data.actual_delivery_date < shipment_data.shipped_date
    ):
        raise HTTPException(
            status_code=400,
            detail="Actual delivery date cannot be before shipped date"
        )

    new_shipment = Shipment(**shipment_data.model_dump())

    db.add(new_shipment)
    db.commit()
    db.refresh(new_shipment)

    return new_shipment


@router.get("/", response_model=list[ShipmentResponse])
def get_shipments(db: Session = Depends(get_db)):
    return db.query(Shipment).all()


@router.get("/{shipment_id}", response_model=ShipmentResponse)
def get_shipment(
    shipment_id: int,
    db: Session = Depends(get_db)
):
    shipment = db.query(Shipment).filter(
        Shipment.id == shipment_id
    ).first()

    if not shipment:
        raise HTTPException(
            status_code=404,
            detail="Shipment not found"
        )

    return shipment


@router.put("/{shipment_id}", response_model=ShipmentResponse)
def update_shipment(
    shipment_id: int,
    shipment_data: ShipmentCreate,
    db: Session = Depends(get_db)
):
    shipment = db.query(Shipment).filter(
        Shipment.id == shipment_id
    ).first()

    if not shipment:
        raise HTTPException(
            status_code=404,
            detail="Shipment not found"
        )

    existing = db.query(Shipment).filter(
        Shipment.shipment_number == shipment_data.shipment_number,
        Shipment.id != shipment_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Shipment number already exists"
        )

    batch = db.query(Batch).filter(
        Batch.id == shipment_data.batch_id
    ).first()

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Batch not found"
        )

    if (
        shipment_data.expected_delivery_date
        and shipment_data.shipped_date
        and shipment_data.expected_delivery_date < shipment_data.shipped_date
    ):
        raise HTTPException(
            status_code=400,
            detail="Expected delivery date cannot be before shipped date"
        )

    if (
        shipment_data.actual_delivery_date
        and shipment_data.shipped_date
        and shipment_data.actual_delivery_date < shipment_data.shipped_date
    ):
        raise HTTPException(
            status_code=400,
            detail="Actual delivery date cannot be before shipped date"
        )

    for key, value in shipment_data.model_dump().items():
        setattr(shipment, key, value)

    db.commit()
    db.refresh(shipment)

    return shipment


@router.delete("/{shipment_id}")
def delete_shipment(
    shipment_id: int,
    db: Session = Depends(get_db)
):
    shipment = db.query(Shipment).filter(
        Shipment.id == shipment_id
    ).first()

    if not shipment:
        raise HTTPException(
            status_code=404,
            detail="Shipment not found"
        )

    db.delete(shipment)
    db.commit()

    return {
        "message": "Shipment deleted successfully"
    }

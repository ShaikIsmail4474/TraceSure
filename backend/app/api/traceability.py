
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.batch import Batch
from app.models.product import Product
from app.models.supplier import Supplier
from app.models.shipment import Shipment
from app.models.recall import Recall


router = APIRouter(
    prefix="/traceability",
    tags=["Batch Traceability"]
)


@router.get("/batches/{batch_id}")
def get_batch_traceability(
    batch_id: int,
    db: Session = Depends(get_db)
):
    # Find the batch
    batch = db.query(Batch).filter(
        Batch.id == batch_id
    ).first()

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Batch not found"
        )

    # Find related product and supplier
    product = db.query(Product).filter(
        Product.id == batch.product_id
    ).first()

    supplier = db.query(Supplier).filter(
        Supplier.id == batch.supplier_id
    ).first()

    # Find all shipments for this batch
    shipments = db.query(Shipment).filter(
        Shipment.batch_id == batch_id
    ).all()

    # Find all recalls for this batch
    recalls = db.query(Recall).filter(
        Recall.batch_id == batch_id
    ).all()

    return {
        "batch": {
            "id": batch.id,
            "batch_number": batch.batch_number,
            "quantity": batch.quantity,
            "manufacturing_date": batch.manufacturing_date,
            "expiry_date": batch.expiry_date,
            "status": batch.status
        },
        "product": {
            "id": product.id,
            "name": product.name,
            "sku": product.sku,
            "category": product.category
        } if product else None,
        "supplier": {
            "id": supplier.id,
            "name": supplier.name,
            "contact_person": supplier.contact_person,
            "email": supplier.email,
            "phone": supplier.phone
        } if supplier else None,
        "shipments": [
            {
                "id": shipment.id,
                "shipment_number": shipment.shipment_number,
                "origin": shipment.origin,
                "destination": shipment.destination,
                "carrier": shipment.carrier,
                "tracking_number": shipment.tracking_number,
                "status": shipment.status,
                "shipped_date": shipment.shipped_date,
                "expected_delivery_date": shipment.expected_delivery_date,
                "actual_delivery_date": shipment.actual_delivery_date
            }
            for shipment in shipments
        ],
        "recalls": [
            {
                "id": recall.id,
                "recall_number": recall.recall_number,
                "reason": recall.reason,
                "severity": recall.severity,
                "status": recall.status,
                "initiated_date": recall.initiated_date,
                "resolved_date": recall.resolved_date
            }
            for recall in recalls
        ]
    }


from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.recall import Recall
from app.models.batch import Batch
from app.models.product import Product
from app.models.supplier import Supplier
from app.models.shipment import Shipment


router = APIRouter(
    prefix="/recall-impact",
    tags=["Recall Impact Analysis"]
)


@router.get("/{recall_id}")
def analyze_recall_impact(
    recall_id: int,
    db: Session = Depends(get_db)
):
    # Find recall
    recall = db.query(Recall).filter(
        Recall.id == recall_id
    ).first()

    if not recall:
        raise HTTPException(
            status_code=404,
            detail="Recall not found"
        )

    # Find affected batch
    batch = db.query(Batch).filter(
        Batch.id == recall.batch_id
    ).first()

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Associated batch not found"
        )

    # Find related product and supplier
    product = db.query(Product).filter(
        Product.id == batch.product_id
    ).first()

    supplier = db.query(Supplier).filter(
        Supplier.id == batch.supplier_id
    ).first()

    # Find shipments associated with the affected batch
    shipments = db.query(Shipment).filter(
        Shipment.batch_id == batch.id
    ).all()

    return {
        "recall": {
            "id": recall.id,
            "recall_number": recall.recall_number,
            "reason": recall.reason,
            "severity": recall.severity,
            "status": recall.status
        },
        "impact_summary": {
            "affected_batch_count": 1,
            "affected_quantity": batch.quantity,
            "shipment_count": len(shipments),
            "severity": recall.severity
        },
        "affected_batch": {
            "id": batch.id,
            "batch_number": batch.batch_number,
            "quantity": batch.quantity,
            "status": batch.status
        },
        "product": {
            "id": product.id,
            "name": product.name,
            "sku": product.sku
        } if product else None,
        "supplier": {
            "id": supplier.id,
            "name": supplier.name,
            "email": supplier.email
        } if supplier else None,
        "affected_shipments": [
            {
                "shipment_number": shipment.shipment_number,
                "destination": shipment.destination,
                "tracking_number": shipment.tracking_number,
                "status": shipment.status
            }
            for shipment in shipments
        ]
    }

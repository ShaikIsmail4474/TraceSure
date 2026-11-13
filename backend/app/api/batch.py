
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.batch import Batch
from app.models.product import Product
from app.models.supplier import Supplier
from app.schemas.batch import BatchCreate, BatchResponse


router = APIRouter(
    prefix="/batches",
    tags=["Batches"]
)


# Create Batch
@router.post("/", response_model=BatchResponse, status_code=201)
def create_batch(batch_data: BatchCreate, db: Session = Depends(get_db)):

    existing_batch = db.query(Batch).filter(
        Batch.batch_number == batch_data.batch_number
    ).first()

    if existing_batch:
        raise HTTPException(
            status_code=400,
            detail="Batch number already exists"
        )

    product = db.query(Product).filter(
        Product.id == batch_data.product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    supplier = db.query(Supplier).filter(
        Supplier.id == batch_data.supplier_id
    ).first()

    if not supplier:
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    if (
        batch_data.manufacturing_date
        and batch_data.expiry_date
        and batch_data.expiry_date <= batch_data.manufacturing_date
    ):
        raise HTTPException(
            status_code=400,
            detail="Expiry date must be after manufacturing date"
        )

    new_batch = Batch(**batch_data.model_dump())

    db.add(new_batch)
    db.commit()
    db.refresh(new_batch)

    return new_batch


# Get All Batches
@router.get("/", response_model=list[BatchResponse])
def get_batches(db: Session = Depends(get_db)):
    return db.query(Batch).all()


# Get Batch By ID
@router.get("/{batch_id}", response_model=BatchResponse)
def get_batch(batch_id: int, db: Session = Depends(get_db)):

    batch = db.query(Batch).filter(
        Batch.id == batch_id
    ).first()

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Batch not found"
        )

    return batch


# Update Batch
@router.put("/{batch_id}", response_model=BatchResponse)
def update_batch(
    batch_id: int,
    batch_data: BatchCreate,
    db: Session = Depends(get_db)
):

    batch = db.query(Batch).filter(
        Batch.id == batch_id
    ).first()

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Batch not found"
        )

    existing_batch = db.query(Batch).filter(
        Batch.batch_number == batch_data.batch_number,
        Batch.id != batch_id
    ).first()

    if existing_batch:
        raise HTTPException(
            status_code=400,
            detail="Batch number already exists"
        )

    if not db.query(Product).filter(
        Product.id == batch_data.product_id
    ).first():
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    if not db.query(Supplier).filter(
        Supplier.id == batch_data.supplier_id
    ).first():
        raise HTTPException(
            status_code=404,
            detail="Supplier not found"
        )

    if (
        batch_data.manufacturing_date
        and batch_data.expiry_date
        and batch_data.expiry_date <= batch_data.manufacturing_date
    ):
        raise HTTPException(
            status_code=400,
            detail="Expiry date must be after manufacturing date"
        )

    for key, value in batch_data.model_dump().items():
        setattr(batch, key, value)

    db.commit()
    db.refresh(batch)

    return batch


# Delete Batch
@router.delete("/{batch_id}")
def delete_batch(batch_id: int, db: Session = Depends(get_db)):

    batch = db.query(Batch).filter(
        Batch.id == batch_id
    ).first()

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Batch not found"
        )

    db.delete(batch)
    db.commit()

    return {
        "message": "Batch deleted successfully"
    }

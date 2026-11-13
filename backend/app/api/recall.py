
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.recall import Recall
from app.models.batch import Batch
from app.schemas.recall import RecallCreate, RecallResponse


router = APIRouter(
    prefix="/recalls",
    tags=["Product Recalls"]
)


@router.post("/", response_model=RecallResponse, status_code=201)
def create_recall(
    recall_data: RecallCreate,
    db: Session = Depends(get_db)
):
    existing = db.query(Recall).filter(
        Recall.recall_number == recall_data.recall_number
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Recall number already exists"
        )

    batch = db.query(Batch).filter(
        Batch.id == recall_data.batch_id
    ).first()

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Batch not found"
        )

    if (
        recall_data.resolved_date
        and recall_data.initiated_date
        and recall_data.resolved_date < recall_data.initiated_date
    ):
        raise HTTPException(
            status_code=400,
            detail="Resolved date cannot be before initiated date"
        )

    new_recall = Recall(**recall_data.model_dump())

    db.add(new_recall)
    db.commit()
    db.refresh(new_recall)

    return new_recall


@router.get("/", response_model=list[RecallResponse])
def get_recalls(db: Session = Depends(get_db)):
    return db.query(Recall).all()


@router.get("/{recall_id}", response_model=RecallResponse)
def get_recall(
    recall_id: int,
    db: Session = Depends(get_db)
):
    recall = db.query(Recall).filter(
        Recall.id == recall_id
    ).first()

    if not recall:
        raise HTTPException(
            status_code=404,
            detail="Recall not found"
        )

    return recall


@router.put("/{recall_id}", response_model=RecallResponse)
def update_recall(
    recall_id: int,
    recall_data: RecallCreate,
    db: Session = Depends(get_db)
):
    recall = db.query(Recall).filter(
        Recall.id == recall_id
    ).first()

    if not recall:
        raise HTTPException(
            status_code=404,
            detail="Recall not found"
        )

    existing = db.query(Recall).filter(
        Recall.recall_number == recall_data.recall_number,
        Recall.id != recall_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Recall number already exists"
        )

    batch = db.query(Batch).filter(
        Batch.id == recall_data.batch_id
    ).first()

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Batch not found"
        )

    if (
        recall_data.resolved_date
        and recall_data.initiated_date
        and recall_data.resolved_date < recall_data.initiated_date
    ):
        raise HTTPException(
            status_code=400,
            detail="Resolved date cannot be before initiated date"
        )

    for key, value in recall_data.model_dump().items():
        setattr(recall, key, value)

    db.commit()
    db.refresh(recall)

    return recall


@router.delete("/{recall_id}")
def delete_recall(
    recall_id: int,
    db: Session = Depends(get_db)
):
    recall = db.query(Recall).filter(
        Recall.id == recall_id
    ).first()

    if not recall:
        raise HTTPException(
            status_code=404,
            detail="Recall not found"
        )

    db.delete(recall)
    db.commit()

    return {
        "message": "Recall deleted successfully"
    }

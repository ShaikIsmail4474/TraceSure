
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import engine, Base

# Database models
from app.models.product import Product
from app.models.supplier import Supplier
from app.models.batch import Batch
from app.models.shipment import Shipment
from app.models.recall import Recall
from app.models.audit_log import AuditLog

# API routers
from app.api.product import router as product_router
from app.api.supplier import router as supplier_router
from app.api.batch import router as batch_router
from app.api.shipment import router as shipment_router
from app.api.recall import router as recall_router
from app.api.traceability import router as traceability_router
from app.api.recall_impact import router as recall_impact_router
from app.api.audit_log import router as audit_log_router


# Create database tables
Base.metadata.create_all(bind=engine)


# Initialize FastAPI application
app = FastAPI(
    title="TraceSure API",
    description="Supply Chain Traceability and Product Recall Management System",
    version="1.0.0"
)


# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routers
app.include_router(product_router)
app.include_router(supplier_router)
app.include_router(batch_router)
app.include_router(shipment_router)
app.include_router(recall_router)
app.include_router(traceability_router)
app.include_router(recall_impact_router)
app.include_router(audit_log_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to TraceSure",
        "system": "Supply Chain Traceability & Recall Intelligence",
        "status": "Running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "application": "TraceSure"
    }

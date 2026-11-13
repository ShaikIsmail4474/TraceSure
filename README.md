# TraceSure – Supply Chain Traceability & Product Recall Management System

TraceSure is a backend application designed to manage supply-chain records, track product batches, monitor shipments, and analyze product recalls. It provides REST APIs for managing products, suppliers, batches, shipments, recalls, and audit logs.

## Key Features

- **Product Management:** Create, view, update, and delete product records.
- **Supplier Management:** Maintain supplier information and contact details.
- **Batch Management:** Track product batches, quantities, manufacturing dates, and expiry dates.
- **Shipment Management:** Monitor shipment details, carriers, tracking numbers, and delivery status.
- **Product Recall Management:** Create and manage product recall records.
- **Batch Traceability:** Retrieve associated product, supplier, shipment, and recall information for a batch.
- **Recall Impact Analysis:** Identify the affected batch, quantity, supplier, and shipments for a recall.
- **Audit Logs:** Create and retrieve entity-related activity records with old and new values.
- **Input Validation:** Validate request data and handle invalid or missing records.

## Technology Stack

| Technology | Purpose |
|---|---|
| Python | Backend programming |
| FastAPI | REST API framework |
| SQLAlchemy | Database ORM |
| SQLite | Database |
| Pydantic | Request and response validation |
| Uvicorn | ASGI server |
| Swagger UI | API documentation and testing |

## Project Structure

```text
TraceSure/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── database/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   ├── tests/
│   └── requirements.txt
├── data/
├── docs/
├── frontend/
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites

- Python 3.10 or later
- Git

### 1. Clone the repository

```bash
git clone https://github.com/ShaikIsmail4474/TraceSure.git
cd TraceSure
```

### 2. Create a virtual environment

```bash
cd backend
python -m venv venv
```

### 3. Activate the virtual environment

**Windows:**

```cmd
venv\Scripts\activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Start the application

```bash
python -m uvicorn app.main:app --reload
```

The API will be available at:

`http://127.0.0.1:8000`

## API Documentation

FastAPI automatically provides interactive API documentation.

- **Swagger UI:** `http://127.0.0.1:8000/docs`
- **ReDoc:** `http://127.0.0.1:8000/redoc`
- **Health Check:** `http://127.0.0.1:8000/health`

## API Endpoints

| Module | Method | Endpoint |
|---|---|---|
| Products | GET, POST | `/products/` |
| Products | GET, PUT, DELETE | `/products/{product_id}` |
| Suppliers | GET, POST | `/suppliers/` |
| Suppliers | GET, PUT, DELETE | `/suppliers/{supplier_id}` |
| Batches | GET, POST | `/batches/` |
| Batches | GET, PUT, DELETE | `/batches/{batch_id}` |
| Shipments | GET, POST | `/shipments/` |
| Shipments | GET, PUT, DELETE | `/shipments/{shipment_id}` |
| Recalls | GET, POST | `/recalls/` |
| Recalls | GET, PUT, DELETE | `/recalls/{recall_id}` |
| Traceability | GET | `/traceability/batches/{batch_id}` |
| Recall Impact | GET | `/recall-impact/{recall_id}` |
| Audit Logs | GET, POST | `/audit-logs/` |
| Audit Logs | GET, DELETE | `/audit-logs/{audit_id}` |

## Example Workflow

1. Register a product.
2. Register its supplier.
3. Create a batch linked to the product and supplier.
4. Create a shipment linked to the batch.
5. Create a recall linked to the affected batch.
6. Use the batch traceability API to retrieve related records.
7. Use recall impact analysis to identify the affected quantity and shipments.
8. Create audit log entries to record relevant activities.

## Testing and Verification

The following backend operations have been manually tested through Swagger UI:

- CRUD operations for products, suppliers, batches, shipments, and recalls.
- Audit log creation, retrieval, and deletion.
- Batch traceability API.
- Recall impact analysis API.
- Database table and record verification.
- API route registration.
- Invalid batch ID handling (404 Not Found).
- Invalid batch quantity validation (422 Unprocessable Entity).

## Current Scope and Limitations

- The current implementation uses SQLite.
- Recall impact analysis currently covers a recall linked to a single batch.
- Audit log entries are created manually through the API; automatic logging from other CRUD operations is not yet integrated.
- Authentication and role-based access control are not yet implemented.
- The frontend is planned as a future development phase.

## Future Enhancements

- React-based dashboard.
- Authentication and role-based access control.
- Automated audit logging.
- Advanced supply-chain relationship and recall analysis.
- Notifications and recall alerts.
- Production database integration and deployment.

## Project Status

The backend MVP and its core API workflows have been implemented and manually tested. Further integration and enhancements are planned.

## License

This project is currently provided for evaluation and educational purposes.

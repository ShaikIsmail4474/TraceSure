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



# TraceSure – Supply Chain Traceability & Product Recall Management System

TraceSure is a full-stack web application designed to improve supply chain transparency, product traceability, shipment monitoring, and product recall management.

The application helps organizations track products from suppliers through manufacturing batches and shipments, while providing recall information and audit records through a centralized dashboard.

## Key Features

### 1. Dashboard
- Displays live supply chain statistics.
- Shows product, supplier, batch, shipment, and recall counts.
- Displays recent shipment and audit activity.
- Provides recall monitoring information.

### 2. Product Management
- View registered products.
- Track product names, SKUs, descriptions, and categories.
- Search product records.

### 3. Supplier Management
- View supplier information.
- Track contact persons, email addresses, phone numbers, and locations.
- Search supplier records.

### 4. Batch Management
- Track manufacturing batches.
- Associate batches with products and suppliers.
- View manufacturing dates, expiry dates, quantities, and batch status.

### 5. Shipment Tracking
- Monitor shipments associated with batches.
- Track origin, destination, carrier, and tracking number.
- View shipment dates and delivery status.

### 6. Product Recall Management
- Create and track product recalls.
- Associate recalls with affected batches.
- Record recall reasons, severity, and status.

### 7. Batch Traceability
- Retrieve batch information.
- Identify associated products and suppliers.
- View related shipments and recalls.

### 8. Recall Impact Analysis
- Retrieve recall details and associated batch information.
- Identify the affected product, supplier, and shipments.
- Display an impact summary.

### 9. Audit Logs
- View recorded audit activities.
- Track entity types, entity IDs, actions, descriptions, and timestamps.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Styling | CSS, Tailwind CSS |
| Backend | Python, FastAPI |
| Database | SQLite |
| ORM | SQLAlchemy |
| Validation | Pydantic |
| API Communication | Axios |
| Data Visualization | Recharts |
| Icons | Lucide React |
| API Documentation | Swagger UI |

## System Architecture

The application follows a frontend-backend architecture.

1. The React frontend provides the user interface.
2. Axios sends HTTP requests to the FastAPI backend.
3. FastAPI processes requests through API routers.
4. SQLAlchemy interacts with the SQLite database.
5. The backend returns JSON responses to the frontend.

## Project Structure

```text
TraceSure/
│
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
│   ├── requirements.txt
│   └── tracesure.db
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── Products.jsx
│   │   ├── Suppliers.jsx
│   │   ├── Batches.jsx
│   │   ├── Shipments.jsx
│   │   ├── Recalls.jsx
│   │   ├── Traceability.jsx
│   │   ├── AuditLogs.jsx
│   │   ├── api.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites

Install the following:

- Python 3.10 or later
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/ShaikIsmail4474/TraceSure.git
cd TraceSure
```

### 2. Backend Setup

Open a terminal:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows Git Bash:

```bash
source venv/Scripts/activate
```

Or on Windows Command Prompt:

```cmd
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
python -m uvicorn app.main:app --reload
```

Backend URL:

http://127.0.0.1:8000

### 3. API Documentation

FastAPI provides interactive API documentation through Swagger UI.

http://127.0.0.1:8000/docs

Health check:

http://127.0.0.1:8000/health

### 4. Frontend Setup

Open a separate terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend URL:

http://localhost:5173

### 5. Production Build

To verify the frontend production build:

```bash
npm run build
```

## Main API Endpoints

| Module | Endpoint |
|---|---|
| Products | `/products/` |
| Suppliers | `/suppliers/` |
| Batches | `/batches/` |
| Shipments | `/shipments/` |
| Recalls | `/recalls/` |
| Batch Traceability | `/traceability/batches/{batch_id}` |
| Recall Impact | `/recall-impact/{recall_id}` |
| Audit Logs | `/audit-logs/` |
| Health Check | `/health` |

The backend provides CRUD operations for the main entity modules. Refer to Swagger UI for the complete endpoint list, request schemas, and response formats.

## Database

TraceSure currently uses SQLite with SQLAlchemy ORM.

Main entities include:

- Product
- Supplier
- Batch
- Shipment
- Recall
- Audit Log

Relationships connect products and suppliers to batches, batches to shipments, and batches to recalls.

## Current Implementation Status

The current version is a functional MVP with:

- Backend API integration.
- Database persistence.
- Multiple sample records.
- Dashboard statistics.
- Eight frontend navigation modules.
- Batch traceability and recall impact views.
- Search and record viewing functionality.

## Limitations

The current MVP has some limitations:

- Authentication and role-based authorization are not implemented.
- Audit logs are manually recorded rather than automatically generated for every operation.
- Audit log records can currently be deleted.
- Recall impact analysis is based on the implemented recall-to-batch relationship and is not an advanced network analysis engine.
- The frontend currently focuses primarily on viewing and searching records; complete CRUD workflows are not available through every frontend page.
- SQLite is used for development and demonstration.

## Future Enhancements

- JWT-based authentication.
- Role-based access for administrators and analysts.
- Automated audit logging.
- Advanced recall impact analysis.
- Interactive supply chain relationship graphs.
- Automated notifications for recalls and shipment updates.
- Production database integration.
- Automated testing and deployment.

## Author

**Shaik Ismail**

GitHub: https://github.com/ShaikIsmail4474

## Repository

https://github.com/ShaikIsmail4474/TraceSure

---

**TraceSure – Improving Supply Chain Transparency, Traceability, and Product Safety.**
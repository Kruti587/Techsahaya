# Tech Sahaya - Digital Citizen Welfare Platform

A production-style AI-assisted welfare navigation system that helps citizens discover government schemes, verify eligibility, prepare documents, and track benefit journeys through a secure multilingual platform.

Tech Sahaya is built for real citizen workflows: farmers, women, students, workers, families, senior citizens, persons with disabilities, CSC operators, and administrators.

## Overview

Tech Sahaya converts fragmented welfare discovery into a guided digital journey:

```text
Citizen Profile
      |
      v
Scheme Discovery
      |
      v
Rule-Based Eligibility
      |
      v
Document Readiness
      |
      v
Application Roadmap
      |
      v
Benefit Tracking
```

The platform combines deterministic eligibility logic, structured scheme data, RAG-based assistance, secure document handling, role-based access control, and privacy-first data management.

## Core Capabilities

### Citizen Workflows

- Discover central and state government schemes.
- Search schemes by category, state, occupation, income, age, and eligibility fit.
- Check eligibility using deterministic backend rules.
- See matched rules, failed rules, missing information, and next actions.
- Detect welfare benefits a citizen may be missing.
- Analyze schemes for every family member.
- Simulate income, occupation, age, landholding, and family-status changes.
- Track welfare journey stages from discovery to renewal.
- Upload supporting documents securely.
- Manage consent, privacy settings, account activity, and data deletion.

### Intelligence Layer

- Ask Sahaya chat interface for scheme explanation and guidance.
- Retrieval-first RAG pipeline using local scheme chunks.
- FAISS-ready semantic search with safe fallback retrieval.
- Evidence-first answers with scheme name, source, verification status, and confidence.
- AI explanation layer is separated from eligibility decisions.
- Eligibility is always decided by deterministic rules.

### Security And Governance

- Secure signup, login, logout, and protected sessions.
- Backend-enforced RBAC for `CITIZEN`, `CSC_OPERATOR`, and `ADMIN`.
- Ownership validation for citizen profile, document, activity, and journey data.
- CSC assistance sessions require citizen authorization.
- Admin routes are separated from citizen workflows.
- Audit logging for authentication, consent, document, profile, and authorization events.
- Strict CORS, security headers, request validation, and safe error handling.

## Architecture

```text
Frontend: React + Vite + TypeScript + Tailwind
        ↓
API Client: Axios + Auth Token Handling
        ↓
Backend: FastAPI + Pydantic + SQLAlchemy
        ↓
Service Layer
  ├── Auth Service
  ├── RBAC Dependencies
  ├── Eligibility Engine
  ├── Scheme Catalogue Service
  ├── Recommendation Service
  ├── Welfare Gap Service
  ├── Family Analysis Service
  ├── Document Processing Service
  ├── RAG/Search Service
  ├── Profile Service
  └── Audit Service
        ↓
Data Layer: SQLite + JSON Schemes + JSON Rules + Retrieval Chunks
```

## Tech Stack

| Layer | Tools |
| --- | --- |
| Frontend | React, Vite, TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Routing | React Router |
| State | React Context, hooks |
| API Client | Axios |
| PWA | vite-plugin-pwa |
| Backend | FastAPI |
| Validation | Pydantic |
| ORM | SQLAlchemy |
| Database | SQLite |
| Search | FAISS-ready retrieval with fallback |
| Auth | Local auth adapter, Supabase Auth-ready adapter |
| Testing | Pytest, TypeScript build checks |
| DevOps | Docker, Docker Compose |
| API Docs | Swagger/OpenAPI, ReDoc |

## End-To-End Flow

```text
User Action
  → React UI
  → Protected Route / Public Route
  → Axios API Request
  → FastAPI Router
  → Auth + Role + Ownership Checks
  → Pydantic Validation
  → Service Layer
  → SQLite / JSON Knowledge Base
  → Structured JSON Response
  → Citizen-Friendly UI Result
```

## Project Structure

```text
Techsahaya/
├── backend/
│   ├── app/
│   │   ├── core/          # config, database, auth dependencies, security helpers
│   │   ├── models/        # SQLAlchemy models and Pydantic schemas
│   │   ├── routers/       # FastAPI API routes
│   │   ├── services/      # business logic
│   │   └── utils/         # seed utilities
│   ├── tests/             # backend test suite
│   ├── main.py            # FastAPI app entrypoint
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/    # reusable UI components
│   │   ├── context/       # app/auth/language state
│   │   ├── pages/         # route pages
│   │   ├── services/      # API client
│   │   ├── types/         # TypeScript interfaces
│   │   └── utils/         # i18n and helpers
│   ├── package.json
│   └── Dockerfile
├── data/
│   ├── chunks/            # RAG retrieval chunks
│   ├── personas/          # local walkthrough personas
│   ├── rules/             # deterministic eligibility rules
│   └── schemes/           # structured scheme records
├── docs/
│   └── supabase_rls.sql   # Supabase table and RLS reference
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Government Scheme Catalogue

The project uses a structured scheme architecture instead of hardcoded cards.

Each scheme supports:

- Scheme ID
- Name
- Description
- Category
- State applicability
- Benefit details
- Eligibility summary
- Required documents
- Application steps
- Department
- Official source
- Source URL
- Last verified date
- Alternative scheme mapping

Included scheme records:

- PM-Kisan
- Ayushman Bharat PM-JAY
- PMAY-G
- National Scholarship Portal
- PM Ujjwala Yojana
- e-Shram
- Sukanya Samriddhi
- Krishi Bhagya Karnataka
- Swachh Bharat Mission Gramin
- PM Vishwakarma
- PM-SYM
- UDID

Data locations:

```text
data/schemes/schemes.json
data/rules/*.json
data/chunks/scheme_chunks.json
```

## Eligibility Engine

Eligibility is calculated in `backend/app/services/eligibility_engine.py`.

Supported rule types:

| Rule Type | Example |
| --- | --- |
| Age | minimum age, maximum age |
| Income | annual income threshold |
| Occupation | farmer, student, worker, artisan |
| Gender | women, girl child, all |
| State | national or state-specific |
| Landholding | small/marginal farmer checks |
| Disability | disability certificate/profile flag |
| Documents | required and alternative documents |

Response format:

```json
{
  "eligible": true,
  "status": "eligible",
  "matched": [
    "State requirement satisfied"
  ],
  "failed": [],
  "missing": [],
  "score": 100
}
```

This makes eligibility transparent, testable, and explainable.

## Ask Sahaya RAG Flow

```text
Citizen Question
      ↓
Query Normalization
      ↓
FAISS / Fallback Retrieval
      ↓
Top Evidence Chunks
      ↓
Answer Generation
      ↓
Evidence + Source + Confidence UI
```

The AI layer explains retrieved information. It does not invent scheme rules and does not decide eligibility.

## Document Security Flow

```text
Document Selected
      ↓
Frontend Type/Size Validation
      ↓
Authenticated Upload
      ↓
Backend MIME/Size Validation
      ↓
In-Memory Processing
      ↓
Sensitive Field Masking
      ↓
Document Metadata Saved
      ↓
Raw File Discarded
```

Security controls:

- No raw Aadhaar storage
- No raw PAN storage
- No biometric storage
- No public document URLs
- No permanent raw identity document storage
- User-scoped document metadata
- Backend ownership checks
- Audit event creation

## Role-Based Access Control

| Role | Access |
| --- | --- |
| `CITIZEN` | Own dashboard, profile, documents, eligibility, welfare gaps, family analysis, journey, privacy controls |
| `CSC_OPERATOR` | CSC dashboard and authorized citizen assistance sessions |
| `ADMIN` | Scheme/rule/source/user management, audit logs, policy conflict monitoring, system overview |

RBAC is enforced in FastAPI dependencies before protected business logic runs.

## Privacy Controls

Tech Sahaya includes:

- Consent-first profile setup
- Stored-data summary
- Purpose-limited data collection
- Account activity log
- Consent withdrawal
- Delete-my-data workflow
- Sensitive document handling policy
- Environment-based secret management

## Quick Start

### Clone

```bash
git clone https://github.com/chinmayee1096/Techsahaya.git
cd Techsahaya
```

### Backend

Windows:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy ..\.env.example .env
uvicorn main:app --reload
```

macOS/Linux:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp ../.env.example .env
uvicorn main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
Swagger: http://127.0.0.1:8000/docs
ReDoc:   http://127.0.0.1:8000/redoc
```

### Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Docker

Run the full system:

```bash
docker compose up --build
```

Services:

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend | `http://127.0.0.1:8000` |
| Swagger | `http://127.0.0.1:8000/docs` |

## Environment Variables

```env
GEMINI_API_KEY=
GOOGLE_API_KEY=
BHASHINI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AUTH_ADAPTER=local
DATABASE_URL=sqlite:///./tech_sahaya_secure.db
FAISS_INDEX_PATH=./data/faiss_index
MAX_UPLOAD_SIZE=5242880
RATE_LIMIT_PER_MINUTE=10
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Keep real secrets in `backend/.env`. The `.env` file is ignored by Git.

## Local Login Accounts

| Role | Email | Password |
| --- | --- | --- |
| Citizen | `citizen@techsahaya.org` | `Citizen@123` |
| CSC Operator | `csc@techsahaya.org` | `Csc@12345` |
| Admin | `admin@techsahaya.org` | `Admin@12345` |

## Frontend Routes

### Public

| Route | Page |
| --- | --- |
| `/` | Landing page |
| `/how-it-works` | Platform workflow |
| `/schemes` | Public scheme explorer |
| `/schemes/:schemeId` | Scheme details |
| `/security` | Security and privacy |
| `/about` | About platform |
| `/login` | Login |
| `/signup` | Signup |
| `/forgot-password` | Password reset |

### Citizen

| Route | Page |
| --- | --- |
| `/dashboard` | Citizen dashboard |
| `/chat` | Ask Sahaya |
| `/find-schemes` | Authenticated scheme discovery |
| `/eligibility` | Eligibility checker |
| `/welfare-gaps` | Missed-benefit detector |
| `/family` | Family benefit optimizer |
| `/what-if` | What-if simulator |
| `/journey` | Welfare journey |
| `/documents` | Secure documents |
| `/notifications` | Notifications |
| `/profile` | Profile |
| `/privacy` | Privacy and security center |

### CSC And Admin

| Route | Page |
| --- | --- |
| `/csc/dashboard` | CSC dashboard |
| `/csc/citizen-session` | Authorized citizen session |
| `/admin/dashboard` | Admin dashboard |
| `/admin/schemes` | Scheme management |
| `/admin/rules` | Rule management |
| `/admin/sources` | Source management |
| `/admin/users` | User management |
| `/admin/audit` | Audit logs |

## Backend API

### Public APIs

| Method | Endpoint |
| --- | --- |
| GET | `/` |
| GET | `/health` |
| GET | `/api/schemes` |
| GET | `/api/schemes/{scheme_id}` |
| GET | `/api/sources/{scheme_id}` |
| GET | `/api/personas` |

### Auth APIs

| Method | Endpoint |
| --- | --- |
| POST | `/api/auth/signup` |
| POST | `/api/auth/login` |
| POST | `/api/auth/logout` |
| GET | `/api/auth/me` |
| POST | `/api/auth/forgot-password` |
| POST | `/api/consent` |

### Citizen APIs

| Method | Endpoint |
| --- | --- |
| POST | `/api/chat` |
| POST | `/api/voice-chat` |
| POST | `/api/check-eligibility` |
| GET | `/api/recommendations` |
| GET | `/api/welfare-gaps` |
| POST | `/api/family/analyze` |
| POST | `/api/what-if` |
| GET | `/api/journey` |
| GET | `/api/profile` |
| PUT | `/api/profile` |
| DELETE | `/api/profile` |
| GET | `/api/notifications` |
| GET | `/api/audit` |
| POST | `/api/schemes/save` |

### Document APIs

| Method | Endpoint |
| --- | --- |
| GET | `/api/documents` |
| POST | `/api/documents/upload` |
| GET | `/api/documents/{id}` |
| DELETE | `/api/documents/{id}` |

### CSC/Admin APIs

| Method | Endpoint |
| --- | --- |
| POST | `/api/csc/citizen-session` |
| POST | `/api/csc/citizen-session/{session_id}/end` |
| GET | `/api/admin/dashboard` |
| GET | `/api/admin/schemes` |
| GET | `/api/admin/rules` |
| GET | `/api/admin/sources` |
| GET | `/api/admin/users` |
| GET | `/api/admin/audit` |

## Testing

Backend:

```bash
cd backend
pytest
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

## Supabase Auth And RLS

The project runs locally with `AUTH_ADAPTER=local`.

For Supabase-backed authentication:

```env
AUTH_ADAPTER=supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Reference SQL for database tables, RLS policies, roles, and private document-storage design is available at:

```text
docs/supabase_rls.sql
```

## Why Tech Sahaya Stands Out

- Workflow-first citizen experience instead of a generic chatbot.
- Deterministic eligibility engine for transparent welfare decisions.
- Evidence-first AI responses with source provenance.
- Secure document flow designed around data minimization.
- Role-aware platform for citizens, CSC operators, and administrators.
- Multilingual and voice-oriented user interface.
- Modular backend services that can run locally and integrate with managed providers.
- Professional public-service UI designed for trust, accessibility, and clarity.

## Useful Commands

```bash
# Backend tests
cd backend
pytest
```

```bash
# Frontend validation
cd frontend
npm run lint
npm run build
```

```bash
# Docker
docker compose up --build
```

## Troubleshooting

### Backend Port Is Busy

```bash
cd backend
uvicorn main:app --reload --port 8011
```

Then set:

```env
VITE_API_BASE_URL=http://127.0.0.1:8011
```

### Frontend Cannot Connect To Backend

Check:

- Backend server is running.
- `VITE_API_BASE_URL` points to the backend.
- `CORS_ORIGINS` contains the frontend URL.

### Authentication Fails Locally

Use local auth mode:

```env
AUTH_ADAPTER=local
```

Restart the backend after changing environment variables.

## Repository Safety

The repository includes the source files required to run the project. Sensitive and generated files are excluded through `.gitignore`:

- `.env`
- SQLite database files
- Python virtual environments
- `node_modules`
- frontend build output
- runtime logs
- cache files

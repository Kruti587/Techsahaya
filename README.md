# Tech Sahaya

Tech Sahaya is a full-stack Digital Citizen Assistant for welfare discovery, explainable eligibility, secure document handling, and guided government-scheme application journeys.

It is built as a production-style platform with a React + TypeScript frontend, FastAPI backend, deterministic eligibility engine, local scheme knowledge base, evidence-first RAG flow, RBAC, audit logging, privacy controls, and Dockerized development.

```text
Discover -> Understand -> Verify -> Prepare Documents -> Apply -> Track Benefits
```

## Platform Overview

Tech Sahaya helps citizens navigate government benefits through a secure workflow-oriented interface instead of forcing them to search across disconnected portals.

The platform supports:

- Citizens who want to find benefits, check eligibility, prepare documents, and track actions.
- Farmers, students, women, families, senior citizens, workers, and persons with disabilities.
- CSC operators who assist citizens through authorized support sessions.
- Admin users who manage schemes, rules, official sources, users, and audit events.

## Highlights

- Full-stack React + FastAPI application
- Public landing page and public scheme explorer
- Secure login, signup, protected routes, and role-based dashboards
- Backend-enforced RBAC for `CITIZEN`, `CSC_OPERATOR`, and `ADMIN`
- Deterministic eligibility engine with matched, failed, and missing rules
- Evidence-first Ask Sahaya assistant powered by local RAG
- FAISS-ready semantic search with fallback retrieval
- Secure document upload flow with MIME and size validation
- No raw Aadhaar, PAN, biometric, or identity-image storage
- Consent, privacy center, audit events, and delete-my-data workflow
- Welfare gap detection, family benefit analysis, and what-if simulation
- English, Hindi, and Kannada language support
- PWA-ready frontend with offline-friendly scheme browsing
- Docker Compose setup for frontend and backend
- Automated backend tests

## System Architecture

```text
Frontend
React + Vite + TypeScript + Tailwind
        |
        | Axios API client with auth token handling
        v
Backend API
FastAPI + Pydantic + SQLAlchemy
        |
        | Services
        |-- Auth + RBAC
        |-- Eligibility Engine
        |-- Scheme Catalogue
        |-- RAG/Search Service
        |-- Document Service
        |-- Profile/Consent/Audit Services
        v
Local Data Layer
SQLite + JSON Scheme Data + JSON Rule Files + Retrieval Chunks
```

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, TypeScript |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Routing | React Router |
| State | React Context and hooks |
| HTTP | Axios |
| PWA | vite-plugin-pwa |
| Backend | FastAPI |
| Validation | Pydantic |
| ORM | SQLAlchemy |
| Database | SQLite for local development |
| Retrieval | FAISS-ready search with fallback |
| Testing | Pytest, TypeScript build checks |
| Deployment | Docker, Docker Compose |
| Auth-ready | Supabase Auth adapter |

## Repository Structure

```text
TechSahasya/
├── backend/
│   ├── app/
│   │   ├── core/          # config, db, auth, security helpers
│   │   ├── models/        # SQLAlchemy and Pydantic models
│   │   ├── routers/       # FastAPI route definitions
│   │   ├── services/      # business logic and platform services
│   │   └── utils/         # seed and helper utilities
│   ├── tests/             # backend automated tests
│   ├── main.py            # FastAPI application entrypoint
│   ├── requirements.txt
│   └── Dockerfile
├── data/
│   ├── chunks/            # RAG retrieval chunks
│   ├── personas/          # local quick-start personas
│   ├── rules/             # deterministic eligibility rules
│   └── schemes/           # structured scheme catalogue
├── docs/
│   └── supabase_rls.sql   # Supabase table/RLS reference policies
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## Application Modules

### Public Website

- Landing page with clear citizen journey
- Public scheme catalogue
- Scheme detail pages with benefits, eligibility, documents, evidence, and official source links
- Security and privacy information
- Login, signup, and forgot-password routes

### Citizen Console

- Welfare readiness score
- Personalized recommendations
- Benefits the citizen may be missing
- Pending actions and notifications
- Eligibility checks with explainable results
- Family benefit optimizer
- What-if simulator
- Document upload and document status
- Welfare journey tracking
- Profile and privacy controls

### CSC Operator Console

- CSC dashboard
- Authorized citizen assistance session flow
- Consent-first support model
- Guided scheme discovery and eligibility assistance
- Session closure with privacy-aware cleanup

### Admin Console

- Admin dashboard
- Scheme, rule, source, and user views
- Policy conflict monitoring
- System health indicators
- Security and audit event visibility

## Eligibility Engine

Eligibility is calculated by a deterministic backend rule engine, not by the AI assistant.

The engine supports:

- Age limits
- Income limits
- Occupation matching
- Gender rules
- State applicability
- Landholding checks
- Disability checks
- Required document checks

Response shape:

```json
{
  "eligible": true,
  "status": "eligible",
  "matched": [],
  "failed": [],
  "missing": [],
  "score": 100
}
```

This keeps eligibility decisions transparent, auditable, and explainable.

## Scheme Knowledge Base

Scheme data is separated from application logic:

- `data/schemes/schemes.json` stores scheme metadata.
- `data/rules/*.json` stores deterministic eligibility rules.
- `data/chunks/scheme_chunks.json` stores retrieval chunks for Ask Sahaya.

Included catalogue:

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

Each scheme supports structured fields for category, state scope, benefit details, eligibility, required documents, application steps, department, official source, last verification date, and alternative schemes.

## RAG And Ask Sahaya

Ask Sahaya uses a retrieval-first answer pipeline:

```text
User query -> query normalization -> local search -> top evidence chunks -> verified response
```

The assistant is designed to explain available evidence, not invent scheme rules. When external AI services are not configured, the local deterministic response layer keeps the application functional.

Every important response can include:

- Scheme name
- Evidence text
- Source
- Verification status
- Last verified date
- Confidence indicator

## Security Model

Tech Sahaya applies security controls across the frontend, backend, and data layer:

- Backend authentication dependency for protected routes
- Backend role dependency for citizen, CSC, and admin access
- Ownership checks for profile, document, activity, and journey data
- Request validation with Pydantic
- Upload MIME validation
- Upload size limits
- Strict CORS through environment configuration
- Security headers middleware
- Safe error responses
- Request IDs for debugging
- Audit logging for sensitive account and access events
- No secrets in frontend code
- No public document URLs

## Privacy Model

Tech Sahaya follows data minimization and consent-first handling:

- Collect only fields needed for welfare assistance.
- Store consent metadata with version, language, timestamp, and purpose.
- Process uploaded documents safely.
- Store document metadata instead of raw identity files.
- Mask extracted sensitive information.
- Provide account activity visibility.
- Provide user-controlled data deletion.

The system is designed to align with DPDP Act principles such as consent, purpose limitation, data minimization, and erasure control.

## Local Setup

### 1. Clone

```bash
git clone https://github.com/chinmayee1096/TechSahasya.git
cd TechSahasya
```

### 2. Configure Environment

Windows:

```bash
copy .env.example backend\.env
```

macOS/Linux:

```bash
cp .env.example backend/.env
```

Default local mode:

```env
AUTH_ADAPTER=local
DATABASE_URL=sqlite:///./tech_sahaya_secure.db
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Optional provider variables:

```env
GEMINI_API_KEY=
GOOGLE_API_KEY=
BHASHINI_API_KEY=
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
FAISS_INDEX_PATH=./data/faiss_index
MAX_UPLOAD_SIZE=5242880
RATE_LIMIT_PER_MINUTE=10
```

## Run The Application

### Backend

Windows:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

macOS/Linux:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend URLs:

```text
API: http://127.0.0.1:8000
Swagger: http://127.0.0.1:8000/docs
Health: http://127.0.0.1:8000/health
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## Docker Compose

```bash
docker compose up --build
```

Docker services:

- Frontend: `http://localhost:5173`
- Backend: `http://127.0.0.1:8000`
- Swagger: `http://127.0.0.1:8000/docs`

## Local Access Accounts

| Role | Email | Password |
| --- | --- | --- |
| Citizen | `citizen@techsahaya.org` | `Citizen@123` |
| CSC Operator | `csc@techsahaya.org` | `Csc@12345` |
| Admin | `admin@techsahaya.org` | `Admin@12345` |

## Route Map

### Public Routes

- `/`
- `/how-it-works`
- `/schemes`
- `/schemes/:schemeId`
- `/security`
- `/about`
- `/login`
- `/signup`
- `/forgot-password`

### Citizen Routes

- `/dashboard`
- `/chat`
- `/find-schemes`
- `/eligibility`
- `/welfare-gaps`
- `/family`
- `/what-if`
- `/journey`
- `/documents`
- `/notifications`
- `/profile`
- `/privacy`

### CSC Routes

- `/csc/dashboard`
- `/csc/citizen-session`

### Admin Routes

- `/admin/dashboard`
- `/admin/schemes`
- `/admin/rules`
- `/admin/sources`
- `/admin/users`
- `/admin/audit`

## API Reference

### Public

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/` | API root metadata |
| GET | `/health` | Health check |
| GET | `/api/schemes` | List schemes |
| GET | `/api/schemes/{scheme_id}` | Scheme detail |
| GET | `/api/sources/{scheme_id}` | Scheme source evidence |
| GET | `/api/personas` | Local profile presets |

### Auth And Consent

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Start session |
| POST | `/api/auth/logout` | End session |
| GET | `/api/auth/me` | Current user |
| POST | `/api/auth/forgot-password` | Password reset request |
| POST | `/api/consent` | Store consent metadata |

### Citizen Workflows

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/chat` | Ask Sahaya text chat |
| POST | `/api/voice-chat` | Voice-oriented assistant request |
| POST | `/api/check-eligibility` | Deterministic eligibility check |
| GET | `/api/recommendations` | Personalized scheme recommendations |
| GET | `/api/welfare-gaps` | Missing benefit analysis |
| POST | `/api/family/analyze` | Family benefit analysis |
| POST | `/api/what-if` | Eligibility simulation |
| GET | `/api/journey` | Welfare journey checklist |
| GET | `/api/notifications` | User notifications |
| GET | `/api/audit` | User account activity |
| POST | `/api/schemes/save` | Save a scheme |

### Profile And Documents

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/profile` | Read own profile |
| PUT | `/api/profile` | Update own profile |
| DELETE | `/api/profile` | Delete own data |
| GET | `/api/documents` | List own documents |
| POST | `/api/documents/upload` | Upload and process a document |
| GET | `/api/documents/{id}` | Read document metadata |
| DELETE | `/api/documents/{id}` | Delete document metadata |

### CSC And Admin

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/csc/citizen-session` | Start authorized assistance session |
| POST | `/api/csc/citizen-session/{session_id}/end` | End assistance session |
| GET | `/api/admin/dashboard` | Admin system overview |
| GET | `/api/admin/schemes` | Scheme administration |
| GET | `/api/admin/rules` | Rule administration |
| GET | `/api/admin/sources` | Source administration |
| GET | `/api/admin/users` | User administration |
| GET | `/api/admin/audit` | Security audit events |

## Supabase Configuration

The app runs in local auth mode by default. To use Supabase Auth, set:

```env
AUTH_ADAPTER=supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Use the SQL reference in `docs/supabase_rls.sql` for table structure, RLS policies, and private storage policy design.

## Quality Checks

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

## Troubleshooting

### Port 8000 Is Already In Use

```bash
cd backend
uvicorn main:app --reload --port 8011
```

If you change the backend port, set the frontend API base URL:

```env
VITE_API_BASE_URL=http://127.0.0.1:8011
```

### Frontend Cannot Reach Backend

Check that:

- FastAPI is running.
- `CORS_ORIGINS` includes the frontend URL.
- `VITE_API_BASE_URL` points to the correct backend address.

### Authentication Does Not Start

For local development, use:

```env
AUTH_ADAPTER=local
```

Then restart the backend.

## Git Hygiene

The repository includes source and configuration files needed to run the application. Generated and sensitive files are ignored:

- `backend/.env`
- SQLite database files
- Python virtual environments
- `node_modules`
- frontend build output
- test caches
- runtime logs

## Project Status

Tech Sahaya is implemented as a working MVP with frontend, backend, local data, authentication, RBAC, deterministic eligibility, secure document workflows, citizen/CSC/admin experiences, RAG-ready assistant behavior, tests, Docker support, and API documentation.

# Tech Sahaya

Tech Sahaya is a secure, citizen-facing welfare navigation platform for discovering Indian government schemes, checking eligibility, preparing documents, and tracking the welfare application journey.

The product is designed for rural and semi-urban citizens, women, students, farmers, senior citizens, persons with disabilities, CSC operators, and administrators who need a trustworthy way to move from scheme discovery to action.

## What Tech Sahaya Does

Tech Sahaya is not just a chatbot. It follows a practical citizen journey:

```text
Discover -> Understand -> Verify -> Prepare -> Apply -> Track
```

Key capabilities:

- Discover relevant central and state welfare schemes.
- Understand scheme benefits, documents, and application steps in simple language.
- Check eligibility using a deterministic rule engine, not an LLM.
- See why a citizen is eligible, not eligible, or missing information.
- Find alternative schemes when a rule fails.
- Detect benefits a citizen may be missing.
- Analyze welfare options for the whole family.
- Upload documents safely with validation and sensitive-data minimization.
- Use Ask Sahaya with evidence-first answers and local fallback retrieval.
- Access citizen, CSC operator, and admin dashboards with backend-enforced RBAC.
- Control consent, privacy, account activity, and data deletion.

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind CSS, Lucide React
- Backend: Python, FastAPI, Pydantic, SQLAlchemy
- Local database: SQLite
- Search/RAG: FAISS when available, keyword/vector fallback when unavailable
- Authentication: Local development auth by default, Supabase Auth-ready adapter
- State management: React Context and hooks
- API client: Axios
- PWA: Vite PWA plugin
- Deployment support: Docker and Docker Compose
- API docs: FastAPI Swagger/OpenAPI

## Repository Structure

```text
TechSahasya/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── services/
│   │   └── utils/
│   ├── tests/
│   ├── main.py
│   ├── requirements.txt
│   └── Dockerfile
├── data/
│   ├── chunks/
│   ├── personas/
│   ├── rules/
│   └── schemes/
├── docs/
│   └── supabase_rls.sql
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

## Core Features

### Public Experience

- Professional public landing page
- Public scheme browsing
- Scheme details with source and evidence sections
- Security and privacy page
- Login, signup, and forgot-password screens

### Citizen Platform

- Citizen dashboard with welfare readiness score
- Recommended schemes
- Benefits the citizen may be missing
- Pending actions and recent activity
- Eligibility checker with visual rule results
- Welfare gap detector
- Family benefit optimizer
- What-if simulator
- Welfare journey tracker
- Notification center
- Privacy and security center

### Ask Sahaya

- Text-first and voice-oriented chat interface
- Browser microphone support where available
- English, Hindi, and Kannada language selection
- Evidence-first responses
- Source, verification status, and confidence indicators
- Local retrieval fallback when external AI keys are unavailable

### Document Handling

- Upload support for PDF, PNG, JPG, and JPEG
- Frontend and backend file validation
- File size limits
- MIME type checks
- Aadhaar/PAN filename rejection for safer local handling
- In-memory processing approach
- Masked extracted metadata
- No permanent raw identity document storage
- Ownership checks before document access

### RBAC

Roles:

- `CITIZEN`
- `CSC_OPERATOR`
- `ADMIN`

RBAC is enforced on the backend through authentication, role checks, and ownership checks. The frontend also uses protected routes and role-protected routes to prevent accidental access to restricted screens.

## Government Scheme Data

The current seed catalogue includes structured records and deterministic rule files for these schemes:

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

Scheme data is stored in `data/schemes`, eligibility rules are stored in `data/rules`, and retrieval chunks are stored in `data/chunks`.

Important: the architecture is ready for larger official scheme ingestion, but scheme rules should only be expanded from verified official sources.

## Prerequisites

Install:

- Python 3.11 or newer
- Node.js 20 or newer
- npm
- Git
- Docker Desktop, optional

## Environment Setup

Create backend environment variables from the template:

```bash
copy .env.example backend\.env
```

On macOS/Linux:

```bash
cp .env.example backend/.env
```

The app runs without external API keys when `AUTH_ADAPTER=local`.

Optional services can be configured later:

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

Do not commit `backend/.env`. It is ignored by Git.

## Run Locally

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

On macOS/Linux:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

Swagger API docs:

```text
http://127.0.0.1:8000/docs
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

## Local Accounts

These accounts are created for local development:

| Role | Email | Password |
| --- | --- | --- |
| Citizen | `citizen@techsahaya.org` | `Citizen@123` |
| CSC Operator | `csc@techsahaya.org` | `Csc@12345` |
| Admin | `admin@techsahaya.org` | `Admin@12345` |

For deployed environments, configure Supabase Auth and replace local credentials with managed authentication.

## Docker

Run the complete application:

```bash
docker compose up --build
```

Services:

- Frontend: `http://localhost:5173`
- Backend: `http://127.0.0.1:8000`
- API docs: `http://127.0.0.1:8000/docs`

## API Endpoints

### Public

- `GET /`
- `GET /health`
- `GET /api/schemes`
- `GET /api/schemes/{scheme_id}`
- `GET /api/sources/{scheme_id}`
- `GET /api/personas`

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/forgot-password`
- `POST /api/consent`

### Citizen Workflows

- `POST /api/chat`
- `POST /api/voice-chat`
- `POST /api/check-eligibility`
- `GET /api/recommendations`
- `GET /api/welfare-gaps`
- `POST /api/family/analyze`
- `POST /api/what-if`
- `GET /api/journey`
- `GET /api/profile`
- `PUT /api/profile`
- `DELETE /api/profile`
- `GET /api/notifications`
- `GET /api/audit`
- `POST /api/schemes/save`

### Documents

- `GET /api/documents`
- `POST /api/documents/upload`
- `GET /api/documents/{id}`
- `DELETE /api/documents/{id}`

### CSC Operator

- `POST /api/csc/citizen-session`
- `POST /api/csc/citizen-session/{session_id}/end`

### Admin

- `GET /api/admin/dashboard`
- `GET /api/admin/schemes`
- `GET /api/admin/rules`
- `GET /api/admin/sources`
- `GET /api/admin/users`
- `GET /api/admin/audit`

## Authentication Architecture

The project supports two authentication modes:

- Local mode: default mode for development and judging walkthroughs.
- Supabase mode: optional adapter for Supabase Auth JWT validation.

Set this in `backend/.env`:

```env
AUTH_ADAPTER=local
```

To prepare Supabase Auth:

```env
AUTH_ADAPTER=supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Supabase RLS reference policies are available in:

```text
docs/supabase_rls.sql
```

## Security And Privacy

Tech Sahaya is built with privacy-by-design principles:

- No API keys in frontend code
- No raw Aadhaar number storage
- No raw PAN number storage
- No biometric data storage
- No permanent raw identity document storage
- Document metadata is user-scoped
- Backend verifies authentication, role, and ownership
- Security headers are applied by FastAPI middleware
- Strict CORS is controlled through environment variables
- Upload type and size are validated
- Audit logs avoid sensitive document contents
- User data deletion is available through the backend

The project is designed to align with DPDP Act principles such as consent, purpose limitation, data minimization, and user-controlled erasure. This repository does not claim legal certification.

## Testing

### Backend

```bash
cd backend
pytest
```

Backend tests cover:

- Health endpoint
- Auth flows
- Protected route behavior
- Scheme listing and details
- Eligibility
- Alternative schemes
- Welfare gaps
- Family analysis
- What-if simulation
- Profile update and deletion
- Document security behavior
- Admin RBAC checks

### Frontend

```bash
cd frontend
npm run lint
npm run build
```

## Troubleshooting

### Port 8000 Is Blocked Or Already In Use

Run the backend on a different port:

```bash
cd backend
uvicorn main:app --reload --port 8011
```

Then update the frontend API URL if needed:

```env
VITE_API_BASE_URL=http://127.0.0.1:8011
```

### Backend Shows `{"detail":"Not Found"}` At `/`

Make sure you are running from the backend folder:

```bash
cd backend
uvicorn main:app --reload
```

Then open:

```text
http://127.0.0.1:8000/
```

### Signup Or Login Fails

Check:

- Backend is running on `127.0.0.1:8000`.
- Frontend `VITE_API_BASE_URL` points to the backend.
- `AUTH_ADAPTER=local` is set for local development.
- Browser network tab does not show CORS errors.

## Deployment Notes

For a production deployment:

- Use Supabase Auth instead of local auth.
- Apply RLS policies from `docs/supabase_rls.sql`.
- Use HTTPS.
- Configure strict production CORS origins.
- Store secrets only in backend/server environment variables.
- Use private storage buckets for sensitive documents.
- Disable development seed credentials.
- Add monitoring and backup policies.
- Expand scheme records only from verified official sources.

## Known Limitations

- The included scheme catalogue is a structured starter set, not a complete national database.
- External Gemini, Bhashini, Google Vision OCR, STT/TTS, and Supabase services require separate configuration.
- Voice support depends on browser speech APIs when external voice services are not configured.
- Local SQLite is intended for development, not multi-user production deployment.
- Document processing uses a safe local extraction simulation unless an OCR provider is integrated.

## Project Status

Tech Sahaya is a working MVP with frontend, backend, local database, seed scheme data, deterministic eligibility rules, document handling, RBAC, privacy controls, tests, Docker support, and API documentation.

# Tech Sahaya

Tech Sahaya is a production-style welfare discovery and navigation platform built with React, Vite, TypeScript, Tailwind CSS, FastAPI, Pydantic, SQLite, FAISS-ready retrieval, and a modular AI explanation layer.

It helps citizens discover schemes, understand deterministic eligibility, identify welfare gaps, compare what-if scenarios, analyze household benefits, manage documents securely, and control personal data from a privacy-first interface.

## Architecture

- `frontend`: React + Vite + TypeScript + Tailwind + Lucide + PWA
- `backend`: FastAPI + Pydantic + SQLite + backend-enforced RBAC
- `data`: source-backed scheme records, deterministic rules, retrieval chunks, and quick-start personas
- `docs`: Supabase/RLS reference material and implementation notes
- `local retrieval`: FAISS-backed search when available with keyword fallback
- `privacy`: no Aadhaar/PAN storage, no raw identity document retention, and real delete-my-data API

## Features

- Public landing, scheme explorer, scheme details, security page, and auth screens
- Login, signup, logout, forgot-password flow, protected routes, and role-protected routes
- Citizen dashboard with readiness score, recommendations, welfare gaps, pending actions, family summary, journey, activity, and notifications
- CSC operator dashboard and authorized citizen assistance sessions
- Admin dashboard for schemes, rules, sources, users, audit logs, conflicts, and system status
- Evidence-first Ask Sahaya flow using retrieval and local fallback responses
- Deterministic eligibility engine; AI explains but never decides eligibility
- Secure document upload with type/size validation, in-memory processing, masked metadata, and ownership checks
- Privacy & Security center with consent, retention, access control, audit activity, withdrawal, and deletion
- Collapsible desktop sidebar, mobile navigation, active route indicators, icons, and role-aware navigation

## Local Development

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend runs at `http://127.0.0.1:8000`.

## Seeded Local Accounts

- Citizen: `citizen@techsahaya.org` / `Citizen@123`
- CSC operator: `csc@techsahaya.org` / `Csc@12345`
- Admin: `admin@techsahaya.org` / `Admin@12345`

These accounts are for local development and judging walkthroughs. Configure Supabase Auth for deployed environments.

## Docker

```bash
docker compose up --build
```

## API Endpoints

- `GET /health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/consent`
- `POST /api/chat`
- `POST /api/voice-chat`
- `GET /api/schemes`
- `GET /api/schemes/{scheme_id}`
- `POST /api/check-eligibility`
- `GET /api/recommendations`
- `GET /api/welfare-gaps`
- `POST /api/family/analyze`
- `POST /api/what-if`
- `GET /api/journey`
- `GET /api/profile`
- `PUT /api/profile`
- `DELETE /api/profile`
- `GET /api/documents`
- `POST /api/documents/upload`
- `GET /api/documents/{id}`
- `DELETE /api/documents/{id}`
- `GET /api/notifications`
- `GET /api/audit`
- `POST /api/csc/citizen-session`
- `GET /api/admin/dashboard`
- `GET /api/admin/schemes`
- `GET /api/admin/rules`
- `GET /api/admin/sources`
- `GET /api/admin/users`
- `GET /api/admin/audit`

Swagger UI is available at `/docs` when the backend is running.

## Supabase Configuration

Set these values in `.env` when moving beyond local SQLite:

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AUTH_ADAPTER=supabase
```

Use [docs/supabase_rls.sql](D:/Decode_SIH/docs/supabase_rls.sql) as the reference policy set for Supabase tables and private storage.

## Testing

```bash
cd backend
pytest
```

```bash
cd frontend
npm run lint
npm run build
```

## Privacy And Security

- Backend-enforced authentication, authorization, role checks, and ownership checks
- Strict CORS configuration through environment variables
- Request IDs and security headers
- Upload size and MIME validation
- No secrets in frontend code
- No raw Aadhaar/PAN/biometric storage
- No public document URLs
- Audit events for authentication, consent, documents, profile updates, deletion, and role-protected access

## Known Limitations

- Scheme records are source-backed starter data and should be expanded through official ingestion workflows
- Supabase Auth and Storage require external credentials before cloud operation
- The AI provider layer is modular and falls back locally when external keys are unavailable

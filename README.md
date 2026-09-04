# 🚀 Tech Sahaya - Digital Citizen Welfare Platform

A production-style AI-assisted welfare navigation system that helps citizens discover government schemes, verify eligibility, prepare documents, and track benefit journeys through a secure multilingual platform.

Tech Sahaya is built for real citizen workflows: farmers, women, students, workers, families, senior citizens, persons with disabilities, CSC operators, and administrators.

## 🌟 Overview

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

## 🎯 Core Capabilities

### 👥 Citizen Workflows

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

### 🧠 Intelligence Layer

- Ask Sahaya chat interface for scheme explanation and guidance.
- Retrieval-first RAG pipeline using semantic scheme chunks.
- Persistent TF-IDF + FAISS semantic search with a safe fallback retrieval path (index cached under `data/.cache/` and reused via dataset hash).
- Evidence-first answers with scheme name, source, verification status, and confidence.
- AI explanation layer is separated from eligibility decisions.
- Eligibility is always decided by deterministic rules.

### 🔐 Security And Governance

- Secure signup, login, logout, and protected sessions.
- Backend-enforced RBAC for `CITIZEN`, `CSC_OPERATOR`, and `ADMIN`.
- Ownership validation for citizen profile, document, activity, and journey data.
- CSC assistance sessions require citizen authorization.
- Admin routes are separated from citizen workflows.
- Audit logging for authentication, consent, document, profile, and authorization events.
- Strict CORS, security headers, request validation, and safe error handling.

## 🏗️ Architecture

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

## 🛠️ Tech Stack

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

## 🔄 End-To-End Flow

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

## 📁 Project Structure

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
│   ├── .cache/            # generated RAG cache (chunks, TF-IDF vectors, FAISS index) - gitignored
│   ├── chunks/            # legacy static chunks (superseded by runtime chunking)
│   ├── personas/          # local walkthrough personas
│   ├── rules/             # deterministic eligibility rules
│   └── schemes/           # structured scheme records (schemes.json, 58 records)
├── docs/
│   └── supabase_rls.sql   # Supabase table and RLS reference
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

## 🏛️ Government Scheme Catalogue

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

The catalogue ships with **58 structured scheme records** covering national schemes (PM-Kisan, Ayushman Bharat PM-JAY, PMAY-G, National Scholarship Portal, PM Ujjwala Yojana, e-Shram, Sukanya Samriddhi, PM Vishwakarma, PM-SYM, UDID, and more) alongside state-specific schemes (e.g. Krishi Bhagya Karnataka).

Data locations:

```text
data/schemes/schemes.json           # master scheme dataset (58 records, 16 fields each)
data/rules/*.json                   # deterministic eligibility rules (available schemes)
data/.cache/*                       # generated RAG cache (chunks, TF-IDF vectors, FAISS index)
```

> **RAG retrieval chunks** are generated automatically at startup from `schemes.json` (4 semantic chunks per scheme via `backend/app/services/scheme_chunker.py`) and cached under `data/.cache/`. The cache is rebuilt automatically on first run or whenever the dataset hash changes, so it is **gitignored and not committed**.

## ✅ Eligibility Engine

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

## 💬 Ask Sahaya RAG & Sarvam Voice Flow

```text
Citizen Voice / Text Question
      ↓
[Sarvam AI STT] → Transcript
      ↓
Input Sanitization & Injection Defense Pre-Check
      ↓
Query Normalization & FAISS Semantic Retrieval
      ↓
Top Verified Evidence Chunks
      ↓
Gemini 2.5 Grounded Answer Generation (with XML Delimiters)
      ↓
Output Validation vs Deterministic Rule Engine
      ↓
Tour Action Allowlist Mapping & Validation
      ↓
[Sarvam AI TTS] → Multilingual Audio Stream + Evidence UI
```

The AI layer explains retrieved information. It does not invent scheme rules and does not decide eligibility.

## 🛡️ Security Hardening & Injection Defense

- **System/User Role Separation**: System instructions are placed in top-level `systemInstruction` payloads, never concatenated with untrusted user input.
- **XML Context Delimiters**: Content is strictly fenced inside `<untrusted_citizen_query>`, `<retrieved_scheme_evidence>`, and `<deterministic_rule_result>`.
- **Output-vs-Rule Consistency Validation**: The platform cross-checks LLM output against the deterministic rule engine. If an LLM hallucinates an "eligible" claim for an ineligible citizen, the output is discarded and replaced with a structured template.
- **Sliding-Window Rate Limiting**: Enforced via FastAPI middleware with dual tiers:
  - `RATE_LIMIT_PER_MINUTE_AI=10` (expensive LLM, STT, and TTS endpoints)
  - `RATE_LIMIT_PER_MINUTE_DEFAULT=60` (standard data endpoints)
  - Returns `429 Too Many Requests` with `Retry-After` header and logs events via `AuditLog`.
- **Adversarial Test Suite**: Validated by table-driven test cases in `backend/tests/test_prompt_injection.py`.

## 🧭 Spotlight Guided Onboarding Tours

Tech Sahaya includes an interactive SVG cutout spotlight tour engine that guides citizens step-by-step through:
- Secure income proof upload and document masking (`upload_income_proof`)
- Citizen profile completion (`complete_profile`)
- Missed welfare gap discovery (`explore_welfare_gaps`)
- Deterministic eligibility evaluation (`verify_eligibility`)
- Household family entitlement optimization (`family_optimizer`)

Tours are defined declaratively in `data/config/tours.json` and `frontend/src/data/tours.ts` and can be launched directly by Ask Sahaya via backend-allowlisted tour actions.


## 📄 Document Security Flow

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

## 🛡️ Role-Based Access Control

| Role | Access |
| --- | --- |
| `CITIZEN` | Own dashboard, profile, documents, eligibility, welfare gaps, family analysis, journey, privacy controls |
| `CSC_OPERATOR` | CSC dashboard and authorized citizen assistance sessions |
| `ADMIN` | Scheme/rule/source/user management, audit logs, policy conflict monitoring, system overview |

RBAC is enforced in FastAPI dependencies before protected business logic runs.

## 🔒 Privacy Controls

Tech Sahaya includes:

- Consent-first profile setup
- Stored-data summary
- Purpose-limited data collection
- Account activity log
- Consent withdrawal
- Delete-my-data workflow
- Sensitive document handling policy
- Environment-based secret management

## 🚀 Quick Start

### System Dependencies

- **ffmpeg** — required for voice transcription and audio transcoding (`WebM/Opus` → `16kHz mono WAV`). Install:
  - **Windows**: `winget install Gyan.FFmpeg` (or download from [gyan.dev/ffmpeg](https://www.gyan.dev/ffmpeg/builds/))
  - **macOS**: `brew install ffmpeg`
  - **Linux (Ubuntu/Debian)**: `sudo apt-get install -y ffmpeg`

> **Verification**: After installing `ffmpeg`, close and reopen your terminal, then verify with `ffmpeg -version` and `ffprobe -version` — both must print output before running the backend.

### Environment Pre-Flight Check

You can verify your environment and API keys at any time by running:

```bash
python scripts/check_env.py
```

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

## 🐳 Docker

Run the full system (includes `ffmpeg` pre-installed in container):

```bash
docker compose up --build
```

Services:

| Service | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend | `http://127.0.0.1:8000` |
| Swagger | `http://127.0.0.1:8000/docs` |

## ⚙️ Environment Variables

> ⚠️ **Key Requirements**:
> - **`SARVAM_API_KEY`**: **Required** for voice speech-to-text (STT) and text-to-speech (TTS) features. Obtain an API key from the [Sarvam AI Dashboard](https://dashboard.sarvam.ai/). If unconfigured, voice requests will return a `503 Service Unavailable` error.
> - **`GEMINI_API_KEY`** / **`GOOGLE_API_KEY`**: **Required** for AI grounded scheme answering. Obtain from [Google AI Studio](https://aistudio.google.com/).
> - **Process Restart**: After editing `backend/.env`, restart the backend process fully — cached settings (`@lru_cache`) are not hot-reloaded.

```env
# AI & Reasoning
GEMINI_API_KEY=
GOOGLE_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
GEMINI_FALLBACK_MODEL=gemini-1.5-flash

# Multilingual Voice (Sarvam AI STT & TTS)
SARVAM_API_KEY=
SARVAM_API_BASE_URL=https://api.sarvam.ai
SARVAM_STT_MODEL=saarika:v2.5
SARVAM_TTS_MODEL=bulbul:v3
SARVAM_TTS_VOICE=ishita
VOICE_PROVIDER=sarvam

# Legacy external references
BHASHINI_API_KEY= # Optional, superseded by Sarvam AI voice

# Database & Auth
AUTH_ADAPTER=local
DATABASE_URL=sqlite:///./tech_sahaya_secure.db
FAISS_INDEX_PATH=./data/faiss_index
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Security & Rate Limiting
MAX_UPLOAD_SIZE=5242880
RATE_LIMIT_PER_MINUTE_DEFAULT=60
RATE_LIMIT_PER_MINUTE_AI=10
PROMPT_INJECTION_GUARD_ENABLED=true
MAX_CHAT_INPUT_LENGTH=1000

# Network
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Keep real secrets in `backend/.env`. The `.env` file is ignored by Git.


## 🔑 Local Login Accounts

| Role | Email | Password |
| --- | --- | --- |
| Citizen | `citizen@techsahaya.org` | `Citizen@123` |
| CSC Operator | `csc@techsahaya.org` | `Csc@12345` |
| Admin | `admin@techsahaya.org` | `Admin@12345` |

## 🧭 Frontend Routes

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

## 🔌 Backend API

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

## 🧪 Testing

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

## 🗄️ Supabase Auth And RLS

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

## 🏆 Why Tech Sahaya Stands Out

- Workflow-first citizen experience instead of a generic chatbot.
- Deterministic eligibility engine for transparent welfare decisions.
- Evidence-first AI responses with source provenance.
- Secure document flow designed around data minimization.
- Role-aware platform for citizens, CSC operators, and administrators.
- Multilingual and voice-oriented user interface.
- Modular backend services that can run locally and integrate with managed providers.
- Professional public-service UI designed for trust, accessibility, and clarity.

## 🧰 Useful Commands

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

## 🐛 Troubleshooting

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

> **Important**: After editing `backend/.env`, restart the backend process fully — cached settings (`@lru_cache`) are not hot-reloaded.

### Audio Transcoding & FFmpeg System Dependency

For speech-to-text (STT) audio transcoding (`WebM/Opus` $\to$ `16kHz mono WAV`), `ffmpeg` is required as a system dependency on PATH (outside Python requirements):

- **Windows**: `winget install Gyan.FFmpeg` or `choco install ffmpeg`
- **macOS**: `brew install ffmpeg`
- **Linux (Ubuntu/Debian)**: `sudo apt-get install -y ffmpeg`
- **Docker**: Included automatically in `backend/Dockerfile`.

Restart your terminal / IDE after installing `ffmpeg` so it is discovered in system `PATH`.

## 🧼 Repository Safety

The repository includes the source files required to run the project. Sensitive and generated files are excluded through `.gitignore`:

- `.env`
- SQLite database files
- Python virtual environments
- `node_modules`
- frontend build output
- runtime logs
- generated RAG cache files (`data/.cache/`)

The RAG index and retrieval cache under `data/.cache/` are generated artifacts. They are excluded from Git and rebuilt automatically (hash-based) on first run, so a fresh clone runs without any manual setup.

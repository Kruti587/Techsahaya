@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title Tech Sahaya - Digital Citizen Welfare Platform

cd /d "%~dp0"

echo =====================================================================
echo           Tech Sahaya - Digital Citizen Welfare Platform
echo        SIH 2026 / Team Aphelion - Multilingual Voice ^& AI
echo =====================================================================
echo.

REM Add WinGet / Gyan.FFmpeg to PATH if present
for /d %%D in ("%LOCALAPPDATA%\Microsoft\WinGet\Packages\Gyan.FFmpeg*") do (
    for /d %%B in ("%%D\*\bin") do (
        if exist "%%B\ffmpeg.exe" (
            set "PATH=%%B;!PATH!"
        )
    )
)
if exist "%LOCALAPPDATA%\Microsoft\WinGet\Links\ffmpeg.exe" (
    set "PATH=%LOCALAPPDATA%\Microsoft\WinGet\Links;!PATH!"
)

REM 1. Check Python installation
echo [*] Checking Python installation...
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    where py >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Python is not found in PATH. Please install Python 3.10+ and add it to PATH.
        pause
        exit /b 1
    ) else (
        set "PY_CMD=py"
    )
) else (
    set "PY_CMD=python"
)
!PY_CMD! --version

REM 2. Check Node.js and npm installation
echo [*] Checking Node.js and npm installation...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not found in PATH. Please install Node.js v18 or newer and add it to PATH.
    pause
    exit /b 1
)
node --version
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not found in PATH.
    pause
    exit /b 1
)
call npm --version
echo.

REM 3. Setup Backend Environment
echo =====================================================================
echo [*] Setting up Backend Environment...
echo =====================================================================

if not exist "backend\.env" (
    if exist ".env.example" (
        echo [*] Creating backend\.env from .env.example...
        copy ".env.example" "backend\.env" >nul
    ) else (
        echo [!] Warning: .env.example not found in root.
    )
)

REM Check if virtualenv is missing or needs setup
if not exist "backend\.venv\Scripts\activate.bat" (
    if exist "backend\.venv" (
        echo [*] Cleaning up incomplete virtual environment...
        rmdir /s /q "backend\.venv"
    )
    echo [*] Creating Python virtual environment in backend\.venv...
    !PY_CMD! -m venv "backend\.venv"
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
)

echo [*] Checking and installing backend dependencies...
"backend\.venv\Scripts\python.exe" -m pip install --upgrade pip >nul 2>&1
"backend\.venv\Scripts\python.exe" -m pip install -r "backend\requirements.txt"
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install backend requirements.
    pause
    exit /b 1
)
echo [OK] Backend environment is ready.
echo.

REM 4. Setup Frontend Environment
echo =====================================================================
echo [*] Setting up Frontend Environment...
echo =====================================================================

if not exist "frontend\node_modules" (
    echo [*] Installing frontend dependencies...
    cd /d "%~dp0frontend"
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install frontend dependencies.
        cd /d "%~dp0"
        pause
        exit /b 1
    )
    cd /d "%~dp0"
)
echo [OK] Frontend environment is ready.
echo.

REM 5. Launch Services
echo =====================================================================
echo [*] Launching Tech Sahaya Services...
echo =====================================================================

echo [*] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "Tech Sahaya - Backend (FastAPI)" cmd /k "cd /d ""%~dp0backend"" && .venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000"

REM Brief pause to let backend server initialize
timeout /t 3 /nobreak >nul

echo [*] Starting Vite Frontend on http://localhost:5173 ...
start "Tech Sahaya - Frontend (Vite)" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo =====================================================================
echo                    Tech Sahaya is Running!
echo =====================================================================
echo  Frontend Application:  http://localhost:5173
echo  Backend REST API:      http://127.0.0.1:8000
echo  Swagger API Docs:      http://127.0.0.1:8000/docs
echo.
echo ---------------------------------------------------------------------
echo  Features Enabled:
echo    - Proactive Scheme Recommendations ^& Family Analysis
echo    - 10-Step AI Architecture with Strict Security Gateway
echo    - Secure In-Memory OCR ^& PII Scanning Flow
echo    - Multilingual Voice STT ^& TTS (Sarvam AI)
echo    - Deterministic Eligibility Rule Engine
echo    - Spotlight Guided Onboarding Tours
echo ---------------------------------------------------------------------
echo  Default Demo Accounts:
echo    - Citizen:      citizen@techsahaya.org   / Citizen@123
echo    - CSC Operator: csc@techsahaya.org       / Csc@12345
echo    - Admin:        admin@techsahaya.org     / Admin@12345
echo ---------------------------------------------------------------------
echo.
echo Press any key to open the application in your default browser...
pause >nul
start http://localhost:5173

#!/usr/bin/env python3
"""
Tech Sahaya - Environment & System Pre-Flight Check Script
Validates all required external dependencies (FFmpeg, API keys, database) before starting services.
"""

import glob
import os
import shutil
import sys
from pathlib import Path


def load_env_file(filepath: Path) -> dict[str, str]:
    """Parse key=value pairs from a .env file into a dictionary."""
    env_vars: dict[str, str] = {}
    if not filepath.exists():
        return env_vars
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                env_vars[k.strip().upper()] = v.strip().strip("'\"")
    except Exception as exc:
        print(f"  [!] Error reading {filepath}: {exc}")
    return env_vars


def discover_ffmpeg() -> tuple[str | None, str | None]:
    """Check system PATH and common Windows installation paths for ffmpeg and ffprobe."""
    ffmpeg_path = shutil.which("ffmpeg")
    ffprobe_path = shutil.which("ffprobe")

    if ffmpeg_path and ffprobe_path:
        return ffmpeg_path, ffprobe_path

    # Check common Windows paths (WinGet, Chocolatey, Scoop, LocalAppData, ProgramFiles)
    potential_patterns = [
        os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\WinGet\Packages\*FFmpeg*\*\bin"),
        os.path.expandvars(r"%LOCALAPPDATA%\Microsoft\WinGet\Links"),
        os.path.expandvars(r"%ProgramFiles%\ffmpeg\bin"),
        os.path.expandvars(r"%ProgramFiles(x86)%\ffmpeg\bin"),
        r"C:\ffmpeg\bin",
        r"C:\ProgramData\chocolatey\bin",
    ]
    for pattern in potential_patterns:
        for match in glob.glob(pattern):
            ff = os.path.join(match, "ffmpeg.exe") if os.name == "nt" else os.path.join(match, "ffmpeg")
            fp = os.path.join(match, "ffprobe.exe") if os.name == "nt" else os.path.join(match, "ffprobe")
            if not ffmpeg_path and os.path.exists(ff):
                ffmpeg_path = ff
            if not ffprobe_path and os.path.exists(fp):
                ffprobe_path = fp
            if ffmpeg_path and ffprobe_path:
                return ffmpeg_path, ffprobe_path

    return ffmpeg_path, ffprobe_path


def main() -> int:
    root_dir = Path(__file__).resolve().parent.parent
    backend_env_path = root_dir / "backend" / ".env"
    root_env_path = root_dir / ".env"

    # Merge OS env with backend/.env and root/.env
    env = dict(os.environ)
    env.update(load_env_file(root_env_path))
    env.update(load_env_file(backend_env_path))

    print("=" * 70)
    print("      Tech Sahaya Platform - Environment Pre-Flight Check")
    print("=" * 70)
    print()

    all_passed = True

    # 1. Check System Dependencies (FFmpeg & FFprobe)
    print("[1] Checking System Audio Dependencies (FFmpeg)...")
    ffmpeg_p, ffprobe_p = discover_ffmpeg()

    if ffmpeg_p:
        print(f"  [PASS] ffmpeg binary found  : {ffmpeg_p}")
    else:
        print("  [FAIL] ffmpeg binary is NOT found on system PATH.")
        print("         -> Windows : winget install Gyan.FFmpeg")
        print("         -> macOS   : brew install ffmpeg")
        print("         -> Linux   : sudo apt-get install -y ffmpeg")
        all_passed = False

    if ffprobe_p:
        print(f"  [PASS] ffprobe binary found : {ffprobe_p}")
    else:
        print("  [FAIL] ffprobe binary is NOT found.")
        all_passed = False

    print()

    # 2. Check Voice STT/TTS Layer (Sarvam AI)
    print("[2] Checking Multilingual Voice Layer (Sarvam AI)...")
    sarvam_key = env.get("SARVAM_API_KEY", "").strip()
    if sarvam_key:
        masked = sarvam_key[:8] + "..." + sarvam_key[-4:] if len(sarvam_key) > 12 else "***"
        print(f"  [PASS] SARVAM_API_KEY is configured ({masked})")
    else:
        print("  [FAIL] SARVAM_API_KEY is missing or empty.")
        print("         -> Required for voice input & audio response.")
        print("         -> Obtain from: https://dashboard.sarvam.ai")
        print("         -> Add to backend/.env: SARVAM_API_KEY=<your_key>")
        all_passed = False

    print()

    # 3. Check AI Reasoning Layer (Gemini)
    print("[3] Checking AI Reasoning Layer (Gemini)...")
    gemini_key = env.get("GEMINI_API_KEY", "").strip() or env.get("GOOGLE_API_KEY", "").strip()
    if gemini_key:
        masked = gemini_key[:8] + "..." + gemini_key[-4:] if len(gemini_key) > 12 else "***"
        print(f"  [PASS] GEMINI_API_KEY is configured ({masked})")
    else:
        print("  [FAIL] GEMINI_API_KEY / GOOGLE_API_KEY is missing or empty.")
        print("         -> Required for grounded citizen welfare Q&A.")
        print("         -> Obtain from: https://aistudio.google.com")
        print("         -> Add to backend/.env: GEMINI_API_KEY=<your_key>")
        all_passed = False

    print()

    # 4. Check Database & Authentication
    print("[4] Checking Database & Authentication Adapter...")
    auth_adapter = env.get("AUTH_ADAPTER", "local").strip().lower()
    print(f"  [INFO] AUTH_ADAPTER is set to: '{auth_adapter}'")

    if auth_adapter == "supabase":
        sb_url = env.get("SUPABASE_URL", "").strip()
        sb_key = env.get("SUPABASE_ANON_KEY", "").strip()
        if sb_url and sb_key:
            print(f"  [PASS] Supabase credentials configured (URL: {sb_url})")
        else:
            print("  [FAIL] AUTH_ADAPTER is 'supabase' but SUPABASE_URL or SUPABASE_ANON_KEY is missing.")
            all_passed = False
    else:
        print("  [PASS] Local SQLite database & authentication active.")

    print()
    print("-" * 70)
    if all_passed:
        print(" [OK] All pre-flight checks PASSED! System is ready to run.")
        print("      Launch services via: ./run.bat (Windows) or uvicorn + vite")
        print("-" * 70)
        return 0
    else:
        print(" [!] Some checks FAILED. Please resolve the items above before starting.")
        print("-" * 70)
        return 1


if __name__ == "__main__":
    sys.exit(main())

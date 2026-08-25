import json
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.models.schemas import Scheme


ROOT = Path(__file__).resolve().parents[3]
DATA_DIR = ROOT / "data"


def _load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


@lru_cache
def load_schemes() -> list[Scheme]:
    return [Scheme(**item) for item in _load_json(DATA_DIR / "schemes" / "schemes.json")]


@lru_cache
def load_rules() -> dict[str, Any]:
    rules_dir = DATA_DIR / "rules"
    return {path.stem: _load_json(path) for path in rules_dir.glob("*.json")}


@lru_cache
def load_chunks() -> list[dict[str, Any]]:
    return _load_json(DATA_DIR / "chunks" / "scheme_chunks.json")


@lru_cache
def load_personas() -> dict[str, Any]:
    return _load_json(DATA_DIR / "personas" / "personas.json")

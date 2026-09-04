"""
Scheme dataset validator to ensure data quality and consistency.
Validates schemes.json structure, field types, consistency, and cross-references.
"""

import json
import logging
from pathlib import Path
from typing import Any

logger = logging.getLogger("techsahaya.scheme_validator")


class SchemeValidator:
    """Validates scheme dataset for quality, completeness, and consistency."""

    REQUIRED_FIELDS = {
        "id", "name", "description", "category", "state_scope", "benefits",
        "eligibility", "required_documents", "application_steps", "department",
        "official_link", "source_name", "source_reference", "last_verified",
        "alternative_scheme_ids", "data_note"
    }

    ARRAY_FIELDS = {
        "state_scope", "benefits", "eligibility", "required_documents",
        "application_steps", "alternative_scheme_ids"
    }

    def validate_file(self, file_path: Path) -> dict[str, Any]:
        """
        Validate entire schemes.json file.
        
        Returns:
            dict with keys: valid (bool), errors (list), warnings (list), stats (dict)
        """
        result = {
            "valid": True,
            "errors": [],
            "warnings": [],
            "stats": {
                "total_schemes": 0,
                "valid_schemes": 0,
                "invalid_schemes": 0,
                "duplicate_ids": [],
                "missing_alternatives": [],
            }
        }

        # Load JSON
        try:
            with file_path.open("r", encoding="utf-8") as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            result["valid"] = False
            result["errors"].append(f"Invalid JSON: {e}")
            return result
        except Exception as e:
            result["valid"] = False
            result["errors"].append(f"Failed to read file: {e}")
            return result

        if not isinstance(data, list):
            result["valid"] = False
            result["errors"].append("Root element must be a JSON array")
            return result

        result["stats"]["total_schemes"] = len(data)

        # Validate each scheme
        seen_ids = set()
        all_scheme_ids = {scheme.get("id") for scheme in data if isinstance(scheme, dict)}

        for idx, scheme in enumerate(data):
            scheme_errors = self._validate_scheme(scheme, idx, seen_ids, all_scheme_ids)
            if scheme_errors:
                result["valid"] = False
                result["errors"].extend(scheme_errors)
                result["stats"]["invalid_schemes"] += 1
            else:
                result["stats"]["valid_schemes"] += 1

        # Check for duplicate IDs
        if len(seen_ids) != len(data):
            duplicates = [s.get("id") for s in data if s.get("id") in seen_ids]
            result["stats"]["duplicate_ids"] = list(set(duplicates))
            result["errors"].append(f"Duplicate scheme IDs found: {result['stats']['duplicate_ids']}")
            result["valid"] = False

        # Check for missing alternative references
        missing_alternatives = []
        for scheme in data:
            if not isinstance(scheme, dict):
                continue
            for alt_id in scheme.get("alternative_scheme_ids", []):
                if alt_id not in all_scheme_ids:
                    missing_alternatives.append({
                        "scheme_id": scheme.get("id"),
                        "missing_alternative": alt_id
                    })
        
        if missing_alternatives:
            result["stats"]["missing_alternatives"] = missing_alternatives
            result["warnings"].append(f"Found {len(missing_alternatives)} missing alternative references")

        # Log results
        if result["valid"]:
            logger.info(
                "✓ Scheme validation PASSED: %d total, %d valid",
                result["stats"]["total_schemes"],
                result["stats"]["valid_schemes"]
            )
        else:
            logger.error(
                "✗ Scheme validation FAILED: %d errors, %d warnings",
                len(result["errors"]),
                len(result["warnings"])
            )

        return result

    def _validate_scheme(
        self,
        scheme: Any,
        idx: int,
        seen_ids: set,
        all_scheme_ids: set
    ) -> list[str]:
        """Validate a single scheme object."""
        errors = []

        if not isinstance(scheme, dict):
            errors.append(f"Scheme at index {idx} is not a dictionary")
            return errors

        # Check required fields
        missing_fields = self.REQUIRED_FIELDS - set(scheme.keys())
        if missing_fields:
            errors.append(
                f"Scheme '{scheme.get('id', f'at index {idx}')}' missing fields: {missing_fields}"
            )

        # Check field types
        scheme_id = scheme.get("id")
        if not isinstance(scheme_id, str):
            errors.append(f"Scheme at index {idx}: 'id' must be a string")
        elif scheme_id in seen_ids:
            errors.append(f"Duplicate scheme ID: '{scheme_id}'")
        else:
            seen_ids.add(scheme_id)

        if not isinstance(scheme.get("name"), str) or not scheme.get("name"):
            errors.append(f"Scheme '{scheme_id}': 'name' must be non-empty string")

        if not isinstance(scheme.get("description"), str):
            errors.append(f"Scheme '{scheme_id}': 'description' must be a string")

        if not isinstance(scheme.get("category"), str) or not scheme.get("category"):
            errors.append(f"Scheme '{scheme_id}': 'category' must be non-empty string")

        if not isinstance(scheme.get("department"), str) or not scheme.get("department"):
            errors.append(f"Scheme '{scheme_id}': 'department' must be non-empty string")

        # Check array fields
        for field in self.ARRAY_FIELDS:
            value = scheme.get(field)
            if not isinstance(value, list):
                errors.append(f"Scheme '{scheme_id}': '{field}' must be an array")
            elif field != "alternative_scheme_ids" and not value:
                errors.append(f"Scheme '{scheme_id}': '{field}' cannot be empty")

        # Check state_scope
        states = scheme.get("state_scope", [])
        if isinstance(states, list) and not all(isinstance(s, str) for s in states):
            errors.append(f"Scheme '{scheme_id}': 'state_scope' must contain only strings")

        # Check official_link
        official_link = scheme.get("official_link")
        if official_link:
            if not isinstance(official_link, str) or not official_link.startswith(("http://", "https://")):
                errors.append(f"Scheme '{scheme_id}': 'official_link' must be a valid URL")

        # Check last_verified format (YYYY-MM-DD)
        last_verified = scheme.get("last_verified")
        if last_verified:
            if not isinstance(last_verified, str) or len(last_verified) != 10:
                errors.append(f"Scheme '{scheme_id}': 'last_verified' should be YYYY-MM-DD format")

        return errors


def validate_schemes_dataset(file_path: Path) -> dict[str, Any]:
    """Convenience function to validate schemes dataset."""
    validator = SchemeValidator()
    return validator.validate_file(file_path)

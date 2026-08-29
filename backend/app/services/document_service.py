import io
import re
from datetime import datetime
from typing import Any, Optional

from fastapi import HTTPException, UploadFile, status
from PIL import Image, ImageEnhance, ImageFilter
try:
    import pytesseract
except ImportError:
    pytesseract = None
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.redis_client import ephemeral_store
from app.models.db_models import DocumentRecord, User
from app.services.data_loader import load_ocr_keywords

settings = get_settings()

_TESS_LANG_MAP = {
    "en": "eng",
    "hi": "hin",
    "kn": "kan",
    "te": "tel",
    "ta": "tam",
    "ml": "mal",
    "bn": "ben",
    "mr": "mar",
    "gu": "guj",
}

_INDIC_DIGITS = {
    # Devanagari (Hindi, Marathi)
    "०": "0", "१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9",
    # Kannada
    "೦": "0", "೧": "1", "೨": "2", "೩": "3", "೪": "4", "೫": "5", "೬": "6", "೭": "7", "೮": "8", "೯": "9",
    # Telugu
    "౦": "0", "౧": "1", "౨": "2", "౩": "3", "౪": "4", "౫": "5", "౬": "6", "౭": "7", "౮": "8", "౯": "9",
    # Tamil
    "௦": "0", "௧": "1", "௨": "2", "௩": "3", "௪": "4", "௫": "5", "௬": "6", "௭": "7", "௮": "8", "௯": "9",
    # Malayalam
    "൦": "0", "൧": "1", "൨": "2", "൩": "3", "൪": "4", "൫": "5", "൬": "6", "൭": "7", "൮": "8", "൯": "9",
    # Bengali
    "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4", "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
    # Gujarati
    "૦": "0", "૧": "1", "૨": "2", "૩": "3", "૪": "4", "૫": "5", "૬": "6", "૭": "7", "૮": "8", "૯": "9",
}


def _normalize_indic_digits(text: str) -> str:
    for indic_char, ascii_digit in _INDIC_DIGITS.items():
        text = text.replace(indic_char, ascii_digit)
    return text


def _preprocess_image_for_ocr(image: Image.Image) -> Image.Image:
    """Local, in-memory image enhancement to boost OCR accuracy across contrast and camera noise."""
    try:
        # Convert to Grayscale
        gray = image.convert("L")
        # Enhance Contrast
        enhancer = ImageEnhance.Contrast(gray)
        enhanced = enhancer.enhance(1.8)
        # Sharpen slightly
        sharpened = enhanced.filter(ImageFilter.SHARPEN)
        return sharpened
    except Exception:
        return image


def _build_keyword_regex(keywords: list[str]) -> str:
    """Sorts keywords by length descending and builds regex pattern."""
    if not keywords:
        return r"(?!x)x"
    sorted_kws = sorted(set(keywords), key=len, reverse=True)
    patterns = []
    for kw in sorted_kws:
        if kw == "आय":
            patterns.append(r"(?<![आ\w])आय(?![ु\w])")
        elif kw == "वय":
            patterns.append(r"(?<![\w])वय(?![\w])")
        else:
            parts = re.split(r"\s+", kw.strip())
            patterns.append(r"\s*".join(re.escape(p) for p in parts))
    return r"(?:" + "|".join(patterns) + r")"


def _get_field_keywords(field: str, language: str = "en") -> list[str]:
    cfg = load_ocr_keywords()
    field_cfg = cfg.get(field, {})
    lang_key = language[:2].lower()
    variants: list[str] = list(field_cfg.get(lang_key, []))
    for k, v in field_cfg.items():
        if k != "_comment" and isinstance(v, list):
            variants.extend(v)
    return variants


class DocumentService:
    allowed_types = {"application/pdf", "image/png", "image/jpeg"}
    extension_types = {
        ".pdf": "application/pdf",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
    }

    canonical_types = {
        "income_certificate",
        "land_record",
        "ration_card",
        "disability_certificate",
        "caste_certificate",
        "generic_sample_document",
    }

    def process_upload(
        self,
        db: Session,
        user: User,
        file: UploadFile,
        content: bytes,
        declared_type: Optional[str] = None,
        language: str = "en",
    ) -> DocumentRecord:
        original_name = (file.filename or "").lower()
        if "aadhaar" in original_name or "aadhar" in original_name or "pan" in original_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please do not upload Aadhaar or PAN images. Use self-declared profile fields or common verification documents (income certificate, land record, ration card, disability certificate, caste certificate, generic sample document).",
            )
        content_type = file.content_type or self._content_type_from_name(file.filename or "")
        if content_type in {"application/octet-stream", "text/plain"}:
            content_type = self._content_type_from_name(file.filename or "")
        if content_type not in self.allowed_types:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type")
        masked_name = re.sub(r"\d", "X", file.filename or "document")

        doc_type = declared_type if (declared_type and declared_type in self.canonical_types) else self._classify(file.filename or "document")

        # In-memory ephemeral OCR (never saved to disk, zero external APIs)
        extracted_fields = self._extract_ephemeral_fields(content, content_type, doc_type, language=language)

        masked_fields = {
            "document_type": doc_type,
            "mime_type": content_type,
            "name_hint": user.full_name.split(" ")[0] if user.full_name else "Citizen",
            "identifier_masked": "XXXX-XXXX",
        }
        document = DocumentRecord(
            user_id=user.id,
            document_type=doc_type,
            status="processed",
            verification_state="processed_in_memory",
            masked_fields=masked_fields,
            file_name=masked_name,
            mime_type=content_type,
            file_size=len(content),
            retained_in_storage=False,
        )
        db.add(document)
        db.commit()
        db.refresh(document)

        # Store derived structured data in Redis with short ephemeral TTL (e.g. 5 minutes)
        ephemeral_payload = {
            "document_id": document.id,
            "user_id": user.id,
            "document_type": doc_type,
            "extracted_fields": extracted_fields,
            "created_at": datetime.utcnow().isoformat(),
        }
        ephemeral_store.set(f"doc:{document.id}", ephemeral_payload, ttl_seconds=settings.redis_ephemeral_ttl)
        setattr(document, "ephemeral_extracted", extracted_fields)

        return document

    def _extract_ephemeral_fields(self, content: bytes, content_type: str, doc_type: str, language: str = "en") -> dict[str, Any]:
        """Runs in-memory local OCR / text extraction without writing bytes to disk or calling third-party vision APIs."""
        text = ""
        if content_type in {"image/png", "image/jpeg"}:
            try:
                raw_image = Image.open(io.BytesIO(content))
                image = _preprocess_image_for_ocr(raw_image)
                if pytesseract:
                    tess_lang = _TESS_LANG_MAP.get(language[:2].lower(), "eng")
                    # Try citizen's declared language first, then fall back to combined eng+<lang>, then eng
                    lang_attempts = [f"eng+{tess_lang}", tess_lang, "eng"] if tess_lang != "eng" else ["eng"]
                    for lang_attempt in lang_attempts:
                        try:
                            extracted = pytesseract.image_to_string(image, lang=lang_attempt)
                            if extracted and extracted.strip():
                                text = extracted
                                break
                        except Exception:
                            continue
            except Exception:
                pass

        if not text:
            # In-memory byte stream heuristic / text extraction fallback
            printable = re.findall(rb"[\x20-\x7E]{3,}", content)
            text = " ".join([chunk.decode("latin1", errors="ignore") for chunk in printable])

        # Normalize Indic numerals (e.g., ೧, ೨, ३, ৪ to 1, 2, 3, 4)
        normalized_text = _normalize_indic_digits(text)
        return self._parse_structured_fields(normalized_text, language=language)

    def _parse_structured_fields(self, text: str, language: str = "en") -> dict[str, Any]:
        """Extracts structured values from normalized OCR text using configurable JSON keywords."""
        fields: dict[str, Any] = {}
        if not text:
            return fields

        text_lower = text.lower()
        age_keywords = _get_field_keywords("age", language)
        dob_keywords = _get_field_keywords("dob", language)
        income_keywords = _get_field_keywords("income", language)
        land_keywords = _get_field_keywords("landholding", language)

        age_pattern = _build_keyword_regex(age_keywords) + r"[^\d\n]{0,25}(\d{1,3})\b"
        dob_pattern = _build_keyword_regex(dob_keywords) + r"[^\d\n]{0,25}(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b"
        income_pattern = _build_keyword_regex(income_keywords) + r"[^\d\n]{0,25}(?:(?:rs\.?|inr|₹|రూ|ரூ|ರೂ|रु)\s*)?([\d,]+(?:\.\d+)?)\b"
        land_pattern = _build_keyword_regex(land_keywords) + r"[^\d\n]{0,25}([\d.]+)\s*(?:acres?|acre|एकड़|ఎకరాలు|ஏக்கர்|ഏക്കർ|একর|हेक्टर|guntha)?"

        # 1. Extract age
        age_match = re.search(age_pattern, text_lower, re.IGNORECASE)
        if age_match:
            try:
                val = int(age_match.group(1))
                if 0 <= val <= 125:
                    fields["age"] = val
            except ValueError:
                pass

        # 2. Extract DOB (if age not directly matched or as supplement)
        dob_match = re.search(dob_pattern, text_lower, re.IGNORECASE)
        if dob_match:
            try:
                birth_year = int(dob_match.group(3))
                current_year = datetime.now().year
                calculated_age = current_year - birth_year
                if 0 <= calculated_age <= 125 and "age" not in fields:
                    fields["age"] = calculated_age
                fields["dob"] = f"{dob_match.group(1)}/{dob_match.group(2)}/{dob_match.group(3)}"
            except ValueError:
                pass

        # 3. Extract income
        income_match = re.search(income_pattern, text_lower, re.IGNORECASE)
        if income_match:
            try:
                raw_income_str = income_match.group(1).replace(",", "")
                income_val = float(raw_income_str)
                if income_val >= 0:
                    fields["income"] = income_val
            except ValueError:
                pass

        # 4. Extract landholding
        land_match = re.search(land_pattern, text_lower, re.IGNORECASE)
        if land_match:
            try:
                land_val = float(land_match.group(1))
                if 0 <= land_val <= 10000:
                    fields["landholding"] = land_val
            except ValueError:
                pass

        return fields

    def _classify(self, file_name: str) -> str:
        name = file_name.lower()
        if "income" in name or "aay" in name or "aadhaya" in name:
            return "income_certificate"
        if "land" in name or "rtc" in name or "patta" in name or "chitta" in name or "pahani" in name or "7/12" in name:
            return "land_record"
        if "ration" in name or "rashan" in name:
            return "ration_card"
        if "disability" in name or "disabled" in name or "pwd" in name or "divyang" in name or "udid" in name:
            return "disability_certificate"
        if "caste" in name or "jati" in name or "jaati" in name or "samudhayam" in name:
            return "caste_certificate"
        return "generic_sample_document"

    def _content_type_from_name(self, file_name: str) -> str:
        for extension, content_type in self.extension_types.items():
            if file_name.lower().endswith(extension):
                return content_type
        return ""


document_service = DocumentService()

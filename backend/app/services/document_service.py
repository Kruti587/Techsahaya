import io
import re
from datetime import datetime
from typing import Any, Optional

from fastapi import HTTPException, UploadFile, status
from PIL import Image
try:
    import pytesseract
except ImportError:
    pytesseract = None
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.redis_client import ephemeral_store
from app.models.db_models import DocumentRecord, User

settings = get_settings()


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

        # In-memory ephemeral OCR (never saved to disk)
        extracted_fields = self._extract_ephemeral_fields(content, content_type, doc_type)

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

    def _extract_ephemeral_fields(self, content: bytes, content_type: str, doc_type: str) -> dict[str, Any]:
        """Runs in-memory OCR / text extraction without writing bytes to disk."""
        text = ""
        if content_type in {"image/png", "image/jpeg"}:
            try:
                image = Image.open(io.BytesIO(content))
                if pytesseract:
                    try:
                        text = pytesseract.image_to_string(image)
                    except Exception:
                        pass
            except Exception:
                pass

        if not text:
            # In-memory byte stream heuristic / text extraction
            printable = re.findall(rb"[\x20-\x7E]{3,}", content)
            text = " ".join([chunk.decode("latin1", errors="ignore") for chunk in printable])

        fields: dict[str, Any] = {}
        text_lower = text.lower()

        # Extract age or DOB
        age_match = re.search(r"\b(?:age|age in years)[:\s]*(\d{1,3})\b", text_lower)
        if age_match:
            try:
                fields["age"] = int(age_match.group(1))
            except ValueError:
                pass
        else:
            dob_match = re.search(r"\b(?:dob|date of birth|birth date)[:\s]*(\d{1,2})[/-](\d{1,2})[/-](\d{4})\b", text_lower)
            if dob_match:
                try:
                    birth_year = int(dob_match.group(3))
                    fields["age"] = max(0, datetime.now().year - birth_year)
                    fields["dob"] = f"{dob_match.group(1)}/{dob_match.group(2)}/{dob_match.group(3)}"
                except ValueError:
                    pass

        # Extract income hint
        income_match = re.search(r"\b(?:income|annual income|total income|salary)[:\s]*(?:rs\.?|inr)?\s*([\d,]+)\b", text_lower)
        if income_match:
            try:
                fields["income"] = float(income_match.group(1).replace(",", ""))
            except ValueError:
                pass

        # Extract landholding hint
        land_match = re.search(r"\b(?:land|acres|extent)[:\s]*([\d.]+)\b", text_lower)
        if land_match:
            try:
                fields["landholding"] = float(land_match.group(1))
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

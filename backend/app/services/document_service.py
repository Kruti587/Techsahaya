import re
from typing import Optional

from fastapi import HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.models.db_models import DocumentRecord, User


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
        return document

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

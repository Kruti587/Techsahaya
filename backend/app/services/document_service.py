import re

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

    def process_upload(self, db: Session, user: User, file: UploadFile, content: bytes) -> DocumentRecord:
        original_name = (file.filename or "").lower()
        if "aadhaar" in original_name or "aadhar" in original_name or "pan" in original_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please do not upload Aadhaar or PAN images. Use self-declared profile fields or masked/official verification documents only.",
            )
        content_type = file.content_type or self._content_type_from_name(file.filename or "")
        if content_type in {"application/octet-stream", "text/plain"}:
            content_type = self._content_type_from_name(file.filename or "")
        if content_type not in self.allowed_types:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type")
        masked_name = re.sub(r"\d", "X", file.filename or "document")
        masked_fields = {"document_type": content_type, "name_hint": user.full_name.split(" ")[0], "identifier_masked": "XXXX-XXXX"}
        document = DocumentRecord(
            user_id=user.id,
            document_type=self._classify(masked_name),
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
        if "income" in name:
            return "income_certificate"
        if "ration" in name:
            return "ration_card"
        if "land" in name:
            return "land_record"
        if "student" in name or "school" in name or "college" in name:
            return "student_id"
        if "birth" in name:
            return "birth_certificate"
        if "bank" in name or "passbook" in name:
            return "bank_account_proof"
        if "residence" in name or "address" in name:
            return "residence_proof"
        if "disability" in name or "disabled" in name or "pwd" in name:
            return "disability_certificate"
        return "identity_or_supporting_document"

    def _content_type_from_name(self, file_name: str) -> str:
        for extension, content_type in self.extension_types.items():
            if file_name.lower().endswith(extension):
                return content_type
        return ""


document_service = DocumentService()

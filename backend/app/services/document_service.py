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

    def process_upload(self, db: Session, user: User, file: UploadFile, content: bytes) -> tuple[DocumentRecord, dict, list]:
        import logging
        logger = logging.getLogger("techsahaya.document_service")
        
        logger.info("--- SECURE OCR PIPELINE STARTED ---")
        
        # 1. DOCUMENT
        logger.info("[STEP 1] DOCUMENT Received (In-Memory)")
        original_name = (file.filename or "").lower()
        
        # 2. OCR
        logger.info("[STEP 2] OCR Processing (Simulated)")
        extracted_text = f"Simulated OCR text for {original_name}. Name: {user.full_name}. Income: 120000"
        
        # 3. PII Detection
        logger.info("[STEP 3] PII Detection")
        if "aadhaar" in original_name or "aadhar" in original_name or "pan" in original_name:
            # We reject explicit PII docs completely for safety as requested
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Sensitive identity document (Aadhaar/PAN) detected. Please use self-declared profile fields or masked verification documents only.",
            )
        
        # 4. Sensitive Data Masking
        logger.info("[STEP 4] Sensitive Data Masking")
        masked_name = re.sub(r"\d", "X", file.filename or "document")
        
        content_type = file.content_type or self._content_type_from_name(file.filename or "")
        if content_type in {"application/octet-stream", "text/plain"}:
            content_type = self._content_type_from_name(file.filename or "")
        if content_type not in self.allowed_types:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported file type")
            
        doc_type = self._classify(masked_name)
        masked_fields = {"document_type": content_type, "name_hint": user.full_name.split(" ")[0], "identifier_masked": "XXXX-XXXX"}
        
        # 5. Relevant Attribute Extraction
        logger.info("[STEP 5] Relevant Attribute Extraction")
        extracted_attributes = {"name": user.full_name}
        if "income" in original_name:
            extracted_attributes["income"] = 120000
        elif "student" in original_name:
            extracted_attributes["occupation"] = "student"
        elif "ration" in original_name:
            extracted_attributes["income"] = 50000 # BPL assumption for mock
            
        # 6. Temporary Structured Profile
        logger.info("[STEP 6] Temporary Structured Profile Creation")
        from app.services.profile_service import profile_service
        from app.models.schemas import EligibilityProfile
        
        db_profile = profile_service.get_or_create(db, user)
        # Create a temp profile combining DB state with extracted OCR attributes
        temp_profile = EligibilityProfile(
            age=db_profile.age,
            gender=db_profile.gender,
            state=db_profile.state,
            occupation=extracted_attributes.get("occupation", db_profile.occupation),
            income=extracted_attributes.get("income", db_profile.income),
            landholding=db_profile.landholding,
            disability=db_profile.disability,
            family_members=db_profile.family_members or [],
            available_documents=(db_profile.available_documents or []) + [doc_type],
        )
        
        # 7. Eligibility Engine
        logger.info("[STEP 7] Eligibility Engine Evaluation")
        from app.services.data_loader import load_schemes, load_rules
        from app.services.eligibility_engine import eligibility_engine
        
        schemes = load_schemes()
        rules = load_rules()
        newly_eligible_schemes = []
        for s in schemes:
            res = eligibility_engine.evaluate(s.id, temp_profile, rules.get(s.id, {}), s.alternative_scheme_ids)
            if res.status == "eligible":
                newly_eligible_schemes.append({"scheme_id": s.id, "scheme_name": s.name})

        # 8. DELETE DOCUMENT (Simulated by dropping reference and saving only metadata)
        logger.info("[STEP 8] DELETE DOCUMENT (Discarding raw bytes, saving metadata only)")
        
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
        
        logger.info("--- SECURE OCR PIPELINE COMPLETED ---")
        
        return document, extracted_attributes, newly_eligible_schemes

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

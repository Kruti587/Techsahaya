from app.models.schemas import EligibilityProfile
from app.services.data_loader import load_schemes
from app.services.recommendation_service import recommendation_service


class JourneyService:
    def build_journey(self, profile: EligibilityProfile) -> list[dict]:
        recommendations = recommendation_service.recommendations(profile)[:4]
        scheme_map = {scheme.id: scheme for scheme in load_schemes()}
        grouped_schemes = []

        citizen_docs = [d.lower().strip() for d in (profile.available_documents or [])]

        for rec in recommendations:
            scheme = scheme_map.get(rec.scheme_id)
            if not scheme:
                continue

            # Build document checklist with verification status
            doc_items = []
            for doc in scheme.required_documents:
                doc_norm = doc.lower().strip()
                is_ready = any(c_doc in doc_norm or doc_norm in c_doc for c_doc in citizen_docs)
                doc_items.append({
                    "document_name": doc,
                    "verified": is_ready,
                    "status": "verified" if is_ready else "pending_upload",
                })

            stages = [
                {
                    "stage": "Discovery & Recommendation",
                    "status": "completed",
                    "action": "Scheme matched to your demographic criteria",
                    "completed": True,
                },
                {
                    "stage": "Eligibility Criteria Verification",
                    "status": "completed",
                    "action": f"Verified match score: {int(rec.score * 100)}%",
                    "completed": True,
                },
                {
                    "stage": "Document Preparation",
                    "status": "completed" if all(d["verified"] for d in doc_items) else "in_progress",
                    "action": f"{sum(1 for d in doc_items if d['verified'])} of {len(doc_items)} documents verified",
                    "completed": all(d["verified"] for d in doc_items) if doc_items else True,
                },
                {
                    "stage": "Official Portal Application",
                    "status": "pending",
                    "action": f"Apply via official portal ({scheme.portal_url or 'State Portal'})",
                    "completed": False,
                },
                {
                    "stage": "Government Processing & Verification",
                    "status": "pending",
                    "action": "District nodal officer / department audit",
                    "completed": False,
                },
                {
                    "stage": "Direct Benefit Disbursal",
                    "status": "pending",
                    "action": "Direct Benefit Transfer (DBT) to bank account",
                    "completed": False,
                },
            ]

            grouped_schemes.append({
                "scheme_id": scheme.id,
                "scheme_name": scheme.name,
                "category": scheme.category,
                "state": scheme.state,
                "portal_url": scheme.portal_url,
                "score": rec.score,
                "documents": doc_items,
                "stages": stages,
                "step": "Eligibility",
                "status": "completed",
                "action": f"Review {scheme.name}",
                "required_document": scheme.required_documents[0] if scheme.required_documents else None,
                "deadline": "Check official portal",
            })

        return grouped_schemes


journey_service = JourneyService()

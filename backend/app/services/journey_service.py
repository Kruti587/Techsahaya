from app.models.schemas import EligibilityProfile
from app.services.data_loader import load_schemes
from app.services.recommendation_service import recommendation_service


class JourneyService:
    def build_journey(self, profile: EligibilityProfile) -> list[dict]:
        recommendations = recommendation_service.recommendations(profile)[:3]
        scheme_map = {scheme.id: scheme for scheme in load_schemes()}
        steps = []
        for rec in recommendations:
            scheme = scheme_map[rec.scheme_id]
            for label in ["Discover", "Eligibility", "Documents", "Apply", "Verification", "Approval", "Benefit", "Renewal"]:
                status = "completed" if label == "Discover" else "pending"
                action = "Review the scheme details" if label == "Eligibility" else f"{label} for {scheme.name}"
                steps.append(
                    {
                        "scheme_id": scheme.id,
                        "scheme_name": scheme.name,
                        "step": label,
                        "status": status,
                        "action": action,
                        "required_document": scheme.required_documents[0] if scheme.required_documents else None,
                        "deadline": "Check official portal",
                    }
                )
        return steps


journey_service = JourneyService()

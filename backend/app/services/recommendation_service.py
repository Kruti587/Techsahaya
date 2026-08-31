from app.models.schemas import EligibilityProfile, RecommendationItem, WelfareGapItem
from app.services.data_loader import load_rules, load_schemes
from app.services.eligibility_engine import eligibility_engine


class RecommendationService:
    def eligible_schemes(self, profile: EligibilityProfile):
        rules = load_rules()
        return [
            scheme
            for scheme in load_schemes()
            if eligibility_engine.evaluate(
                scheme.id, profile, rules.get(scheme.id, {}), scheme.alternative_scheme_ids
            ).status == "eligible"
        ]

    def recommendations(self, profile: EligibilityProfile) -> list[RecommendationItem]:
        rules = load_rules()
        items: list[RecommendationItem] = []
        for scheme in load_schemes():
            result = eligibility_engine.evaluate(scheme.id, profile, rules.get(scheme.id, {}), scheme.alternative_scheme_ids)
            if result.status in {"eligible", "needs_more_information"}:
                items.append(
                    RecommendationItem(
                        scheme_id=scheme.id,
                        scheme_name=scheme.name,
                        relevance_score=max(result.score, 50 if result.status == "needs_more_information" else result.score),
                        reason=result.explanation,
                    )
                )
        return sorted(items, key=lambda item: item.relevance_score, reverse=True)

    def welfare_gaps(self, profile: EligibilityProfile, claimed_scheme_ids: list[str] | None = None) -> list[WelfareGapItem]:
        claimed = set(claimed_scheme_ids or [])
        results: list[WelfareGapItem] = []
        for rec in self.recommendations(profile):
            if rec.scheme_id in claimed:
                continue
            reason_category = "missing_profile_information" if "More information" in rec.reason else "lack_of_awareness"
            results.append(
                WelfareGapItem(
                    scheme=rec.scheme_name,
                    estimated_relevance=rec.relevance_score,
                    why_it_may_apply=rec.reason,
                    why_missed="The user has not started this scheme journey yet.",
                    missing_document_or_information="Check profile details and required documents.",
                    recommended_next_action="Review eligibility and collect missing documents.",
                    reason_category=reason_category,
                )
            )
        return results


recommendation_service = RecommendationService()

"""
Profile-aware scheme retrieval and ranking service.
Enhances the base search service with user profile-based filtering and reranking.
"""

import logging
from typing import Any

from app.models.schemas import EligibilityProfile, Scheme

logger = logging.getLogger("techsahaya.profile_aware_search")


class ProfileAwareRanker:
    """Reranks retrieved schemes based on user profile match."""

    # Profile-to-category mappings
    OCCUPATION_TO_CATEGORIES = {
        "farmer": ["Agriculture", "Livelihood"],
        "student": ["Education", "Women and Child"],
        "worker": ["Labour", "Livelihood"],
        "teacher": ["Education"],
        "artisan": ["Livelihood"],
        "craftsman": ["Livelihood"],
        "elderly": ["Disability"],
        "senior": ["Disability"],
    }

    GENDER_SCHEMES = {
        "female": ["Women and Child", "Livelihood"],
        "woman": ["Women and Child", "Livelihood"],
        "girl": ["Women and Child", "Education"],
    }

    def rerank_chunks(
        self,
        chunks: list[dict[str, Any]],
        profile: EligibilityProfile | None,
        query: str,
    ) -> list[dict[str, Any]]:
        """
        Rerank chunks based on profile match.
        
        Scoring factors:
        - State match: +0.30 if scheme state matches user state
        - Category match: +0.25 if scheme category matches user profile
        - Gender match: +0.20 if scheme targets user gender
        - Occupation match: +0.25 if scheme relates to user occupation
        - Income relevance: +0.15 for income-based schemes matching profile
        - Existing score: 0.45 weight on retrieval score
        """
        if not chunks:
            return chunks

        if not profile:
            # No profile, return as-is
            return chunks

        # Score each chunk
        scored_chunks = []
        for chunk in chunks:
            base_score = chunk.get("retrieval_score", 0.0)
            bonus = 0.0

            # State matching
            if profile.state:
                chunk_states = chunk.get("state_scope", [])
                if isinstance(chunk_states, str):
                    chunk_states = [chunk_states]
                
                if profile.state in chunk_states or "All" in chunk_states:
                    bonus += 0.30
                    logger.debug(f"[RERANK] State match (+0.30): {profile.state} in {chunk_states}")

            # Category matching
            category = chunk.get("category", "")
            if category:
                category_bonus = self._get_category_bonus(category, profile)
                bonus += category_bonus
                if category_bonus > 0:
                    logger.debug(f"[RERANK] Category match (+{category_bonus}): {category}")

            # Gender matching
            if profile.gender:
                gender_bonus = self._get_gender_bonus(profile.gender, category)
                bonus += gender_bonus
                if gender_bonus > 0:
                    logger.debug(f"[RERANK] Gender match (+{gender_bonus}): {profile.gender}")

            # Occupation matching
            if profile.occupation:
                occ_bonus = self._get_occupation_bonus(profile.occupation, category)
                bonus += occ_bonus
                if occ_bonus > 0:
                    logger.debug(f"[RERANK] Occupation match (+{occ_bonus}): {profile.occupation}")

            # Income-based schemes
            if profile.income is not None:
                income_bonus = self._get_income_bonus(profile.income, category)
                bonus += income_bonus

            # Combine scores
            final_score = (0.45 * base_score) + bonus
            chunk_copy = dict(chunk)
            chunk_copy["rerank_score"] = round(final_score, 4)
            chunk_copy["rank_bonus"] = round(bonus, 4)
            scored_chunks.append((final_score, chunk_copy))

        # Sort by final score
        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        return [chunk for _, chunk in scored_chunks]

    def _get_category_bonus(self, category: str, profile: EligibilityProfile) -> float:
        """Get bonus for category-profile match."""
        bonus = 0.0

        if profile.occupation:
            occ_lower = profile.occupation.lower()
            for occ_key, categories in self.OCCUPATION_TO_CATEGORIES.items():
                if occ_key in occ_lower and category in categories:
                    bonus += 0.25
                    break

        return min(bonus, 0.25)  # Cap at 0.25

    def _get_gender_bonus(self, gender: str, category: str) -> float:
        """Get bonus for gender-targeted schemes."""
        gender_lower = gender.lower()
        for gender_key, categories in self.GENDER_SCHEMES.items():
            if gender_key in gender_lower and category in categories:
                return 0.20
        return 0.0

    def _get_occupation_bonus(self, occupation: str, category: str) -> float:
        """Get bonus for occupation-relevant schemes."""
        occ_lower = occupation.lower()
        for occ_key, categories in self.OCCUPATION_TO_CATEGORIES.items():
            if occ_key in occ_lower and category in categories:
                return 0.25
        return 0.0

    def _get_income_bonus(self, income: float, category: str) -> float:
        """Get bonus for income-sensitive schemes."""
        # Low-income focused categories
        low_income_categories = ["Education", "Housing", "Health", "Labour", "Women and Child"]
        
        # Medium to high income categories (business-related, etc.)
        mid_income_categories = ["Livelihood", "Agriculture"]
        
        if income < 300000 and category in low_income_categories:  # <3 lakhs
            return 0.15
        elif 300000 <= income < 800000 and category in mid_income_categories:  # 3-8 lakhs
            return 0.10
        
        return 0.0


class ProfileAwareSchemeFilter:
    """Filters schemes based on user profile constraints."""

    def filter_schemes(
        self,
        schemes: list[Scheme],
        profile: EligibilityProfile | None,
    ) -> list[Scheme]:
        """
        Filter schemes to only those potentially relevant to profile.
        Do NOT eliminate schemes, just reorder relevance.
        """
        if not profile or not schemes:
            return schemes

        # Score each scheme
        scored = []
        for scheme in schemes:
            score = self._score_scheme(scheme, profile)
            scored.append((score, scheme))

        # Sort by score (descending)
        scored.sort(key=lambda x: x[0], reverse=True)
        return [scheme for _, scheme in scored]

    def _score_scheme(self, scheme: Scheme, profile: EligibilityProfile) -> float:
        """Score a scheme based on profile match."""
        score = 0.0

        # State matching
        if profile.state and profile.state in scheme.state_scope:
            score += 1.0
        elif "All" in scheme.state_scope:
            score += 0.5

        # Category matching
        if profile.occupation:
            occ_lower = profile.occupation.lower()
            if "farmer" in occ_lower and scheme.category in ["Agriculture", "Livelihood"]:
                score += 0.8
            elif "student" in occ_lower and scheme.category in ["Education", "Women and Child"]:
                score += 0.8
            elif "worker" in occ_lower and scheme.category in ["Labour", "Livelihood"]:
                score += 0.8

        # Gender
        if profile.gender:
            gender_lower = profile.gender.lower()
            if ("female" in gender_lower or "woman" in gender_lower or "girl" in gender_lower):
                if scheme.category in ["Women and Child"]:
                    score += 0.7

        # Income
        if profile.income and profile.income < 500000:  # Low income
            if scheme.category in ["Housing", "Health", "Education"]:
                score += 0.6

        return score


def apply_profile_aware_filtering(
    chunks: list[dict[str, Any]],
    profile: EligibilityProfile | None,
    query: str,
) -> list[dict[str, Any]]:
    """Convenience function to apply profile-aware reranking."""
    ranker = ProfileAwareRanker()
    return ranker.rerank_chunks(chunks, profile, query)


def filter_schemes_by_profile(
    schemes: list[Scheme],
    profile: EligibilityProfile | None,
) -> list[Scheme]:
    """Convenience function to filter schemes by profile."""
    filter_obj = ProfileAwareSchemeFilter()
    return filter_obj.filter_schemes(schemes, profile)

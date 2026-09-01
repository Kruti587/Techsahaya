from __future__ import annotations

import math
import re
from typing import Any
# pyrefly: ignore [missing-import]
import numpy as np

from app.services.data_loader import load_chunks, load_schemes

try:
    import faiss  # type: ignore
except Exception:  # pragma: no cover
    faiss = None


class SearchService:
    def __init__(self) -> None:
        self.reload_data()

    def reload_data(self) -> None:
        self.chunks = load_chunks()
        self.schemes = load_schemes()
        self.scheme_map = {s.id: s for s in self.schemes}
        self.faiss_available = faiss is not None
        self.index = None
        self._build_tfidf_index()

    def _tokenize(self, text: str) -> list[str]:
        cleaned = re.sub(r"[^\w\s]", " ", text.lower())
        return [w for w in cleaned.split() if len(w) > 1]

    def _build_tfidf_index(self) -> None:
        if not self.chunks:
            self.vocab = {}
            self.idf = np.array([])
            self.chunk_vectors = np.zeros((0, 0), dtype="float32")
            return

        corpus = [self._tokenize(chunk["text"]) for chunk in self.chunks]
        vocab_set = set()
        for doc in corpus:
            vocab_set.update(doc)
        
        self.vocab = {term: idx for idx, term in enumerate(sorted(vocab_set))}
        num_docs = len(self.chunks)
        num_terms = len(self.vocab)

        doc_freq = np.zeros(num_terms, dtype="float32")
        for doc in corpus:
            unique_terms = set(doc)
            for term in unique_terms:
                doc_freq[self.vocab[term]] += 1.0

        self.idf = np.log((num_docs + 1.0) / (doc_freq + 1.0)) + 1.0

        tf_idf_matrix = np.zeros((num_docs, num_terms), dtype="float32")
        for i, doc in enumerate(corpus):
            if not doc:
                continue
            term_counts: dict[str, float] = {}
            for term in doc:
                term_counts[term] = term_counts.get(term, 0.0) + 1.0
            
            doc_len = float(len(doc))
            for term, count in term_counts.items():
                idx = self.vocab[term]
                tf_idf_matrix[i, idx] = (count / doc_len) * self.idf[idx]
            
            norm = np.linalg.norm(tf_idf_matrix[i])
            if norm > 0:
                tf_idf_matrix[i] /= norm

        self.chunk_vectors = tf_idf_matrix

        if self.faiss_available and num_docs > 0 and num_terms > 0:
            self.index = faiss.IndexFlatIP(num_terms)
            self.index.add(self.chunk_vectors)

    def search(self, query: str, top_k: int = 4, threshold: float = 0.15) -> list[dict[str, Any]]:
        if not query.strip() or len(self.vocab) == 0:
            return []

        normalized_query = self._normalize_query(query)
        q_tokens = self._tokenize(normalized_query)
        
        if not q_tokens:
            return []

        # Vector representation of query
        q_vec = np.zeros(len(self.vocab), dtype="float32")
        q_counts: dict[str, float] = {}
        for token in q_tokens:
            if token in self.vocab:
                q_counts[token] = q_counts.get(token, 0.0) + 1.0
        
        if q_counts:
            q_len = float(len(q_tokens))
            for token, count in q_counts.items():
                idx = self.vocab[token]
                q_vec[idx] = (count / q_len) * self.idf[idx]
            q_norm = np.linalg.norm(q_vec)
            if q_norm > 0:
                q_vec /= q_norm

        # Vector similarity (Cosine / Inner Product)
        if self.index is not None and np.linalg.norm(q_vec) > 0:
            scores, indices = self.index.search(np.array([q_vec]), len(self.chunks))
            cos_scores = {idx: max(0.0, float(scores[0][i])) for i, idx in enumerate(indices[0]) if idx >= 0}
        else:
            dot_products = np.dot(self.chunk_vectors, q_vec)
            cos_scores = {i: max(0.0, float(dot_products[i])) for i in range(len(self.chunks))}

        # Detect targeted schemes & categories using normalized query
        targeted_scheme_ids = self._detect_target_schemes(normalized_query)
        targeted_categories = self._detect_target_categories(normalized_query)
        is_karnataka_query = any(k in query.lower() or k in normalized_query.lower() for k in ["karnataka", "ಕರ್ನಾಟಕ", "ಕರ್ನಾಟಕದ"])

        # Score components for each chunk
        scored_chunks: list[tuple[float, dict[str, Any]]] = []
        for idx, chunk in enumerate(self.chunks):
            cos_sim = cos_scores.get(idx, 0.0)
            scheme_id = chunk["scheme_id"]
            scheme = self.scheme_map.get(scheme_id)

            scheme_bonus = 0.0
            if targeted_scheme_ids:
                if scheme_id in targeted_scheme_ids:
                    scheme_bonus = 0.60
                else:
                    scheme_bonus = -0.30  # Penalize non-targeted schemes when explicit scheme asked

            category_bonus = 0.0
            if targeted_categories and chunk.get("category") in targeted_categories:
                category_bonus = 0.35

            state_bonus = 0.0
            if is_karnataka_query and chunk.get("state") == "Karnataka":
                state_bonus = 0.25

            # Combine hybrid score
            final_score = (0.45 * cos_sim) + scheme_bonus + category_bonus + state_bonus
            
            if final_score >= threshold:
                chunk_copy = dict(chunk)
                chunk_copy["retrieval_score"] = round(float(final_score), 4)
                scored_chunks.append((final_score, chunk_copy))

        scored_chunks.sort(key=lambda item: item[0], reverse=True)

        # Enforce scheme isolation if specific scheme target exists
        if targeted_scheme_ids:
            isolated = [c for s, c in scored_chunks if c["scheme_id"] in targeted_scheme_ids]
            if isolated:
                return isolated[:top_k]

        return [c for s, c in scored_chunks[:top_k]]

    def _normalize_query(self, query: str) -> str:
        hints = {
            "किसान": "farmer kisan agriculture land",
            "किसानों": "farmer kisan agriculture land",
            "खेती": "farmer agriculture land",
            "छात्र": "student scholarship education",
            "विद्यार्थी": "student scholarship education",
            "छात्रवृत्ति": "scholarship education",
            "महिला": "women girl child ujjwala sukanya",
            "दिव्यांग": "disability disabled health support udid",
            "मजदूर": "worker labour shram pension",
            "श्रमिक": "worker labour shram pension",
            "शिल्पकार": "artisan craft vishwakarma",
            "रइತ": "farmer kisan agriculture land",
            "ರೈತ": "farmer kisan agriculture land",
            "ರೈತರಿಗೆ": "farmer kisan agriculture land",
            "ಕೃಷಿ": "farmer agriculture land",
            "ವಿದ್ಯಾರ್ಥಿ": "student scholarship education",
            "ವಿದ್ಯಾರ್ಥಿವೇತನ": "scholarship education",
            "ಮಹಿಳೆ": "women girl child ujjwala sukanya",
            "ಅಂಗವಿಕಲ": "disability disabled health support udid",
            "ಕಾರ್ಮಿಕ": "worker labour shram pension",
            "ಕುಶಲಕರ್ಮಿ": "artisan craft vishwakarma",
        }
        additions = [value for key, value in hints.items() if key in query]
        return f"{query} {' '.join(additions)}".strip()

    def _detect_target_schemes(self, query: str) -> set[str]:
        q_lower = query.lower()
        targets = set()

        mappings = {
            "pm-kisan": ["pm-kisan", "pm kisan", "kisan samman", "पीएम-किसान", "ಪಿಎಂ-ಕಿಸಾನ್"],
            "ayushman-bharat-pmjay": ["ayushman", "pm-jay", "pmjay", "health card", "आयुष्मान", "ಆಯುಷ್ಮಾನ್"],
            "pmay-g": ["pmay", "awaas yojana", "housing scheme", "आवास", "ಆವಾಸ್"],
            "national-scholarship-portal": ["national scholarship", "nsp", "scholarship portal", "स्कॉलरशिप", "ವಿದ್ಯಾರ್ಥಿವೇತನ"],
            "pm-ujjwala-yojana": ["ujjwala", "pmuy", "lpg connection", "gas connection", "उज्जवला", "ಉಜ್ವಲ"],
            "e-shram": ["e-shram", "eshram", "shram card", "ई-श्रम", "ಇ-ಶ್ರಮ್"],
            "sukanya-samriddhi": ["sukanya", "girl child savings", "सुकन्या", "ಸುಕನ್ಯಾ"],
            "krishi-bhagya-karnataka": ["krishi bhagya", "karnataka farmer", "कृषि भाग्य", "ಕೃಷಿ ಭಾಗ್ಯ"],
            "swachh-bharat-mission-gramin": ["swachh bharat", "toilet scheme", "sbm", "स्वच्छ भारत", "ಸ್ವಚ್ಛ ಭಾರತ"],
            "pm-vishwakarma": ["vishwakarma", "artisan scheme", "craftsman", "विश्वकर्मा", "ವಿಶ್ವಕರ್ಮ"],
            "pm-sym": ["shram yogi", "maandhan", "pm-sym", "pension scheme", "मानधन", "ಮಾನ್‌ಧನ್"],
            "udid": ["udid", "disability id", "swavlamban", "स्वावलंबन", "ಯುಡಿಐಡಿ"],
        }

        for scheme_id, aliases in mappings.items():
            if any(alias in q_lower for alias in aliases):
                targets.add(scheme_id)

        return targets

    def _detect_target_categories(self, query: str) -> set[str]:
        q_lower = query.lower()
        cats = set()

        cat_keywords = {
            "Agriculture": ["farmer", "kisan", "agriculture", "crop", "land", "farming", "किसान", "किसानों", "खेती", "ರೈತ", "ರೈತರಿಗೆ", "ಕೃಷಿ"],
            "Education": ["student", "scholarship", "education", "school", "college", "study", "छात्र", "विद्यार्थी", "छात्रवृत्ति", "ವಿದ್ಯಾರ್ಥಿ", "ವಿದ್ಯಾರ್ಥಿವೇತನ"],
            "Health": ["health", "hospital", "treatment", "medical", "ayushman", "स्वास्थ्य", "अस्पताल", "ಆರೋಗ್ಯ", "ಆಸ್ಪತ್ರೆ"],
            "Housing": ["house", "housing", "pmay", "home", "आवास", "मकान", "ವಸತಿ", "ಮನೆ"],
            "Energy": ["lpg", "gas", "cooking", "ujjwala", "fuel", "गैस", "ಉಜ್ವಲ"],
            "Labour": ["worker", "labour", "labor", "shram", "unorganized", "pension", "मजदूर", "श्रमिक", "ಕಾರ್ಮಿಕ", "ಶ್ರಮಿಕ್"],
            "Women and Child": ["women", "girl", "child", "mother", "sukanya", "महिला", "बेटी", "ಮಹಿಳೆ", "ಹೆಣ್ಣು"],
            "Sanitation": ["sanitation", "toilet", "swachh", "gramin", "शौचालय", "स्वच्छता", "ಶೌಚಾಲಯ"],
            "Livelihood": ["artisan", "craft", "vishwakarma", "trade", "tool", "कारीगर", "शिल्पकार", "ಕುಶಲಕರ್ಮಿ"],
            "Disability": ["disability", "disabled", "udid", "pwd", "handicapped", "दिव्यांग", "विकलांग", "ಅಂಗವಿಕಲ"],
        }

        for category, keywords in cat_keywords.items():
            if any(kw in q_lower for kw in keywords):
                cats.add(category)

        return cats


search_service = SearchService()


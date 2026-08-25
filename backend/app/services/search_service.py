from __future__ import annotations

from typing import Any

import numpy as np

from app.services.data_loader import load_chunks

try:
    import faiss  # type: ignore
except Exception:  # pragma: no cover
    faiss = None


class SearchService:
    def __init__(self) -> None:
        self.chunks = load_chunks()
        self.faiss_available = faiss is not None
        self.index = None
        self.vectors: np.ndarray | None = None
        self._build_index()

    def _embed(self, text: str) -> np.ndarray:
        vector = np.zeros(26, dtype="float32")
        for char in text.lower():
            if "a" <= char <= "z":
                vector[ord(char) - 97] += 1
        norm = np.linalg.norm(vector)
        return vector if norm == 0 else vector / norm

    def _build_index(self) -> None:
        vectors = np.array([self._embed(chunk["text"]) for chunk in self.chunks], dtype="float32")
        self.vectors = vectors
        if self.faiss_available and len(vectors) > 0:
            self.index = faiss.IndexFlatL2(vectors.shape[1])
            self.index.add(vectors)

    def search(self, query: str, top_k: int = 3) -> list[dict[str, Any]]:
        if not query.strip():
            return []
        if self.index is not None:
            query_vector = np.array([self._embed(query)], dtype="float32")
            _, indices = self.index.search(query_vector, min(top_k, len(self.chunks)))
            return [self.chunks[idx] for idx in indices[0] if idx >= 0]
        terms = set(query.lower().split())
        scored = []
        for chunk in self.chunks:
            overlap = len(terms.intersection(set(chunk["text"].lower().split())))
            scored.append((overlap, chunk))
        scored.sort(key=lambda item: item[0], reverse=True)
        return [chunk for score, chunk in scored[:top_k] if score > 0] or self.chunks[:top_k]


search_service = SearchService()

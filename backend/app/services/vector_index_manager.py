"""
Persistent vector index manager for FAISS-based similarity search.
Handles index creation, serialization, and cache invalidation based on dataset changes.
"""

import hashlib
import json
import logging
from pathlib import Path
from typing import Any

import numpy as np

logger = logging.getLogger("techsahaya.vector_index_manager")

try:
    import faiss
except ImportError:
    faiss = None


class VectorIndexManager:
    """Manages persistent FAISS index with hash-based cache validation."""

    def __init__(self, cache_dir: Path = None):
        """Initialize index manager."""
        if cache_dir is None:
            from app.services.data_loader import CACHE_DIR
            cache_dir = CACHE_DIR
        
        self.cache_dir = cache_dir
        self.cache_dir.mkdir(exist_ok=True)
        
        self.index_file = self.cache_dir / "faiss_index.bin"
        self.metadata_file = self.cache_dir / "faiss_metadata.json"
        self.index_hash_file = self.cache_dir / "faiss_hash"

    def should_rebuild(self, current_hash: str) -> bool:
        """Check if index should be rebuilt based on data hash."""
        if not self.index_file.exists() or not self.index_hash_file.exists():
            return True
        
        try:
            with self.index_hash_file.open("r") as f:
                stored_hash = f.read().strip()
            return stored_hash != current_hash
        except Exception as e:
            logger.warning(f"[INDEX] Failed to read hash: {e}, will rebuild")
            return True

    def load_index(self, embeddings: np.ndarray, hash_value: str) -> Any:
        """
        Load or create FAISS index.
        
        Args:
            embeddings: TF-IDF vectors (num_docs x num_features)
            hash_value: Current dataset hash
            
        Returns:
            FAISS index or None if FAISS unavailable
        """
        if faiss is None:
            logger.debug("[INDEX] FAISS not available, using fallback search")
            return None

        if not self.should_rebuild(hash_value):
            try:
                index = faiss.read_index(str(self.index_file))
                logger.info(
                    f"[INDEX] Loaded persistent FAISS index from cache "
                    f"({index.ntotal} vectors, hash: {hash_value[:8]}...)"
                )
                return index
            except Exception as e:
                logger.warning(f"[INDEX] Failed to load cached index: {e}, rebuilding...")

        # Build new index
        if embeddings.shape[0] == 0:
            logger.debug("[INDEX] No embeddings to index, skipping FAISS creation")
            return None

        try:
            num_features = embeddings.shape[1]
            index = faiss.IndexFlatIP(num_features)
            index.add(embeddings.astype(np.float32))
            
            # Save index and hash
            faiss.write_index(index, str(self.index_file))
            with self.index_hash_file.open("w") as f:
                f.write(hash_value)
            
            logger.info(
                f"[INDEX] Created and cached FAISS index "
                f"({index.ntotal} vectors, {num_features} dimensions, hash: {hash_value[:8]}...)"
            )
            return index
        except Exception as e:
            logger.error(f"[INDEX] Failed to create FAISS index: {e}")
            return None

    def save_metadata(self, metadata: dict[str, Any]) -> None:
        """Save index metadata."""
        try:
            with self.metadata_file.open("w") as f:
                json.dump(metadata, f)
        except Exception as e:
            logger.warning(f"[INDEX] Failed to save metadata: {e}")

    def load_metadata(self) -> dict[str, Any]:
        """Load index metadata."""
        if self.metadata_file.exists():
            try:
                with self.metadata_file.open("r") as f:
                    return json.load(f)
            except Exception as e:
                logger.warning(f"[INDEX] Failed to load metadata: {e}")
        return {}

    def clear_cache(self) -> None:
        """Clear cached index files."""
        for file in [self.index_file, self.metadata_file, self.index_hash_file]:
            if file.exists():
                file.unlink()
                logger.info(f"[INDEX] Cleared cache file: {file.name}")


def compute_chunks_hash(chunks: list[dict[str, Any]]) -> str:
    """Compute hash of chunks list for cache validation."""
    chunks_json = json.dumps(chunks, sort_keys=True, ensure_ascii=False).encode("utf-8")
    return hashlib.sha256(chunks_json).hexdigest()

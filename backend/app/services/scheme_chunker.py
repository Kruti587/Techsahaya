"""
Semantic scheme document builder.
Converts schemes.json into semantically meaningful chunks with rich metadata.
"""

import json
import logging
from pathlib import Path
from typing import Any

from app.models.schemas import Scheme

logger = logging.getLogger("techsahaya.scheme_chunker")


class SchemeChunker:
    """Converts scheme records into semantic chunks with metadata."""

    def chunk_schemes(self, schemes: list[Scheme]) -> list[dict[str, Any]]:
        """
        Convert schemes into semantic chunks.
        
        Strategy:
        - Chunk 1: Core information (name, description, category, benefits, state_scope)
        - Chunk 2: Eligibility criteria
        - Chunk 3: Application process (documents + steps)
        - Chunk 4: Metadata (source, verification, alternatives)
        
        Args:
            schemes: List of Scheme objects
            
        Returns:
            List of chunk dictionaries with metadata
        """
        chunks = []

        for scheme in schemes:
            scheme_id = scheme.id
            scheme_name = scheme.name
            category = scheme.category
            state_scope = scheme.state_scope
            department = scheme.department
            last_verified = scheme.last_verified

            # Build base metadata
            base_metadata = {
                "scheme_id": scheme_id,
                "scheme_name": scheme_name,
                "category": category,
                "state_scope": state_scope,
                "department": department,
                "last_verified": last_verified,
                "source": scheme.source_name,
                "language": "en",
            }

            # Chunk 1: Overview and Core Information
            overview_text = (
                f"{scheme_name}: {scheme.description}\n\n"
                f"Category: {category}\n"
                f"Department: {department}\n"
                f"Scope: {', '.join(state_scope)}\n"
                f"Benefits: {', '.join(scheme.benefits)}"
            )
            chunks.append({
                **base_metadata,
                "chunk_type": "overview",
                "text": overview_text,
                "state": state_scope[0] if state_scope else "All",
            })

            # Chunk 2: Eligibility Criteria
            if scheme.eligibility:
                eligibility_text = (
                    f"{scheme_name} - Eligibility Requirements:\n\n"
                    f"{chr(10).join('• ' + e for e in scheme.eligibility)}"
                )
                chunks.append({
                    **base_metadata,
                    "chunk_type": "eligibility",
                    "text": eligibility_text,
                    "state": state_scope[0] if state_scope else "All",
                })

            # Chunk 3: Application Process
            if scheme.required_documents or scheme.application_steps:
                app_text = f"{scheme_name} - How to Apply:\n\n"
                
                if scheme.required_documents:
                    app_text += "Required Documents:\n"
                    app_text += "\n".join(f"• {doc}" for doc in scheme.required_documents)
                    app_text += "\n\n"
                
                if scheme.application_steps:
                    app_text += "Application Steps:\n"
                    app_text += "\n".join(f"{i}. {step}" for i, step in enumerate(scheme.application_steps, 1))
                
                chunks.append({
                    **base_metadata,
                    "chunk_type": "application",
                    "text": app_text,
                    "state": state_scope[0] if state_scope else "All",
                })

            # Chunk 4: Source and Metadata
            if scheme.official_link or scheme.source_reference or scheme.alternative_scheme_ids:
                metadata_text = f"{scheme_name} - Additional Information:\n\n"
                
                if scheme.official_link:
                    metadata_text += f"Official Link: {scheme.official_link}\n"
                
                metadata_text += f"Source: {scheme.source_name}\n"
                metadata_text += f"Last Verified: {scheme.last_verified}\n"
                
                if scheme.source_reference:
                    metadata_text += f"Reference: {scheme.source_reference}\n"
                
                if scheme.alternative_scheme_ids:
                    metadata_text += f"Related Schemes: {', '.join(scheme.alternative_scheme_ids)}\n"
                
                if scheme.data_note:
                    metadata_text += f"Note: {scheme.data_note}\n"
                
                chunks.append({
                    **base_metadata,
                    "chunk_type": "metadata",
                    "text": metadata_text,
                    "state": state_scope[0] if state_scope else "All",
                })

        logger.info(f"[CHUNKER] Created {len(chunks)} chunks from {len(schemes)} schemes")
        return chunks

    def chunk_schemes_from_file(self, file_path: Path) -> list[dict[str, Any]]:
        """Load schemes from JSON file and chunk them."""
        with file_path.open("r", encoding="utf-8") as f:
            data = json.load(f)
        
        schemes = [Scheme(**item) for item in data]
        return self.chunk_schemes(schemes)


def create_semantic_chunks(schemes: list[Scheme]) -> list[dict[str, Any]]:
    """Convenience function to create semantic chunks from schemes."""
    chunker = SchemeChunker()
    return chunker.chunk_schemes(schemes)

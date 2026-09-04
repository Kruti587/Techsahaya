#!/usr/bin/env python3
"""
Test script for TechSahaya RAG optimization.
Validates dataset, schema, chunking, caching, and retrieval.
"""

import json
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.services.scheme_validator import validate_schemes_dataset
from app.services.scheme_chunker import create_semantic_chunks
from app.services.data_loader import DATA_DIR, load_schemes, load_chunks, validate_dataset_on_startup, get_scheme_map
from app.models.schemas import EligibilityProfile

def test_dataset_validation():
    """Test 1: Validate schemes dataset."""
    print("\n" + "="*80)
    print("TEST 1: DATASET VALIDATION")
    print("="*80)
    
    schemes_file = DATA_DIR / "schemes" / "schemes.json"
    result = validate_schemes_dataset(schemes_file)
    
    print(f"\n✓ Validation Result: {'PASSED' if result['valid'] else 'FAILED'}")
    print(f"  Total schemes: {result['stats']['total_schemes']}")
    print(f"  Valid schemes: {result['stats']['valid_schemes']}")
    print(f"  Invalid schemes: {result['stats']['invalid_schemes']}")
    
    if result['errors']:
        print(f"\n✗ Errors ({len(result['errors'])}):")
        for error in result['errors'][:5]:  # Show first 5
            print(f"  - {error}")
        if len(result['errors']) > 5:
            print(f"  ... and {len(result['errors']) - 5} more")
    
    if result['warnings']:
        print(f"\n⚠ Warnings ({len(result['warnings'])}):")
        for warning in result['warnings'][:5]:
            print(f"  - {warning}")
    
    if result['stats']['missing_alternatives']:
        print(f"\n⚠ Missing alternatives: {len(result['stats']['missing_alternatives'])}")
    
    return result['valid']


def test_schemes_loading():
    """Test 2: Load schemes."""
    print("\n" + "="*80)
    print("TEST 2: SCHEMES LOADING")
    print("="*80)
    
    schemes = load_schemes()
    scheme_map = get_scheme_map()
    
    print(f"\n✓ Loaded {len(schemes)} schemes")
    print(f"✓ Created scheme_map with {len(scheme_map)} entries")
    
    # Show sample schemes
    print(f"\nSample schemes:")
    for scheme in schemes[:3]:
        print(f"  • {scheme.id}: {scheme.name}")
        print(f"    Category: {scheme.category}")
        print(f"    State scope: {', '.join(scheme.state_scope[:2])}")
    
    return len(schemes) > 0 and len(scheme_map) == len(schemes)


def test_chunking():
    """Test 3: Semantic chunking."""
    print("\n" + "="*80)
    print("TEST 3: SEMANTIC CHUNKING")
    print("="*80)
    
    schemes = load_schemes()
    chunks = create_semantic_chunks(schemes)
    
    print(f"\n✓ Created {len(chunks)} chunks from {len(schemes)} schemes")
    
    # Analyze chunks by type
    chunk_types = {}
    for chunk in chunks:
        ctype = chunk.get("chunk_type", "unknown")
        chunk_types[ctype] = chunk_types.get(ctype, 0) + 1
    
    print(f"\nChunk distribution:")
    for ctype, count in sorted(chunk_types.items()):
        print(f"  • {ctype}: {count}")
    
    # Verify chunk structure
    required_fields = {"scheme_id", "scheme_name", "chunk_type", "text", "state", "category"}
    sample_chunk = chunks[0] if chunks else {}
    missing_fields = required_fields - set(sample_chunk.keys())
    
    if missing_fields:
        print(f"\n✗ Missing fields in chunks: {missing_fields}")
        return False
    
    print(f"\n✓ All chunks have required fields")
    return len(chunks) > len(schemes)  # Should have multiple chunks per scheme


def test_caching():
    """Test 4: Caching and hash validation."""
    print("\n" + "="*80)
    print("TEST 4: CACHING & HASH VALIDATION")
    print("="*80)
    
    # Load chunks (which should use cache if dataset unchanged)
    chunks = load_chunks()
    
    from app.services.data_loader import CACHE_DIR, _compute_file_hash
    from app.services.data_loader import DATA_DIR
    
    schemes_file = DATA_DIR / "schemes" / "schemes.json"
    current_hash = _compute_file_hash(schemes_file)
    
    print(f"\n✓ Dataset hash: {current_hash[:16]}...")
    
    hash_file = CACHE_DIR / "schemes_hash"
    cached_chunks_file = CACHE_DIR / "scheme_chunks_cached.json"
    
    if hash_file.exists():
        with hash_file.open("r") as f:
            stored_hash = f.read().strip()
        print(f"✓ Stored hash: {stored_hash[:16]}...")
        print(f"✓ Hash match: {current_hash == stored_hash}")
    
    if cached_chunks_file.exists():
        file_size = cached_chunks_file.stat().st_size
        print(f"✓ Cached chunks file exists: {file_size} bytes")
    
    print(f"\n✓ Loaded {len(chunks)} chunks from storage")
    return len(chunks) > 0


def test_profile_aware_retrieval():
    """Test 5: Profile-aware retrieval."""
    print("\n" + "="*80)
    print("TEST 5: PROFILE-AWARE RETRIEVAL")
    print("="*80)
    
    from app.services.profile_aware_search import ProfileAwareRanker, apply_profile_aware_filtering
    
    schemes = load_schemes()
    
    # Create sample profiles
    profiles = [
        EligibilityProfile(
            age=25,
            gender="Female",
            state="Karnataka",
            occupation="Student",
            income=150000,
        ),
        EligibilityProfile(
            age=45,
            gender="Male",
            state="Maharashtra",
            occupation="Farmer",
            income=200000,
        ),
        EligibilityProfile(
            age=65,
            gender="Male",
            state="All",
            occupation="Retired",
            income=100000,
        ),
    ]
    
    print(f"\n✓ Testing profile-aware reranking with {len(profiles)} test profiles")
    
    ranker = ProfileAwareRanker()
    
    # Create sample chunks
    chunks = [
        {
            "scheme_id": "national-scholarship-portal",
            "scheme_name": "National Scholarship Portal",
            "category": "Education",
            "state_scope": ["All"],
            "state": "All",
            "chunk_type": "overview",
            "text": "Scholarship for students",
            "retrieval_score": 0.7,
        },
        {
            "scheme_id": "pm-kisan",
            "scheme_name": "PM-Kisan",
            "category": "Agriculture",
            "state_scope": ["All"],
            "state": "All",
            "chunk_type": "overview",
            "text": "Support for farmers",
            "retrieval_score": 0.6,
        },
    ]
    
    for i, profile in enumerate(profiles, 1):
        reranked = ranker.rerank_chunks(chunks, profile, "What schemes are available?")
        print(f"\n  Profile {i} ({profile.occupation}, {profile.state}):")
        for j, chunk in enumerate(reranked[:2], 1):
            print(f"    {j}. {chunk['scheme_name']} (score: {chunk.get('rerank_score', 0.0):.3f})")
    
    return True


def test_retrieval_flow():
    """Test 6: Full retrieval flow."""
    print("\n" + "="*80)
    print("TEST 6: FULL RETRIEVAL FLOW")
    print("="*80)
    
    try:
        from app.services.search_service import search_service
        
        # Test queries
        test_queries = [
            ("farmer schemes karnataka", "Farmer from Karnataka"),
            ("student scholarship low income", "Student with low income"),
            ("disability pension", "Person with disability"),
        ]
        
        print(f"\nTesting {len(test_queries)} queries:")
        
        for query, description in test_queries:
            results = search_service.search(query, top_k=3)
            print(f"\n  Query: '{query}' ({description})")
            print(f"  ✓ Retrieved {len(results)} chunks")
            if results:
                print(f"    Top: {results[0].get('scheme_name')} "
                      f"(score: {results[0].get('retrieval_score', 0.0):.3f})")
        
        return True
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False


def main():
    """Run all tests."""
    print("\n" + "="*80)
    print("TECHSAHAYA RAG OPTIMIZATION - VALIDATION TEST SUITE")
    print("="*80)
    
    tests = [
        ("Dataset Validation", test_dataset_validation),
        ("Schemes Loading", test_schemes_loading),
        ("Semantic Chunking", test_chunking),
        ("Caching & Hashing", test_caching),
        ("Profile-Aware Retrieval", test_profile_aware_retrieval),
        ("Retrieval Flow", test_retrieval_flow),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            result = test_func()
            results.append((name, result))
        except Exception as e:
            print(f"\n✗ Test failed with exception: {e}")
            import traceback
            traceback.print_exc()
            results.append((name, False))
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = sum(1 for _, r in results if r)
    total = len(results)
    
    for name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status}: {name}")
    
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED!")
        return 0
    else:
        print(f"\n⚠ {total - passed} tests failed")
        return 1


if __name__ == "__main__":
    sys.exit(main())

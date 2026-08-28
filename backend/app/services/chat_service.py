import logging
import re
import unicodedata
from typing import Any
# pyrefly: ignore [missing-import]
import httpx

from app.core.config import get_settings
from app.core.prompts import (
    REFUSAL_PROMPT_RESPONSES,
    SAHAYA_SYSTEM_INSTRUCTION,
    USER_PROMPT_TEMPLATE,
)
from app.models.schemas import ChatResponse, EligibilityProfile, EligibilityResult, Scheme
from app.services.data_loader import load_rules, load_schemes, load_scheme_translations, load_tours
from app.services.eligibility_engine import eligibility_engine
from app.services.search_service import search_service

logger = logging.getLogger("techsahaya.chat_service")
settings = get_settings()


class ChatService:
    def __init__(self) -> None:
        self.rules = load_rules()
        self.schemes = load_schemes()
        self.scheme_map = {s.id: s for s in self.schemes}

    def answer(self, message: str, language: str = "en", profile: EligibilityProfile | None = None) -> ChatResponse:
        self.schemes = load_schemes()
        self.scheme_map = {s.id: s for s in self.schemes}
        self.rules = load_rules()

        # 1. Input Sanitization & Normalization
        cleaned_message = self._sanitize_input(message)

        # 2. Prompt Injection & Scope Refusal Pre-check
        if settings.prompt_injection_guard_enabled and self._is_adversarial_or_jailbreak(cleaned_message):
            logger.warning("Prompt injection / jailbreak detected: '%s'", cleaned_message)
            return self._refusal_response(language)

        # 2b. Friendly Greeting & General Onboarding Help
        if self._is_greeting_or_general_help(cleaned_message):
            return self._greeting_or_general_help_response(language)

        normalized_message = search_service._normalize_query(cleaned_message)
        intent = self._detect_intent(cleaned_message)
        chunks = search_service.search(cleaned_message, top_k=4, threshold=0.10)

        logger.info(
            "Chat Query: '%s' | Intent: '%s' | Chunks retrieved: %d",
            cleaned_message,
            intent,
            len(chunks),
        )

        # Rejection for unsupported queries
        if not chunks or self._is_unsupported_query(cleaned_message, chunks):
            return self._insufficient_evidence_response(language)

        top_score = max((c.get("retrieval_score", 0.0) for c in chunks), default=0.0)
        if top_score < 0.12 and not any(
            term in cleaned_message.lower()
            for term in ["farmer", "student", "worker", "women", "disability", "health", "house", "scheme", "kisan", "yojana", "help", "madu", "madi"]
        ):
            return self._insufficient_evidence_response(language)


        # Retrieve matched structured schemes
        scheme_ids = list({chunk["scheme_id"] for chunk in chunks})
        matched_schemes = [self.scheme_map[sid] for sid in scheme_ids if sid in self.scheme_map]

        target_schemes = search_service._detect_target_schemes(cleaned_message)
        if target_schemes:
            matched_schemes = [s for s in matched_schemes if s.id in target_schemes] or matched_schemes
            chunks = [c for c in chunks if c["scheme_id"] in [s.id for s in matched_schemes]] or chunks

        # Evaluate Deterministic Eligibility
        eligibility_result: EligibilityResult | None = None
        if (intent == "eligibility" or "eligible" in cleaned_message.lower() or profile is not None) and matched_schemes:
            primary_scheme = matched_schemes[0]
            rule = self.rules.get(primary_scheme.id, {})
            eval_profile = profile or EligibilityProfile()
            eligibility_result = eligibility_engine.evaluate(
                primary_scheme.id, eval_profile, rule, primary_scheme.alternative_scheme_ids
            )

        confidence = self._calculate_confidence(chunks, matched_schemes, cleaned_message)

        # Generate Grounded Answer (Gemini API with XML Fencing or Fallback)
        raw_answer = self._generate_grounded_answer(
            message=cleaned_message,
            language=language,
            intent=intent,
            schemes=matched_schemes,
            chunks=chunks,
            eligibility_result=eligibility_result,
        )

        # 3. Output Validation vs Deterministic Rule Engine
        validated_answer = self._validate_and_sanitize_output(
            raw_answer=raw_answer,
            eligibility_result=eligibility_result,
            schemes=matched_schemes,
            language=language,
            intent=intent,
        )

        # 4. Tour Action Detection & Allowlist Validation
        tour_id, suggested_action = self._detect_and_validate_tour_action(
            message=cleaned_message,
            answer=validated_answer,
            intent=intent,
            eligibility_result=eligibility_result,
        )

        # Clean out any raw action tag from the final answer text shown to citizens
        final_answer = re.sub(r"\[TOUR_ACTION:\s*[^\]]+\]", "", validated_answer).strip()

        evidence = [
            {
                "scheme_name": chunk["scheme_name"],
                "evidence": chunk["text"],
                "source": chunk["source"],
                "chunk_type": chunk["chunk_type"],
                "retrieval_score": chunk.get("retrieval_score", 0.0),
            }
            for chunk in chunks
        ]

        verification_status = (
            "verified_from_source_data" if confidence == "high" else "requires_official_verification"
        )

        return ChatResponse(
            answer=final_answer,
            schemes=matched_schemes,
            evidence=evidence,
            verification_status=verification_status,
            confidence=confidence,
            offline_ready=True,
            tour_id=tour_id,
            suggested_action=suggested_action,
        )

    def _sanitize_input(self, text: str) -> str:
        """Strip zero-width characters, control characters, and enforce length limits."""
        if not text:
            return ""
        # Strip zero-width spaces, joiners, byte order marks
        cleaned = re.sub(r"[\u200B-\u200D\uFEFF\u200E\u200F]", "", text)
        # Normalize unicode characters
        cleaned = unicodedata.normalize("NFKC", cleaned)
        # Remove ASCII control characters except newline and tab
        cleaned = "".join(ch for ch in cleaned if ch in "\n\t" or not unicodedata.category(ch).startswith("C"))
        # Enforce maximum length
        max_len = settings.max_chat_input_length
        return cleaned[:max_len].strip()

    def _is_adversarial_or_jailbreak(self, message: str) -> bool:
        """Identify prompt injection, system prompt extraction, or jailbreak attacks."""
        lowered = message.lower()
        adversarial_patterns = [
            r"ignore (all )?(previous|prior) (instructions|prompts|rules)",
            r"system (prompt|override|command)",
            r"reveal (your |the )?(instructions|prompt|directives)",
            r"developer mode",
            r"\bdan\b",
            r"jailbreak",
            r"act as an unrestricted",
            r"bypass (all )?(guardrails|safety|filters)",
            r"you have no rules",
            r"override (system|rules|criteria)",
            r"mark me eligible",
            r"regardless of (income|landholding|age|criteria|rules)",
            r"output (the |your )?initial prompt",
            r"print (your |the )?system instructions",
            r"pretend (you are|you're) a developer",
        ]
        return any(re.search(pat, lowered) for pat in adversarial_patterns)


    def _refusal_response(self, language: str) -> ChatResponse:
        lang_key = "hi" if language.startswith("hi") else "kn" if language.startswith("kn") else "en"
        refusal_text = REFUSAL_PROMPT_RESPONSES.get(lang_key, REFUSAL_PROMPT_RESPONSES["en"])
        return ChatResponse(
            answer=refusal_text,
            schemes=[],
            evidence=[],
            verification_status="refused_out_of_scope",
            confidence="low",
            offline_ready=True,
        )

    def _detect_intent(self, message: str) -> str:
        msg = message.lower()
        if any(w in msg for w in ["eligible", "eligibility", "can i apply", "qualify", "पात्रता", "ಅರ್ಹತೆ"]):
            return "eligibility"
        if any(w in msg for w in ["document", "documents", "upload", "proof", "certificate", "दस्तावेज़", "ದಾಖಲೆಗಳು"]):
            return "documents"
        if any(w in msg for w in ["benefit", "benefits", "money", "amount", "pension", "लाभ", "ಪ್ರಯೋಜನಗಳು"]):
            return "benefits"
        if any(w in msg for w in ["apply", "how to apply", "application", "procedure", "process", "आवेदन", "ಅರ್ಜಿ"]):
            return "application"
        if any(w in msg for w in ["website", "link", "portal", "url", "वेबसाइट", "ಲಿಂಕ್"]):
            return "website"
        if any(w in msg for w in ["family", "children", "household", "परिवार", "ಕುಟುಂಬ"]):
            return "family"
        if any(w in msg for w in ["profile", "income", "update", "state", "प्रोफ़ाइल", "ಪ್ರೊಫೈಲ್"]):
            return "profile"
        if any(w in msg for w in ["gap", "missed", "schemes", "available", "list", "योजनाएं", "ಯೋಜನೆಗಳು"]):
            return "scheme_discovery"
        return "scheme_explanation"

    def _is_greeting_or_general_help(self, message: str) -> bool:
        msg = message.lower().strip()
        help_phrases = [
            "help", "help me", "help madu", "help madi", "sahaya", "sahaya madi", "sahaya madu",
            "hello", "hi", "namaste", "namaskara", "hey", "what can you do", "guide me", "how to use",
            "yen madbeku", "madad", "sahayata", "मदद", "सहायता", "नमस्ते", "ನಮಸ್ಕಾರ", "ಸಹಾಯ", "ಸಹಾಯ ಮಾಡಿ", "ಹೇಗೆ ಬಳಸಬೇಕು"
        ]
        return any(msg == p or msg.startswith(p + " ") or msg.endswith(" " + p) for p in help_phrases)

    def _greeting_or_general_help_response(self, language: str) -> ChatResponse:
        lang = language.lower()
        if lang.startswith("kn"):
            answer = "ನಮಸ್ಕಾರ! ನಾನು 'ಸಹಾಯ' - ನಿಮ್ಮ ಡಿಜಿಟಲ್ ಕಲ್ಯಾಣ ಸಹಾಯಕ. ನಾನು ನಿಮಗೆ:\n• ರೈತರು, ವಿದ್ಯಾರ್ಥಿಗಳು ಮತ್ತು ಮಹಿಳೆಯರ ಯೋಜನೆಗಳನ್ನು ತಿಳಿಸಲು,\n• ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಲು,\n• ಅಗತ್ಯ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಲು ಮಾರ್ಗದರ್ಶನ ನೀಡಬಲ್ಲೆ.\n\nನಿಮಗೆ ಯಾವ ವಿಷಯದಲ್ಲಿ ಸಹಾಯ ಬೇಕು?"
        elif lang.startswith("hi"):
            answer = "नमस्ते! मैं 'सहाय' हूँ - आपका डिजिटल कल्याण सहायक। मैं आपकी सहायता कर सकता हूँ:\n• किसानों, छात्रों और महिलाओं के लिए सरकारी योजनाओं की जानकारी देने में,\n• आपकी पात्रता की जांच करने में,\n• आवश्यक दस्तावेज़ तैयार करने में।\n\nआप किस योजना या विषय के बारे में जानना चाहते हैं?"
        else:
            answer = "Namaste! I am Sahaya, your digital citizen welfare assistant. I can help you with:\n• Finding government welfare schemes for farmers, students, workers, and families\n• Checking your deterministic eligibility with transparent rules\n• Discovering missed welfare entitlements\n• Guided step-by-step document preparation\n\nWhat would you like to explore today?"

        tour_id = "explore_welfare_gaps"
        suggested_action = {
            "type": "guided_tour",
            "tour_id": "explore_welfare_gaps",
            "title": "Explore Missed Benefits",
            "description": "Discover schemes you qualify for with our guided spotlight tour.",
            "route": "/welfare-gaps",
        }

        return ChatResponse(
            answer=answer,
            schemes=[],
            evidence=[],
            verification_status="verified_from_source_data",
            confidence="high",
            offline_ready=True,
            tour_id=tour_id,
            suggested_action=suggested_action,
        )

    def _is_unsupported_query(self, message: str, chunks: list[dict[str, Any]]) -> bool:

        msg = message.lower()
        unsupported_triggers = ["fake scheme", "crypto scheme", "random scheme x", "hacked scheme"]
        return any(t in msg for t in unsupported_triggers)

    def _insufficient_evidence_response(self, language: str) -> ChatResponse:
        lang = language.lower()
        if lang.startswith("hi"):
            answer = "मेरे पास उपलब्ध सत्यापित टेक सहायता (Tech Sahaya) डेटा में इसका सटीक उत्तर देने के लिए पर्याप्त जानकारी नहीं है। कृपया आधिकारिक सरकारी पोर्टल पर जांच करें।"
        elif lang.startswith("kn"):
            answer = "ನನ್ನ ಬಳಿ ಇರುವ ಪರಿಶೀಲಿತ ಟೆಕ್ ಸಹಾಯ (Tech Sahaya) ಡೇಟಾದಲ್ಲಿ ಇದಕ್ಕೆ ನಿಖರವಾದ ಉತ್ತರ ನೀಡಲು ಸಾಕಷ್ಟು ಮಾಹಿತಿ ಇಲ್ಲ. ದಯವಿಟ್ಟು ಅಧಿಕೃತ ಸರ್ಕಾರಿ ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ."
        else:
            answer = "I don't have enough verified information in the Tech Sahaya database to answer that accurately. Please verify on the official government portal."

        return ChatResponse(
            answer=answer,
            schemes=[],
            evidence=[],
            verification_status="insufficient_evidence",
            confidence="low",
            offline_ready=True,
        )

    def _calculate_confidence(self, chunks: list[dict[str, Any]], schemes: list[Scheme], message: str) -> str:
        if not chunks or not schemes:
            return "low"
        top_score = max((c.get("retrieval_score", 0.0) for c in chunks), default=0.0)
        norm_msg = search_service._normalize_query(message)
        target_schemes = search_service._detect_target_schemes(norm_msg)

        if target_schemes and any(s.id in target_schemes for s in schemes):
            return "high"
        if top_score >= 0.30:
            return "high"
        if top_score >= 0.10:
            return "medium"
        return "low"

    def _generate_grounded_answer(
        self,
        message: str,
        language: str,
        intent: str,
        schemes: list[Scheme],
        chunks: list[dict[str, Any]],
        eligibility_result: EligibilityResult | None,
    ) -> str:
        api_key = settings.gemini_api_key or settings.google_api_key
        if api_key:
            try:
                answer = self._call_gemini_api(api_key, message, language, intent, schemes, chunks, eligibility_result)
                if answer and len(answer.strip()) > 10:
                    return answer
            except Exception as exc:
                logger.warning("Gemini API call failed, falling back to local generator: %s", exc)

        return self._generate_local_grounded_fallback(message, language, intent, schemes, chunks, eligibility_result)

    def _call_gemini_api(
        self,
        api_key: str,
        message: str,
        language: str,
        intent: str,
        schemes: list[Scheme],
        chunks: list[dict[str, Any]],
        eligibility_result: EligibilityResult | None,
    ) -> str:
        system_instruction = SAHAYA_SYSTEM_INSTRUCTION.format(language=language)

        translations_map = load_scheme_translations()
        lang_key = "hi" if language.startswith("hi") else "kn" if language.startswith("kn") else "en"

        schemes_payload = []
        for s in schemes:
            trans = translations_map.get(s.id, {}).get(lang_key) if lang_key != "en" else None
            if lang_key != "en":
                if trans:
                    schemes_payload.append({
                        "name": s.name,  # Official scheme name preserved
                        "category": s.category,
                        "state_scope": s.state_scope,
                        "description": trans.get("description", s.description),
                        "benefits": trans.get("benefits", s.benefits),
                        "eligibility": trans.get("eligibility", s.eligibility),
                        "required_documents": trans.get("required_documents", s.required_documents),
                        "application_steps": trans.get("application_steps", s.application_steps),
                        "department": trans.get("department", s.department),
                        "official_link": str(s.official_link),
                        "source_name": s.source_name,
                    })
                else:
                    logger.info("Scheme '%s' missing '%s' translation entry — falling back to LLM translation.", s.id, lang_key)
                    schemes_payload.append({
                        "name": s.name,
                        "category": s.category,
                        "state_scope": s.state_scope,
                        "description": s.description,
                        "benefits": s.benefits,
                        "eligibility": s.eligibility,
                        "required_documents": s.required_documents,
                        "application_steps": s.application_steps,
                        "department": s.department,
                        "official_link": str(s.official_link),
                        "source_name": s.source_name,
                    })
            else:
                schemes_payload.append({
                    "name": s.name,
                    "category": s.category,
                    "state_scope": s.state_scope,
                    "description": s.description,
                    "benefits": s.benefits,
                    "eligibility": s.eligibility,
                    "required_documents": s.required_documents,
                    "application_steps": s.application_steps,
                    "department": s.department,
                    "official_link": str(s.official_link),
                    "source_name": s.source_name,
                })

        evidence_payload = [{"scheme": c["scheme_name"], "type": c["chunk_type"], "text": c["text"]} for c in chunks]
        eligibility_payload = eligibility_result.model_dump() if eligibility_result else "No profile evaluated"
        tours_allowlist = load_tours().get("allowlist", [])

        user_prompt = USER_PROMPT_TEMPLATE.format(
            message=message,
            language=language,
            intent=intent,
            evidence_payload=evidence_payload,
            schemes_payload=schemes_payload,
            eligibility_payload=eligibility_payload,
            tours_allowlist=tours_allowlist,
        )

        headers = {"Content-Type": "application/json"}
        payload = {
            "systemInstruction": {
                "parts": [{"text": system_instruction}]
            },
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": user_prompt}],
                }
            ],
            "generationConfig": {
                "temperature": 0.1,
                "maxOutputTokens": 700,
            },
        }

        # Primary Model
        url = f"{settings.sarvam_api_base_url.replace('sarvam.ai', 'googleapis.com')}/v1beta/models/{settings.gemini_model}:generateContent?key={api_key}"
        if "googleapis.com" not in url:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_model}:generateContent?key={api_key}"

        with httpx.Client(timeout=10.0) as client:
            response = client.post(url, json=payload, headers=headers)
            if response.status_code != 200:
                # Fallback model retry
                fallback_url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.gemini_fallback_model}:generateContent?key={api_key}"
                response = client.post(fallback_url, json=payload, headers=headers)

            if response.status_code == 200:
                data = response.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return parts[0].get("text", "").strip()

        raise RuntimeError("Gemini API response contained no valid text")

    def _validate_and_sanitize_output(
        self,
        raw_answer: str,
        eligibility_result: EligibilityResult | None,
        schemes: list[Scheme],
        language: str,
        intent: str,
    ) -> str:
        """Cross-check LLM explanation against deterministic rule evaluation."""
        if not raw_answer or not eligibility_result:
            return raw_answer

        lowered = raw_answer.lower()

        # If rule engine says NOT eligible, but LLM says eligible:
        if eligibility_result.status == "not_eligible":
            if any(phrase in lowered for phrase in ["you are eligible", "you qualify", "you are fully eligible", "आप पात्र हैं", "ನೀವು ಅರ್ಹರಾಗಿದ್ದೀರಿ"]):
                logger.warning("Guardrail violation: LLM claimed eligible when rule engine calculated not_eligible. Reverting to verified template.")
                return self._generate_local_grounded_fallback(
                    message="",
                    language=language,
                    intent=intent,
                    schemes=schemes,
                    chunks=[],
                    eligibility_result=eligibility_result,
                )

        # If rule engine says ELIGIBLE, but LLM says not eligible:
        if eligibility_result.status == "eligible":
            if any(phrase in lowered for phrase in ["you are not eligible", "you do not qualify", "you are ineligible", "आप पात्र नहीं हैं", "ನೀವು ಅರ್ಹರಲ್ಲ"]):
                logger.warning("Guardrail violation: LLM claimed not eligible when rule engine calculated eligible. Reverting to verified template.")
                return self._generate_local_grounded_fallback(
                    message="",
                    language=language,
                    intent=intent,
                    schemes=schemes,
                    chunks=[],
                    eligibility_result=eligibility_result,
                )

        return raw_answer

    def _detect_and_validate_tour_action(
        self,
        message: str,
        answer: str,
        intent: str,
        eligibility_result: EligibilityResult | None,
    ) -> tuple[str | None, dict[str, Any] | None]:
        """Detect and validate tour actions strictly against the backend allowlist."""
        tours_data = load_tours()
        allowlist = set(tours_data.get("allowlist", []))
        tours_list = tours_data.get("tours", [])
        tour_map = {t["id"]: t for t in tours_list}

        tour_id: str | None = None

        # Check explicit LLM tag: [TOUR_ACTION: upload_income_proof]
        match = re.search(r"\[TOUR_ACTION:\s*([a-zA-Z0-9_\-]+)\]", answer)
        if match:
            candidate = match.group(1).strip()
            if candidate in allowlist:
                tour_id = candidate
            else:
                logger.warning("Stripped disallowed tour ID emitted by model: %s", candidate)

        # If no explicit tag, heuristically match citizen intent
        if not tour_id:
            msg_lower = message.lower()
            if any(w in msg_lower for w in ["upload income", "income proof", "income certificate", "आय प्रमाण पत्र", "ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ"]):
                tour_id = "upload_income_proof"
            elif any(w in msg_lower for w in ["update profile", "complete profile", "set income", "change state", "ಪ್ರೊಫೈಲ್"]):
                tour_id = "complete_profile"
            elif any(w in msg_lower for w in ["missed scheme", "welfare gap", "find schemes for me", "छूटे हुए लाभ"]):
                tour_id = "explore_welfare_gaps"
            elif any(w in msg_lower for w in ["check eligibility", "am i eligible", "पात्रता जांच"]):
                tour_id = "verify_eligibility"
            elif any(w in msg_lower for w in ["family benefit", "family member", "परिवार"]):
                tour_id = "family_optimizer"

        # Validate strictly against allowlist
        if tour_id and tour_id in allowlist and tour_id in tour_map:
            tour_obj = tour_map[tour_id]
            suggested_action = {
                "type": "start_tour",
                "tour_id": tour_id,
                "title": tour_obj.get("title", "Start Guided Tour"),
                "description": tour_obj.get("description", ""),
                "route": tour_obj.get("steps", [{}])[0].get("route", "/dashboard"),
            }
            return tour_id, suggested_action

        return None, None

    def _generate_local_grounded_fallback(
        self,
        message: str,
        language: str,
        intent: str,
        schemes: list[Scheme],
        chunks: list[dict[str, Any]],
        eligibility_result: EligibilityResult | None,
    ) -> str:
        if not schemes:
            return self._insufficient_evidence_response(language).answer

        primary = schemes[0]
        scheme_names = ", ".join(s.name for s in schemes)
        lang = language.lower()
        lang_key = "hi" if lang.startswith("hi") else "kn" if lang.startswith("kn") else "en"
        trans = load_scheme_translations().get(primary.id, {}).get(lang_key) if lang_key != "en" else None

        desc = trans.get("description", primary.description) if trans else primary.description
        benefits = trans.get("benefits", primary.benefits) if trans else primary.benefits
        docs = trans.get("required_documents", primary.required_documents) if trans else primary.required_documents
        steps = trans.get("application_steps", primary.application_steps) if trans else primary.application_steps

        if lang.startswith("hi"):
            lines = [f"**सत्यापित योजना जानकारी: {scheme_names}**\n"]
            if intent == "documents":
                lines.append(f"• **आवश्यक दस्तावेज़**: {', '.join(docs)}")
            elif intent == "benefits":
                lines.append(f"• **मुख्य लाभ**: {'; '.join(benefits)}")
            elif intent == "application":
                lines.append(f"• **आवेदन प्रक्रिया**: {' -> '.join(steps)}")
            elif intent == "website":
                lines.append(f"• **आधिकारिक पोर्टल**: {primary.official_link}")
            else:
                lines.append(f"• **विवरण**: {desc}")
                lines.append(f"• **श्रेणी व दायरा**: {primary.category} (राज्य: {', '.join(primary.state_scope)})")
                lines.append(f"• **लाभ**: {'; '.join(benefits)}")

            if eligibility_result:
                status_hi = "पात्र (Eligible)" if eligibility_result.status == "eligible" else "अपात्र (Not Eligible)" if eligibility_result.status == "not_eligible" else "अधिक जानकारी चाहिए"
                lines.append(f"\n• **नियम-आधारित पात्रता स्थिति**: {status_hi}")
                lines.append(f"• **स्पष्टीकरण**: {eligibility_result.explanation}")
                if eligibility_result.matched:
                    lines.append(f"• **संतुष्ट शर्तें**: {', '.join(eligibility_result.matched)}")
                if eligibility_result.failed:
                    lines.append(f"• **अधूरी शर्तें**: {', '.join(eligibility_result.failed)}")
                if eligibility_result.missing:
                    lines.append(f"• **अनुपलब्ध प्रोफ़ाइल फ़ील्ड**: {', '.join(eligibility_result.missing)}")

            lines.append(f"\n• **आधिकारिक स्रोत**: {primary.source_name} ({primary.official_link})")
            lines.append("• *टिप्पणी*: आवेदन करने से पहले आधिकारिक वेबसाइट पर नियम सत्यापित करें।")
            return "\n".join(lines)

        elif lang.startswith("kn"):
            lines = [f"**ಪರಿಶೀಲಿತ ಯೋಜನೆ ಮಾಹಿತಿ: {scheme_names}**\n"]
            if intent == "documents":
                lines.append(f"• **ಅಗತ್ಯ ದಾಖಲೆಗಳು**: {', '.join(docs)}")
            elif intent == "benefits":
                lines.append(f"• **ಮುಖ್ಯ ಪ್ರಯೋಜನಗಳು**: {'; '.join(benefits)}")
            elif intent == "application":
                lines.append(f"• **ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ**: {' -> '.join(steps)}")
            elif intent == "website":
                lines.append(f"• **ಅಧಿಕೃತ ಪೋರ್ಟಲ್**: {primary.official_link}")
            else:
                lines.append(f"• **ವಿವರಣೆ**: {desc}")
                lines.append(f"• **ವರ್ಗ ಮತ್ತು ವ್ಯಾಪ್ತಿ**: {primary.category} (ರಾಜ್ಯ: {', '.join(primary.state_scope)})")
                lines.append(f"• **ಪ್ರಯೋಜನಗಳು**: {'; '.join(benefits)}")

            if eligibility_result:
                status_kn = "ಅರ್ಹರಾಗಿದ್ದೀರಿ (Eligible)" if eligibility_result.status == "eligible" else "ಅರ್ಹರಲ್ಲ (Not Eligible)" if eligibility_result.status == "not_eligible" else "ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ಬೇಕಾಗಿದೆ"
                lines.append(f"\n• **ನಿಯಮ-ಆಧಾರಿತ ಅರ್ಹತಾ ಮೌಲ್ಯಮಾಪನ**: {status_kn}")
                lines.append(f"• **ವಿವರಣೆ**: {eligibility_result.explanation}")
                if eligibility_result.matched:
                    lines.append(f"• **ಪೂರೈಸಿದ ಷರತ್ತುಗಳು**: {', '.join(eligibility_result.matched)}")
                if eligibility_result.failed:
                    lines.append(f"• **ಅಪೂರ್ಣ ಷರತ್ತುಗಳು**: {', '.join(eligibility_result.failed)}")
                if eligibility_result.missing:
                    lines.append(f"• **ಅಗತ್ಯವಿರುವ ವಿವರಗಳು**: {', '.join(eligibility_result.missing)}")

            lines.append(f"\n• **ಅಧಿಕೃತ ಮೂಲ**: {primary.source_name} ({primary.official_link})")
            lines.append("• *ಟಿಪ್ಪಣಿ*: ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮೊದಲು ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.")
            return "\n".join(lines)

        else:
            lines = [f"**Verified Scheme Information: {scheme_names}**\n"]
            if intent == "documents":
                docs = ", ".join(primary.required_documents)
                lines.append(f"• **Required Documents**: {docs}")
            elif intent == "benefits":
                bens = "; ".join(primary.benefits)
                lines.append(f"• **Key Benefits**: {bens}")
            elif intent == "application":
                steps = " -> ".join(primary.application_steps)
                lines.append(f"• **Application Steps**: {steps}")
            elif intent == "website":
                lines.append(f"• **Official Portal**: {primary.official_link}")
            else:
                lines.append(f"• **Overview**: {primary.description}")
                lines.append(f"• **Category & Scope**: {primary.category} (State: {', '.join(primary.state_scope)})")
                lines.append(f"• **Benefits**: {'; '.join(primary.benefits)}")

            if eligibility_result:
                lines.append(f"\n• **Deterministic Eligibility Evaluation**: {eligibility_result.status.upper()}")
                lines.append(f"• **Engine Explanation**: {eligibility_result.explanation}")
                if eligibility_result.matched:
                    lines.append(f"• **Satisfied Conditions**: {', '.join(eligibility_result.matched)}")
                if eligibility_result.failed:
                    lines.append(f"• **Unmet Conditions**: {', '.join(eligibility_result.failed)}")
                if eligibility_result.missing:
                    lines.append(f"• **Missing Profile Fields**: {', '.join(eligibility_result.missing)}")

            lines.append(f"\n• **Official Source**: {primary.source_name} ({primary.official_link})")
            lines.append("• *Verification Note*: Always verify current guidelines on the official portal before applying.")
            return "\n".join(lines)


chat_service = ChatService()

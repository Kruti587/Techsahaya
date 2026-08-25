import logging
from typing import Any
# pyrefly: ignore [missing-import]
import httpx

from app.core.config import get_settings
from app.models.schemas import ChatResponse, EligibilityProfile, EligibilityResult, Scheme
from app.services.data_loader import load_rules, load_schemes
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

        normalized_message = search_service._normalize_query(message)
        intent = self._detect_intent(message)
        chunks = search_service.search(message, top_k=4, threshold=0.10)

        logger.info("Chat Query: '%s' | Normalized: '%s' | Intent: '%s' | Chunks retrieved: %d",
                    message, normalized_message, intent, len(chunks))

        # Rejection for unsupported / non-scheme queries or empty search results
        if not chunks or self._is_unsupported_query(message, chunks):
            return self._insufficient_evidence_response(language)

        top_score = max((c.get("retrieval_score", 0.0) for c in chunks), default=0.0)
        if top_score < 0.12 and not any(term in message.lower() for term in ["farmer", "student", "worker", "women", "disability", "health", "house", "scheme", "kisan", "yojana"]):
            return self._insufficient_evidence_response(language)

        # Retrieve structured schemes corresponding to retrieved chunks
        scheme_ids = list({chunk["scheme_id"] for chunk in chunks})
        matched_schemes = [self.scheme_map[sid] for sid in scheme_ids if sid in self.scheme_map]

        # Scheme isolation: if query explicitly targets a specific scheme, keep only that scheme
        target_schemes = search_service._detect_target_schemes(message)
        if target_schemes:
            matched_schemes = [s for s in matched_schemes if s.id in target_schemes] or matched_schemes
            chunks = [c for c in chunks if c["scheme_id"] in [s.id for s in matched_schemes]] or chunks

        # Handle Deterministic Eligibility Evaluation
        eligibility_result: EligibilityResult | None = None
        if (intent == "eligibility" or "eligible" in message.lower() or profile is not None) and matched_schemes:
            primary_scheme = matched_schemes[0]
            rule = self.rules.get(primary_scheme.id, {})
            eval_profile = profile or EligibilityProfile()
            eligibility_result = eligibility_engine.evaluate(
                primary_scheme.id, eval_profile, rule, primary_scheme.alternative_scheme_ids
            )

        # Confidence Calculation
        confidence = self._calculate_confidence(chunks, matched_schemes, message)

        # Generate Grounded Answer (Gemini API or Fallback)
        answer = self._generate_grounded_answer(
            message=message,
            language=language,
            intent=intent,
            schemes=matched_schemes,
            chunks=chunks,
            eligibility_result=eligibility_result,
        )

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
            answer=answer,
            schemes=matched_schemes,
            evidence=evidence,
            verification_status=verification_status,
            confidence=confidence,
            offline_ready=True,
        )

    def _detect_intent(self, message: str) -> str:
        msg = message.lower()
        if any(w in msg for w in ["eligible", "eligibility", "can i apply", "qualify", "पात्रता", "ಅರ್ಹತೆ"]):
            return "eligibility"
        if any(w in msg for w in ["document", "documents", "proof", "certificate", "दस्तावेज़", "ದಾಖಲೆಗಳು"]):
            return "documents"
        if any(w in msg for w in ["benefit", "benefits", "money", "amount", "pension", "लाभ", "ಪ್ರಯೋಜನಗಳು"]):
            return "benefits"
        if any(w in msg for w in ["apply", "how to apply", "application", "procedure", "process", "आवेदन", "ಅರ್ಜಿ"]):
            return "application"
        if any(w in msg for w in ["website", "link", "portal", "url", "वेबसाइट", "ಲಿಂಕ್"]):
            return "website"
        if any(w in msg for w in ["schemes", "available", "list", "what scheme", "योजनाएं", "ಯೋಜನೆಗಳು"]):
            return "scheme_discovery"
        return "scheme_explanation"

    def _is_unsupported_query(self, message: str, chunks: list[dict[str, Any]]) -> bool:
        msg = message.lower()
        # Check if user asks about unknown scheme not in database
        unsupported_triggers = ["scheme x", "fake scheme", "crypto scheme", "random scheme"]
        if any(t in msg for t in unsupported_triggers):
            return True
        return False

    def _insufficient_evidence_response(self, language: str) -> ChatResponse:
        lang = language.lower()
        if lang.startswith("hi"):
            answer = "मेरे पास उपलब्ध सत्यापित टेक सहायता (Tech Sahaya) डेटा में इसका सटीक और विश्वसनीय उत्तर देने के लिए पर्याप्त जानकारी नहीं है। कृपया आधिकारिक सरकारी पोर्टल पर जांच करें।"
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
        system_instruction = (
            "You are Sahaya, an AI assistant for navigating Indian government welfare schemes.\n"
            "You MUST answer using ONLY the supplied verified scheme information and retrieved evidence.\n"
            "Never invent: eligibility criteria, benefit amounts, document requirements, application deadlines, "
            "government departments, URLs, application procedures, dates, income limits, or age limits.\n"
            "If the evidence does not contain the requested information, explicitly say that the available verified information is insufficient.\n"
            "Do not treat your general model knowledge as authoritative.\n"
            "For eligibility questions, never make the eligibility decision yourself. Use the deterministic eligibility result supplied in context.\n"
            "Respond entirely in the requested language. Supported languages: English (en), Hindi (hi), Kannada (kn).\n"
            "Translate explanations, labels, conditions, document names, benefits, and next actions into the requested language.\n"
            "Preserve official scheme names (e.g. PM-Kisan), organization names, URLs, and official identifiers where appropriate.\n"
            "Be concise, clear, and citizen-friendly."
        )

        schemes_payload = [
            {
                "name": s.name,
                "category": s.category,
                "state_scope": s.state_scope,
                "benefits": s.benefits,
                "eligibility": s.eligibility,
                "required_documents": s.required_documents,
                "application_steps": s.application_steps,
                "department": s.department,
                "official_link": str(s.official_link),
                "source_name": s.source_name,
            }
            for s in schemes
        ]

        evidence_payload = [{"scheme": c["scheme_name"], "type": c["chunk_type"], "text": c["text"]} for c in chunks]

        eligibility_payload = eligibility_result.model_dump() if eligibility_result else "No profile provided"

        user_prompt = (
            f"USER QUESTION: {message}\n"
            f"REQUESTED LANGUAGE: {language}\n"
            f"DETECTED INTENT: {intent}\n\n"
            f"RELEVANT SCHEMES:\n{schemes_payload}\n\n"
            f"RETRIEVED EVIDENCE:\n{evidence_payload}\n\n"
            f"DETERMINISTIC ELIGIBILITY RESULT:\n{eligibility_payload}\n\n"
            "Please provide a grounded answer following the system instructions."
        )

        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": f"{system_instruction}\n\n{user_prompt}"}],
                }
            ],
            "generationConfig": {
                "temperature": 0.1,
                "maxOutputTokens": 600,
            },
        }

        with httpx.Client(timeout=10.0) as client:
            response = client.post(url, json=payload, headers=headers)
            if response.status_code != 200:
                # Retry with gemini-1.5-flash
                fallback_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
                response = client.post(fallback_url, json=payload, headers=headers)

            if response.status_code == 200:
                data = response.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return parts[0].get("text", "").strip()

        raise RuntimeError("Gemini API response contained no valid text")

    def _generate_local_grounded_fallback(
        self,
        message: str,
        language: str,
        intent: str,
        schemes: list[Scheme],
        chunks: list[dict[str, Any]],
        eligibility_result: EligibilityResult | None,
    ) -> str:
        lang = language.lower()
        msg_lower = message.lower()

        # Handle specific missing-info questions explicitly (e.g. NSP exact income limit)
        if "exact income limit" in msg_lower or "exact amount" in msg_lower:
            if lang.startswith("hi"):
                return (
                    "उपलब्ध टेक सहायता डेटा में इसके लिए सटीक आय सीमा की गारंटी नहीं दी गई है। "
                    "कृपया आवेदन करने से पहले आधिकारिक वेबसाइट पर नवीनतम अधिसूचना की जांच करें।"
                )
            if lang.startswith("kn"):
                return (
                    "ಲಭ್ಯವಿರುವ ಟೆಕ್ ಸಹಾಯ ಡೇಟಾದಲ್ಲಿ ಇದಕ್ಕೆ ನಿಖರವಾದ ಆದಾಯ ಮಿತಿಯ ವಿವರ ಸ್ಪಷ್ಟವಾಗಿ ಉಲ್ಲೇಖವಾಗಿಲ್ಲ. "
                    "ದಯವಿಟ್ಟು ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಮೊದಲು ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಪರಿಶೀಲಿಸಿ."
                )
            return (
                "The available verified Tech Sahaya dataset does not specify the exact threshold for this scheme. "
                "Please verify the specific limit on the official portal before applying."
            )

        if not schemes:
            return self._insufficient_evidence_response(language).answer

        primary = schemes[0]
        scheme_names = ", ".join(s.name for s in schemes[:3])

        # Formulate response by intent & language
        if lang.startswith("hi"):
            lines = [f"**सत्यापित योजना जानकारी: {scheme_names}**\n"]
            if intent == "documents":
                docs = ", ".join(primary.required_documents)
                lines.append(f"• **आवश्यक दस्तावेज़**: {docs}")
            elif intent == "benefits":
                bens = "; ".join(primary.benefits)
                lines.append(f"• **प्रमुख लाभ**: {bens}")
            elif intent == "application":
                steps = " -> ".join(primary.application_steps)
                lines.append(f"• **आवेदन प्रक्रिया**: {steps}")
            elif intent == "website":
                lines.append(f"• **आधिकारिक पोर्टल**: {primary.official_link}")
            else:
                lines.append(f"• **विवरण**: {primary.description}")
                lines.append(f"• **श्रेणी**: {primary.category} (राज्य: {', '.join(primary.state_scope)})")
                lines.append(f"• **मुख्य लाभ**: {'; '.join(primary.benefits)}")

            if eligibility_result:
                lines.append(f"\n• **पात्रता मूल्यांकन स्थिति**: {eligibility_result.status}")
                lines.append(f"• **स्पष्टीकरण**: {eligibility_result.explanation}")
                if eligibility_result.missing:
                    lines.append(f"• **लापता जानकारी**: {', '.join(eligibility_result.missing)}")

            lines.append(f"\n• **आधिकारिक स्रोत**: {primary.source_name} ({primary.official_link})")
            lines.append("• *सत्यापन टिप्पणी*: अंतिम आवेदन से पहले आधिकारिक पोर्टल पर नियमों की पुष्टि करें।")
            return "\n".join(lines)

        elif lang.startswith("kn"):
            lines = [f"**ಪರಿಶೀಲಿತ ಯೋಜನೆ ಮಾಹಿತಿ: {scheme_names}**\n"]
            if intent == "documents":
                docs = ", ".join(primary.required_documents)
                lines.append(f"• **ಅಗತ್ಯ ದಾಖಲೆಗಳು**: {docs}")
            elif intent == "benefits":
                bens = "; ".join(primary.benefits)
                lines.append(f"• **ಮುಖ್ಯ ಪ್ರಯೋಜನಗಳು**: {bens}")
            elif intent == "application":
                steps = " -> ".join(primary.application_steps)
                lines.append(f"• **ಅರ್ಜಿ ವಿಧಾನ**: {steps}")
            elif intent == "website":
                lines.append(f"• **ಅಧಿಕೃತ ಪೋರ್ಟಲ್**: {primary.official_link}")
            else:
                lines.append(f"• **ವಿವರಣೆ**: {primary.description}")
                lines.append(f"• **ವರ್ಗ**: {primary.category} (ರಾಜ್ಯ: {', '.join(primary.state_scope)})")
                lines.append(f"• **ಪ್ರಯೋಜನಗಳು**: {'; '.join(primary.benefits)}")

            if eligibility_result:
                lines.append(f"\n• **ಅರ್ಹತಾ ಮೌಲ್ಯಮಾಪನ ಸ್ಥಿತಿ**: {eligibility_result.status}")
                lines.append(f"• **ವಿವರಣೆ**: {eligibility_result.explanation}")
                if eligibility_result.missing:
                    lines.append(f"• **ಅಗತ್ಯವಿರುವ ಮಾಹಿತಿ**: {', '.join(eligibility_result.missing)}")

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


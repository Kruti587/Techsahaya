from app.models.schemas import ChatResponse, Scheme
from app.services.data_loader import load_schemes
from app.services.search_service import search_service


class ChatService:
    def answer(self, message: str, language: str = "en") -> ChatResponse:
        normalized_message = self._normalize_query(message, language)
        chunks = search_service.search(normalized_message, top_k=3)
        scheme_ids = list({chunk["scheme_id"] for chunk in chunks})
        schemes = [scheme for scheme in load_schemes() if scheme.id in scheme_ids]
        if not chunks:
            if language.lower().startswith("hi"):
                answer = "मेरे पास इसका उत्तर देने के लिए पर्याप्त सत्यापित जानकारी नहीं है।"
            elif language.lower().startswith("kn"):
                answer = "ಇದಕ್ಕೆ ಉತ್ತರಿಸಲು ಸಾಕಷ್ಟು ಪರಿಶೀಲಿತ ಮಾಹಿತಿ ನನ್ನ ಬಳಿ ಇಲ್ಲ."
            else:
                answer = "I don't have enough verified information to answer this."
            return ChatResponse(
                answer=answer,
                schemes=[],
                evidence=[],
                verification_status="insufficient_evidence",
                confidence="low",
            )

        answer = self._mock_generate_answer(normalized_message, schemes, chunks, language)
        evidence = [
            {
                "scheme_name": chunk["scheme_name"],
                "evidence": chunk["text"],
                "source": chunk["source"],
                "chunk_type": chunk["chunk_type"],
            }
            for chunk in chunks
        ]
        return ChatResponse(
            answer=answer,
            schemes=schemes,
            evidence=evidence,
            verification_status="verified_from_source_data",
            confidence="medium",
        )

    def _mock_generate_answer(self, message: str, schemes: list[Scheme], chunks: list[dict], language: str) -> str:
        if any(term in message.lower() for term in ["farmer", "kisan", "agriculture"]):
            names = ", ".join(scheme.name for scheme in schemes[:3]) or "PM-Kisan"
            if language.lower().startswith("hi"):
                return f"किसानों के लिए उपयोगी योजनाओं में {names} शामिल हो सकती हैं। सबसे सही विकल्प के लिए पात्रता जांचें।"
            if language.lower().startswith("kn"):
                return f"ರೈತರಿಗೆ ಉಪಯುಕ್ತ ಯೋಜನೆಗಳು {names}. ದಯವಿಟ್ಟು ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ."
            return f"Schemes that may help farmers include {names}. Check eligibility for the best fit."
        top = schemes[0].name if schemes else chunks[0]["scheme_name"]
        if language.lower().startswith("hi"):
            return f"सत्यापित स्रोत डेटा के आधार पर, {top} आपके प्रश्न से संबंधित लगती है। आवेदन से पहले प्रमाण और आधिकारिक स्रोत देखें।"
        if language.lower().startswith("kn"):
            return f"ಪರಿಶೀಲಿತ ಮೂಲದ ಮಾಹಿತಿಯ ಆಧಾರದ ಮೇಲೆ, {top} ನಿಮ್ಮ ಪ್ರಶ್ನೆಗೆ ಸಂಬಂಧಿಸಿದೆ. ಅರ್ಜಿ ಹಾಕುವ ಮೊದಲು ಸಾಕ್ಷ್ಯ ಮತ್ತು ಅಧಿಕೃತ ಮೂಲ ಪರಿಶೀಲಿಸಿ."
        return f"Based on verified source data, {top} appears relevant to your question. Review the evidence and official source before applying."

    def _normalize_query(self, message: str, language: str) -> str:
        hints = {
            "किसान": "farmer kisan agriculture land",
            "खेती": "farmer agriculture land",
            "छात्र": "student scholarship education",
            "विद्यार्थी": "student scholarship education",
            "महिला": "women girl child ujjwala",
            "दिव्यांग": "disability health support",
            "मजदूर": "worker labour shram",
            "ರೈತ": "farmer kisan agriculture land",
            "ಕೃಷಿ": "farmer agriculture land",
            "ವಿದ್ಯಾರ್ಥಿ": "student scholarship education",
            "ಮಹಿಳೆ": "women girl child ujjwala",
            "ಅಂಗವಿಕಲ": "disability health support",
            "ಕಾರ್ಮಿಕ": "worker labour shram",
        }
        additions = [value for key, value in hints.items() if key in message]
        return f"{message} {' '.join(additions)}".strip()


chat_service = ChatService()

import { Mic, Send } from "lucide-react";
import { useState } from "react";
import { ChatAnswerCard } from "../components/ChatAnswerCard";
import { SectionCard } from "../components/SectionCard";
import { useAppContext } from "../context/AppContext";
import { api } from "../services/api";
import { t } from "../utils/i18n";
import { cleanTextForSpeech } from "../utils/speechUtils";

const languageCodes: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  kn: "kn-IN"
};

const suggestedQuestions: Record<string, string[]> = {
  en: ["What schemes are available for farmers?", "Can I apply for a scholarship?", "Which documents are needed for PM-Kisan?"],
  hi: ["किसानों के लिए कौन सी योजनाएँ उपलब्ध हैं?", "क्या मैं छात्रवृत्ति के लिए आवेदन कर सकता हूँ?", "PM-Kisan के लिए कौन से दस्तावेज़ चाहिए?"],
  kn: ["ರೈತರಿಗೆ ಯಾವ ಯೋಜನೆಗಳು ಲಭ್ಯವಿವೆ?", "ನಾನು ವಿದ್ಯಾರ್ಥಿವೇತನಕ್ಕೆ ಅರ್ಜಿ ಹಾಕಬಹುದೇ?", "PM-Kisan ಗೆ ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು?"]
};

export function AskPage() {
  const { language, setLanguage, offline } = useAppContext();
  const [message, setMessage] = useState("What schemes are available for farmers?");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");
  const [error, setError] = useState("");

  const ask = async (prompt = message) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/chat", { message: prompt, language });
      setResponse(res.data);
    } catch {
      setError("Tech Sahaya could not reach the chat service. You can still browse cached schemes.");
    } finally {
      setLoading(false);
    }
  };

  const askVoice = async (prompt: string) => {
    setLoading(true);
    setVoiceStatus(t(language, "processingVoice"));
    setError("");
    try {
      const res = await api.post("/api/voice-chat", { transcript: prompt, language });
      setResponse(res.data.response);
      setTranscript(res.data.transcript || prompt);

      if ("speechSynthesis" in window && res.data.response?.answer) {
        window.speechSynthesis.cancel();
        const speechText = cleanTextForSpeech(res.data.response.answer);
        if (speechText) {
          const utterance = new SpeechSynthesisUtterance(speechText);
          utterance.lang = languageCodes[language] || "en-IN";
          utterance.rate = 0.9;
          window.speechSynthesis.speak(utterance);
        }
      }
    } catch {
      setError(t(language, "chatError"));
    } finally {
      setLoading(false);
      setVoiceStatus("");
    }
  };

  const startVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(t(language, "voiceUnavailable"));
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = languageCodes[language] || "en-IN";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    setError("");
    setTranscript("");
    setRecording(true);
    setVoiceStatus(t(language, "recording"));
    recognition.onresult = (event: any) => {
      const text = Array.from(event.results).map((result: any) => result[0].transcript).join(" ");
      setTranscript(text);
      setMessage(text);
      const latest = event.results[event.results.length - 1];
      if (latest?.isFinal && text.trim()) {
        setRecording(false);
        void askVoice(text.trim());
      }
    };
    recognition.onerror = () => {
      setRecording(false);
      setVoiceStatus("");
      setError(t(language, "voicePermissionError"));
    };
    recognition.onend = () => {
      setRecording(false);
      setVoiceStatus((current) => current === t(language, "recording") ? "" : current);
    };
    recognition.start();
  };

  const speakAnswer = () => {
    if (!response?.answer || !("speechSynthesis" in window)) {
      setError(t(language, "voiceUnavailable"));
      return;
    }
    window.speechSynthesis.cancel();
    const speechText = cleanTextForSpeech(response.answer);

    if (!speechText) {
      setError("No answer text available to read.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = languageCodes[language] || "en-IN";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };


  const suggestions = suggestedQuestions[language] || suggestedQuestions.en;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <SectionCard title={t(language, "askTitle")}>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <select className="min-h-12 rounded-xl border p-3" value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="kn">Kannada</option>
          </select>
          <button onClick={startVoice} disabled={recording || loading} className={`inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl px-6 text-lg font-bold shadow-sm ${recording ? "bg-red-700 text-white" : "border-2 border-sahaya-green bg-emerald-50 text-sahaya-green"}`}>
            <Mic size={18} /> {recording ? t(language, "recording") : t(language, "tapSpeak")}
          </button>
        </div>
        <p className="mb-4 text-sm text-slate-600">{t(language, "voiceHelp")}</p>
        {recording && (
          <div className="mb-4 flex h-16 items-end gap-1 rounded-2xl border border-red-100 bg-red-50 p-4" aria-label={t(language, "recording")}>
            {[8, 18, 28, 16, 36, 22, 12, 30, 18, 26].map((height, index) => (
              <span key={index} className="w-2 animate-pulse rounded-full bg-red-700" style={{ height }} />
            ))}
          </div>
        )}
        {voiceStatus && !recording && <div className="mb-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-sahaya-green">{voiceStatus}</div>}
        {transcript && <div className="mb-4 rounded-2xl bg-stone-100 p-3 text-sm"><span className="font-semibold">Transcript:</span> {transcript}</div>}
        <div className="flex gap-3">
          <input className="min-h-12 flex-1 rounded-xl border p-3" value={message} onChange={(e) => setMessage(e.target.value)} />
          <button onClick={() => ask()} className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-sahaya-green px-4 text-white"><Send size={18} /> {t(language, "askButton")}</button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {suggestions.map((q) => (
            <button key={q} onClick={() => { setMessage(q); ask(q); }} className="rounded-full border px-3 py-2 text-sm hover:bg-emerald-50 hover:border-emerald-300 transition-colors">{q}</button>
          ))}
        </div>
        {offline && <p className="mt-4 text-sm text-amber-700">{t(language, "offlineChat")}</p>}

        {/* Structured Citizen-Friendly AI Response Card */}
        <div className="mt-6">
          <ChatAnswerCard
            response={response}
            language={language}
            loading={loading}
            error={error}
            onSpeakAnswer={speakAnswer}
            onRetry={() => ask(message)}
          />
        </div>
      </SectionCard>

      <SectionCard title={t(language, "evidenceSource")}>
        <div className="space-y-3">
          {response?.evidence?.map((item: any, index: number) => (
            <div key={`${item.scheme_name}-${index}`} className="rounded-xl border p-3 bg-white">
              <div className="font-medium text-slate-900">{item.scheme_name}</div>
              <div className="mt-1 text-sm text-slate-600 leading-relaxed">{item.evidence}</div>
              <div className="mt-2 text-xs text-slate-500 font-medium">Source: {item.source}</div>
            </div>
          )) || <p className="text-sm text-slate-600">Every answer is grounded in local scheme chunks and cited source metadata.</p>}
        </div>
      </SectionCard>
    </div>
  );
}


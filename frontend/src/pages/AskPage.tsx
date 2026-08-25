import React, { useState, useRef } from "react";
import {
  Compass,
  FileCheck2,
  Mic,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react";
import { ChatAnswerCard } from "../components/ChatAnswerCard";
import { SectionCard } from "../components/SectionCard";
import { useAppContext } from "../context/AppContext";
import { useTour } from "../context/TourContext";
import { api } from "../services/api";
import { t } from "../utils/i18n";
import { cleanTextForSpeech } from "../utils/speechUtils";

const suggestedQuestions: Record<string, string[]> = {
  en: [
    "What schemes are available for farmers in Karnataka?",
    "Can I apply for a scholarship with 1.2 Lakh income?",
    "Which documents are needed to upload for PM-Kisan?",
    "What welfare benefits am I missing?",
  ],
  hi: [
    "किसानों के लिए कौन सी योजनाएँ उपलब्ध हैं?",
    "क्या मैं 1.2 लाख आय के साथ छात्रवृत्ति के लिए आवेदन कर सकता हूँ?",
    "PM-Kisan के लिए कौन से दस्तावेज़ अपलोड करने होंगे?",
    "मुझसे कौन से सरकारी लाभ छूट रहे हैं?",
  ],
  kn: [
    "ಕರ್ನಾಟಕದಲ್ಲಿ ರೈತರಿಗೆ ಯಾವ ಯೋಜನೆಗಳು ಲಭ್ಯವಿವೆ?",
    "1.2 ಲಕ್ಷ ಆದಾಯದೊಂದಿಗೆ ನಾನು ವಿದ್ಯಾರ್ಥಿವೇತನಕ್ಕೆ ಅರ್ಜಿ ಹಾಕಬಹುದೇ?",
    "PM-Kisan ಗೆ ಯಾವ ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಬೇಕು?",
    "ನಾನು ಯಾವ ಸವಲತ್ತುಗಳನ್ನು ಕಳೆದುಕೊಳ್ಳುತ್ತಿದ್ದೇನೆ?",
  ],
};

export function AskPage() {
  const { language, setLanguage, offline, profile } = useAppContext();
  const { startTour } = useTour();

  const [message, setMessage] = useState(suggestedQuestions[language]?.[0] || "What schemes are available for farmers?");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("");
  const [error, setError] = useState("");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const ask = async (prompt = message) => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setAudioBase64(null);
    try {
      const res = await api.post("/api/chat", {
        message: prompt,
        language,
        profile,
      });
      setResponse(res.data);
      if (res.data?.audio_base64) {
        setAudioBase64(res.data.audio_base64);
      }
    } catch (err: any) {
      if (err?.response?.status === 429) {
        const retryAfter = err?.response?.headers?.["retry-after"] || "a few";
        setError(`Rate limit reached. Please wait ${retryAfter} seconds before submitting again.`);
      } else if (err?.response?.status === 401) {
        setError("Your session has expired or authentication is required. Please log in to continue.");
      } else {
        setError(t(language, "chatError"));
      }
    } finally {
      setLoading(false);
    }
  };


  const startVoiceRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(t(language, "voiceUnavailable"));
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        await processVoiceUpload(audioBlob);
      };

      mediaRecorder.start();
      setRecording(true);
      setVoiceStatus(t(language, "recording"));
      setError("");
    } catch {
      setError(t(language, "voicePermissionError"));
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setVoiceStatus("");
    }
  };

  const processVoiceUpload = async (audioBlob: Blob) => {
    setLoading(true);
    setVoiceStatus(t(language, "processingVoice"));
    setError("");
    setAudioBase64(null);

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Data = (reader.result as string).split(",")[1];
      try {
        const res = await api.post("/api/voice-chat", {
          audio_base64: base64Data,
          language,
          profile,
        });

        const data = res.data;
        setTranscript(data.transcript || "");
        setMessage(data.transcript || "");
        setResponse(data.response);

        if (data.audio_base64) {
          setAudioBase64(data.audio_base64);
          playAudio(data.audio_base64);
        } else if ("speechSynthesis" in window && data.response?.answer) {
          // Browser TTS Fallback
          const speechText = cleanTextForSpeech(data.response.answer);
          if (speechText) {
            const utterance = new SpeechSynthesisUtterance(speechText);
            utterance.lang = language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : "en-IN";
            window.speechSynthesis.speak(utterance);
          }
        }
      } catch (err: any) {
        if (err?.response?.status === 429) {
          setError("Rate limit reached. Please wait before asking again.");
        } else if (err?.response?.status === 401) {
          setError("Your session has expired or authentication is required. Please log in to continue.");
        } else {
          setError(t(language, "chatError"));
        }
      } finally {

        setLoading(false);
        setVoiceStatus("");
      }
    };
  };

  const playAudio = (b64Audio: string) => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
    const audio = new Audio(`data:audio/wav;base64,${b64Audio}`);
    audioElementRef.current = audio;
    setAudioPlaying(true);

    audio.onended = () => setAudioPlaying(false);
    audio.onerror = () => setAudioPlaying(false);
    audio.play().catch(() => setAudioPlaying(false));
  };

  const stopAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      setAudioPlaying(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <SectionCard
        title={t(language, "askTitle")}
      >
        <div className="space-y-4">

          {/* Input & Voice Bar */}
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              aria-label="Citizen Question"
              className="flex-1 rounded-2xl border border-stone-200 px-4 py-3.5 text-base focus:border-emerald-600 focus:outline-none shadow-sm"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void ask();
                }
              }}
              placeholder={t(language, "searchPlaceholder")}
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={recording ? stopVoiceRecording : startVoiceRecording}
                className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 font-semibold transition shadow-sm ${
                  recording
                    ? "bg-rose-600 text-white animate-pulse"
                    : "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                }`}
              >
                <Mic size={18} />
                <span>{recording ? "Stop" : t(language, "tapSpeak")}</span>
              </button>

              <button
                type="button"
                onClick={() => void ask()}
                disabled={loading || !message.trim()}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition"
              >
                <Send size={18} />
                <span>{loading ? t(language, "loadingAnswer") : t(language, "askButton")}</span>
              </button>
            </div>
          </div>

          {/* Voice Status & Error Messages */}
          {voiceStatus && (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-medium text-emerald-800 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
              {voiceStatus}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          {/* Suggested Prompt Chips */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Suggested Questions:
            </div>
            <div className="flex flex-wrap gap-2">
              {(suggestedQuestions[language] || suggestedQuestions.en).map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => {
                    setMessage(question);
                    void ask(question);
                  }}
                  className="rounded-xl border border-stone-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800 transition"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Answer & Evidence Display Card */}
      {response && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Spotlight Tour Banner if Suggested */}
          {response.suggested_action && response.suggested_action.tour_id && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <Compass size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-emerald-900">
                    {response.suggested_action.title}
                  </div>
                  <div className="text-xs text-emerald-700">
                    {response.suggested_action.description || "Follow our guided on-screen walkthrough to complete this step."}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => startTour(response.suggested_action.tour_id)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-800 transition shrink-0"
              >
                <Sparkles size={14} />
                Launch Guided Tour
              </button>
            </div>
          )}

          {/* Audio Playback Controls */}
          {audioBase64 && (
            <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Volume2 size={16} className="text-emerald-600" />
                <span>Sarvam AI Multilingual Voice Output</span>
              </div>
              <button
                type="button"
                onClick={audioPlaying ? stopAudio : () => playAudio(audioBase64)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition"
              >
                {audioPlaying ? (
                  <>
                    <Square size={13} className="fill-emerald-700" /> Stop Audio
                  </>
                ) : (
                  <>
                    <Play size={13} className="fill-emerald-700" /> Play Voice
                  </>
                )}
              </button>
            </div>
          )}

          {/* Core Chat Response Card */}
          <ChatAnswerCard response={response} language={language} />
        </div>
      )}
    </div>
  );
}


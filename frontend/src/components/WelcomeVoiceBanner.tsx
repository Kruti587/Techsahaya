import React, { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { api } from "../services/api";
import { useAppContext } from "../context/AppContext";
import { t, getTimeGreetingKey } from "../utils/i18n";
import { languageToBCP47, playExclusiveAudio, speakExclusive, stopAllPlayback } from "../utils/speechUtils";

interface WelcomeVoiceBannerProps {
  autoPlay?: boolean;
  className?: string;
}

export function WelcomeVoiceBanner({ autoPlay = true, className = "" }: WelcomeVoiceBannerProps) {
  const { user, language } = useAppContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasTriggeredInitialRef = useRef(false);

  const greetingKey = getTimeGreetingKey();

  const getGreetingText = () => {
    const greeting = t(language, greetingKey);
    const name = user?.full_name || (language === "hi" ? "नागरिक" : language === "kn" ? "ನಾಗರಿಕ" : "Citizen");
    if (language === "hi") {
      return `${greeting}, ${name}! टेक सहाय में आपका स्वागत है। आपका सुरक्षित नागरिक कल्याण पोर्टल। यहाँ आप सरकारी योजनाएँ खोज सकते हैं और अपनी पात्रता सत्यापित कर सकते हैं।`;
    }
    if (language === "kn") {
      return `${greeting}, ${name}! ಟೆಕ್ ಸಹಾಯಕ್ಕೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮ ಸುರಕ್ಷಿತ ನಾಗರಿಕ ಕಲ್ಯಾಣ ವೇದಿಕೆ. ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ, ನಿಮ್ಮ ಅರ್ಹತೆಯನ್ನು ತಿಳಿದುಕೊಳ್ಳಿ.`;
    }
    if (language === "te") {
      return `${greeting}, ${name}! టెక్ సహాయకు స్వాగతం. ప్రభుత్వ సంక్షೇಮ పథకాలను కనుగొనండి, మీ అర్ಹతను సులಭంగా తెలుసుకోండి.`;
    }
    if (language === "ta") {
      return `${greeting}, ${name}! டெக் சகாயாவிற்கு நல்வரவு. அரசு நலத்திட்டங்களை கண்டறிந்து உங்கள் தகுதியை அறிந்து கொள்ளுங்கள்.`;
    }
    return `${greeting}, ${name}! Welcome to Tech Sahaya. Discover verified government schemes, check your eligibility in simple language, and claim your welfare benefits safely.`;
  };

  const handlePlayVoice = async () => {
    stopAllPlayback();

    // 1. Try Sarvam AI server-side Indian female voice (ishita)
    try {
      const res = await api.post("/api/onboarding/welcome-audio", null, { params: { language } });
      if (res.data?.audio_base64) {
        const player = new Audio(`data:${res.data.audio_mime || "audio/wav"};base64,${res.data.audio_base64}`);
        audioRef.current = player;
        setAudioLoaded(true);
        await playExclusiveAudio(
          player,
          () => setIsPlaying(true),
          () => setIsPlaying(false),
          () => setIsPlaying(false)
        );
        return;
      }
    } catch {
      // Fallback to client-side Speech Synthesis
    }

    // 2. Client-side Speech Synthesis fallback (Female voice preference)
    if ("speechSynthesis" in window) {
      const text = getGreetingText();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = languageToBCP47(language || "en");
      utterance.rate = 0.95;
      utterance.pitch = 1.05; // Slightly higher pitch for clear female voice

      // Try selecting a female voice if available
      try {
        const voices = window.speechSynthesis.getVoices();
        const bcp = utterance.lang.slice(0, 2);
        const femaleVoice = voices.find(
          (v) =>
            v.lang.startsWith(bcp) &&
            (v.name.toLowerCase().includes("female") ||
              v.name.toLowerCase().includes("ishita") ||
              v.name.toLowerCase().includes("sangeeta") ||
              v.name.toLowerCase().includes("leena") ||
              v.name.toLowerCase().includes("zira") ||
              v.name.toLowerCase().includes("veena"))
        );
        if (femaleVoice) {
          utterance.voice = femaleVoice;
        }
      } catch {
        // Use default voice
      }

      speakExclusive(
        utterance,
        () => setIsPlaying(true),
        () => setIsPlaying(false),
        () => setIsPlaying(false)
      );
    }
  };

  const handleStopVoice = () => {
    stopAllPlayback();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      handleStopVoice();
    } else {
      handlePlayVoice();
    }
  };

  // Attempt auto-play and register a 1-time gesture listener if browser blocks autoplay
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setTimeout(() => {
      handlePlayVoice().catch(() => {
        // Autoplay policy prevented immediate playback; wait for first user tap/click
      });
    }, 400);

    const onUserInteraction = () => {
      if (!hasTriggeredInitialRef.current) {
        hasTriggeredInitialRef.current = true;
        handlePlayVoice().catch(() => {});
      }
    };

    window.addEventListener("pointerdown", onUserInteraction, { once: true });
    window.addEventListener("keydown", onUserInteraction, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("pointerdown", onUserInteraction);
      window.removeEventListener("keydown", onUserInteraction);
      stopAllPlayback();
    };
  }, [autoPlay, language]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggle(e as any);
        }
      }}
      className={`group relative overflow-hidden rounded-2xl border transition-all cursor-pointer select-none ${
        isPlaying
          ? "border-emerald-400 bg-gradient-to-r from-emerald-50 via-teal-50 to-white shadow-md ring-2 ring-emerald-400/20"
          : "border-stone-200 bg-white hover:border-emerald-300 hover:shadow-sm"
      } p-4 md:p-5 ${className}`}
      aria-label="Official Voice Assistant Greeting"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Icon & Description */}
        <div className="flex items-center gap-3.5">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all ${
              isPlaying
                ? "bg-emerald-600 text-white shadow-sm scale-105"
                : "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100"
            }`}
          >
            {isPlaying ? (
              <div className="flex items-end gap-0.5 h-4">
                <span className="w-1 bg-white rounded-full animate-[bounce_0.8s_infinite_100ms] h-3" />
                <span className="w-1 bg-white rounded-full animate-[bounce_0.8s_infinite_300ms] h-4" />
                <span className="w-1 bg-white rounded-full animate-[bounce_0.8s_infinite_200ms] h-2" />
                <span className="w-1 bg-white rounded-full animate-[bounce_0.8s_infinite_400ms] h-3.5" />
              </div>
            ) : (
              <Volume2 size={22} />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Official Voice Assistant
              </span>
              {isPlaying && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" /> Speaking
                </span>
              )}
            </div>
            <p className="text-sm font-semibold text-slate-900 mt-0.5">
              {isPlaying
                ? getGreetingText()
                : language === "hi"
                ? "स्वागत आवाज़ संदेश सुनने के लिए यहाँ क्लिक करें"
                : language === "kn"
                ? "ಸ್ವಾಗತ ಧ್ವನಿ ಸಂದೇಶವನ್ನು ಆಲಿಸಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ"
                : "Listen to your official bilingual audio welcome greeting"}
            </p>
          </div>
        </div>

        {/* Right: Audio Waveform / Action Button */}
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <button
              type="button"
              onClick={handleToggle}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-900 border border-emerald-300 hover:bg-emerald-200 transition active:scale-95"
            >
              <VolumeX size={14} className="text-emerald-700" />
              <span>Stop Voice</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleToggle}
              className="inline-flex items-center gap-1.5 rounded-xl bg-stone-100 group-hover:bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-stone-700 group-hover:text-emerald-800 border border-stone-200 group-hover:border-emerald-300 transition shadow-sm active:scale-95"
            >
              <Volume2 size={13} className="text-stone-500 group-hover:text-emerald-700" />
              <span>Voice Enabled</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

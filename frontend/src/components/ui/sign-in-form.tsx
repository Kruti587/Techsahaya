import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Lock, KeyRound, ArrowRight, ShieldCheck, CheckCircle2, Eye, EyeOff, Inbox } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import { t } from "@/utils/i18n";
import { api } from "@/services/api";
import { languageToBCP47 } from "@/utils/speechUtils";

export default function SignInForm() {
  const { login, language } = useAppContext();
  const navigate = useNavigate();

  const [step, setStep] = React.useState<1 | 2>(1); // Step 1: Credentials, Step 2: 2-Step OTP Verification
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [otp, setOtp] = React.useState(["", "", "", "", "", ""]);
  const [remember, setRemember] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [resendTimer, setResendTimer] = React.useState(60);
  const [emailDispatched, setEmailDispatched] = React.useState(false);
  const [dispatchMessage, setDispatchMessage] = React.useState("");

  // OTP resend countdown
  React.useEffect(() => {
    if (step === 2 && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer((t) => t - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, resendTimer]);

  const sendOtpRequest = async (targetEmail: string) => {
    setEmailError("");
    setError("");
    try {
      const resp = await api.post("/api/auth/send-otp", { email: targetEmail });
      setEmailDispatched(Boolean(resp.data?.email_dispatched));
      setDispatchMessage(resp.data?.message || "A 6-digit verification code has been dispatched to your email address.");
      // Zero-leak security: Reset entered OTP digits, never fill from response
      setOtp(["", "", "", "", "", ""]);
      const cooldown = resp.data?.cooldown_seconds ? Number(resp.data.cooldown_seconds) : 60;
      setResendTimer(cooldown);
      return true;
    } catch (err: any) {
      const status = err.response?.status;
      const detail = err.response?.data?.detail;
      const msg = typeof detail === "string" ? detail : (err.message || "Failed to send verification code.");

      if (status === 429) {
        // Cooldown active
        const match = msg.match(/(\d+)\s*seconds/i);
        if (match && match[1]) {
          setResendTimer(parseInt(match[1], 10));
        }
        setError(msg);
      } else if (
        status === 400 &&
        (msg.includes("email") || msg.includes("domain") || msg.includes("mailbox") || msg.includes("disposable") || msg.includes("MX"))
      ) {
        // Phase 1 Email Validation Failure (Syntax / Disposable / DNS MX / Domain Not Found)
        setEmailError(msg);
        setError(msg);
      } else {
        setError(msg);
      }
      return false;
    }
  };

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailError("");

    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    const sent = await sendOtpRequest(email);
    setLoading(false);

    if (sent) {
      setStep(2);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setError("");
    setOtp(["", "", "", "", "", ""]);
    setLoading(true);
    const sent = await sendOtpRequest(email);
    setLoading(false);
    if (sent) {
      setDispatchMessage("A new verification code has been sent to your email.");
    }
    // Refocus first OTP input after resend
    setTimeout(() => {
      document.getElementById("otp-input-0")?.focus();
    }, 100);
  };

  const handleOtpChange = (index: number, val: string) => {
    // Handle multi-digit input (e.g. from autofill or some paste events)
    if (val.length > 1) {
      const digits = val.replace(/\D/g, "").slice(0, 6);
      if (digits.length >= 2) {
        const newOtp = ["", "", "", "", "", ""];
        digits.split("").forEach((d, i) => { if (i < 6) newOtp[i] = d; });
        setOtp(newOtp);
        const focusIdx = Math.min(digits.length, 5);
        document.getElementById(`otp-input-${focusIdx}`)?.focus();
        return;
      }
      val = val.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = val.replace(/\D/g, "");
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\s/g, "").replace(/\D/g, "");
    if (pastedData.length >= 6) {
      const digits = pastedData.slice(0, 6).split("");
      setOtp(digits);
      document.getElementById("otp-input-5")?.focus();
    } else if (pastedData.length > 0) {
      // Partial paste — fill from current position
      const currentIdx = parseInt((e.target as HTMLInputElement).id.replace("otp-input-", "") || "0");
      const newOtp = [...otp];
      pastedData.split("").forEach((d, i) => {
        if (currentIdx + i < 6) newOtp[currentIdx + i] = d;
      });
      setOtp(newOtp);
      const nextIdx = Math.min(currentIdx + pastedData.length, 5);
      document.getElementById(`otp-input-${nextIdx}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
    // Allow arrow navigation
    if (e.key === "ArrowRight" && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handleStep2Verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      // 1. Verify OTP with backend database
      await api.post("/api/auth/verify-otp", { email, otp: enteredOtp });

      // 2. Complete authenticated session login
      const loginError = await login({ email, password, remember_session: remember });
      if (loginError) {
        setLoading(false);
        setError(loginError);
        return;
      }

      // 3. Spoken Audio Welcome
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        let welcomeSpeech = "Welcome to Tech Sahaya. Please complete your citizen profile details to discover and claim your eligible welfare schemes.";
        if (language === "hi") {
          welcomeSpeech = "टेक सहाय में आपका स्वागत है। सरकारी योजनाओं का लाभ लेने के लिए कृपया पहले अपनी प्रोफ़ाइल विवरण भरें।";
        } else if (language === "kn") {
          welcomeSpeech = "ಟೆಕ್ ಸಹಾಯಕ್ಕೆ ಸುಸ್ವಾಗತ. ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಸೌಲಭ್ಯ ಪಡೆಯಲು ದಯವಿಟ್ಟು ಮೊದಲು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.";
        } else if (language === "te") {
          welcomeSpeech = "టెక్ సహాయకు స్వాగతం. ప్రభుత్వ సంక్షేమ పథకాలను కనుగొనడానికి దయచేసి మీ ప్రొఫైల్ వివరాలను పూర్తి చేయండి.";
        } else if (language === "ta") {
          welcomeSpeech = "டெக் சகாயாவிற்கு நல்வரவு. அரசு நலத்திட்டங்களை கண்டறிய உங்கள் சுயவிவர விவரங்களை நிறைவு செய்யவும்.";
        } else if (language === "ml") {
          welcomeSpeech = "ടെക് സഹായയിലേക്ക് സ്വാഗതം. സർക്കാർ ക്ഷേമപദ്ധതികൾ കണ്ടെത്താൻ നിങ്ങളുടെ പ്രൊഫൈൽ പൂർത്തിയാക്കുക.";
        } else if (language === "bn") {
          welcomeSpeech = "টেক সহায়ে আপনাকে স্বাগতম। সরকারি প্রকল্পগুলি আবিষ্কার করতে আপনার প্রোফাইল সম্পূর্ণ করুন।";
        } else if (language === "mr") {
          welcomeSpeech = "टेक सहायामध्ये आपले स्वागत आहे. सरकारी योजनांचा लाभ घेण्यासाठी कृपया आपली प्रोफाईल पूर्ण करा.";
        } else if (language === "gu") {
          welcomeSpeech = "ટેક સહાયમાં સ્વાગત છે. સરકારી કલ્યાણકારી યોજનાઓ મેળવવા માટે કૃપા કરીને તમારી પ્રોફાઇલ પૂર્ણ કરો.";
        }

        const utterance = new SpeechSynthesisUtterance(welcomeSpeech);
        utterance.lang = languageToBCP47(language || "en");
        utterance.rate = 0.95;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }

      sessionStorage.setItem("sahaya_just_logged_in", "true");
      try {
        const profileResponse = await api.get("/api/profile");
        if (!profileResponse.data?.onboarding_completed) {
          navigate("/profile-setup");
        } else {
          const redirect = new URLSearchParams(window.location.search).get("redirect") || "/dashboard";
          navigate(redirect);
        }
      } catch {
        navigate("/profile-setup");
      }
    } catch (err: any) {
      const msg = err.response?.data?.detail || "Verification failed. Please check your code and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md rounded-3xl shadow-xl border border-stone-200 bg-white">
      <CardContent className="p-6 md:p-8 flex flex-col gap-5">
        {step === 1 ? (
          <form onSubmit={handleStep1Submit} className="flex flex-col gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-sahaya-saffron">
                {t(language, "secureCitizenAccess")}
              </span>
              <h2 className="text-2xl font-bold font-serif text-slate-900 mt-1">
                {t(language, "signInTitle")}
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                {t(language, "signInSubtitle")}
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                {error}
              </div>
            )}

            {/* Email with icon */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">{t(language, "emailAddressLabel")} *</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  className={`pl-10 ${emailError ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-20" />
              </div>
              {emailError && (
                <p className="text-[11px] font-medium text-red-600 mt-0.5 flex items-center gap-1">
                  <span className="text-red-500 font-bold">•</span> {emailError}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">{t(language, "passwordLabel")} *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none z-20" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 transition z-20 rounded-md focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(checked) => setRemember(Boolean(checked))}
                />
                <Label htmlFor="remember" className="text-xs font-medium cursor-pointer">
                  {t(language, "rememberMe")}
                </Label>
              </div>
              <Link to="/forgot-password" className="text-xs font-semibold text-sahaya-green hover:underline">
                {t(language, "forgotPasswordLink")}
              </Link>
            </div>

            {/* Submit / Proceed to 2-Step */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-sm font-bold bg-sahaya-green hover:bg-emerald-900 text-white rounded-xl shadow-md mt-1"
            >
              {loading ? t(language, "verifyingSending") : t(language, "continueToVerification")}
            </Button>
          </form>
        ) : (
          /* STEP 2: TWO-STEP VERIFICATION */
          <form onSubmit={handleStep2Verify} className="flex flex-col gap-4 animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-sahaya-green mb-3">
                <ShieldCheck size={26} />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-sahaya-saffron">
                {t(language, "cybersecurityGate")}
              </span>
              <h2 className="text-2xl font-bold font-serif text-slate-900 mt-1">
                {t(language, "twoStepVerification")}
              </h2>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {t(language, "sentSecurityCode")} <br />
                <strong className="font-semibold text-slate-800">{email}</strong>
              </p>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
                {error}
              </div>
            )}

            {/* Security Notice: Code sent to citizen email */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/85 p-4 text-center space-y-1.5 shadow-sm">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 mx-auto">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              </div>
              <p className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                {t(language, "auth.officialCodeSent")}
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">
                {t(language, "auth.officialCodeSentDesc")}
              </p>
            </div>

            {/* 6-Digit OTP input boxes */}
            <div className="my-1">
              <Label className="text-xs font-semibold text-slate-700 block text-center mb-2">
                {t(language, "enter6DigitCode")}
              </Label>
              <div className="flex justify-center gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    autoComplete={idx === 0 ? "one-time-code" : "off"}
                    maxLength={idx === 0 ? 6 : 1}
                    autoFocus={idx === 0}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    className="h-12 w-11 rounded-xl border border-stone-300 text-center font-mono text-lg font-bold text-slate-900 shadow-sm transition focus:border-sahaya-green focus:outline-none focus:ring-2 focus:ring-sahaya-green/20"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>{t(language, "didntReceiveCode")}</span>
              {resendTimer > 0 ? (
                <span className="font-medium text-slate-400">{t(language, "auth.resendIn")} {resendTimer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="font-bold text-sahaya-green hover:underline"
                >
                  {t(language, "resendOtp")}
                </button>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-sm font-bold bg-sahaya-green hover:bg-emerald-900 text-white rounded-xl shadow-md mt-1"
            >
              {loading ? t(language, "verifying") : t(language, "verifyAndSignIn")}
            </Button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 text-center"
            >
              {t(language, "backToLogin")}
            </button>
          </form>
        )}

        {/* Signup Link */}
        <p className="text-center text-xs text-slate-600 border-t border-stone-100 pt-4">
          {t(language, "dontHaveAccount")}{" "}
          <Link to="/signup" className="text-sahaya-green font-bold hover:underline">
            {t(language, "createAccountLink")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

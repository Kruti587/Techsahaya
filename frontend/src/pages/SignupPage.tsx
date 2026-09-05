import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

interface SignupContent {
  title: string;
  subtitle: string;
  requiredNote: string;
  fullName: string;
  fullNamePlaceholder: string;
  email: string;
  password: string;
  confirmPassword: string;
  phonePlaceholder: string;
  strengthLabel: string;
  weak: string;
  medium: string;
  strong: string;
  agreeTerms: string;
  mismatchError: string;
  consentError: string;
  submitBtn: string;
  alreadyHaveAccount: string;
  signIn: string;
}

const SIGNUP_TRANSLATIONS: Record<string, SignupContent> = {
  en: {
    title: "Create your Tech Sahaya account",
    subtitle: "Sign up, review consent, complete profile setup, and continue to your citizen dashboard.",
    requiredNote: "Required field",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your full name",
    email: "Email Address",
    password: "Password",
    confirmPassword: "Confirm Password",
    phonePlaceholder: "Optional phone number",
    strengthLabel: "Password strength",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    agreeTerms: "I agree to the privacy-first terms and consent notice.",
    mismatchError: "Passwords do not match",
    consentError: "You must accept terms and privacy consent",
    submitBtn: "Create Account",
    alreadyHaveAccount: "Already have an account?",
    signIn: "Sign in",
  },
  hi: {
    title: "अपना टेक सहाय खाता बनाएं",
    subtitle: "साइन अप करें, सहमति की समीक्षा करें, प्रोफ़ाइल पूरी करें और अपने नागरिक डैशबोर्ड पर जाएं।",
    requiredNote: "अनिवार्य फ़ील्ड",
    fullName: "पूरा नाम",
    fullNamePlaceholder: "अपना पूरा नाम दर्ज करें",
    email: "ईमेल पता",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    phonePlaceholder: "वैकल्पिक फ़ोन नंबर",
    strengthLabel: "पासवर्ड मजबूती",
    weak: "कमजोर",
    medium: "मध्यम",
    strong: "मजबूत",
    agreeTerms: "मैं गोपनीयता की शर्तों और सहमति सूचना से सहमत हूँ।",
    mismatchError: "पासवर्ड मेल नहीं खाते",
    consentError: "कृपया गोपनीयता और सेवा की शर्तें स्वीकार करें",
    submitBtn: "खाता बनाएं",
    alreadyHaveAccount: "क्या आपके पास पहले से खाता है?",
    signIn: "साइन इन करें",
  },
  kn: {
    title: "ನಿಮ್ಮ ಟೆಕ್ ಸಹಾಯ ಖಾತೆಯನ್ನು ರಚಿಸಿ",
    subtitle: "ಸೈನ್ ಅಪ್ ಮಾಡಿ, ಸಮ್ಮತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ, ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ ಮತ್ತು ನಿಮ್ಮ ನಾಗರಿಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ.",
    requiredNote: "ಕಡ್ಡಾಯ ಕ್ಷೇತ್ರ",
    fullName: "ಪೂರ್ಣ ಹೆಸರು",
    fullNamePlaceholder: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರನ್ನು ನಮೂದಿಸಿ",
    email: "ಇಮೇಲ್ ವಿಳಾಸ",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    confirmPassword: "ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
    phonePlaceholder: "ಐಚ್ಛಿಕ ಫೋನ್ ಸಂಖ್ಯೆ",
    strengthLabel: "ಪಾಸ್‌ವರ್ಡ್ ಸಾಮರ್ಥ್ಯ",
    weak: "ದುರ್ಬಲ",
    medium: "ಮಧ್ಯಮ",
    strong: "ಬಲವಾದ",
    agreeTerms: "ನಾನು ಗೌಪ್ಯತೆ ನಿಯಮಗಳು ಮತ್ತು ಸಮ್ಮತಿ ಸೂಚನೆಯನ್ನು ಒಪ್ಪುತ್ತೇನೆ.",
    mismatchError: "ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ",
    consentError: "ದಯವಿಟ್ಟು ನಿಯಮಗಳು ಮತ್ತು ಗೌಪ್ಯತೆ ಸಮ್ಮತಿಯನ್ನು ಸ್ವೀಕರಿಸಿ",
    submitBtn: "ಖಾತೆ ರಚಿಸಿ",
    alreadyHaveAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ?",
    signIn: "ಸೈನ್ ಇನ್ ಮಾಡಿ",
  },
  te: {
    title: "మీ టెక్ సహాయ ఖాతాను సృష్టించండి",
    subtitle: "సైన్ అప్ చేసి, సమ్మతిని సమీక్షించి, ప్రొఫైల్ పూర్తి చేసి పౌర డ్యాష్‌బోర్డ్‌కు వెళ్లండి.",
    requiredNote: "తప్పనిసరి ఫీల్డ్",
    fullName: "పూర్తి పేరు",
    fullNamePlaceholder: "మీ పూర్తి పేరును నమోదు చేయండి",
    email: "ఈమెయిల్ చిరునామా",
    password: "పాస్‌వర్డ్",
    confirmPassword: "పాస్‌వర్డ్ నిర్ధారించండి",
    phonePlaceholder: "ఐచ్ఛిక ఫోన్ నంబర్",
    strengthLabel: "పాస్‌వర్డ్ బలం",
    weak: "బలహీనమైన",
    medium: "మధ్యస్థ",
    strong: "బలమైన",
    agreeTerms: "నేను గోప్యతా నిబంధనలు మరియు సమ్మతి నోటీసుకు అంగీకరిస్తున్నాను.",
    mismatchError: "పాస్‌వర్డ్‌లు సరిపోలడం లేదు",
    consentError: "మీరు నిబంధనలను అంగీకరించాలి",
    submitBtn: "ఖాతా సృష్టించండి",
    alreadyHaveAccount: "ఇప్పటికే ఖాతా ఉందా?",
    signIn: "సైన్ ఇన్ చేయండి",
  },
  ta: {
    title: "உங்கள் டெக் சகாயா கணக்கை உருவாக்கவும்",
    subtitle: "பதிவு செய்து, ஒப்புதலை மதிப்பாய்வு செய்து, சுயவிவரத்தை முடித்து உங்கள் குடிமக்கள் டாஷ்போர்டைத் தொடரவும்.",
    requiredNote: "தேவையான புலம்",
    fullName: "முழு பெயர்",
    fullNamePlaceholder: "உங்கள் முழு பெயரை உள்ளிடவும்",
    email: "மின்னஞ்சல் முகவரி",
    password: "கடவுச்சொல்",
    confirmPassword: "கடவுச்சொல்லை உறுதிப்படுத்தவும்",
    phonePlaceholder: "விருப்ப தொலைபேசி எண்",
    strengthLabel: "கடவுச்சொல் வலிமை",
    weak: "பலவீனமானது",
    medium: "நடுத்தரமானது",
    strong: "வலுவானது",
    agreeTerms: "தனியுரிமை விதிமுறைகள் மற்றும் ஒப்புதல் அறிவிப்பை ஏற்கிறேன்.",
    mismatchError: "கடவுச்சொற்கள் பொருந்தவில்லை",
    consentError: "தனியுரிமை விதிமுறைகளை நீங்கள் ஏற்க வேண்டும்",
    submitBtn: "கணக்கை உருவாக்கவும்",
    alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    signIn: "உள்நுழையவும்",
  },
  ml: {
    title: "നിങ്ങളുടെ ടെക് സഹായ അക്കൗണ്ട് നിർമ്മിക്കുക",
    subtitle: "സൈൻ അപ്പ് ചെയ്ത്, സമ്മതപത്രം പരിശോധിച്ച്, പ്രൊഫൈൽ പൂർത്തിയാക്കി ഡാഷ്‌ബോർഡിലേക്ക് പോകുക.",
    requiredNote: "നിർബന്ധമായ വിവരങ്ങൾ",
    fullName: "പൂർണ്ണ നാമം",
    fullNamePlaceholder: "നിങ്ങളുടെ പൂർണ്ണ നാമം നൽകുക",
    email: "ഇമെയിൽ വിലാസം",
    password: "പാസ്‌വേഡ്",
    confirmPassword: "പാസ്‌വേഡ് സ്ഥിരീകരിക്കുക",
    phonePlaceholder: "ഫോൺ നമ്പർ (നിർബന്ധമില്ല)",
    strengthLabel: "പാസ്‌വേഡ് ശക്തി",
    weak: "ദുർബലം",
    medium: "ഇടത്തരം",
    strong: "ശക്തം",
    agreeTerms: "സ്വകാര്യതാ നയങ്ങളും നിബന്ധനകളും ഞാൻ അംഗീകരിക്കുന്നു.",
    mismatchError: "പാസ്‌വേഡുകൾ പൊരുത്തപ്പെടുന്നില്ല",
    consentError: "നിങ്ങൾ സ്വകാര്യതാ സമ്മതം നൽകേണ്ടതുണ്ട്",
    submitBtn: "അക്കൗണ്ട് നിർമ്മിക്കുക",
    alreadyHaveAccount: "മുമ്പേ അക്കൗണ്ട് ഉണ്ടോ?",
    signIn: "സൈൻ ഇൻ ചെയ്യുക",
  },
  bn: {
    title: "আপনার টেক সহায় অ্যাকাউন্ট তৈরি করুন",
    subtitle: "সাইন আপ করুন, সম্মতি পর্যালোচনা করুন, প্রোফাইল সম্পূর্ণ করুন এবং আপনার নাগরিক ড্যাশবোর্ডে এগিয়ে যান।",
    requiredNote: "আবশ্যিক ক্ষেত্র",
    fullName: "সম্পূর্ণ নাম",
    fullNamePlaceholder: "আপনার সম্পূর্ণ নাম লিখুন",
    email: "ইমেল ঠিকানা",
    password: "পাসওয়ার্ড",
    confirmPassword: "পাসওয়ার্ড নিশ্চিত করুন",
    phonePlaceholder: "ঐচ্ছিক ফোন নম্বর",
    strengthLabel: "পাসওয়ার্ডের শক্তি",
    weak: "দুর্বল",
    medium: "মাঝারি",
    strong: "শক্তিশালী",
    agreeTerms: "আমি গোপনীয়তা শর্তাবলী এবং সম্মতি বিজ্ঞপ্তিতে সম্মত।",
    mismatchError: "পাসওয়ার্ড মিলছে না",
    consentError: "আপনাকে অবশ্যই গোপনীয়তা সম্মতি গ্রহণ করতে হবে",
    submitBtn: "অ্যাকাউন্ট তৈরি করুন",
    alreadyHaveAccount: "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?",
    signIn: "সাইন ইন করুন",
  },
  mr: {
    title: "आपले टेक सहाया खाते तयार करा",
    subtitle: "साइन अप करा, संमती तपासा, प्रोफाईल पूर्ण करा आणि आपल्या नागरिक डॅशबोर्डवर सुरू ठेवा.",
    requiredNote: "आवश्यक फील्ड",
    fullName: "पूर्ण नाव",
    fullNamePlaceholder: "आपले पूर्ण नाव प्रविष्ट करा",
    email: "ईमेल पत्ता",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड पुष्टी करा",
    phonePlaceholder: "पर्यायी फोन नंबर",
    strengthLabel: "पासवर्ड सामर्थ्य",
    weak: "कमकुवत",
    medium: "मध्यम",
    strong: "मजबूत",
    agreeTerms: "मी गोपनीयता अटी आणि संमती सूचनांशी सहमत आहे.",
    mismatchError: "पासवर्ड जुळत नाहीत",
    consentError: "आपण अटी आणि गोपनीयता संमती स्वीकारणे आवश्यक आहे",
    submitBtn: "खाते तयार करा",
    alreadyHaveAccount: "आधीपासूनच खाते आहे?",
    signIn: "साइन इन करा",
  },
  gu: {
    title: "તમારું ટેક સહાય એકાઉન્ટ બનાવો",
    subtitle: "સાઇન અપ કરો, સંમતિની સમીક્ષા કરો, પ્રોફાઇલ પૂર્ણ કરો અને તમારા નાગરિક ડેશબોર્ડ પર ચાલુ રાખો.",
    requiredNote: "જરૂરી ક્ષેત્ર",
    fullName: "પૂરું નામ",
    fullNamePlaceholder: "તમારું પૂરું નામ દાખલ કરો",
    email: "ઇમેઇલ સરનામું",
    password: "પાસવર્ડ",
    confirmPassword: "પાસવર્ડની પુષ્ટિ કરો",
    phonePlaceholder: "વૈકલ્પિક ફોન નંબર",
    strengthLabel: "પાસવર્ડ મજબૂતી",
    weak: "નબળો",
    medium: "મધ્યમ",
    strong: "મજબૂત",
    agreeTerms: "હું ગોપનીયતા શરતો અને સંમતિ સૂચના સાથે સંમત છું.",
    mismatchError: "પાસવર્ડ મેળ ખાતા નથી",
    consentError: "તમારે શરતો અને ગોપનીયતા સંમતિ સ્વીકારવી આવશ્યક છે",
    submitBtn: "એકાઉન્ટ બનાવો",
    alreadyHaveAccount: "પહેલેથી એકાઉન્ટ છે?",
    signIn: "સાઇન ઇન કરો",
  },
};

export function SignupPage() {
  const { signup, language } = useAppContext();
  const navigate = useNavigate();
  const copy = SIGNUP_TRANSLATIONS[language] || SIGNUP_TRANSLATIONS.en;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ full_name: "", email: "", password: "", confirm: "", preferred_language: language || "en", phone_number: "", consent_given: false });

  const strength = useMemo(() => {
    let score = 0;
    if (form.password.length >= 8) score++;
    if (/[A-Z]/.test(form.password)) score++;
    if (/[a-z]/.test(form.password)) score++;
    if (/\d/.test(form.password)) score++;
    if (/[^A-Za-z0-9]/.test(form.password)) score++;
    return score <= 2 ? copy.weak : score <= 4 ? copy.medium : copy.strong;
  }, [form.password, copy]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center px-4 py-10">
      <div className="mx-auto w-full max-w-2xl rounded-3xl border bg-white p-6 shadow-card">
        <h1 className="text-3xl font-bold font-serif text-slate-900">{copy.title}</h1>
        <p className="mt-2 text-slate-600 text-sm leading-relaxed">{copy.subtitle}</p>
        <p className="mt-1 text-xs text-red-600 font-medium"><span className="text-red-600">*</span> {copy.requiredNote}</p>
        <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={async (e) => {
          e.preventDefault();
          if (form.password !== form.confirm) {
            setError(copy.mismatchError);
            return;
          }
          if (!form.consent_given) {
            setError(copy.consentError);
            return;
          }
          const result = await signup({ full_name: form.full_name, email: form.email, password: form.password, preferred_language: form.preferred_language, phone_number: form.phone_number || undefined, consent_given: form.consent_given });
          if (result) setError(result); else navigate("/login");
        }}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {copy.fullName}
            </label>
            <input className="min-h-12 w-full rounded-xl border px-4 text-sm" placeholder={copy.fullNamePlaceholder} value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {copy.email} <span className="text-red-600 font-bold">*</span>
            </label>
            <div className="relative">
              <input className="min-h-12 w-full rounded-xl border border-stone-300 px-4 pr-8 focus:border-sahaya-green text-sm" placeholder="citizen@example.com *" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <span className="absolute right-3 top-3 text-red-600 font-bold text-sm" title="Required">*</span>
            </div>
          </div>
          <div className="relative">
            <input className="min-h-12 w-full rounded-xl border px-4 pr-12 text-sm" placeholder={copy.password} type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <button type="button" className="absolute right-3 top-3" onClick={() => setShowPassword((s) => !s)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          <div className="relative">
            <input className="min-h-12 w-full rounded-xl border px-4 pr-12 text-sm" placeholder={copy.confirmPassword} type={showConfirm ? "text" : "password"} value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
            <button type="button" className="absolute right-3 top-3" onClick={() => setShowConfirm((s) => !s)}>{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          <input className="min-h-12 rounded-xl border px-4 md:col-span-2 text-sm" placeholder={copy.phonePlaceholder} value={form.phone_number} onChange={(e) => setForm({ ...form, phone_number: e.target.value })} />
          <div className="text-sm text-slate-600 md:col-span-2">{copy.strengthLabel}: <span className="font-semibold">{strength}</span></div>
          <label className="flex items-center gap-2 text-sm md:col-span-2 cursor-pointer">
            <input type="checkbox" checked={form.consent_given} onChange={(e) => setForm({ ...form, consent_given: e.target.checked })} />
            <span>{copy.agreeTerms}</span>
          </label>
          {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700 md:col-span-2">{error}</div>}
          <button className="min-h-12 rounded-xl bg-sahaya-green text-white font-bold text-sm md:col-span-2 hover:bg-emerald-900 transition">{copy.submitBtn}</button>
          <p className="text-sm text-slate-600 md:col-span-2">
            {copy.alreadyHaveAccount}{" "}
            <Link to="/login" className="font-semibold text-sahaya-green underline hover:text-emerald-700">
              {copy.signIn}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

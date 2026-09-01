import { ArrowRight, CheckCircle2, Languages, Mic, ShieldCheck, Users, Search, Clock, FileText, Check, ChevronRight, MessageSquareText, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { api } from "../services/api";

export function DashboardPage() {
  const { profile } = useAppContext();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const { language } = useAppContext();
  const tD = (str: string) => {
    const d: Record<string, any> = {"YOUR GATEWAY TO WELFARE ✨":{"hi":"कल्याण का आपका द्वार ✨","kn":"ಕಲ್ಯಾಣದ ಕಡೆಗೆ ನಿಮ್ಮ ಹೆಬ್ಬಾಗಿಲು ✨","mr":"कल्याणकडे जाणारा आपला मार्ग ✨"},"Discover. Understand. Apply.":{"hi":"खोजें। समझें। आवेदन करें।","kn":"ಹುಡುಕಿ. ಅರ್ಥಮಾಡಿಕೊಳ್ಳಿ. ಅರ್ಜಿ ಸಲ್ಲಿಸಿ.","mr":"शोधा. समजून घ्या. अर्ज करा."},"Find government schemes, check eligibility, and track your progress — all in one place.":{"hi":"सरकारी योजनाएं खोजें, पात्रता जांचें, और अपनी प्रगति को ट्रैक करें — सब कुछ एक ही स्थान पर।","kn":"ಸರ್ಕಾರಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ, ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ, ಮತ್ತು ನಿಮ್ಮ ಪ್ರಗತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ — ಎಲ್ಲವೂ ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ.","mr":"सरकारी योजना शोधा, पात्रता तपासा आणि आपल्या प्रगतीचा मागोवा घ्या — सर्व एकाच ठिकाणी."},"Find Benefits":{"hi":"फायदे खोजें","kn":"ಪ್ರಯೋಜನಗಳನ್ನು ಹುಡುಕಿ","mr":"फायदे शोधा"},"Ask by voice/text":{"hi":"आवाज़/टेक्स्ट से पूछें","kn":"ಧ್ವನಿ/ಪಠ್ಯದಿಂದ ಕೇಳಿ","mr":"आवाज/मजकुराने विचारा"},"Complete profile details":{"hi":"प्रोफ़ाइल विवरण पूरा करें","kn":"ಪ್ರೊಫೈಲ್ ವಿವರಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ","mr":"प्रोफाइल तपशील पूर्ण करा"},"Add age, state and occupation details":{"hi":"आयु, राज्य और व्यवसाय का विवरण जोड़ें","kn":"ವಯಸ್ಸು, ರಾಜ್ಯ और वೃತ್ತಿಯ ವಿವರಗಳನ್ನು ಸೇರಿಸಿ","mr":"वय, राज्य आणि व्यवसायाचा तपशील जोडा"},"Prepare required documents":{"hi":"आवश्यक दस्तावेज़ तैयार करें","kn":"ಅಗತ್ಯ ದಾಖಲೆಗಳನ್ನು ತಯಾರಿಸಿ","mr":"आवश्यक कागदपत्रे तयार करा"},"Add identity and income verification documents":{"hi":"पहचान और आय सत्यापन दस्तावेज़ जोड़ें","kn":"ಗುರುತು ಮತ್ತು ಆದಾಯ ಪರಿಶೀಲನೆ ದಾಖಲೆಗಳನ್ನು ಸೇರಿಸಿ","mr":"ओळख आणि उत्पन्न पडताळणी कागदपत्रे जोडा"},"Check eligibility":{"hi":"पात्रता जांचें","kn":"ಅರ್ಹತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ","mr":"पात्रता तपासा"},"Evaluate schemes that match your profile":{"hi":"अपनी प्रोफ़ाइल से मेल खाने वाली योजनाओं का मूल्यांकन करें","kn":"ನಿಮ್ಮ ಪ್ರೊಫೈಲ್‌ಗೆ ಹೊಂದುವ ಯೋಜನೆಗಳನ್ನು ಮೌಲ್ಯಮಾಪನ ಮಾಡಿ","mr":"आपल्या प्रोफाइलशी जुळणाऱ्या योजनांचे मूल्यमापन करा"},"Explore family benefits":{"hi":"पारिवारिक लाभ खोजें","kn":"ಕುಟುಂಬದ ಪ್ರಯೋಜನಗಳನ್ನು ಅನ್ವೇಷಿಸಿ","mr":"कौटुंबिक फायदे एक्सप्लोर करा"},"Find schemes for your family members":{"hi":"अपने परिवार के सदस्यों के लिए योजनाएं खोजें","kn":"ನಿಮ್ಮ ಕುಟುಂಬದ ಸದಸ್ಯರಿಗಾಗಿ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ","mr":"आपल्या कुटुंबातील सदस्यांसाठी योजना शोधा"},"Recommended for You":{"hi":"आपके लिए अनुशंसित","kn":"ನಿಮಗಾಗಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ","mr":"तुमच्यासाठी शिफारस केलेले"},"Recent Applications":{"hi":"हाल के आवेदन","kn":"ಇತ್ತೀಚಿನ ಅರ್ಜಿಗಳು","mr":"अलीकडील अर्ज"},"Quick Actions":{"hi":"त्वरित कार्य","kn":"ತ್ವರಿತ ಕ್ರಿಯೆಗಳು","mr":"त्वरित कृती"},"Ask Sahaya":{"hi":"सहाया से पूछें","kn":"ಸಹಾಯವನ್ನು ಕೇಳಿ","mr":"सहाया विचारा"},"Upload Documents":{"hi":"दस्तावेज़ अपलोड करें","kn":"ದಾಖಲೆಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ","mr":"कागदपत्रे अपलोड करा"},"Track Application":{"hi":"आवेदन ट्रैक करें","kn":"ಅರ್ಜಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ","mr":"अर्जाचा मागोवा घ्या"},"Need help? Our AI assistant is here to guide you.":{"hi":"मदद चाहिए? हमारा AI सहायक आपका मार्गदर्शन करने के लिए यहाँ है।","kn":"ಸಹಾಯ ಬೇಕೇ? ನಿಮಗೆ ಮಾರ್ಗದರ್ಶನ ನೀಡಲು ನಮ್ಮ AI ಸಹಾಯಕ ಇಲ್ಲಿದ್ದಾನೆ.","mr":"मदत हवी आहे? तुम्हाला मार्गदर्शन करण्यासाठी आमचा एआय सहाय्यक येथे आहे."},"Chat with Sahaya":{"hi":"सहाया के साथ चैट करें","kn":"ಸಹಾಯದೊಂದಿಗೆ ಚಾಟ್ ಮಾಡಿ","mr":"सहाया सोबत चॅट करा"},"View all":{"hi":"सभी देखें","kn":"ಎಲ್ಲವನ್ನೂ ವೀಕ್ಷಿಸಿ","mr":"सर्व पहा"},"Complete your profile to see recommendations.":{"hi":"अनुशंसाएँ देखने के लिए अपनी प्रोफ़ाइल पूरी करें।","kn":"ಶಿಫಾರಸುಗಳನ್ನು ನೋಡಲು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ.","mr":"शिफारसी पाहण्यासाठी तुमचे प्रोफाइल पूर्ण करा."}};
    if (language === 'en' || !d[str] || !d[str][language]) return str;
    return d[str][language];
  };


  useEffect(() => {
    api.get("/api/recommendations").then((res) => setRecommendations(res.data)).catch(() => setRecommendations([]));
  }, [profile]);

  const readiness = Math.min(100, (profile.available_documents?.length || 0) * 15 + (profile.age ? 20 : 0) + (profile.occupation ? 20 : 0) + (profile.state ? 20 : 0));

  const readinessFactors = [
    { label: "Profile details", sub: "Add age and state", ready: Boolean(profile.age && profile.state) },
    { label: "Occupation", sub: "Add occupation", ready: Boolean(profile.occupation) },
    { label: "Documents", sub: "Ready", ready: Boolean(profile.available_documents?.length) },
    { label: "Family", sub: "Add family members", ready: Boolean(profile.family_members?.length) },
  ];

  const steps = [
    { num: 1, title: tD("Complete profile details"), sub: tD("Add age, state and occupation details"), done: Boolean(profile.age && profile.state && profile.occupation) },
    { num: 2, title: tD("Prepare required documents"), sub: tD("Add identity and income verification documents"), done: Boolean(profile.available_documents?.length) },
    { num: 3, title: tD("Check eligibility"), sub: tD("Evaluate schemes that match your profile"), done: recommendations.length > 0 },
    { num: 4, title: tD("Explore family benefits"), sub: tD("Find schemes for your family members"), done: Boolean(profile.family_members?.length) },
  ];

  const completedSteps = steps.filter(s => s.done).length;

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 pb-24">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#e0f2fe] to-[#e8f5e9] p-8 lg:p-12 shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-block rounded-full bg-blue-100/80 px-3 py-1 text-xs font-bold text-blue-800 backdrop-blur-sm">
            {tD("YOUR GATEWAY TO WELFARE ✨")}
          </div>
          <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            {tD("Discover. Understand. Apply.")}
          </h1>
          <p className="mb-8 text-lg text-slate-700">
            {tD("Find government schemes, check eligibility, and track your progress — all in one place.")}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/find-schemes" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-6 font-semibold text-white shadow-md hover:bg-blue-700 transition">
              {tD("Find Benefits")} <ArrowRight size={18} />
            </Link>
            <Link to="/chat" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 font-semibold text-slate-800 shadow-md hover:bg-slate-50 transition">
              <Mic size={18} className="text-slate-500" /> {tD("Ask by voice/text")}
            </Link>
          </div>
        </div>
        
        {/* Decorative Graphic */}
        <div 
          className="absolute -bottom-10 -right-10 opacity-30 lg:opacity-100 mix-blend-multiply pointer-events-none w-[500px] h-[400px] bg-no-repeat bg-contain"
          style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"%2393C5FD\" d=\"M41.7,-74.6C52.4,-67.2,58.3,-51.7,65.3,-38.3C72.3,-24.9,80.5,-13.6,83.1,-1.2C85.7,11.2,82.8,24.7,75.4,36.5C68,48.2,56.1,58.1,43.3,64.3C30.5,70.5,16.7,73.1,3,68.9C-10.7,64.6,-24.5,53.4,-37.2,43.6C-49.9,33.7,-61.5,25.2,-68.8,13.4C-76.1,1.5,-79,-13.7,-75,-26.8C-70.9,-40,-59.8,-51,-47.5,-58.3C-35.3,-65.7,-21.9,-69.5,-7.2,-61C7.5,-52.5,22.2,-31.7,31,-81.9Z\" transform=\"translate(100 100)\" /></svg>')" }}
        />
      </section>

      {/* Stat Cards */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="rounded-full bg-green-100 p-3 text-green-600"><Languages size={24} /></div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Languages</div>
            <div className="text-xl font-bold text-slate-900">3</div>
            <div className="text-xs text-slate-500">English, Hindi, Kannada</div>
          </div>
        </div>
        <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="rounded-full bg-purple-100 p-3 text-purple-600"><ShieldCheck size={24} /></div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Privacy First</div>
            <div className="text-xl font-bold text-slate-900">100%</div>
            <div className="text-xs text-slate-500">Your data, your control</div>
          </div>
        </div>
        <div className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="rounded-full bg-rose-100 p-3 text-rose-600"><Users size={24} /></div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Active Users</div>
            <div className="text-xl font-bold text-slate-900">2.4K+</div>
            <div className="text-xs text-slate-500">Across Karnataka</div>
          </div>
        </div>
        <div className="rounded-2xl border border-orange-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="rounded-full bg-orange-100 p-3 text-orange-600"><Search size={24} /></div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Schemes Available</div>
            <div className="text-xl font-bold text-slate-900">150+</div>
            <div className="text-xs text-slate-500">Central & State</div>
          </div>
        </div>
      </section>

      {/* Predictive Life Events */}
      <section className="rounded-3xl bg-white p-6 shadow-card border border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2"><Sparkles className="text-sahaya-saffron" size={24} /> Predictive Life Events</h2>
        <p className="text-sm text-slate-600 mb-6">Update your life events to instantly discover new government schemes you automatically qualify for.</p>
        
        <div className="grid gap-4 md:grid-cols-3">
          <button 
            onClick={() => {
              // Mock instant predictive alert for SIH Demo
              alert("🎉 CONGRATULATIONS! Based on your new 'Baby Girl' life event, we have automatically added Sukanya Samriddhi Yojana to your Eligible Schemes!\n\nYour profile has been updated.");
              // Actually redirect them to the scheme or eligibility check
              window.location.href = "/schemes/sukanya-samriddhi";
            }}
            className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-pink-200 bg-pink-50 hover:bg-pink-100 transition group"
          >
            <div className="h-12 w-12 rounded-full bg-pink-200 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition">👶</div>
            <div className="font-bold text-pink-900">Just had a baby girl</div>
            <div className="text-xs text-pink-700 mt-1">Tap to update profile</div>
          </button>
          
          <button 
            onClick={() => {
              alert("Based on your 'Crop Loss' event, we have automatically evaluated your profile for PM Fasal Bima Yojana and triggered an emergency assessment.");
            }}
            className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-amber-200 bg-amber-50 hover:bg-amber-100 transition group"
          >
            <div className="h-12 w-12 rounded-full bg-amber-200 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition">🌾</div>
            <div className="font-bold text-amber-900">Crop Failure / Loss</div>
            <div className="text-xs text-amber-700 mt-1">Tap to update profile</div>
          </button>

          <button 
            onClick={() => {
              alert("Based on turning 60, we have automatically added Indira Gandhi National Old Age Pension Scheme to your eligibility checklist.");
            }}
            className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50 hover:bg-blue-100 transition group"
          >
            <div className="h-12 w-12 rounded-full bg-blue-200 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition">🎂</div>
            <div className="font-bold text-blue-900">Turned 60 Years Old</div>
            <div className="text-xs text-blue-700 mt-1">Tap to update profile</div>
          </button>
        </div>
      </section>

      {/* Welfare Readiness & Getting Started */}
      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2"><ArrowRight className="rotate-[-45deg] text-emerald-600" size={20} /> Welfare Readiness</h2>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">You're just a few steps away!</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-8 items-center">
            {/* SVG Circle */}
            <div className="relative flex shrink-0 items-center justify-center">
              <svg className="w-32 h-32 -rotate-90 transform">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="351.8" strokeDashoffset={351.8 - (351.8 * readiness) / 100} className="text-emerald-600 transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-slate-900">{readiness}%</span>
                <span className="text-[10px] uppercase font-semibold text-slate-500 text-center leading-tight">Profile<br/>readiness</span>
              </div>
            </div>
            
            <div className="flex-1 w-full space-y-1">
              {readinessFactors.map((f, i) => (
                <div key={i} className="flex items-center justify-between border-b border-slate-50 last:border-0 py-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className={f.ready ? "text-emerald-600" : "text-slate-300"} />
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{f.label}</div>
                      <div className={`text-xs ${f.ready ? "text-emerald-600 font-medium" : "text-slate-500"}`}>{f.sub}</div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-400" />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between rounded-xl bg-emerald-50/50 p-4">
             <div className="flex items-center gap-3 text-sm text-emerald-800">
               <span className="text-xl">💡</span>
               A complete profile helps us suggest the best schemes for you.
             </div>
             <Link to="/profile" className="text-sm font-semibold text-emerald-700 flex items-center gap-1 hover:underline whitespace-nowrap">
               View full checklist <ArrowRight size={14} />
             </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">🚀 Getting Started</h2>
            <span className="text-sm font-semibold text-emerald-700">{completedSteps}/4 completed</span>
          </div>
          <div className="flex gap-2 mb-6">
            {steps.map(s => (
               <div key={s.num} className={`h-2 flex-1 rounded-full ${s.done ? "bg-emerald-600" : "bg-slate-100"}`} />
            ))}
          </div>
          
          <div className="flex-1 space-y-4">
            {steps.map(s => (
              <div key={s.num} className="flex items-start gap-4">
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${s.done ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {s.done ? <Check size={14} /> : s.num}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-slate-800 text-sm">{s.title}</div>
                  <div className="text-xs text-slate-500">{s.sub}</div>
                </div>
                <Link to={s.num === 1 ? "/profile" : s.num === 2 ? "/documents" : s.num === 3 ? "/eligibility" : "/family"} className={`rounded-lg border px-3 py-1.5 text-xs font-bold ${s.done ? "border-transparent bg-emerald-50 text-emerald-700" : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"}`}>
                  {s.done ? "Done" : "Start"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom 3-Column Grid */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2 text-slate-800"><div className="rounded p-1.5 bg-blue-50 text-blue-600"><FileText size={18} /></div> {tD("Recommended for You")}</h3>
            <Link to="/find-schemes" className="text-xs font-bold text-emerald-700 flex items-center gap-1 hover:underline">{tD("View all")} <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-4 flex-1">
            {recommendations.slice(0,3).map(r => (
              <div key={r.scheme_id} className="flex items-center justify-between border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-50 p-2 text-blue-600 mt-1"><Users size={16} /></div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{r.scheme_name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{r.reason?.substring(0, 40)}...</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400 shrink-0" />
              </div>
            ))}
            {recommendations.length === 0 && <p className="text-sm text-slate-500">{tD("Complete your profile to see recommendations.")}</p>}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2 text-slate-800"><div className="rounded p-1.5 bg-indigo-50 text-indigo-600"><Clock size={18} /></div> {tD("Recent Applications")}</h3>
            <Link to="/journey" className="text-xs font-bold text-emerald-700 flex items-center gap-1 hover:underline">{tD("View all")} <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-4 flex-1">
            {/* Mocked Data for Design */}
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-emerald-50 p-2 text-emerald-600 mt-1"><Users size={16} /></div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">Post Matric Scholarship</div>
                  <div className="text-xs text-slate-500 mt-0.5">Applied on 20 May 2024</div>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">Under Review</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-50 pb-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-50 p-2 text-green-600 mt-1"><Check size={16} /></div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">PM Kisan Samman Nidhi</div>
                  <div className="text-xs text-slate-500 mt-0.5">Approved on 10 May 2024</div>
                </div>
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">Approved</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-orange-50 p-2 text-orange-600 mt-1"><ShieldCheck size={16} /></div>
                <div>
                  <div className="font-bold text-slate-800 text-sm">Gruha Lakshmi Scheme</div>
                  <div className="text-xs text-slate-500 mt-0.5">Applied on 02 May 2024</div>
                </div>
              </div>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">Pending</span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col">
          <h3 className="font-bold flex items-center gap-2 mb-6 text-slate-800"><div className="rounded p-1.5 bg-blue-50 text-blue-600"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div> {tD("Quick Actions")}</h3>
          <div className="space-y-3 flex-1">
            <Link to="/chat" className="flex items-center justify-between rounded-xl bg-slate-50 p-3 hover:bg-slate-100 transition">
              <div className="flex items-center gap-3 font-semibold text-sm text-slate-800">
                <MessageSquareText size={18} className="text-green-600" /> {tD("Ask Sahaya")}
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </Link>
            <Link to="/eligibility" className="flex items-center justify-between rounded-xl bg-slate-50 p-3 hover:bg-slate-100 transition">
              <div className="flex items-center gap-3 font-semibold text-sm text-slate-800">
                <ShieldCheck size={18} className="text-purple-600" /> Check Eligibility
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </Link>
            <Link to="/documents" className="flex items-center justify-between rounded-xl bg-slate-50 p-3 hover:bg-slate-100 transition">
              <div className="flex items-center gap-3 font-semibold text-sm text-slate-800">
                <FileText size={18} className="text-orange-600" /> {tD("Upload Documents")}
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </Link>
            <Link to="/journey" className="flex items-center justify-between rounded-xl bg-slate-50 p-3 hover:bg-slate-100 transition">
              <div className="flex items-center gap-3 font-semibold text-sm text-slate-800">
                <Clock size={18} className="text-blue-600" /> {tD("Track Application")}
              </div>
              <ChevronRight size={16} className="text-slate-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Bottom Bar / Need Help */}
      <div className="fixed bottom-6 left-[50%] lg:left-[calc(50%+130px)] -translate-x-1/2 bg-white border border-slate-200 text-slate-800 rounded-full px-4 py-2 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] flex flex-col sm:flex-row items-center gap-2 sm:gap-4 z-30">
         <div className="text-sm font-bold flex items-center gap-2">
           <div className="bg-blue-100 text-blue-600 rounded-full p-1.5"><MessageSquareText size={16}/></div>
           {tD("Need help? Our AI assistant is here to guide you.")}
         </div>
         <Link to="/chat" className="rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white flex items-center gap-2 hover:bg-blue-700 transition w-full sm:w-auto justify-center">
           {tD("Chat with Sahaya")} <ArrowRight size={14} />
         </Link>
      </div>

    </motion.div>
  );
}

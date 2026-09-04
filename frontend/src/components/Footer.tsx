import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { FooterWaves } from "./FooterWaves";
import { ShieldCheck, Mail, ExternalLink, Sparkles, Bell, CheckCircle2 } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { CookiePolicyModal } from "./CookiePolicyModal";
import { PrivacyPolicyModal } from "./PrivacyPolicyModal";
import { AccessibilityModal } from "./AccessibilityModal";
import { CookiePreferencesModal } from "./CookiePreferencesModal";
import { ComposeEmailCard } from "./ComposeEmailCard";

export function Footer() {
  const { language } = useAppContext();
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notified, setNotified] = useState(false);

  // Modals state
  const [cookieOpen, setCookieOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [cookiePrefsOpen, setCookiePrefsOpen] = useState(false);

  const handleOpenEmail = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-support-email"));
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail.trim()) return;

    setNotified(true);
    // Open compose email prefilled with notification signup request
    window.dispatchEvent(
      new CustomEvent("open-support-email", {
        detail: {
          email: notifyEmail,
          subject: `Scheme Notification Enrollment — ${notifyEmail}`,
        },
      })
    );

    setTimeout(() => {
      setNotifyEmail("");
    }, 2500);
  };

  return (
    <footer className="relative w-full overflow-hidden bg-[#0b1f18] text-[#f1f5f9] pt-12 border-t border-emerald-900/30">
      {/* Modal Dialogs */}
      <CookiePolicyModal
        isOpen={cookieOpen}
        onClose={() => setCookieOpen(false)}
        onOpenPreferences={() => setCookiePrefsOpen(true)}
      />
      <PrivacyPolicyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
      />
      <AccessibilityModal
        isOpen={accessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
      />
      <CookiePreferencesModal
        isOpen={cookiePrefsOpen}
        onClose={() => setCookiePrefsOpen(false)}
      />
      {/* ComposeEmailCard lives here inside Footer, not globally blocking UI */}
      <ComposeEmailCard />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top grid: brand col + nav columns */}
        <div className="grid grid-cols-1 gap-10 pb-12 border-b border-white/10 lg:grid-cols-[1.2fr_1.8fr]">
          {/* Brand / Contact & Notify Me Form */}
          <div className="space-y-5">
            <Link to="/" className="inline-flex items-center gap-3 text-white">
              <Logo size={42} />
              <div>
                <span className="font-bold text-xl tracking-tight text-white block">
                  Tech Sahaya
                </span>
                <span className="text-xs text-emerald-400 font-medium tracking-wide block">
                  Public-Service Welfare Platform
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Empowering citizens with explainable, privacy-preserving access to government
              welfare schemes across India. Designed to support digital trust and cyber security
              compliance under the DPDP Act.
            </p>

            <div className="text-xs text-slate-300 space-y-1">
              <p>
                <strong className="text-white">Headquarters:</strong> National Informatics Center &amp; Citizen Help Desk, Bengaluru, Karnataka, India
              </p>
            </div>

            {/* Notify Me Feature with Mail Integration */}
            <div className="rounded-2xl border border-emerald-600/30 bg-emerald-950/40 p-4 max-w-md">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300">
                <Bell size={14} className="text-sahaya-saffron" />
                <span>Get Scheme &amp; Renewal Notifications</span>
              </div>
              <p className="mt-1 text-xs text-slate-300">
                Never miss newly announced schemes, application deadlines, or renewal dates.
              </p>
              <form onSubmit={handleNotifySubmit} className="mt-3 flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address *"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  className="flex-1 rounded-xl border border-emerald-700/50 bg-white/10 px-3.5 py-2 text-xs text-white placeholder:text-slate-400 outline-none focus:border-sahaya-saffron focus:ring-1 focus:ring-sahaya-saffron"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-sahaya-saffron px-4 py-2 text-xs font-bold text-white shadow hover:bg-amber-600 active:scale-95 transition"
                >
                  <Mail size={14} />
                  <span>Notify Me</span>
                </button>
              </form>
              {notified && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-300 font-medium animate-fade-in">
                  <CheckCircle2 size={13} />
                  <span>Notification enrollment requested! Opening support composer...</span>
                </div>
              )}
            </div>

            {/* Official Support Email */}
            <div className="pt-1 text-xs text-slate-300 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <strong className="text-white">Email Support:</strong>
                <a
                  href="mailto:support@techsahaya.gov.in"
                  className="text-emerald-400 hover:text-emerald-300 font-medium underline"
                >
                  support@techsahaya.gov.in
                </a>
                <button
                  type="button"
                  onClick={handleOpenEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-800/70 text-emerald-200 border border-emerald-600/40 hover:bg-sahaya-saffron hover:text-white hover:border-sahaya-saffron transition"
                  title="Open Support Mail Composer"
                >
                  <Sparkles size={12} />
                  <span>Quick Compose</span>
                </button>
              </div>
            </div>
          </div>

          {/* ALL Nav columns retained: Schemes, Services, Product, Trust & Your Choices */}
          <nav className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm" aria-label="Footer navigation">
            {/* Column 1: Benefits & Schemes */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 font-mono">
                Benefits &amp; Schemes
              </h3>
              <ul className="space-y-2 text-xs">
                <li><Link to="/schemes" className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block">PM-KISAN Samman</Link></li>
                <li><Link to="/schemes" className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block">Ayushman Bharat (PM-JAY)</Link></li>
                <li><Link to="/schemes" className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block">PM Awas Yojana (PMAY)</Link></li>
                <li><Link to="/schemes" className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block">MGNREGA Scheme</Link></li>
                <li><Link to="/schemes" className="text-emerald-400 font-semibold hover:underline inline-block mt-1">Explore Schemes &rarr;</Link></li>
              </ul>
            </div>

            {/* Column 2: Citizen Services */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 font-mono">
                Citizen Services
              </h3>
              <ul className="space-y-2 text-xs">
                <li><Link to="/eligibility" className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block">Eligibility Checker</Link></li>
                <li><Link to="/welfare-gaps" className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block">Welfare Gaps Report</Link></li>
                <li><Link to="/documents" className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block">DigiLocker Verification</Link></li>
                <li><Link to="/what-if" className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block">What-If Simulation</Link></li>
                <li><Link to="/journey" className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block">Interactive Roadmap</Link></li>
              </ul>
            </div>

            {/* Column 3: PRODUCT */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 font-mono">
                PRODUCT
              </h3>
              <ul className="space-y-2 text-xs">
                <li><Link to="/how-it-works" className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block">How it works</Link></li>
                <li><Link to="/schemes" className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block">Schemes</Link></li>
                <li><Link to="/security" className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block">Security</Link></li>
                <li><Link to="/about" className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block">About Tech Sahaya</Link></li>
              </ul>
            </div>

            {/* Column 4: TRUST */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 font-mono">
                TRUST
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => setCookieOpen(true)}
                    className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block text-left"
                  >
                    Cookie policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setPrivacyOpen(true)}
                    className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block text-left"
                  >
                    Privacy policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setAccessibilityOpen(true)}
                    className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block text-left"
                  >
                    Accessibility
                  </button>
                </li>
                <li>
                  <Link to="/security" className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block">
                    DPDP Compliance
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 5: YOUR CHOICES */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 font-mono">
                YOUR CHOICES
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => setCookiePrefsOpen(true)}
                    className="text-emerald-300 hover:text-emerald-200 transition underline font-semibold text-left"
                  >
                    Manage cookie preferences
                  </button>
                </li>
                <li>
                  <Link to="/consent" className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block">
                    Consent Framework
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Bottom bar with Social Icons and Legal Links (No duplicate back to top!) */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            &copy; 2026 Tech Sahaya. Digital Public Good for Citizen Welfare &amp; Cybersecurity.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            {/* Social icons: LinkedIn & Gmail for Support */}
            <div className="flex items-center gap-3">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-300 hover:bg-[#0a66c2] hover:text-white hover:border-[#0a66c2] transition shadow-sm"
                aria-label="LinkedIn Support"
                title="LinkedIn Support"
              >
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.45 1.45 0 1 0 0 2.9 1.45 1.45 0 0 0 0-2.9Z" />
                </svg>
              </a>

              <button
                type="button"
                onClick={handleOpenEmail}
                className="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-300 hover:bg-[#ea4335] hover:text-white hover:border-[#ea4335] transition shadow-sm"
                aria-label="Gmail Support / Compose Email"
                title="Gmail Support / Compose Email"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </button>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition shadow-sm"
                aria-label="Twitter/X"
                title="Twitter/X"
              >
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="h-8 w-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-300 hover:bg-slate-700 hover:text-white transition shadow-sm"
                aria-label="GitHub"
                title="GitHub"
              >
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
                </svg>
              </a>
            </div>

            {/* Legal policy shortcuts */}
            <div className="flex items-center gap-4">
              <button onClick={() => setPrivacyOpen(true)} className="hover:text-white transition">
                Privacy Policy
              </button>
              <button onClick={() => setCookieOpen(true)} className="hover:text-white transition">
                Cookie Policy
              </button>
              <button onClick={() => setAccessibilityOpen(true)} className="hover:text-white transition">
                Accessibility
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Ticker Strip */}
      <div className="w-full overflow-hidden whitespace-nowrap py-3.5 border-t border-white/5 bg-[#071712] relative z-10">
        <div className="inline-flex items-center gap-6 text-xs font-bold tracking-widest uppercase text-slate-400 animate-marquee-concepts">
          <span>PM-KISAN Samman Nidhi</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>Ayushman Bharat PM-JAY</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>Pradhan Mantri Awas Yojana</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>DigiLocker Verified Documents</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>DPDP Privacy By Design</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>9 Official Indian Languages</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>Direct Benefit Transfer (DBT)</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>Ration Card Watermark Verification</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>Social Audit &amp; Accountability</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          {/* Loop duplicate */}
          <span>PM-KISAN Samman Nidhi</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>Ayushman Bharat PM-JAY</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>Pradhan Mantri Awas Yojana</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>DigiLocker Verified Documents</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>DPDP Privacy By Design</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>9 Official Indian Languages</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
          <span>Direct Benefit Transfer (DBT)</span>
          <span className="text-sahaya-saffron font-extrabold">&bull;</span>
        </div>
      </div>

      {/* Animated waves (flush at bottom) */}
      <FooterWaves />
    </footer>
  );
}

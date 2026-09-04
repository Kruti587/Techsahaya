import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { FooterWaves } from "./FooterWaves";
import { ShieldCheck, Mail, ExternalLink, Sparkles, ArrowUp, Bell, CheckCircle2 } from "lucide-react";
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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
        <div className="grid grid-cols-1 gap-10 pb-12 border-b border-white/10 lg:grid-cols-[1.3fr_1.7fr]">
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
            <div className="pt-2 text-xs text-slate-300 space-y-2">
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

          {/* 3 Nav columns matching user screenshots: PRODUCT | TRUST | YOUR CHOICES */}
          <nav className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm" aria-label="Footer navigation">
            {/* Column 1: PRODUCT */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 font-mono">
                PRODUCT
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/how-it-works"
                    className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block"
                  >
                    How it works
                  </Link>
                </li>
                <li>
                  <Link
                    to="/schemes"
                    className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block"
                  >
                    Schemes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/security"
                    className="text-slate-300 hover:text-white transition hover:translate-x-1 inline-block"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: TRUST */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 font-mono">
                TRUST
              </h3>
              <ul className="space-y-3">
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
              </ul>
            </div>

            {/* Column 3: YOUR CHOICES */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4 font-mono">
                YOUR CHOICES
              </h3>
              <ul className="space-y-3">
                <li>
                  <button
                    type="button"
                    onClick={() => setCookiePrefsOpen(true)}
                    className="text-emerald-300 hover:text-emerald-200 transition underline font-medium text-left"
                  >
                    Manage cookie preferences
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Back to top button in the middle */}
        <div className="flex items-center justify-center py-5 border-b border-white/10">
          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 rounded-full border border-emerald-600/40 bg-emerald-900/60 px-6 py-2.5 text-xs font-bold text-emerald-200 shadow hover:bg-sahaya-green hover:text-white hover:border-emerald-400 transition active:scale-95"
          >
            <ArrowUp size={15} className="transition-transform group-hover:-translate-y-0.5 text-sahaya-saffron" />
            <span>Back to top</span>
          </button>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-6 gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            &copy; 2026 Tech Sahaya. Digital Public Good for Citizen Welfare &amp; Cybersecurity.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            {/* Support links */}
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
              <button onClick={handleOpenEmail} className="hover:text-emerald-300 transition">
                Email Support
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

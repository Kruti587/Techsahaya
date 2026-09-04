import { CookiePolicyModal } from "../components/CookiePolicyModal";
import { CookiePreferencesModal } from "../components/CookiePreferencesModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function CookiePolicyPage() {
  const navigate = useNavigate();
  const [prefsOpen, setPrefsOpen] = useState(false);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <CookiePolicyModal
        isOpen={true}
        onClose={() => navigate(-1)}
        onOpenPreferences={() => setPrefsOpen(true)}
      />
      <CookiePreferencesModal
        isOpen={prefsOpen}
        onClose={() => setPrefsOpen(false)}
      />
    </div>
  );
}

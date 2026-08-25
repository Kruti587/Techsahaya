import { useNavigate } from "react-router-dom";
import { ProfileForm } from "../components/ProfileForm";
import { api } from "../services/api";
import { useAppContext } from "../context/AppContext";

export function ProfileSetupPage() {
  const { profile, setProfile, language } = useAppContext();
  const navigate = useNavigate();
  return (
    <div className="rounded-3xl bg-white p-6 shadow-card">
      <h1 className="text-3xl font-bold">Profile Setup</h1>
      <p className="mt-2 text-slate-600">Complete only the information needed for eligibility and recommendations.</p>
      <div className="mt-6">
        <ProfileForm initialValue={profile} submitLabel="Save and continue" onSubmit={async (nextProfile) => {
          setProfile(nextProfile);
          await api.put("/api/profile", { ...nextProfile, preferred_language: language, consent_given: true });
          navigate("/dashboard");
        }} />
      </div>
    </div>
  );
}

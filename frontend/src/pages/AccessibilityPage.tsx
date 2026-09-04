import { AccessibilityModal } from "../components/AccessibilityModal";
import { useNavigate } from "react-router-dom";

export function AccessibilityPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <AccessibilityModal
        isOpen={true}
        onClose={() => navigate(-1)}
      />
    </div>
  );
}

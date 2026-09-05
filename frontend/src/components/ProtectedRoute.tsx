import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import type { Role } from "../types";

export function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, token, profile } = useAppContext();
  const location = useLocation();

  if (!token || !user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Mandatory Profile Onboarding Gate:
  // Citizen users cannot access dashboard, documents, schemes, etc. until onboarding is completed.
  if (
    user.role === "citizen" &&
    !profile?.onboarding_completed &&
    location.pathname !== "/profile-setup" &&
    location.pathname !== "/consent"
  ) {
    return <Navigate to="/profile-setup" replace />;
  }

  return children;
}

export function RoleProtectedRoute({ children, roles }: { children: React.ReactElement; roles: Role[] }) {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) {
    return <Navigate to="/access-restricted" replace />;
  }
  return children;
}

import { Navigate, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import type { Role } from "../types";

export function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, token } = useAppContext();
  const location = useLocation();
  if (!token || !user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
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

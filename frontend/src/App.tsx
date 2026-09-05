import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { AppShell } from "./components/AppShell";
import { ProtectedRoute, RoleProtectedRoute } from "./components/ProtectedRoute";
import { PublicLayout } from "./components/PublicLayout";
import { TechSahayaLoader } from "./components/TechSahayaLoader";
import { AboutPage } from "./pages/AboutPage";
import { CookiePolicyPage } from "./pages/CookiePolicyPage";
import { AccessibilityPage } from "./pages/AccessibilityPage";
import { AccessRestrictedPage } from "./pages/AccessRestrictedPage";
import { AdminAuditPage } from "./pages/AdminAuditPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminRulesPage } from "./pages/AdminRulesPage";
import { AdminSchemesPage } from "./pages/AdminSchemesPage";
import { AdminSourcesPage } from "./pages/AdminSourcesPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { AskPage } from "./pages/AskPage";
import { CscDashboardPage } from "./pages/CscDashboardPage";
import { CscSessionPage } from "./pages/CscSessionPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DocumentsPage } from "./pages/DocumentsPage";
import { EligibilityPage } from "./pages/EligibilityPage";
import { FamilyPage } from "./pages/FamilyPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { HomePage } from "./pages/HomePage";
import { HowItWorksPage } from "./pages/HowItWorksPage";
import { JourneyPage } from "./pages/JourneyPage";
import { LoginPage } from "./pages/LoginPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ProfileSetupPage } from "./pages/ProfileSetupPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { SchemeDetailsPage } from "./pages/SchemeDetailsPage";
import { SchemesPage } from "./pages/SchemesPage";
import { SecurityPage } from "./pages/SecurityPage";
import { SignupPage } from "./pages/SignupPage";
import { WelfareGapsPage } from "./pages/WelfareGapsPage";
import { WhatIfPage } from "./pages/WhatIfPage";
import { ConsentPage } from "./pages/ConsentPage";
import { DpdpPage } from "./pages/DpdpPage";

export default function App() {
  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    // Show the branded loader for 1.8s on cold start
    const timer = setTimeout(() => setAppLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (appLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fcfbf9] app-loader-screen">
        <div className="flex flex-col items-center gap-6 animate-fade-in">
          {/* Branded wordmark */}
          <div className="text-center">
            <div className="text-3xl font-extrabold tracking-tight text-slate-900 font-serif">Tech Sahaya</div>
            <div className="text-xs text-slate-500 font-medium tracking-widest uppercase mt-1">Digital Citizen Welfare</div>
          </div>
          <TechSahayaLoader size={90} text="Loading" />
        </div>
        <div
          className="absolute inset-0 pointer-events-none app-loader-fade"
          style={{ animation: "appLoaderFadeOut 0.5s ease-in 1.3s forwards", opacity: 0 }}
        />
      </div>
    );
  }

  return (
    <>
      <Routes>
      <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
      <Route path="/how-it-works" element={<PublicLayout><HowItWorksPage /></PublicLayout>} />
      <Route path="/schemes" element={<PublicLayout><SchemesPage /></PublicLayout>} />
      <Route path="/schemes/:schemeId" element={<PublicLayout><SchemeDetailsPage /></PublicLayout>} />
      <Route path="/security" element={<PublicLayout><SecurityPage /></PublicLayout>} />
      <Route path="/privacy-policy" element={<PublicLayout><PrivacyPage /></PublicLayout>} />
      <Route path="/cookies" element={<PublicLayout><CookiePolicyPage /></PublicLayout>} />
      <Route path="/cookie-policy" element={<PublicLayout><CookiePolicyPage /></PublicLayout>} />
      <Route path="/accessibility" element={<PublicLayout><AccessibilityPage /></PublicLayout>} />
      <Route path="/dpdp" element={<PublicLayout><DpdpPage /></PublicLayout>} />
      <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
      <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
      <Route path="/signup" element={<PublicLayout><SignupPage /></PublicLayout>} />
      <Route path="/forgot-password" element={<PublicLayout><ForgotPasswordPage /></PublicLayout>} />
      <Route path="/access-restricted" element={<PublicLayout><AccessRestrictedPage /></PublicLayout>} />

      <Route path="/consent" element={<ProtectedRoute><AppShell><ConsentPage /></AppShell></ProtectedRoute>} />
      <Route path="/consent-framework" element={<ProtectedRoute><AppShell><ConsentPage /></AppShell></ProtectedRoute>} />
      <Route path="/roadmap" element={<ProtectedRoute><AppShell><JourneyPage /></AppShell></ProtectedRoute>} />
      <Route path="/profile-setup" element={<ProtectedRoute><AppShell><ProfileSetupPage /></AppShell></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><AppShell><DashboardPage /></AppShell></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><AppShell><AskPage /></AppShell></ProtectedRoute>} />
      <Route path="/find-schemes" element={<ProtectedRoute><AppShell><SchemesPage /></AppShell></ProtectedRoute>} />
      <Route path="/eligibility" element={<ProtectedRoute><AppShell><EligibilityPage /></AppShell></ProtectedRoute>} />
      <Route path="/welfare-gaps" element={<ProtectedRoute><AppShell><WelfareGapsPage /></AppShell></ProtectedRoute>} />
      <Route path="/family" element={<ProtectedRoute><AppShell><FamilyPage /></AppShell></ProtectedRoute>} />
      <Route path="/what-if" element={<ProtectedRoute><AppShell><WhatIfPage /></AppShell></ProtectedRoute>} />
      <Route path="/journey" element={<ProtectedRoute><AppShell><JourneyPage /></AppShell></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><AppShell><DocumentsPage /></AppShell></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AppShell><ProfilePage /></AppShell></ProtectedRoute>} />
      <Route path="/privacy" element={<ProtectedRoute><AppShell><PrivacyPage /></AppShell></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><AppShell><NotificationsPage /></AppShell></ProtectedRoute>} />

      <Route path="/csc/dashboard" element={<RoleProtectedRoute roles={["csc_operator"]}><AppShell><CscDashboardPage /></AppShell></RoleProtectedRoute>} />
      <Route path="/csc/citizen-session" element={<RoleProtectedRoute roles={["csc_operator"]}><AppShell><CscSessionPage /></AppShell></RoleProtectedRoute>} />

      <Route path="/admin/dashboard" element={<RoleProtectedRoute roles={["admin"]}><AppShell><AdminDashboardPage /></AppShell></RoleProtectedRoute>} />
      <Route path="/admin/schemes" element={<RoleProtectedRoute roles={["admin"]}><AppShell><AdminSchemesPage /></AppShell></RoleProtectedRoute>} />
      <Route path="/admin/rules" element={<RoleProtectedRoute roles={["admin"]}><AppShell><AdminRulesPage /></AppShell></RoleProtectedRoute>} />
      <Route path="/admin/sources" element={<RoleProtectedRoute roles={["admin"]}><AppShell><AdminSourcesPage /></AppShell></RoleProtectedRoute>} />
      <Route path="/admin/users" element={<RoleProtectedRoute roles={["admin"]}><AppShell><AdminUsersPage /></AppShell></RoleProtectedRoute>} />
      <Route path="/admin/audit" element={<RoleProtectedRoute roles={["admin"]}><AppShell><AdminAuditPage /></AppShell></RoleProtectedRoute>} />
    </Routes>
    </>
  );
}


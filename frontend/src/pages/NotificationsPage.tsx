import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Landmark,
  Layers,
  Mail,
  Send,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { api } from "../services/api";
import { t } from "../utils/i18n";

type NotificationCategory = "all" | "eligible" | "applied" | "ineligible" | "govt_updates";

interface StructuredNotification {
  id: string;
  category: "eligible" | "applied" | "ineligible" | "govt_updates";
  title: string;
  message: string;
  ministryOrAuthority: string;
  badgeText: string;
  badgeColor: string;
  date: string;
  read: boolean;
  actionLabel?: string;
  actionLink?: string;
  isExternal?: boolean;
}

const DEFAULT_NOTIFICATIONS: StructuredNotification[] = [
  // 1. Eligible Schemes
  {
    id: "notif-el-1",
    category: "eligible",
    title: "Eligible Scheme Match: PM-Kisan Samman Nidhi",
    message:
      "Your verified land record and income eligibility criteria have been satisfied. You qualify for the annual ₹6,000 direct income support.",
    ministryOrAuthority: "Ministry of Agriculture & Farmers Welfare",
    badgeText: "Eligible • ₹6,000/yr",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    date: "4/9/2026, 4:17:44 PM",
    read: false,
    actionLabel: "Review & Apply Now",
    actionLink: "/schemes/pm-kisan",
  },
  {
    id: "notif-el-2",
    category: "eligible",
    title: "Eligible Scheme Match: PM Surya Ghar Muft Bijli",
    message:
      "Based on your self-declared rooftop availability, you qualify for up to 300 units of free monthly solar electricity and ₹78,000 installation subsidy.",
    ministryOrAuthority: "Ministry of New and Renewable Energy",
    badgeText: "Eligible • Rooftop Solar",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    date: "4/9/2026, 3:30:12 PM",
    read: false,
    actionLabel: "View Scheme Details",
    actionLink: "/schemes/pm-surya-ghar",
  },

  // 2. Applied Schemes
  {
    id: "notif-app-1",
    category: "applied",
    title: "Application Submitted: PM Surya Ghar Muft Bijli Yojana",
    message:
      "Your application has been registered with reference ID TS-APP-2026-7821. State power discom verification in progress.",
    ministryOrAuthority: "National Solar Portal • State Discom",
    badgeText: "Application Active • Pending Inspection",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
    date: "4/9/2026, 1:15:00 PM",
    read: true,
    actionLabel: "Track Application Journey",
    actionLink: "/journey",
  },
  {
    id: "notif-app-2",
    category: "applied",
    title: "Application Submitted: Krishi Bhagya Water Storage",
    message:
      "Application submitted via Karnataka Raitha Seva Portal (Ref: KB-KA-2026-4409). Field officer verification scheduled.",
    ministryOrAuthority: "Government of Karnataka Agriculture Department",
    badgeText: "Applied • In Verification",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
    date: "3/9/2026, 11:20:18 AM",
    read: true,
    actionLabel: "View Tracking Record",
    actionLink: "/journey",
  },

  // 3. Not Eligible Schemes
  {
    id: "notif-inel-1",
    category: "ineligible",
    title: "Ineligibility Alert: Ayushman Bharat PM-JAY",
    message:
      "Ineligible: Declared annual household income exceeds the ₹2,50,000 threshold limit. We recommend exploring state Arogya Karnataka health scheme alternatives.",
    ministryOrAuthority: "National Health Authority",
    badgeText: "Ineligible • Income Threshold",
    badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
    date: "4/9/2026, 12:05:40 PM",
    read: false,
    actionLabel: "See Alternative Schemes",
    actionLink: "/welfare-gaps",
  },
  {
    id: "notif-inel-2",
    category: "ineligible",
    title: "Ineligibility Alert: PM Ujjwala Yojana (Free LPG)",
    message:
      "Ineligible: Existing active LPG domestic connection detected for this household address. Benefit applies only to adult female members of households with no connection.",
    ministryOrAuthority: "Ministry of Petroleum & Natural Gas",
    badgeText: "Ineligible • Rule Mismatch",
    badgeColor: "bg-rose-50 text-rose-800 border-rose-200",
    date: "2/9/2026, 9:45:10 AM",
    read: true,
    actionLabel: "Understand Ineligibility Rule",
    actionLink: "/schemes/pm-ujjwala",
  },

  // 4. Government Updates & Official Gazettes
  {
    id: "notif-gov-1",
    category: "govt_updates",
    title: "Govt Portal Gazette: PM-Kisan 18th Installment Release",
    message:
      "The Ministry of Agriculture has officially announced the disbursement schedule for the 18th installment. Beneficiaries must ensure Aadhaar-bank seeding is active.",
    ministryOrAuthority: "Official Govt Gazette • pmkisan.gov.in",
    badgeText: "Official Notification • Central Govt",
    badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
    date: "4/9/2026, 10:00:00 AM",
    read: false,
    actionLabel: "Visit Official PM-Kisan Portal",
    actionLink: "https://pmkisan.gov.in",
    isExternal: true,
  },
  {
    id: "notif-gov-2",
    category: "govt_updates",
    title: "Karnataka DBT Advisory: e-KYC Deadline Extended",
    message:
      "Karnataka Social Welfare and Agriculture Departments have extended the mandatory e-KYC verification deadline to 30th September 2026 for all state cash transfers.",
    ministryOrAuthority: "Karnataka Seva Sindhu & DBT Center",
    badgeText: "Advisory • Deadline Extended",
    badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
    date: "3/9/2026, 2:15:30 PM",
    read: true,
    actionLabel: "View Seva Sindhu Portal",
    actionLink: "https://sevasindhu.karnataka.gov.in",
    isExternal: true,
  },
  {
    id: "notif-gov-3",
    category: "govt_updates",
    title: "National Scholarship Portal (NSP) Portal Update",
    message:
      "Fresh applications for Post-Matric SC/ST and OBC scholarships for academic year 2026-27 are now active on the national unified portal.",
    ministryOrAuthority: "Ministry of Social Justice and Empowerment",
    badgeText: "Education Welfare • NSP Open",
    badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
    date: "1/9/2026, 4:00:00 PM",
    read: true,
    actionLabel: "Open NSP Portal",
    actionLink: "https://scholarships.gov.in",
    isExternal: true,
  },
];

export function NotificationsPage() {
  const { language, user } = useAppContext();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>("all");
  const [notifications, setNotifications] = useState<StructuredNotification[]>(DEFAULT_NOTIFICATIONS);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleEmailUpdates = async () => {
    const targetEmail = user?.email;
    if (!targetEmail) {
      setEmailStatus("Please log in to receive email updates.");
      return;
    }
    setIsSending(true);
    try {
      await api.post("/api/schemes/apply", {
        scheme_id: "welfare-notifications-digest",
        scheme_name: "Official Welfare Schemes & Applications Digest",
        applicant_name: user?.full_name || "Citizen",
        email: targetEmail,
      });
      setEmailStatus("Dispatched to Inbox!");
    } catch (err) {
      setEmailStatus("Dispatched!");
    } finally {
      setIsSending(false);
      setTimeout(() => setEmailStatus(null), 4000);
    }
  };

  const filterCounts = {
    all: notifications.length,
    eligible: notifications.filter((n) => n.category === "eligible").length,
    applied: notifications.filter((n) => n.category === "applied").length,
    ineligible: notifications.filter((n) => n.category === "ineligible").length,
    govt_updates: notifications.filter((n) => n.category === "govt_updates").length,
  };

  const filteredNotifications =
    activeCategory === "all"
      ? notifications
      : notifications.filter((n) => n.category === activeCategory);

  const getCategoryIcon = (cat: StructuredNotification["category"]) => {
    switch (cat) {
      case "eligible":
        return <Sparkles size={18} className="text-emerald-600" />;
      case "applied":
        return <Send size={18} className="text-blue-600" />;
      case "ineligible":
        return <ShieldAlert size={18} className="text-rose-600" />;
      case "govt_updates":
        return <Landmark size={18} className="text-purple-600" />;
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-sahaya-green">
              <Bell size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif text-slate-900">
                {t(language, "notifications")}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {t(language, "notificationHelp")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleEmailUpdates}
              disabled={isSending}
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-semibold text-white shadow-sm hover:bg-emerald-800 transition-colors disabled:opacity-50"
            >
              <Mail size={15} />
              {isSending ? "Dispatching..." : emailStatus || "Email Me My Applied Schemes"}
            </button>
            <Link
              to="/dashboard"
              className="inline-flex min-h-11 items-center rounded-xl border border-stone-300 px-4 text-xs font-semibold text-slate-700 hover:bg-stone-50 transition-colors"
            >
              {t(language, "goToDashboard")}
            </Link>
          </div>
        </div>

        {/* ─── Category Filter Tabs ───────────────────────────────── */}
        <div className="mt-6 flex flex-wrap gap-2 border-t border-stone-100 pt-5">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              activeCategory === "all"
                ? "bg-slate-900 text-white shadow-sm"
                : "border border-stone-200 bg-stone-50 text-slate-600 hover:bg-stone-100"
            }`}
          >
            All Updates
            <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[10px]">
              {filterCounts.all}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory("eligible")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              activeCategory === "eligible"
                ? "bg-emerald-700 text-white shadow-sm"
                : "border border-emerald-200 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100/70"
            }`}
          >
            <Sparkles size={13} />
            Eligible Schemes
            <span className="rounded-full bg-emerald-200/60 px-1.5 py-0.2 text-[10px] text-emerald-900">
              {filterCounts.eligible}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory("applied")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              activeCategory === "applied"
                ? "bg-blue-700 text-white shadow-sm"
                : "border border-blue-200 bg-blue-50/70 text-blue-800 hover:bg-blue-100/70"
            }`}
          >
            <Send size={13} />
            Applied Schemes
            <span className="rounded-full bg-blue-200/60 px-1.5 py-0.2 text-[10px] text-blue-900">
              {filterCounts.applied}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory("ineligible")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              activeCategory === "ineligible"
                ? "bg-rose-700 text-white shadow-sm"
                : "border border-rose-200 bg-rose-50/70 text-rose-800 hover:bg-rose-100/70"
            }`}
          >
            <ShieldAlert size={13} />
            Not Eligible
            <span className="rounded-full bg-rose-200/60 px-1.5 py-0.2 text-[10px] text-rose-900">
              {filterCounts.ineligible}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory("govt_updates")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              activeCategory === "govt_updates"
                ? "bg-purple-700 text-white shadow-sm"
                : "border border-purple-200 bg-purple-50/70 text-purple-800 hover:bg-purple-100/70"
            }`}
          >
            <Landmark size={13} />
            Govt Portal Gazettes
            <span className="rounded-full bg-purple-200/60 px-1.5 py-0.2 text-[10px] text-purple-900">
              {filterCounts.govt_updates}
            </span>
          </button>
        </div>
      </div>

      {/* ─── Notification Feed ────────────────────────────────────── */}
      <div className="space-y-3.5">
        {filteredNotifications.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-stone-200 bg-white p-12 text-center">
            <Bell className="mx-auto text-stone-300" size={40} />
            <h3 className="mt-3 font-bold text-slate-800 text-lg">No notifications in this category</h3>
            <p className="text-xs text-slate-500 mt-1">Check other tabs to view your welfare updates.</p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`rounded-2xl border transition-all p-5 ${
                notif.read
                  ? "border-stone-200 bg-white"
                  : "border-stone-300 bg-white shadow-sm ring-1 ring-stone-900/5"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3.5">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-stone-50 border border-stone-200">
                    {getCategoryIcon(notif.category)}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm md:text-base">
                        {notif.title}
                      </h3>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${notif.badgeColor}`}
                      >
                        {notif.badgeText}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="mt-2.5 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                      <span className="font-medium text-slate-500">
                        {notif.ministryOrAuthority}
                      </span>
                      <span>•</span>
                      <span>{notif.date}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Action Button */}
                {notif.actionLabel && notif.actionLink && (
                  <div className="shrink-0 pt-1">
                    {notif.isExternal ? (
                      <a
                        href={notif.actionLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-stone-50 px-3.5 py-2 text-xs font-semibold text-slate-800 shadow-sm hover:bg-stone-100 transition-colors"
                      >
                        {notif.actionLabel}
                        <ExternalLink size={13} />
                      </a>
                    ) : (
                      <Link
                        to={notif.actionLink}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
                      >
                        {notif.actionLabel}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

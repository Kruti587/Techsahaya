import React from "react";
import { AlertCircle, AlertTriangle, ArrowUpRight, Calendar, CheckCircle2, Compass, FileUp, Sparkles, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

interface AlmostEligibleScheme {
  id: string;
  name: string;
  category: string;
  department: string;
  statusBadge: string;
  blockingCondition: string;
  missingDoc: string;
  schemeLink: string;
}

const ALMOST_ELIGIBLE_SCHEMES: AlmostEligibleScheme[] = [
  {
    id: "pm-kisan",
    name: "PM-Kisan",
    category: "AGRICULTURE",
    department: "Ministry of Agriculture & Farmers Welfare",
    statusBadge: "Not Uploaded",
    blockingCondition: "Upload a verified land record to unlock this benefit.",
    missingDoc: "land_record",
    schemeLink: "/schemes/pm-kisan",
  },
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat PM-JAY",
    category: "HEALTH",
    department: "National Health Authority",
    statusBadge: "Not Uploaded",
    blockingCondition: "Upload a verified ration card to unlock this benefit.",
    missingDoc: "ration_card",
    schemeLink: "/schemes/ayushman-bharat",
  },
  {
    id: "pm-ujjwala",
    name: "PM Ujjwala Yojana",
    category: "ENERGY",
    department: "Ministry of Petroleum and Natural Gas",
    statusBadge: "Not Uploaded",
    blockingCondition: "Upload a verified ration card to unlock this benefit.",
    missingDoc: "ration_card",
    schemeLink: "/schemes/pm-ujjwala",
  },
  {
    id: "e-shram",
    name: "e-Shram",
    category: "LABOUR",
    department: "Ministry of Labour and Employment",
    statusBadge: "Not Uploaded",
    blockingCondition: "Upload a verified mobile number to unlock this benefit.",
    missingDoc: "mobile_verification",
    schemeLink: "/schemes/e-shram",
  },
  {
    id: "krishi-bhagya",
    name: "Krishi Bhagya Karnataka",
    category: "AGRICULTURE",
    department: "Government of Karnataka Agriculture Department",
    statusBadge: "Not Uploaded",
    blockingCondition: "Upload a verified land record to unlock this benefit.",
    missingDoc: "land_record",
    schemeLink: "/schemes/krishi-bhagya",
  },
  {
    id: "swachh-bharat",
    name: "Swachh Bharat Mission - Gramin",
    category: "SANITATION",
    department: "Department of Drinking Water and Sanitation",
    statusBadge: "Not Uploaded",
    blockingCondition: "Upload a verified residence proof to unlock this benefit.",
    missingDoc: "residence_proof",
    schemeLink: "/schemes/swachh-bharat-gramin",
  },
];

export function OneStepAwayRadar() {
  const { profile } = useAppContext();
  const navigate = useNavigate();

  const handleFulfill = (_scheme: AlmostEligibleScheme) => {
    navigate("/documents");
  };

  return (
    <div className="space-y-8">
      {/* ─── SECTION 1: One Step Away (Almost Eligible) ─────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-amber-600 text-sm font-bold">
                !
              </span>
              <h2 className="text-xl font-bold font-serif text-slate-900">
                One Step Away (Almost Eligible)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Schemes where you satisfy almost all criteria but are blocked by a single actionable requirement.
            </p>
          </div>
          <span className="rounded-full bg-amber-100/80 px-3 py-1 text-xs font-semibold text-amber-800 shrink-0">
            6 Pending
          </span>
        </div>

        {/* 2-Column Grid of Cards */}
        <div className="grid gap-4 md:grid-cols-2">
          {ALMOST_ELIGIBLE_SCHEMES.map((scheme) => (
            <div
              key={scheme.id}
              className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:border-amber-300 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                    {scheme.category}
                  </span>
                  <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600">
                    {scheme.statusBadge}
                  </span>
                </div>

                {/* Scheme Title & Dept */}
                <h3 className="font-bold text-slate-900 text-base">{scheme.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{scheme.department}</p>

                {/* Blocking Condition Callout */}
                <div className="mt-3.5 rounded-xl border border-amber-200/70 bg-amber-50/60 p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={15} className="text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-amber-900">
                        Blocking Condition:
                      </span>
                      <p className="text-xs text-slate-700 mt-0.5 font-normal">
                        {scheme.blockingCondition}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleFulfill(scheme)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white px-3.5 py-2 text-xs font-semibold shadow-sm transition-colors"
                >
                  <FileUp size={14} /> Fulfill Requirement
                </button>
                <Link
                  to={scheme.schemeLink}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Scheme Rules
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SECTION 2: Eligibility Radar (Future Benefits) ────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-indigo-600" />
              <h2 className="text-xl font-bold font-serif text-slate-900">
                Eligibility Radar (Future Benefits)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Mathematically calculated upcoming opportunities based on your age and predictable life milestones.
            </p>
          </div>
          <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-semibold text-indigo-700 shrink-0">
            0 Approaching
          </span>
        </div>

        {/* Timeline & Welfare State Stack */}
        <div className="space-y-4">
          {/* Card A: Your Benefit Timeline */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={18} className="text-slate-700" />
              <h3 className="font-bold text-slate-900 text-base">Your Benefit Timeline</h3>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              A continuous chronological map of your active welfare entitlements and future opportunities.
            </p>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {/* Timeline Item 1: Available Now */}
              <div className="relative">
                <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 ring-2 ring-emerald-100" />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    AVAILABLE NOW
                  </span>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    Active
                  </span>
                </div>
                <h4 className="font-semibold text-slate-900 text-sm mt-1">1 Scheme(s) Qualified</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  All deterministic eligibility conditions and verified documents are satisfied.
                </p>
              </div>

              {/* Timeline Item 2: One Step Away */}
              <div className="relative">
                <div className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-amber-500 ring-2 ring-amber-100" />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    ONE STEP AWAY
                  </span>
                  <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                    Action Needed
                  </span>
                </div>
                <h4 className="font-semibold text-slate-900 text-sm mt-1">
                  6 Scheme(s) Blocked by Missing Requirements
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Actionable: uploading required certificates will immediately unlock these schemes.
                </p>
              </div>
            </div>
          </div>

          {/* Card B: What Changed in Your Welfare State? */}
          <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-slate-700" />
              <h3 className="font-bold text-slate-900 text-base">
                What Changed in Your Welfare State?
              </h3>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-stone-200/80 bg-stone-50/60 p-3.5 flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">Verified Document Claim Active:</strong> Your verified documents (income_certificate) are actively supporting your welfare passport.
                </p>
              </div>

              <div className="rounded-xl border border-stone-200/80 bg-stone-50/60 p-3.5 flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-600 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900">1 Active Welfare Entitlements:</strong> You meet all deterministic requirements. Review and submit your applications.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

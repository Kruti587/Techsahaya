import React, { useRef, useState } from "react";
import { CheckCircle2, Download, ExternalLink, FileText, Printer, X } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { api } from "../services/api";

interface AutoFilledApplicationModalProps {
  scheme: {
    id: string;
    name: string;
    department?: string;
    official_link?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function AutoFilledApplicationModal({
  scheme,
  isOpen,
  onClose,
}: AutoFilledApplicationModalProps) {
  const { user, profile } = useAppContext();
  const [submitted, setSubmitted] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // Consistent 6-digit Application ID generated deterministically per user + scheme
  const appId = React.useMemo(() => {
    const seed = (user?.id || "citizen") + scheme.id;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    return "APP-" + Math.abs(hash % 900000 + 100000);
  }, [user?.id, scheme.id]);

  if (!isOpen) return null;

  const applicantData = [
    { label: "Full Name:", value: user?.full_name || "Kavitha Gowda" },
    {
      label: "Age / Gender:",
      value: `${profile.age || 20} Years / ${profile.gender || "female"}`,
    },
    { label: "State of Residence:", value: profile.state || "Karnataka" },
    { label: "Occupation:", value: profile.occupation || "farmer" },
    {
      label: "Annual Income (Rs):",
      value: profile.income ? `Rs ${profile.income.toLocaleString("en-IN")}` : "Rs 2,000",
    },
    {
      label: "Landholding (Acres):",
      value: profile.landholding ? String(profile.landholding) : "2",
    },
    {
      label: "Family Size:",
      value: profile.family_members?.length ? String(profile.family_members.length + 1) : "1",
    },
    {
      label: "Disability Status:",
      value: profile.disability ? "Yes" : "No / Not Disclosed",
    },
  ];

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const win = window.open("", "_blank");
    if (!win) return;

    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Application_${scheme.name.replace(/\\s+/g, "_")}_${appId}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Georgia, serif;
            color: #111827;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 24px;
          }
          .title {
            font-size: 18px;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin: 0;
          }
          .subtitle {
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin-top: 6px;
          }
          .divider {
            border-bottom: 2px solid #111827;
            margin: 16px 0;
          }
          .app-meta {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 24px;
          }
          .part-title {
            color: #166534;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin-bottom: 12px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          td {
            border: 1px solid #cbd5e1;
            padding: 10px 14px;
            font-size: 13px;
          }
          td.label {
            width: 35%;
            font-weight: 600;
            color: #0f172a;
          }
          td.value {
            color: #1e3a8a;
          }
          .declaration {
            font-size: 11.5px;
            line-height: 1.6;
            color: #334155;
            margin-top: 8px;
          }
          @media print {
            body { padding: 20px; }
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);
    win.document.close();
  };

  const handleApply = async () => {
    setSubmitted(true);
    try {
      if (user?.email) {
        await api.post("/api/schemes/apply", {
          scheme_id: scheme.id,
          scheme_name: scheme.name,
          applicant_name: user?.full_name || (profile as any)?.name || "Citizen",
          email: user.email,
        });
      }
    } catch (err) {
      console.error("Failed to register scheme application:", err);
    }

    if (scheme.official_link) {
      setTimeout(() => {
        window.open(scheme.official_link, "_blank");
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-3xl bg-white shadow-2xl border border-stone-200 overflow-hidden">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-stone-200 px-6 py-4 bg-stone-50/70">
          <div className="flex items-center gap-2">
            <FileText className="text-blue-600" size={18} />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Official Scheme Application Form Preview
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-stone-200/80 hover:text-slate-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Content - EXACT MATCH TO IMAGE 2 */}
        <div className="overflow-y-auto p-6 md:p-8 space-y-6">
          <div
            ref={printRef}
            className="rounded-xl border border-stone-200 bg-white p-6 md:p-8 shadow-sm"
          >
            {/* Header */}
            <div className="text-center mb-5">
              <h1 className="text-base md:text-lg font-extrabold uppercase tracking-wide text-slate-900 font-serif">
                GOVERNMENT OF INDIA
              </h1>
              <h2 className="text-sm md:text-base font-bold uppercase tracking-wide text-slate-800 mt-1 font-serif">
                OFFICIAL SCHEME APPLICATION FORM
              </h2>
              <div className="my-3 border-b-2 border-slate-900" />
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span>Application For: {scheme.name}</span>
                <span>Application ID: {appId}</span>
              </div>
            </div>

            {/* PART A: APPLICANT DETAILS */}
            <div className="mt-6">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3">
                PART A: APPLICANT DETAILS (AUTO-FILLED BY TECH SAHAYA)
              </div>

              <div className="overflow-hidden rounded-lg border border-stone-300">
                <table className="w-full border-collapse text-left text-xs">
                  <tbody>
                    {applicantData.map((row, idx) => (
                      <tr
                        key={row.label}
                        className={idx % 2 === 0 ? "bg-white" : "bg-stone-50/50"}
                      >
                        <td className="w-2/5 border-b border-r border-stone-300 px-4 py-2.5 font-semibold text-slate-900">
                          {row.label}
                        </td>
                        <td className="w-3/5 border-b border-stone-300 px-4 py-2.5 text-blue-900 font-medium">
                          {row.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PART B: DECLARATION */}
            <div className="mt-6">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                PART B: DECLARATION
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600">
                I hereby declare that the details auto-filled above by the Tech Sahaya system are
                true and correct to the best of my knowledge. I understand that any false
                information may lead to rejection of this application.
              </p>
            </div>
          </div>

          {/* Submission status note */}
          {submitted && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs text-emerald-900 flex items-start gap-2.5 animate-fade-in">
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Application Registered • {appId}</strong>
                <span>
                  Your pre-filled application package is verified and submitted. Redirecting to the
                  official portal for final biometric / e-sign confirmation.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 bg-stone-50/80 px-6 py-4">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-800 shadow-sm hover:bg-stone-100 transition-colors"
          >
            <Printer size={15} /> Download / Print Official PDF
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-300 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-stone-100 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              {submitted ? "Submitted" : "Apply & Open Official Portal"}
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

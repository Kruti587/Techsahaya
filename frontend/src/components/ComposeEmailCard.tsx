import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Minus,
  Paperclip,
  Send,
  Trash2,
  Plus,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export type User = {
  id: string;
  name: string;
  avatar: string;
  email: string;
};

export type Attachment = {
  id: string;
  name: string;
  type: string;
  size: string;
  icon: "PDF" | "IMAGE" | "DOC";
};

export type EmailData = {
  from: User;
  to: User[];
  subject: string;
  body: string;
  attachments: Attachment[];
};

export interface ComposeEmailCardProps {
  data?: EmailData;
  isOpen?: boolean;
  onSend?: (data: EmailData) => void;
  onClose?: () => void;
}

const defaultSampleData: EmailData = {
  from: {
    id: "1",
    name: "Liam Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam",
    email: "liam@zentra.com",
  },
  to: [
    {
      id: "2",
      name: "Sophie Turner",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
      email: "sophie@finpay.com",
    },
    {
      id: "3",
      name: "Jackson Miller",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jackson",
      email: "jackson@finpay.com",
    },
  ],
  subject: "Quick intro — Zentra CRM",
  body: `Hi guys,

I'm Liam Johnson, Head of Product at Zentra. We're building a CRM focused on helping teams manage clients, deals, and internal workflows in one clean, flexible system.`,
  attachments: [
    {
      id: "a1",
      name: "Zentra overview",
      type: "pdf",
      size: "17 MB",
      icon: "PDF",
    },
    {
      id: "a2",
      name: "Zentra use case FinTech",
      type: "pdf",
      size: "17 MB",
      icon: "PDF",
    },
  ],
};

export function ComposeEmailCard({
  data = defaultSampleData,
  isOpen: controlledIsOpen,
  onSend,
  onClose,
}: ComposeEmailCardProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;

  const [emailData, setEmailData] = useState<EmailData>(data);
  const [minimized, setMinimized] = useState(false);
  const [newRecipient, setNewRecipient] = useState("");
  const [sending, setSending] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if initial data changes
  useEffect(() => {
    if (data) {
      setEmailData(data);
    }
  }, [data]);

  // Global listener for opening support email drawer from footer / buttons
  useEffect(() => {
    const handleOpen = () => {
      setInternalOpen(true);
      setMinimized(false);
    };
    window.addEventListener("open-support-email", handleOpen);
    return () => window.removeEventListener("open-support-email", handleOpen);
  }, []);

  const handleClose = () => {
    setInternalOpen(false);
    if (onClose) onClose();
    console.log("Card Closed");
  };

  const handleRemoveRecipient = (id: string) => {
    setEmailData((prev) => ({
      ...prev,
      to: prev.to.filter((u) => u.id !== id),
    }));
  };

  const handleAddRecipient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = newRecipient.trim().replace(/,/g, "");
      if (val) {
        const rawName = val.split("@")[0] || "User";
        const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
        const newUser: User = {
          id: `usr_${Date.now()}`,
          name: formattedName,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formattedName)}`,
          email: val,
        };
        setEmailData((prev) => ({ ...prev, to: [...prev.to, newUser] }));
        setNewRecipient("");
      }
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setEmailData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.id !== id),
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    const newAtts: Attachment[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const sizeMB = (f.size / (1024 * 1024)).toFixed(1);
      const sizeStr = parseFloat(sizeMB) > 0.1 ? `${sizeMB} MB` : `${Math.round(f.size / 1024)} KB`;
      let icon: "PDF" | "IMAGE" | "DOC" = "DOC";
      if (f.name.toLowerCase().endsWith(".pdf")) icon = "PDF";
      else if (f.type.startsWith("image/") || /\.(png|jpg|jpeg|gif|svg)$/i.test(f.name)) icon = "IMAGE";

      newAtts.push({
        id: `att_${Date.now()}_${i}`,
        name: f.name,
        type: f.name.split(".").pop() || "file",
        size: sizeStr,
        icon,
      });
    }
    setEmailData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newAtts],
    }));
    e.target.value = "";
  };

  const handleSend = () => {
    setSending(true);
    if (onSend) onSend(emailData);
    console.log("Sent Email:", emailData);

    setTimeout(() => {
      setSending(false);
      setToastMessage(`✓ Email dispatched to ${emailData.to.length} recipient(s)!`);
      handleClose();

      setTimeout(() => {
        setToastMessage(null);
      }, 3500);
    }, 700);
  };

  const handleOpenGmail = () => {
    const toStr = emailData.to.map((u) => u.email).join(",");
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(toStr)}&su=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(emailData.body)}`;
    window.open(gmailUrl, "_blank");
    setToastMessage("✓ Pre-filled draft opened in Gmail!");
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-[9999] flex items-center gap-2 rounded-xl border border-emerald-500 bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating launcher when closed */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setInternalOpen(true);
            setMinimized(false);
          }}
          aria-label="Contact Support via Email"
          className="fixed bottom-6 right-6 z-[9980] flex items-center gap-2.5 rounded-full border border-amber-500/30 bg-gradient-to-r from-sahaya-green to-emerald-900 px-5 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-amber-400"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sahaya-saffron opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sahaya-saffron"></span>
          </span>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
          </svg>
          <span>Email Support</span>
        </button>
      )}

      {/* Compose Email Modal Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Compose Email"
          className={`fixed bottom-6 right-6 z-[9990] flex flex-col overflow-hidden rounded-2xl border border-emerald-900/20 bg-white/95 text-sahaya-ink shadow-2xl backdrop-blur-xl transition-all duration-300 ${
            minimized
              ? "w-80 shadow-lg"
              : "w-[calc(100vw-32px)] max-w-[520px] max-h-[calc(100vh-48px)]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-emerald-900/10 bg-sahaya-ink px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
              <span className="text-sm font-bold tracking-tight">
                Compose Message — Tech Sahaya Support
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMinimized(!minimized)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
                title={minimized ? "Expand window" : "Minimize window"}
              >
                <Minus size={15} />
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white/80 transition hover:bg-rose-600 hover:text-white"
                title="Close card"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Body Content */}
              <div className="flex flex-col gap-3.5 overflow-y-auto p-4 text-xs">
                {/* From Row */}
                <div className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-2.5">
                  <img
                    src={emailData.from.avatar}
                    alt={emailData.from.name}
                    className="h-9 w-9 rounded-full border border-sahaya-green/40 object-cover bg-emerald-50"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-xs">
                      {emailData.from.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {emailData.from.email}
                    </span>
                  </div>
                  <span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sahaya-green">
                    Sender
                  </span>
                </div>

                {/* To Recipients */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    To
                  </span>
                  <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-xl border border-stone-200 bg-white p-2 transition focus-within:border-sahaya-green focus-within:ring-2 focus-within:ring-sahaya-green/10">
                    {emailData.to.map((u) => (
                      <span
                        key={u.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700/20 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-sahaya-green"
                      >
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="h-4 w-4 rounded-full"
                        />
                        <span>{u.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRecipient(u.id)}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="+ Add recipient email..."
                      value={newRecipient}
                      onChange={(e) => setNewRecipient(e.target.value)}
                      onKeyDown={handleAddRecipient}
                      className="min-w-[130px] flex-1 border-none bg-transparent p-1 text-xs text-slate-800 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Subject
                  </span>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) =>
                      setEmailData((prev) => ({ ...prev, subject: e.target.value }))
                    }
                    className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-slate-800 outline-none transition focus:border-sahaya-green focus:ring-2 focus:ring-sahaya-green/10"
                  />
                </div>

                {/* Body Message */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Message
                  </span>
                  <textarea
                    rows={4}
                    value={emailData.body}
                    onChange={(e) =>
                      setEmailData((prev) => ({ ...prev, body: e.target.value }))
                    }
                    className="w-full resize-y rounded-xl border border-stone-200 bg-white p-3 text-xs leading-relaxed text-slate-800 outline-none transition focus:border-sahaya-green focus:ring-2 focus:ring-sahaya-green/10"
                  />
                </div>

                {/* Attachments */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Attachments ({emailData.attachments.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1 rounded-lg border border-dashed border-sahaya-saffron/50 bg-amber-50/60 px-2.5 py-1 text-[11px] font-semibold text-sahaya-saffron transition hover:bg-amber-100 hover:border-sahaya-saffron"
                    >
                      <Plus size={12} />
                      <span>Attach File</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {emailData.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1.5 transition hover:bg-stone-100"
                      >
                        <span
                          className={`rounded px-1.5 py-0.5 text-[9px] font-extrabold uppercase ${
                            att.icon === "PDF"
                              ? "bg-rose-100 text-rose-700"
                              : att.icon === "IMAGE"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {att.icon}
                        </span>
                        <div className="flex flex-col leading-none">
                          <span
                            className="max-w-[130px] truncate text-[11px] font-semibold text-slate-700"
                            title={att.name}
                          >
                            {att.name}
                          </span>
                          <span className="text-[9px] text-slate-400">{att.size}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(att.id)}
                          className="text-slate-400 hover:text-rose-600"
                          title="Remove file"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                    {!emailData.attachments.length && (
                      <span className="text-[11px] text-slate-400 italic">
                        No attachments added yet
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-between border-t border-stone-200 bg-stone-50 px-4 py-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition"
                >
                  Discard
                </button>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleOpenGmail}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-red-500 hover:bg-red-50 hover:text-red-700"
                    title="Open in Gmail Web App"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#ea4335">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                    <span>Open in Gmail</span>
                  </button>

                  <button
                    type="button"
                    disabled={sending}
                    onClick={handleSend}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-sahaya-green px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-emerald-900 disabled:opacity-50"
                  >
                    {sending ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Send size={13} />
                    )}
                    <span>{sending ? "Sending..." : "Send Email"}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

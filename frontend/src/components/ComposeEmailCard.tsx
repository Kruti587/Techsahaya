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
  ExternalLink,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

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

const defaultRecipient: User = {
  id: "tech-sahaya-support",
  name: "Tech Sahaya Citizen Helpdesk",
  avatar: "/favicon.svg",
  email: "support@techsahaya.gov.in",
};

export function ComposeEmailCard({
  isOpen: controlledIsOpen,
  onSend,
  onClose,
}: ComposeEmailCardProps) {
  const { user } = useAppContext();
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalOpen;

  const [emailData, setEmailData] = useState<EmailData>({
    from: {
      id: "sender-citizen",
      name: user?.full_name || "",
      avatar: "",
      email: user?.email || "",
    },
    to: [defaultRecipient],
    subject: "Citizen Support Inquiry — Tech Sahaya",
    body: "",
    attachments: [],
  });

  const [minimized, setMinimized] = useState(false);
  const [newRecipient, setNewRecipient] = useState("");
  const [sending, setSending] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync user info if user logs in
  useEffect(() => {
    if (user) {
      setEmailData((prev) => ({
        ...prev,
        from: {
          ...prev.from,
          name: prev.from.name || user.full_name || "",
          email: prev.from.email || user.email || "",
        },
      }));
    }
  }, [user]);

  // Global listener for opening support email modal from footer / notify buttons
  useEffect(() => {
    const handleOpen = (e?: any) => {
      setInternalOpen(true);
      setMinimized(false);
      if (e?.detail?.email) {
        setEmailData((prev) => ({
          ...prev,
          from: {
            ...prev.from,
            email: e.detail.email,
          },
        }));
      }
      if (e?.detail?.subject) {
        setEmailData((prev) => ({
          ...prev,
          subject: e.detail.subject,
        }));
      }
    };
    window.addEventListener("open-support-email", handleOpen);
    return () => window.removeEventListener("open-support-email", handleOpen);
  }, []);

  const handleClose = () => {
    setInternalOpen(false);
    if (onClose) onClose();
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
        const rawName = val.split("@")[0] || "Recipient";
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
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = Array.from(files).map((file, idx) => {
      const isPdf = file.type.includes("pdf");
      const isImg = file.type.includes("image");
      return {
        id: `att_${Date.now()}_${idx}`,
        name: file.name,
        type: isPdf ? "pdf" : isImg ? "image" : "doc",
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        icon: isPdf ? "PDF" : isImg ? "IMAGE" : "DOC",
      };
    });

    setEmailData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...newAttachments],
    }));
    e.target.value = "";
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailData.from.email) {
      setToastMessage("Please provide your email address so we can reply.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    if (!emailData.body.trim()) {
      setToastMessage("Please enter your message text.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setSending(true);
    if (onSend) onSend(emailData);

    setTimeout(() => {
      setSending(false);
      setToastMessage(`✓ Inquiry sent to ${emailData.to.map((t) => t.email).join(", ")}!`);
      handleClose();

      setTimeout(() => {
        setToastMessage(null);
      }, 4000);
    }, 700);
  };

  const handleOpenGmail = () => {
    const toStr = emailData.to.map((u) => u.email).join(",");
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      toStr
    )}&su=${encodeURIComponent(emailData.subject)}&body=${encodeURIComponent(
      `${emailData.body}\n\n---\nFrom: ${emailData.from.name || "Citizen"} <${
        emailData.from.email || "No email"
      }>`
    )}`;
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

      {/* NO FLOATING BUTTON WHEN CLOSED: It is exclusively accessible via the footer section! */}

      {/* Compose Email Modal Card */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Compose Email"
          className={`fixed bottom-6 right-6 z-[9990] flex flex-col overflow-hidden rounded-2xl border border-emerald-900/20 bg-white text-sahaya-ink shadow-2xl backdrop-blur-xl transition-all duration-300 ${
            minimized
              ? "w-80 shadow-lg"
              : "w-[calc(100vw-32px)] max-w-[520px] max-h-[calc(100vh-48px)]"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-emerald-900/10 bg-[#0b1f18] px-4 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
              <span className="text-sm font-bold tracking-tight">
                Compose Message — Tech Sahaya Support
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setMinimized((m) => !m)}
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white"
                title={minimized ? "Expand" : "Minimize"}
              >
                <Minus size={14} />
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
            <form onSubmit={handleSendEmail} className="flex flex-col overflow-hidden">
              {/* Body Content */}
              <div className="flex flex-col gap-3.5 overflow-y-auto p-4 text-xs max-h-[60vh]">
                {/* From Inputs: BLANK by default unless logged in */}
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Your Information (Sender)
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name (Optional)"
                      value={emailData.from.name}
                      onChange={(e) =>
                        setEmailData((prev) => ({
                          ...prev,
                          from: { ...prev.from, name: e.target.value },
                        }))
                      }
                      className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-sahaya-green"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email *"
                      value={emailData.from.email}
                      onChange={(e) =>
                        setEmailData((prev) => ({
                          ...prev,
                          from: { ...prev.from, email: e.target.value },
                        }))
                      }
                      className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs text-slate-800 outline-none focus:border-sahaya-green"
                    />
                  </div>
                </div>

                {/* To Recipients: FILLED with support@techsahaya.gov.in */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    To (Recipient)
                  </span>
                  <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-xl border border-stone-200 bg-white p-2 transition focus-within:border-sahaya-green focus-within:ring-2 focus-within:ring-sahaya-green/10">
                    {emailData.to.map((u) => (
                      <span
                        key={u.id}
                        className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700/20 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-sahaya-green"
                      >
                        <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
                        <span>{u.name} ({u.email})</span>
                        {emailData.to.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRecipient(u.id)}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            &times;
                          </button>
                        )}
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="+ Add cc email..."
                      value={newRecipient}
                      onChange={(e) => setNewRecipient(e.target.value)}
                      onKeyDown={handleAddRecipient}
                      className="min-w-[120px] flex-1 border-none bg-transparent p-1 text-xs text-slate-800 outline-none placeholder:text-slate-400"
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
                    rows={5}
                    required
                    placeholder="Describe your inquiry, scheme question, or feedback here..."
                    value={emailData.body}
                    onChange={(e) =>
                      setEmailData((prev) => ({ ...prev, body: e.target.value }))
                    }
                    className="w-full resize-y rounded-xl border border-stone-200 bg-white p-3 text-xs leading-relaxed text-slate-800 outline-none transition focus:border-sahaya-green focus:ring-2 focus:ring-sahaya-green/10"
                  />
                </div>

                {/* Attachments list */}
                {emailData.attachments.length > 0 && (
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Attachments ({emailData.attachments.length})
                    </span>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {emailData.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between gap-2 rounded-xl border border-stone-200 bg-stone-50/80 p-2 text-xs transition hover:bg-stone-100"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-sahaya-green font-bold text-[10px]">
                              {att.icon === "PDF" ? "PDF" : <ImageIcon size={13} />}
                            </span>
                            <div className="flex flex-col overflow-hidden">
                              <span className="truncate font-semibold text-slate-800">
                                {att.name}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {att.size}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(att.id)}
                            className="rounded p-1 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                            title="Remove file"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-stone-200 bg-stone-50 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-stone-100 hover:text-sahaya-green"
                  >
                    <Paperclip size={13} />
                    <span>Attach</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleOpenGmail}
                    className="flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-red-50 hover:text-red-700"
                    title="Open draft in official Gmail client"
                  >
                    <ExternalLink size={13} />
                    <span>Open in Gmail</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-stone-200"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex items-center gap-1.5 rounded-xl bg-sahaya-green px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-emerald-900 active:scale-95 disabled:opacity-50"
                  >
                    {sending ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}
    </>
  );
}

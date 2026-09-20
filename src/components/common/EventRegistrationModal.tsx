import React, { useState, useEffect } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { useData, EventItem } from "../../context/DataContext";

interface EventRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventItem | { id: number; title: string; date?: string; category?: string } | null;
}

export default function EventRegistrationModal({
  isOpen,
  onClose,
  event
}: EventRegistrationModalProps) {
  const { addEventRegistration } = useData();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form state when modal is opened or closed
  useEffect(() => {
    if (isOpen) {
      setFullName("");
      setEmail("");
      setPhone("");
      setIsSubmitted(false);
      setIsSubmitting(false);
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    addEventRegistration({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      eventId: event.id,
      eventTitle: event.title
    });

    setIsSubmitting(false);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Dialog Card (Matching media_1789894355143.png 1:1) */}
      <div 
        className="bg-white rounded-[24px] shadow-2xl border border-gray-100 w-full max-w-[380px] p-7 relative z-10 text-left transform transition-all duration-300 animate-in fade-in zoom-in-95 font-[var(--font-poppins)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer outline-none p-1 rounded-full hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {isSubmitted ? (
          <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner animate-bounce">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-extrabold text-[#072A6C]">Registration Confirmed!</h3>
            <p className="text-xs text-gray-500 font-light font-[var(--font-inter)] leading-relaxed">
              Thank you, <strong className="text-gray-700 font-bold">{fullName}</strong>. A confirmation pass for <strong className="text-[#072A6C]">{event.title}</strong> has been registered.
            </p>
          </div>
        ) : (
          <>
            {/* Header Title */}
            <div className="text-center pb-4 border-b border-gray-100/80 mb-5">
              <h2 className="text-base font-extrabold text-[#072A6C] tracking-wide uppercase">
                REGISTRATION
              </h2>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5 truncate max-w-[280px] mx-auto font-[var(--font-inter)]">
                {event.title}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name Field */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-1.5 font-[var(--font-inter)]">
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter name"
                  className="w-full px-3.5 py-2.5 text-xs text-gray-800 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-medium font-[var(--font-inter)]"
                />
              </div>

              {/* Email Address Field */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-1.5 font-[var(--font-inter)]">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full px-3.5 py-2.5 text-xs text-gray-800 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-medium font-[var(--font-inter)]"
                />
              </div>

              {/* Phone Number Field */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-gray-500 mb-1.5 font-[var(--font-inter)]">
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone"
                  className="w-full px-3.5 py-2.5 text-xs text-gray-800 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all font-medium font-[var(--font-inter)]"
                />
              </div>

              {/* Action Buttons (Cancel / Confirm matching screenshot) */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all cursor-pointer font-[var(--font-poppins)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 bg-[#D4AF37] hover:bg-[#c49f2e] active:scale-98 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow cursor-pointer font-[var(--font-poppins)]"
                >
                  {isSubmitting ? "Submitting..." : "Confirm"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

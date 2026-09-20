import React, { useState } from "react";
import {
  Sparkles,
  UserPlus,
  ShieldCheck,
  FileText,
  UploadCloud,
  CreditCard,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Eye,
  CheckCircle2,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  DollarSign,
  Layers,
  ArrowUp,
  ArrowDown,
  HelpCircle,
  Check,
  Smartphone,
  MapPin,
  Building,
  GraduationCap
} from "lucide-react";
import {
  useData,
  ApplyOnlinePortalConfig,
  ApplyOnlineDocumentItem,
  ApplyOnlinePaymentModeItem,
  DEFAULT_ADMISSIONS_CONTENT
} from "../../context/DataContext";
import { SectionHeader } from "./AdminComponents";

export interface ApplyOnlineCMSProps {
  notifySave: (msg: string) => void;
}

export const ApplyOnlineCMS: React.FC<ApplyOnlineCMSProps> = ({ notifySave }) => {
  const { admissionsContent, updateAdmissionsContent } = useData();

  const defaultConfig = DEFAULT_ADMISSIONS_CONTENT.applyOnline || {
    headerBadge: "ADMISSIONS",
    headerTitle: "Apply Online",
    headerSubtitle: "Start your journey today. Fill out our online application form to secure your seat.",
    applicationFee: 1000,
    sessionYear: "2026-27",
    floatingEnquiryButtonText: "ADMISSION ENQUIRY",
    floatingEnquiryPhones: ["+91 91773 24999", "+91 863 222 5555"],
    floatingEnquiryEmail: "admissions@chalapathiengg.ac.in",
    floatingEnquiryTimings: "Mon - Sat: 9:00 AM - 5:30 PM",
    step1Heading: "REGISTER YOURSELF",
    step1Subheading: "Create your account to start the digital admission journey.",
    step1ButtonText: "REGISTER & SEND VERIFICATION CODE",
    statesList: [
      "Andhra Pradesh",
      "Telangana",
      "Tamil Nadu",
      "Karnataka",
      "Kerala",
      "Maharashtra",
      "Delhi NCR",
      "Odisha",
      "Uttar Pradesh",
      "Bihar",
      "West Bengal",
      "Madhya Pradesh",
      "Rajasthan",
      "Gujarat",
      "Other State / Union Territory"
    ],
    step2Heading: "VERIFY YOUR CONTACT",
    step2Subheading: "Enter the 6-digit verification code sent to your registered mobile number & email address.",
    step2HelperText: "Default sandbox OTP: 123456 (or any 6-digit code)",
    step2ButtonText: "VERIFY CODE & PROCEED TO FORM",
    step2ResendSeconds: 30,
    step3Heading: "STUDENT & ACADEMIC DETAILS",
    step3Subheading: "Fill in your parent information, communication address, and qualifying examination marks.",
    step3ButtonText: "SAVE DETAILS & PROCEED TO DOCUMENTS",
    genderOptions: ["Male", "Female", "Other"],
    categoryOptions: ["General", "OBC", "SC", "ST", "EWS"],
    step4Heading: "UPLOAD DOCUMENTS",
    step4Subheading: "Attach self-attested digital copies of your marksheets and government ID proofs.",
    step4ButtonText: "SAVE DOCUMENTS & PROCEED TO PAYMENT",
    documentsList: [
      {
        id: "tenthMarksheet",
        label: "10th / SSC Marks Memo *",
        description: "Scanned copy of 10th grade marksheet",
        required: true,
        allowedFormats: "PDF, JPG, PNG",
        maxSizeMb: 5
      },
      {
        id: "twelfthMarksheet",
        label: "12th / Intermediate / Diploma Memo *",
        description: "Scanned copy of qualifying 10+2 marks memo",
        required: true,
        allowedFormats: "PDF, JPG, PNG",
        maxSizeMb: 5
      },
      {
        id: "photoId",
        label: "Aadhaar Card / Government Photo ID *",
        description: "Government issued identity proof",
        required: true,
        allowedFormats: "PDF, JPG, PNG",
        maxSizeMb: 5
      },
      {
        id: "passportPhoto",
        label: "Recent Passport Size Photograph *",
        description: "Formal color passport photograph with white background",
        required: true,
        allowedFormats: "JPG, PNG",
        maxSizeMb: 2
      },
      {
        id: "transferCert",
        label: "Transfer Certificate (TC) / Migration (Optional)",
        description: "School / college leaving certificate",
        required: false,
        allowedFormats: "PDF, JPG",
        maxSizeMb: 5
      }
    ],
    step5Heading: "APPLICATION FEE PAYMENT",
    step5Subheading: "Complete your online application fee transaction to generate your official Admission Enrollment Slip.",
    step5ButtonText: "PROCEED TO PAY ₹1,000",
    successTitle: "Application Submitted Successfully!",
    successSubtitle: "Your application has been received and registered into the Chalapathi University admissions database.",
    paymentModes: [
      {
        id: "upi",
        name: "Instant UPI / QR Code",
        badge: "Most Popular",
        desc: "Google Pay, PhonePe, Paytm, BHIM",
        enabled: true
      },
      {
        id: "card",
        name: "Credit / Debit Card",
        badge: "All Major Cards",
        desc: "Visa, MasterCard, RuPay, Maestro",
        enabled: true
      },
      {
        id: "netbanking",
        name: "Net Banking",
        badge: "50+ Banks",
        desc: "SBI, HDFC, ICICI, Axis, Canara & more",
        enabled: true
      },
      {
        id: "offline",
        name: "Bank Challan / Campus Cash",
        badge: "Offline Counter",
        desc: "Pay directly at campus admissions cash counter",
        enabled: true
      }
    ]
  };

  const [form, setForm] = useState<ApplyOnlinePortalConfig>(() => {
    return admissionsContent?.applyOnline ? { ...defaultConfig, ...admissionsContent.applyOnline } : defaultConfig;
  });

  const [activeSubPanel, setActiveSubPanel] = useState<
    "global" | "step1" | "step2" | "step3" | "step4" | "step5" | "enquiry" | "preview"
  >("global");

  // Temporary inputs
  const [newStateName, setNewStateName] = useState("");
  const [newGenderOption, setNewGenderOption] = useState("");
  const [newCategoryOption, setNewCategoryOption] = useState("");
  const [newPhoneInput, setNewPhoneInput] = useState("");

  // New Document Input
  const [newDocLabel, setNewDocLabel] = useState("");
  const [newDocDesc, setNewDocDesc] = useState("");
  const [newDocRequired, setNewDocRequired] = useState(true);
  const [newDocFormats, setNewDocFormats] = useState("PDF, JPG, PNG");
  const [newDocSizeMb, setNewDocSizeMb] = useState(5);

  // Preview simulator step
  const [previewSimStep, setPreviewSimStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  const handleSave = () => {
    const updated: typeof admissionsContent = {
      ...admissionsContent,
      applyOnline: form
    };
    updateAdmissionsContent(updated);
    notifySave("Apply Online 5-Step Portal configuration published successfully!");
  };

  const handleReset = () => {
    if (window.confirm("Reset all 5 steps of the Apply Online portal to university defaults?")) {
      setForm(defaultConfig);
      const updated = {
        ...admissionsContent,
        applyOnline: defaultConfig
      };
      updateAdmissionsContent(updated);
      notifySave("Apply Online portal reset to default configuration!");
    }
  };

  // State List CRUD
  const handleAddState = () => {
    if (!newStateName.trim()) return;
    setForm((prev) => ({
      ...prev,
      statesList: [...prev.statesList, newStateName.trim()]
    }));
    setNewStateName("");
  };

  const handleDeleteState = (index: number) => {
    setForm((prev) => ({
      ...prev,
      statesList: prev.statesList.filter((_, i) => i !== index)
    }));
  };

  // Document List CRUD
  const handleAddDocument = () => {
    if (!newDocLabel.trim()) return;
    const newDoc: ApplyOnlineDocumentItem = {
      id: `doc_${Date.now()}`,
      label: newDocLabel.trim(),
      description: newDocDesc.trim() || "Uploaded document proof",
      required: newDocRequired,
      allowedFormats: newDocFormats.trim() || "PDF, JPG",
      maxSizeMb: newDocSizeMb || 5
    };
    setForm((prev) => ({
      ...prev,
      documentsList: [...prev.documentsList, newDoc]
    }));
    setNewDocLabel("");
    setNewDocDesc("");
  };

  const handleDeleteDocument = (id: string) => {
    setForm((prev) => ({
      ...prev,
      documentsList: prev.documentsList.filter((d) => d.id !== id)
    }));
  };

  // Phone list CRUD
  const handleAddPhone = () => {
    if (!newPhoneInput.trim()) return;
    setForm((prev) => ({
      ...prev,
      floatingEnquiryPhones: [...prev.floatingEnquiryPhones, newPhoneInput.trim()]
    }));
    setNewPhoneInput("");
  };

  const handleDeletePhone = (index: number) => {
    setForm((prev) => ({
      ...prev,
      floatingEnquiryPhones: prev.floatingEnquiryPhones.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in text-left font-[var(--font-poppins)]">
      <SectionHeader
        title="Apply Online 5-Step Portal CMS"
        subtitle="Full administrative control for all 5 applicant registration steps: 1 REGISTER, 2 VERIFY, 3 FORM, 4 DOCUMENTS, 5 PAYMENT + Floating Enquiry Drawer"
        icon={GraduationCap}
        onSave={handleSave}
        saveSuccess={false}
        onReset={handleReset}
        resetLabel="Reset Portal Defaults"
      />

      {/* Sub-panels Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: "global", label: "🌟 Page & Global Fee", icon: Sparkles },
          { id: "step1", label: "1️⃣ Step 1: REGISTER", icon: UserPlus },
          { id: "step2", label: "2️⃣ Step 2: VERIFY OTP", icon: ShieldCheck },
          { id: "step3", label: "3️⃣ Step 3: FORM DETAILS", icon: FileText },
          { id: "step4", label: "4️⃣ Step 4: DOCUMENTS", icon: UploadCloud },
          { id: "step5", label: "5️⃣ Step 5: PAYMENT", icon: CreditCard },
          { id: "enquiry", label: "💬 Floating Enquiry Badge", icon: Phone },
          { id: "preview", label: "👁️ Interactive Live Preview", icon: Eye }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubPanel === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubPanel(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#072A6C] text-white shadow-sm shadow-[#072A6C]/30"
                  : "bg-white text-gray-600 hover:bg-slate-100 border border-gray-200"
              }`}
            >
              <Icon size={14} className={isActive ? "text-[#D4AF37]" : "text-gray-400"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* 1. GLOBAL & PAGE HEADER PANEL                                         */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeSubPanel === "global" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-[#D4AF37]" />
              <h3 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider">
                Page Header & Global Admission Settings
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-200">
              Route: /admissions/apply
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Top Section Badge Text</label>
              <input
                type="text"
                value={form.headerBadge}
                onChange={(e) => setForm({ ...form, headerBadge: e.target.value })}
                placeholder="ADMISSIONS"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C] font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Academic Session Year</label>
              <input
                type="text"
                value={form.sessionYear}
                onChange={(e) => setForm({ ...form, sessionYear: e.target.value })}
                placeholder="2026-27"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C] font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Main Heading</label>
              <input
                type="text"
                value={form.headerTitle}
                onChange={(e) => setForm({ ...form, headerTitle: e.target.value })}
                placeholder="Apply Online"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C] font-bold text-[#072A6C]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Online Application Fee (₹ INR)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                <input
                  type="number"
                  value={form.applicationFee}
                  onChange={(e) => setForm({ ...form, applicationFee: Number(e.target.value) || 0 })}
                  placeholder="1000"
                  className="w-full h-10 pl-7 pr-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C] font-bold text-[#072A6C]"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">Header Subtitle & Instructions</label>
              <textarea
                rows={2}
                value={form.headerSubtitle}
                onChange={(e) => setForm({ ...form, headerSubtitle: e.target.value })}
                placeholder="Start your journey today. Fill out our online application form to secure your seat."
                className="w-full p-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* 2. STEP 1: REGISTER CMS PANEL                                         */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeSubPanel === "step1" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <UserPlus size={18} className="text-[#072A6C]" />
              <h3 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider">
                Step 1: Register Yourself CMS Settings
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
              Matches Screenshot (media_1789894063332.png)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Form Section Heading</label>
              <input
                type="text"
                value={form.step1Heading}
                onChange={(e) => setForm({ ...form, step1Heading: e.target.value })}
                placeholder="REGISTER YOURSELF"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C] font-bold text-[#072A6C]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Submit Button Label</label>
              <input
                type="text"
                value={form.step1ButtonText}
                onChange={(e) => setForm({ ...form, step1ButtonText: e.target.value })}
                placeholder="REGISTER & SEND VERIFICATION CODE"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C] font-bold text-[#D4AF37]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">Subtext / Helper Description</label>
              <input
                type="text"
                value={form.step1Subheading}
                onChange={(e) => setForm({ ...form, step1Subheading: e.target.value })}
                placeholder="Create your account to start the digital admission journey."
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C]"
              />
            </div>
          </div>

          {/* State Options Management */}
          <div className="pt-4 border-t border-gray-100">
            <label className="text-xs font-bold text-gray-700 block mb-2">
              Indian States & Union Territories Dropdown List ({form.statesList.length} States)
            </label>
            
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newStateName}
                onChange={(e) => setNewStateName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddState(); } }}
                placeholder="Enter state name (e.g. Goa, Punjab)"
                className="flex-1 h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C]"
              />
              <button
                type="button"
                onClick={handleAddState}
                className="px-4 h-9 bg-[#072A6C] hover:bg-[#D4AF37] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Add State
              </button>
            </div>

            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 bg-slate-50 rounded-xl border border-gray-200">
              {form.statesList.map((st, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 text-gray-800 text-xs font-medium rounded-lg shadow-xs"
                >
                  <span>{st}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteState(idx)}
                    className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                    title="Remove state"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* 3. STEP 2: VERIFY OTP CMS PANEL                                      */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeSubPanel === "step2" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#072A6C]" />
              <h3 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider">
                Step 2: Verify Contact & OTP CMS Settings
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
              2-Factor Auth Simulation
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Section Heading</label>
              <input
                type="text"
                value={form.step2Heading}
                onChange={(e) => setForm({ ...form, step2Heading: e.target.value })}
                placeholder="VERIFY YOUR CONTACT"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C] font-bold text-[#072A6C]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Submit Button Text</label>
              <input
                type="text"
                value={form.step2ButtonText}
                onChange={(e) => setForm({ ...form, step2ButtonText: e.target.value })}
                placeholder="VERIFY CODE & PROCEED TO FORM"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C] font-bold text-[#D4AF37]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Sandbox Test OTP / Helper Note</label>
              <input
                type="text"
                value={form.step2HelperText}
                onChange={(e) => setForm({ ...form, step2HelperText: e.target.value })}
                placeholder="Default sandbox OTP: 123456 (or any 6-digit code)"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C] text-gray-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">OTP Resend Timer (Seconds)</label>
              <input
                type="number"
                value={form.step2ResendSeconds}
                onChange={(e) => setForm({ ...form, step2ResendSeconds: Number(e.target.value) || 30 })}
                placeholder="30"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">Subtitle / Instructions</label>
              <textarea
                rows={2}
                value={form.step2Subheading}
                onChange={(e) => setForm({ ...form, step2Subheading: e.target.value })}
                placeholder="Enter the 6-digit verification code sent to your registered mobile number & email address."
                className="w-full p-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* 4. STEP 3: FORM DETAILS CMS PANEL                                     */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeSubPanel === "step3" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-[#072A6C]" />
              <h3 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider">
                Step 3: Student & Academic Application Form CMS
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-purple-50 text-purple-800 rounded-full border border-purple-200">
              Personal & Academic Details
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Section Heading</label>
              <input
                type="text"
                value={form.step3Heading}
                onChange={(e) => setForm({ ...form, step3Heading: e.target.value })}
                placeholder="STUDENT & ACADEMIC DETAILS"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C] font-bold text-[#072A6C]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Submit Button Text</label>
              <input
                type="text"
                value={form.step3ButtonText}
                onChange={(e) => setForm({ ...form, step3ButtonText: e.target.value })}
                placeholder="SAVE DETAILS & PROCEED TO DOCUMENTS"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C] font-bold text-[#D4AF37]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">Subtitle / Instructions</label>
              <textarea
                rows={2}
                value={form.step3Subheading}
                onChange={(e) => setForm({ ...form, step3Subheading: e.target.value })}
                placeholder="Fill in your parent information, communication address, and qualifying examination marks."
                className="w-full p-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C]"
              />
            </div>
          </div>

          {/* Gender & Category Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            {/* Gender List */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">Gender Options</label>
              <div className="flex flex-wrap gap-2">
                {form.genderOptions.map((g, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-100 text-gray-800 text-xs font-medium rounded-lg">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Category List */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">Reservation Categories</label>
              <div className="flex flex-wrap gap-2">
                {form.categoryOptions.map((c, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-100 text-gray-800 text-xs font-medium rounded-lg">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* 5. STEP 4: DOCUMENTS CMS PANEL                                        */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeSubPanel === "step4" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <UploadCloud size={18} className="text-[#072A6C]" />
              <h3 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider">
                Step 4: Document Requirements & Uploads CMS
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-indigo-50 text-indigo-800 rounded-full border border-indigo-200">
              {form.documentsList.length} Required Documents
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Section Heading</label>
              <input
                type="text"
                value={form.step4Heading}
                onChange={(e) => setForm({ ...form, step4Heading: e.target.value })}
                placeholder="UPLOAD DOCUMENTS"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C] font-bold text-[#072A6C]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Submit Button Text</label>
              <input
                type="text"
                value={form.step4ButtonText}
                onChange={(e) => setForm({ ...form, step4ButtonText: e.target.value })}
                placeholder="SAVE DOCUMENTS & PROCEED TO PAYMENT"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C] font-bold text-[#D4AF37]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">Subtitle / Instructions</label>
              <textarea
                rows={2}
                value={form.step4Subheading}
                onChange={(e) => setForm({ ...form, step4Subheading: e.target.value })}
                placeholder="Attach self-attested digital copies of your marksheets and government ID proofs."
                className="w-full p-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C]"
              />
            </div>
          </div>

          {/* Add New Document Slot */}
          <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-3">
            <h4 className="text-xs font-bold text-[#072A6C] flex items-center gap-1.5">
              <Plus size={14} /> Add New Document Requirement Slot
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  value={newDocLabel}
                  onChange={(e) => setNewDocLabel(e.target.value)}
                  placeholder="Document Name (e.g. Migration Certificate / TC)"
                  className="w-full h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={newDocFormats}
                  onChange={(e) => setNewDocFormats(e.target.value)}
                  placeholder="Allowed Formats (e.g. PDF, JPG)"
                  className="w-full h-9 px-3 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newDocRequired}
                    onChange={(e) => setNewDocRequired(e.target.checked)}
                    className="w-4 h-4 text-[#072A6C] rounded"
                  />
                  <span>Mandatory Certificate</span>
                </label>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>Max Size:</span>
                  <input
                    type="number"
                    value={newDocSizeMb}
                    onChange={(e) => setNewDocSizeMb(Number(e.target.value) || 5)}
                    className="w-12 h-7 px-1.5 text-xs text-center border border-gray-200 rounded"
                  />
                  <span>MB</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddDocument}
                className="px-4 py-1.5 bg-[#072A6C] hover:bg-[#D4AF37] text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                Add Slot
              </button>
            </div>
          </div>

          {/* Document Checklist Items */}
          <div className="space-y-2.5">
            {form.documentsList.map((doc, idx) => (
              <div
                key={doc.id || idx}
                className="p-3.5 bg-slate-50 hover:bg-white border border-gray-200 rounded-xl transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#072A6C] flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-bold text-gray-900">{doc.label}</h5>
                      {doc.required && (
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 font-light mt-0.5">
                      {doc.description} • Formats: <strong>{doc.allowedFormats}</strong> • Max: <strong>{doc.maxSizeMb}MB</strong>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                  title="Delete Document Requirement"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* 6. STEP 5: PAYMENT CMS PANEL                                          */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeSubPanel === "step5" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <CreditCard size={18} className="text-[#072A6C]" />
              <h3 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider">
                Step 5: Application Fee Payment & Confirmation CMS
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
              Fee: ₹{form.applicationFee}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Section Heading</label>
              <input
                type="text"
                value={form.step5Heading}
                onChange={(e) => setForm({ ...form, step5Heading: e.target.value })}
                placeholder="APPLICATION FEE PAYMENT"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C] font-bold text-[#072A6C]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Payment Button Text</label>
              <input
                type="text"
                value={form.step5ButtonText}
                onChange={(e) => setForm({ ...form, step5ButtonText: e.target.value })}
                placeholder="PROCEED TO PAY ₹1,000"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C] font-bold text-[#D4AF37]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">Payment Subtitle / Instructions</label>
              <textarea
                rows={2}
                value={form.step5Subheading}
                onChange={(e) => setForm({ ...form, step5Subheading: e.target.value })}
                placeholder="Complete your online application fee transaction to generate your official Admission Enrollment Slip."
                className="w-full p-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Success Heading Title</label>
              <input
                type="text"
                value={form.successTitle}
                onChange={(e) => setForm({ ...form, successTitle: e.target.value })}
                placeholder="Application Submitted Successfully!"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C] font-bold text-emerald-700"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Success Subtitle</label>
              <input
                type="text"
                value={form.successSubtitle}
                onChange={(e) => setForm({ ...form, successSubtitle: e.target.value })}
                placeholder="Your application has been received and registered into the Chalapathi University admissions database."
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C]"
              />
            </div>
          </div>

          {/* Payment Modes Toggle */}
          <div className="pt-4 border-t border-gray-100">
            <label className="text-xs font-bold text-gray-700 block mb-3">
              Configured Payment Gateway Modes
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {form.paymentModes.map((pm, idx) => (
                <div
                  key={pm.id}
                  className="p-3.5 bg-slate-50 border border-gray-200 rounded-xl flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-xs font-bold text-gray-800">{pm.name}</h5>
                      <span className="text-[9px] px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-semibold">
                        {pm.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 font-light mt-0.5">{pm.desc}</p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pm.enabled}
                      onChange={(e) => {
                        const updated = [...form.paymentModes];
                        updated[idx] = { ...updated[idx], enabled: e.target.checked };
                        setForm({ ...form, paymentModes: updated });
                      }}
                      className="w-4 h-4 text-[#072A6C] rounded"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* 7. FLOATING ADMISSION ENQUIRY CMS PANEL                               */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeSubPanel === "enquiry" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Phone size={18} className="text-[#072A6C]" />
              <h3 className="font-extrabold text-sm text-[#072A6C] uppercase tracking-wider">
                Floating Admission Enquiry Badge & Helpdesk Coordinates
              </h3>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-200">
              Right Edge Vertical Badge
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Vertical Badge Label</label>
              <input
                type="text"
                value={form.floatingEnquiryButtonText}
                onChange={(e) => setForm({ ...form, floatingEnquiryButtonText: e.target.value })}
                placeholder="ADMISSION ENQUIRY"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C] font-black text-[#072A6C]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">Helpdesk Support Email</label>
              <input
                type="email"
                value={form.floatingEnquiryEmail}
                onChange={(e) => setForm({ ...form, floatingEnquiryEmail: e.target.value })}
                placeholder="admissions@chalapathiengg.ac.in"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-700 block mb-1">Admissions Office Timings</label>
              <input
                type="text"
                value={form.floatingEnquiryTimings}
                onChange={(e) => setForm({ ...form, floatingEnquiryTimings: e.target.value })}
                placeholder="Mon - Sat: 9:00 AM - 5:30 PM"
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C]"
              />
            </div>
          </div>

          {/* Admission Phone Numbers CRUD */}
          <div className="pt-4 border-t border-gray-100">
            <label className="text-xs font-bold text-gray-700 block mb-2">
              Helpdesk Contact Numbers ({form.floatingEnquiryPhones.length})
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newPhoneInput}
                onChange={(e) => setNewPhoneInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddPhone(); } }}
                placeholder="+91 91773 24999"
                className="flex-1 h-9 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#072A6C]"
              />
              <button
                type="button"
                onClick={handleAddPhone}
                className="px-4 h-9 bg-[#072A6C] hover:bg-[#D4AF37] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus size={14} /> Add Phone
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.floatingEnquiryPhones.map((ph, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-gray-800 text-xs font-bold rounded-lg"
                >
                  <Phone size={12} className="text-[#072A6C]" />
                  <span>{ph}</span>
                  <button
                    type="button"
                    onClick={() => handleDeletePhone(idx)}
                    className="text-gray-400 hover:text-red-600 transition-colors ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* 8. INTERACTIVE LIVE 5-STEP SIMULATOR / PREVIEW                        */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {activeSubPanel === "preview" && (
        <div className="space-y-6">
          <div className="bg-[#072A6C] text-white p-6 rounded-2xl shadow-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">
                {form.headerBadge}
              </span>
              <h3 className="text-2xl font-black mt-0.5">{form.headerTitle}</h3>
              <p className="text-xs text-blue-200 font-light mt-1 max-w-xl">
                {form.headerSubtitle}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-gray-300 block">Registration Fee</span>
              <span className="text-2xl font-black text-[#D4AF37]">₹{form.applicationFee}</span>
            </div>
          </div>

          {/* Stepper Buttons for Preview */}
          <div className="grid grid-cols-5 gap-2">
            {[
              { num: 1, label: "REGISTER" },
              { num: 2, label: "VERIFY" },
              { num: 3, label: "FORM" },
              { num: 4, label: "DOCUMENTS" },
              { num: 5, label: "PAYMENT" }
            ].map((st) => (
              <button
                key={st.num}
                onClick={() => setPreviewSimStep(st.num as any)}
                className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  previewSimStep === st.num
                    ? "bg-[#D4AF37] text-white shadow-sm"
                    : "bg-white text-gray-600 hover:bg-slate-100 border border-gray-200"
                }`}
              >
                <span>{st.num}</span>
                <span>{st.label}</span>
              </button>
            ))}
          </div>

          {/* Simulator Card Box matching Screenshot */}
          <div className="max-w-md mx-auto bg-white rounded-[24px] border border-gray-200 shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-center gap-3 pb-3 border-b border-gray-100">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                    previewSimStep === n
                      ? "bg-[#D4AF37] text-white"
                      : previewSimStep > n
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {n}
                </div>
              ))}
            </div>

            {/* Step 1 in Simulator */}
            {previewSimStep === 1 && (
              <div className="space-y-3 text-left">
                <h4 className="text-sm font-black text-[#072A6C] uppercase">{form.step1Heading}</h4>
                <p className="text-[11px] text-gray-400 font-light">{form.step1Subheading}</p>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-1">Full Name *</label>
                    <input disabled placeholder="Enter full name" className="w-full h-9 px-3 border border-gray-200 rounded-lg bg-gray-50 text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-1">Email Address *</label>
                    <input disabled placeholder="name@domain.com" className="w-full h-9 px-3 border border-gray-200 rounded-lg bg-gray-50 text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-1">Mobile Number *</label>
                    <input disabled placeholder="10-digit phone number" className="w-full h-9 px-3 border border-gray-200 rounded-lg bg-gray-50 text-xs" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-600 block mb-1">State *</label>
                    <select disabled className="w-full h-9 px-3 border border-gray-200 rounded-lg bg-gray-50 text-xs font-medium">
                      {form.statesList.map((st, i) => (
                        <option key={i}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPreviewSimStep(2)}
                  className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#c59e2b] text-white text-xs font-bold rounded-xl transition-all mt-4 cursor-pointer"
                >
                  {form.step1ButtonText}
                </button>
              </div>
            )}

            {/* Step 2 in Simulator */}
            {previewSimStep === 2 && (
              <div className="space-y-3 text-left">
                <h4 className="text-sm font-black text-[#072A6C] uppercase">{form.step2Heading}</h4>
                <p className="text-[11px] text-gray-400 font-light">{form.step2Subheading}</p>
                <div className="p-3 bg-amber-50 text-amber-900 rounded-lg text-xs">
                  {form.step2HelperText}
                </div>
                <div className="flex justify-center gap-2 py-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="w-9 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center font-bold text-sm bg-gray-50">
                      •
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewSimStep(3)}
                  className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#c59e2b] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  {form.step2ButtonText}
                </button>
              </div>
            )}

            {/* Step 3 in Simulator */}
            {previewSimStep === 3 && (
              <div className="space-y-3 text-left">
                <h4 className="text-sm font-black text-[#072A6C] uppercase">{form.step3Heading}</h4>
                <p className="text-[11px] text-gray-400 font-light">{form.step3Subheading}</p>
                <div className="space-y-2 text-xs">
                  <input disabled placeholder="Parent / Guardian Full Name *" className="w-full h-9 px-3 border border-gray-200 rounded-lg bg-gray-50 text-xs" />
                  <input disabled placeholder="10+2 / Intermediate Marks (%)" className="w-full h-9 px-3 border border-gray-200 rounded-lg bg-gray-50 text-xs" />
                  <textarea disabled placeholder="Permanent Residential Address" rows={2} className="w-full p-2 border border-gray-200 rounded-lg bg-gray-50 text-xs" />
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewSimStep(4)}
                  className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#c59e2b] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  {form.step3ButtonText}
                </button>
              </div>
            )}

            {/* Step 4 in Simulator */}
            {previewSimStep === 4 && (
              <div className="space-y-3 text-left">
                <h4 className="text-sm font-black text-[#072A6C] uppercase">{form.step4Heading}</h4>
                <p className="text-[11px] text-gray-400 font-light">{form.step4Subheading}</p>
                <div className="space-y-1.5 text-xs max-h-40 overflow-y-auto">
                  {form.documentsList.map((d, i) => (
                    <div key={i} className="p-2 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-between">
                      <span className="truncate text-[11px] font-semibold">{d.label}</span>
                      <span className="text-[9px] px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold">Attached</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewSimStep(5)}
                  className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#c59e2b] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  {form.step4ButtonText}
                </button>
              </div>
            )}

            {/* Step 5 in Simulator */}
            {previewSimStep === 5 && (
              <div className="space-y-3 text-left">
                <h4 className="text-sm font-black text-[#072A6C] uppercase">{form.step5Heading}</h4>
                <p className="text-[11px] text-gray-400 font-light">{form.step5Subheading}</p>
                <div className="p-4 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 text-center space-y-1">
                  <span className="text-[10px] uppercase font-bold text-emerald-700">Total Application Fee</span>
                  <div className="text-2xl font-black text-[#072A6C]">₹{form.applicationFee}</div>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Simulation Completed! Application generated successfully.")}
                  className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#c59e2b] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  {form.step5ButtonText}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

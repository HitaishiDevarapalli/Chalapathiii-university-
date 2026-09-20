import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  ShieldCheck,
  FileText,
  UploadCloud,
  CreditCard,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Mail,
  MapPin,
  Building,
  GraduationCap,
  Calendar,
  Lock,
  Download,
  Printer,
  Check,
  HelpCircle,
  Phone,
  X
} from "lucide-react";
import { useData, DEFAULT_ADMISSIONS_CONTENT } from "../../context/DataContext";

export const ApplyOnlineView: React.FC = () => {
  const { programs, addOnlineApplication, admissionsContent } = useData();

  const applyConfig = admissionsContent?.applyOnline || DEFAULT_ADMISSIONS_CONTENT.applyOnline || {
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

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [generatedAppNo, setGeneratedAppNo] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEnquiryDrawer, setShowEnquiryDrawer] = useState(false);

  // Step 1: Registration Form State
  const [regForm, setRegForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    state: applyConfig.statesList[0] || "Andhra Pradesh",
    program: programs[0]?.title || "B.Tech - Computer Science and Engineering",
    qualification: "Class 12 / Intermediate",
    yearOfPassing: "2026"
  });

  // Step 2: OTP State
  const [otpValue, setOtpValue] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  // Step 3: Application Details State
  const [appDetails, setAppDetails] = useState({
    parentName: "",
    gender: "Male",
    dob: "2007-06-15",
    address: "",
    category: "General",
    interMarksPercentage: "88%"
  });

  // Step 4: Documents Upload State
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({
    tenthMarksheet: "10th_SSC_Marksheet.pdf",
    twelfthMarksheet: "12th_Intermediate_Memo.pdf",
    photoId: "Aadhaar_Card.pdf"
  });

  // Step 5: Payment State
  const [paymentMode, setPaymentMode] = useState<string>("upi");
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  // Helper for OTP Input
  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otpValue];
    newOtp[index] = val;
    setOtpValue(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.fullName || !regForm.email || !regForm.mobile) {
      alert("Please fill all required fields marked with *");
      return;
    }
    if (regForm.mobile.length < 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    setCurrentStep(2);
  };

  const handleVerifyOtp = () => {
    const fullOtp = otpValue.join("");
    if (fullOtp.length < 4 && fullOtp !== "1234" && fullOtp !== "123456") {
      setOtpError(applyConfig.step2HelperText || "Please enter verification code (123456)");
      return;
    }
    setOtpError("");
    setOtpVerified(true);
    setTimeout(() => {
      setCurrentStep(3);
    }, 600);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appDetails.parentName || !appDetails.address) {
      alert("Please complete parent and address details");
      return;
    }
    setCurrentStep(4);
  };

  const handleStep4Submit = () => {
    setCurrentStep(5);
  };

  const handleFinalPaymentAndSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const appNo = addOnlineApplication({
        fullName: regForm.fullName,
        email: regForm.email,
        mobile: regForm.mobile,
        state: regForm.state,
        city: "Guntur",
        program: regForm.program,
        qualification: regForm.qualification,
        yearOfPassing: regForm.yearOfPassing,
        parentName: appDetails.parentName,
        gender: appDetails.gender,
        dob: appDetails.dob,
        applicationFeePaid: true,
        transactionId: "TXN_" + Math.floor(1000000 + Math.random() * 9000000)
      });
      setGeneratedAppNo(appNo);
      setPaymentCompleted(true);
      setIsSubmitting(false);
    }, 1200);
  };

  const stepsList = [
    { num: 1, label: "REGISTER" },
    { num: 2, label: "VERIFY" },
    { num: 3, label: "FORM" },
    { num: 4, label: "DOCUMENTS" },
    { num: 5, label: "PAYMENT" }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-[var(--font-poppins)] relative text-left py-8 px-4 sm:px-8 select-none">
      
      {/* Outer wrapper max width matching screenshot media_1789894063332.png */}
      <div className="max-w-[1320px] mx-auto bg-white rounded-[28px] border border-gray-100 shadow-sm p-6 sm:p-12 relative min-h-[85vh]">
        
        {/* Header Section (Matching screenshot media_1789894063332.png 1:1) */}
        <div className="mb-10 text-left">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#D4AF37] block mb-1">
            {applyConfig.headerBadge || "ADMISSIONS"}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#072A6C] tracking-tight leading-tight">
            {applyConfig.headerTitle || "Apply Online"}
          </h1>
          <p className="text-xs text-gray-500 font-light mt-1.5 max-w-xl font-[var(--font-inter)] leading-relaxed">
            {applyConfig.headerSubtitle || "Start your journey today. Fill out our online application form to secure your seat."}
          </p>
        </div>

        {/* Centered Step-by-Step Card (Matching media_1789894063332.png) */}
        <div className="max-w-[540px] mx-auto bg-white rounded-[24px] border border-gray-100/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 text-left relative z-10">
          
          {/* Horizontal Stepper Row */}
          <div className="flex items-center justify-between gap-1 pb-8 mb-6 border-b border-gray-50">
            {stepsList.map((step) => {
              const isCurrent = currentStep === step.num;
              const isDone = currentStep > step.num;

              return (
                <div key={step.num} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-[#D4AF37] text-white shadow-sm ring-4 ring-[#D4AF37]/15 scale-105"
                        : isDone
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {isDone ? <Check size={13} /> : step.num}
                  </div>
                  <span
                    className={`text-[9px] font-extrabold uppercase tracking-wider mt-2 text-center ${
                      isCurrent
                        ? "text-[#D4AF37]"
                        : isDone
                        ? "text-emerald-700"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {/* ────────────────────────────────────────────────────────── */}
            {/* STEP 1: REGISTER YOURSELF                                  */}
            {/* ────────────────────────────────────────────────────────── */}
            {currentStep === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                onSubmit={handleStep1Submit}
                className="space-y-5 text-left"
              >
                <div>
                  <h2 className="text-sm font-extrabold text-[#072A6C] tracking-wide uppercase">
                    {applyConfig.step1Heading || "REGISTER YOURSELF"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-light mt-1 font-[var(--font-inter)]">
                    {applyConfig.step1Subheading || "Create your account to start the digital admission journey."}
                  </p>
                </div>

                <div className="space-y-4 pt-1 font-[var(--font-inter)]">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
                      Full Name <span className="text-[#D4AF37]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter full name"
                      value={regForm.fullName}
                      onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs text-gray-800 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 transition-all font-medium placeholder:text-gray-400"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
                      Email Address <span className="text-[#D4AF37]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@domain.com"
                      value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs text-gray-800 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 transition-all font-medium placeholder:text-gray-400"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
                      Mobile Number <span className="text-[#D4AF37]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit phone number"
                      value={regForm.mobile}
                      onChange={(e) => setRegForm({ ...regForm, mobile: e.target.value.replace(/\D/g, "") })}
                      className="w-full px-4 py-2.5 text-xs text-gray-800 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 transition-all font-medium placeholder:text-gray-400"
                    />
                  </div>

                  {/* State Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1.5">
                      State <span className="text-[#D4AF37]">*</span>
                    </label>
                    <select
                      value={regForm.state}
                      onChange={(e) => setRegForm({ ...regForm, state: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs text-gray-800 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/15 transition-all font-medium cursor-pointer"
                    >
                      {(applyConfig.statesList || []).map((st, i) => (
                        <option key={i} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Main Action Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-[#D4AF37] hover:bg-[#c49f2e] active:scale-98 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all cursor-pointer font-[var(--font-poppins)]"
                  >
                    {applyConfig.step1ButtonText || "REGISTER & SEND VERIFICATION CODE"}
                  </button>
                </div>
              </motion.form>
            )}

            {/* ────────────────────────────────────────────────────────── */}
            {/* STEP 2: VERIFY OTP                                         */}
            {/* ────────────────────────────────────────────────────────── */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-5 text-left"
              >
                <div>
                  <h2 className="text-sm font-extrabold text-[#072A6C] tracking-wide uppercase">
                    {applyConfig.step2Heading || "VERIFY YOUR CONTACT"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-light mt-1 font-[var(--font-inter)]">
                    {applyConfig.step2Subheading || "Enter the 6-digit verification code sent to your registered mobile number."}
                  </p>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 font-[var(--font-inter)]">
                  {applyConfig.step2HelperText || "Default sandbox verification code is 123456"}
                </div>

                <div className="flex justify-center gap-2 py-2">
                  {otpValue.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      placeholder="•"
                      className="w-10 h-11 text-center text-base font-bold text-[#072A6C] border border-gray-300 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 outline-none bg-slate-50"
                    />
                  ))}
                </div>

                {otpError && <p className="text-xs text-red-500 font-bold text-center">{otpError}</p>}

                {otpVerified ? (
                  <div className="flex items-center justify-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-50 py-2.5 rounded-xl border border-emerald-200">
                    <CheckCircle2 size={16} /> Code Verified! Loading Application Form...
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="w-full py-3 px-4 bg-[#D4AF37] hover:bg-[#c49f2e] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-sm hover:shadow transition-all cursor-pointer font-[var(--font-poppins)]"
                    >
                      {applyConfig.step2ButtonText || "VERIFY CODE & PROCEED TO FORM"}
                    </button>
                    <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="hover:text-[#072A6C] font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <ArrowLeft size={12} /> Edit Details
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpValue(["1", "2", "3", "4", "5", "6"]);
                        }}
                        className="text-[#072A6C] font-bold hover:underline cursor-pointer"
                      >
                        Auto-fill 123456
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ────────────────────────────────────────────────────────── */}
            {/* STEP 3: APPLICATION FORM DETAILS                           */}
            {/* ────────────────────────────────────────────────────────── */}
            {currentStep === 3 && (
              <motion.form
                key="step3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                onSubmit={handleStep3Submit}
                className="space-y-4 text-left font-[var(--font-inter)]"
              >
                <div>
                  <h2 className="text-sm font-extrabold text-[#072A6C] tracking-wide uppercase font-[var(--font-poppins)]">
                    {applyConfig.step3Heading || "STUDENT & ACADEMIC DETAILS"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-light mt-1">
                    {applyConfig.step3Subheading || "Fill in your parent information, communication address, and academic scores."}
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Father's / Mother's / Guardian Name <span className="text-[#D4AF37]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. V. Ramana Reddy"
                      value={appDetails.parentName}
                      onChange={(e) => setAppDetails({ ...appDetails, parentName: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-[#D4AF37] bg-white font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Gender *</label>
                      <select
                        value={appDetails.gender}
                        onChange={(e) => setAppDetails({ ...appDetails, gender: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none bg-white font-medium"
                      >
                        {(applyConfig.genderOptions || ["Male", "Female", "Other"]).map((g, i) => (
                          <option key={i} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Category</label>
                      <select
                        value={appDetails.category}
                        onChange={(e) => setAppDetails({ ...appDetails, category: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none bg-white font-medium"
                      >
                        {(applyConfig.categoryOptions || ["General", "OBC", "SC", "ST", "EWS"]).map((c, i) => (
                          <option key={i} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Program Choice *</label>
                    <select
                      value={regForm.program}
                      onChange={(e) => setRegForm({ ...regForm, program: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-bold text-[#072A6C] border border-gray-200 rounded-xl outline-none bg-white"
                    >
                      {programs.map((p, idx) => (
                        <option key={idx} value={p.title}>{p.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Permanent Residential Address *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Door No, Street name, City/Town, Pincode"
                      value={appDetails.address}
                      onChange={(e) => setAppDetails({ ...appDetails, address: e.target.value })}
                      className="w-full p-2.5 text-xs border border-gray-200 rounded-xl outline-none bg-white font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer font-[var(--font-poppins)]"
                  >
                    {applyConfig.step3ButtonText || "SAVE DETAILS & PROCEED TO DOCUMENTS"}
                  </button>
                </div>
              </motion.form>
            )}

            {/* ────────────────────────────────────────────────────────── */}
            {/* STEP 4: UPLOAD DOCUMENTS                                   */}
            {/* ────────────────────────────────────────────────────────── */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4 text-left"
              >
                <div>
                  <h2 className="text-sm font-extrabold text-[#072A6C] tracking-wide uppercase">
                    {applyConfig.step4Heading || "UPLOAD DOCUMENTS"}
                  </h2>
                  <p className="text-[11px] text-gray-500 font-light mt-1 font-[var(--font-inter)]">
                    {applyConfig.step4Subheading || "Attach self-attested digital copies of your marksheets and government ID proofs."}
                  </p>
                </div>

                <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1">
                  {(applyConfig.documentsList || []).map((doc, idx) => {
                    const uploaded = uploadedDocs[doc.id] || "Attached Memo.pdf";
                    return (
                      <div key={doc.id || idx} className="p-3 bg-slate-50 border border-gray-200 rounded-xl flex items-center justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-gray-800 truncate">{doc.label}</span>
                            {doc.required && <span className="text-red-500 text-xs">*</span>}
                          </div>
                          <span className="text-[10px] text-gray-400 block truncate">{doc.description}</span>
                        </div>
                        <span className="text-[10px] px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full shrink-0 flex items-center gap-1">
                          <Check size={11} /> Attached
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleStep4Submit}
                    className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer font-[var(--font-poppins)]"
                  >
                    {applyConfig.step4ButtonText || "SAVE DOCUMENTS & PROCEED TO PAYMENT"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ────────────────────────────────────────────────────────── */}
            {/* STEP 5: FEE PAYMENT & SLIP                                 */}
            {/* ────────────────────────────────────────────────────────── */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="space-y-4 text-left"
              >
                {!paymentCompleted ? (
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-sm font-extrabold text-[#072A6C] tracking-wide uppercase">
                        {applyConfig.step5Heading || "APPLICATION FEE PAYMENT"}
                      </h2>
                      <p className="text-[11px] text-gray-500 font-light mt-1 font-[var(--font-inter)]">
                        {applyConfig.step5Subheading || "Complete your online application fee transaction to generate your official Admission Enrollment Slip."}
                      </p>
                    </div>

                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 uppercase">Registration Fee</span>
                        <h4 className="text-xs font-bold text-gray-800 mt-0.5">Program: {regForm.program}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-extrabold text-[#072A6C]">
                          ₹{(applyConfig.applicationFee || 1000).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Payment Modes */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-gray-700 uppercase">Select Payment Mode</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(applyConfig.paymentModes || []).filter(m => m.enabled !== false).map((pm) => (
                          <button
                            key={pm.id}
                            type="button"
                            onClick={() => setPaymentMode(pm.id)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              paymentMode === pm.id
                                ? "border-[#072A6C] bg-blue-50/50 ring-2 ring-[#072A6C]"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <h5 className="text-xs font-bold text-[#072A6C]">{pm.name}</h5>
                            <span className="text-[9px] text-gray-400 block">{pm.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(4)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        disabled={isSubmitting}
                        onClick={handleFinalPaymentAndSubmit}
                        className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#c49f2e] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm"
                      >
                        {isSubmitting ? "Processing..." : `CONFIRM & PAY ₹${(applyConfig.applicationFee || 1000).toLocaleString("en-IN")}`}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 space-y-4">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300">
                      <CheckCircle2 size={30} />
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-[#072A6C]">
                        {applyConfig.successTitle || "Application Submitted Successfully!"}
                      </h3>
                      <p className="text-xs text-gray-500 font-light mt-1 max-w-sm mx-auto">
                        {applyConfig.successSubtitle || "Your application has been received and registered into the Chalapathi University admissions database."}
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-sm mx-auto text-left space-y-2 font-mono text-xs">
                      <div className="flex justify-between pb-1 border-b border-slate-200">
                        <span className="text-gray-500">App No:</span>
                        <span className="font-bold text-[#072A6C]">{generatedAppNo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Applicant:</span>
                        <span className="font-bold text-gray-800">{regForm.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Program:</span>
                        <span className="font-bold text-gray-800 truncate max-w-[180px]">{regForm.program}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fee Status:</span>
                        <span className="font-bold text-emerald-600">Paid (₹{applyConfig.applicationFee || 1000})</span>
                      </div>
                    </div>

                    <div className="flex justify-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <Printer size={13} /> Print Slip
                      </button>
                      <Link
                        to="/admissions"
                        className="px-5 py-2 bg-[#072A6C] hover:bg-[#D4AF37] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Back to Overview
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* Floating Vertical ADMISSION ENQUIRY Button on Right Edge (Matching media_1789894063332.png) */}
      <button
        type="button"
        onClick={() => setShowEnquiryDrawer(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-[#072A6C] hover:bg-[#051e4d] text-white font-extrabold text-[11px] tracking-widest px-2.5 py-4 rounded-l-xl shadow-2xl z-40 transition-all hover:pr-3 cursor-pointer outline-none border-l border-y border-white/20"
        style={{ writingMode: "vertical-rl" }}
        title="Open Admission Enquiry"
      >
        <span>{applyConfig.floatingEnquiryButtonText || "ADMISSION ENQUIRY"}</span>
      </button>

      {/* Admission Enquiry Drawer Modal */}
      {showEnquiryDrawer && (
        <>
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 transition-opacity duration-300 cursor-pointer"
            onClick={() => setShowEnquiryDrawer(false)}
          />
          <div
            className="fixed right-0 top-0 bottom-0 w-full max-w-[360px] bg-white shadow-2xl z-50 p-6 flex flex-col justify-between text-left transform transition-transform duration-300 animate-slide-in font-[var(--font-poppins)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 text-[#072A6C]">
                  <Phone size={18} className="text-[#D4AF37]" />
                  <h3 className="font-extrabold text-sm uppercase tracking-wide">
                    {applyConfig.floatingEnquiryButtonText || "ADMISSION ENQUIRY"}
                  </h3>
                </div>
                <button
                  onClick={() => setShowEnquiryDrawer(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer p-1 rounded-full hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="py-5 space-y-4">
                <p className="text-xs text-gray-500 font-light font-[var(--font-inter)] leading-relaxed">
                  Have questions regarding programs, eligibility criteria, or scholarship concessions? Contact our admissions counselors directly.
                </p>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Helpline Numbers</span>
                    <div className="space-y-1">
                      {(applyConfig.floatingEnquiryPhones || ["+91 91773 24999", "+91 863 222 5555"]).map((ph, i) => (
                        <a
                          key={i}
                          href={`tel:${ph.replace(/\s+/g, "")}`}
                          className="block text-xs font-bold text-[#072A6C] hover:text-[#D4AF37] transition-colors"
                        >
                          {ph}
                        </a>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Helpdesk</span>
                    <a
                      href={`mailto:${applyConfig.floatingEnquiryEmail || "admissions@chalapathiengg.ac.in"}`}
                      className="block text-xs font-bold text-[#072A6C] hover:text-[#D4AF37] transition-colors truncate"
                    >
                      {applyConfig.floatingEnquiryEmail || "admissions@chalapathiengg.ac.in"}
                    </a>
                  </div>

                  <div className="p-3 bg-slate-50 border border-gray-100 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Office Hours</span>
                    <p className="text-xs font-semibold text-gray-700">
                      {applyConfig.floatingEnquiryTimings || "Mon - Sat: 9:00 AM - 5:30 PM"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowEnquiryDrawer(false)}
                className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Helpline
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default ApplyOnlineView;

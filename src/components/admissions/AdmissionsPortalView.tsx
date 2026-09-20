"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ShieldCheck, 
  UserPlus, 
  FileText, 
  UploadCloud, 
  CreditCard, 
  Award, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  Check, 
  Smartphone,
  Lock,
  FileCheck,
  Zap,
  Clock,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { useData, DEFAULT_ADMISSIONS_CONTENT } from "../../context/DataContext";

export const AdmissionsPortalView: React.FC = () => {
  const { admissionsContent } = useData();
  const portalData = admissionsContent?.portal || DEFAULT_ADMISSIONS_CONTENT.portal;
  const steps = portalData.steps && portalData.steps.length > 0 ? portalData.steps : DEFAULT_ADMISSIONS_CONTENT.portal.steps;

  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-cycle through steps every 4 seconds unless user interacts
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, steps.length]);

  const current = steps[activeStep] || steps[0];

  return (
    <div className="space-y-16 py-4 font-[var(--font-poppins)] overflow-hidden">
      
      {/* 1. Hero Feature Banner with Animated Light Orbs */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#072A6C] via-[#0D3B8E] to-[#041A45] p-8 md:p-12 text-white shadow-2xl overflow-hidden border border-white/10">
        
        {/* Animated background glow circles */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#D4AF37]/20 blur-3xl pointer-events-none"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none"
        />

        <div className="relative z-10 max-w-4xl space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-black tracking-widest uppercase"
          >
            <Sparkles size={14} className="animate-spin-slow" />
            <span>{portalData.heroBadge || "Academic Session 2026-27 Open"}</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-3xl md:text-5xl font-black tracking-tight leading-tight"
          >
            {portalData.heroTitle ? (
              portalData.heroTitle.includes("Chalapathi University") ? (
                <>
                  {portalData.heroTitle.split("Chalapathi University")[0]}
                  <span className="bg-gradient-to-r from-white via-[#F3E5AB] to-[#D4AF37] bg-clip-text text-transparent">
                    Chalapathi University
                  </span>
                  {portalData.heroTitle.split("Chalapathi University")[1]}
                </>
              ) : (
                portalData.heroTitle
              )
            ) : (
              <>Shape Your Future at <span className="bg-gradient-to-r from-white via-[#F3E5AB] to-[#D4AF37] bg-clip-text text-transparent">Chalapathi University</span></>
            )}
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm md:text-lg text-blue-100/90 font-light leading-relaxed max-w-2xl"
          >
            {portalData.heroSubtitle || "Empowering next-generation innovators with world-class infrastructure, industry-aligned curricula, 100% placement support, and lucrative merit scholarships."}
          </motion.p>

          {/* Quick Stats Ticker */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-center sm:text-left"
          >
            {(portalData.stats || DEFAULT_ADMISSIONS_CONTENT.portal.stats).map((st, idx) => (
              <div key={idx}>
                <p className={`text-2xl md:text-3xl font-extrabold ${idx % 2 === 0 ? "text-[#D4AF37]" : "text-white"}`}>
                  {st.value}
                </p>
                <p className="text-[11px] text-blue-200 font-medium uppercase tracking-wider">
                  {st.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* 2. Three Animated Gateway Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(portalData.gatewayCards || DEFAULT_ADMISSIONS_CONTENT.portal.gatewayCards).map((card, idx) => (
          <motion.div 
            key={card.id || idx}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Link 
              to={card.link || "/admissions/apply"} 
              className={`group relative block p-7 rounded-2xl shadow-xl overflow-hidden min-h-[170px] flex flex-col justify-between border transition-all duration-300 ${
                idx === 0 
                  ? "bg-gradient-to-br from-[#072A6C] to-[#0A3A93] text-white border-blue-400/20" 
                  : "bg-white border-gray-100 hover:border-[#072A6C]/30 hover:shadow-2xl"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  idx === 0 
                    ? "bg-white/15 backdrop-blur-md text-[#D4AF37] border border-white/20" 
                    : idx === 1 
                    ? "bg-[#072A6C]/5 text-[#072A6C]" 
                    : "bg-[#D4AF37]/10 text-[#D4AF37]"
                }`}>
                  {idx === 0 ? <GraduationCap size={20} /> : idx === 1 ? <FileText size={20} /> : <Award size={20} />}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                  idx === 0 
                    ? "bg-[#D4AF37] text-white" 
                    : idx === 1 
                    ? "bg-slate-100 text-slate-600" 
                    : "bg-[#D4AF37]/15 text-[#072A6C]"
                }`}>
                  {card.tag}
                </span>
              </div>
              <div>
                <h4 className={`font-extrabold text-lg md:text-xl transition-colors ${
                  idx === 0 ? "text-white group-hover:text-[#D4AF37]" : "text-[#072A6C]"
                }`}>
                  {card.title}
                </h4>
                <p className={`text-xs font-light mt-1 flex items-center gap-1.5 ${
                  idx === 0 ? "text-blue-200/90" : "text-[#D4AF37] font-semibold"
                }`}>
                  <span>{card.subtitle}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform" />
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* 3. GenRush-Style Interactive Stepper Section */}
      <div 
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="pt-10 border-t border-gray-100 space-y-10"
      >
        
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="px-4 py-1.5 bg-[#072A6C]/10 text-[#072A6C] text-xs font-black tracking-widest rounded-full uppercase">
            How It Works
          </span>
          <h3 className="text-3xl md:text-4xl font-black text-[#072A6C] tracking-tight">
            Admissions Process 2026
          </h3>
          <p className="text-xs md:text-sm text-gray-500 font-light">
            Click any step or watch the automated workflow preview below.
          </p>
        </div>

        {/* GenRush Horizontal Step Node Bar */}
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative flex items-center justify-between">
            
            {/* Background connecting track line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 rounded-full z-0" />
            
            {/* Animated active progress bar */}
            <motion.div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-[#072A6C] via-[#0A3A93] to-[#10B981] rounded-full z-0"
              animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />

            {/* Step Nodes 01 - 05 */}
            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const isPast = index < activeStep;

              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setActiveStep(index);
                    setIsAutoPlaying(false);
                  }}
                  className="relative z-10 flex flex-col items-center group cursor-pointer border-none bg-transparent outline-none"
                >
                  <motion.div 
                    animate={{ scale: isActive ? 1.25 : 1 }}
                    transition={{ duration: 0.3 }}
                    className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center font-black text-xs transition-all duration-300 shadow-md ${
                      isActive 
                        ? "bg-[#10B981] text-white ring-4 ring-[#10B981]/25 shadow-lg shadow-[#10B981]/40" 
                        : isPast 
                        ? "bg-[#072A6C] text-white" 
                        : "bg-white text-gray-400 border-2 border-gray-200 group-hover:border-[#072A6C]"
                    }`}
                  >
                    {isPast ? <Check size={16} strokeWidth={3} /> : step.stepNum}
                  </motion.div>
                  <span className={`text-[10px] md:text-xs font-bold mt-2.5 transition-colors ${
                    isActive ? "text-[#10B981]" : isPast ? "text-[#072A6C]" : "text-gray-400"
                  }`}>
                    {step.stepNum}
                  </span>
                </button>
              );
            })}

          </div>
        </div>

        {/* GenRush Two-Column Split (Left Info + Right Dynamic Device Mockup) */}
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 rounded-3xl p-6 md:p-10 border border-gray-100 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Active Step Details */}
          <div className="lg:col-span-6 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className="space-y-5"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] text-xs font-extrabold uppercase tracking-wider">
                  <Zap size={14} />
                  <span>Step {current.stepNum} of 05</span>
                </div>

                <h3 className="text-2xl md:text-4xl font-black text-[#072A6C] tracking-tight leading-tight">
                  {current.title}
                </h3>

                <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed">
                  {current.desc}
                </p>

                {/* Feature Checklist */}
                <div className="space-y-2.5 pt-2">
                  {current.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs md:text-sm font-semibold text-gray-700">
                      <div className="w-5 h-5 rounded-full bg-[#10B981]/20 flex items-center justify-center text-[#10B981] shrink-0">
                        <CheckCircle2 size={13} />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="pt-4 flex items-center gap-4">
                  <Link
                    to={current.ctaLink}
                    className="px-7 py-3.5 bg-[#072A6C] hover:bg-[#10B981] text-white text-xs md:text-sm font-extrabold rounded-full inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 uppercase tracking-wider cursor-pointer"
                  >
                    <span>{current.ctaText}</span>
                    <ArrowRight size={16} />
                  </Link>

                  <button
                    onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
                    className="px-4 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-full inline-flex items-center gap-1.5 transition-colors cursor-pointer border-none"
                  >
                    <span>Next Step</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: GenRush Mobile Screen / Dynamic Interface Preview */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[320px] md:max-w-[360px] aspect-[9/16] max-h-[480px] bg-slate-950 rounded-[40px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] border-4 border-slate-800 relative overflow-hidden flex flex-col justify-between">
              
              {/* iPhone Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-2xl z-30 flex items-center justify-center gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-900" />
                <div className="w-2 h-2 rounded-full bg-[#10B981]/80 animate-pulse" />
              </div>

              {/* Dynamic Screen Content */}
              <div className="relative w-full h-full bg-white rounded-[30px] pt-8 px-4 pb-4 overflow-hidden flex flex-col justify-between">
                
                {/* Header Status Bar inside Phone */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#072A6C] text-white flex items-center justify-center text-[8px] font-black">
                      CU
                    </div>
                    <span className="text-[10px] font-black text-[#072A6C] uppercase tracking-wider">Admissions Portal</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Live 2026
                  </span>
                </div>

                {/* Animated Mockup Interface Screen per Step */}
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeStep}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.35 }}
                    className="flex-1 my-3 flex flex-col justify-center space-y-3"
                  >

                    {/* Mockup Step 1: Account Registration */}
                    {activeStep === 0 && (
                      <div className="space-y-2 text-left">
                        {/* Stepper Dots */}
                        <div className="flex items-center justify-between text-[7.5px] font-bold text-gray-400 pb-1 border-b border-gray-100">
                          <span className="text-[#D4AF37] font-black underline">1 REGISTER</span>
                          <span>2 VERIFY</span>
                          <span>3 FORM</span>
                          <span>4 DOCS</span>
                          <span>5 PAY</span>
                        </div>

                        <div>
                          <h4 className="text-[11px] font-black text-[#072A6C] uppercase tracking-tight">REGISTER YOURSELF</h4>
                          <p className="text-[8px] text-gray-400">Create your account to start the digital admission journey.</p>
                        </div>

                        <div className="space-y-1.5 text-[9px]">
                          <div>
                            <label className="font-bold text-gray-700 block text-[8px]">Full Name *</label>
                            <div className="p-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 font-normal text-[9px]">
                              Enter full name
                            </div>
                          </div>
                          <div>
                            <label className="font-bold text-gray-700 block text-[8px]">Email Address *</label>
                            <div className="p-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 font-normal text-[9px]">
                              name@domain.com
                            </div>
                          </div>
                          <div>
                            <label className="font-bold text-gray-700 block text-[8px]">Mobile Number *</label>
                            <div className="p-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-400 font-normal text-[9px]">
                              10-digit phone number
                            </div>
                          </div>
                          <div>
                            <label className="font-bold text-gray-700 block text-[8px]">State *</label>
                            <div className="p-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 font-bold text-[9px] flex justify-between items-center">
                              <span>Andhra Pradesh</span>
                              <ChevronDown size={10} className="text-gray-400" />
                            </div>
                          </div>
                        </div>

                        <div className="pt-1">
                          <div className="w-full py-2 bg-[#D4AF37] text-white text-[8px] font-extrabold rounded-lg shadow-sm uppercase tracking-wider text-center">
                            REGISTER & SEND VERIFICATION CODE
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Mockup Step 2: Verify Contact OTP */}
                    {activeStep === 1 && (
                      <div className="space-y-2.5 text-left">
                        <div className="flex items-center justify-between text-[7.5px] font-bold text-gray-400 pb-1 border-b border-gray-100">
                          <span className="text-[#10B981]">1 REGISTER ✓</span>
                          <span className="text-[#D4AF37] font-black underline">2 VERIFY</span>
                          <span>3 FORM</span>
                          <span>4 DOCS</span>
                          <span>5 PAY</span>
                        </div>

                        <div>
                          <h4 className="text-[11px] font-black text-[#072A6C] uppercase tracking-tight">VERIFY YOUR CONTACT</h4>
                          <p className="text-[8px] text-gray-400">Enter the 6-digit OTP sent to your registered mobile & email.</p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 text-center space-y-2">
                          <span className="text-[8px] font-bold text-gray-500 uppercase">Verification Code</span>
                          <div className="flex justify-center gap-1">
                            {["9", "8", "4", "2", "0", "1"].map((num, idx) => (
                              <div key={idx} className="w-6 h-8 rounded-lg bg-white border border-[#D4AF37] text-xs font-extrabold flex items-center justify-center text-[#072A6C] shadow-xs">
                                {num}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="w-full py-2 bg-[#072A6C] text-white text-[8px] font-extrabold rounded-lg shadow-sm uppercase tracking-wider text-center flex items-center justify-center gap-1">
                          <span>CONFIRM & PROCEED</span>
                          <CheckCircle2 size={10} className="text-[#10B981]" />
                        </div>
                      </div>
                    )}

                    {/* Mockup Step 3: Application Form Progress */}
                    {activeStep === 2 && (
                      <div className="space-y-2 text-left">
                        <div className="flex items-center justify-between text-[7.5px] font-bold text-gray-400 pb-1 border-b border-gray-100">
                          <span className="text-[#10B981]">1 ✓</span>
                          <span className="text-[#10B981]">2 ✓</span>
                          <span className="text-[#D4AF37] font-black underline">3 FORM</span>
                          <span>4 DOCS</span>
                          <span>5 PAY</span>
                        </div>

                        <div>
                          <h4 className="text-[11px] font-black text-[#072A6C] uppercase tracking-tight">ACADEMIC DETAILS</h4>
                          <p className="text-[8px] text-gray-400">Select preferred program stream & enter 10+2 marks.</p>
                        </div>

                        <div className="space-y-1.5 text-[9px]">
                          <div>
                            <label className="font-bold text-gray-700 block text-[8px]">Preferred Course *</label>
                            <div className="p-1.5 rounded-lg border border-[#072A6C] bg-blue-50/50 text-[#072A6C] font-bold text-[9px]">
                              B.Tech Computer Science & Eng.
                            </div>
                          </div>
                          <div>
                            <label className="font-bold text-gray-700 block text-[8px]">10+2 Percentage / CGPA *</label>
                            <div className="p-1.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-800 font-bold text-[9px]">
                              92.4% (MPC Stream)
                            </div>
                          </div>
                        </div>

                        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-[8px] font-bold text-[#10B981]">
                          <span>Form Auto-Saved</span>
                          <span>75% Completed</span>
                        </div>
                      </div>
                    )}

                    {/* Mockup Step 4: Document Vault Upload */}
                    {activeStep === 3 && (
                      <div className="space-y-2 text-left">
                        <div className="flex items-center justify-between text-[7.5px] font-bold text-gray-400 pb-1 border-b border-gray-100">
                          <span className="text-[#10B981]">1 ✓</span>
                          <span className="text-[#10B981]">2 ✓</span>
                          <span className="text-[#10B981]">3 ✓</span>
                          <span className="text-[#D4AF37] font-black underline">4 DOCS</span>
                          <span>5 PAY</span>
                        </div>

                        <div>
                          <h4 className="text-[11px] font-black text-[#072A6C] uppercase tracking-tight">UPLOAD DOCUMENTS</h4>
                          <p className="text-[8px] text-gray-400">Attach scanned 10th/12th marksheets & photo ID.</p>
                        </div>

                        <div className="space-y-1.5">
                          <div className="p-1.5 rounded-lg bg-slate-50 border border-gray-200 flex items-center justify-between text-[8.5px] font-bold text-gray-700">
                            <span>12th_Marksheet.pdf</span>
                            <span className="text-[#10B981] font-black text-[8px]">Uploaded ✓</span>
                          </div>
                          <div className="p-1.5 rounded-lg bg-slate-50 border border-gray-200 flex items-center justify-between text-[8.5px] font-bold text-gray-700">
                            <span>Aadhaar_Card.pdf</span>
                            <span className="text-[#10B981] font-black text-[8px]">Uploaded ✓</span>
                          </div>
                          <div className="p-1.5 rounded-lg bg-slate-50 border border-gray-200 flex items-center justify-between text-[8.5px] font-bold text-gray-700">
                            <span>Passport_Photo.jpg</span>
                            <span className="text-[#10B981] font-black text-[8px]">Uploaded ✓</span>
                          </div>
                        </div>

                        <div className="w-full py-1.5 bg-[#072A6C] text-white text-[8px] font-extrabold rounded-lg shadow-sm uppercase tracking-wider text-center">
                          SAVE & CONTINUE TO PAYMENT
                        </div>
                      </div>
                    )}

                    {/* Mockup Step 5: Submission & ETA Card */}
                    {activeStep === 4 && (
                      <div className="space-y-2 text-left">
                        <div className="flex items-center justify-between text-[7.5px] font-bold text-[#10B981] pb-1 border-b border-gray-100">
                          <span>1 ✓</span>
                          <span>2 ✓</span>
                          <span>3 ✓</span>
                          <span>4 ✓</span>
                          <span className="text-[#D4AF37] font-black underline">5 SUBMITTED</span>
                        </div>

                        <div className="text-center pt-1 space-y-1">
                          <div className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center mx-auto shadow-md">
                            <Check size={18} strokeWidth={3} />
                          </div>
                          <h4 className="text-[11px] font-black text-[#072A6C]">APPLICATION SUBMITTED</h4>
                          <p className="text-[8.5px] text-gray-500 font-semibold">Tracking ID: CU-2026-94820</p>
                        </div>

                        <div className="p-2.5 rounded-xl bg-gradient-to-r from-[#072A6C] to-[#0A3A93] text-white text-[8.5px] font-bold shadow-md flex items-center justify-between">
                          <span>Fee Paid: ₹1,000</span>
                          <span className="text-[#D4AF37]">Seat Reserved</span>
                        </div>
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>

                {/* Footer Bar inside Phone */}
                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[9px] font-bold text-gray-400">
                  <span>Chalapathy Admissions</span>
                  <span className="text-[#10B981]">Step 0{activeStep + 1} / 05</span>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

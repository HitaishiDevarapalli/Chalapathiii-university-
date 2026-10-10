"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import {
  GraduationCap, Users, Briefcase, Globe, Microscope,
  ArrowRight, Play, Trophy, Handshake, Landmark,
  Compass, FileText, Award, Phone, MapPin, Mail, Sparkles, Building2, HelpCircle, Search
} from "lucide-react";

/* ── animation helpers ────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Home() {
  const [directionsFrom, setDirectionsFrom] = useState("");

  const handleDirections = (e: React.FormEvent) => {
    e.preventDefault();
    if (directionsFrom) {
      window.open(`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(directionsFrom)}&destination=Chalapathi+Institute+of+Technology+Mothadaka`, "_blank");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8FC] text-[#222222] overflow-x-hidden font-[var(--font-poppins)]">
      <Header />

      {/* ═══ HERO SECTION (720px height) ═══ */}
      <section className="relative w-full overflow-hidden bg-white" style={{ height: "720px" }}>
        {/* Clean full banner image aligned top so the entire logo is visible */}
        <div
          className="absolute inset-0 bg-cover bg-top"
          style={{
            backgroundImage: "url('/Chalapathimain.png')",
            backgroundPosition: "center top"
          }}
        />
      </section>

      {/* ═══ STATISTICS BAR (Dark Blue - 14px border-radius container) ═══ */}
      <section className="bg-[#072A6C] w-full text-white py-8 select-none relative z-20 overflow-hidden">
        <motion.div
          className="max-w-[1440px] mx-auto px-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-8 gap-x-4 justify-items-center text-center">
            {[
              { n: "25+", label: "Years of Excellence", icon: Trophy },
              { n: "150+", label: "Programs Offered", icon: GraduationCap },
              { n: "50+", label: "Expert Faculty", icon: Users },
              { n: "300+", label: "Industry Partners", icon: Handshake },
              { n: "20,000+", label: "Successful Alumni", icon: Landmark },
              { n: "95%", label: "Placement Success", icon: Award },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={i} className="flex flex-col items-center max-w-[160px] rounded-[14px]" variants={fadeUp}>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-3 border border-[#D4AF37]/30 shadow-sm">
                    <Icon size={18} className="text-[#D4AF37]" strokeWidth={2} />
                  </div>
                  <span className="block text-[22px] font-[800] leading-none text-[#D4AF37]">
                    {s.n}
                  </span>
                  <span className="block text-[11px] text-gray-200 font-[500] mt-2 leading-tight">
                    {s.label}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ═══ WHY CHOOSE US SECTION ═══ */}
      <section className="max-w-[1440px] mx-auto w-full px-5 py-20 text-center">
        <motion.span
          className="text-[12px] font-[700] tracking-wider text-[#D4AF37] block mb-2 uppercase"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          WHY CHOOSE US
        </motion.span>
        <motion.h2
          className="text-[26px] md:text-[32px] font-[800] text-[#072A6C] mb-12"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Chalapathi University?
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {[
            {
              title: "Industry-Driven Curriculum",
              desc: "Programs designed with industry experts for future-ready skills.",
              icon: Trophy,
              color: "#D4AF37"
            },
            {
              title: "Experienced Faculty",
              desc: "Learn from passionate educators and domain specialists.",
              icon: Users,
              color: "#2563EB"
            },
            {
              title: "Advanced Infrastructure",
              desc: "State-of-the-art labs, smart classrooms and innovation hubs.",
              icon: Building2,
              color: "#F59E0B"
            },
            {
              title: "Strong Industry Connections",
              desc: "Internships, live projects and placements with top companies.",
              icon: Handshake,
              color: "#0D9488"
            },
            {
              title: "Holistic Development",
              desc: "Focus on leadership, creativity, and overall personality growth.",
              icon: Sparkles,
              color: "#7C3AED"
            },
            {
              title: "Global Opportunities",
              desc: "International exposure and collaborations for a global career.",
              icon: Globe,
              color: "#072A6C"
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                className="bg-white border border-gray-100 rounded-[16px] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1"
                variants={fadeUp}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white"
                  style={{ backgroundColor: item.color }}
                >
                  <Icon size={20} />
                </div>
                <h3 className="font-[700] text-[16px] text-[#072A6C] mb-3 leading-snug min-h-[36px] flex items-center justify-center">
                  {item.title}
                </h3>
                <p className="text-[13px] text-[#111111] leading-relaxed font-[700]">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ═══ OUR PROGRAMS SECTION (16px border-radius cards) ═══ */}
      <section className="bg-white border-t border-gray-100 py-20">
        <div className="max-w-[1440px] mx-auto w-full px-5">
          <div className="flex justify-between items-end mb-10">
            <h2 className="text-[26px] font-[800] text-[#072A6C]">
              OUR PROGRAMS
            </h2>
            <Link
              href="/#schools"
              className="text-[13px] font-[700] text-[#072A6C] hover:text-[#D4AF37] flex items-center gap-1 transition-colors"
            >
              View All Programs <ArrowRight size={14} />
            </Link>
          </div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {[
              { name: "Engineering", color: "#D4AF37", image: "/prog_engineering.png", to: "/academics/computer-science" },
              { name: "Management", color: "#F59E0B", image: "/prog_management.png", to: "/academics/programmes" },
              { name: "Computer Applications", color: "#2563EB", image: "/prog_computer.png", to: "/academics/programmes" },
              { name: "Pharmacy", color: "#10B981", image: "/prog_pharmacy.png", to: "/academics/programmes" },
              { name: "Diploma", color: "#8B5CF6", image: "/prog_diploma.png", to: "/academics/programmes" },
              { name: "M.Tech Programs", color: "#EAB308", image: "/prog_mtech.png", to: "/academics/programmes" }
            ].map((p, idx) => (
              <motion.div
                key={idx}
                className="group bg-white border border-gray-100 rounded-[16px] overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
                variants={scaleIn}
              >
                <Link href={p.to} className="block w-full h-full">
                  <div className="h-[140px] relative overflow-hidden bg-gray-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>

                  <div className="px-4 pb-4 relative pt-6 text-center">
                    <div
                      className="absolute -top-5 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center text-white border-[3px] border-white shadow-md group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: p.color }}
                    >
                      <GraduationCap size={14} />
                    </div>
                    <h3 className="font-[700] text-[13px] text-[#072A6C] group-hover:text-[#D4AF37] transition-colors leading-tight">
                      {p.name}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ CHALAPATHI JOURNEY & CAMPUS SECTION (Grouping into White Card containers) ═══ */}
      <section className="max-w-[1440px] mx-auto w-full px-5 py-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Card: Journey */}
        <div className="lg:col-span-4 bg-white border border-gray-100 rounded-[16px] p-6 shadow-sm hover:shadow transition-shadow">
          <div>
            <span className="text-[12px] font-[700] text-[#D4AF37] tracking-wider uppercase block mb-1">THE CHALAPATHI JOURNEY</span>
            <h2 className="text-[26px] font-[800] text-[#072A6C]">
              Your Path to Success
            </h2>
          </div>

          {/* Timeline steps container with absolute positioning for vertical gray line */}
          <motion.div
            className="space-y-6 mt-6 relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Vertical timeline connector */}
            <div className="absolute left-[70px] top-6 bottom-6 w-0.5 bg-gray-100 z-0" />

            {[
              { step: "01", title: "DISCOVER", desc: "Explore programs and find your passion.", icon: Compass },
              { step: "02", title: "APPLY", desc: "Submit your application online.", icon: FileText },
              { step: "03", title: "LEARN", desc: "Gain knowledge & practical exposure.", icon: GraduationCap },
              { step: "04", title: "GROW", desc: "Build skills & achieve milestones.", icon: Award },
              { step: "05", title: "SUCCEED", desc: "Launch your dream career", icon: Trophy }
            ].map((j) => {
              const Icon = j.icon;
              return (
                <motion.div key={j.step} className="flex gap-4 items-center relative z-10" variants={fadeUp}>
                  {/* Step Flag Pointer badge */}
                  <div className="w-10 h-8 bg-[#D4AF37] text-white font-[700] text-[13px] flex items-center justify-center shrink-0 rounded-l shadow-sm relative mr-2">
                    {j.step}
                    <div className="absolute left-full top-1/2 -translate-y-1/2 border-[4px] border-transparent border-l-[#D4AF37]" />
                  </div>

                  {/* Circular Icon Container */}
                  <div className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center shrink-0">
                    <Icon size={14} className="text-[#072A6C]" />
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-[800] text-[#072A6C] tracking-wide">
                      {j.title}
                    </h4>
                    <p className="text-[11px] text-[#666666] mt-0.5 leading-normal font-[400] truncate">
                      {j.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Right Card: Campus & Navigation */}
        <div className="lg:col-span-8 bg-white border border-gray-100 rounded-[16px] p-6 shadow-sm hover:shadow transition-shadow flex flex-col justify-between gap-6">
          <div>
            <span className="text-[12px] font-[700] text-[#F59E0B] tracking-wider uppercase block mb-1">OUR CAMPUS</span>
            <h2 className="text-[26px] font-[800] text-[#072A6C]">
              A Campus Built for Excellence
            </h2>
          </div>

          <motion.div
            className="rounded-[16px] overflow-hidden shadow-sm bg-gray-100 h-[230px]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img src="/campus_hero.png" alt="Campus View" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            className="bg-[#072A6C] text-white rounded-[16px] p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="text-center md:text-left min-w-[200px]">
              <h3 className="text-[15px] sm:text-[16px] font-[700]">Find Your Way</h3>
              <p className="text-[11px] sm:text-[12px] text-blue-100 font-[300] mt-0.5">Get directions to Chalapathi University</p>
            </div>

            {/* Combined Input Bar */}
            <form 
              onSubmit={handleDirections} 
              className="w-full md:w-auto flex-1 flex flex-col sm:flex-row gap-2 sm:gap-0 max-w-xl bg-transparent sm:bg-white sm:rounded-full sm:p-1 overflow-hidden sm:shadow-sm sm:border sm:border-gray-100"
            >
              <div className="flex items-center gap-2 px-3.5 py-2.5 sm:py-1 bg-white rounded-full flex-1 border border-gray-100 sm:border-none shadow-xs sm:shadow-none min-w-0">
                <Search size={15} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={directionsFrom}
                  onChange={(e) => setDirectionsFrom(e.target.value)}
                  placeholder="Enter your location"
                  className="w-full text-black text-[12px] sm:text-[13px] outline-none bg-transparent min-w-0"
                />
              </div>
              <button 
                type="submit" 
                className="w-full sm:w-auto bg-[#D4AF37] hover:bg-[#C9A84C] text-white font-[700] px-5 py-2.5 sm:py-2 rounded-full text-[12px] flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap active:scale-95 transition-all shadow-xs"
              >
                <span>Get Directions</span> <MapPin size={12} />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ═══ NEWS, RANKINGS & EVENTS ═══ */}
      <section className="bg-gray-50 border-y border-gray-100 py-16">
        <div className="max-w-[1440px] mx-auto px-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Latest News */}
          <motion.div
            className="lg:col-span-4 bg-white border border-gray-200/60 rounded-[16px] p-6 shadow-sm flex flex-col justify-between"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-[13px] font-[800] uppercase tracking-wider text-[#072A6C]">
                LATEST NEWS
              </h3>
              <Link href="/news" className="text-[11px] font-[700] text-[#072A6C] hover:text-[#D4AF37] flex items-center gap-0.5">
                View All <ArrowRight size={10} />
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { d: "12", m: "MAY", title: "Chalapathi University Launches AI Research Center" },
                { d: "06", m: "MAY", title: "Students Win National Level Hackathon 2025" },
                { d: "03", m: "MAY", title: "MoU Signed with Global Industry Leaders" }
              ].map((n, idx) => (
                <motion.div key={idx} className="flex gap-4 items-start" variants={fadeUp}>
                  <div className="w-12 h-12 shrink-0 rounded-[8px] bg-[#D4AF37] text-white text-center flex flex-col items-center justify-center shadow-sm">
                    <span className="block text-[14px] font-[800] leading-none">{n.d}</span>
                    <span className="block text-[8px] font-[700] tracking-wider mt-0.5">{n.m}</span>
                  </div>
                  <div>
                    <h4 className="text-[12px] font-[700] text-gray-800 leading-snug">{n.title}</h4>
                    <Link href="/news" className="text-[10px] font-[700] text-[#072A6C] hover:underline mt-1 inline-block">
                      Read More →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Rankings */}
          <motion.div
            className="lg:col-span-4 bg-white border border-gray-200/60 rounded-[16px] p-6 shadow-sm"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-6">
              <h3 className="text-[13px] font-[800] uppercase tracking-wider text-[#072A6C]">
                RANKINGS & ACCREDITATIONS
              </h3>
              <Link href="/about" className="text-[11px] font-[700] text-[#072A6C] hover:text-[#D4AF37] flex items-center gap-0.5">
                View All <ArrowRight size={10} />
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-y-6 gap-x-4">
              {/* NAAC A+ */}
              <motion.div className="flex flex-col items-center text-center" variants={fadeUp}>
                <div className="h-10 flex items-center justify-center mb-1">
                  <span className="text-[20px] font-[900] text-[#D4AF37] tracking-tight">NAAC <span className="text-[22px]">A+</span></span>
                </div>
                <span className="text-[10px] text-gray-400 font-[600] uppercase tracking-wider">Accredited</span>
              </motion.div>

              {/* NIRF */}
              <motion.div className="flex flex-col items-center text-center" variants={fadeUp}>
                <div className="h-10 flex flex-col items-center justify-center mb-1">
                  <span className="text-[20px] font-[900] text-[#072A6C] tracking-tight">
                    n<span className="text-[#D4AF37]">i</span>rf
                  </span>
                  <div className="w-8 h-0.5 bg-[#D4AF37] -mt-0.5" />
                </div>
                <span className="text-[10px] text-gray-400 font-[600] uppercase tracking-wider">Ranked</span>
              </motion.div>

              {/* NBA */}
              <motion.div className="flex flex-col items-center text-center" variants={fadeUp}>
                <div className="h-10 flex items-center justify-center mb-1">
                  <span className="text-[20px] font-[900] text-transparent tracking-widest uppercase" style={{ WebkitTextStroke: "1.2px #0284C7" }}>
                    NBA
                  </span>
                </div>
                <span className="text-[10px] text-gray-400 font-[600] uppercase tracking-wider">Accredited</span>
              </motion.div>

              {/* ARIIA */}
              <motion.div className="flex flex-col items-center text-center" variants={fadeUp}>
                <div className="h-10 flex items-center justify-center gap-0.5 mb-1">
                  <svg className="w-5 h-5 text-[#B45309]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 22h20L12 2zm0 4l6.5 13h-13L12 6z" />
                  </svg>
                  <span className="text-[13px] font-[900] text-[#78350F] tracking-wide">ARIIA</span>
                </div>
                <span className="text-[10px] text-gray-400 font-[600] uppercase tracking-wider">Top Performer</span>
              </motion.div>

              {/* ISO */}
              <motion.div className="flex flex-col items-center text-center" variants={fadeUp}>
                <div className="h-10 flex items-center justify-center mb-1">
                  <div className="w-8 h-8 rounded-full bg-[#072A6C] flex items-center justify-center">
                    <span className="text-white text-[9px] font-[900] tracking-wider">ISO</span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-[600] uppercase tracking-wider">Certified</span>
              </motion.div>

              {/* Approved */}
              <motion.div className="flex flex-col items-center text-center" variants={fadeUp}>
                <div className="h-10 flex items-center justify-center mb-1">
                  <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] bg-[#F59E0B]/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#D4AF37]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 font-[600] uppercase tracking-wider">Approved</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            className="lg:col-span-4 bg-white border border-gray-200/60 rounded-[16px] p-6 shadow-sm flex flex-col justify-between"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-[13px] font-[800] uppercase tracking-wider text-[#072A6C]">
                UPCOMING EVENTS
              </h3>
              <Link href="/news" className="text-[11px] font-[700] text-[#072A6C] hover:text-[#D4AF37] flex items-center gap-0.5">
                View Calendar <ArrowRight size={10} />
              </Link>
            </div>

            <div className="space-y-4">
              {[
                { d: "20", m: "MAY", title: "International Conference on AI & Robotics", time: "10:00 AM Onwards" },
                { d: "25", m: "MAY", title: "Annual Tech Fest 2025", time: "09:00 AM Onwards" },
                { d: "05", m: "JUN", title: "Global Education Fair", time: "11:00 AM Onwards" }
              ].map((e, idx) => (
                <motion.div key={idx} className="flex gap-4 items-start" variants={fadeUp}>
                  <div className="w-12 h-12 shrink-0 rounded-[8px] bg-[#D4AF37] text-white text-center flex flex-col items-center justify-center shadow-sm">
                    <span className="block text-[14px] font-[800] leading-none">{e.d}</span>
                    <span className="block text-[8px] font-[700] tracking-wider mt-0.5">{e.m}</span>
                  </div>
                  <div>
                    <h4 className="text-[12px] font-[700] text-gray-800 leading-snug">{e.title}</h4>
                    <span className="block text-[10px] text-gray-400 font-[500] mt-1">{e.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ ADMISSIONS OPEN 2026 STRIP ═══ */}
      <section className="bg-gray-50 py-12 border-t border-gray-100">
        <div className="max-w-[1440px] mx-auto px-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Red Card */}
          <div className="lg:col-span-8 bg-[#072A6C] text-white rounded-[16px] p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
            <div className="space-y-4 max-w-lg z-10">
              <h2 className="text-[26px] font-[800] tracking-wide text-[#D4AF37]">
                ADMISSIONS OPEN 2026
              </h2>
              <p className="text-[12px] text-blue-100 leading-relaxed font-[300]">
                Join a community of innovators and leaders. Shape your future with Chalapathi University.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 font-[var(--font-poppins)]">
                <Link
                  href="/admissions/apply"
                  className="h-10 px-5 bg-white text-[#072A6C] hover:bg-blue-50 text-[11px] font-[700] rounded-[8px] inline-flex items-center gap-1.5 shadow active:scale-95 transition-transform"
                >
                  Apply Now <ArrowRight size={13} />
                </Link>
                <Link
                  href="/admissions"
                  className="h-10 px-5 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white text-[11px] font-[700] rounded-[8px] inline-flex items-center gap-1.5 active:scale-95 transition-all duration-200"
                >
                  Download Brochure
                </Link>
                <Link
                  href="/contact"
                  className="h-10 px-5 border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white text-[11px] font-[700] rounded-[8px] inline-flex items-center gap-1.5 active:scale-95 transition-all duration-200"
                >
                  Talk to Counselor
                </Link>
              </div>
            </div>

            {/* Students Image absolute positioned on the right edge */}
            <motion.div
              className="absolute right-0 top-0 bottom-0 h-full w-full md:w-[42%] overflow-hidden z-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <img src="/students_admission.png" alt="Students" className="w-full h-full object-cover object-left-top" />
            </motion.div>
          </div>

          {/* Right White Card */}
          <div className="lg:col-span-4 bg-white border border-gray-200/60 rounded-[16px] p-6 flex items-center justify-between gap-4 shadow-sm">
            <div className="space-y-4 flex-1">
              <h3 className="text-[13px] font-[800] uppercase tracking-wider text-[#072A6C]">VISIT US</h3>
              <div className="space-y-2.5 text-[11px] text-gray-600 font-[400]">
                <div className="flex items-start gap-1.5">
                  <MapPin size={12} className="shrink-0 mt-0.5 text-gray-400" />
                  <span>A.R. Nagar, Mothadaka, Guntur, Andhra Pradesh - 522034</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <Phone size={12} className="shrink-0 mt-0.5 text-gray-400" />
                  <span>8886630355 | 8886630356 9905505566</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <Mail size={12} className="shrink-0 mt-0.5 text-gray-400" />
                  <span>admissions@city.ac.in</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <Globe size={12} className="shrink-0 mt-0.5 text-gray-400" />
                  <span>www.city.ac.in</span>
                </div>
              </div>
            </div>

            {/* Map Frame */}
            <a 
              href="https://www.google.com/maps/place/Chalapathi+Institute+of+Technology/@16.3752188,80.2858169,17z/data=!3m1!4b1!4m6!3m5!1s0x3a4a79679802cfad:0xe67e2a901bbd33fe!8m2!3d16.3752188!4d80.2858169!16s%2Fg%2F122r446z"
              target="_blank"
              rel="noopener noreferrer"
              className="w-[130px] h-[130px] rounded-[12px] overflow-hidden bg-gray-100 shrink-0 border border-gray-200 relative block group"
              title="Open Chalapathi University in Google Maps"
            >
              <div className="absolute inset-0 bg-transparent z-10 cursor-pointer" />
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.974950454796!2d80.28581691486445!3d16.375218788685984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a79679802cfad%3A0xe67e2a901bbd33fe!2sChalapathi%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1657523129846!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                className="pointer-events-none"
              ></iframe>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

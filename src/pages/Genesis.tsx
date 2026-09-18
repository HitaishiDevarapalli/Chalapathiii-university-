"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence, Variants } from "framer-motion";
import { BookOpen, Building2, Globe, Lightbulb, Microscope, GraduationCap, ArrowRight, Zap, Target, Library, Search, Code, Cpu, Activity, Coins, Briefcase, FileText, Leaf, Building, Flag, HeartHandshake } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

export default function Genesis() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [windowWidth, setWindowWidth] = useState(1200);
  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-[var(--font-poppins)] overflow-hidden">
      
      {/* NEW CINEMATIC 3D TIMELINE HERO */}
      <section className="relative w-full min-h-[140vh] md:min-h-[160vh] bg-gradient-to-b from-[#ffffff] via-[#f0f9ff] to-[#e0f2fe] overflow-hidden pt-32 pb-40 px-5 flex flex-col justify-start">
        
        {/* Soft Global Illumination & Rays */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-[150px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute top-1/3 left-0 w-[600px] h-[600px] bg-sky-300/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2"></div>
        
        {/* Soft Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1.5 h-1.5 bg-blue-300 rounded-full"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight * 1.5 : 1500),
                opacity: Math.random() * 0.5 + 0.1
              }}
              animate={{ 
                y: [null, -100],
                x: (Math.random() - 0.5) * 100 + "px",
                opacity: [null, 0.8, 0]
              }}
              transition={{ 
                duration: 10 + Math.random() * 20, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
          ))}
        </div>

        {/* Subtle Birds */}
        <motion.div 
          initial={{ x: -100, y: 300, opacity: 0 }}
          animate={{ x: 1200, y: 100, opacity: [0, 0.4, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-40 left-0 z-10 w-24 h-12 pointer-events-none text-sky-800"
        >
          <svg viewBox="0 0 100 100" fill="currentColor" opacity="0.3"><path d="M10,50 Q25,30 40,50 Q55,30 70,50 Q55,40 40,60 Q25,40 10,50 Z"/></svg>
        </motion.div>

        {/* TOP LEFT: TITLE BLOCK */}
        <div className="max-w-[1400px] mx-auto w-full relative z-30 pt-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[2px] w-12 bg-[#123A7A]/30"></div>
              <span className="text-[#123A7A] font-[700] tracking-[0.2em] uppercase text-[12px] md:text-[14px]">Our Genesis</span>
              <div className="h-[2px] w-12 bg-[#123A7A]/30"></div>
            </div>
            <h1 className="text-[44px] md:text-[72px] font-[900] leading-[1.1] text-[#0F172A] mb-8 drop-shadow-sm tracking-tight">
              A Journey of Vision, <br/>Values & Transformation
            </h1>
            <p className="text-[18px] md:text-[22px] text-[#0F172A]/70 font-[400] leading-relaxed max-w-2xl">
              From a vision rooted in knowledge to a future-ready multidisciplinary university driven by innovation, research, and global excellence.
            </p>
          </motion.div>
        </div>

        {/* MAIN VISUAL: 3D GLASS STAIRCASE */}
        <div className="max-w-[1400px] mx-auto w-full relative z-20 mt-20 md:mt-16 h-auto md:h-[650px] flex flex-col md:flex-row items-center md:items-end justify-between gap-24 md:gap-6 lg:gap-8 pb-10 pt-10 md:pt-0">
          
          {/* Glowing Horizon at the End */}
          <div className="absolute top-[-150px] right-[-50px] w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-200/40 via-blue-200/10 to-transparent blur-3xl z-0 pointer-events-none"></div>



          {/* The Steps */}
          {[
            { 
              year: "1995", 
              title: "The Beginning", 
              desc: "Chalapathi Educational Society (CES) established with a mission to serve society through quality education.",
              img: "genesis/1995.jpg", 
              height: "30%",
              alt: "Seed of education"
            },
            { 
              year: "1995–2005", 
              title: "Building the Foundation", 
              desc: "Laid the groundwork with schools and junior & degree colleges, nurturing young minds.",
              img: "genesis/2005.jpg", 
              height: "45%",
              alt: "Traditional academic institution"
            },
            { 
              year: "2005–2015", 
              title: "Expanding Horizons", 
              desc: "Ventured into professional and technical education, creating opportunities for future-ready careers.",
              img: "genesis/2015.jpg", 
              height: "60%",
              alt: "Modern engineering campus"
            },
            { 
              year: "2015–2025", 
              title: "Strengthening Excellence", 
              desc: "Chalapathi Institute of Technology at Mothadaka grew into a center for quality technical education and innovation.",
              img: "genesis/2025.jpg", 
              height: "75%",
              alt: "Premium research campus"
            },
            { 
              year: "2026", 
              title: "A New Chapter", 
              desc: "Chalapathi University — a multidisciplinary, research-driven, future-ready institution shaping global leaders.",
              img: "genesis/2026.jpg", 
              height: "90%",
              alt: "Iconic future-ready Chalapathi University",
              active: true
            }
          ].map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 150 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1.2, delay: 0.2 + (i * 0.3), type: "spring", bounce: 0.2 }}
              className="relative w-[85%] max-w-[320px] md:max-w-none md:w-auto md:flex-1 flex flex-col items-center justify-end z-20 h-[280px] md:h-[var(--md-height)]"
              style={{ '--md-height': step.height } as React.CSSProperties}
            >
              {/* 3D Illustration / Asset */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.8 + (i * 0.3), type: "spring" }}
                className={
                  step.active 
                    ? "absolute bottom-[100%] mb-[-14px] md:mb-[-24px] w-[120%] sm:w-[130%] md:w-[145%] max-w-[270px] md:max-w-[310px] lg:max-w-[340px] z-40 drop-shadow-2xl pointer-events-none"
                    : i === 2 || i === 3
                    ? "absolute bottom-[100%] mb-[-12px] md:mb-[-20px] w-[105%] md:w-[115%] max-w-[200px] md:max-w-[230px] lg:max-w-[250px] z-30 drop-shadow-xl pointer-events-none"
                    : "absolute bottom-[100%] mb-[-10px] md:mb-[-18px] w-[95%] md:w-[100%] max-w-[170px] md:max-w-[190px] lg:max-w-[205px] z-30 drop-shadow-lg pointer-events-none"
                }
              >
                <div className={
                  step.active 
                    ? "rounded-2xl overflow-hidden shadow-2xl border-2 border-sky-400/90 bg-white ring-4 ring-sky-400/20"
                    : i === 2 || i === 3
                    ? "rounded-xl overflow-hidden shadow-lg border border-white/90 bg-white/95"
                    : "rounded-xl overflow-hidden shadow-md border border-white/80 bg-white/90"
                }>
                  <img 
                    src={`/${step.img}`} 
                    alt={step.alt}
                    className={
                      step.active 
                        ? "w-full h-[145px] md:h-[185px] object-cover transform origin-bottom hover:scale-105 transition-transform duration-500"
                        : i === 2 || i === 3
                        ? "w-full h-[115px] md:h-[140px] object-cover transform origin-bottom hover:scale-105 transition-transform duration-500"
                        : "w-full h-[95px] md:h-[115px] object-cover transform origin-bottom hover:scale-105 transition-transform duration-500"
                    }
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300/e0f2fe/123A7A.png?text=" + step.img;
                    }}
                  />
                </div>
              </motion.div>



              {/* Premium Glassmorphism Block */}
              <div className="w-full h-full relative group perspective-1000">
                {/* 3D Top Face */}
                <div className={`absolute top-0 left-0 w-full h-10 md:h-16 -mt-5 md:-mt-8 rounded-t-2xl z-20 ${step.active ? 'bg-gradient-to-br from-[#1E4B9C] to-[#0A2044]' : 'bg-white/60 backdrop-blur-xl border-white'} shadow-[inset_0_2px_10px_rgba(255,255,255,0.9),0_-10px_30px_rgba(18,58,122,0.1)] border-t border-x ${step.active ? 'border-[#38bdf8]/50' : 'border-white/80'} skew-x-12 transform origin-bottom-left transition-transform duration-500 group-hover:brightness-110`}></div>
                
                {/* 3D Front Face */}
                <div className={`absolute top-5 md:top-8 left-0 w-full h-[calc(100%-1.25rem)] md:h-[calc(100%-2rem)] rounded-b-2xl z-10 p-4 md:p-8 flex flex-col items-center justify-start ${step.active ? 'bg-gradient-to-b from-[#123A7A] to-[#081b3a] border-[#123A7A] shadow-[0_30px_60px_rgba(18,58,122,0.4)]' : 'bg-white/80 backdrop-blur-2xl border-white/80 shadow-[0_20px_50px_rgba(0,0,0,0.05)]'} border-x border-b overflow-hidden transition-colors duration-500`}>
                  
                  {/* Subtle inner reflection */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none rounded-b-2xl"></div>

                  <div className={`text-center py-1 md:py-2 px-3 md:px-5 rounded-full inline-flex items-center justify-center shadow-inner backdrop-blur-md mb-3 md:mb-4 ${step.active ? 'bg-white/10 text-white border border-white/20' : 'bg-[#123A7A]/5 text-[#123A7A] border border-[#123A7A]/10'}`}>
                    <h3 className="font-[800] tracking-wider text-[11px] md:text-[14px]">{step.year}</h3>
                  </div>
                  
                  <h4 className={`font-[900] text-[13px] md:text-[18px] text-center leading-tight mb-2 ${step.active ? 'text-white' : 'text-[#0F172A]'}`}>
                    {step.title}
                  </h4>

                  {/* Decorative line */}
                  <div className={`h-[2px] w-8 rounded-full mb-3 block ${step.active ? 'bg-sky-400/50' : 'bg-[#123A7A]/20'}`}></div>

                  <p className={`text-[12px] md:text-[13px] leading-relaxed text-center font-[500] block ${step.active ? 'text-white/80' : 'text-[#0F172A]/70'}`}>
                    {step.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BOTTOM PANEL: Towards a Brighter Tomorrow */}
      <section className="py-24 px-5 relative z-30 -mt-24 md:-mt-32">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-[1200px] mx-auto relative bg-white/80 backdrop-blur-3xl border border-white rounded-[40px] p-10 md:p-16 shadow-[0_40px_100px_rgba(18,58,122,0.08)] overflow-hidden"
        >
          {/* Decorative background flare */}
          <div className="absolute -top-[200px] -right-[200px] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 mb-16 border-b border-gray-100 pb-12 relative z-10">
            <div className="max-w-md">
              <p className="text-[#0F172A]/40 font-[700] uppercase tracking-[0.2em] text-[12px] md:text-[14px] mb-3">Towards a</p>
              <h2 className="text-[36px] md:text-[48px] font-[900] text-[#123A7A] leading-[1.1] tracking-tight">Brighter<br/>Tomorrow</h2>
            </div>
            <p className="text-[16px] md:text-[20px] text-[#0F172A]/70 font-[400] max-w-2xl leading-relaxed border-l-2 border-sky-200 pl-8">
              Guided by its founding values and inspired by innovation, Chalapathi University continues to evolve into a multidisciplinary institution dedicated to academic excellence, research, entrepreneurship, and global impact.
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10"
          >
            {[
              { icon: BookOpen, label: "Knowledge" },
              { icon: Lightbulb, label: "Innovation" },
              { icon: Globe, label: "Global Opportunities" },
              { icon: HeartHandshake, label: "Service to Society" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeUp}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-gradient-to-b from-white to-[#f8fafc] border border-[#e2e8f0] p-8 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_30px_60px_rgba(18,58,122,0.1)] hover:border-sky-200 transition-all duration-500 relative overflow-hidden group flex flex-col items-center text-center cursor-default"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 text-[#123A7A] group-hover:bg-[#123A7A] group-hover:text-white group-hover:border-[#123A7A] transition-colors duration-500 flex items-center justify-center mb-6 relative z-10">
                  <item.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-[18px] font-[800] text-[#0F172A] leading-tight relative z-10 group-hover:text-[#123A7A] transition-colors">{item.label}</h3>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 4: NEP 2020 ECOSYSTEM */}
      <section className="py-32 bg-[#020C1B] text-white relative overflow-hidden perspective-1000">
        {/* Deep Space Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A192F] via-[#020C1B] to-[#010613]"></div>
        
        {/* Animated Constellation Grid */}
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }}></div>
        
        {/* Floating Light Rays */}
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(56,189,248,0)_0%,rgba(56,189,248,0.05)_10%,rgba(56,189,248,0)_20%)] pointer-events-none"
        ></motion.div>

        {/* Floating Glow Particles (CSS handled via Framer) */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1.5 h-1.5 bg-sky-400 rounded-full blur-[1px]"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
              y: Math.random() * 800,
              opacity: Math.random() * 0.5 + 0.1
            }}
            animate={{ 
              y: [null, Math.random() * -200],
              opacity: [null, 0.8, 0] 
            }}
            transition={{ 
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}

        <div className="max-w-[1400px] mx-auto px-5 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <h2 className="text-[36px] md:text-[56px] font-[900] tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-sky-100 to-sky-300">
              A University Inspired by NEP 2020
            </h2>
            <p className="text-[18px] md:text-[22px] text-sky-200/70 max-w-3xl mx-auto font-[300]">
              Experiencing education as a living, interconnected ecosystem of knowledge, skills, and innovation.
            </p>
          </motion.div>

          <div className="relative w-full min-h-[1200px] md:min-h-[700px] flex items-center justify-center overflow-visible">
            
            {(() => {
              // Precalculate nodes to ensure beams and modules always match perfectly
              const isMobile = windowWidth < 768;
              const isTablet = windowWidth >= 768 && windowWidth < 1024;
              const isLaptop = windowWidth >= 1024 && windowWidth < 1300;
              
              const nepNodes = [
                { label: "Holistic Learning", icon: HeartHandshake, stat: "360°", desc: "Comprehensive physical & emotional growth.", angle: 0 },
                { label: "Research", icon: Microscope, stat: "Tier-1", desc: "Advanced labs & dedicated funding programs.", angle: 60 },
                { label: "Innovation", icon: Lightbulb, stat: "100+", desc: "Patents filed and ideation centers active.", angle: 120 },
                { label: "Skill Development", icon: Target, stat: "95%", desc: "Industry-ready practical curriculum.", angle: 180 },
                { label: "Entrepreneurship", icon: Briefcase, stat: "50+", desc: "Startups incubated on campus annually.", angle: 240 },
                { label: "Multidisciplinary", icon: Library, stat: "12", desc: "Interconnected disciplines of study.", angle: 300 }
              ].map((node, i) => {
                let x = 0;
                let y = 0;
                
                if (isMobile) {
                  const yOffsets = [-480, -320, -160, 160, 320, 480];
                  const xOffsets = [-70, 70, -70, 70, -70, 70];
                  x = xOffsets[i];
                  y = yOffsets[i];
                } else {
                  let radiusX = 420;
                  if (isTablet) radiusX = 260;
                  else if (isLaptop) radiusX = 320;
                  
                  const radiusY = 250;
                  const angleRad = (node.angle * Math.PI) / 180;
                  x = Math.cos(angleRad) * radiusX;
                  y = Math.sin(angleRad) * radiusY;
                }
                
                return { ...node, x, y };
              });

              return (
                <>
                  {/* SVG ENERGY BEAMS */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible" style={{ filter: "drop-shadow(0 0 8px rgba(56,189,248,0.5))" }}>
                    <defs>
                      <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                    
                    {nepNodes.map((node, i) => (
                      <g key={`beam-${i}`} style={{ transform: 'translate(50%, 50%)' }}>
                        {/* The Base Beam */}
                        <motion.line
                          x1="0" y1="0"
                          x2={node.x} y2={node.y}
                          stroke="url(#beam-gradient)"
                          strokeWidth="2"
                          strokeOpacity="0.3"
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 2, delay: 0.5 }}
                        />
                        {/* The Pulse Beam */}
                        <motion.line
                          x1="0" y1="0"
                          x2={node.x} y2={node.y}
                          stroke="#38bdf8"
                          strokeWidth="4"
                          strokeOpacity="0.8"
                          initial={{ pathLength: 0, opacity: 0 }}
                          whileInView={{ pathLength: 1, opacity: [0, 1, 0] }}
                          viewport={{ once: true }}
                          transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                        />
                      </g>
                    ))}
                  </svg>

                  {/* THE CORE SPHERE */}
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", duration: 1.5, bounce: 0.4 }}
                    className="absolute z-30 w-40 h-40 md:w-48 md:h-48 rounded-full flex items-center justify-center cursor-pointer group"
                  >
                    {/* Core Glows */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-500 via-purple-600 to-blue-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-700 animate-pulse"></div>
                    <div className="absolute inset-2 rounded-full bg-[#020C1B]/80 backdrop-blur-md border border-white/10 shadow-[inset_0_0_30px_rgba(56,189,248,0.2)]"></div>
                    
                    {/* Rotating Rings */}
                    <motion.div 
                      animate={{ rotateX: 360, rotateY: 180 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-[-10px] rounded-full border border-sky-400/30 border-dashed"
                      style={{ transformStyle: "preserve-3d" }}
                    ></motion.div>
                    <motion.div 
                      animate={{ rotateY: 360, rotateZ: 180 }}
                      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-[-20px] rounded-full border border-purple-400/20 border-dotted"
                      style={{ transformStyle: "preserve-3d" }}
                    ></motion.div>

                    <div className="relative z-10 flex flex-col items-center">
                      <span className="font-[900] text-[28px] md:text-[32px] text-transparent bg-clip-text bg-gradient-to-b from-white to-sky-200 tracking-tight leading-none">NEP</span>
                      <span className="font-[700] text-[18px] md:text-[20px] text-sky-400 tracking-widest mt-1">2020</span>
                    </div>
                  </motion.div>

                  {/* ORBITING MODULES */}
                  {nepNodes.map((node, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, x: "-50%", y: "-50%" }}
                      whileInView={{ opacity: 1, scale: 1, x: `calc(-50% + ${node.x}px)`, y: `calc(-50% + ${node.y}px)` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.8 + (i * 0.15), type: "spring" }}
                      className="absolute top-1/2 left-1/2 z-40 group"
                    >
                      <div className="w-[160px] md:w-[220px] bg-[#020C1B]/80 backdrop-blur-xl border border-white/10 p-4 md:p-5 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] transform transition-all duration-500 hover:scale-110 hover:bg-[#0A192F] hover:border-sky-400/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]">
                        
                        <div className="flex items-center justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-sky-400 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-inner">
                            <node.icon size={20} />
                          </div>
                          <span className="text-xs font-bold text-sky-300 bg-sky-900/40 px-2 py-1 rounded-md border border-sky-500/20">{node.stat}</span>
                        </div>
                        
                        <h4 className="text-[14px] md:text-[16px] font-[800] text-white mb-1 leading-tight">{node.label}</h4>
                        <p className="text-[11px] md:text-[12px] text-slate-400 leading-snug">{node.desc}</p>
                        
                        <div className="mt-4 flex items-center text-[11px] font-semibold text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Learn More <ArrowRight size={12} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </>
              );
            })()}
          </div>
        </div>
      </section>

      {/* SECTION 5: ACADEMIC EVOLUTION (Floating Premium Cards) */}
      <section className="py-32 px-5 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-[32px] md:text-[48px] font-[800] text-[#123A7A]">Academic Evolution</h2>
            <p className="text-[#0F172A]/60 font-[500] mt-4">Three schools designed for the future of industry and research.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "School of Computing Sciences", color: "from-[#1E3A8A] to-[#3B82F6]", icon: Code, tags: ["Computer Science & Engineering", "Artificial Intelligence", "Data Science", "Cyber Security"] },
              { title: "School of Engineering", color: "from-[#0F172A] to-[#334155]", icon: Cpu, tags: ["Electronics and Communication Engineering", "Civil Engineering", "Basic Science & Humanities"] },
              { title: "School of Business & Management", color: "from-[#B45309] to-[#F59E0B]", icon: Briefcase, tags: ["Business and Management"] }
            ].map((school, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -15 }}
                className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#E7EDF4] relative overflow-hidden group cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${school.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] border border-[#E7EDF4] flex items-center justify-center mb-8 group-hover:bg-white/20 group-hover:border-white/30 transition-colors">
                    <school.icon size={28} className="text-[#123A7A] group-hover:text-white transition-colors" />
                  </div>
                  
                  <h3 className="text-[22px] font-[800] text-[#123A7A] group-hover:text-white transition-colors mb-6">{school.title}</h3>
                  
                  <div className="mt-auto flex flex-wrap gap-2">
                    {school.tags.map((tag, j) => (
                      <span key={j} className="px-3 py-1 text-[12px] font-[600] bg-[#E7EDF4] text-[#123A7A] rounded-full group-hover:bg-white/20 group-hover:text-white transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: INNOVATION ECOSYSTEM (Flowchart) */}
      <section className="py-32 bg-white border-y border-[#E7EDF4] overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-5 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[32px] md:text-[48px] font-[800] text-[#123A7A] mb-20"
          >
            Innovation Ecosystem
          </motion.h2>

          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            {[
              "Student", "Idea", "Innovation Lab", "Prototype", "Research", "Incubation", "Startup", "Industry", "Global Impact"
            ].map((step, i, arr) => (
              <React.Fragment key={i}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`px-6 py-4 rounded-2xl font-[700] text-[14px] md:text-[16px] shadow-sm border ${i === arr.length - 1 ? 'bg-[#D32F2F] text-white border-[#D32F2F] shadow-lg scale-110' : 'bg-[#F8FAFC] text-[#123A7A] border-[#E7EDF4] hover:border-[#123A7A] hover:bg-white transition-colors'}`}
                >
                  {step}
                </motion.div>
                {i < arr.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (i * 0.1) + 0.1 }}
                  >
                    <ArrowRight className="text-[#D32F2F] hidden md:block" />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: INNOVATION INFRASTRUCTURE (Interactive Bento) */}
      <section className="py-32 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-5">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-[32px] md:text-[48px] font-[800] text-[#123A7A]">Innovation Infrastructure</h2>
            <p className="text-[#0F172A]/60 font-[500] mt-4 max-w-2xl">State-of-the-art facilities designed to transition students from passive recipients into active innovators.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[600px]">
            {/* Bento Box 1 - Large */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 0.98 }}
              className="md:col-span-2 md:row-span-2 bg-[#123A7A] rounded-3xl p-8 text-white relative overflow-hidden group cursor-pointer shadow-md"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col h-full justify-end">
                <Lightbulb size={40} className="mb-4 text-[#D32F2F]" />
                <h3 className="text-[28px] font-[800] mb-2">Innovation Centre</h3>
                <p className="text-white/80 font-[500] text-[15px]">Seed-stage mentoring, prototyping support, and startup incubation.</p>
              </div>
            </motion.div>

            {/* Bento Box 2 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 0.98 }}
              className="md:col-span-1 md:row-span-1 bg-white border border-[#E7EDF4] rounded-3xl p-6 relative overflow-hidden group cursor-pointer shadow-sm"
            >
              <Microscope className="text-[#123A7A] mb-4" size={32} />
              <h3 className="text-[18px] font-[800] text-[#123A7A] mb-1">Centres of Excellence</h3>
              <p className="text-[#0F172A]/60 text-[13px] font-[500]">AI/ML, IoT & Robotics</p>
            </motion.div>

            {/* Bento Box 3 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 0.98 }}
              className="md:col-span-1 md:row-span-1 bg-[#D32F2F] text-white rounded-3xl p-6 relative overflow-hidden group cursor-pointer shadow-sm"
            >
              <Zap className="mb-4" size={32} />
              <h3 className="text-[18px] font-[800] mb-1">Maker Space</h3>
              <p className="text-white/80 text-[13px] font-[500]">Hands-on fabrication</p>
            </motion.div>

            {/* Bento Box 4 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 0.98 }}
              className="md:col-span-2 md:row-span-1 bg-white border border-[#E7EDF4] rounded-3xl p-6 flex items-center gap-6 group cursor-pointer shadow-sm"
            >
              <div className="w-16 h-16 rounded-full bg-[#F8FAFC] flex items-center justify-center shrink-0 group-hover:bg-[#123A7A] transition-colors">
                <Target size={28} className="text-[#123A7A] group-hover:text-white transition-colors" />
              </div>
              <div>
                <h3 className="text-[20px] font-[800] text-[#123A7A] mb-1">E-Cell & Industry Interface</h3>
                <p className="text-[#0F172A]/60 text-[14px] font-[500]">Structured venture-creation training and continuous industry alignment.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 8: OUR VISION FOR TOMORROW (Finale) */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#123A7A]">
        {/* Animated Gradient & Particles Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#123A7A] via-[#0A2044] to-[#123A7A] animate-gradient-xy"></div>
        
        {/* Simple CSS particles */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000) 
              }}
              animate={{ 
                y: [null, Math.random() * -500],
                opacity: [0.1, 0.8, 0]
              }}
              transition={{ 
                duration: 5 + Math.random() * 5, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-[900px] mx-auto px-5 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="text-[36px] md:text-[56px] font-[900] text-white leading-tight mb-8">
              Our Vision for Tomorrow
            </h2>
            <p className="text-[18px] md:text-[24px] text-white/80 font-[500] leading-relaxed mb-16">
              Chalapathi University is envisioned as a multidisciplinary institution where <span className="text-white font-[700]">innovation meets purpose</span>, research fuels progress, and every learner is empowered to become a leader capable of creating meaningful impact across the world.
            </p>
            

          </motion.div>
        </div>
      </section>

      {/* Add Custom Animations Config */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradient-xy {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 15s ease infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}} />
    </div>
  );
}

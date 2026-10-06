import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { Award, ChevronRight, ArrowLeft, CheckCircle2, ShieldCheck, Briefcase, Zap, Globe, ArrowRight, X } from "lucide-react";

import { certifications, Certification } from "../../data/certifications";
import { useData } from "../../context/DataContext";
import FullscreenModal from "../certifications/FullscreenModal";

export default function GlobalCertifications() {
  const { certificationsData, certificationsPageConfig } = useData();
  const certList = certificationsData && certificationsData.length > 0 ? certificationsData : certifications;
  const pageConfig = certificationsPageConfig || {
    badgeText: "Global Certifications",
    headline: "Adding Global Value\nTo Your Degree.",
    description1: "At Chalapathi University, we believe a degree alone isn't enough to stand out in today's competitive world — industry-recognized certifications give students the extra edge employers look for.",
    description2: "Students are provided opportunities to earn globally acclaimed certifications alongside their academic curriculum, boosting their skills, credibility, and career readiness.",
    worldStageHeadline: "Ready for the World Stage.",
    worldStageDescription: "These certifications, combined with academic learning, ensure students graduate as globally competent, industry-ready professionals — confident to compete not just in national markets, but anywhere in the world.",
    worldStageButtonText: "View Curriculum",
    worldStageButtonLink: "/academics/programmes"
  };
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedCert]);

  return (
    <section 
      ref={containerRef}
      className="relative w-full overflow-hidden font-sans bg-white"
    >
      {/* Container with balanced spacing */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-12 pb-24 relative z-10">
        
        {/* Header Section inside a red outline box */}
        <div className="border border-[#D4AF37] rounded-2xl p-8 md:p-12 mb-12 bg-white/40 shadow-sm flex flex-col md:flex-row gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:w-1/2"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="h-[2px] w-12 bg-[#072A6C] block"></span>
              <span className="text-[#072A6C] font-bold tracking-widest uppercase text-sm">{pageConfig.badgeText}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#072A6C] leading-[1.1] tracking-tight whitespace-pre-line">
              {pageConfig.headline}
            </h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:w-1/2 text-gray-600 text-[15px] leading-relaxed"
          >
            <p>
              {pageConfig.description1}
            </p>
            {pageConfig.description2 && (
              <p className="mt-4">
                {pageConfig.description2}
              </p>
            )}
          </motion.div>
        </div>

        {/* Certifications Grid - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 relative">
          {certList.map((cert, index) => {
            return (

              <motion.div
                key={cert.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.4, delay: (index % 4) * 0.05 }}
                className="group flex flex-col bg-white border border-gray-200 rounded-[8px] shadow-sm hover:border-[#072A6C]/40 hover:shadow-md transition-all duration-300 relative pt-3 overflow-hidden"
              >
                {/* Top Folder Tab Decoration */}
                <div className="absolute top-0 left-0 right-0 h-2.5 bg-[#072A6C]/80"></div>
                
                {/* Rectangular Logo Badge */}
                <div className="absolute top-4 right-4 h-12 min-w-[60px] max-w-[160px] bg-white rounded-md flex items-center justify-center gap-2 shadow-sm px-3 py-1 z-10 border border-gray-150">
                  {cert.images.map((img, idx) => (
                    <img 
                      key={idx}
                      src={img} 
                      alt={`${cert.name} logo ${idx + 1}`} 
                      className={`${cert.images.length > 1 ? 'h-6 max-w-[60px]' : 'h-8 max-w-[100px]'} w-auto object-contain`}
                    />
                  ))}
                </div>

                <div className="p-6 pt-16 flex flex-col flex-grow relative z-0">
                  <h3 className="text-xl font-bold text-[#203348] mb-6 pr-2 leading-tight min-h-[56px]">
                    {cert.name}
                  </h3>
                  
                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-3 border-t border-gray-100 pt-4">
                    <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">CERTIFICATION COURSE</span>
                    <Award size={14} className="text-[#3b4b5e] ml-auto" />
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed mb-4 flex-grow">
                    {cert.description.length > 80 ? cert.description.slice(0, 80) + '...' : cert.description}
                  </p>

                  <button 
                    onClick={() => setSelectedCert(cert)}
                    className="w-full py-3 bg-[#425974] hover:bg-[#072A6C] text-white text-[13px] font-semibold rounded-[4px] transition-colors duration-200 mt-auto block text-center cursor-pointer outline-none"
                  >
                    Read More
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Conclusion Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 bg-[#f8fafc] border border-gray-200 rounded-[12px] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-12"
        >
          <div className="md:w-2/3">
            <h3 className="text-3xl font-black text-[#072A6C] mb-4">
              {pageConfig.worldStageHeadline || "Ready for the World Stage."}
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
              {pageConfig.worldStageDescription || "These certifications, combined with academic learning, ensure students graduate as globally competent, industry-ready professionals — confident to compete not just in national markets, but anywhere in the world."}
            </p>
          </div>

          <div className="md:w-1/3 flex justify-end">
            <a 
              href={pageConfig.worldStageButtonLink || "/academics/programmes"}
              className="bg-[#072A6C] hover:bg-[#051d4d] text-white px-8 py-4 rounded font-bold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-3 w-full sm:w-auto justify-center cursor-pointer"
            >
              <span>{pageConfig.worldStageButtonText || "View Curriculum"}</span>
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </motion.div>

      </div>

      {/* ======================================================== */}
      {/* 🌟 CERTIFICATION DETAIL POPUP MODAL                      */}
      {/* ======================================================== */}
      {createPortal(
        <AnimatePresence>
          {selectedCert && (
            <FullscreenModal 
              cert={selectedCert} 
              onClose={() => setSelectedCert(null)} 
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}

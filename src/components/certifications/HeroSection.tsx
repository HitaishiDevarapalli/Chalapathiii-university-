import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { Certification } from '../../data/certifications';

interface HeroSectionProps {
  cert: Certification;
}

export default function HeroSection({ cert }: HeroSectionProps) {
  return (
    <div className="relative overflow-hidden w-full min-h-[600px] flex items-center justify-center pt-24 pb-12">
      {/* Animated Particles / Gradients */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] rounded-full blur-[120px]"
          style={{ backgroundColor: cert.color }}
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] bg-blue-100"
        />
      </div>

      <div className="max-w-[1200px] mx-auto w-full px-6 relative z-10 flex flex-col md:flex-row items-center gap-16">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-1/2 space-y-8"
        >
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/50 shadow-sm"
            >
              <ShieldCheck size={16} style={{ color: cert.color }} />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-gray-800">
                Official {cert.domain} Partner
              </span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-[1.05] tracking-tighter">
              {cert.tagline}
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed max-w-xl">
              {cert.description} Earn globally recognized credentials and master industry-standard tools.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center gap-4 pt-4"
          >

            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Duration</span>
              <span className="text-sm font-bold text-gray-800">{cert.duration}</span>
            </div>
            <div className="flex flex-col ml-4 border-l border-gray-200 pl-4">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Difficulty</span>
              <span className="text-sm font-bold text-gray-800">{cert.difficulty}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Badge Graphic */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className="w-full md:w-1/2 flex items-center justify-center perspective-[1000px]"
        >
          <div className="relative w-[320px] h-[380px] bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[32px] shadow-[0_30px_80px_rgba(0,0,0,0.1)] p-10 flex flex-col items-center justify-center gap-10 group overflow-hidden">
            {/* Glossy reflection */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-white/40 to-transparent pointer-events-none rounded-[32px]"></div>
            
            {/* Color accent glow */}
            <div 
              className="absolute inset-0 rounded-[32px] opacity-10 transition-opacity duration-700"
              style={{ background: `radial-gradient(circle at center, ${cert.color}, transparent 70%)` }}
            />
            
            <div className="flex flex-wrap items-center justify-center gap-6 relative z-10">
              {cert.images.map((img, i) => (
                <img 
                  key={i} 
                  src={img} 
                  alt={`${cert.name} Logo ${i+1}`} 
                  className="h-20 w-auto max-w-[160px] object-contain drop-shadow-md" 
                />
              ))}
            </div>
            
            <div className="text-center relative z-10">
              <div className="inline-block px-3 py-1 bg-gray-900 rounded-full mb-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-white">Global Recognition</p>
              </div>
              <h3 className="text-xl font-bold text-gray-800">{cert.name} Certified</h3>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

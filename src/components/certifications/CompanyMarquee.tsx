import React from 'react';
import { motion } from 'framer-motion';

interface MarqueeProps {
  companies: string[];
  color: string;
}

export default function CompanyMarquee({ companies, color }: MarqueeProps) {
  // Duplicate array to create seamless loop
  const marqueeItems = [...companies, ...companies, ...companies];

  return (
    <div className="w-full py-16 overflow-hidden bg-gray-50 border-y border-gray-100 relative">
      {/* Edge Gradients for smooth fade */}
      <div className="absolute top-0 bottom-0 left-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
      <div className="absolute top-0 bottom-0 right-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
      
      <div className="text-center mb-8 relative z-20">
        <h2 className="text-xs font-black uppercase tracking-[0.25em] text-[#072A6C]">Companies Hiring</h2>
      </div>

      <div className="flex w-fit">
        <motion.div
          animate={{ x: "-33.33%" }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="flex items-center gap-14 px-6"
        >
          {marqueeItems.map((company, index) => (
            <div 
              key={index} 
              className="text-2xl md:text-3xl font-black text-[#072A6C] opacity-85 hover:opacity-100 hover:text-[#D4AF37] transition-colors duration-200 select-none whitespace-nowrap cursor-default"
            >
              {company}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

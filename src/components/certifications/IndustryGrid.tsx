import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Factory, Landmark, HeartPulse, Laptop } from 'lucide-react';

interface IndustryProps {
  industries: { name: string; desc: string }[];
  color: string;
}

const industryIcons: Record<string, React.ReactNode> = {
  Manufacturing: <Factory size={28} />,
  Banking: <Landmark size={28} />,
  Healthcare: <HeartPulse size={28} />,
  "IT & Tech": <Laptop size={28} />
};

export default function IndustryGrid({ industries, color }: IndustryProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Where Is It Used?</h2>
        <h3 className="text-3xl md:text-4xl font-black text-gray-900">Industry Applications</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {industries.map((ind, index) => {
          const isActive = activeIdx === index;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              onClick={() => setActiveIdx(isActive ? null : index)}
              className={`relative p-8 rounded-3xl cursor-pointer border transition-all duration-300 flex flex-col items-center justify-center text-center overflow-hidden ${
                isActive 
                  ? 'bg-white shadow-xl scale-105 z-10' 
                  : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-sm'
              }`}
              style={{ borderColor: isActive ? color : undefined }}
            >
              {isActive && (
                <div 
                  className="absolute inset-0 opacity-5"
                  style={{ backgroundColor: color }}
                />
              )}
              
              <div 
                className="mb-4 transition-transform duration-300"
                style={{ color: isActive ? color : '#9ca3af', transform: isActive ? 'scale(1.2)' : 'scale(1)' }}
              >
                {industryIcons[ind.name] || <Factory size={28} />}
              </div>
              <h4 className={`text-sm font-bold transition-colors ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                {ind.name}
              </h4>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="text-xs text-gray-500 font-light leading-relaxed relative z-10"
                  >
                    {ind.desc}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

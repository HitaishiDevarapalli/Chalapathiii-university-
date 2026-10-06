import React from 'react';
import { motion } from 'framer-motion';

interface JourneyProps {
  timeline: { milestone: string; desc: string }[];
  color: string;
}

export default function InteractiveJourney({ timeline, color }: JourneyProps) {
  return (
    <div className="w-full">
      <div className="text-center mb-16">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-2">The Journey</h2>
        <h3 className="text-3xl md:text-4xl font-black text-gray-900">How You'll Get There</h3>
      </div>

      <div className="relative">
        {/* Horizontal Line connecting the nodes */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-100 hidden md:block">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-full"
            style={{ backgroundColor: color }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 relative z-10">
          {timeline.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="flex flex-col items-center md:items-start relative group"
            >
              {/* Node Circle */}
              <div 
                className="w-12 h-12 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-sm shadow-md mb-6"
                style={{ backgroundColor: color }}
              >
                {index + 1}
              </div>
              
              <div className="text-center md:text-left">
                <h4 className="text-base font-extrabold text-gray-900 mb-2">{step.milestone}</h4>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

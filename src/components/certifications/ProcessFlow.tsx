import React from 'react';
import { motion } from 'framer-motion';

export default function ProcessFlow({ color }: { color: string }) {
  const steps = [
    "Enroll in Course",
    "Master Concepts",
    "Hands-on Labs",
    "Capstone Project",
    "Mock Evaluation",
    "Global Exam",
    "Certified!"
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-16">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Certification Process</h2>
        <h3 className="text-3xl md:text-4xl font-black text-gray-900">Your Path to Success</h3>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {steps.map((step, index) => (
          <React.Fragment key={index}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="px-6 py-4 bg-white border border-gray-100 shadow-sm rounded-2xl text-center font-bold text-sm md:text-base whitespace-nowrap text-gray-800 transition-colors"
              style={{ borderBottom: `4px solid ${color}` }}
            >
              {step}
            </motion.div>
            
            {index < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                className="hidden md:block text-gray-300"
              >
                ➔
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

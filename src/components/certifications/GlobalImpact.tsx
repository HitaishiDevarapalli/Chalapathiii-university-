import React from 'react';
import { motion } from 'framer-motion';

interface ImpactProps {
  stats: { countries: number; jobs: string; demand: string };
  color: string;
}

export default function GlobalImpact({ stats, color }: ImpactProps) {
  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Global Impact</h2>
        <h3 className="text-3xl md:text-4xl font-black text-gray-900">The Power of the Credential</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Countries Using It", value: stats.countries + "+" },
          { label: "Jobs Available", value: stats.jobs },
          { label: "Market Demand", value: stats.demand }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2, type: "spring" }}
            className="bg-white border border-gray-100 rounded-[32px] p-8 text-center shadow-lg hover:shadow-xl transition-shadow relative overflow-hidden group"
          >
            {/* Background glow on hover */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
              style={{ backgroundColor: color }}
            />
            
            <h4 
              className="text-4xl md:text-5xl font-black mb-2"
              style={{ color: color }}
            >
              {stat.value}
            </h4>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

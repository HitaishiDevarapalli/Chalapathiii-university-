import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Zap, TrendingUp, Globe } from 'lucide-react';

interface FeatureProps {
  features: { icon: string; title: string; desc: string }[];
  color: string;
}

const iconMap: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase size={24} />,
  Zap: <Zap size={24} />,
  TrendingUp: <TrendingUp size={24} />,
  Globe: <Globe size={24} />
};

export default function FeatureCards({ features, color }: FeatureProps) {
  return (
    <div className="w-full">
      <div className="mb-12">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Why This Certification</h2>
        <h3 className="text-3xl md:text-4xl font-black text-gray-900">Unlock Your Potential</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="bg-white border border-gray-100 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all flex flex-col items-start gap-4 group"
          >
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${color}15`, color: color }}
            >
              {iconMap[feature.icon] || <Zap size={24} />}
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-500 font-light leading-relaxed">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

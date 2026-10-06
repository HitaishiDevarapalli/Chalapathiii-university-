import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Certification } from '../../data/certifications';

// Import subcomponents
import HeroSection from './HeroSection';
import InteractiveJourney from './InteractiveJourney';
import FeatureCards from './FeatureCards';
import SkillChips from './SkillChips';
import IndustryGrid from './IndustryGrid';
import CareerRoadmap from './CareerRoadmap';
import CompanyMarquee from './CompanyMarquee';
import ProjectCards from './ProjectCards';
import GlobalImpact from './GlobalImpact';
import ProcessFlow from './ProcessFlow';

interface FullscreenModalProps {
  cert: Certification;
  onClose: () => void;
}

export default function FullscreenModal({ cert, onClose }: FullscreenModalProps) {
  // We can switch ordering based on layoutMode
  const renderLayout = () => {
    switch (cert.layoutMode) {
      case "dashboard":
      case "pipeline":
      case "topology":
      case "journey":
      case "shield":
      case "pcb":
      case "factory":
      case "code":
      case "roadmap":
      case "cloud":
      case "global":
      case "database":
      case "lifecycle":
      case "funnel":
      default:
        // Default rich storytelling layout
        return (
          <div className="flex flex-col gap-24 pb-32">
            <HeroSection cert={cert} />
            <div className="max-w-[1200px] mx-auto w-full px-6 space-y-32">
              <InteractiveJourney timeline={cert.timeline} color={cert.color} />
              <FeatureCards features={cert.features} color={cert.color} />
              <SkillChips skills={cert.skills} color={cert.color} />
              <IndustryGrid industries={cert.industries} color={cert.color} />
              <CareerRoadmap roadmap={cert.roadmap} color={cert.color} />
              <CompanyMarquee companies={cert.companies} color={cert.color} />
              <ProjectCards projects={cert.projects} color={cert.color} />
              <GlobalImpact stats={cert.stats} color={cert.color} />
              <ProcessFlow color={cert.color} />
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[9999] bg-white/70 backdrop-blur-3xl overflow-y-auto scrollbar-none font-sans"
    >
      <button 
        onClick={onClose}
        className="fixed top-6 right-6 z-50 w-12 h-12 bg-black/5 hover:bg-black/10 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 transition-colors cursor-pointer"
      >
        <X size={24} />
      </button>

      {renderLayout()}
    </motion.div>
  );
}

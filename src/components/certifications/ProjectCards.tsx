import React from 'react';
import { motion } from 'framer-motion';
import { FolderGit2 } from 'lucide-react';

interface ProjectsProps {
  projects: { name: string; duration: string; difficulty: string }[];
  color: string;
}

export default function ProjectCards({ projects, color }: ProjectsProps) {
  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Student Projects</h2>
        <h3 className="text-3xl md:text-4xl font-black text-gray-900">Hands-on Experience</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer flex flex-col h-full"
          >
            {/* Visual Header */}
            <div 
              className="h-32 w-full flex items-center justify-center relative overflow-hidden transition-colors duration-500"
              style={{ backgroundColor: `${color}10` }}
            >
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
              <FolderGit2 size={48} style={{ color: color }} className="relative z-10" />
            </div>

            <div className="p-6 flex flex-col flex-grow bg-white">
              <h4 className="text-lg font-bold text-gray-900 mb-4">{project.name}</h4>
              
              <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Duration</span>
                  <span className="text-xs font-semibold text-gray-700">{project.duration}</span>
                </div>
                <div className="flex flex-col ml-auto text-right">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Difficulty</span>
                  <span className="text-xs font-semibold text-gray-700">{project.difficulty}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

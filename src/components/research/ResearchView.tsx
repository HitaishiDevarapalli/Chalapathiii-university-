import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Wrench, ArrowLeft } from "lucide-react";
import { 
  DEFAULT_RESEARCH_DATA, 
  ResearchCMSData 
} from "../admin/ResearchCMS";

interface ResearchViewProps {
  path?: string;
}

export const ResearchView: React.FC<ResearchViewProps> = () => {
  const [data, setData] = useState<ResearchCMSData>(() => {
    try {
      const saved = localStorage.getItem("chalapathi_research_cms_data");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_RESEARCH_DATA;
  });

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem("chalapathi_research_cms_data");
        if (saved) setData(JSON.parse(saved));
      } catch (e) {}
    };

    window.addEventListener("chalapathi_cms_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("chalapathi_cms_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const visibleItems = (data.items || []).filter((item) => !item.hidden);

  return (
    <div className="min-h-[72vh] flex flex-col items-center justify-center px-4 py-20 text-center font-[var(--font-poppins)] bg-white select-none">
      {/* Icon */}
      <div className="text-amber-500 mb-4 animate-bounce">
        <Wrench size={48} strokeWidth={2} />
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#072A6C] tracking-tight uppercase">
        Under Construction
      </h1>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-gray-500 font-medium mt-3 max-w-md">
        This page is currently under construction.
      </p>

      {/* Back to Home Link */}
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 text-xs font-bold text-[#072A6C] hover:text-amber-600 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to Home</span>
      </Link>

      {/* Published Items (if admin adds items) */}
      {visibleItems.length > 0 && (
        <div className="max-w-4xl w-full mx-auto mt-14 pt-8 border-t border-gray-100 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleItems.map((item) => (
              <div key={item.id} className="p-4 border-b border-gray-100 space-y-1">
                <span className="text-[10px] font-black uppercase text-[#072A6C]">{item.category}</span>
                <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
                {item.link && (
                  <a href={item.link} className="text-xs font-bold text-[#072A6C] hover:underline inline-block mt-1">
                    {item.linkText || "Learn More"} &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

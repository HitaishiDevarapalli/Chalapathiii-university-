"use client";

import React, { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AIAssistant from "@/components/features/AIAssistant";
import { Building, Award, Target, Landmark, FileText, ChevronRight } from "lucide-react";

export default function AboutPage() {
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Header onToggleAi={() => setAiOpen(!aiOpen)} />

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary-blue to-indigo-950 text-white py-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-4 relative z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-gold">Who We Are</span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-none">About Chalapathy University</h1>
          <p className="text-xs text-zinc-300 max-w-xl leading-relaxed">
            As the Best University in Andhra Pradesh, Chalapathy University stands as a beacon of academic rigor and transformative education.
          </p>
          <div className="text-[11px] text-zinc-400 font-medium max-w-2xl border-t border-white/10 pt-3 leading-relaxed">
            <strong>Branding Heritage:</strong> Chalapathy, being the name of the "Lord Venkateswara" in his adolescence, suggests the noble restlessness of questioning minds who advance humanity in their search for answers. Every institution promoted by our society proudly bears "Chalapathy" as its prefix.
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        {/* Vision & Mission */}
        <div id="vision-mission" className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white border border-zinc-100 p-8 rounded-2xl shadow-sm">
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-primary-blue flex items-center gap-2">
              <Target className="text-primary-gold" size={20} /> Our Vision
            </h2>
            <p className="text-xs text-zinc-600 leading-relaxed font-medium">
              To be a globally integrated institution of academic and research excellence, nurturing ethically strong, technically competent, and socially responsible global citizens who drive innovation and sustainable development.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-primary-blue flex items-center gap-2">
              <Building className="text-primary-gold" size={20} /> Our Mission
            </h2>
            <ul className="space-y-2.5 text-xs text-zinc-600 font-semibold">
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 bg-primary-gold rounded-full shrink-0 mt-1.5"></span>
                To deliver value-based academic curricula aligned with National Education Policy (NEP) guidelines.
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 bg-primary-gold rounded-full shrink-0 mt-1.5"></span>
                To foster interdisciplinary research, industrial collaborations, and startup incubation.
              </li>
              <li className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 bg-primary-gold rounded-full shrink-0 mt-1.5"></span>
                To provide state-of-the-art infrastructure and student support services.
              </li>
            </ul>
          </div>
        </div>

        {/* Leadership Grid */}
        <div id="leadership" className="space-y-6">
          <div className="border-b border-zinc-200 pb-2">
            <h2 className="text-xl font-extrabold text-primary-blue">University Leadership</h2>
            <p className="text-xs text-zinc-500 mt-1">Meet the executive leadership guiding the university's academic direction.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Sri Y. V. Anjaneyulu", title: "Chancellor / Founder", credentials: "Renowned Educationist & Visionary", bio: "Sri Y.V. Anjaneyulu has spent over three decades building premium educational establishments in Guntur, dedicated to raising the standard of professional education." },
              { name: "Sri Y. Sujit Kumar", title: "Pro Chancellor", credentials: "B.Tech & MBA - Executive Education", bio: "Sri Y. Sujit Kumar leads institutional progress planning, modernization initiatives, and strategic industry collaborations." }
            ].map((lead, idx) => (
              <div key={idx} className="bg-white border border-zinc-100 rounded-2xl p-6 shadow-sm space-y-4">
                <div>
                  <h3 className="font-extrabold text-sm text-primary-blue">{lead.name}</h3>
                  <span className="block text-[10px] text-primary-gold font-bold uppercase mt-0.5">{lead.title}</span>
                  <span className="block text-[9px] text-zinc-400 font-semibold mt-0.5">{lead.credentials}</span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-medium border-t border-zinc-100 pt-3">
                  {lead.bio}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Accreditations and Compliances */}
        <div id="accreditation" className="space-y-6">
          <div className="border-b border-zinc-200 pb-2">
            <h2 className="text-xl font-extrabold text-primary-blue">Accreditation & Approvals</h2>
            <p className="text-xs text-zinc-500 mt-1">Our compliance certifications from national regulatory bodies.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { tag: "UGC Recognition", desc: "Recognised under section 2(f) of the UGC Act, 1956, allowing students to claim research fellowships and national qualifications." },
              { tag: "NAAC Grade 'A'", desc: "Accredited with premium institutional grades for superior classroom infrastructure, faculty research indices, and learning facilities." },
              { tag: "Pharmacy Council of India (PCI)", desc: "Approvals for School of Pharmacy courses, certifying professional licensure for our pharmacology graduates." },
              { tag: "Bar Council of India (BCI)", desc: "National board approvals for our 5-year integrated law streams (BA LL.B & BBA LL.B) and courtroom clinics." }
            ].map((acc, idx) => (
              <div key={idx} className="bg-white border border-zinc-100 rounded-2xl p-5 shadow-sm flex gap-4 items-start">
                <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl shrink-0 mt-0.5">
                  <Award size={18} />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-primary-blue">{acc.tag}</h4>
                  <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">{acc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <Footer />
      <AIAssistant isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, ArrowRight, CheckCircle2, RotateCcw, BrainCircuit, Heart, Scale, Microscope, ShieldAlert } from "lucide-react";

interface ProgramFinderProps {
  onClose?: () => void;
}

const steps = [
  {
    title: "Level of Study",
    description: "Select the level of program you are looking to pursue."
  },
  {
    title: "Area of Interest",
    description: "Choose the discipline that matches your career aspiration."
  },
  {
    title: "Current Qualification",
    description: "Indicate your highest qualification score to evaluate eligibility."
  }
];

export default function ProgramFinder({ onClose }: ProgramFinderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [level, setLevel] = useState("");
  const [interest, setInterest] = useState("");
  const [grades, setGrades] = useState("");

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleReset = () => {
    setLevel("");
    setInterest("");
    setGrades("");
    setCurrentStep(0);
  };

  // Recommendations matching matrix
  const getRecommendation = () => {
    let school = "";
    let slug = "";
    let courses: string[] = [];

    if (interest === "tech") {
      school = "School of Artificial Intelligence";
      slug = "school-of-artificial-intelligence";
      courses = ["B.Tech in Artificial Intelligence & Machine Learning", "B.Tech in Data Science", "M.Tech in Intelligent Systems"];
    } else if (interest === "engineering") {
      school = "School of Engineering";
      slug = "school-of-engineering";
      courses = ["B.Tech in Computer Science & Engineering", "B.Tech in Electronics & Communication", "M.Tech in VLSI Design"];
    } else if (interest === "pharma") {
      school = "School of Pharmacy";
      slug = "school-of-pharmacy";
      courses = ["Bachelor of Pharmacy (B.Pharm)", "Doctor of Pharmacy (Pharm.D)", "M.Pharm in Pharmaceutics"];
    } else if (interest === "business") {
      school = "School of Management";
      slug = "school-of-management";
      courses = ["BBA in Business Analytics", "MBA in Finance & Marketing", "MBA in Human Resource Management"];
    } else if (interest === "sciences") {
      school = "School of Sciences";
      slug = "school-of-sciences";
      courses = ["B.Sc in Biotechnology & Chemistry", "M.Sc in Physics", "PhD in Sciences"];
    } else if (interest === "agri") {
      school = "School of Agriculture";
      slug = "school-of-agriculture";
      courses = ["B.Sc (Hons.) in Agriculture", "M.Sc in Agronomy", "PhD in Soil Sciences"];
    } else if (interest === "health") {
      school = "School of Health Sciences";
      slug = "school-of-health-sciences";
      courses = ["Bachelor of Physiotherapy (BPT)", "B.Sc in Nursing", "Master of Public Health (MPH)"];
    } else if (interest === "law") {
      school = "School of Law";
      slug = "school-of-law";
      courses = ["BA LL.B (5-Year Integrated)", "BBA LL.B (5-Year Integrated)", "Master of Laws (LL.M)"];
    } else if (interest === "humanities") {
      school = "School of Humanities";
      slug = "school-of-humanities";
      courses = ["BA in English & Journalism", "BA in Economics & Psychology", "MA in Applied Sociology"];
    } else {
      school = "School of Allied Health Sciences";
      slug = "school-of-allied-health-sciences";
      courses = ["B.Sc in Medical Lab Technology (BMLT)", "B.Sc in Anaesthesia Technology", "M.Sc in Optometry"];
    }

    // Adjust degree level
    if (level === "pg") {
      courses = courses.filter(c => c.startsWith("M.") || c.startsWith("Master") || c.includes("MBA") || c.includes("Doctor"));
      if (courses.length === 0) courses = [`Master of Science in ${school.split("of ")[1]}`];
    } else if (level === "phd") {
      courses = [`PhD in research domains of ${school.split("of ")[1]}`];
    }

    return { school, slug, courses };
  };

  const rec = getRecommendation();

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 p-6 max-w-xl w-full font-sans mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-gold/10 text-primary-gold font-bold text-[10px] uppercase tracking-wide">
            <BrainCircuit size={12} /> Smart Finder
          </span>
          <h3 className="text-lg font-extrabold text-primary-blue mt-1">Smart Program Finder</h3>
          <p className="text-xs text-zinc-500 mt-0.5">Answer 3 quick questions to discover your ideal program</p>
        </div>
      </div>

      {/* Progress Bar */}
      {currentStep < steps.length && (
        <div className="mb-6">
          <div className="flex justify-between text-[10px] text-zinc-400 font-bold uppercase mb-1">
            <span>Step {currentStep + 1} of 3: {steps[currentStep].title}</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-primary-gold h-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Step 1: Study Level */}
      {currentStep === 0 && (
        <div className="space-y-4">
          <label className="text-xs font-bold text-zinc-600 block">What is your desired level of education?</label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: "ug", title: "Undergraduate (UG)", desc: "B.Tech, B.Pharm, BBA, B.Sc, BA, LL.B (After 12th / Intermediate)" },
              { id: "pg", title: "Postgraduate (PG)", desc: "MBA, M.Tech, M.Pharm, M.Sc, MA, LL.M (After Graduation)" },
              { id: "phd", title: "Doctoral (PhD)", desc: "Doctor of Philosophy, Research Fellowships (After PG)" }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setLevel(opt.id);
                  handleNext();
                }}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  level === opt.id 
                    ? "border-primary-gold bg-primary-gold/5" 
                    : "border-zinc-100 hover:border-zinc-200"
                }`}
              >
                <div className="font-extrabold text-sm text-primary-blue">{opt.title}</div>
                <div className="text-[11px] text-zinc-500 mt-1">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Area of Interest */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <label className="text-xs font-bold text-zinc-600 block">Which domain aligns with your interest?</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "tech", label: "AI & Data Science", icon: BrainCircuit },
              { id: "engineering", label: "Core Engineering", icon: GraduationCap },
              { id: "pharma", label: "Pharmacy & Drugs", icon: Microscope },
              { id: "business", label: "Business & Management", icon: GraduationCap },
              { id: "sciences", label: "Basic Sciences", icon: Microscope },
              { id: "agri", label: "Agriculture Studies", icon: Microscope },
              { id: "health", label: "Nursing & Health", icon: Heart },
              { id: "law", label: "Legal & Judiciary", icon: Scale },
              { id: "allied", label: "Allied Health Tech", icon: Heart },
              { id: "humanities", label: "Humanities & Social", icon: Heart }
            ].map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setInterest(opt.id);
                    handleNext();
                  }}
                  className={`text-left p-3.5 rounded-xl border-2 transition-all flex items-center gap-3 ${
                    interest === opt.id 
                      ? "border-primary-gold bg-primary-gold/5" 
                      : "border-zinc-100 hover:border-zinc-200"
                  }`}
                >
                  <div className={`p-2 rounded-lg ${interest === opt.id ? "bg-primary-gold text-primary-blue" : "bg-zinc-50 text-zinc-600"}`}>
                    <Icon size={16} />
                  </div>
                  <span className="font-bold text-xs text-primary-blue leading-tight">{opt.label}</span>
                </button>
              );
            })}
          </div>
          <button 
            onClick={() => setCurrentStep(0)}
            className="text-xs font-bold text-zinc-400 hover:text-zinc-600 flex items-center gap-1 mt-2"
          >
            Back to previous step
          </button>
        </div>
      )}

      {/* Step 3: Current Grades */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <label className="text-xs font-bold text-zinc-600 block">Select your approximate academic score range:</label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: "high", title: "Above 90% or Top Rankers", desc: "Eligible for 50% - 100% Merit Scholarship waivers." },
              { id: "medium", title: "75% - 90% in Boards / Entrance", desc: "Eligible for 25% - 50% scholarship grants." },
              { id: "pass", title: "60% - 75% Marks", desc: "Regular admission path subject to seat availability." }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setGrades(opt.id);
                  handleNext();
                }}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  grades === opt.id 
                    ? "border-primary-gold bg-primary-gold/5" 
                    : "border-zinc-100 hover:border-zinc-200"
                }`}
              >
                <div className="font-extrabold text-sm text-primary-blue">{opt.title}</div>
                <div className="text-[11px] text-zinc-500 mt-1">{opt.desc}</div>
              </button>
            ))}
          </div>
          <button 
            onClick={() => setCurrentStep(1)}
            className="text-xs font-bold text-zinc-400 hover:text-zinc-600 flex items-center gap-1 mt-2"
          >
            Back to previous step
          </button>
        </div>
      )}

      {/* Step 4: Results Display */}
      {currentStep === 3 && (
        <div className="space-y-5 animate-fade-in">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3">
            <CheckCircle2 size={24} className="text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <span className="block text-xs font-bold text-emerald-800">Matching Program Discovered!</span>
              <span className="block text-[11px] text-emerald-700/80">Based on your interests and qualifications, we recommend the following school.</span>
            </div>
          </div>

          <div className="border border-zinc-100 rounded-xl p-5 bg-gradient-to-br from-zinc-50 to-white shadow-sm space-y-4">
            <div>
              <span className="text-[9px] font-extrabold tracking-widest text-primary-gold uppercase">Recommended School</span>
              <h4 className="font-extrabold text-base text-primary-blue mt-0.5">{rec.school}</h4>
            </div>

            <div className="border-t border-zinc-100 pt-3">
              <span className="text-[9px] font-extrabold tracking-widest text-zinc-400 uppercase">Suggested Programs</span>
              <ul className="mt-2 space-y-1.5">
                {rec.courses.map((course, cIdx) => (
                  <li key={cIdx} className="text-xs font-semibold text-zinc-700 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-gold shrink-0"></span>
                    {course}
                  </li>
                ))}
              </ul>
            </div>

            {grades === "high" && (
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-[11px] text-amber-800 font-medium">
                <strong>Merit Scholarship Alert:</strong> Your score qualifies you for up to a <strong>100% Tuition Waiver</strong>. Make sure to apply soon!
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleReset}
              className="flex items-center gap-1 px-4 py-2 border border-zinc-200 hover:border-zinc-300 text-zinc-600 rounded-lg text-xs font-bold transition-all"
            >
              <RotateCcw size={12} /> Reset
            </button>
            <Link 
              to={`/academics`} 
              className="flex-1 text-center py-2.5 bg-primary-blue hover:bg-primary-blue/90 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              Explore School Details <ArrowRight size={12} />
            </Link>
            <Link 
              to="/admissions/apply" 
              className="flex-1 text-center py-2.5 bg-primary-gold hover:bg-primary-gold/90 text-primary-navy rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              Apply Online <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

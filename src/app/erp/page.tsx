"use client";

import React, { useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AIAssistant from "@/components/features/AIAssistant";
import { 
  User, Shield, GraduationCap, ClipboardList, 
  Calendar, CreditCard, Award, UserCheck, 
  Plus, Edit, Eye, Trash2, ArrowLeft, LogOut, CheckCircle, BarChart3 
} from "lucide-react";

type Role = "student" | "faculty" | "parent" | "admin" | null;

export default function ErpSimulator() {
  const [aiOpen, setAiOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<Role>(null);
  const [loginId, setLoginId] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Student portal states
  const [assignments, setAssignments] = useState([
    { id: 1, title: "AI Neural Network Design", deadline: "15 July 2026", status: "Pending" },
    { id: 2, title: "Pharmacology Lab Report", deadline: "18 July 2026", status: "Submitted" }
  ]);
  const [submittingAss, setSubmittingAss] = useState<number | null>(null);

  // Faculty portal states
  const [facultyAttendanceList, setFacultyAttendanceList] = useState([
    { id: 1, name: "A. Rajesh Kumar", regId: "2026-CSE-001", status: "Present" },
    { id: 2, name: "B. Deepthi Reddy", regId: "2026-CSE-002", status: "Present" },
    { id: 3, name: "C. Vineet Naidu", regId: "2026-CSE-003", status: "Absent" }
  ]);

  // Admin portal CMS states
  const [newsFeed, setNewsFeed] = useState([
    { id: 1, title: "Annual Convocation 2026 Announced", date: "10 July 2026" },
    { id: 2, title: "School of AI partners with NVIDIA", date: "08 July 2026" }
  ]);
  const [newPostTitle, setNewPostTitle] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginId.trim()) {
      setErrorMessage("Please enter a valid Registration ID");
      return;
    }
    // Select role based on registration prefix or just default based on input
    const idLower = loginId.toLowerCase();
    if (idLower.startsWith("st")) {
      setActiveRole("student");
    } else if (idLower.startsWith("fa")) {
      setActiveRole("faculty");
    } else if (idLower.startsWith("pa")) {
      setActiveRole("parent");
    } else if (idLower.startsWith("ad")) {
      setActiveRole("admin");
    } else {
      // Default to student if no prefix matched
      setActiveRole("student");
    }
    setErrorMessage("");
  };

  const handleLogout = () => {
    setActiveRole(null);
    setLoginId("");
    setLoginPassword("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Header onToggleAi={() => setAiOpen(!aiOpen)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 flex flex-col justify-center">
        
        {/* LOGIN SCREEN */}
        {!activeRole ? (
          <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-blue to-indigo-950 p-6 text-white text-center">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-gold">Digital Campus ERP</span>
              <h2 className="text-xl font-extrabold mt-1">Chalapathy ERP Portal</h2>
              <p className="text-xs text-zinc-300 mt-1">Access attendance, grades, finance & admin records.</p>
            </div>

            <form onSubmit={handleLogin} className="p-6 space-y-5">
              {errorMessage && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-[#072A6C] font-semibold text-center">
                  {errorMessage}
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-600 block">Registration ID / User ID</label>
                <input 
                  type="text" 
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="e.g. ST-2026-004 (or FA- / PA- / AD-)"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-gold focus:bg-white"
                />
                <span className="block text-[10px] text-zinc-400 font-semibold leading-normal mt-1">
                  Hint: Enter <strong>ST-101</strong> for Student, <strong>FA-101</strong> for Faculty, <strong>PA-101</strong> for Parent, or <strong>AD-101</strong> for Admin dashboards.
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-600 block">Password</label>
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary-gold focus:bg-white"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-primary-blue hover:bg-primary-blue/90 text-white font-extrabold text-xs tracking-wider rounded-xl transition-all shadow-md uppercase"
              >
                Sign In to ERP
              </button>

              <div className="text-center pt-2">
                <Link href="/contact" className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600">
                  Forgot Password or Locked Account? Contact IT Cell
                </Link>
              </div>
            </form>
          </div>
        ) : (
          /* ERP PORTAL VIEWPORTS */
          <div className="bg-white rounded-2xl shadow-xl border border-zinc-100 overflow-hidden flex flex-col min-h-[600px] animate-scale-up">
            
            {/* Dashboard Upper Bar */}
            <div className="bg-primary-blue text-white px-8 py-4 flex justify-between items-center border-b border-white/10 z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-gold text-primary-navy flex items-center justify-center font-extrabold text-sm uppercase">
                  {activeRole[0]}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-wide capitalize">{activeRole} Command Center</h3>
                  <span className="block text-[9px] text-zinc-300 uppercase tracking-widest font-bold">Academic Session: 2026-27</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white transition-colors"
              >
                <LogOut size={12} /> Sign Out
              </button>
            </div>

            {/* DASHBOARD INNER CHASSIS */}
            <div className="flex-1 p-8">
              
              {/* ROLE 1: STUDENT PORTAL */}
              {activeRole === "student" && (
                <div className="space-y-8 animate-fade-in">
                  <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <h4 className="font-extrabold text-base text-primary-blue">Welcome Back, Amit Naidu!</h4>
                      <span className="text-xs text-zinc-500 font-semibold block mt-0.5">B.Tech in Artificial Intelligence & Machine Learning (Sem III) | Reg ID: CU-2025-CS104</span>
                    </div>
                    <div className="flex gap-4 text-center">
                      <div className="bg-white border border-zinc-100 px-4 py-2 rounded-xl shadow-sm">
                        <span className="block text-[9px] text-zinc-400 font-bold uppercase">Attendance</span>
                        <span className="block text-sm font-extrabold text-emerald-600">88.5%</span>
                      </div>
                      <div className="bg-white border border-zinc-100 px-4 py-2 rounded-xl shadow-sm">
                        <span className="block text-[9px] text-zinc-400 font-bold uppercase">Current CGPA</span>
                        <span className="block text-sm font-extrabold text-primary-gold">9.14</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Class Timetable */}
                    <div className="border border-zinc-100 rounded-2xl p-5 space-y-4">
                      <span className="text-xs font-bold text-primary-blue uppercase tracking-wider block border-b border-zinc-100 pb-2">Today's Class Schedule</span>
                      <div className="space-y-3.5">
                        {[
                          { time: "09:00 - 10:30 AM", sub: "Deep Learning (Lecture)", room: "Lab A" },
                          { time: "11:00 - 12:30 PM", sub: "Natural Language Processing (Lecture)", room: "Room 402" },
                          { time: "02:00 - 04:30 PM", sub: "Reinforcement Learning (Practical)", room: "DGX Lab" }
                        ].map((cls, idx) => (
                          <div key={idx} className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl space-y-1">
                            <span className="block text-[9px] text-primary-gold font-bold">{cls.time}</span>
                            <span className="block text-xs font-extrabold text-zinc-700 leading-tight">{cls.sub}</span>
                            <span className="block text-[9px] text-zinc-400">Venue: {cls.room}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Grade Sheet */}
                    <div className="border border-zinc-100 rounded-2xl p-5 space-y-4">
                      <span className="text-xs font-bold text-primary-blue uppercase tracking-wider block border-b border-zinc-100 pb-2">Semester Grades</span>
                      <div className="space-y-3">
                        {[
                          { sub: "Probability & Statistics", code: "MAT-201", grade: "A+" },
                          { sub: "Machine Learning Foundations", code: "CSE-202", grade: "A" },
                          { sub: "Data Structures in Python", code: "CSE-204", grade: "O (Outstanding)" },
                          { sub: "AI Ethics & Philosophy", code: "HUM-201", grade: "A+" }
                        ].map((gr, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs">
                            <div>
                              <span className="block font-bold text-zinc-700">{gr.sub}</span>
                              <span className="block text-[9px] text-zinc-400">{gr.code}</span>
                            </div>
                            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg font-bold">{gr.grade}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Assignments */}
                    <div className="border border-zinc-100 rounded-2xl p-5 space-y-4">
                      <span className="text-xs font-bold text-primary-blue uppercase tracking-wider block border-b border-zinc-100 pb-2">Course Assignments</span>
                      <div className="space-y-3.5">
                        {assignments.map((ass) => (
                          <div key={ass.id} className="flex justify-between items-center text-xs">
                            <div>
                              <span className="block font-bold text-zinc-700">{ass.title}</span>
                              <span className="block text-[9px] text-zinc-400">Due: {ass.deadline}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSubmittingAss(ass.id);
                                setTimeout(() => {
                                  setAssignments(p => p.map(a => a.id === ass.id ? { ...a, status: "Submitted" } : a));
                                  setSubmittingAss(null);
                                }, 1500);
                              }}
                              disabled={ass.status === "Submitted" || submittingAss === ass.id}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                ass.status === "Submitted" 
                                  ? "bg-emerald-50 text-emerald-700 cursor-default" 
                                  : submittingAss === ass.id
                                    ? "bg-zinc-100 text-zinc-400 cursor-not-allowed animate-pulse"
                                    : "bg-primary-blue hover:bg-primary-blue/90 text-white cursor-pointer"
                              }`}
                            >
                              {ass.status === "Submitted" ? "✓ Submitted" : submittingAss === ass.id ? "Submitting..." : "Submit File"}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ROLE 2: FACULTY PORTAL */}
              {activeRole === "faculty" && (
                <div className="space-y-8 animate-fade-in">
                  <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-2xl">
                    <h4 className="font-extrabold text-base text-primary-blue">Welcome, Dr. K. Raghavendra Rao</h4>
                    <span className="text-xs text-zinc-500 font-semibold block mt-0.5">Professor & Head, School of Artificial Intelligence | Staff ID: FA-AI-012</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Enter Student Attendance */}
                    <div className="border border-zinc-100 rounded-2xl p-5 space-y-4">
                      <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                        <span className="text-xs font-bold text-primary-blue uppercase tracking-wider block">Mark Class Attendance</span>
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[9px] font-bold rounded">CSE-AIML Sem III</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-medium">Verify the student checklist below and click "Save Attendance" to push records to university CRM.</p>
                      
                      <div className="space-y-3.5">
                        {facultyAttendanceList.map((stu) => (
                          <div key={stu.id} className="flex justify-between items-center text-xs p-2.5 bg-zinc-50 border border-zinc-100 rounded-xl">
                            <div>
                              <span className="block font-bold text-zinc-700">{stu.name}</span>
                              <span className="block text-[9px] text-zinc-400">{stu.regId}</span>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => setFacultyAttendanceList(p => p.map(s => s.id === stu.id ? { ...s, status: "Present" } : s))}
                                className={`px-2.5 py-1 rounded text-[9px] font-bold transition-all ${
                                  stu.status === "Present" ? "bg-emerald-500 text-white" : "bg-white text-zinc-500 border border-zinc-200"
                                }`}
                              >
                                Present
                              </button>
                              <button
                                type="button"
                                onClick={() => setFacultyAttendanceList(p => p.map(s => s.id === stu.id ? { ...s, status: "Absent" } : s))}
                                className={`px-2.5 py-1 rounded text-[9px] font-bold transition-all ${
                                  stu.status === "Absent" ? "bg-amber-500 text-white" : "bg-white text-zinc-500 border border-zinc-200"
                                }`}
                              >
                                Absent
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <button 
                        onClick={() => alert("Attendance saved successfully in ERP!")}
                        className="w-full py-2.5 bg-primary-blue hover:bg-primary-blue/90 text-white text-xs font-bold rounded-xl transition-all shadow-md uppercase"
                      >
                        Save Attendance Record
                      </button>
                    </div>

                    {/* Mentorship Tracker & Paper Submission */}
                    <div className="space-y-6">
                      <div className="border border-zinc-100 rounded-2xl p-5 space-y-4">
                        <span className="text-xs font-bold text-primary-blue uppercase tracking-wider block border-b border-zinc-100 pb-2">Academic Mentorship Group</span>
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div className="bg-zinc-50 border border-zinc-100 p-3 rounded-xl">
                            <span className="block text-[9px] text-zinc-400 font-bold uppercase">Mentored Students</span>
                            <span className="block text-base font-extrabold text-primary-blue mt-1">15</span>
                          </div>
                          <div className="bg-zinc-50 border border-zinc-100 p-3 rounded-xl">
                            <span className="block text-[9px] text-zinc-400 font-bold uppercase">Average Grade</span>
                            <span className="block text-base font-extrabold text-primary-gold mt-1">8.84 CGPA</span>
                          </div>
                        </div>
                      </div>

                      <div className="border border-zinc-100 rounded-2xl p-5 space-y-4">
                        <span className="text-xs font-bold text-primary-blue uppercase tracking-wider block border-b border-zinc-100 pb-2">Research Publication Tracker</span>
                        <p className="text-[10px] text-zinc-400 font-medium">Add a new IEEE / Scopus journal publication reference link to your university index score.</p>
                        <div className="space-y-3">
                          <input 
                            type="text" placeholder="Journal Title: e.g. Advancements in NLP Models"
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-[11px] focus:outline-none focus:border-primary-gold focus:bg-white"
                          />
                          <button 
                            onClick={() => alert("Research publication reference indexed for verification.")}
                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold rounded-lg transition-all"
                          >
                            Index Publication Link
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ROLE 3: PARENT PORTAL */}
              {activeRole === "parent" && (
                <div className="space-y-8 animate-fade-in">
                  <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-2xl">
                    <h4 className="font-extrabold text-base text-primary-blue">Welcome, Robert Doe!</h4>
                    <span className="text-xs text-zinc-500 font-semibold block mt-0.5">Parent of candidate: <strong>John Doe</strong> (B.Sc Hons. Agriculture) | ID: PA-AG-9204</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Attendance status */}
                    <div className="border border-zinc-100 rounded-2xl p-5 text-center space-y-4">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Student Attendance Status</span>
                      <div className="w-28 h-28 rounded-full border-4 border-emerald-500 flex flex-col items-center justify-center mx-auto bg-emerald-50/50">
                        <span className="text-xl font-extrabold text-emerald-600">86.2%</span>
                        <span className="text-[8px] text-emerald-800 font-bold uppercase tracking-wide">Excellent</span>
                      </div>
                      <p className="text-[10px] text-zinc-400">Attendance matches the mandatory 75% UGC guideline. No action needed.</p>
                    </div>

                    {/* Term Grade Book */}
                    <div className="border border-zinc-100 rounded-2xl p-5 space-y-4">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block border-b border-zinc-100 pb-2">Academic Progress Sheet</span>
                      <div className="space-y-3 text-xs font-semibold text-zinc-600">
                        {[
                          { term: "Mid-Term I Exam", result: "94.5% (Rank #3)" },
                          { term: "Mid-Term II Exam", result: "92.0% (Rank #5)" },
                          { term: "Laboratory Audits", result: "Pass (Grade O)" }
                        ].map((res, idx) => (
                          <div key={idx} className="flex justify-between items-center border-b border-zinc-50 pb-2 last:border-0">
                            <span>{res.term}</span>
                            <span className="text-indigo-700 font-bold">{res.result}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tuition Fee Ledger */}
                    <div className="border border-zinc-100 rounded-2xl p-5 space-y-4">
                      <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block border-b border-zinc-100 pb-2">Tuition Fee Ledger</span>
                      <div className="space-y-3.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500">Academic Tuition Fee (Paid):</span>
                          <span className="font-bold text-zinc-700">₹1,20,000</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500">Hostel & Mess Charge (Paid):</span>
                          <span className="font-bold text-zinc-700">₹85,000</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-zinc-100 pt-2 font-bold">
                          <span className="text-zinc-700">Pending Ledger Balance:</span>
                          <span className="text-emerald-600">₹0 (Paid)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ROLE 4: ADMIN PORTAL */}
              {activeRole === "admin" && (
                <div className="space-y-8 animate-fade-in">
                  <div className="bg-zinc-50 border border-zinc-100 p-5 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <h4 className="font-extrabold text-base text-primary-blue">Administrator Dashboard</h4>
                      <span className="text-xs text-zinc-500 font-semibold block mt-0.5">Global System Config | Admin ID: AD-MNG-001</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Admissions CRM Statistics */}
                    <div className="border border-zinc-100 rounded-2xl p-5 space-y-4 col-span-1 lg:col-span-2">
                      <span className="text-xs font-bold text-primary-blue uppercase tracking-wider block border-b border-zinc-100 pb-2">Admissions CRM Statistics</span>
                      
                      {/* Interactive SVG Bar Chart representing monthly intake registrations */}
                      <div className="h-44 w-full flex items-end justify-between px-4 pt-4 border-b border-zinc-100">
                        {[
                          { month: "Jan", count: 180, height: "h-16", color: "bg-indigo-600" },
                          { month: "Feb", count: 220, height: "h-20", color: "bg-indigo-600" },
                          { month: "Mar", count: 340, height: "h-28", color: "bg-indigo-600" },
                          { month: "Apr", count: 480, height: "h-36", color: "bg-primary-gold" },
                          { month: "May", count: 520, height: "h-40", color: "bg-indigo-950" }
                        ].map((bar, idx) => (
                          <div key={idx} className="flex flex-col items-center gap-1.5 w-12">
                            <span className="text-[10px] font-bold text-zinc-500">{bar.count}</span>
                            <div className={`w-8 ${bar.height} ${bar.color} rounded-t-md transition-all duration-500`}></div>
                            <span className="text-[10px] font-bold text-zinc-400 mt-1">{bar.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Website CMS Controls */}
                    <div className="border border-zinc-100 rounded-2xl p-5 space-y-4">
                      <span className="text-xs font-bold text-primary-blue uppercase tracking-wider block border-b border-zinc-100 pb-2">Website CMS Panel</span>
                      <p className="text-[10px] text-zinc-400 font-medium">Post announcements on the university homepage news feed instantly.</p>
                      
                      <div className="space-y-3">
                        <input 
                          type="text" 
                          value={newPostTitle}
                          onChange={(e) => setNewPostTitle(e.target.value)}
                          placeholder="Announcement title..."
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-[11px] focus:outline-none focus:border-primary-gold focus:bg-white"
                        />
                        <button 
                          onClick={() => {
                            if (!newPostTitle.trim()) return;
                            setNewsFeed(p => [{ id: Date.now(), title: newPostTitle, date: "Today" }, ...p]);
                            setNewPostTitle("");
                          }}
                          className="w-full py-2 bg-primary-blue hover:bg-primary-blue/90 text-white text-[11px] font-bold rounded-lg transition-all"
                        >
                          Post Announcement
                        </button>
                      </div>

                      <div className="border-t border-zinc-100 pt-3 space-y-2">
                        <span className="block text-[9px] text-zinc-400 font-bold uppercase">Recent Posts</span>
                        {newsFeed.map((post) => (
                          <div key={post.id} className="flex justify-between items-center text-[10px] font-semibold text-zinc-600">
                            <span className="truncate max-w-[150px]">{post.title}</span>
                            <span className="text-zinc-400 shrink-0">{post.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </main>

      <Footer />
      <AIAssistant isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}

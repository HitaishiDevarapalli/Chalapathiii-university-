"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, X, ArrowRight } from "lucide-react";

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
  suggestions?: string[];
}

const KNOWLEDGE_BASE: { keywords: string[]; answer: string; suggestions?: string[] }[] = [
  {
    keywords: ["hi", "hello", "hey", "start"],
    answer: "Welcome to Chalapathy University's Digital AI Assistant! I can help you find programs, explain the admission journey, check placement records, or tell you about hostel facilities. What would you like to know today?",
    suggestions: ["Explore Schools", "Check Admissions", "Placement Stats", "Hostel Facilities"]
  },
  {
    keywords: ["school", "schools", "course", "courses", "engineering", "pharmacy", "management", "law", "program", "programs"],
    answer: "Chalapathy University offers top-tier education through 10 specialised schools:\n\n1. School of Engineering\n2. School of Pharmacy\n3. School of Management\n4. School of Sciences\n5. School of Agriculture\n6. School of Health Sciences\n7. School of Law\n8. School of Humanities\n9. School of Allied Health Sciences\n10. School of Artificial Intelligence\n\nWould you like to try our Smart Program Finder to see which course fits you best?",
    suggestions: ["Try Program Finder", "Admission Process", "Scholarships Info"]
  },
  {
    keywords: ["admission", "apply", "apply now", "joining", "join", "journey"],
    answer: "Admissions for the current academic year are open! Our Digital Admission Journey is 100% online. \n\nSteps:\n1. Fill Personal & Academic Details.\n2. Choose your School & Program.\n3. Upload required documents.\n4. Pay application fee.\n\nYou can click the 'APPLY NOW' button in the header to start immediately!",
    suggestions: ["Apply Online Now", "Fee Structure", "Scholarships"]
  },
  {
    keywords: ["placement", "placements", "job", "jobs", "recruiters", "salary"],
    answer: "Chalapathy University has an exceptional placement record with 90%+ placements annually. Our Career Services Cell partners with global brands:\n\n• Highest Package: ₹44 LPA\n• Average Package: ₹6.8 LPA\n• Key Recruiters: TCS, Infosys, Wipro, Amazon, Pfizer, Reddy's Labs, Cognizant.\n• Internships: 100% support in top firms.",
    suggestions: ["Highest Package", "Recruiters List", "Careers Cell"]
  },
  {
    keywords: ["fee", "fees", "cost", "scholarship", "scholarships", "concession"],
    answer: "Fee structures vary by school. Approximate tuition fees are ₹80,000 to ₹1,80,000 per year depending on the stream. \n\nWe offer Merit Scholarships up to 100% based on:\n• JEE Main / AP EAPCET Ranks\n• 10+2 Board Marks (95%+ get full tuition waivers)\n• Sports & Extra-Curricular achievements.\n• Need-based aid for underprivileged families.",
    suggestions: ["Merit Scholarship", "How to apply for aid", "Refund Policy"]
  },
  {
    keywords: ["hostel", "hostels", "accommodation", "sports", "campus", "canteen"],
    answer: "Our vibrant campus covers 40+ acres with fully air-conditioned and non-A/C separate hostels for boys and girls. Facilities include:\n\n• 24/7 Wi-Fi & security surveillance.\n• Nutritious multi-cuisine food courts.\n• Sports Arena with cricket nets, basketball courts, and gym.\n• Central library open till 10:00 PM.",
    suggestions: ["Virtual Campus Tour", "Hostel Fees", "Clubs & Events"]
  }
];

export default function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          sender: "bot",
          text: "Hello! I am the Chalapathy University AI Assistant. How can I help you today?",
          timestamp: new Date(),
          suggestions: ["Explore Schools", "Check Admissions", "Placement Stats", "Hostel Facilities"]
        }
      ]);
    }
  }, [messages.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = {
      sender: "user",
      text,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      setIsTyping(false);
      const query = text.toLowerCase();
      let matchedAnswer = "";
      let matchedSuggestions: string[] = ["Ask Fee details", "Apply online", "View placements"];

      // Simple keyword matching
      for (const item of KNOWLEDGE_BASE) {
        if (item.keywords.some((k) => query.includes(k))) {
          matchedAnswer = item.answer;
          if (item.suggestions) {
            matchedSuggestions = item.suggestions;
          }
          break;
        }
      }

      if (!matchedAnswer) {
        matchedAnswer = "I'm sorry, I didn't quite get that. Could you ask about courses, fee structures, hostels, placements, or how to apply?";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: matchedAnswer,
          timestamp: new Date(),
          suggestions: matchedSuggestions
        }
      ]);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[550px] bg-white rounded-2xl shadow-2xl border border-zinc-100 flex flex-col overflow-hidden animate-slide-up font-sans">
      {/* Header */}
      <div className="bg-[#072A6C] p-4 text-white flex justify-between items-center">
        <div>
          <h4 className="font-extrabold text-sm tracking-wide">University Helpdesk</h4>
          <span className="text-[10px] text-zinc-300 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Online & ready to help
          </span>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-lg text-zinc-300 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Message Area */}
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4 no-scrollbar">
        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
            <div className={`flex gap-2 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                msg.sender === "bot" ? "bg-[#072A6C] text-white" : "bg-[#D4AF37] text-[#072A6C]"
              }`}>
                {msg.sender === "bot" ? "CU" : "U"}
              </div>

              {/* Bubble */}
              <div className={`p-3 rounded-2xl text-xs font-medium leading-relaxed whitespace-pre-line shadow-sm ${
                msg.sender === "user" 
                  ? "bg-indigo-600 text-white rounded-tr-none" 
                  : "bg-white text-zinc-800 border border-zinc-100 rounded-tl-none"
              }`}>
                {msg.text}
              </div>
            </div>

            {/* Suggestions buttons */}
            {msg.sender === "bot" && msg.suggestions && msg.suggestions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2 pl-9">
                {msg.suggestions.map((sug, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => handleSendMessage(sug)}
                    className="text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-2.5 py-1 rounded-full transition-all"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-2 items-start">
            <div className="w-7 h-7 rounded-full bg-[#072A6C] text-white flex items-center justify-center text-[10px] font-black shrink-0">
              CU
            </div>
            <div className="bg-white border border-zinc-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(inputValue);
        }}
        className="p-3 border-t border-zinc-100 bg-white flex gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question about Chalapathy..."
          className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-600 focus:bg-white"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl shadow-md transition-colors"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}

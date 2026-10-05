"use client";

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import type { School } from "@/types";

interface SchoolCardProps {
  school: School;
}

export default function SchoolCard({ school }: SchoolCardProps) {
  const Icon = school.icon;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <Link
        to={`/academics/schools`}
        className="group bg-white border border-[#E5E7EB] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 block"
      >
        <div className="h-[130px] relative overflow-hidden bg-[#F7F7F7]">
          <img
            src={school.image || "/campus_hero.png"}
            alt={`School of ${school.name}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="px-4 pb-4 relative">
          <div
            className="absolute -top-5 left-4 w-10 h-10 rounded-full flex items-center justify-center text-white border-[3px] border-white shadow-md"
            style={{ background: school.color }}
          >
            <Icon size={16} />
          </div>
          <p className="font-[var(--font-poppins)] font-bold text-[13px] text-[#081A36] mt-7 leading-snug">
            School of<br />{school.name}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}

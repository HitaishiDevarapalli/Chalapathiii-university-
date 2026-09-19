import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin, Phone, Mail, Globe, Users, Briefcase, Play
} from "lucide-react";
import { useData } from "../../context/DataContext";

export default function Footer() {
  const { siteSettings, footerContent, themeColors } = useData();

  const quickLinks = footerContent?.quickLinks || [
    { label: "About Us", to: "/about" },
    { label: "Vision & Mission", to: "/about/vision" },
    { label: "Leadership", to: "/about/leadership" },
    { label: "Genesis & Heritage", to: "/about/genesis" },
    { label: "Chalapathi Advantage", to: "/about/advantage" },
    { label: "Accreditations", to: "/about" },
  ];

  const academicsLinks = footerContent?.academicsLinks || [
    { label: "Programs", to: "/academics" },
    { label: "Computer Science", to: "/academics/computer-science" },
    { label: "AI & ML", to: "/academics/artificial-intelligence" },
    { label: "Data Science", to: "/academics/data-science" },
    { label: "Schools", to: "/academics/schools" },
  ];

  const admissionsLinks = footerContent?.admissionsLinks || [
    { label: "Undergraduate", to: "/admissions/undergraduate" },
    { label: "Postgraduate", to: "/admissions/postgraduate" },
    { label: "Fee Structure", to: "/admissions/fees" },
    { label: "Scholarships", to: "/admissions/scholarships" },
    { label: "Apply Online", to: "/admissions/apply" },
  ];

  const campusLifeLinks = footerContent?.campusLifeLinks || [
    { label: "Hostels", to: "/campus-life/hostels" },
    { label: "Library", to: "/campus-life/library" },
    { label: "Sports", to: "/campus-life/sports" },
    { label: "Clubs", to: "/campus-life/clubs" },
    { label: "Amenities", to: "/campus-life" },
  ];

  return (
    <footer 
      className="text-[#D1D5DB] pt-16 pb-8 font-[var(--font-poppins)] text-[12px] border-t border-white/5 transition-colors"
      style={{
        backgroundColor: themeColors?.footerBg || "#072A6C",
        color: themeColors?.footerText || "#D1D5DB"
      }}
    >
      <div className="max-w-[1440px] mx-auto px-5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {/* Col 1: Brand */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-white rounded-[12px] p-2.5 w-fit flex items-center justify-center shadow-sm">
            <img
              src={siteSettings?.logoUrl || "/logo.png?v=3"}
              alt={siteSettings?.universityName || "Chalapathi University"}
              className="h-10 w-auto object-contain no-lift"
            />
          </div>
          <p className="leading-relaxed text-[#D1D5DB] text-[11px] font-light">
            {footerContent?.brandDescription || "Empowering minds through quality education, advanced learning and real-world experience. Your future begins here."}
          </p>
          <div className="flex items-center gap-2 pt-2">
            {[Globe, Users, Briefcase, Play].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-full bg-white/5 hover:bg-[#D4AF37] flex items-center justify-center text-[#D1D5DB] hover:text-white transition-all">
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-[13px] mb-5 tracking-wide">Quick Links</h4>
          <ul className="space-y-3 font-light text-[12px]">
            {quickLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Academics */}
        <div>
          <h4 className="text-white font-semibold text-[13px] mb-5 tracking-wide">Academics</h4>
          <ul className="space-y-3 font-light text-[12px]">
            {academicsLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Admissions */}
        <div>
          <h4 className="text-white font-semibold text-[13px] mb-5 tracking-wide">Admissions</h4>
          <ul className="space-y-3 font-light text-[12px]">
            {admissionsLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 5: Campus Life */}
        <div>
          <h4 className="text-white font-semibold text-[13px] mb-5 tracking-wide">Campus Life</h4>
          <ul className="space-y-3 font-light text-[12px]">
            {campusLifeLinks.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 6: Contact Us */}
        <div className="space-y-4">
          <h4 className="text-white font-semibold text-[13px] mb-5 tracking-wide">Contact Us</h4>
          <div className="flex gap-4 items-start">
            <div className="space-y-3.5 text-[11px] text-[#D1D5DB] font-light flex-1">
              <div className="flex items-start gap-2">
                <MapPin size={13} className="text-[#D4AF37] mt-0.5 shrink-0" />
                <span>{siteSettings?.contactAddress || "A.R. Nagar, Mothadaka, Guntur, Andhra Pradesh - 522034"}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone size={13} className="text-[#D4AF37] mt-0.5 shrink-0" />
                <span>{siteSettings?.contactPhone || "8886630355 | 8886630356 9905505566"}</span>
              </div>
              <div className="flex items-start gap-2">
                <Mail size={13} className="text-[#D4AF37] mt-0.5 shrink-0" />
                <span>{siteSettings?.contactEmail || "admissions@city.ac.in"}</span>
              </div>
            </div>
          </div>
          <div className="space-y-3.5 text-[11px] text-[#D1D5DB] font-light">
            {/* Social Logos */}
            <div className="flex items-center gap-2.5 pt-3">
              {siteSettings?.socialLinks?.instagram && (
                <a href={siteSettings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#E1306C] hover:scale-110 text-white flex items-center justify-center transition-all duration-200 shadow-sm border border-white/5" title="Instagram">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                </a>
              )}
              {siteSettings?.socialLinks?.linkedin && (
                <a href={siteSettings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#0077B5] hover:scale-110 text-white flex items-center justify-center transition-all duration-200 shadow-sm border border-white/5" title="LinkedIn">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              )}
              {siteSettings?.socialLinks?.facebook && (
                <a href={siteSettings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#1877F2] hover:scale-110 text-white flex items-center justify-center transition-all duration-200 shadow-sm border border-white/5" title="Facebook">
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {siteSettings?.socialLinks?.twitter && (
                <a href={siteSettings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-white/5 hover:bg-black hover:scale-110 text-white flex items-center justify-center transition-all duration-200 shadow-sm border border-white/5" title="Twitter / X">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1440px] mx-auto px-5 mt-14 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] text-[#D1D5DB] font-light gap-3">
        <span>{footerContent?.copyrightText || "© 2026 Chalapathi University. All rights reserved."}</span>
        <div className="flex items-center gap-3">
          <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <span>|</span>
          <Link to="/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
          <span>|</span>
          <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
          <span>|</span>
          <Link to="/admin" className="hover:text-[#D4AF37] text-gray-400 font-bold transition-colors">Admin Portal</Link>
        </div>
      </div>
    </footer>
  );
}

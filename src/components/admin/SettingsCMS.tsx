import React, { useState } from "react";
import { 
  Settings, Palette, Sparkles, Eye, RotateCcw, Save, Check, 
  Globe, Shield, Sliders, Layout, Monitor, Smartphone, Moon, 
  Sun, CheckCircle2, ArrowRight, ExternalLink, Image as ImageIcon,
  Lock, Bell, Layers, Phone, Mail, MapPin, Building,
  Search, Rocket, FileText, TrendingUp, Home, GraduationCap,
  BookOpen, Award, Briefcase, Users, Trash2, Plus, Edit3, X, Lightbulb, Star, Laptop
} from "lucide-react";
import { 
  useData, 
  ThemeColors, 
  SiteSettings, 
  SearchBarConfig,
  QuickNavItem,
  DEFAULT_THEME_COLORS, 
  DEFAULT_SITE_SETTINGS,
  DEFAULT_SEARCH_CONFIG
} from "../../context/DataContext";
import { SectionHeader, ImageField, ColorField } from "./AdminComponents";

export const QUICK_NAV_AVAILABLE_ICONS = [
  { name: "Laptop", icon: Laptop },
  { name: "Rocket", icon: Rocket },
  { name: "FileText", icon: FileText },
  { name: "TrendingUp", icon: TrendingUp },
  { name: "Home", icon: Home },
  { name: "Phone", icon: Phone },
  { name: "GraduationCap", icon: GraduationCap },
  { name: "BookOpen", icon: BookOpen },
  { name: "Award", icon: Award },
  { name: "Building", icon: Building },
  { name: "Shield", icon: Shield },
  { name: "Briefcase", icon: Briefcase },
  { name: "Users", icon: Users },
  { name: "Globe", icon: Globe },
  { name: "MapPin", icon: MapPin },
  { name: "Sparkles", icon: Sparkles },
  { name: "Lightbulb", icon: Lightbulb },
  { name: "Star", icon: Star }
];

const QUICK_NAV_ICON_MAP: Record<string, React.ElementType> = {
  Laptop, Rocket, FileText, TrendingUp, Home, Phone, GraduationCap,
  BookOpen, Award, Building, Shield, Briefcase, Users, Globe, MapPin,
  Sparkles, Lightbulb, Star
};

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
    border: string;
    footerBg: string;
    footerText: string;
  };
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "classic",
    name: "1. UNIVERSITY CLASSIC — DEFAULT",
    description: "Official Chalapathi navy blue with royal blue depth and prestigious gold accents.",
    colors: {
      primary: "#0B2A5B",
      secondary: "#163D7A",
      accent: "#D4A72C",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      text: "#172033",
      muted: "#64748B",
      border: "#E2E8F0",
      footerBg: "#0B2A5B",
      footerText: "#D1D5DB"
    }
  },
  {
    id: "royal_gold",
    name: "2. ROYAL BLUE & GOLD",
    description: "Vibrant royal blue paired with warm golden yellow accents and crisp white surfaces.",
    colors: {
      primary: "#123B7A",
      secondary: "#1E5AA8",
      accent: "#E0B12F",
      background: "#F8FAFC",
      surface: "#FFFFFF",
      text: "#172033",
      muted: "#64748B",
      border: "#E2E8F0",
      footerBg: "#123B7A",
      footerText: "#D1D5DB"
    }
  },
  {
    id: "academic_blue",
    name: "3. ACADEMIC BLUE",
    description: "Modern tech university style with bright cobalt blues and energetic amber highlights.",
    colors: {
      primary: "#174EA6",
      secondary: "#2563EB",
      accent: "#F59E0B",
      background: "#F8FAFC",
      surface: "#FFFFFF",
      text: "#172033",
      muted: "#64748B",
      border: "#E2E8F0",
      footerBg: "#174EA6",
      footerText: "#D1D5DB"
    }
  },
  {
    id: "navy_emerald",
    name: "4. NAVY & EMERALD",
    description: "Sophisticated deep navy paired with rich botanical emerald green and bronze gold.",
    colors: {
      primary: "#0F2F4F",
      secondary: "#176B5B",
      accent: "#D9A441",
      background: "#F7FAFC",
      surface: "#FFFFFF",
      text: "#172033",
      muted: "#64748B",
      border: "#E2E8F0",
      footerBg: "#0F2F4F",
      footerText: "#D1D5DB"
    }
  },
  {
    id: "burgundy_gold",
    name: "5. WHITE & BURGUNDY",
    description: "Prestigious Ivy-League heritage crimson burgundy with warm ivory surfaces and gold.",
    colors: {
      primary: "#6B1E2B",
      secondary: "#8B2E3B",
      accent: "#D4A72C",
      background: "#FFFDFC",
      surface: "#FFFFFF",
      text: "#172033",
      muted: "#64748B",
      border: "#E2E8F0",
      footerBg: "#6B1E2B",
      footerText: "#D1D5DB"
    }
  },
  {
    id: "minimal_blue",
    name: "6. MINIMAL BLUE",
    description: "Ultra-clean modern minimalist layout with electric blue and teal emerald accents.",
    colors: {
      primary: "#1D4ED8",
      secondary: "#3B82F6",
      accent: "#0F766E",
      background: "#FFFFFF",
      surface: "#F8FAFC",
      text: "#172033",
      muted: "#64748B",
      border: "#E2E8F0",
      footerBg: "#1D4ED8",
      footerText: "#D1D5DB"
    }
  }
];

export function SettingsCMS({
  notifySave,
  saveSuccess
}: {
  notifySave: (msg?: string) => void;
  saveSuccess?: boolean;
}) {
  const { 
    siteSettings, 
    updateSiteSettings, 
    themeColors, 
    updateThemeColors,
    searchConfig,
    updateSearchConfig
  } = useData();

  const [settingsSubTab, setSettingsSubTab] = useState<"appearance" | "preview" | "branding" | "controls" | "search">("appearance");
  
  // Local Theme Form State
  const [selectedPresetId, setSelectedPresetId] = useState<string>("classic");
  const [colorsForm, setColorsForm] = useState<ThemeColors>(themeColors || DEFAULT_THEME_COLORS);
  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings || DEFAULT_SITE_SETTINGS);
  const [searchForm, setSearchForm] = useState<SearchBarConfig>(searchConfig || DEFAULT_SEARCH_CONFIG);

  // Sync state if context changes externally
  React.useEffect(() => {
    if (themeColors) setColorsForm(themeColors);
  }, [themeColors]);

  React.useEffect(() => {
    if (siteSettings) setSettingsForm(siteSettings);
  }, [siteSettings]);

  React.useEffect(() => {
    if (searchConfig) setSearchForm(searchConfig);
  }, [searchConfig]);

  // Apply Theme Preset
  const handleApplyPreset = (preset: ThemePreset) => {
    setSelectedPresetId(preset.id);
    const updatedColors: ThemeColors = {
      ...colorsForm,
      primary: preset.colors.primary,
      secondary: preset.colors.secondary,
      accent: preset.colors.accent,
      pageBackground: preset.colors.background,
      textPrimary: preset.colors.text,
      textSecondary: preset.colors.muted,
      headerBg: preset.colors.primary,
      headerText: "#FFFFFF",
      footerBg: preset.colors.footerBg,
      footerText: preset.colors.footerText,
      statsBg: preset.colors.surface,
      whyChooseBg: preset.colors.border,
      chairmanBg: preset.colors.surface,
      campusLifeBg: preset.colors.surface,
      certificationsBg: preset.colors.surface,
      virtualTourBg: preset.colors.primary
    };
    setColorsForm(updatedColors);
    updateThemeColors(updatedColors);
    notifySave(`Applied ${preset.name}!`);
  };

  // Save All Settings
  const handleSaveSettings = () => {
    updateThemeColors(colorsForm);
    updateSiteSettings(settingsForm);
    updateSearchConfig(searchForm);
    notifySave("Website settings & search bar config published live!");
  };

  // Save Search Config specifically
  const handleSaveSearchConfig = () => {
    updateSearchConfig(searchForm);
    notifySave("Search bar, search icon & quick navigations published live!");
  };

  // Reset Search Config to Defaults
  const handleResetSearchConfig = () => {
    if (window.confirm("Reset search bar and search icon styles to university defaults?")) {
      setSearchForm(DEFAULT_SEARCH_CONFIG);
      updateSearchConfig(DEFAULT_SEARCH_CONFIG);
      notifySave("Search bar styles reset to default!");
    }
  };

  // Reset Theme to Classic
  const handleResetTheme = () => {
    if (window.confirm("Reset public website theme to University Classic default?")) {
      const defaultPreset = THEME_PRESETS[0];
      handleApplyPreset(defaultPreset);
      notifySave("Website theme reset to University Classic!");
    }
  };

  // Reset Custom Colors to Active Preset
  const handleResetCustomColors = () => {
    const activePreset = THEME_PRESETS.find(p => p.id === selectedPresetId) || THEME_PRESETS[0];
    handleApplyPreset(activePreset);
    notifySave("Custom colors reset to active preset!");
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <SectionHeader
        title="Website Settings & Appearance Control"
        subtitle="Manage public website theme presets, custom colors, live layout preview, global branding, and header/footer controls"
        icon={Settings}
        onSave={handleSaveSettings}
        saveSuccess={saveSuccess}
        onReset={handleResetTheme}
        resetLabel="Reset Theme"
      />

      {/* Subtabs Selector */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-3">
        {[
          { id: "appearance", label: "🎨 1. Main Website Appearance & Theme Presets" },
          { id: "preview", label: "📱 2. Live Website Theme Preview" },
          { id: "branding", label: "🏛️ 3. Global Branding & Identity" },
          { id: "controls", label: "⚙️ 4. Global Website Controls" },
          { id: "search", label: "🔍 5. Search Bar & Search Icon CMS" }
        ].map((st) => (
          <button
            key={st.id}
            onClick={() => setSettingsSubTab(st.id as any)}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              settingsSubTab === st.id
                ? "bg-[#072A6C] text-white shadow-xs"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* ────────────────────────────────────────────────────────── */}
      {/* SUBTAB 1: MAIN WEBSITE APPEARANCE & THEME PRESETS          */}
      {/* ────────────────────────────────────────────────────────── */}
      {settingsSubTab === "appearance" && (
        <div className="space-y-6">
          {/* Theme Presets Selection Grid */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Palette size={16} className="text-[#D4AF37]" />
                  1. Select Professional Theme Preset
                </h3>
                <p className="text-xs text-gray-500">
                  Choose from 6 curated color schemes designed for higher-education and university portals.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetTheme}
                className="h-8 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw size={12} /> Reset to Classic
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {THEME_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id || colorsForm.primary === preset.colors.primary;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleApplyPreset(preset)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? "border-[#D4AF37] bg-amber-50/20 shadow-md ring-2 ring-[#D4AF37]/30"
                        : "border-gray-200 bg-white hover:border-[#072A6C]/40 hover:shadow-xs"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-gray-900">{preset.name}</span>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-white flex items-center justify-center">
                            <Check size={12} strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{preset.description}</p>
                    </div>

                    {/* Color Swatches Bar */}
                    <div className="space-y-1.5 pt-2 border-t border-gray-100">
                      <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider">Palette Preview</span>
                      <div className="flex items-center gap-1.5 h-6 rounded-lg overflow-hidden p-1 bg-slate-100 border border-gray-200">
                        <div className="flex-1 h-full rounded" style={{ backgroundColor: preset.colors.primary }} title={`Primary: ${preset.colors.primary}`} />
                        <div className="flex-1 h-full rounded" style={{ backgroundColor: preset.colors.secondary }} title={`Secondary: ${preset.colors.secondary}`} />
                        <div className="flex-1 h-full rounded" style={{ backgroundColor: preset.colors.accent }} title={`Accent: ${preset.colors.accent}`} />
                        <div className="flex-1 h-full rounded border border-gray-300" style={{ backgroundColor: preset.colors.background }} title={`Background: ${preset.colors.background}`} />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApplyPreset(preset);
                      }}
                      className={`w-full py-2 text-xs font-bold rounded-xl transition-all ${
                        isSelected
                          ? "bg-[#072A6C] text-white shadow-xs"
                          : "bg-slate-100 hover:bg-slate-200 text-gray-700"
                      }`}
                    >
                      {isSelected ? "Active Theme Applied ✓" : "Select & Apply Theme"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Colors Palette (Color Pickers + HEX Values) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Sliders size={16} className="text-[#072A6C]" />
                  2. Custom Colors (Color Picker + HEX Values)
                </h3>
                <p className="text-xs text-gray-500">
                  Override individual theme colors manually. Colors update the public website via global CSS variables.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetCustomColors}
                  className="h-8 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw size={12} /> Reset Custom Colors
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="h-8 px-3.5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
                >
                  <Save size={13} /> Save Custom Colors
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <ColorField
                label="Primary Brand Color"
                value={colorsForm.primary}
                defaultValue="#0B2A5B"
                onChange={(val) => setColorsForm({ ...colorsForm, primary: val, headerBg: val })}
                onReset={() => setColorsForm({ ...colorsForm, primary: "#0B2A5B", headerBg: "#0B2A5B" })}
              />

              <ColorField
                label="Secondary Brand Color"
                value={colorsForm.secondary}
                defaultValue="#163D7A"
                onChange={(val) => setColorsForm({ ...colorsForm, secondary: val })}
                onReset={() => setColorsForm({ ...colorsForm, secondary: "#163D7A" })}
              />

              <ColorField
                label="Accent / Gold Color"
                value={colorsForm.accent}
                defaultValue="#D4A72C"
                onChange={(val) => setColorsForm({ ...colorsForm, accent: val })}
                onReset={() => setColorsForm({ ...colorsForm, accent: "#D4A72C" })}
              />

              <ColorField
                label="Page Background"
                value={colorsForm.pageBackground || "#FFFFFF"}
                defaultValue="#FFFFFF"
                onChange={(val) => setColorsForm({ ...colorsForm, pageBackground: val })}
                onReset={() => setColorsForm({ ...colorsForm, pageBackground: "#FFFFFF" })}
              />

              <ColorField
                label="Surface / Card Color"
                value={colorsForm.statsBg || "#F8FAFC"}
                defaultValue="#F8FAFC"
                onChange={(val) => setColorsForm({ ...colorsForm, statsBg: val, chairmanBg: val, campusLifeBg: val })}
                onReset={() => setColorsForm({ ...colorsForm, statsBg: "#F8FAFC", chairmanBg: "#F8FAFC", campusLifeBg: "#F8FAFC" })}
              />

              <ColorField
                label="Main Text Color"
                value={colorsForm.textPrimary || "#172033"}
                defaultValue="#172033"
                onChange={(val) => setColorsForm({ ...colorsForm, textPrimary: val })}
                onReset={() => setColorsForm({ ...colorsForm, textPrimary: "#172033" })}
              />

              <ColorField
                label="Muted Text Color"
                value={colorsForm.textSecondary || "#64748B"}
                defaultValue="#64748B"
                onChange={(val) => setColorsForm({ ...colorsForm, textSecondary: val })}
                onReset={() => setColorsForm({ ...colorsForm, textSecondary: "#64748B" })}
              />

              <ColorField
                label="Footer Background"
                value={colorsForm.footerBg || "#0B2A5B"}
                defaultValue="#0B2A5B"
                onChange={(val) => setColorsForm({ ...colorsForm, footerBg: val })}
                onReset={() => setColorsForm({ ...colorsForm, footerBg: "#0B2A5B" })}
              />

              <ColorField
                label="Footer Text Color"
                value={colorsForm.footerText || "#D1D5DB"}
                defaultValue="#D1D5DB"
                onChange={(val) => setColorsForm({ ...colorsForm, footerText: val })}
                onReset={() => setColorsForm({ ...colorsForm, footerText: "#D1D5DB" })}
              />
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* SUBTAB 2: LIVE WEBSITE THEME PREVIEW                       */}
      {/* ────────────────────────────────────────────────────────── */}
      {settingsSubTab === "preview" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                <Eye size={16} className="text-[#D4AF37]" />
                Live Website Components Theme Preview
              </h3>
              <p className="text-xs text-gray-500">
                Live interactive rendering of public website components styled with your current palette.
              </p>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="h-8 px-3.5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs transition"
            >
              <span>Open Live Website</span>
              <ExternalLink size={12} />
            </a>
          </div>

          {/* Mini Mockup Window */}
          <div className="border border-gray-300 rounded-2xl overflow-hidden shadow-lg bg-slate-100 text-left font-[var(--font-poppins)]">
            {/* Mockup Top Window Bar */}
            <div className="bg-slate-800 px-4 py-2.5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <span className="text-[11px] text-slate-300 font-mono ml-2">https://chalapathi.edu.in</span>
              </div>
              <span className="text-[10px] text-amber-400 font-bold uppercase">Live CSS Variables Preview</span>
            </div>

            {/* Mockup Header */}
            <div 
              className="p-4 text-white flex items-center justify-between border-b border-white/10"
              style={{ backgroundColor: colorsForm.primary }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg p-1 flex items-center justify-center">
                  <img src={settingsForm.logoUrl || "/logo.png?v=3"} alt="Logo" className="h-6 w-auto" />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider">{settingsForm.universityName || "CHALAPATHI UNIVERSITY"}</div>
                  <div className="text-[9px] text-white/80">Accredited A++ University • Guntur</div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-4 text-xs font-bold text-white/90">
                <span>About</span>
                <span>Academics</span>
                <span>Admissions</span>
                <span>Placements</span>
                <span>News</span>
                <span 
                  className="px-3 py-1 rounded-lg font-bold text-slate-900"
                  style={{ backgroundColor: colorsForm.accent }}
                >
                  Apply 2026
                </span>
              </div>
            </div>

            {/* Mockup Hero Banner */}
            <div 
              className="p-8 text-white relative overflow-hidden"
              style={{ backgroundColor: colorsForm.secondary }}
            >
              <div className="max-w-xl space-y-3 relative z-10">
                <span 
                  className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-wider"
                  style={{ backgroundColor: colorsForm.accent }}
                >
                  Admissions Open 2026–27
                </span>
                <h2 className="text-2xl font-black tracking-tight leading-snug">
                  Transform Your Future at Chalapathi University
                </h2>
                <p className="text-xs text-white/80 leading-relaxed font-light">
                  Industry-integrated engineering, computer sciences, management, and healthcare education.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button 
                    type="button"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-900 shadow-md"
                    style={{ backgroundColor: colorsForm.accent }}
                  >
                    Explore Programs
                  </button>
                  <button 
                    type="button"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  >
                    Campus Tour
                  </button>
                </div>
              </div>
            </div>

            {/* Mockup Academic & Placement Cards */}
            <div className="p-6 bg-white space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: colorsForm.accent }}>
                  Featured Disciplines
                </span>
                <h3 className="text-base font-black" style={{ color: colorsForm.primary }}>
                  Industry-Aligned Academic Schools
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { title: "School of Computing", desc: "AI, ML, Cybersecurity & Data Science programs with global certifications." },
                  { title: "School of Engineering", desc: "VLSI, Robotics, Structural & Aerospace engineering with hands-on labs." },
                  { title: "School of Management", desc: "MBA in FinTech, Digital Marketing & Logistics with 100% placement track." }
                ].map((card, i) => (
                  <div 
                    key={i} 
                    className="p-4 rounded-xl border border-gray-200 space-y-2 hover:shadow-sm"
                    style={{ backgroundColor: colorsForm.statsBg || "#F8FAFC" }}
                  >
                    <div className="w-7 h-7 rounded-lg text-white flex items-center justify-center text-xs font-bold" style={{ backgroundColor: colorsForm.primary }}>
                      0{i + 1}
                    </div>
                    <h4 className="text-xs font-bold" style={{ color: colorsForm.primary }}>{card.title}</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">{card.desc}</p>
                    <div className="pt-2 text-[10px] font-bold flex items-center gap-1" style={{ color: colorsForm.accent }}>
                      <span>Learn More</span>
                      <ArrowRight size={11} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mockup Footer */}
            <div 
              className="p-6 text-xs flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10"
              style={{ backgroundColor: colorsForm.footerBg || colorsForm.primary, color: colorsForm.footerText || "#D1D5DB" }}
            >
              <div>
                <div className="font-bold text-white text-xs">{settingsForm.universityName || "Chalapathi University"}</div>
                <div className="text-[10px] text-white/70">A.R. Nagar, Mothadaka, Guntur, AP - 522016</div>
              </div>
              <div className="text-[10px] text-white/70">
                © 2026 Chalapathi University. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* SUBTAB 3: GLOBAL BRANDING & IDENTITY                       */}
      {/* ────────────────────────────────────────────────────────── */}
      {settingsSubTab === "branding" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                <Globe size={16} className="text-[#072A6C]" />
                Global Branding & University Identity
              </h3>
              <p className="text-xs text-gray-500">
                Configure official logos, university title, search engine tags, contact info, and social channels.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveSettings}
              className="h-8 px-3.5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save size={13} /> Save Branding
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Official University Name</label>
              <input
                type="text"
                value={settingsForm.universityName}
                onChange={(e) => setSettingsForm({ ...settingsForm, universityName: e.target.value })}
                className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-bold text-slate-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Slogan / Tagline</label>
              <input
                type="text"
                value={settingsForm.tagline}
                onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-slate-700"
              />
            </div>
          </div>

          {/* Logos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageField
              label="Primary University Logo"
              value={settingsForm.logoUrl || "/logo.png?v=3"}
              defaultValue="/logo.png?v=3"
              onChange={(val) => setSettingsForm({ ...settingsForm, logoUrl: val })}
              onReset={() => setSettingsForm({ ...settingsForm, logoUrl: "/logo.png?v=3" })}
              aspectRatio="square"
            />
            <ImageField
              label="White / Light Header Logo"
              value={settingsForm.logoWhiteUrl || "/logo.png?v=3"}
              defaultValue="/logo.png?v=3"
              onChange={(val) => setSettingsForm({ ...settingsForm, logoWhiteUrl: val })}
              onReset={() => setSettingsForm({ ...settingsForm, logoWhiteUrl: "/logo.png?v=3" })}
              aspectRatio="square"
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-100">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Primary Phone</label>
              <input
                type="text"
                value={settingsForm.contactPhone}
                onChange={(e) => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })}
                className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-slate-700"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Primary Email</label>
              <input
                type="text"
                value={settingsForm.contactEmail}
                onChange={(e) => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })}
                className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-slate-700"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-600 uppercase">Campus Location Address</label>
              <input
                type="text"
                value={settingsForm.contactAddress}
                onChange={(e) => setSettingsForm({ ...settingsForm, contactAddress: e.target.value })}
                className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg text-slate-700"
              />
            </div>
          </div>

          {/* Social Channels */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <h5 className="text-[11px] font-bold text-gray-700 uppercase">Social Media Handles & Channels</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Instagram URL</label>
                <input
                  type="text"
                  value={settingsForm.socialLinks?.instagram || ""}
                  onChange={(e) => setSettingsForm({
                    ...settingsForm,
                    socialLinks: { ...settingsForm.socialLinks, instagram: e.target.value }
                  })}
                  className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-mono text-slate-700"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">LinkedIn URL</label>
                <input
                  type="text"
                  value={settingsForm.socialLinks?.linkedin || ""}
                  onChange={(e) => setSettingsForm({
                    ...settingsForm,
                    socialLinks: { ...settingsForm.socialLinks, linkedin: e.target.value }
                  })}
                  className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-mono text-slate-700"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Facebook URL</label>
                <input
                  type="text"
                  value={settingsForm.socialLinks?.facebook || ""}
                  onChange={(e) => setSettingsForm({
                    ...settingsForm,
                    socialLinks: { ...settingsForm.socialLinks, facebook: e.target.value }
                  })}
                  className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-mono text-slate-700"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">YouTube URL</label>
                <input
                  type="text"
                  value={settingsForm.socialLinks?.youtube || ""}
                  onChange={(e) => setSettingsForm({
                    ...settingsForm,
                    socialLinks: { ...settingsForm.socialLinks, youtube: e.target.value }
                  })}
                  className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-mono text-slate-700"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Twitter / X URL</label>
                <input
                  type="text"
                  value={settingsForm.socialLinks?.twitter || ""}
                  onChange={(e) => setSettingsForm({
                    ...settingsForm,
                    socialLinks: { ...settingsForm.socialLinks, twitter: e.target.value }
                  })}
                  className="w-full h-8 px-2.5 text-xs bg-slate-50 border border-gray-200 rounded-lg font-mono text-slate-700"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* SUBTAB 4: GLOBAL WEBSITE CONTROLS                          */}
      {/* ────────────────────────────────────────────────────────── */}
      {settingsSubTab === "controls" && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                <Sliders size={16} className="text-[#072A6C]" />
                Global Website Controls & Switches
              </h3>
              <p className="text-xs text-gray-500">
                Toggle top announcement ticker, sticky header, splash video intro, and global announcements.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveSettings}
              className="h-8 px-3.5 bg-[#072A6C] hover:bg-[#051c4a] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save size={13} /> Save Controls
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Header Controls */}
            <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 space-y-3">
              <h4 className="text-xs font-black text-[#072A6C] uppercase flex items-center gap-1.5">
                <Layout size={14} /> Header & Navigation Switches
              </h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer bg-white p-2.5 rounded-lg border border-gray-200">
                  <input
                    type="checkbox"
                    checked={settingsForm.enableSplash}
                    onChange={(e) => setSettingsForm({ ...settingsForm, enableSplash: e.target.checked })}
                    className="w-4 h-4 rounded text-[#072A6C] focus:ring-[#072A6C]"
                  />
                  <div>
                    <div className="text-xs font-bold text-gray-800">Splash Video Intro on First Visit</div>
                    <div className="text-[10px] text-gray-400">Play animated logo intro video on first visit</div>
                  </div>
                </label>
              </div>
            </div>

            {/* General Controls */}
            <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 space-y-3">
              <h4 className="text-xs font-black text-[#072A6C] uppercase flex items-center gap-1.5">
                <Shield size={14} /> SEO & Security Settings
              </h4>
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Default SEO Title Prefix</label>
                  <input
                    type="text"
                    value={settingsForm.seoTitle || "Chalapathi University"}
                    onChange={(e) => setSettingsForm({ ...settingsForm, seoTitle: e.target.value })}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg text-slate-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* SUBTAB 5: SEARCH BAR & SEARCH ICON CMS                     */}
      {/* ────────────────────────────────────────────────────────── */}
      {settingsSubTab === "search" && (
        <div className="space-y-6">
          {/* Header Action Bar */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-black text-[#072A6C] uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                    SEARCH ENGINE & MODAL CMS
                  </span>
                </div>
                <h3 className="text-base font-black text-[#072A6C] mt-1">
                  Search Bar, Icon Colors & Quick Navigation Controls
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Customize the search trigger icon, input placeholder, modal styling, and configure the top quick navigation links.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleResetSearchConfig}
                  className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={13} /> Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={handleSaveSearchConfig}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#072A6C] hover:bg-[#051C4A] rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Save size={13} /> Save Search Config
                </button>
              </div>
            </div>

            {/* Quick Palette Presets */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider block">
                ⚡ Quick Harmonious Color Presets
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  {
                    id: "preset-navy",
                    title: "University Royal Navy",
                    iconColor: "#072A6C",
                    hoverColor: "#051C4A",
                    cardBg: "#F8FAFC",
                    desc: "Prestigious clean Navy Blue"
                  },
                  {
                    id: "preset-gold",
                    title: "Royal Gold Accent",
                    iconColor: "#D4AF37",
                    hoverColor: "#B59328",
                    cardBg: "#FFFDF5",
                    desc: "Warm ceremonial gold"
                  },
                  {
                    id: "preset-cobalt",
                    title: "Executive Cobalt Blue",
                    iconColor: "#2563EB",
                    hoverColor: "#1D4ED8",
                    cardBg: "#F1F5F9",
                    desc: "Vibrant modern tech blue"
                  },
                  {
                    id: "preset-emerald",
                    title: "Botanical Emerald",
                    iconColor: "#176B5B",
                    hoverColor: "#0F483D",
                    cardBg: "#F0FDF4",
                    desc: "Sophisticated deep green"
                  }
                ].map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSearchForm({
                        ...searchForm,
                        searchIconColor: preset.iconColor,
                        headerSearchBtnIconColor: preset.iconColor,
                        quickNavHeadingIconColor: preset.iconColor,
                        quickNavCardIconColor: preset.iconColor,
                        quickNavCardHoverText: preset.iconColor
                      });
                      notifySave(`Applied ${preset.title} search colors!`);
                    }}
                    className="p-3 rounded-xl border border-gray-200 hover:border-[#072A6C] hover:shadow-xs bg-slate-50/70 hover:bg-white text-left transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div 
                        className="w-4 h-4 rounded-full border border-black/10 shadow-xs group-hover:scale-110 transition-transform" 
                        style={{ backgroundColor: preset.iconColor }} 
                      />
                      <span className="text-xs font-bold text-gray-800 group-hover:text-[#072A6C]">
                        {preset.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500">{preset.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 1: Search Button & Icon Color Controls */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-gray-100">
              <Search size={15} /> 1. Search Icon & Header Button Styling
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <ColorField
                label="Modal Search Icon Color"
                value={searchForm.searchIconColor}
                onChange={(color) => setSearchForm({ ...searchForm, searchIconColor: color })}
                defaultValue="#072A6C"
                presetColors={["#072A6C", "#D4AF37", "#2563EB", "#176B5B", "#D71920", "#1E293B", "#64748B", "#0F172A"]}
              />
              <ColorField
                label="Header Search Button Icon Color"
                value={searchForm.headerSearchBtnIconColor}
                onChange={(color) => setSearchForm({ ...searchForm, headerSearchBtnIconColor: color })}
                defaultValue="#072A6C"
                presetColors={["#072A6C", "#D4AF37", "#2563EB", "#176B5B", "#D71920", "#1E293B", "#64748B", "#0F172A"]}
              />
              <ColorField
                label="Header Search Button Background"
                value={searchForm.headerSearchBtnBg}
                onChange={(color) => setSearchForm({ ...searchForm, headerSearchBtnBg: color })}
                defaultValue="#FFFFFF"
                presetColors={["#FFFFFF", "#F8FAFC", "#F1F5F9", "#072A6C", "#0B2A5B", "#1E293B"]}
              />
              <ColorField
                label="Header Search Button Border"
                value={searchForm.headerSearchBtnBorder}
                onChange={(color) => setSearchForm({ ...searchForm, headerSearchBtnBorder: color })}
                defaultValue="#E2E8F0"
                presetColors={["#E2E8F0", "#CBD5E1", "#072A6C", "#D4AF37", "#94A3B8", "transparent"]}
              />
              <ColorField
                label="Modal Header Background"
                value={searchForm.modalHeaderBg}
                onChange={(color) => setSearchForm({ ...searchForm, modalHeaderBg: color })}
                defaultValue="#FFFFFF"
                presetColors={["#FFFFFF", "#F8FAFC", "#F1F5F9", "#F3F4F6", "#072A6C"]}
              />
              <ColorField
                label="Modal Text & Input Color"
                value={searchForm.modalTextColor}
                onChange={(color) => setSearchForm({ ...searchForm, modalTextColor: color })}
                defaultValue="#1E293B"
                presetColors={["#1E293B", "#072A6C", "#0F172A", "#334155", "#000000"]}
              />
            </div>

            {/* Placeholder Text */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[10.5px] font-bold text-gray-700 uppercase tracking-wider block">
                Search Bar Placeholder Text
              </label>
              <input
                type="text"
                value={searchForm.searchPlaceholder}
                onChange={(e) => setSearchForm({ ...searchForm, searchPlaceholder: e.target.value })}
                placeholder="Type any program, department, facility, admissions, fees..."
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#072A6C] focus:bg-white transition-all font-medium"
              />
              <p className="text-[11px] text-gray-400">
                Shown inside the input before user types. Recommended: mention popular categories like programs, fees, admissions.
              </p>
            </div>
          </div>

          {/* Section 2: Top Quick Navigations Heading & Card Colors */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-gray-100">
              <Sparkles size={15} /> 2. Top Quick Navigations Colors & Styling
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10.5px] font-bold text-gray-700 uppercase tracking-wider block">
                  Quick Nav Section Title
                </label>
                <input
                  type="text"
                  value={searchForm.quickNavHeading}
                  onChange={(e) => setSearchForm({ ...searchForm, quickNavHeading: e.target.value })}
                  placeholder="Top Quick Navigations"
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#072A6C] focus:bg-white transition-all font-medium"
                />
              </div>
              <ColorField
                label="Quick Nav Heading Text Color"
                value={searchForm.quickNavHeadingColor}
                onChange={(color) => setSearchForm({ ...searchForm, quickNavHeadingColor: color })}
                defaultValue="#64748B"
                presetColors={["#64748B", "#94A3B8", "#072A6C", "#334155", "#D4AF37"]}
              />
              <ColorField
                label="Heading Sparkles Icon Color"
                value={searchForm.quickNavHeadingIconColor}
                onChange={(color) => setSearchForm({ ...searchForm, quickNavHeadingIconColor: color })}
                defaultValue="#072A6C"
                presetColors={["#072A6C", "#D4AF37", "#2563EB", "#176B5B", "#F59E0B"]}
              />
              <ColorField
                label="Quick Nav Card Background"
                value={searchForm.quickNavCardBg}
                onChange={(color) => setSearchForm({ ...searchForm, quickNavCardBg: color })}
                defaultValue="#F8FAFC"
                presetColors={["#F8FAFC", "#FFFFFF", "#F1F5F9", "#EEF2F6", "#FDFCF7"]}
              />
              <ColorField
                label="Quick Nav Card Text Color"
                value={searchForm.quickNavCardText}
                onChange={(color) => setSearchForm({ ...searchForm, quickNavCardText: color })}
                defaultValue="#1E293B"
                presetColors={["#1E293B", "#072A6C", "#334155", "#0F172A"]}
              />
              <ColorField
                label="Quick Nav Card Icon Color"
                value={searchForm.quickNavCardIconColor}
                onChange={(color) => setSearchForm({ ...searchForm, quickNavCardIconColor: color })}
                defaultValue="#072A6C"
                presetColors={["#072A6C", "#D4AF37", "#2563EB", "#176B5B", "#64748B"]}
              />
            </div>
          </div>

          {/* Section 3: Manage Quick Navigation Shortcuts List */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-2">
                <Layout size={15} /> 3. Manage Quick Navigation Shortcuts ({searchForm.quickNavItems?.length || 0})
              </h4>
              <button
                type="button"
                onClick={() => {
                  const newItem: QuickNavItem = {
                    id: `nav-${Date.now()}`,
                    label: "New Shortcut",
                    route: "/academics",
                    iconName: "BookOpen",
                    enabled: true
                  };
                  setSearchForm({
                    ...searchForm,
                    quickNavItems: [...(searchForm.quickNavItems || []), newItem]
                  });
                }}
                className="px-3 py-1.5 text-xs font-bold text-[#072A6C] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus size={13} /> Add Shortcut Link
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(searchForm.quickNavItems || []).map((item, idx) => {
                const IconComp = QUICK_NAV_ICON_MAP[item.iconName] || BookOpen;
                return (
                  <div 
                    key={item.id || idx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      item.enabled !== false 
                        ? "bg-slate-50/70 border-gray-200 hover:border-gray-300" 
                        : "bg-gray-100/60 border-dashed border-gray-300 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-200/60">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-7 h-7 rounded-lg bg-white shadow-2xs flex items-center justify-center shrink-0 border border-gray-100"
                          style={{ color: searchForm.quickNavCardIconColor || "#072A6C" }}
                        >
                          <IconComp size={14} />
                        </div>
                        <span className="text-xs font-bold text-gray-800">
                          #{idx + 1} {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...searchForm.quickNavItems];
                            updated[idx] = { ...updated[idx], enabled: item.enabled === false ? true : false };
                            setSearchForm({ ...searchForm, quickNavItems: updated });
                          }}
                          className={`px-2 py-0.5 text-[10px] font-black rounded-md transition-colors cursor-pointer ${
                            item.enabled !== false 
                              ? "bg-emerald-100 text-emerald-800" 
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {item.enabled !== false ? "ACTIVE" : "HIDDEN"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete shortcut "${item.label}"?`)) {
                              const updated = searchForm.quickNavItems.filter((_, i) => i !== idx);
                              setSearchForm({ ...searchForm, quickNavItems: updated });
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          title="Delete shortcut"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                          Button Label
                        </label>
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) => {
                            const updated = [...searchForm.quickNavItems];
                            updated[idx] = { ...updated[idx], label: e.target.value };
                            setSearchForm({ ...searchForm, quickNavItems: updated });
                          }}
                          className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg text-slate-800 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                          Destination Route URL
                        </label>
                        <input
                          type="text"
                          value={item.route}
                          onChange={(e) => {
                            const updated = [...searchForm.quickNavItems];
                            updated[idx] = { ...updated[idx], route: e.target.value };
                            setSearchForm({ ...searchForm, quickNavItems: updated });
                          }}
                          placeholder="/academics/btech-cse"
                          className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg text-slate-800 font-mono text-[11px]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                          Icon
                        </label>
                        <select
                          value={item.iconName}
                          onChange={(e) => {
                            const updated = [...searchForm.quickNavItems];
                            updated[idx] = { ...updated[idx], iconName: e.target.value };
                            setSearchForm({ ...searchForm, quickNavItems: updated });
                          }}
                          className="w-full h-8 px-2 text-xs bg-white border border-gray-200 rounded-lg text-slate-800"
                        >
                          {QUICK_NAV_AVAILABLE_ICONS.map((opt) => (
                            <option key={opt.name} value={opt.name}>
                              {opt.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 4: Live Real-Time Interactive Preview */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h4 className="text-xs font-black text-[#072A6C] uppercase tracking-wider flex items-center gap-2">
                  <Eye size={15} /> 4. Live Visual Preview (How Students & Visitors See It)
                </h4>
                <p className="text-[11px] text-gray-500">
                  Interactive real-time preview reflecting your chosen search icon colors, button styling, and quick nav buttons.
                </p>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
                LIVE INTERACTIVE PREVIEW
              </span>
            </div>

            {/* Header Trigger Button Preview */}
            <div className="p-4 bg-slate-900 rounded-xl flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider block">
                  Public Website Header Navigation Bar Preview
                </span>
                <span className="text-xs font-medium text-white/80">
                  Header Search Trigger Button:
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  style={{
                    backgroundColor: searchForm.headerSearchBtnBg || "#FFFFFF",
                    borderColor: searchForm.headerSearchBtnBorder || "#E2E8F0",
                    color: searchForm.headerSearchBtnIconColor || "#072A6C"
                  }}
                  className="w-10 h-10 rounded-full border flex items-center justify-center transition-transform hover:scale-105 shadow-xs cursor-pointer"
                  title="Search Preview"
                >
                  <Search size={17} style={{ color: searchForm.headerSearchBtnIconColor || "#072A6C" }} />
                </button>
                <div className="h-6 w-px bg-white/20" />
                <span className="text-xs text-white/60 font-mono">Click opens modal below ↓</span>
              </div>
            </div>

            {/* Modal Box Preview Container */}
            <div className="p-4 sm:p-6 bg-slate-900/80 rounded-2xl border border-slate-700/50 flex items-center justify-center">
              <div 
                className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border overflow-hidden transition-all"
                style={{ borderColor: searchForm.modalBorderColor || "#E2E8F0" }}
              >
                {/* Search Input Bar */}
                <div 
                  className="relative flex items-center px-4 py-3.5 border-b"
                  style={{ 
                    backgroundColor: searchForm.modalHeaderBg || "#FFFFFF",
                    borderColor: searchForm.modalBorderColor || "#F1F5F9"
                  }}
                >
                  <Search 
                    size={20} 
                    className="shrink-0 mr-3 transition-colors"
                    style={{ color: searchForm.searchIconColor || "#072A6C" }}
                  />
                  <input
                    type="text"
                    readOnly
                    placeholder={searchForm.searchPlaceholder || "Type any program, department, facility, admissions, fees..."}
                    style={{ color: searchForm.modalTextColor || "#072A6C" }}
                    className="w-full bg-transparent placeholder-gray-400 font-semibold text-sm outline-none border-none cursor-default"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-mono rounded font-bold">
                      ESC
                    </span>
                    <button
                      type="button"
                      className="p-1 text-gray-400 hover:text-gray-700 rounded-full cursor-default"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Top Quick Navigations */}
                <div className="p-4 sm:p-5 bg-white space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles 
                      size={15} 
                      style={{ color: searchForm.quickNavHeadingIconColor || searchForm.searchIconColor || "#072A6C" }} 
                    />
                    <span 
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: searchForm.quickNavHeadingColor || "#64748B" }}
                    >
                      {searchForm.quickNavHeading || "Top Quick Navigations"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {(searchForm.quickNavItems || []).filter(item => item.enabled !== false).map((item) => {
                      const Icon = QUICK_NAV_ICON_MAP[item.iconName] || BookOpen;
                      return (
                        <div
                          key={item.id || item.label}
                          style={{
                            backgroundColor: searchForm.quickNavCardBg || "#F8FAFC",
                            color: searchForm.quickNavCardText || "#072A6C"
                          }}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-100 shadow-2xs group transition-all"
                        >
                          <div 
                            className="w-7 h-7 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-110 transition-transform"
                            style={{ color: searchForm.quickNavCardIconColor || searchForm.searchIconColor || "#072A6C" }}
                          >
                            <Icon size={14} />
                          </div>
                          <span className="text-xs font-bold truncate">{item.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Save Bar */}
            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={handleSaveSearchConfig}
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#072A6C] hover:bg-[#051C4A] rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Save size={14} /> Save & Publish Search Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default SettingsCMS;

import React, { useState } from "react";
import { 
  Phone, Mail, Globe, Clock, MapPin, Building, ShieldCheck, 
  Sparkles, Layers, Plus, Trash2, ArrowUp, ArrowDown, Eye, CheckCircle2
} from "lucide-react";
import { 
  ContactPageContent, 
  DepartmentContact, 
  DEFAULT_CONTACT_PAGE_CONTENT, 
  useData 
} from "../../context/DataContext";
import { SectionHeader } from "./AdminComponents";

export interface ContactCMSProps {
  notifySave: (msg: string) => void;
}

export const ContactCMS: React.FC<ContactCMSProps> = ({ notifySave }) => {
  const { contactPageContent, updateContactPageContent, siteSettings, updateSiteSettings } = useData();

  const [formState, setFormState] = useState<ContactPageContent>(() => contactPageContent || DEFAULT_CONTACT_PAGE_CONTENT);
  const [activeSubTab, setActiveSubTab] = useState<
    "hero" | "getInTouch" | "form" | "departments" | "map" | "helpdesk"
  >("hero");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state if context changes externally
  React.useEffect(() => {
    if (contactPageContent) {
      setFormState(contactPageContent);
    }
  }, [contactPageContent]);

  const handleSave = () => {
    updateContactPageContent(formState);
    
    // Also sync standard siteSettings contact fields
    updateSiteSettings({
      ...siteSettings,
      contactPhone: formState.phoneNumber || siteSettings.contactPhone,
      contactEmail: formState.emailAddress || siteSettings.contactEmail,
      contactAddress: formState.locationAddress || siteSettings.contactAddress,
      googleMapEmbedUrl: formState.mapEmbedUrl || siteSettings.googleMapEmbedUrl
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
    notifySave("Contact Us page CMS content saved live!");
  };

  const handleReset = () => {
    if (window.confirm("Reset all Contact Us page content to original university defaults?")) {
      setFormState(DEFAULT_CONTACT_PAGE_CONTENT);
      updateContactPageContent(DEFAULT_CONTACT_PAGE_CONTENT);
      notifySave("Contact Us page content reset to defaults!");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <SectionHeader
        title="Contact Us Page CMS"
        subtitle="Manage hero banner, direct contact channels, inquiry form, department helplines, and interactive Google Map matching the live website"
        icon={Phone}
        onSave={handleSave}
        saveSuccess={saveSuccess}
        onReset={handleReset}
        resetLabel="Reset Contact Page"
      />

      {/* Subtab Navigation matching live page layout */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-gray-200">
        {[
          { id: "hero" as const, label: "🌟 1. Hero Banner", icon: Sparkles },
          { id: "getInTouch" as const, label: "📞 2. Get In Touch (4 Boxes)", icon: Phone },
          { id: "form" as const, label: "✉️ 3. Contact Form Settings", icon: Mail },
          { id: "departments" as const, label: `🏢 4. Department Helplines (${formState.departments?.length || 0})`, icon: Building },
          { id: "map" as const, label: "🗺️ 5. Google Maps & Location", icon: MapPin },
          { id: "helpdesk" as const, label: "🧭 6. Quick Nav & Helpdesk", icon: Layers }
        ].map((sub) => {
          const Icon = sub.icon;
          const isActive = activeSubTab === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => setActiveSubTab(sub.id)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#072A6C] text-white shadow-md shadow-[#072A6C]/20"
                  : "bg-white text-gray-700 hover:bg-slate-50 border border-gray-200/80"
              }`}
            >
              <Icon size={14} className={isActive ? "text-[#D4AF37]" : "text-gray-400"} />
              <span>{sub.label}</span>
            </button>
          );
        })}
      </div>

      {/* ──────────────────────────────────────────────── */}
      {/* SUBTAB 1: PAGE HERO BANNER                       */}
      {/* ──────────────────────────────────────────────── */}
      {activeSubTab === "hero" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Sparkles size={16} className="text-[#D4AF37]" /> Contact Page Top Hero Banner
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Edit badge, main title, and overview description shown at the top of /contact</p>
              </div>
              <span className="px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-[10px] font-bold text-blue-700">
                Top Hero Component
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase">Top Badge Text</label>
                <input
                  type="text"
                  value={formState.heroBadge ?? "CONTACT SUPPORT"}
                  onChange={(e) => setFormState({ ...formState, heroBadge: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#072A6C] focus:bg-white"
                  placeholder="CONTACT SUPPORT"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase">Main Heading (Title)</label>
                <input
                  type="text"
                  value={formState.heroTitle ?? "CONTACT US"}
                  onChange={(e) => setFormState({ ...formState, heroTitle: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-black text-[#072A6C] focus:bg-white"
                  placeholder="CONTACT US"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-700 uppercase">Hero Overview Description</label>
              <textarea
                rows={3}
                value={formState.heroDescription}
                onChange={(e) => setFormState({ ...formState, heroDescription: e.target.value })}
                className="w-full p-3 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-800 leading-relaxed focus:bg-white resize-y"
                placeholder="Whether you're a prospective student, parent, recruiter..."
              />
            </div>

            {/* Live Visual Preview of Hero */}
            <div className="pt-2 border-t border-gray-100">
              <label className="text-[11px] font-bold text-gray-700 uppercase mb-2 block">Live Visual Preview</label>
              <div className="bg-[#072A6C] rounded-2xl p-6 text-white relative overflow-hidden shadow-sm">
                <div className="space-y-2 relative z-10">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-white/10 text-white rounded-lg font-bold text-[10px] uppercase tracking-wider">
                    {formState.heroBadge || "CONTACT SUPPORT"}
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">{formState.heroTitle || "CONTACT US"}</h2>
                  <p className="text-xs text-blue-100 font-light max-w-xl leading-relaxed">
                    {formState.heroDescription}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────── */}
      {/* SUBTAB 2: GET IN TOUCH 4 BOXES (Left Card)       */}
      {/* ──────────────────────────────────────────────── */}
      {activeSubTab === "getInTouch" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Phone size={16} className="text-[#072A6C]" /> Get In Touch With Us Now (4 Direct Info Boxes)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Control the 4 key contact boxes: Phone, Email, Location, and Working Hours</p>
              </div>
            </div>

            <div className="space-y-1.5 max-w-md">
              <label className="text-[11px] font-bold text-gray-700 uppercase">Card Header Bar Text</label>
              <input
                type="text"
                value={formState.getInTouchTitle ?? "GET IN TOUCH WITH US NOW!"}
                onChange={(e) => setFormState({ ...formState, getInTouchTitle: e.target.value })}
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#072A6C]"
                placeholder="GET IN TOUCH WITH US NOW!"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Box 1: Phone */}
              <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-[#072A6C] font-bold text-xs">
                  <Phone size={16} /> <span>1. Phone Number Box</span>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Box Label</label>
                  <input
                    type="text"
                    value={formState.phoneTitle ?? "PHONE NUMBER"}
                    onChange={(e) => setFormState({ ...formState, phoneTitle: e.target.value })}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Phone Value</label>
                  <input
                    type="text"
                    value={formState.phoneNumber ?? "+91 95055 05566"}
                    onChange={(e) => setFormState({ ...formState, phoneNumber: e.target.value })}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-[#072A6C]"
                    placeholder="+91 95055 05566"
                  />
                </div>
              </div>

              {/* Box 2: Email */}
              <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-[#072A6C] font-bold text-xs">
                  <Mail size={16} /> <span>2. Email Box</span>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Box Label</label>
                  <input
                    type="text"
                    value={formState.emailTitle ?? "EMAIL"}
                    onChange={(e) => setFormState({ ...formState, emailTitle: e.target.value })}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Email Value</label>
                  <input
                    type="email"
                    value={formState.emailAddress ?? "info@city.ac.in"}
                    onChange={(e) => setFormState({ ...formState, emailAddress: e.target.value })}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-[#072A6C]"
                    placeholder="info@city.ac.in"
                  />
                </div>
              </div>

              {/* Box 3: Location */}
              <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-[#072A6C] font-bold text-xs">
                  <Globe size={16} /> <span>3. Location Box</span>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Box Label</label>
                  <input
                    type="text"
                    value={formState.locationTitle ?? "LOCATION"}
                    onChange={(e) => setFormState({ ...formState, locationTitle: e.target.value })}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Address Value</label>
                  <input
                    type="text"
                    value={formState.locationAddress ?? "A.R. Nagar, Mothadaka, Guntur, AP – 522016"}
                    onChange={(e) => setFormState({ ...formState, locationAddress: e.target.value })}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-medium text-gray-700"
                    placeholder="A.R. Nagar, Mothadaka, Guntur, AP – 522016"
                  />
                </div>
              </div>

              {/* Box 4: Working Hours */}
              <div className="p-4 bg-slate-50 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center gap-2 text-[#072A6C] font-bold text-xs">
                  <Clock size={16} /> <span>4. Working Hours Box</span>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Box Label</label>
                  <input
                    type="text"
                    value={formState.workingHoursTitle ?? "WORKING HOURS"}
                    onChange={(e) => setFormState({ ...formState, workingHoursTitle: e.target.value })}
                    className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Mon-Sat Timings</label>
                    <input
                      type="text"
                      value={formState.workingHoursDays ?? "Mon - Sat: 09:00 AM - 05:00 PM"}
                      onChange={(e) => setFormState({ ...formState, workingHoursDays: e.target.value })}
                      className="w-full h-8 px-2 text-xs bg-white border border-gray-200 rounded-lg font-semibold text-gray-700"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#D4AF37] uppercase">Sunday Status</label>
                    <input
                      type="text"
                      value={formState.workingHoursClosed ?? "Sunday: Closed"}
                      onChange={(e) => setFormState({ ...formState, workingHoursClosed: e.target.value })}
                      className="w-full h-8 px-2 text-xs bg-white border border-gray-200 rounded-lg font-bold text-[#D4AF37]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────── */}
      {/* SUBTAB 3: CONTACT FORM SETTINGS (Right Card)     */}
      {/* ──────────────────────────────────────────────── */}
      {activeSubTab === "form" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Mail size={16} className="text-[#072A6C]" /> Contact Us Inquiry Form Settings
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Customize form headers, submit button, and response notifications</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase">Form Header Bar Title</label>
                <input
                  type="text"
                  value={formState.formTitle ?? "CONTACT US"}
                  onChange={(e) => setFormState({ ...formState, formTitle: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#072A6C]"
                  placeholder="CONTACT US"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase">Submit Button Label</label>
                <input
                  type="text"
                  value={formState.formSubmitButtonText ?? "SUBMIT REQUEST"}
                  onChange={(e) => setFormState({ ...formState, formSubmitButtonText: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#D4AF37]"
                  placeholder="SUBMIT REQUEST"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-700 uppercase">Submission Success Alert Message</label>
              <input
                type="text"
                value={formState.formSuccessMessage ?? "Message sent successfully! Our representative will contact you shortly."}
                onChange={(e) => setFormState({ ...formState, formSuccessMessage: e.target.value })}
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-800"
                placeholder="Message sent successfully! Our representative will contact you shortly."
              />
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1 text-emerald-800 text-xs">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 size={15} className="text-emerald-600" /> Form Features Included:
              </div>
              <p className="text-[11px] text-emerald-700 leading-relaxed font-light">
                • Mandatory First Name, Mobile Number, and Email ID fields.<br />
                • Anti-spam alphanumeric dynamic Captcha generator with refresh button.<br />
                • Inquiries automatically trigger email and SMS notifications to admissions staff.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────── */}
      {/* SUBTAB 4: DEPARTMENT HELPLINES (Photo 2)         */}
      {/* ──────────────────────────────────────────────── */}
      {activeSubTab === "departments" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Building size={16} className="text-[#072A6C]" /> Department Helplines ({formState.departments?.length || 0} Cards)
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Manage admissions, principal, training & placements, and exams helpline cards</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormState({
                      ...formState,
                      departments: DEFAULT_CONTACT_PAGE_CONTENT.departments
                    });
                    notifySave("Reset department helplines to default!");
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all cursor-pointer"
                >
                  Reset Defaults
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newDept: DepartmentContact = {
                      id: `dept_${Date.now()}`,
                      name: "NEW DEPARTMENT OFFICE",
                      phones: ["+91 88866 30000"],
                      emails: ["dept@city.ac.in"]
                    };
                    setFormState({
                      ...formState,
                      departments: [...(formState.departments || []), newDept]
                    });
                  }}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#072A6C] hover:bg-[#072A6C]/90 rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Plus size={14} /> Add Department Card
                </button>
              </div>
            </div>

            {/* Department Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formState.departments?.map((dept, idx) => (
                <div
                  key={dept.id || idx}
                  className="bg-slate-50 p-4 rounded-xl border border-gray-200 space-y-3 relative group hover:border-[#072A6C]/40 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black text-[#072A6C] bg-white px-2 py-0.5 rounded-md border border-gray-200">
                        #{idx + 1} {dept.name}
                      </span>
                      <div className="flex items-center gap-1">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...formState.departments];
                              const temp = updated[idx];
                              updated[idx] = updated[idx - 1];
                              updated[idx - 1] = temp;
                              setFormState({ ...formState, departments: updated });
                            }}
                            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-white rounded"
                            title="Move Up"
                          >
                            <ArrowUp size={12} />
                          </button>
                        )}
                        {idx < formState.departments.length - 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...formState.departments];
                              const temp = updated[idx];
                              updated[idx] = updated[idx + 1];
                              updated[idx + 1] = temp;
                              setFormState({ ...formState, departments: updated });
                            }}
                            className="p-1 text-gray-400 hover:text-gray-700 hover:bg-white rounded"
                            title="Move Down"
                          >
                            <ArrowDown size={12} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formState.departments.filter((_, i) => i !== idx);
                            setFormState({ ...formState, departments: updated });
                          }}
                          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete Department"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Department Name</label>
                      <input
                        type="text"
                        value={dept.name}
                        onChange={(e) => {
                          const updated = [...formState.departments];
                          updated[idx] = { ...updated[idx], name: e.target.value };
                          setFormState({ ...formState, departments: updated });
                        }}
                        className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-[#072A6C]"
                        placeholder="e.g. ADMISSIONS OFFICE"
                      />
                    </div>

                    {/* Optional Contact Person */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#D4AF37] uppercase">Officer / Person Name (Optional)</label>
                      <input
                        type="text"
                        value={dept.contactPerson || ""}
                        onChange={(e) => {
                          const updated = [...formState.departments];
                          updated[idx] = { ...updated[idx], contactPerson: e.target.value };
                          setFormState({ ...formState, departments: updated });
                        }}
                        className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-gray-800"
                        placeholder="e.g. Dr. Kolla Naga Sreenivasa Rao"
                      />
                    </div>

                    {/* Phone Numbers (Comma separated) */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Phone Numbers (Comma separated)</label>
                      <input
                        type="text"
                        value={(dept.phones || []).join(", ")}
                        onChange={(e) => {
                          const updated = [...formState.departments];
                          const phones = e.target.value.split(",").map((p) => p.trim()).filter(Boolean);
                          updated[idx] = { ...updated[idx], phones };
                          setFormState({ ...formState, departments: updated });
                        }}
                        className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-semibold text-gray-800"
                        placeholder="+91 88866 30340, +91 88866 30341"
                      />
                    </div>

                    {/* Email Addresses (Comma separated) */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Email Addresses (Comma separated)</label>
                      <input
                        type="text"
                        value={(dept.emails || []).join(", ")}
                        onChange={(e) => {
                          const updated = [...formState.departments];
                          const emails = e.target.value.split(",").map((em) => em.trim()).filter(Boolean);
                          updated[idx] = { ...updated[idx], emails };
                          setFormState({ ...formState, departments: updated });
                        }}
                        className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg font-semibold text-[#D4AF37]"
                        placeholder="admissions@city.ac.in, contact@city.ac.in"
                      />
                    </div>

                    {/* Optional Note / Sub-section */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Additional Section / Note (Optional)</label>
                      <input
                        type="text"
                        value={dept.note || ""}
                        onChange={(e) => {
                          const updated = [...formState.departments];
                          updated[idx] = { ...updated[idx], note: e.target.value };
                          setFormState({ ...formState, departments: updated });
                        }}
                        className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg text-gray-600"
                        placeholder="e.g. Scholarship Office"
                      />
                    </div>

                    {dept.note && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 uppercase">Additional Phones (Comma separated)</label>
                        <input
                          type="text"
                          value={(dept.additionalPhones || []).join(", ")}
                          onChange={(e) => {
                            const updated = [...formState.departments];
                            const additionalPhones = e.target.value.split(",").map((p) => p.trim()).filter(Boolean);
                            updated[idx] = { ...updated[idx], additionalPhones };
                            setFormState({ ...formState, departments: updated });
                          }}
                          className="w-full h-8 px-2.5 text-xs bg-white border border-gray-200 rounded-lg text-gray-700"
                          placeholder="+91 98481 33748, 08645-326372"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────── */}
      {/* SUBTAB 5: GOOGLE MAPS & LOCATION                 */}
      {/* ──────────────────────────────────────────────── */}
      {activeSubTab === "map" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <MapPin size={16} className="text-[#072A6C]" /> Google Maps & Campus Geolocation
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Edit map heading, address details, Google Maps external link, and interactive embed iframe</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase">Map Section Title</label>
                <input
                  type="text"
                  value={formState.mapHeading ?? "FIND US ON THE MAP"}
                  onChange={(e) => setFormState({ ...formState, mapHeading: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#072A6C]"
                  placeholder="FIND US ON THE MAP"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase">Map Button Label</label>
                <input
                  type="text"
                  value={formState.mapButtonText ?? "Open in Google Maps"}
                  onChange={(e) => setFormState({ ...formState, mapButtonText: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-gray-800"
                  placeholder="Open in Google Maps"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-700 uppercase">Campus Location Address</label>
              <input
                type="text"
                value={formState.mapAddress ?? "Chalapathi University (Autonomous), Abburi Raghavaiah Nagar, Mothadaka, Guntur, AP – 522016, India."}
                onChange={(e) => setFormState({ ...formState, mapAddress: e.target.value })}
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-800"
                placeholder="Chalapathi University (Autonomous), Abburi Raghavaiah Nagar..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-700 uppercase">External Google Maps URL</label>
              <input
                type="text"
                value={formState.mapExternalUrl ?? ""}
                onChange={(e) => setFormState({ ...formState, mapExternalUrl: e.target.value })}
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl text-blue-600 font-mono"
                placeholder="https://www.google.com/maps/place/..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-700 uppercase">Google Maps Embed URL (Iframe src)</label>
              <input
                type="text"
                value={formState.mapEmbedUrl ?? ""}
                onChange={(e) => setFormState({ ...formState, mapEmbedUrl: e.target.value })}
                className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-600 font-mono"
                placeholder="https://www.google.com/maps/embed?pb=..."
              />
            </div>

            {/* Live Interactive Map Preview */}
            <div className="pt-3 border-t border-gray-100 space-y-2">
              <label className="text-[11px] font-bold text-gray-700 uppercase flex items-center gap-1.5">
                <Eye size={13} /> Live Interactive Map Preview
              </label>
              <div className="rounded-xl overflow-hidden border border-gray-200 h-64 md:h-80 shadow-inner bg-slate-100">
                <iframe
                  src={formState.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3826.974950454796!2d80.28581691486445!3d16.375218788685984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a4a79679802cfad%3A0xe67e2a901bbd33fe!2sChalapathi%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1657523129846!5m2!1sen!2sin"}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────── */}
      {/* SUBTAB 6: QUICK NAVIGATION & HELPDESK (Bottom)   */}
      {/* ──────────────────────────────────────────────── */}
      {activeSubTab === "helpdesk" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-sm font-black text-[#072A6C] uppercase flex items-center gap-2">
                  <Layers size={16} className="text-[#072A6C]" /> Quick Navigation & Admission Helpdesk Cards
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Manage the bottom contact cards displayed at the footer of /contact and /placements</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase">Quick Nav Card Heading</label>
                <input
                  type="text"
                  value={formState.quickNavTitle ?? "QUICK NAVIGATION"}
                  onChange={(e) => setFormState({ ...formState, quickNavTitle: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#072A6C]"
                  placeholder="QUICK NAVIGATION"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase">Admission Helpdesk Heading</label>
                <input
                  type="text"
                  value={formState.helpdeskTitle ?? "ADMISSION HELPDESK"}
                  onChange={(e) => setFormState({ ...formState, helpdeskTitle: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#072A6C]"
                  placeholder="ADMISSION HELPDESK"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-700 uppercase">Helpdesk Description Text</label>
              <textarea
                rows={2}
                value={formState.helpdeskDescription ?? "Have questions about registration, courses, or hostels? Reach our advisors directly."}
                onChange={(e) => setFormState({ ...formState, helpdeskDescription: e.target.value })}
                className="w-full p-2.5 text-xs bg-slate-50 border border-gray-200 rounded-xl text-gray-800"
                placeholder="Have questions about registration, courses, or hostels? Reach our advisors directly."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase">Counselor Phone Number</label>
                <input
                  type="text"
                  value={formState.helpdeskPhone ?? "8886630355"}
                  onChange={(e) => setFormState({ ...formState, helpdeskPhone: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#072A6C]"
                  placeholder="8886630355"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-700 uppercase">Call Button Text</label>
                <input
                  type="text"
                  value={formState.helpdeskButtonText ?? "Call Counselor"}
                  onChange={(e) => setFormState({ ...formState, helpdeskButtonText: e.target.value })}
                  className="w-full h-10 px-3 text-xs bg-slate-50 border border-gray-200 rounded-xl font-bold text-[#D4AF37]"
                  placeholder="Call Counselor"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Calendar, CheckCircle2, ChevronDown, ChevronRight, GraduationCap, LayoutDashboard, LogOut, Megaphone, Settings, ShieldCheck, Users, X } from "lucide-react";
import type { EnquiryLead, SiteSettings } from "../../context/DataContext";
import { canViewTab, useAdminAccess } from "../../security/adminAccess";

export interface WorkspaceNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string;
  section?: string;
  subItems?: { id: string; label: string; onClick: () => void; isActive: boolean }[];
}

export const workspaceLabels: Record<string, string> = {
  dashboard: "Overview", pages: "Website Pages", homepage: "Homepage", about: "About Us",
  academics: "Academics", certifications: "Certifications", admissions: "Admissions",
  research: "Research & Innovation", directories: "Faculty & Directories", "campus-life": "Campus Life",
  placements: "Placements", "news-events": "News & Events", news: "News", events: "Events",
  contact: "Contact Us", popup: "Popup Manager", gallery: "Media Library", footer: "Footer",
  settings: "SEO & Settings", links: "Navigation Links", security: "Authorization & Security",
};

interface SidebarProps {
  items: WorkspaceNavItem[];
  activeTab: string;
  expanded: (id: string) => boolean;
  onToggle: (id: string) => void;
  onNavigate: (id: string) => void;
  onLogout: () => void;
  onReset: () => void;
  logo: string;
  university: string;
  collapsed?: boolean;
  mobile?: boolean;
  onClose?: () => void;
}

function MediaLibraryIcon({ size = 21 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></svg>;
}

export function AdminSidebar({ items, activeTab, expanded, onToggle, onNavigate, onLogout, onReset, logo, university, collapsed, mobile, onClose }: SidebarProps) {
  const { user, can } = useAdminAccess();
  return <aside className={`admin-sidebar ${collapsed ? "is-collapsed" : ""} ${mobile ? "is-mobile" : ""}`} aria-label="Admin navigation">
    <div className="admin-brand">
      <Link to="/" target="_blank" className="admin-brand-logo" title={university}>
        <img src={logo} alt={university} />
      </Link>
      {!collapsed && <span>Content Studio</span>}
      {mobile && <button type="button" className="admin-drawer-close" aria-label="Close navigation" onClick={onClose}><X size={20} /></button>}
    </div>
    <nav className="admin-navigation">
      {items.map(item => {
        const Icon = item.id === "gallery" ? MediaLibraryIcon : item.icon;
        const active = activeTab === item.id;
        const open = expanded(item.id);
        return <div key={item.id} className="admin-nav-group">
          {item.section && !collapsed && <div className="admin-nav-caption">{item.section}</div>}
          <div className={`admin-nav-row ${active ? "is-active" : ""}`}>
            <button type="button" className="admin-nav-link" title={workspaceLabels[item.id] || item.label} aria-current={active ? "page" : undefined} onClick={() => {
              onNavigate(item.id);
              if (item.subItems && !open) onToggle(item.id);
              if (mobile && !item.subItems) onClose?.();
            }}>
              <Icon size={21} />
              {!collapsed && <><span>{workspaceLabels[item.id] || item.label}</span>{item.badge && <small>{item.badge}</small>}</>}
            </button>
            {!collapsed && item.subItems && <button type="button" className="admin-nav-expand" onClick={() => onToggle(item.id)} aria-label={`${open ? "Collapse" : "Expand"} ${workspaceLabels[item.id] || item.label}`} aria-expanded={open}>
              {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>}
          </div>
          {!collapsed && open && item.subItems && <div className="admin-subnavigation">
            {item.subItems.map(sub => <button type="button" key={sub.id} className={sub.isActive ? "is-active" : ""} aria-current={sub.isActive ? "page" : undefined} onClick={() => { sub.onClick(); if (mobile) onClose?.(); }}>{sub.label}</button>)}
          </div>}
        </div>;
      })}
    </nav>
    <div className="admin-sidebar-footer">
      {!collapsed && <div className="admin-account"><span className="admin-avatar">{user?.username.charAt(0).toUpperCase()}</span><div><strong>{user?.username}</strong><small>{user?.roleName || "Administrator"}</small></div><ShieldCheck size={18} /></div>}
      <button type="button" onClick={onLogout} title="Logout"><LogOut size={19} />{!collapsed && "Logout"}</button>
      {can("settings", "manage") && <button type="button" onClick={onReset} className="admin-restore" title="Restore Defaults"><Settings size={16} />{!collapsed && "Restore Defaults"}</button>}
    </div>
  </aside>;
}

interface OverviewProps {
  programs: number;
  enquiries: EnquiryLead[];
  newsEvents: number;
  announcements: number;
  settings: SiteSettings;
  lastSavedTime: string | null;
  onNavigate: (id: string) => void;
  onHomeSection: (id: "placements" | "virtualTour") => void;
}

export function AdminOverview({ programs, enquiries, newsEvents, announcements, settings, lastSavedTime, onNavigate, onHomeSection }: OverviewProps) {
  const { user, can } = useAdminAccess();
  const metrics = [
    { label: "Academic programs", value: programs, icon: GraduationCap, detail: "Programs currently listed on your website.", tone: "blue" },
    { label: "Admission enquiries", value: enquiries.length, icon: Users, detail: "Enquiries received through your website.", tone: "gold" },
    { label: "News & events", value: newsEvents, icon: Calendar, detail: "Articles and events in your content library.", tone: "blue" },
    { label: "Announcements", value: announcements, icon: Megaphone, detail: "Notices in your announcements library.", tone: "gold" },
  ].filter(metric => metric.label === "Academic programs" ? can("academics") : metric.label === "Admission enquiries" ? can("enquiries") : metric.label === "Announcements" ? can("announcements") : can("news") || can("events"));
  const checks = [
    { label: "SEO title & description", ready: Boolean(settings.seoTitle?.trim() && settings.seoDescription?.trim()), tab: "settings" },
    { label: "University logo configured", ready: Boolean(settings.logoUrl?.trim()), tab: "settings" },
    { label: "Contact details configured", ready: Boolean(settings.contactEmail?.trim() && settings.contactPhone?.trim()), tab: "contact" },
    { label: "Academic programs listed", ready: programs > 0, tab: "academics" },
  ];
  const configured = checks.filter(check => check.ready).length;
  const percent = Math.round(configured / checks.length * 100);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const quick = [
    { title: "Edit homepage", detail: "Update banners, sections and content", icon: LayoutDashboard, tab: "homepage", tone: "blue" },
    { title: "Manage programs", detail: "Add or edit academic programs", icon: GraduationCap, tab: "academics", tone: "gold" },
    { title: "Post news", detail: "Create and publish news or events", icon: BookOpen, tab: "news-events", tone: "blue" },
    { title: "Review enquiries", detail: "View and manage admission enquiries", icon: Users, tab: "admissions", tone: "gold" },
  ].filter(action => canViewTab(user, action.tab));
  return <div className="admin-overview">
    <div className="admin-page-intro"><div><h1>{greeting}, Admin</h1><p>Here’s what’s happening across your university website.</p></div></div>
    <div className="admin-metrics">{metrics.map(metric => <div className="admin-metric admin-panel" key={metric.label}>
      <span className={`admin-icon-circle ${metric.tone}`}><metric.icon size={29} /></span>
      <div><strong>{metric.value}</strong><h2>{metric.label}</h2><p>{metric.detail}</p></div>
    </div>)}</div>
    <div className="admin-overview-grid">
      {can("enquiries") && <section className="admin-panel admin-enquiries"><div className="admin-panel-heading"><h2><Users size={23} /> Recent admission enquiries</h2><button type="button" onClick={() => onNavigate("admissions")}>View all enquiries <ArrowRight size={16} /></button></div>
        <div className="admin-table-scroll"><table><thead><tr><th>Applicant</th><th>Program</th><th>Received</th><th>Status</th><th>Contact</th></tr></thead><tbody>
          {enquiries.slice(0, 5).map((lead, index) => <tr key={lead.id}>
            <td><div className="admin-applicant"><span className={`admin-initial ${index % 2 ? "gold" : "blue"}`}>{lead.name?.charAt(0).toUpperCase() || "?"}</span><div><strong>{lead.name}</strong><small>{lead.city}</small></div></div></td>
            <td>{lead.program}</td><td className="admin-nowrap">{lead.date}</td><td><span className={`admin-status status-${(lead.status || "New").toLowerCase()}`}>{lead.status || "New"}</span></td><td>{lead.mobile}</td>
          </tr>)}
        </tbody></table>{enquiries.length === 0 && <div className="admin-empty"><Users size={30} /><strong>No enquiries yet</strong><p>New admission enquiries will appear here.</p></div>}</div>
      </section>}
      {can("settings") && <section className="admin-panel admin-readiness"><div className="admin-panel-heading"><h2><ShieldCheck size={23} /> Website setup</h2><button type="button" onClick={() => onNavigate("settings")} aria-label="Review website setup"><ArrowRight size={17} /></button></div>
        <div className="admin-progress" style={{ "--progress": `${percent}%` } as React.CSSProperties}><div><strong>{configured}/{checks.length}</strong><span>Configured</span></div></div>
        <p className="admin-readiness-caption">{configured === checks.length ? "Your essential website details are in place." : "Complete your essential website details."}</p>
        <div className="admin-checks">{checks.filter(check => canViewTab(user, check.tab)).map(check => <button type="button" key={check.label} onClick={() => onNavigate(check.tab)}><CheckCircle2 size={19} className={check.ready ? "is-ready" : "needs-setup"} /><span>{check.label}</span><ChevronRight size={16} /></button>)}</div>
      </section>}
    </div>
    <section className="admin-panel admin-quick-actions"><div className="admin-panel-heading"><h2><LayoutDashboard size={22} /> Quick actions</h2>{can("pages") && <button type="button" onClick={() => onNavigate("pages")}>Manage website <ArrowRight size={16} /></button>}</div>
      <div className="admin-quick-grid">{quick.map(action => <button type="button" key={action.title} onClick={() => onNavigate(action.tab)}><span className={`admin-icon-circle ${action.tone}`}><action.icon size={28} /></span><span><strong>{action.title}</strong><small>{action.detail}</small></span><ChevronRight size={17} /></button>)}</div>
      <div className="admin-overview-footer"><div>{can("homepage") && <><button type="button" onClick={() => onHomeSection("placements")}>Placement stories <ArrowRight size={14} /></button><button type="button" onClick={() => onHomeSection("virtualTour")}>Admissions & map <ArrowRight size={14} /></button></>}</div><span>{lastSavedTime ? "Last saved: " + lastSavedTime : "Use each editor’s save action to publish updates."}</span></div>
    </section>
  </div>;
}

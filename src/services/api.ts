// ═══════════════════════════════════════════════
// API service layer — Chalapathi University
// ═══════════════════════════════════════════════
//
// Placeholder service module for future backend
// integration (REST/GraphQL). Currently returns
// static data from the `data/` modules.

import { schools } from "@/data/schools";
import { newsItems, upcomingEvents } from "@/data/news";
import { stats } from "@/data/stats";
import { accreditationBadges } from "@/data/badges";

/**
 * Fetch all schools. In production, this would call
 * an API endpoint like GET /api/schools.
 */
export async function getSchools() {
  // TODO: Replace with actual API call
  return schools;
}

/**
 * Fetch a single school by slug.
 */
export async function getSchoolBySlug(slug: string) {
  return schools.find((s) => s.slug === slug) ?? null;
}

/**
 * Fetch latest news items dynamically from saved CMS or fallback.
 */
export async function getNews(limit?: number) {
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem("chalapathi_news_v3");
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) return limit ? parsed.slice(0, limit) : parsed;
      }
    } catch (_) {}
  }
  return limit ? newsItems.slice(0, limit) : newsItems;
}

/**
 * Fetch upcoming events dynamically from saved CMS or fallback.
 */
export async function getEvents(limit?: number) {
  if (typeof window !== "undefined") {
    try {
      const local = localStorage.getItem("chalapathi_events_v3");
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) return limit ? parsed.slice(0, limit) : parsed;
      }
    } catch (_) {}
  }
  return limit ? upcomingEvents.slice(0, limit) : upcomingEvents;
}

/**
 * Fetch university stats.
 */
export async function getStats() {
  return stats;
}

/**
 * Fetch accreditation badges.
 */
export async function getBadges() {
  return accreditationBadges;
}

/**
 * Submit a contact form inquiry.
 */
export async function submitContactForm(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit contact form');
    }
    
    return { success: true, message: "Thank you! We will get back to you shortly." };
  } catch (error) {
    console.error('Error in submitContactForm:', error);
    return { success: false, message: "Something went wrong. Please try again." };
  }
}

/**
 * Submit an admission application.
 */
export async function submitApplication(data: Record<string, unknown>) {
  try {
    const response = await fetch('/api/admissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit application');
    }
    
    const result = await response.json();
    return { success: true, applicationId: result.applicationId };
  } catch (error) {
    console.error('Error in submitApplication:', error);
    return { success: false, applicationId: "ERROR" };
  }
}

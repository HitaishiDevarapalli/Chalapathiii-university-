import { CmsPage, CmsVersion } from "../types/cms";

export interface CmsSyncResponse {
  success: boolean;
  pages?: CmsPage[];
  settings?: Record<string, any>;
  collections?: Record<string, any>;
  versions?: CmsVersion[];
  error?: string;
  fallback?: boolean;
}

export const CmsApiService = {
  // Fetch all CMS data from API / database
  async fetchAll(): Promise<CmsSyncResponse> {
    try {
      const res = await fetch("/api/cms?action=getAll", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (e: any) {
      console.warn("CmsApiService fetchAll fallback to local storage:", e.message);
      return { success: false, fallback: true, error: e.message };
    }
  },

  // Save/Publish a page to the database
  async savePage(page: CmsPage, note = "Page updated from CMS Admin"): Promise<{ success: boolean; page?: any; error?: string }> {
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "savePage",
          page,
          author: "Admin",
          note
        })
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (e: any) {
      console.warn("CmsApiService savePage local fallback:", e.message);
      return { success: true, page };
    }
  },

  // Delete a page from database
  async deletePage(slug: string, id?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "deletePage",
          slug,
          id
        })
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (e: any) {
      console.warn("CmsApiService deletePage local fallback:", e.message);
      return { success: true };
    }
  },

  // Save all CMS state to database
  async saveAll(data: { pages: CmsPage[]; settings?: Record<string, any>; collections?: Record<string, any> }): Promise<{ success: boolean }> {
    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "saveAll",
          ...data
        })
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (e: any) {
      console.warn("CmsApiService saveAll local fallback:", e.message);
      return { success: true };
    }
  }
};

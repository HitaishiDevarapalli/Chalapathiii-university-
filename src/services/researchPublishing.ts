import { useEffect, useState } from "react";
import { normalizeResearchData, ResearchCMSData } from "../data/researchData";
import { safeGetItem, safeSetItem } from "../lib/safeStorage";
const STORAGE_KEY = "chalapathi_research_cms_data";
const ENDPOINT = "/api/config/researchContent";
export function readResearchDraft(): ResearchCMSData {
  try { return normalizeResearchData(JSON.parse(safeGetItem(STORAGE_KEY) || "null")); }
  catch { return normalizeResearchData(null); }
}
export async function readPublishedResearch(): Promise<ResearchCMSData | null> {
  const response = await fetch(`${ENDPOINT}?raw=true`, { credentials: "same-origin", cache: "no-store" });
  if (response.status === 404) return null;
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || "Unable to load research content. Please retry.");
  if (!data || !Array.isArray(data.items)) throw new Error("The research server returned invalid content.");
  return normalizeResearchData(data);
}
export async function publishResearch(data: ResearchCMSData): Promise<ResearchCMSData> {
  const saved = normalizeResearchData(data);
  const response = await fetch(ENDPOINT, { method: "PUT", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(saved) });
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.error || "Research could not be published. Sign in and try again.");
  if (!result?.value || JSON.stringify(result.value) !== JSON.stringify(saved)) throw new Error("The server did not confirm the research changes. Please retry.");
  safeSetItem(STORAGE_KEY, JSON.stringify(saved));
  window.dispatchEvent(new Event("research-published"));
  return saved;
}
export function usePublishedResearch() {
  // Public visitors read published server content, never an administrator's browser draft.
  const [data, setData] = useState(() => normalizeResearchData(null));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true, pending = false;
    const refresh = async () => {
      if (pending) return;
      pending = true;
      try {
        const next = await readPublishedResearch() || normalizeResearchData(null);
        if (active) { setData(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next); setError(""); }
      } catch (err) { if (active) setError(err instanceof Error ? err.message : "Research content is temporarily unavailable."); }
      finally { pending = false; if (active) setLoading(false); }
    };
    void refresh();
    window.addEventListener("focus", refresh); window.addEventListener("research-published", refresh);
    const interval = window.setInterval(() => { if (!document.hidden) void refresh(); }, 15000);
    return () => { active = false; clearInterval(interval); window.removeEventListener("focus", refresh); window.removeEventListener("research-published", refresh); };
  }, []);
  return { data, loading, error };
}

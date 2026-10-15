import { useEffect, useState } from "react";
import type { PopupCMSData, PopupItem } from "../components/admin/PopupCMS";
import { durableImage } from "./contentApi";

const KEY = "popupConfig";
export const EMPTY_POPUPS: PopupCMSData = { masterEnabled: false, activePopupId: "", popups: [] };
export function validatePopupConfig(data: any): PopupCMSData {
  if (!data || typeof data.masterEnabled !== "boolean" || typeof data.activePopupId !== "string" ||
      !Array.isArray(data.popups) || data.popups.some((p: any) => !p || typeof p.id !== "string" || typeof p.title !== "string" || !["enquiry", "event", "banner", "custom"].includes(p.type))) {
    throw new Error("The server returned invalid popup settings.");
  }
  return data;
}
export function selectActivePopup(data: PopupCMSData): PopupItem | null {
  return data.masterEnabled ? data.popups.find(p => p.id === data.activePopupId && p.enabled === true) || null : null;
}
export async function readPopupConfig(): Promise<PopupCMSData | null> {
  const response = await fetch(`/api/config/${KEY}?raw=true`, { cache: "no-store", credentials: "same-origin" });
  if (response.status === 404) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Could not load published popup settings.");
  return validatePopupConfig(data);
}
export async function publishPopupConfig(config: PopupCMSData): Promise<PopupCMSData> {
  validatePopupConfig(config);
  const saved = { ...config, popups: await Promise.all(config.popups.map(async p => ({ ...p, image: await durableImage(p.image || ""), ...(p.enquiryConfig ? { enquiryConfig: { ...p.enquiryConfig, ...(p.enquiryConfig.logoUrl ? { logoUrl: await durableImage(p.enquiryConfig.logoUrl) } : {}) } } : {}) }))) };
  const response = await fetch(`/api/config/${KEY}`, {
    method: "PUT", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(saved)
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Publishing failed. Sign in and try again.");
  }
  const published = await readPopupConfig();
  if (JSON.stringify(published) !== JSON.stringify(saved)) throw new Error("The server did not confirm your popup changes. Please retry.");
  window.dispatchEvent(new Event("popup-published"));
  return saved;
}
export function usePublishedPopupConfig() {
  const [config, setConfig] = useState(EMPTY_POPUPS);
  useEffect(() => {
    let active = true;
    let pending = false;
    const refresh = async () => {
      if (pending) return;
      pending = true;
      try {
        const next = await readPopupConfig() || EMPTY_POPUPS;
        if (active) setConfig(previous => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
      } catch (error) { console.error("Popup could not be loaded", error); }
      finally { pending = false; }
    };
    void refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("popup-published", refresh);
    const timer = window.setInterval(refresh, 15000);
    return () => { active = false; clearInterval(timer); window.removeEventListener("focus", refresh); window.removeEventListener("popup-published", refresh); };
  }, []);
  return config;
}

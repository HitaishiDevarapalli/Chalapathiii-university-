/**
 * Resilient localStorage wrapper that handles quota limits, prevents DOMException crashes,
 * and notifies active pages via custom events and storage events.
 */

export function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    notifyStorageChange(key);
    return true;
  } catch (err: any) {
    console.warn(`[SafeStorage] Error setting ${key}, attempting cleanup...`, err);
    try {
      // Clean up known legacy or redundant keys to free up quota
      const keysToClean = [
        "chalapathi_news",
        "chalapathi_events",
        "chalapathi_campus_cards"
      ];
      for (const k of keysToClean) {
        if (k !== key) {
          try { localStorage.removeItem(k); } catch (_) {}
        }
      }
      localStorage.setItem(key, value);
      notifyStorageChange(key);
      return true;
    } catch (innerErr) {
      console.error(`[SafeStorage] Failed to set ${key} even after cleanup:`, innerErr);
      // Still notify in-memory listeners so active views stay in sync
      notifyStorageChange(key);
      return false;
    }
  }
}

export function safeGetItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch (err) {
    console.warn(`[SafeStorage] Error getting ${key}:`, err);
    return null;
  }
}

export function notifyStorageChange(key?: string) {
  try {
    window.dispatchEvent(new CustomEvent("chalapathi_cms_updated", { detail: { key } }));
    window.dispatchEvent(new Event("storage"));
  } catch (_) {}
}

// ═══════════════════════════════════════════════
// General utility functions
// ═══════════════════════════════════════════════

export type ClassValue = ClassArray | ClassDictionary | string | number | null | boolean | undefined;
export type ClassDictionary = Record<string, unknown>;
export type ClassArray = ClassValue[];

/**
 * Merge CSS/Tailwind classes cleanly without external dependencies.
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  for (const arg of inputs) {
    if (!arg) continue;
    if (typeof arg === "string" || typeof arg === "number") {
      classes.push(String(arg));
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = cn(...arg);
        if (inner) classes.push(inner);
      }
    } else if (typeof arg === "object") {
      for (const [key, val] of Object.entries(arg)) {
        if (val) classes.push(key);
      }
    }
  }
  return classes.join(" ");
}

/**
 * Format a number with commas (e.g. 30000 → "30,000")
 */
export function formatNumber(n: number): string {
  return n.toLocaleString("en-IN");
}

/**
 * Slugify a string (e.g. "School of Engineering" → "school-of-engineering")
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Truncate text to a max length with ellipsis.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/**
 * Automatically compress and scale images using HTML5 Canvas to prevent LocalStorage QuotaExceeded errors.
 * Reduces 5MB-10MB images down to ~60KB - 180KB with crisp quality.
 */
export async function compressImage(
  fileOrDataUrl: File | string,
  maxWidth = 1600,
  maxHeight = 1200,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve) => {
    // If it's already a small SVG or non-data URL, return as-is
    if (typeof fileOrDataUrl === "string") {
      if (!fileOrDataUrl.startsWith("data:image/") || fileOrDataUrl.startsWith("data:image/svg+xml")) {
        return resolve(fileOrDataUrl);
      }
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      // Calculate scaled dimensions
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, width);
      canvas.height = Math.max(1, height);

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        if (typeof fileOrDataUrl === "string") {
          return resolve(fileOrDataUrl);
        }
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || "");
        reader.readAsDataURL(fileOrDataUrl as File);
        return;
      }

      // Smooth resizing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      // Determine output format (JPEG for photos for max compression)
      try {
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      } catch (err) {
        console.warn("Canvas compression fallback:", err);
        if (typeof fileOrDataUrl === "string") {
          resolve(fileOrDataUrl);
        } else {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string) || "");
          reader.readAsDataURL(fileOrDataUrl as File);
        }
      }
    };

    img.onerror = () => {
      if (typeof fileOrDataUrl === "string") {
        resolve(fileOrDataUrl);
      } else {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || "");
        reader.readAsDataURL(fileOrDataUrl as File);
      }
    };

    if (typeof fileOrDataUrl === "string") {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = (e.target?.result as string) || "";
      };
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}

/**
 * Safe LocalStorage setter that catches QuotaExceededError and prevents saving crashes.
 */
export function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.warn(`[Storage] Failed to save key "${key}" to localStorage (quota or disabled):`, e);
    try {
      const keysToClean = [
        "chalapathi_news_v3",
        "chalapathi_events_v3",
        "chalapathi_about_v2",
        "chalapathi_last_saved"
      ];
      for (const k of keysToClean) {
        if (k !== key) {
          localStorage.removeItem(k);
        }
      }
      localStorage.setItem(key, value);
      return true;
    } catch (innerErr) {
      console.error(`[Storage] Quota still exceeded after cleanup for "${key}":`, innerErr);
      return false;
    }
  }
}

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

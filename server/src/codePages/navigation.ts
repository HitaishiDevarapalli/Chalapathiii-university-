// Shared by the response CSP and both iframe attributes. Never grant same-origin.
// Clicked navigation and external submissions are explicitly supported; uploaded
// scripts still cannot read portal storage, cookies, DOM or privileged APIs.
export const CODE_PAGE_SANDBOX =
  "allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation";

export type NavigationContext = {
  base: string;
  route: string;
  file: string;
  paths: string[];
  preview: boolean;
};

// Self-contained: this exact resolver also runs in the frame for dynamic links.
export function resolveNavigation(
  value: string,
  context: NavigationContext,
  form = false,
): { href: string; target: string } | null {
  const raw = value.trim();
  if (!raw) return null;
  if (!form && raw.startsWith("#")) return { href: raw, target: "_self" };
  try {
    const base = new URL(context.base);
    const packaged = new URL(raw, new URL(context.file, base));
    if (!form && packaged.origin === base.origin &&
        (packaged.pathname.startsWith(base.pathname) || raw.startsWith("/"))) {
      const candidate = decodeURIComponent(
        packaged.pathname.startsWith(base.pathname)
          ? packaged.pathname.slice(base.pathname.length)
          : packaged.pathname.slice(1),
      );
      const directory = candidate.replace(/\/$/, "");
      const index = (directory ? directory + "/" : "") + "index.html";
      const file = context.paths.includes(candidate)
        ? candidate
        : context.paths.includes(index)
          ? index
          : null;
      if (file) {
        const url = new URL(file.split("/").map(encodeURIComponent).join("/"), base);
        url.search = packaged.search;
        url.hash = packaged.hash;
        return { href: url.href, target: "_self" };
      }
    }
    const url = new URL(raw, context.route);
    if (!form && ["mailto:", "tel:"].includes(url.protocol))
      return { href: url.href, target: "_blank" };
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    // Forms must use HTTPS, except on the same HTTP origin during local testing.
    if (form && url.protocol !== "https:" &&
        !(url.origin === base.origin && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)))
      return null;
    return {
      href: url.href,
      target: form || context.preview || url.origin !== base.origin ? "_blank" : "_top",
    };
  } catch {
    return null;
  }
}

import React, { createContext, useContext, useEffect, useRef } from "react";

export interface AdminIdentity {
  id: number; username: string; email?: string; role: string; roleName?: string;
  permissions: string[]; totpEnabled?: boolean; credentialMode?: string;
}
export function canAccess(user: AdminIdentity | null, module: string, action = "view") {
  return !!user && (user.role === "superadmin" || user.permissions?.includes(module + "." + action));
}
export function canViewTab(user: AdminIdentity | null, tab: string) {
  const grouped: Record<string, string[]> = { "news-events": ["news", "events", "announcements"], admissions: ["admissions", "enquiries", "applications"],
    security: ["security", "users", "roles", "google", "mfa", "audit", "sessions"] };
  return (grouped[tab] || [tab]).some(module => canAccess(user, module));
}
export const AdminAccessContext = createContext<AdminIdentity | null>(null);
export const useAdminAccess = () => { const user = useContext(AdminAccessContext); return { user, can: (module: string, action = "view") => canAccess(user, module, action) }; };

// Existing CMS fetch callers keep their URLs, payloads, return values and error behavior.
// Only same-origin API mutations receive a session-bound CSRF header.
export function installAdminRequestProtection() {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const request = input instanceof Request ? input : null;
    const url = new URL(request?.url || String(input), location.href);
    const method = (init?.method || request?.method || "GET").toUpperCase();
    if (url.origin !== location.origin || !url.pathname.startsWith("/api/") || ["GET", "HEAD", "OPTIONS"].includes(method)) return nativeFetch(input, init);
    const result = await nativeFetch("/api/auth/csrf", { credentials: "same-origin", cache: "no-store" });
    if (!result.ok) throw new Error("Unable to verify this request. Reload and retry.");
    const { csrfToken } = await result.json();
    const headers = new Headers(init?.headers || request?.headers);
    if (csrfToken) headers.set("X-CSRF-Token", csrfToken);
    return nativeFetch(input, { ...init, headers, credentials: init?.credentials || request?.credentials || "same-origin" });
  };
}

export function AdminActionGuard({ module, children }: { module: string; children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null); const { user, can } = useAdminAccess();
  useEffect(() => {
    if (!root.current || user?.role === "superadmin" || module === "security") return;
    const scan = () => {
      root.current?.querySelectorAll<HTMLButtonElement>("button").forEach(button => {
        const scope = button.closest<HTMLElement>("[data-admin-module]")?.dataset.adminModule || module;
        const label = ((button.textContent || "") + " " + button.title + " " + button.getAttribute("aria-label")).toLowerCase();
        let action = button.dataset.adminAction;
        if (!action) {
          if (/delete|remove|clear|trash/.test(label)) action = "delete";
          else if (/export|download|backup/.test(label)) action = "export";
          else if (/restore|reset|sync all/.test(label)) action = "manage";
          else if (/save|publish|approve|visible|hidden|hide page|show page|category:/.test(label)) action = "publish";
          else if (/add |create |new |duplicate|browse|upload/.test(label)) action = scope === "gallery" ? "create" : "create";
          else if (/edit|move up|move down|reorder|enable|disable/.test(label)) action = "edit";
        }
        if (action && !can(scope, action)) button.setAttribute("data-admin-denied", "true");
        else button.removeAttribute("data-admin-denied");
      });
      root.current?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("input, textarea, select").forEach(input => {
        const scope = input.closest<HTMLElement>("[data-admin-module]")?.dataset.adminModule || module;
        const search = input.type === "search" || /search|filter/.test((input.getAttribute("placeholder") || "").toLowerCase()) || !!input.closest("[data-admin-filter]");
        const allowed = search || can(scope, "edit") || can(scope, "create");
        if (!allowed) { input.setAttribute("data-admin-readonly", "true"); if ("readOnly" in input) input.readOnly = true; else input.disabled = true; }
      });
    };
    scan();
    const observer = new MutationObserver(scan); observer.observe(root.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [module, user]);
  return <div ref={root} className="admin-action-scope">{children}</div>;
}

export async function securityRequest(path: string, method = "GET", body?: unknown) {
  const response = await fetch("/api/" + path, { method, credentials: "same-origin", cache: "no-store",
    headers: body === undefined ? {} : { "Content-Type": "application/json" }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(data.error || "The request could not be completed."), { status: response.status });
  return data;
}
export const formatIST = (value?: string | null) => value ? new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(value)) + " IST" : "—";

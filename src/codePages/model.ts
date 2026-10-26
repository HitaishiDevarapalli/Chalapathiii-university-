export type Integration = {
  mode: "page" | "navigation" | "submenu" | "footer" | "replace" | "homepage";
  route: string;
  label: string;
  parent: string;
  position: number;
  visible: boolean;
  layout: "global" | "standalone";
};
export type Seo = {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  image: string;
  noindex: boolean;
  sitemap: boolean;
};
export type CodeFile = {
  path: string;
  mime: string;
  size: number;
  hash: string;
  source?: string;
};
export type CodeDocument = {
  name: string;
  description: string;
  integration: Integration;
  seo: Seo;
  package: {
    entry: string;
    originalName: string;
    files: CodeFile[];
    totalBytes: number;
  };
  validation: { errors: string[]; warnings: string[] };
};
export type CodeRecord = {
  id: string;
  revision: number;
  stage: string;
  liveRoute: string | null;
  publishedVersionId: string | null;
  publishedAt: string | null;
  updatedAt: string;
  createdAt: string;
  uploadedBy: string;
  document: CodeDocument;
};
export type CodeVersion = {
  id: string;
  revision: number;
  kind: string;
  author: string;
  createdAt: string;
  name: string;
  files: CodeFile[];
  integration: Integration;
};
export type PublicCodePage = {
  id: string;
  versionId: string;
  name: string;
  route: string;
  contentUrl: string;
  seo: Seo;
  integration: Integration;
};
export const newSettings = (name: string) => ({
  name,
  description: "",
  integration: {
    mode: "page",
    route:
      "/" +
      (name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "") || "new-page"),
    label: name,
    parent: "Main Menu",
    position: 0,
    visible: true,
    layout: "global",
  },
  seo: {
    title: "",
    description: "",
    canonical: "",
    ogTitle: "",
    ogDescription: "",
    image: "",
    noindex: false,
    sitemap: true,
  },
});
export async function codeApi<T = any>(
  path = "",
  method = "GET",
  body?: unknown,
): Promise<T> {
  const response = await fetch("/api/code-pages" + path, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    headers: body === undefined ? {} : { "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok)
    throw new Error(
      data.error || "Unable to complete this code page operation",
    );
  return data;
}
export async function uploadCode(
  id: string,
  revision: number,
  file: File,
  progress: (n: number) => void,
): Promise<CodeRecord> {
  const csrf = await fetch("/api/auth/csrf", {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!csrf.ok) throw new Error("Your session expired. Sign in and retry.");
  const { csrfToken } = await csrf.json();
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/code-pages/${id}/upload`);
    xhr.withCredentials = true;
    xhr.timeout = 120000;
    xhr.setRequestHeader("X-CSRF-Token", csrfToken);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) progress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onerror = () =>
      reject(
        new Error("Upload interrupted. Your existing draft is unchanged."),
      );
    xhr.ontimeout = () =>
      reject(new Error("Upload timed out. Reload the page before retrying."));
    xhr.onload = () => {
      let data;
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        reject(new Error("Server returned an invalid upload response"));
        return;
      }
      if (xhr.status >= 200 && xhr.status < 300) resolve(data);
      else reject(new Error(data.error || "Upload failed"));
    };
    const form = new FormData();
    form.append("revision", String(revision));
    form.append("file", file);
    xhr.send(form);
  });
}
export const bytes = (n: number) =>
  n >= 1048576
    ? `${(n / 1048576).toFixed(1)} MB`
    : `${Math.max(1, Math.round(n / 1024))} KB`;

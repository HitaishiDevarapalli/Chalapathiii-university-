export type AcademicDegree = "btech" | "mtech";
export type AcademicDocumentCategory = "syllabus" | "regulations";
export interface AcademicDocument {
  id: string;
  title: string;
  degree: AcademicDegree;
  category: AcademicDocumentCategory;
  originalName: string;
  size: number;
  url: string;
  createdAt: string;
  updatedAt: string;
}
export const degreeLabels = { btech: "BTech", mtech: "MTech" };
export const categoryLabels = { syllabus: "Syllabus", regulations: "Regulations" };
export const academicDocumentPath = (degree: AcademicDegree, category: AcademicDocumentCategory) => `/academics/documents/${degree}/${category}`;
export const documentSize = (size: number) => size >= 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(size / 1024))} KB`;

export async function readAcademicDocuments(degree?: AcademicDegree, category?: AcademicDocumentCategory): Promise<AcademicDocument[]> {
  const query = new URLSearchParams();
  if (degree) query.set("degree", degree);
  if (category) query.set("category", category);
  const response = await fetch(`/api/academic-documents?${query}`, { cache: "no-store", credentials: "same-origin" });
  const data = await response.json().catch(() => null);
  if (!response.ok || !Array.isArray(data)) throw new Error(data?.error || "Documents could not be loaded. Please retry.");
  return data;
}

export async function saveAcademicDocument(input: { title: string; degree: AcademicDegree; category: AcademicDocumentCategory; file?: File; id?: string }, onProgress: (progress: number) => void): Promise<AcademicDocument> {
  if (input.file) {
    if (!input.file.name.toLowerCase().endsWith(".pdf")) throw new Error("Choose a PDF document.");
    if (!input.file.size) throw new Error("This file is empty. Choose a PDF document.");
  }
  const csrf = await fetch("/api/auth/csrf", { credentials: "same-origin", cache: "no-store" });
  const token = await csrf.json().catch(() => ({}));
  if (!csrf.ok || !token.csrfToken) throw new Error("Sign in again to upload documents.");
  const body = new FormData();
  body.set("title", input.title.trim());
  body.set("degree", input.degree);
  body.set("category", input.category);
  if (input.file) body.set("file", input.file);
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open(input.id ? "PUT" : "POST", `/api/academic-documents${input.id ? `/${input.id}` : ""}`);
    request.withCredentials = true;
    request.setRequestHeader("X-CSRF-Token", token.csrfToken);
    request.timeout = 10 * 60 * 1000;
    request.upload.onprogress = event => { if (event.lengthComputable) onProgress(Math.min(99, Math.round(event.loaded / event.total * 100))); };
    request.onload = () => {
      let result: any;
      try { result = JSON.parse(request.responseText); } catch { result = {}; }
      if (request.status >= 200 && request.status < 300 && result.id && result.url) {
        onProgress(100);
        window.dispatchEvent(new Event("academic-documents-updated"));
        resolve(result);
      } else reject(new Error(result.error || (request.status === 413 ? "This PDF exceeds the upload limit." : "Document was not saved. Please retry.")));
    };
    request.onerror = () => reject(new Error("Connection lost. Reload the document list to check whether the upload completed."));
    request.ontimeout = () => reject(new Error("The upload timed out. Reload the document list before retrying."));
    request.send(body);
  });
}

export async function deleteAcademicDocument(id: string) {
  const response = await fetch(`/api/academic-documents/${id}`, { method: "DELETE", credentials: "same-origin" });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || "Document could not be removed.");
  }
  window.dispatchEvent(new Event("academic-documents-updated"));
}

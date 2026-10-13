type Collection = "news" | "events";
async function json(response: Response) {
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.error || `Server request failed (${response.status})`);
  return data;
}
export async function readContent(kind: Collection, admin = false) {
  const response = await fetch(`/api/${kind}${admin ? "?admin=true" : ""}`, { cache: "no-store", credentials: "same-origin" });
  const items = await json(response);
  if (!Array.isArray(items)) throw new Error("The content server returned an invalid response");
  return { items, revision: response.headers.get("X-Content-Revision") || "" };
}
async function durableImage(url: string) {
  if (!url?.startsWith("data:") && !url?.startsWith("blob:")) return url;
  const blob = await (await fetch(url)).blob();
  const form = new FormData();
  const extension = blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg";
  form.append("file", blob, `photo.${extension}`);
  const result = await json(await fetch("/api/upload", { method: "POST", body: form, credentials: "same-origin" }));
  if (!result?.url) throw new Error("Photo upload failed");
  return result.url;
}
export async function saveContent(kind: Collection, items: any[], revision?: string) {
  if (!revision) throw new Error("Content has not loaded from the server. Sign in and reload before saving.");
  const durable = [];
  for (const item of items) {
    durable.push({ ...item, image: await durableImage(item.image || ""),
      images: await Promise.all((item.images || []).map(durableImage)) });
  }
  return json(await fetch(`/api/${kind}/sync`, {
    method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ [kind === "news" ? "articles" : "events"]: durable, revision })
  }));
}
export async function readNewsConfig() {
  const configs = await json(await fetch("/api/config", { cache: "no-store", credentials: "same-origin" }));
  return configs.newsPageConfig;
}
export async function saveNewsConfig(config: any) {
  const saved = { ...config, featuredCarouselImages: await Promise.all((config.featuredCarouselImages || []).map(durableImage)) };
  await json(await fetch("/api/config/newsPageConfig", {
    method: "PUT", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(saved)
  }));
  return saved;
}

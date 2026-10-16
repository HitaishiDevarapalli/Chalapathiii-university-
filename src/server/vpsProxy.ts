// Historical serverless CMS routes delegate to the same authenticated VPS API.
// They must never provide an alternative unprotected database write path.
export async function forwardVpsApi(req: any, res: any, resource: string) {
  try {
    const origin = new URL(process.env.VPS_API_ORIGIN || "https://chalapathiuniversity.edu.in");
    if (process.env.NODE_ENV === "production" && origin.protocol !== "https:") return res.status(503).json({ error: "Secure API origin is required" });
    const target = new URL("/api/" + resource, origin);
    for (const [key, value] of Object.entries(req.query || {})) if (key !== "key" && value !== undefined) target.searchParams.set(key, String(value));
    const method = String(req.method || "GET");
    const headers: Record<string, string> = {};
    for (const key of ["cookie", "origin", "x-csrf-token", "user-agent", "sec-fetch-site"]) if (typeof req.headers[key] === "string") headers[key] = req.headers[key];
    if (!["GET", "HEAD", "OPTIONS"].includes(method)) headers["Content-Type"] = "application/json";
    const response = await fetch(target, { method, headers, redirect: "manual", ...(headers["Content-Type"] ? { body: JSON.stringify(req.body || {}) } : {}) });
    res.setHeader("Cache-Control", "no-store"); res.setHeader("Content-Type", response.headers.get("content-type") || "application/json");
    const cookies = response.headers.getSetCookie(); if (cookies.length) res.setHeader("Set-Cookie", cookies);
    return res.status(response.status).send(await response.text());
  } catch { return res.status(503).json({ error: "The authenticated university API is unavailable" }); }
}

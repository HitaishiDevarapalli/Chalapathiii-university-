import { forwardVpsApi } from "../src/server/vpsProxy";
export default function handler(req: any, res: any) { const key = req.query.key ? "/" + encodeURIComponent(String(req.query.key).replace(/^\//, "")) : ""; return forwardVpsApi(req, res, "config" + key); }

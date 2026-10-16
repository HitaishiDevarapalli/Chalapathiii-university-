import { forwardVpsApi } from "../src/server/vpsProxy";
export default function handler(req: any, res: any) { return forwardVpsApi(req, res, "cms"); }

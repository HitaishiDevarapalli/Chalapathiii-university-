#!/usr/bin/env python3
"""Resolve only the six known stash conflicts, preserving VPS stage-3 source.

Does not install packages, restart services, migrate a database, or drop the stash.
All anchors must match before any file is written. Default is a dry run.
"""
import argparse
import datetime
import os
from pathlib import Path
import re
import subprocess
import sys

FILES = (
    "server/src/index.ts",
    "server/src/routes/cms.ts",
    "server/src/routes/pages.ts",
    "server/src/security/apiPermissions.ts",
    "src/pages/AdminPortal.tsx",
    "src/security/adminAccess.tsx",
)


def replace_one(text, pattern, replacement, label, count=1):
    result, found = re.subn(pattern, replacement, text, flags=re.MULTILINE)
    if found != count:
        raise ValueError(f"{label}: expected {count} anchor(s), found {found}; no files changed")
    return result


def attach_middleware(text, code, label):
    return replace_one(text, r"(const\s+router\s*=\s*Router\(\)\s*;)", lambda m: m[1] + "\n" + code, label)


CMS_GUARD = r'''
// Keep legacy CMS writes out of the version-checked visual page workflow.
router.use((req, res, next) => {
  if (req.method !== "POST") return next();
  return requireBuilderAuth(req, res, () => { void (async () => {
    const body = req.body || {};
    if (body.action === "savePage" && body.page) {
      const page = body.page;
      const target = await prisma.cmsPage.findFirst({ where: { OR: [
        { slug: String(page.slug || "") }, { id: String(page.id || "") }
      ] } });
      if (page.type === "visual" || String(page.slug || "").startsWith("/pages/") || target?.type === "visual")
        return res.status(409).json({ error: "Use Page Builder to manage this page" });
    }
    if (body.action === "deletePage") {
      const target = await prisma.cmsPage.findFirst({ where: { OR: [
        { slug: String(body.slug || "") }, { id: String(body.id || "") }
      ] } });
      if (target?.type === "visual") return res.status(409).json({ error: "Use Page Builder to archive this page" });
    }
    if (body.action === "saveAll" && Array.isArray(body.pages)) {
      const managed = await prisma.cmsPage.findMany({ where: { type: "visual" }, select: { id: true, slug: true } });
      const ids = new Set(managed.map(p => p.id)); const slugs = new Set(managed.map(p => p.slug));
      req.body.pages = body.pages.filter((p: any) => p && p.type !== "visual" &&
        !String(p.slug || "").startsWith("/pages/") && !ids.has(p.id) && !slugs.has(p.slug));
    }
    next();
  })().catch(() => res.status(503).json({ error: "Page validation unavailable" })); });
});
'''

PAGES_GUARD = r'''
// Visual pages must use their own validated publication and revision API.
router.use((req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();
  return requireBuilderAuth(req, res, () => { void (async () => {
    const key = decodeURIComponent(req.path.split("/").filter(Boolean)[0] || "");
    const existing = key ? await prisma.cmsPage.findFirst({ where: { OR: [{ id: key }, { slug: key }] } }) : null;
    if (existing?.type === "visual" || req.body?.type === "visual" || String(req.body?.slug || "").startsWith("/pages/"))
      return res.status(409).json({ error: "Use Page Builder to manage visual pages" });
    next();
  })().catch(() => res.status(503).json({ error: "Page validation unavailable" })); });
});
'''


def transform(name, source):
    text = source.replace("\r\n", "\n")
    if re.search(r"^(<<<<<<<|=======|>>>>>>>)", text, re.MULTILINE):
        raise ValueError(f"{name}: saved VPS source already contains conflict markers")
    if name == FILES[0]:
        if "pageBuilderRoutes" not in text:
            text = replace_one(text, r"(import\s+cmsRoutes\s+from\s+['\"]\./routes/cms['\"]\s*;)", lambda m: m[1] + '\nimport pageBuilderRoutes from "./routes/pageBuilder";', name + " import")
            text = replace_one(text, r"(app\.use\(\s*['\"]/api/cms['\"]\s*,\s*cmsRoutes\s*\)\s*;)", lambda m: m[1] + '\napp.use("/api/page-builder", pageBuilderRoutes);', name + " mount")
        if not re.search(r'app\.use\(\s*[\'\"]/api/page-builder[\'\"]\s*,\s*pageBuilderRoutes', text):
            raise ValueError("Builder API mount could not be verified")
    elif name in (FILES[1], FILES[2]):
        if not re.search(r"import\s+prisma\s+from\s+['\"]\.\./prisma['\"]", text):
            raise ValueError(f"{name}: unsupported Prisma import; no files changed")
        if "requireBuilderAuth" not in text:
            text = 'import { requireAuth as requireBuilderAuth } from "../middleware/auth";\n' + text
            text = attach_middleware(text, CMS_GUARD if name == FILES[1] else PAGES_GUARD, name)
    elif name == FILES[3]:
        if not re.search(r'[\'\"]page-builder[\'\"]', text):
            text = replace_one(text, r"if\s*\(\s*\[([^\]]+)\]\.includes\(resource\)\s*\)\s*return next\(\);", lambda m: 'if ([' + m[1] + ', "page-builder"].includes(resource)) return next();', name + " router delegation")
    elif name == FILES[4]:
        if not re.search(r"import\s+React(?:\s*,|\s+from)", text):
            raise ValueError("AdminPortal must retain its existing React import")
        if "const PageBuilder = React.lazy" not in text:
            text = replace_one(text, r"(export\s+default\s+function\s+AdminPortal\s*\()", lambda m: 'const PageBuilder = React.lazy(() => import("../pageBuilder/PageBuilder"));\n\n' + m[1], name + " lazy editor")
        if '"page-builder" | "homepage"' not in text:
            text = replace_one(text, r"(['\"])pages\1\s*\|\s*(['\"])homepage\2", '"pages" | "page-builder" | "homepage"', name + " tab types", 2)
        if not re.search(r'id:\s*[\'\"]page-builder[\'\"]', text):
            text = replace_one(text, r"^(\s*)(\{\s*id:\s*['\"]pages['\"]\s*,\s*label:)", lambda m: m[1] + '{ id: "page-builder", label: "Page Builder", icon: Layers },\n' + m[1] + m[2], name + " sidebar")
            text = replace_one(text, r"item\.id\s*===\s*['\"]pages['\"]", '(item.id === "pages" || item.id === "page-builder")', name + " sidebar include")
            text = replace_one(text, r"item\.id\s*!==\s*['\"]pages['\"]", '(item.id !== "pages" && item.id !== "page-builder")', name + " sidebar exclude")
        if "<PageBuilder />" not in text:
            text = replace_one(text, r"(<AdminActionGuard\s+module=\{)([^}]+)(\}>)", lambda m: m[1] + 'activeTab === "page-builder" ? "pages" : (' + m[2] + ')' + m[3] + '\n          {activeTab === "page-builder" && <React.Suspense fallback={<div role="status">Loading Page Builder…</div>}><PageBuilder /></React.Suspense>}', name + " editor render")
    elif name == FILES[5]:
        if 'tab === "page-builder"' not in text:
            text = replace_one(text, r"(export\s+function\s+canViewTab\([^)]*\)\s*\{)", lambda m: m[1] + '\n  if (tab === "page-builder") return !!user && (user.role === "superadmin" || !!user.permissions?.includes("pages.view"));', name + " tab permissions")
    else:
        raise ValueError("Unsupported conflict file: " + name)
    if re.search(r"^(<<<<<<<|=======|>>>>>>>)", text, re.MULTILINE):
        raise ValueError("Conflict markers remain in " + name)
    return text


def git(*args):
    return subprocess.run(["git", *args], check=True, capture_output=True).stdout


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true", help="Back up and resolve verified conflicts")
    args = parser.parse_args()
    root = Path(git("rev-parse", "--show-toplevel").decode().strip()).resolve()
    os.chdir(root)
    conflicts = git("diff", "--name-only", "--diff-filter=U").decode().splitlines()
    if not conflicts:
        print("No unresolved files. No changes made.")
        return
    unknown = set(conflicts) - set(FILES)
    if unknown:
        raise ValueError("Unexpected conflicts need manual review: " + ", ".join(sorted(unknown)))
    prepared = {}
    saved = {}
    for name in conflicts:
        source = git("show", ":3:" + name).decode("utf-8")
        saved[name] = source
        prepared[name] = transform(name, source)
        print("Verified VPS-preserving integration:", name)
    if not args.apply:
        print("Dry run passed. Run with --apply to back up and resolve these files.")
        return
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%d-%H%M%S-%f")
    backup = Path.home() / "chalapathi-backups" / ("builder-conflicts-" + stamp)
    backup.mkdir(parents=True, mode=0o700)
    for name in conflicts:
        for label, data in (("conflicted", (root / name).read_bytes()), ("vps-saved", saved[name].encode("utf-8"))):
            dest = backup / label / name
            dest.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
            dest.write_bytes(data)
            dest.chmod(0o600)
    try:
        for name, data in prepared.items():
            (root / name).write_bytes(data.encode("utf-8"))
        subprocess.run(["git", "add", "--", *conflicts], check=True)
    except Exception:
        for name in conflicts:
            (root / name).write_bytes((backup / "conflicted" / name).read_bytes())
        raise
    print("Resolved", len(conflicts), "files. Backups:", backup)
    print("Your stash is retained. No service was restarted and no database migration was run.")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, subprocess.CalledProcessError, UnicodeError) as error:
        # Do not print source, environment variables, or command stderr.
        print("STOP:", str(error), file=sys.stderr)
        sys.exit(1)

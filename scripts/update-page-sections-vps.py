#!/usr/bin/env python3
"""Add section page editing to the current VPS portal without replacing its security code.

Dry run by default. --apply backs up and updates AdminPortal.tsx only.
Does not stage files, fetch, build, migrate a database, or restart services.
"""
import argparse
import datetime
import os
from pathlib import Path
import re
import subprocess
import sys

PORTAL = "src/pages/AdminPortal.tsx"


def replace_one(text, pattern, replacement, label):
    result, count = re.subn(pattern, replacement, text, flags=re.MULTILINE)
    if count != 1:
        raise ValueError(f"{label}: expected one anchor, found {count}; no files changed")
    return result


def transform(source):
    text = source.replace("\r\n", "\n")
    if re.search(r"^(<<<<<<<|=======|>>>>>>>)", text, re.MULTILINE):
        raise ValueError("Resolve the portal's merge conflicts first; no files changed")
    alias = 'import { SectionAwareSidebar as AdminSidebar } from "../pageBuilder/SectionAwareSidebar";'
    already = "SectionAwareSidebar as AdminSidebar" in text
    if not already:
        def import_sidebar(match):
            names = [name.strip() for name in match[1].split(",") if name.strip()]
            if names.count("AdminSidebar") != 1:
                raise ValueError("Unsupported AdminWorkspace import; no files changed")
            names.remove("AdminSidebar")
            return 'import { ' + ", ".join(names) + ' } from "../components/admin/AdminWorkspace";\n' + alias
        text = replace_one(text, r'import\s*\{([^}]+)\}\s*from\s*[\'"]\.\./components/admin/AdminWorkspace[\'"]\s*;', import_sidebar, "Sidebar import")
    if "const [sectionPageId, setSectionPageId]" not in text:
        text = replace_one(text, r'(const\s+\[activeTab,\s*setActiveTab\]\s*=\s*useState<[\s\S]*?>\([\'"]dashboard[\'"]\);)',
            lambda m: m[1] + '\n  const [sectionPageId, setSectionPageId] = useState("");\n  const [sectionPageOpenVersion, setSectionPageOpenVersion] = useState(0);', "Section state")
    if "const [sectionPageOpenVersion, setSectionPageOpenVersion]" not in text:
        raise ValueError("Incomplete section state; no files changed")

    # Only move this existing permission filter from navigation construction to
    # search. SectionAwareSidebar applies the same permissions to legacy modules.
    bounds = re.search(r"const orderedNavItems\s*=[\s\S]*?(?=\n\s*const navigateWorkspace)", text)
    if not bounds:
        raise ValueError("Navigation construction not recognized; no files changed")
    nav = bounds[0]
    permission_filter = r"\.filter\(\s*item\s*=>\s*canViewTab\(\s*adminIdentity\s*,\s*item\.id\s*\)\s*\)"
    if re.search(permission_filter, nav):
        nav = replace_one(nav, permission_filter, "", "Navigation permission filter")
        text = text[:bounds.start()] + nav + text[bounds.end():]
    elif not already:
        raise ValueError("Existing navigation permissions not recognized; no files changed")
    search = r"const searchResults\s*=\s*orderedNavItems"
    if re.search(search + r"\.flatMap", text):
        text = replace_one(text, "(" + search + r")(\.flatMap)",
            lambda m: m[1] + ".filter(item => canViewTab(adminIdentity, item.id))" + m[2], "Search permissions")
    elif not re.search(search + permission_filter + r"\.flatMap", text):
        raise ValueError("Search permissions not recognized; no files changed")

    if 'selectedPageId: activeTab === "page-builder" ? sectionPageId : ""' not in text:
        text = replace_one(text, r"(const sidebarProps\s*=\s*\{)",
            lambda m: m[1] + '\n    selectedPageId: activeTab === "page-builder" ? sectionPageId : "",\n    onOpenPage: (id: string) => { setSectionPageId(id); if (id) { setSectionPageOpenVersion(v => v + 1); setActiveTab("page-builder"); } },', "Sidebar page selection")
    if "<PageBuilder />" in text:
        text = replace_one(text, r"<PageBuilder\s*/>",
            '<PageBuilder key={sectionPageId ? `${sectionPageId}:${sectionPageOpenVersion}` : "builder"} initialPageId={sectionPageId} onReturnToPages={() => setSectionPageId("")} />', "Section content editor")
    required = [alias, "setSectionPageOpenVersion(v => v + 1)",
        'initialPageId={sectionPageId}', 'onReturnToPages={() => setSectionPageId("")}',
        'selectedPageId: activeTab === "page-builder" ? sectionPageId : ""']
    if any(text.count(marker) != 1 for marker in required):
        raise ValueError("Section integration could not be verified; no files changed")
    return text


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    root = Path(subprocess.check_output(["git", "rev-parse", "--show-toplevel"]).decode().strip()).resolve()
    os.chdir(root)
    if subprocess.check_output(["git", "ls-files", "--unmerged", "--", PORTAL]):
        raise ValueError("The portal has unresolved Git conflicts; no files changed")
    target = root / PORTAL
    original = target.read_bytes()
    prepared = transform(original.decode("utf-8")).encode("utf-8")
    if prepared == original:
        print("Section integration is already present. No changes needed.")
        return
    if not args.apply:
        print("Verified section integration. Run with --apply to back up and update the portal.")
        return
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%d-%H%M%S-%f")
    backup = Path.home() / "chalapathi-backups" / ("section-portal-" + stamp)
    backup.mkdir(parents=True, mode=0o700)
    saved = backup / "AdminPortal.tsx"
    saved.write_bytes(original)
    saved.chmod(0o600)
    try:
        target.write_bytes(prepared)
    except Exception:
        target.write_bytes(original)
        raise
    print("SECTION PORTAL UPDATED. Backup:", backup)
    print("Existing security code retained. No build, restart, migration, or Git staging was performed.")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, UnicodeError, subprocess.CalledProcessError) as error:
        print("STOP:", str(error), file=sys.stderr)
        sys.exit(1)

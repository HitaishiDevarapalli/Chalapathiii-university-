#!/usr/bin/env python3
"""Resolve a duplicated/rebased builder feature using its original source as base.

Only clean three-way results are accepted. Unknown overlaps leave all conflicts
untouched. The VPS commit and the saved local-edit stash are retained.
"""
import argparse
from pathlib import Path
import re
import subprocess
import sys
import tempfile

BUILDER_BASE = "602c35d93e9575cc4c31bdadf9998d4055126eff"


def git(*args, check=True):
    result = subprocess.run(["git", *args], capture_output=True)
    if check and result.returncode:
        raise ValueError("Git inspection failed: " + " ".join(args[:2]))
    return result


def normalize_portal(text):
    # These are equivalent expressions emitted by the previous VPS resolver.
    # Normalize their spelling, without changing the surrounding security logic.
    text = text.replace('item.id === "dashboard" || (item.id === "pages" || item.id === "page-builder")',
                        'item.id === "dashboard" || item.id === "pages" || item.id === "page-builder"')
    text = text.replace('item.id !== "dashboard" && (item.id !== "pages" && item.id !== "page-builder")',
                        'item.id !== "dashboard" && item.id !== "pages" && item.id !== "page-builder"')
    text = text.replace('activeTab === "page-builder" ? "pages" : (activeTab === "news-events" ? newsEventsModuleTab : activeTab)',
                        'activeTab === "news-events" ? newsEventsModuleTab : activeTab === "page-builder" ? "pages" : activeTab')
    text = text.replace('<div role="status">Loading Page Builder…</div>',
                        '<div role="status" className="admin-panel pb-empty">Loading Page Builder…</div>')
    return text


def merge_source(name, ours, base, theirs):
    normalized = []
    for value in (ours, base, theirs):
        text = value.decode("utf-8").replace("\r\n", "\n")
        if re.search(r"^(<<<<<<<|=======|>>>>>>>)", text, re.MULTILINE):
            raise ValueError(name + ": source already contains conflict markers")
        normalized.append(normalize_portal(text) if name == "src/pages/AdminPortal.tsx" else text)
    with tempfile.TemporaryDirectory(prefix="media-source-merge-") as directory:
        files = []
        for label, text in zip(("vps", "base", "github"), normalized):
            target = Path(directory) / label
            target.write_bytes(text.encode("utf-8"))
            files.append(str(target))
        result = git("merge-file", "-p", "-L", "VPS", "-L", "SHARED BUILDER", "-L", "GITHUB", *files, check=False)
    if result.returncode:
        raise ValueError(name + ": overlapping custom changes need review")
    return result.stdout


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--target", required=True)
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--backup-dir", type=Path)
    args = parser.parse_args()
    root = Path(git("rev-parse", "--show-toplevel").stdout.decode().strip()).resolve()
    target = git("rev-parse", args.target).stdout.decode().strip()
    merge_head = git("rev-parse", "--verify", "MERGE_HEAD", check=False)
    if merge_head.returncode or merge_head.stdout.decode().strip() != target:
        raise ValueError("Run only during the requested incoming merge")
    if git("merge-base", "--is-ancestor", BUILDER_BASE, target, check=False).returncode:
        raise ValueError("Incoming history does not contain the known original builder feature")
    logical_files = set(git("diff-tree", "--no-commit-id", "--name-only", "-r", BUILDER_BASE).stdout.decode().splitlines())
    conflicts = git("diff", "--name-only", "--diff-filter=U").stdout.decode().splitlines()
    prepared = {}
    originals = {}
    failures = []
    for name in conflicts:
        destination = (root / name).resolve()
        if not destination.is_relative_to(root) or (root / name).is_symlink():
            raise ValueError("Unsupported conflict path")
        originals[name] = destination.read_bytes() if destination.exists() else None
        theirs = git("show", ":3:" + name, check=False)
        if name.startswith("dist/"):
            # Generated files are rebuilt from the merged sources before publishing.
            prepared[name] = theirs.stdout if not theirs.returncode else None
            continue
        ours = git("show", ":2:" + name, check=False)
        base = git("show", BUILDER_BASE + ":" + name, check=False) if name in logical_files else git("show", ":1:" + name, check=False)
        if ours.returncode or base.returncode or theirs.returncode:
            failures.append(name + ": no supported three-way source base")
            continue
        try:
            prepared[name] = merge_source(name, ours.stdout, base.stdout, theirs.stdout)
            print("Verified VPS-preserving source merge:", name)
        except (ValueError, UnicodeError) as error:
            failures.append(str(error))
    if failures:
        raise ValueError("No conflict files changed. " + "; ".join(failures))
    if not args.apply:
        print("Dry run passed for", len(prepared), "conflicted files.")
        return
    if not args.backup_dir:
        raise ValueError("--backup-dir is required when applying")
    backup = args.backup_dir.resolve() / "merge-conflicts"
    backup.mkdir(parents=True, exist_ok=True, mode=0o700)
    for name, original in originals.items():
        if original is not None:
            saved = backup / name
            saved.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
            saved.write_bytes(original)
            saved.chmod(0o600)
    try:
        for name, data in prepared.items():
            destination = root / name
            if data is None:
                destination.unlink(missing_ok=True)
            else:
                destination.parent.mkdir(parents=True, exist_ok=True)
                destination.write_bytes(data)
        if prepared:
            git("add", "--", *prepared)
    except Exception:
        for name, original in originals.items():
            if original is not None:
                (root / name).write_bytes(original)
        raise
    print("Resolved", len(prepared), "conflicts; source customizations retained.")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, OSError, UnicodeError) as error:
        print("STOP:", str(error), file=sys.stderr)
        sys.exit(1)

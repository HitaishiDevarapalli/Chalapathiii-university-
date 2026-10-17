#!/usr/bin/env python3
"""Repair HTTPS forwarding for the university's active Nginx uploads proxy.

Dry run by default. --apply backs up changed configuration, runs nginx -t,
and reloads Nginx. TLS/server/API directives are retained. No app restart or
database mutation is performed.
"""
import argparse
import datetime
import json
from pathlib import Path
import re
import subprocess
import sys


def block_end(text, opening):
    depth, quote, escaped, comment = 0, "", False, False
    for index in range(opening, len(text)):
        char = text[index]
        if comment:
            if char == "\n":
                comment = False
            continue
        if escaped:
            escaped = False
            continue
        if char == "\\":
            escaped = True
            continue
        if quote:
            if char == quote:
                quote = ""
            continue
        if char in "\"'":
            quote = char
        elif char == "#":
            comment = True
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return index + 1
    raise ValueError("Unclosed Nginx location block; no files changed")


def transform(source):
    text = source.replace("\r\n", "\n")
    pattern = re.compile(r'^[ \t]*location\s+(?:\^~\s+)?(?:"/uploads/?"|/uploads/?)\s*\{', re.M)
    changes, matched = [], 0
    for match in pattern.finditer(text):
        end = block_end(text, match.end() - 1)
        block = text[match.start():end]
        upstream = re.search(r'^[ \t]*proxy_pass\s+http://(?:127\.0\.0\.1|localhost):5004(?:/uploads/?)?\s*;', block, re.M)
        if not upstream:
            continue
        matched += 1
        header = re.compile(r'^(?P<indent>[ \t]*)proxy_set_header\s+X-Forwarded-Proto\s+[^;\n]+;', re.M | re.I)
        existing = list(header.finditer(block))
        if len(existing) > 1:
            raise ValueError("Duplicate HTTPS forwarding directives need review; no files changed")
        if existing:
            new = header.sub(lambda m: m["indent"] + "proxy_set_header X-Forwarded-Proto $scheme;", block)
        else:
            indent = re.match(r"[ \t]*", upstream[0])[0]
            insert = upstream.end()
            new = block[:insert] + "\n" + indent + "proxy_set_header X-Forwarded-Proto $scheme;" + block[insert:]
        if new != block:
            changes.append((match.start(), end, new))
    for start, end, value in reversed(changes):
        text = text[:start] + value + text[end:]
    return text, matched


def update_files(paths, apply, backup_root):
    prepared, originals, matched = {}, {}, 0
    for file in paths:
        file = Path(file).resolve()
        if file in originals:
            continue
        original = file.read_bytes()
        originals[file] = original
        result, count = transform(original.decode("utf-8"))
        matched += count
        if count and result.encode("utf-8") != original:
            prepared[file] = result.encode("utf-8")
    if not matched:
        raise ValueError("No active university uploads proxy on port 5004 was found; no files changed")
    if not prepared:
        print("HTTPS forwarding is already configured. No changes made.")
        return
    for file in prepared:
        print("Verified uploads HTTPS forwarding fix:", file)
    if not apply:
        print("Dry run passed. Run with --apply to back up, validate, and reload Nginx.")
        return
    stamp = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%d-%H%M%S-%f")
    backup = Path(backup_root) / ("uploads-https-" + stamp)
    backup.mkdir(parents=True, mode=0o700)
    manifest = {}
    for index, file in enumerate(prepared):
        destination = backup / f"{index}-{file.name}"
        destination.write_bytes(originals[file])
        destination.chmod(0o600)
        manifest[destination.name] = str(file)
    (backup / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    try:
        for file, content in prepared.items():
            file.write_bytes(content)
        subprocess.run(["nginx", "-t"], check=True, capture_output=True)
        subprocess.run(["nginx", "-s", "reload"], check=True, capture_output=True)
    except Exception:
        for file in prepared:
            file.write_bytes(originals[file])
        raise
    print("UPLOAD HTTPS PROXY FIX APPLIED. Backup:", backup)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    config = subprocess.run(["nginx", "-T"], check=True, capture_output=True).stdout.decode("utf-8")
    paths = re.findall(r"^# configuration file (/.+):$", config, re.M)
    update_files(paths, args.apply, Path.home() / "chalapathi-backups")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, UnicodeError, OSError, subprocess.CalledProcessError) as error:
        print("STOP:", str(error), file=sys.stderr)
        sys.exit(1)

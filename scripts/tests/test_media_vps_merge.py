"""Local source-merging tests; no VPS, live database or credentials are used."""
import importlib.util
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[2]
SCRIPT = ROOT / "scripts/resolve-vps-media-merge.py"
spec = importlib.util.spec_from_file_location("media_merge", SCRIPT)
merger = importlib.util.module_from_spec(spec)
spec.loader.exec_module(merger)
TARGET = "4253a4a"


def source(ref, name):
    return subprocess.check_output(["git", "show", ref + ":" + name], cwd=ROOT)


class MediaVpsMergeTest(unittest.TestCase):
    def test_known_vps_portal_variant_preserves_custom_code(self):
        name = "src/pages/AdminPortal.tsx"
        ours = (ROOT / "work/vps-section-updated.tsx").read_bytes()
        ours += b"\n// Independent VPS customization must survive.\n"
        result = merger.merge_source(name, ours, source(merger.BUILDER_BASE, name), source(TARGET, name)).decode()
        self.assertIn("Independent VPS customization must survive", result)
        self.assertIn('activeTab === "media-storage" && <MediaBrowser />', result)
        self.assertIn("SectionAwareSidebar as AdminSidebar", result)
        self.assertIn('initialPageId={sectionPageId}', result)
        self.assertNotIn("<<<<<<<", result)

    def test_overlapping_unknown_source_is_rejected(self):
        with self.assertRaisesRegex(ValueError, "overlapping custom changes"):
            merger.merge_source("src/custom.ts", b"const v = 3;\n", b"const v = 1;\n", b"const v = 2;\n")

    def test_unrelated_grouping_is_not_rewritten(self):
        text = 'if (allowed && (item.id === "pages" || item.id === "page-builder")) run();'
        self.assertEqual(merger.normalize_portal(text), text)

    def test_every_original_builder_file_accepts_incoming_changes(self):
        names = subprocess.check_output(["git", "diff-tree", "--no-commit-id", "--name-only", "-r", merger.BUILDER_BASE], cwd=ROOT).decode().splitlines()
        for name in names:
            if name.startswith("dist/"):
                continue
            with self.subTest(name=name):
                base = source(merger.BUILDER_BASE, name)
                theirs = source(TARGET, name)
                merged = merger.merge_source(name, base, base, theirs)
                expected = theirs.decode().replace("\r\n", "\n")
                if name == "src/pages/AdminPortal.tsx":
                    expected = merger.normalize_portal(expected)
                self.assertEqual(merged.decode(), expected)

    def test_divergent_vps_commit_merge_is_resolved_without_losing_it(self):
        with tempfile.TemporaryDirectory(prefix="vps-media-branch-test-") as directory:
            repo = Path(directory) / "repo"
            subprocess.run(["git", "clone", "--quiet", "--shared", "--no-checkout", str(ROOT), str(repo)], check=True)
            def git(*args, check=True):
                return subprocess.run(["git", "-c", "user.name=Fixture", "-c", "user.email=fixture@example.invalid", *args], cwd=repo, capture_output=True, check=check)
            git("checkout", "--quiet", "-b", "vps-test", "40d2aed")
            git("cherry-pick", merger.BUILDER_BASE)
            portal = repo / "src/pages/AdminPortal.tsx"
            portal.write_bytes((ROOT / "work/vps-section-updated.tsx").read_bytes() + b"\n// VPS merge fixture customization\n")
            git("add", "src/pages/AdminPortal.tsx")
            git("commit", "--amend", "--no-edit")
            original = git("rev-parse", "HEAD").stdout.decode().strip()
            merged = git("merge", "--no-commit", "--no-ff", TARGET, check=False)
            self.assertNotEqual(merged.returncode, 0, "the fixture reproduces the divergent source conflicts")
            result = subprocess.run([sys.executable, str(SCRIPT), "--target", TARGET, "--apply", "--backup-dir", str(Path(directory) / "backup")], cwd=repo, capture_output=True)
            self.assertEqual(result.returncode, 0, result.stdout.decode() + result.stderr.decode())
            self.assertEqual(git("diff", "--name-only", "--diff-filter=U").stdout, b"")
            self.assertIn("VPS merge fixture customization", portal.read_text(encoding="utf-8"))
            self.assertIn('<MediaBrowser />', portal.read_text(encoding="utf-8"))
            # Compile the merged VPS variant using the already installed local
            # dependencies. Junctions are removed explicitly before temp cleanup.
            links = [(ROOT / "node_modules", repo / "node_modules"), (ROOT / "server/node_modules", repo / "server/node_modules")]
            created = []
            try:
                for target, link in links:
                    subprocess.run(["node", "-e", 'require("fs").symlinkSync(process.argv[1],process.argv[2],process.platform === "win32" ? "junction" : "dir")', str(target), str(link)], check=True)
                    created.append(link)
                for config, compiler in [(repo / "tsconfig.json", ROOT / "node_modules/typescript/bin/tsc"), (repo / "server/tsconfig.json", ROOT / "server/node_modules/typescript/bin/tsc")]:
                    compiled = subprocess.run(["node", str(compiler), "--noEmit", "-p", str(config)], capture_output=True)
                    self.assertEqual(compiled.returncode, 0, compiled.stdout.decode() + compiled.stderr.decode())
            finally:
                for link in reversed(created):
                    if os.name == "nt":
                        os.rmdir(link)
                    else:
                        link.unlink()
            git("commit", "-m", "Merge fixture")
            git("merge-base", "--is-ancestor", original, "HEAD")
            git("merge-base", "--is-ancestor", TARGET, "HEAD")


if __name__ == "__main__":
    unittest.main()

"""Isolated Git-index tests for VPS conflict recovery. No live server access."""
import contextlib
import importlib.util
import io
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from unittest import mock

ROOT = Path(__file__).resolve().parents[2]
SPEC = importlib.util.spec_from_file_location("resolver", ROOT / "scripts/resolve-page-builder-vps.py")
resolver = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(resolver)


class ResolverTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.sources = {name: subprocess.check_output(["git", "show", "602c35d^:" + name], cwd=ROOT).decode("utf-8") for name in resolver.FILES}

    def test_preserves_existing_source_and_is_idempotent(self):
        for name, source in self.sources.items():
            source += "\n// Existing VPS customization must survive\n"
            result = resolver.transform(name, source)
            self.assertIn("// Existing VPS customization must survive", result)
            self.assertEqual(resolver.transform(name, result), result)

    def test_unsupported_architecture_is_rejected(self):
        with self.assertRaises(ValueError):
            resolver.transform(resolver.FILES[0], "changed beyond supported anchors")

    def fixture(self, root, invalid=False):
        subprocess.run(["git", "init", "--quiet", str(root)], check=True)
        entries = []
        expected = {}
        for name, source in self.sources.items():
            saved = source + "\n// Real VPS customization preserved by the merge\n"
            if invalid and name == resolver.FILES[-1]:
                saved = "Unsupported permission layout\n"
            expected[name] = saved
            upstream = resolver.transform(name, source)
            for stage, content in [(1, source), (2, upstream), (3, saved)]:
                digest = subprocess.run(["git", "hash-object", "-w", "--stdin"], cwd=root, input=content.encode(), capture_output=True, check=True).stdout.decode().strip()
                entries.append(f"100644 {digest} {stage}\t{name}\n")
            file = root / name
            file.parent.mkdir(parents=True, exist_ok=True)
            file.write_text("<<<<<<< Updated upstream\nconflict\n=======\nVPS\n>>>>>>> Stashed changes\n", encoding="utf-8")
        subprocess.run(["git", "update-index", "--index-info"], cwd=root, input="".join(entries).encode(), check=True)
        return expected

    def test_git_stage_three_recovery_and_backup(self):
        previous = Path.cwd()
        with tempfile.TemporaryDirectory(prefix="builder-resolver-test-") as temp:
            root = Path(temp) / "repo"
            expected = self.fixture(root)
            try:
                os.chdir(root)
                before = {name: (root / name).read_bytes() for name in resolver.FILES}
                with mock.patch.object(sys, "argv", ["resolver"]), contextlib.redirect_stdout(io.StringIO()):
                    resolver.main()
                self.assertEqual(before, {name: (root / name).read_bytes() for name in resolver.FILES})
                with mock.patch.object(sys, "argv", ["resolver", "--apply"]), mock.patch.object(resolver.Path, "home", return_value=Path(temp)), contextlib.redirect_stdout(io.StringIO()):
                    resolver.main()
                self.assertEqual(subprocess.check_output(["git", "diff", "--name-only", "--diff-filter=U"], cwd=root), b"")
                backups = list((Path(temp) / "chalapathi-backups").glob("builder-conflicts-*"))
                self.assertEqual(len(backups), 1)
                for name in resolver.FILES:
                    self.assertEqual((root / name).read_text(encoding="utf-8"), resolver.transform(name, expected[name]))
                    self.assertEqual((backups[0] / "conflicted" / name).read_bytes(), before[name])
                    self.assertEqual((backups[0] / "vps-saved" / name).read_text(encoding="utf-8"), expected[name])
            finally:
                os.chdir(previous)

    def test_one_unsupported_file_leaves_every_file_untouched(self):
        previous = Path.cwd()
        with tempfile.TemporaryDirectory(prefix="builder-resolver-test-") as temp:
            root = Path(temp) / "repo"
            self.fixture(root, invalid=True)
            try:
                os.chdir(root)
                before = {name: (root / name).read_bytes() for name in resolver.FILES}
                with mock.patch.object(sys, "argv", ["resolver", "--apply"]), contextlib.redirect_stdout(io.StringIO()), self.assertRaises(ValueError):
                    resolver.main()
                self.assertEqual(before, {name: (root / name).read_bytes() for name in resolver.FILES})
            finally:
                os.chdir(previous)


if __name__ == "__main__":
    unittest.main()

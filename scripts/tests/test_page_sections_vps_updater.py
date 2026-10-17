"""Source-only VPS updater tests; no remote server access."""
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


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, ROOT / path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


updater = load("section_updater", "scripts/update-page-sections-vps.py")
resolver = load("builder_resolver", "scripts/resolve-page-builder-vps.py")


def git_source(ref):
    return subprocess.check_output(["git", "show", ref + ":" + updater.PORTAL], cwd=ROOT).decode("utf-8")


class SectionUpdaterTest(unittest.TestCase):
    def test_matches_committed_feature(self):
        self.assertEqual(updater.transform(git_source("b83a10b")), git_source("60acddb"))

    def test_previous_vps_resolver_variant_and_security_code_survive(self):
        before = resolver.transform(updater.PORTAL, git_source("602c35d^"))
        before += "\n// Existing VPS security customization must survive\n"
        # Reproduce the expression that makes the context-based Git patch fail.
        self.assertIn('(item.id === "pages" || item.id === "page-builder")', before)
        after = updater.transform(before)
        self.assertIn('(item.id === "pages" || item.id === "page-builder")', after)
        self.assertIn("// Existing VPS security customization must survive", after)
        self.assertIn('activeTab === "page-builder" ? "pages" : (', after)
        self.assertEqual(updater.transform(after), after)

    def test_already_updated_source_is_idempotent(self):
        source = git_source("60acddb")
        self.assertEqual(updater.transform(source), source)

    def test_cli_dry_run_and_apply_backup(self):
        old_cwd = Path.cwd()
        with tempfile.TemporaryDirectory(prefix="section-updater-test-") as folder:
            root = Path(folder) / "repo"
            subprocess.run(["git", "init", "--quiet", str(root)], check=True)
            target = root / updater.PORTAL
            target.parent.mkdir(parents=True)
            source = resolver.transform(updater.PORTAL, git_source("602c35d^"))
            target.write_bytes(source.encode())
            try:
                os.chdir(root)
                with mock.patch.object(sys, "argv", ["updater"]), contextlib.redirect_stdout(io.StringIO()):
                    updater.main()
                self.assertEqual(target.read_bytes(), source.encode())
                with mock.patch.object(sys, "argv", ["updater", "--apply"]), mock.patch.object(updater.Path, "home", return_value=Path(folder)), contextlib.redirect_stdout(io.StringIO()):
                    updater.main()
                self.assertEqual(target.read_text(encoding="utf-8"), updater.transform(source))
                backups = list((Path(folder) / "chalapathi-backups").glob("section-portal-*/AdminPortal.tsx"))
                self.assertEqual(len(backups), 1)
                self.assertEqual(backups[0].read_bytes(), source.encode())
                self.assertEqual(subprocess.check_output(["git", "diff", "--cached"], cwd=root), b"")
            finally:
                os.chdir(old_cwd)

    def test_unknown_permissions_leave_source_untouched(self):
        source = git_source("b83a10b").replace("canViewTab(adminIdentity, item.id)", "customPermission(item.id)")
        old_cwd = Path.cwd()
        with tempfile.TemporaryDirectory(prefix="section-updater-failure-") as folder:
            root = Path(folder)
            subprocess.run(["git", "init", "--quiet", str(root)], check=True)
            target = root / updater.PORTAL
            target.parent.mkdir(parents=True)
            target.write_bytes(source.encode())
            try:
                os.chdir(root)
                with mock.patch.object(sys, "argv", ["updater", "--apply"]), self.assertRaises(ValueError):
                    updater.main()
                self.assertEqual(target.read_bytes(), source.encode())
            finally:
                os.chdir(old_cwd)


if __name__ == "__main__":
    unittest.main()

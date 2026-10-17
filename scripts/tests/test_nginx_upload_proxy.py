"""Guarded Nginx upload repair tests; no real Nginx or VPS changes."""
import contextlib
import importlib.util
import io
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest import mock

ROOT = Path(__file__).resolve().parents[2]
SPEC = importlib.util.spec_from_file_location("upload_proxy", ROOT / "scripts/fix-nginx-upload-proxy.py")
updater = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(updater)

CONFIG = '''server {
    listen 443 ssl;
    server_name chalapathiuniversity.edu.in;
    ssl_certificate /etc/letsencrypt/live/university/fullchain.pem;
    location ^~ /api/ {
        proxy_pass http://127.0.0.1:5004/api/;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    location ^~ /uploads/ {
        # Preserve quoted braces: "}" and nested directives.
        proxy_pass http://127.0.0.1:5004/uploads/;
        proxy_set_header Host $host;
        expires 30d;
    }
}
'''


class UploadProxyTest(unittest.TestCase):
    def test_preserves_tls_api_and_all_existing_directives(self):
        expected = CONFIG.replace("proxy_pass http://127.0.0.1:5004/uploads/;", "proxy_pass http://127.0.0.1:5004/uploads/;\n        proxy_set_header X-Forwarded-Proto $scheme;")
        changed, count = updater.transform(CONFIG)
        self.assertEqual(changed, expected)
        self.assertEqual(count, 1)
        self.assertEqual(updater.transform(changed), (changed, 1))

    def test_wrong_header_is_repaired_without_duplication(self):
        source = CONFIG.replace("proxy_set_header Host $host;", "proxy_set_header X-Forwarded-Proto http;\n        proxy_set_header Host $host;")
        changed, _ = updater.transform(source)
        self.assertNotIn("X-Forwarded-Proto http", changed)
        self.assertEqual(changed.count("X-Forwarded-Proto $scheme;"), 2)

    def test_unrelated_upstream_is_untouched(self):
        source = CONFIG.replace("5004/uploads", "9000/uploads")
        self.assertEqual(updater.transform(source), (source, 0))

    def test_dry_run_backup_and_reload(self):
        with tempfile.TemporaryDirectory(prefix="nginx-upload-test-") as folder:
            root = Path(folder)
            target = root / "university.conf"
            target.write_bytes(CONFIG.encode())
            with mock.patch.object(updater.subprocess, "run") as run, contextlib.redirect_stdout(io.StringIO()):
                updater.update_files([target], False, root / "backups")
                run.assert_not_called()
            self.assertEqual(target.read_bytes(), CONFIG.encode())
            with mock.patch.object(updater.subprocess, "run") as run, contextlib.redirect_stdout(io.StringIO()):
                updater.update_files([target, target], True, root / "backups")
                self.assertEqual(run.call_args_list, [
                    mock.call(["nginx", "-t"], check=True, capture_output=True),
                    mock.call(["nginx", "-s", "reload"], check=True, capture_output=True),
                ])
            self.assertEqual(target.read_text(), updater.transform(CONFIG)[0])
            backups = list((root / "backups").rglob("*-university.conf"))
            self.assertEqual(len(backups), 1)
            self.assertEqual(backups[0].read_bytes(), CONFIG.encode())

    def test_validation_failure_restores_files_without_reload(self):
        with tempfile.TemporaryDirectory(prefix="nginx-upload-rollback-") as folder:
            root = Path(folder)
            target = root / "university.conf"
            target.write_bytes(CONFIG.encode())
            with mock.patch.object(updater.subprocess, "run", side_effect=subprocess.CalledProcessError(1, ["nginx", "-t"])) as run, contextlib.redirect_stdout(io.StringIO()):
                with self.assertRaises(subprocess.CalledProcessError):
                    updater.update_files([target], True, root / "backups")
                self.assertEqual(run.call_count, 1)
            self.assertEqual(target.read_bytes(), CONFIG.encode())

    def test_duplicate_header_stops_before_any_write(self):
        with tempfile.TemporaryDirectory(prefix="nginx-upload-invalid-") as folder:
            root = Path(folder)
            good, bad = root / "good.conf", root / "bad.conf"
            invalid = CONFIG.replace("proxy_set_header Host $host;", "proxy_set_header X-Forwarded-Proto http;\n        proxy_set_header X-Forwarded-Proto https;")
            good.write_bytes(CONFIG.encode())
            bad.write_bytes(invalid.encode())
            with self.assertRaises(ValueError):
                updater.update_files([good, bad], True, root / "backups")
            self.assertEqual(good.read_bytes(), CONFIG.encode())
            self.assertEqual(bad.read_bytes(), invalid.encode())


if __name__ == "__main__":
    unittest.main()

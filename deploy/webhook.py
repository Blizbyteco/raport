#!/usr/bin/env python3
"""GitHub push-webhook receiver. Verifies HMAC signature and triggers deploy.sh."""

import hashlib
import hmac
import json
import os
import signal
import subprocess
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

SECRET = os.environ["DEPLOY_WEBHOOK_SECRET"].encode()
REPO_DIR = os.environ.get("DEPLOY_REPO_DIR", "/opt/raport")
BRANCH = os.environ.get("DEPLOY_BRANCH", "main")
HOST = os.environ.get("DEPLOY_WEBHOOK_HOST", "127.0.0.1")
PORT = int(os.environ.get("DEPLOY_WEBHOOK_PORT", "9000"))
DEPLOY_SCRIPT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "deploy.sh")


class Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path.rstrip("/") != "/webhook":
            self.send_error(404)
            return

        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length)

        sig = self.headers.get("X-Hub-Signature-256", "")
        expected = "sha256=" + hmac.new(SECRET, body, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected):
            self._reply(401, b"invalid signature\n")
            return

        try:
            payload = json.loads(body)
        except json.JSONDecodeError:
            self._reply(400, b"bad payload\n")
            return

        if payload.get("ref") != f"refs/heads/{BRANCH}":
            self._reply(200, b"ignored (not " + BRANCH.encode() + b")\n")
            return

        env = {**os.environ, "DEPLOY_REPO_DIR": REPO_DIR, "DEPLOY_BRANCH": BRANCH}
        subprocess.Popen(
            ["/bin/bash", DEPLOY_SCRIPT],
            env=env,
            start_new_session=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        self._reply(200, b"deploy triggered\n")

    def _reply(self, code, message):
        self.send_response(code)
        self.send_header("Content-Type", "text/plain")
        self.send_header("Content-Length", str(len(message)))
        self.end_headers()
        self.wfile.write(message)

    def log_message(self, fmt, *args):
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


def main():
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    signal.signal(signal.SIGTERM, lambda *_: sys.exit(0))
    print(f"listening on {HOST}:{PORT} (branch={BRANCH}, repo={REPO_DIR})", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()

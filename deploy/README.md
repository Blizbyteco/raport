# Deployment

Push to `main` → GitHub Actions → SSH to the server → `deploy/deploy.sh` → `docker compose up --build -d`.

The old `deploy/webhook.py` receiver is **no longer used** (it bound to `127.0.0.1:9000`, so GitHub could never reach it).
The systemd unit `deploy/raport-deploy.service` can be removed on the server:

```bash
sudo systemctl disable --now raport-deploy.service
sudo rm /etc/systemd/system/raport-deploy.service /etc/raport-deploy.env
```

---

## 1. One-time server preparation

Run on the server (Ubuntu):

```bash
# docker + compose plugin
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"        # log out/in so docker works without sudo

# repo
sudo mkdir -p /home/ubuntu/raport
sudo chown -R "$USER:$USER" /home/ubuntu/raport
git clone https://github.com/Blizbyteco/raport.git /home/ubuntu/raport

# app env (docker compose reads .env from the repo root on the server)
cp docker-compose.env.example .env
php -r 'echo "APP_KEY=base64:".base64_encode(random_bytes(32)).PHP_EOL;'   # paste into .env
chmod 600 .env
```

Edit `.env` on the server and set at least:

| Key                 | Value                                                        |
| ------------------- | ------------------------------------------------------------ |
| `APP_KEY`           | `base64:...` (generated above — must stay stable across deploys) |
| `APP_URL`           | `https://your-domain`                                        |
| `DB_PASSWORD` / `DB_ROOT_PASSWORD` | strong random values                             |
| `SESSION_DOMAIN`    | your domain (e.g. `your-domain`)                             |
| `SANCTUM_STATEFUL_DOMAINS` | `your-domain,www.your-domain`                          |
| `WEB_PORT`          | `8080` (or `80`)                                             |

`VITE_API_URL` stays empty → the SPA calls the same origin and nginx proxies `/api`, `/login`, `/sanctum` to the API container.

Database data persists in the `db-data` Docker volume; `docker compose down` keeps it, `docker compose down -v` wipes it.

---

## 2. SSH key for the Actions runner

Generate a **dedicated** key pair (never reuse your personal key):

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/raport_deploy -N ""
cat ~/.ssh/raport_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

The private key goes into the GitHub secret `DEPLOY_SSH_KEY`; the public key stays on the server.

---

## 3. GitHub repository secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret            | Required | Description                                                     |
| ----------------- | -------- | --------------------------------------------------------------- |
| `DEPLOY_HOST`     | yes      | Server IP or hostname (e.g. `203.0.113.10`)                     |
| `DEPLOY_USER`     | yes      | SSH user that owns the repo dir (e.g. `ubuntu`)                  |
| `DEPLOY_SSH_KEY`  | yes      | **Private** key content, PEM: `-----BEGIN OPENSSH PRIVATE KEY-----` … |
| `DEPLOY_PORT`     | no       | SSH port, default `22`                                          |
| `DEPLOY_REPO_DIR` | no       | Default `/home/ubuntu/raport`                                   |
| `WEB_PORT`        | no       | Port the app is published on, default `8080` (used by the smoke test) |
| `HEALTHCHECK_URL` | no       | Full URL for the smoke test, e.g. `https://your-domain/up`      |

Multi-line values are fine for `DEPLOY_SSH_KEY` — paste the whole file, including the `-----END …-----` line.

### How to add them

```bash
gh secret set DEPLOY_HOST        # interactive, or: gh secret set DEPLOY_HOST --body "1.2.3.4"
gh secret set DEPLOY_USER --body "ubuntu"
gh secret set DEPLOY_SSH_KEY < ~/.ssh/raport_deploy
gh secret set DEPLOY_PORT --body "22"
```

or via the web UI (Settings → Secrets and variables → Actions → *New repository secret*).

---

## 4. Workflows

| Workflow                | File                          | Trigger                         |
| ----------------------- | ----------------------------- | ------------------------------- |
| `Deploy`                | `.github/workflows/deploy.yml` | push to `main`, manual dispatch |
| `CI`                    | `.github/workflows/ci.yml`     | push/PR to `main`               |

`Deploy` steps: checkout → write SSH key → `ssh … bash -s < deploy/deploy.sh` → smoke test `GET /up`.

Manual run: **Actions → Deploy → Run workflow**; optionally override *branch* and *deploy dir*.

The `deploy.sh` that runs is the one from the pushed commit (it is piped over SSH), so changes to it take effect immediately.

---

## 5. Verify locally / on the server

Run the same script by hand on the server:

```bash
cd /home/ubuntu/raport
DEPLOY_REPO_DIR=/home/ubuntu/raport DEPLOY_BRANCH=main bash deploy/deploy.sh
```

Log file: `$HOME/.cache/raport-deploy.log` (override with `DEPLOY_LOG`). A lock file (`$HOME/.cache/raport-deploy.lock`) prevents two deploys at once.

---

## 6. Troubleshooting

| Symptom | Fix |
| ------- | --- |
| `Permission denied (publickey)` | Wrong secret / wrong user. Test with `ssh -i ~/.ssh/raport_deploy ubuntu@$DEPLOY_HOST`. |
| `Host key verification failed` | The workflow uses `ssh-keyscan`; if the server key changed, delete the stale entry in `~/.ssh/known_hosts` of the runner (fresh runner each run) — normally it self-heals. |
| `docker: permission denied` | `sudo usermod -aG docker $USER` then re-login. |
| Deploy runs but the app still serves old code | Check `docker compose ps` / `docker compose logs api` on the server; the API container regenerates `APP_KEY` on boot if it is empty — set `APP_KEY` in the server `.env`. |
| Login fails in the browser | Set `SESSION_DOMAIN` + `SANCTUM_STATEFUL_DOMAINS` to the real domain and `APP_URL` accordingly. |
| Deploy skipped (`deploy already in progress`) | A previous deploy still holds the lock: `sudo fuser $HOME/.cache/raport-deploy.lock`. |

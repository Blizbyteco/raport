# AGENTS.md

## 1. Project Overview

**E-Raport Pendamping** — a school report-card / student-progress application.

Monorepo with two independently deployed applications:

| Path       | Stack                                | Role                                    |
| ---------- | ------------------------------------ | --------------------------------------- |
| `api/`     | Laravel 12 (PHP 8.2+) + Sanctum      | REST API, auth, PDF report generation   |
| `frontend/`| React 19 + Vite + Tailwind CSS v4    | SPA (admin + teacher dashboards)        |

Both must be running for the app to work. Auth is **session/cookie based** (Sanctum SPA mode), not bearer tokens.

---

## 2. Repository Layout

```text
raport/
├── docker-compose.yml      # full-stack deployment (db + api + web/nginx)
├── .github/workflows/      # ci.yml (tests) + deploy.yml (SSH deploy to the server)
├── deploy/                 # deploy.sh (run on the server) + README.md (setup guide)
├── api/                    # Laravel backend
│   ├── docker/entrypoint.sh    # waits for DB, migrate, seed-if-empty, php-fpm
│   ├── app/
│   │   ├── Console/Commands/   # db:seed-if-empty (first-boot seeding gate)
│   │   ├── Http/Controllers/   # 16 controllers (REST resources + reports)
│   │   ├── Http/Resources/     # API resources
│   │   ├── Models/             # Eloquent models (see app/Models/relations.txt)
│   │   └── Providers/
│   ├── config/             # cors.php, sanctum.php, database.php, session.php
│   ├── database/
│   │   ├── migrations/     # 20 migrations
│   │   └── seeders/        # demo/dummy data (users, students, lessons, ...)
│   ├── resources/views/
│   │   └── reports/        # classroom.blade.php, student-report.blade.php (DomPDF)
│   ├── routes/
│   │   ├── api.php         # all authenticated endpoints (auth:sanctum)
│   │   └── web.php         # POST /login (session login)
│   └── .docs/
│       ├── API.md              # full endpoint documentation (source of truth)
│       └── Teacher_Modules.md  # teacher module endpoint map
├── frontend/               # React SPA
│   ├── docker/nginx.conf       # SPA + /api,/login,/sanctum → PHP-FPM (docker)
│   ├── src/
│   │   ├── app/            # layouts, providers, router
│   │   ├── features/       # feature-based modules (see §6)
│   │   └── shared/         # cross-feature api, layout, ui, lib, data
│   ├── .agents/            # frontend-specific agent rules (READ BEFORE UI WORK)
│   │   ├── AGENTS.md
│   │   └── features/students.md
│   └── vite.config.js      # @ -> ./src alias
└── AGENTS.md               # this file
```

---

## 3. Environment & Tooling (verified working on this machine)

- PHP: the default `php` on PATH is phpbrew 8.3.30 **without `ext-iconv`**, which breaks `composer install`. Use Homebrew PHP instead: `/opt/homebrew/opt/php@8.3/bin/php`. `composer -V` → 2.8.6 at `/usr/local/bin/composer`.
- Node v24 / npm 11.
- Docker 28 + Compose v2 available; `docker compose up --build` deploys the full stack (see §4).
- MySQL/MariaDB **is running** on `127.0.0.1:3306` (root). DB name expected: `api` (per `api/.env.example`).
- Frontend dev server: `http://localhost:5173` (hard-coded in `api/config/cors.php` allowed_origins).
- Backend dev server: `http://localhost:8000` (matches `frontend/.env` `VITE_API_URL`).

Prefer prefixing Composer/Artisan with the Homebrew PHP when the phpbrew iconv warning blocks commands:

```bash
/opt/homebrew/opt/php@8.3/bin/php /usr/local/bin/composer install
/opt/homebrew/opt/php@8.3/bin/php api/artisan <cmd>
```

---

## 4. Setup / Run Commands

### Backend (`api/`)

```bash
/opt/homebrew/opt/php@8.3/bin/php /usr/local/bin/composer install   # install PHP deps
cp .env.example .env                                                # configure DB (mysql, database=api)
/opt/homebrew/opt/php@8.3/bin/php artisan key:generate
/opt/homebrew/opt/php@8.3/bin/php artisan migrate --seed            # schema + demo data
/opt/homebrew/opt/php@8.3/bin/php artisan serve                     # http://localhost:8000
```

### Frontend (`frontend/`)

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run lint       # NOTE: currently reports pre-existing errors (unused imports)
```

### Docker (full stack: MySQL + API + SPA)

```bash
docker compose up --build     # http://localhost:8080 (single origin, no CORS needed)
docker compose down           # stop (db data persists in the `db-data` volume)
docker compose down -v        # stop and wipe the database
```

- On API container start, `api/docker/entrypoint.sh` waits for MySQL, runs `php artisan migrate --force`, generates `APP_KEY` if missing, then runs `php artisan db:seed-if-empty` (new artisan command: full `DatabaseSeeder` chain, skipped when users already exist — seeders are not idempotent).
- Frontend is built with `VITE_API_URL=""` (same-origin); the bundled nginx (`frontend/docker/nginx.conf`) serves the SPA and proxies `/api`, `/sanctum`, `/up` and `POST /login` to the PHP-FPM container.
- Optional overrides (ports, passwords, `APP_KEY`): copy `docker-compose.env.example` to `.env` at the repo root.
- Demo login after first boot: usernames from `UserSeeder` (e.g. `ach.ubaidillah`), password `password`.

### Tests / Quality

```bash
# Backend
/opt/homebrew/opt/php@8.3/bin/php artisan test     # PHPUnit; sqlite :memory: (see phpunit.xml)
/opt/homebrew/opt/php@8.3/bin/php vendor/bin/pint  # Laravel Pint formatter

# Frontend
npm run lint
npm run build
```

> Known baseline issues (do not assume your change caused them):
> - `npm run lint` → ~28 pre-existing errors + 4 warnings (unused vars in teacher/shared components).
> - `vendor/bin/pint --test` → ~20 pre-existing files with style drift (not fixed yet).

### CI / CD (GitHub Actions)

```text
.github/workflows/
├── ci.yml      # push/PR on main → API tests (PHP 8.3) + Pint, frontend npm ci/build/lint
└── deploy.yml  # push to main (or manual dispatch) → SSH to the server → deploy/deploy.sh → docker compose up --build -d
```

- `deploy.yml` needs repo secrets: `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY` (required) and `DEPLOY_PORT`, `DEPLOY_REPO_DIR`, `WEB_PORT` (optional). Full setup guide: `deploy/README.md`.
- `deploy/deploy.sh` is piped over SSH from the pushed commit, so script changes apply immediately; it syncs the repo (`git fetch` + `git reset --hard origin/<branch>`) and rebuilds the Docker stack.
- `deploy/webhook.py` + `deploy/raport-deploy.service` are the legacy push-webhook receiver and are **not** used anymore (it only listened on `127.0.0.1:9000`, unreachable from GitHub).

---

## 5. Backend Conventions (`api/`)

- **Framework**: Laravel 12, PSR-4 `App\` → `app/`. Uses `bootstrap/app.php` (no `Kernel.php`) with `$middleware->statefulApi()`.
- **Auth**: Sanctum SPA cookie auth.
  - `POST /login` lives in `routes/web.php` (`AuthController@login`), logs in via the `web` guard and regenerates the session. There is **no** `/api/login` and **no** token issuance.
  - Everything in `routes/api.php` is wrapped in `auth:sanctum`.
  - Frontend must send `withCredentials: true` + `withXSRFToken: true` (already done in `frontend/src/shared/api/Axios.js`).
- **Controllers**: standard `apiResource` for master data (academic-years, classes, teachers, subjects, students, extracurriculars) plus nested/manual routes for placements, lessons, progress and reports. See `routes/api.php` and `.docs/API.md`.
- **Models / relations**: `app/Models/relations.txt` is the canonical ER sketch. Key chain: `AcademicYear → ClassSubject/ClassStudent → SchoolClass → Subject/DailyLesson → StudentDailyProgress → Student`.
- **Roles**: `users.role` enum = `teacher | admin | leader`. Seeds only create `teacher` users.
- **Seed data**: `DatabaseSeeder` seeds teachers, students, classes, subjects, placements, lessons, progress, attendance. Seeded teacher password is `password`; usernames are the email-style slugs in `UserSeeder.php` (e.g. `ach.ubaidillah`).
  - Individual seeders are **not idempotent** (`create()`/`insert()` without dedupe), so re-running `db:seed` on a populated DB fails. `php artisan db:seed-if-empty` runs `DatabaseSeeder` only when `users` is empty; the Docker entrypoint uses it on first boot.
- **PDF reports**: `barryvdh/laravel-dompdf` rendering `resources/views/reports/*.blade.php` via `ReportController`.
- **Style**: follow existing controllers/models; run Pint before finishing.

---

## 6. Frontend Conventions (`frontend/`)

**Always read `frontend/.agents/AGENTS.md` before making UI changes — it is the authoritative rulebook** (feature placement, allowed dirs, no new deps, no arbitrary colors, UI-only scope, etc.). Summary:

- Feature-based structure: `src/features/<feature>/{pages,ui}`. Shared code only in `src/shared/`.
- Path alias `@/*` → `./src/*` (only alias in `vite.config.js`; Vite 8/rolldown rejects non-string alias replacements).
- Stack: React 19, Vite, Tailwind CSS v4, React Router v8 (`react-router`), TanStack Query v5, axios, react-hook-form, recharts, lucide-react.
- **Theme tokens live in `src/index.css`** (`@theme inline`): use `bg-background`, `bg-card`, `text-foreground`, `bg-primary`, `text-muted`, `text-danger`, `bg-success`, etc. Never use arbitrary colors like `bg-[#123456]`.
- Data fetching pattern (the modern features follow it): `features/<feature>/api/*Api.js` → `features/<feature>/hooks/use*.js` (TanStack Query) → consumed in `pages/`.
  - Example: `academic-year`, `class`, `subjects`, `teacher`.
  - Legacy features (`students`, `teachers`, `extracurriculars`, places with JSON mock data in `src/shared/data/`) still render static mock data and are not yet wired to the API.
- All API calls go through `src/shared/api/Axios.js` (`import.meta.env.VITE_API_URL`, credentials + CSRF enabled).
- Router: `src/app/router/router.jsx` with role guards (`admin` under `/dashboard`, `teacher` under `/teacher`, shared `/profile`). Login at `/login`.
- Reuse `src/shared/ui/*` primitives (Button, Input, Select, Textarea, Table, Badge, Modal, Alert, FileUpload).

Do not introduce new dependencies or a new design system unless explicitly requested.

---

## 7. API Contract

`api/.docs/API.md` is the source of truth for request/response shapes — consult it before adding or changing endpoints. `api/.docs/Teacher_Modules.md` maps the teacher-facing module endpoints.

---

## 8. Working Agreements

- Do not commit unless explicitly asked.
- Do not touch `.kilo/` (agent worktree metadata).
- Make changes in the correct app (`api/` vs `frontend/`); keep them independent.
- When changing backend routes/controllers, update `api/.docs/API.md` if behavior/contract changes.
- After backend changes run `php artisan test` (expect the known `ExampleTest` baseline failure) and Pint; after frontend changes run `npm run lint` and `npm run build`.
- Migrations must succeed on a **fresh** database (Docker runs `php artisan migrate --force` on every start). Don't create a table that another migration already creates without a `Schema::hasTable()` guard.
- Never add secrets to the repo; keep credentials in `api/.env` / `frontend/.env`.

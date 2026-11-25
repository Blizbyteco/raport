# AGENTS.md

## 1. Project Overview

**E-Raport Pendamping** — a school report-card / student-progress application.

Monorepo with two independently deployed applications:

| Path       | Stack                                | Role                                    |
| ---------- | ------------------------------------ | --------------------------------------- |
| `api/`     | Laravel 12 (PHP 8.2+) + Sanctum      | REST API, auth, PDF report generation   |
| `frontend/`| React 19 + Vite + Tailwind CSS v4    | SPA (admin, teacher, foundation-leader) |

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
│   │   ├── Http/Controllers/   # 20 controllers (REST resources + dashboard/profile/attendance/reports)
│   │   ├── Http/Middleware/    # EnsureLeaderReadOnly (leader read-only guard)
│   │   ├── Http/Resources/     # API resources
│   │   ├── Models/             # Eloquent models (see app/Models/relations.txt)
│   │   └── Providers/
│   ├── config/             # cors.php, sanctum.php, database.php, session.php
│   ├── database/
│   │   ├── migrations/     # 24 migrations
│   │   └── seeders/        # demo/dummy data (users, students, lessons, foundation officials, ...)
│   ├── resources/views/
│   │   └── reports/        # classroom.blade.php, student-report.blade.php (DomPDF)
│   ├── routes/
│   │   ├── api.php         # authenticated endpoints (auth:sanctum + leader read-only)
│   │   └── web.php         # POST /login (session login)
│   └── .docs/
│       ├── API.md              # full endpoint documentation (source of truth)
│       └── Teacher_Modules.md  # teacher module endpoint map
├── frontend/               # React SPA
│   ├── docker/nginx.conf       # SPA + /api,/login,/sanctum → PHP-FPM (docker)
│   ├── src/
│   │   ├── app/            # layouts, providers, router
│   │   ├── features/       # feature-based modules (api/hooks/pages/ui where wired; see §6)
│   │   └── shared/         # cross-feature api, layout, ui, lib, data
│   ├── .agents/            # frontend-specific agent rules (READ BEFORE UI WORK)
│   │   ├── AGENTS.md
│   │   └── features/students.md
│   └── vite.config.js      # @ -> ./src alias
└── AGENTS.md               # this file
```

---

## 3. Environment & Tooling

- PHP: on macOS the default `php` on PATH is phpbrew 8.3.30 **without `ext-iconv`**, which breaks `composer install`; use Homebrew PHP (`/opt/homebrew/opt/php@8.3/bin/php`, composer 2.8.6 at `/usr/local/bin/composer`). On Windows `php` (8.3) is on PATH and works for `artisan`/`pint`.
- Node v24 / npm 11.
- Docker 28 + Compose v2 available on the original dev machine; `docker compose up --build` deploys the full stack (see §4).
- MySQL/MariaDB expected on `127.0.0.1:3306` (root), DB name `api` (per `api/.env.example`). Start it before running migrations.
- Frontend dev server: `http://localhost:5173` (hard-coded in `api/config/cors.php` allowed_origins).
- Backend dev server: `http://localhost:8000` (matches `frontend/.env` `VITE_API_URL`).
- Current Windows workspace: MySQL/MariaDB, Docker and `pdo_sqlite` are **not** available, so `artisan migrate`/`artisan test` cannot run locally; verify DB-backed work via CI or a machine with those services.

Prefer prefixing Composer/Artisan with the Homebrew PHP (macOS) when the phpbrew iconv warning blocks commands:

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

On Windows, `php` is on PATH — run `php artisan ...` from `api/` (no Homebrew prefix).

### Frontend (`frontend/`)

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run lint       # NOTE: currently reports 2 pre-existing AuthContext errors + warnings
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
- Demo login after first boot: usernames from `UserSeeder` (e.g. `ach.ubaidillah`), password `password`. Admin: `admin`; head of foundation (leader): `pimpinan` — both password `password`.
- Seeding only happens on a **first boot** (`db:seed-if-empty` skips when `users` exist). On an already-seeded database, new/changed users require a manual run: `docker compose exec api php artisan db:seed --class=UserSeeder` (`UserSeeder` is idempotent via `updateOrCreate`).

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
> - `npm run lint` → 2 pre-existing errors in `frontend/src/features/auth/context/AuthContext.jsx` (`react-refresh/only-export-components`, `react-hooks/set-state-in-effect`) plus non-blocking warnings.
> - `vendor/bin/pint --test` still reports pre-existing style drift in unrelated files; all backend files touched by the API-integration work pass Pint.

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
  - Everything in `routes/api.php` is wrapped in `auth:sanctum` + `EnsureLeaderReadOnly`.
  - Frontend must send `withCredentials: true` + `withXSRFToken: true` (already done in `frontend/src/shared/api/Axios.js`).
  - `GET /api/user` and `GET /api/profile` return the same authenticated-user shape, including `nip`.
- **Controllers**: standard `apiResource` for master data (academic-years, classes, teachers, subjects, students, extracurriculars, foundation-officials) plus nested/manual routes for placements, lessons, progress, attendance, dashboard, profile and reports. The `classes` resource binds `{schoolClass}` explicitly so `SchoolClassController` receives the resolved model. `EnsureLeaderReadOnly` wraps the whole `auth:sanctum` group. See `routes/api.php` and `.docs/API.md`.
  - Class `students_count` / `subjects_count` are scoped to the active academic year; `grade_level` accepts 7–12.
  - `GET /api/students` and `GET /api/teachers` support `per_page` (default 20, max 200); the SPA sends `per_page=200` for admin lists and member pickers.
  - Classroom PDF accepts optional `period=monthly|semester`, `month=YYYY-MM`, and `semester=ganjil|genap`; omitting them keeps the unfiltered report. `monthly` requires a concrete `YYYY-MM`.
  - Evaluation `notes` is one string (last non-empty `teacher_note`), not a per-lesson object/array; the UI reads it directly.
  - Class-subject mutations (daily lessons, student progress, attendance) call `Controller::ensureCanManageClassSubject()`: admins manage everything, a teacher only the subjects assigned to them (`teacher_id`); other teachers get `403`.
- **Models / relations**: `app/Models/relations.txt` is the canonical ER sketch. Key chain: `AcademicYear → ClassSubject/ClassStudent → SchoolClass → Subject/DailyLesson → StudentDailyProgress → Student`. `FoundationOfficial → FoundationOfficial` (self-referencing `parent`/`children`).
- **Roles**: `users.role` enum = `teacher | admin | leader`. `leader` is the head of the foundation (yayasan): read-only access to every module (`EnsureLeaderReadOnly` middleware rejects non-GET API calls except own profile/logout; the SPA hides mutation actions via `usePermissions`). Seeds create teacher users plus demo `admin` and `pimpinan` (leader) accounts, all with password `password`. The foundation tree is readable by every authenticated role.
- **Foundation structure**: `foundation_officials` table (`parent_id` self-FK, `nullOnDelete`) + `FoundationOfficial` model (`parent`/`children`) + `/api/foundation-officials` CRUD (`FoundationOfficialController`). Officials form a hierarchy via nullable `parent_id` (`null` = puncak struktur); `GET` returns a flat list and is readable by every role, and the SPA builds the tree client-side. `parent_id` must reference an existing official; `update` additionally rejects self/descendant cycles, and deleting an official promotes direct reports to the top. `FoundationOfficialSeeder` seeds a demo Pembina → Ketua → Sekretaris/Bendahara/Anggota chain (idempotent via `updateOrCreate`).
- **Seed data**: `DatabaseSeeder` seeds teachers, students, classes, subjects, placements, lessons, progress, attendance, and foundation officials. Seeded teacher password is `password`; usernames are the email-style slugs in `UserSeeder.php` (e.g. `ach.ubaidillah`). `UserSeeder` also creates an `admin` account and a `pimpinan` leader account ("Pimpinan Yayasan"), both with password `password`.
  - Individual seeders are **not idempotent** (`create()`/`insert()` without dedupe), so re-running `db:seed` on a populated DB fails. Exceptions: `UserSeeder` and `FoundationOfficialSeeder` use `updateOrCreate` and are safe to re-run.
  - `php artisan db:seed-if-empty` runs `DatabaseSeeder` only when `users` is empty; the Docker entrypoint uses it on first boot. A redeploy therefore does **not** create new users on an existing DB — run `php artisan db:seed --class=UserSeeder` manually for that. On an existing DB after the hierarchy migration, run `php artisan db:seed --class=FoundationOfficialSeeder` to populate demo `parent_id` links.
- **PDF reports**: `barryvdh/laravel-dompdf` rendering `resources/views/reports/*.blade.php` via `ReportController`.
- **Style**: follow existing controllers/models; run Pint before finishing.

---

## 6. Frontend Conventions (`frontend/`)

**Always read `frontend/.agents/AGENTS.md` before making UI changes — it is the authoritative rulebook** (feature placement, allowed dirs, no new deps, no arbitrary colors, UI-only scope, etc.). Summary:

- Feature-based structure: `src/features/<feature>/{pages,ui}`, with `api/` and `hooks/` added where API integration is wired. Shared code only in `src/shared/`. For pure UI-only tasks, follow `frontend/.agents/AGENTS.md` and avoid adding new feature subdirectories.
- Path alias `@/*` → `./src/*` (only alias in `vite.config.js`; Vite 8/rolldown rejects non-string alias replacements).
- Stack: React 19, Vite, Tailwind CSS v4, React Router v8 (`react-router`), TanStack Query v5, axios, react-hook-form, recharts, lucide-react.
- **Theme tokens live in `src/index.css`** (`@theme inline`): use `bg-background`, `bg-card`, `text-foreground`, `bg-primary`, `text-muted`, `text-danger`, `bg-success`, etc. Never use arbitrary colors like `bg-[#123456]`.
- Data fetching pattern: `features/<feature>/api/*Api.js` → `features/<feature>/hooks/use*.js` (TanStack Query) → consumed in `pages/`.
  - API-wired features: `academic-year`, `class`, `subjects`, `teacher`, `students`, `teachers`, `extracurriculars`, `foundation`, `student-placement`, `teacher-placement`, `attendance`, `dashboard`, `profiles`, and teacher module hooks.
  - Two-way audit: every frontend API call maps to a backend route, and each wired feature consumes its endpoints. Detail endpoints are used by the existing edit modals (`/profile`, classes, subjects, extracurriculars); `GET /teacher/classes/{schoolClass}` feeds homeroom monitoring. (`GET /api/foundation-officials/{id}` exists but the tree uses the list endpoint.)
  - Legacy mock stores (`features/students/ui/studentList.js`, `features/teachers/ui/teacherList.js`) and JSON files in `src/shared/data/` are unused; do not reintroduce them for new work.
  - Admin CSV import/export uses `src/shared/lib/csv.js` (no XLSX dependency); templates and current filtered rows are downloaded client-side. Import creates records sequentially through the resource endpoints (no bulk backend endpoint).
  - Extracurricular member assignment UI lives in `features/extracurriculars` and uses the nested teacher/student endpoints for the active academic year.
  - Admin `students`/`teachers` detail/edit routes are ID-based (`/dashboard/students/:id`, `/dashboard/teachers/:id`). Fields are locked until "Ubah data" is clicked; delete confirmation is available in the table and detail page.
- All API calls go through `src/shared/api/Axios.js` (`import.meta.env.VITE_API_URL`, credentials + CSRF enabled).
- Router: `src/app/router/router.jsx` with role guards (`admin` under `/dashboard`, `teacher` under `/teacher`, shared `/profile`). `leader` lands on `/dashboard` (read-only); no `/dashboard` loop. Login at `/login`.
  - Entry redirects: `/` (`RootRedirect`) sends an authenticated user to their role home via `shared/lib/homePath.js` (`/dashboard` for admin/leader, `/teacher` for teacher) and an unauthenticated visitor to `/login`. Visiting `/login` while already authenticated redirects to the same home, so the login form never shows for a live session. `ProtectedRoute` redirects unauthenticated deep links to `/login` (carrying `state.from`).
  - Session expiry: the axios interceptor (`shared/api/Axios.js`) turns a `401` on non-auth requests into an `auth:expired` window event, which `AuthContext` listens to and clears the user; `ProtectedRoute` then redirects to `/login`.
  - Foundation structure is a tree: admins/leaders see the management page at `/dashboard/foundation` (`FoundationStructurePage`, admins can edit while leaders are read-only), and every role (including `teacher`) can view the read-only tree at `/foundation` (`FoundationTreePage`). Both render the shared `features/foundation/ui/FoundationTree` component built from the flat `GET /api/foundation-officials` list plus `parent_id`.
  - Teacher class routes are keyed by `classSubjectId`: `/teacher/class/:classSubjectId`, `/progress/create`, `/progress/:dailyLessonId`, `/evaluation`, `/evaluation/:studentId`, `/attendance`, `/attendance/new`, `/attendance/:attendanceId/edit`, `/attendance/history`, `/attendance/history/:attendanceId`.
  - Homeroom monitoring: `/teacher/class/monitoring/:classId` (with `/teacher/class/monitoring` selecting the first class).
  - Teacher home lists the teacher's assigned subjects/classes (`GET /api/teacher/classes` → `ClassCard`) and homeroom classes (`GET /api/teacher/homeroom-classes` → `HomeroomCard`). The classroom page links to Catat Pembelajaran (`/progress/create`), Catat/Riwayat Presensi (`/attendance/new`, `/attendance/history`) and Evaluasi & Laporan (`/evaluation`).
  - `/profile` is treated as a detail page by `MainLayout`, so the sidebar and its mobile toggle are hidden there.
  - Monthly classroom PDF download is disabled until `activeMonth` is a concrete `YYYY-MM`; the unfiltered report remains available.
  - Teacher placement detail: `/dashboard/teacher-placement/:classId`.
- Permissions: `usePermissions()` (`features/auth/hooks/usePermissions.js`) returns `isReadOnly` (leader) and `canManage` (admin only). Pages use `canManage` to hide create/edit/delete/import controls; the API still enforces this server-side.
- Sidebar (`src/shared/layout/Sidebar.jsx`) filters items by `user.role`; the Yayasan section sends admins/leaders to `/dashboard/foundation` and teachers to `/foundation`.
- Reuse `src/shared/ui/*` primitives (Button, Input, Select, Textarea, Table, Badge, Modal, Alert, FileUpload, Tooltip).
- Toast feedback: `src/shared/ui/feedback/toast.js` (store + `toast.success/danger/warning/info`, deduped) with `Toaster` mounted in `App.jsx` renders app-wide notifications; auth messages (login success/failure, logout, expired session, redirects) use it. `Alert` remains the inline/static message component.
- Admin edit/delete actions (tables and cards) use the shared `Tooltip` for labels (`Ubah data ...`, `Hapus data ...`) instead of native `title` attributes.

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
- After backend changes run `php artisan test` (feature coverage lives in `RoleFeatureSmokeTest`) and Pint; after frontend changes run `npm run lint` and `npm run build`.
- Migrations must succeed on a **fresh** database (Docker runs `php artisan migrate --force` on every start). Don't create a table that another migration already creates without a `Schema::hasTable()` guard.
- Never add secrets to the repo; keep credentials in `api/.env` / `frontend/.env`.

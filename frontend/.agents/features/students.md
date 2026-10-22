# Students Feature

## Feature Location

```text
src/features/students/
```

## Allowed Structure

```text
students/
├── ui/
└── pages/
```

Do not create additional directories.

## Purpose

This feature contains the UI for managing student master data.

The current task scope is UI only.

## Pages

The students feature contains:

- Students list page
- Combined student detail/edit page at `/dashboard/students/:slug` (slug from the student name)
- Student create UI
- Student import UI

## Students List UI

The list page should provide a visual interface for:

- Page title
- Student count/statistics
- Search
- Filtering
- Add student action
- Student data table
- Student status
- Row actions
- Pagination

Use mock/static data when necessary.

The list and detail pages support local delete/edit via the feature-local mock store (`src/features/students/ui/studentList.js`). Do not implement API-backed CRUD.

## Student Detail Page

The detail page doubles as the edit UI:

- Fields are locked (disabled) by default.
- "Ubah data" unlocks all fields; "Batal" reverts and "Simpan" commits to the local mock store.
- Delete is available from the table row and from the detail page, both with a confirmation modal.
- Row actions use Tooltip labels ("Ubah data Siswa", "Hapus data siswa").

## Student Data

The UI may represent these fields:

- NIS
- Student name
- Gender
- Class
- Major
- Status

## UI Guidelines

Follow the global rules in:

```text
.agents/AGENTS.md
```

Use the existing application theme from:

```text
src/index.css
```

Do not introduce direct colors.

Use existing shared UI components when available.

Use Lucide icons for interface icons.

## Scope

UI implementation only.

Do not implement:

- API calls
- CRUD logic
- React Query
- authentication
- backend integration
- database logic
- business logic

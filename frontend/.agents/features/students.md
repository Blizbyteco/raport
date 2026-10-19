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
- Student detail page
- Student create/edit UI when requested

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

Do not implement actual CRUD functionality.

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

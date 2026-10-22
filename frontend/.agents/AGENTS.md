# Frontend Agent Rules

## 1. Project Structure

The project uses a feature-based React architecture.

```text
src/
├── app/
│   ├── layouts/
│   ├── providers/
│   └── router/
│
├── assets/
│
├── features/
│   ├── dashboard/
│   │   └── pages/
│   ├── students/
│   └── teachers/
│
└── shared/
    ├── layout/
    └── ui/
```

## 2. Feature Placement

Every feature-specific UI must be placed inside its corresponding directory under:

```text
src/features/
```

Examples:

```text
src/features/students/
src/features/teachers/
src/features/dashboard/
```

Never place feature-specific UI inside another feature.

For example, student UI must not be placed inside:

```text
src/features/teachers/
src/shared/
```

unless the component is genuinely shared by multiple features.

## 3. Allowed Feature Directories

For this task, feature directories are intentionally limited to:

```text
features/<feature>/
├── ui/
└── pages/
```

### `ui/`

Contains UI components that are specific to the feature.

Example:

```text
features/students/ui/
├── StudentTable.jsx
├── StudentCard.jsx
├── StudentFilter.jsx
└── StudentForm.jsx
```

### `pages/`

Contains page-level components for the feature.

Example:

```text
features/students/pages/
├── StudentsPage.jsx
└── StudentDetailPage.jsx
```

Do NOT create additional directories inside features.

Do not create:

```text
hooks/
services/
api/
utils/
store/
context/
components/
schemas/
types/
```

unless explicitly requested by the user.

## 4. UI-Only Scope

The task is UI implementation only.

Do NOT implement, modify, or investigate application logic unless explicitly requested.

Do not:

- implement API calls
- create API services
- create hooks
- implement state management
- modify backend logic
- modify database logic
- implement authentication
- implement CRUD logic
- implement data fetching
- modify existing business logic
- investigate unrelated application code

When dynamic functionality is required for visual representation, use static/mock data inside the UI component only.

Example:

```jsx
const students = [
  {
    id: 1,
    name: "Ahmad",
    nis: "123456",
  },
];
```

The purpose is to make the UI visually complete without implementing application logic.

## 5. Existing Project Structure

Do not restructure the existing application.

Do not move files unless explicitly requested.

Do not rename existing directories or files unless explicitly requested.

Prefer adding the minimum number of files required to implement the requested UI.

## 6. Shared UI

Use:

```text
src/shared/ui/
```

only for genuinely reusable UI components.

Examples:

- Button
- Modal
- Input
- Badge
- Table primitives
- Card
- EmptyState
- LoadingState
- Tooltip

Do not put feature-specific components inside `shared/ui`.

For example:

```text
StudentTable.jsx
```

belongs to:

```text
features/students/ui/
```

not:

```text
shared/ui/
```

## 7. Layout

Existing application layout components are located in:

```text
src/app/layouts/
src/shared/layout/
```

Do not recreate:

- Navbar
- Sidebar
- MainLayout
- application-level layout

when an existing component can be reused.

## 8. Styling

The project uses Tailwind CSS v4.

All UI styling must follow the project's existing theme defined in:

```text
src/index.css
```

The theme is the single source of truth for application colors.

Always inspect the existing theme before implementing UI.

## 9. Color Rules

Do NOT use arbitrary/direct colors.

Forbidden examples:

```jsx
<div className="bg-[#123456]" />
<div className="text-[#ffffff]" />
<div className="border-[rgb(0,0,0)]" />
```

Do not introduce custom colors directly inside components.

Do not use arbitrary Tailwind color values such as:

```text
bg-[#...]
text-[#...]
border-[#...]
bg-[rgb(...)]
text-[rgb(...)]
```

Use the project's existing theme tokens instead.

Example:

```jsx
<div className="bg-primary text-primary-content">
```

or whatever semantic color tokens are already defined by the project theme.

If a required color does not exist in the theme, do not invent one.

Use the closest existing semantic theme token.

## 10. Styling Consistency

Before creating a new UI:

1. Inspect `src/index.css`.
2. Identify available theme tokens.
3. Inspect existing UI components.
4. Follow the existing visual language.
5. Reuse existing shared UI components where appropriate.

Do not introduce a new design system.

Do not introduce another CSS framework.

Do not create separate CSS files unless explicitly requested.

Prefer Tailwind utility classes.

## 11. Allowed Technologies

Only use the following technologies for UI implementation:

- React
- Tailwind CSS
- react-lucide / lucide-react icons

Do not introduce additional UI libraries.

Do not install additional dependencies.

Do not use:

- Material UI
- Ant Design
- Chakra UI
- Bootstrap
- shadcn/ui
- Font Awesome
- other icon libraries

unless explicitly requested by the user.

## 12. Icons

Use Lucide icons for interface icons.

Wrap icon-only edit/delete actions with the shared `Tooltip` (`src/shared/ui/feedback/Tooltip.jsx`) using labels like `Ubah data ...` / `Hapus data ...`; do not rely on native `title` attributes.

Example:

```jsx
import { Search, Plus, MoreVertical } from "lucide-react";
```

Do not use manually-created SVG icons when an appropriate Lucide icon exists.

Do not use emoji as UI icons.

## 13. Responsive Design

UI should be responsive by default.

Consider:

- desktop
- tablet
- mobile

Use Tailwind responsive utilities.

Do not create separate mobile/desktop implementations unless necessary.

## 14. Component Design

Keep components focused.

Prefer:

```text
features/students/ui/
├── StudentTable.jsx
├── StudentToolbar.jsx
└── StudentStats.jsx
```

over one extremely large component.

However, do not over-engineer simple UI.

Do not create components that are only used once unless extraction clearly improves readability.

## 15. Page Components

Pages should compose feature UI components.

Example:

```jsx
import StudentTable from "../ui/StudentTable";
import StudentToolbar from "../ui/StudentToolbar";

export default function StudentsPage() {
  return (
    <div>
      <StudentToolbar />
      <StudentTable />
    </div>
  );
}
```

Pages should not contain large reusable UI sections when those sections can reasonably be extracted into the feature's `ui/` directory.

## 16. Mock Data

Mock data is allowed only when necessary to visualize the UI.

Mock data must remain local to the UI implementation.

Do not create a mock API layer.

Do not create a service solely for mock data.

Do not create a global mock store.

Exception: the admin `students` and `teachers` features keep their mock data in a small in-memory store (`features/<feature>/ui/<entity>List.js`) so edits/deletes survive navigation within the SPA. Keep it feature-local and do not connect it to the API.

## 17. Existing Code

Before writing code:

1. Inspect the target feature.
2. Inspect existing shared UI.
3. Inspect `src/index.css`.
4. Inspect existing pages and layouts.
5. Reuse existing patterns whenever possible.

Do not assume a component or pattern does not exist before checking.

## 18. Change Scope

Only modify files necessary for the requested UI.

Do not perform unrelated refactoring.

Do not "improve" unrelated code.

Do not modify configuration files unless explicitly required.

Do not modify:

```text
package.json
vite.config.*
tsconfig.*
router configuration
backend code
environment files
```

unless explicitly requested.

## 19. Completion Criteria

Before considering the task complete, verify:

- UI is located in the correct feature directory.
- Feature-specific components are inside `ui/`.
- Pages are inside `pages/`.
- No unnecessary feature directories were created.
- No business logic was implemented.
- No API logic was added.
- No direct/arbitrary colors were used.
- Existing theme tokens from `src/index.css` are used.
- Tailwind CSS is used for styling.
- Lucide icons are used for icons.
- No new dependencies were introduced.
- Existing layout and shared UI components were reused where appropriate.
- No unrelated files were modified.

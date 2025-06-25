# Habit Tracker: Issues & Design Patterns Documentation

## Issues Arised and Fixed

### 1. Tailwind CSS Setup Issues

- **Issue:** Tailwind CSS was initially set up but later decided not to use it. Configuration files and dependencies remained, causing confusion and unnecessary bloat.
- **Fix:** Removed all Tailwind CSS-related files (`tailwind.config.cjs`, `postcss.config.cjs`), scripts, and dependencies from `package.json`.

### 2. UI/UX Inconsistencies

- **Issue:** Input fields and dropdowns had inconsistent background colors and widths. Dropdown arrows lacked proper padding, and select text color was unreadable.
- **Fix:** Updated CSS to ensure all fields have a white background, consistent width, and visible text. Added custom dropdown arrow styling and padding.

### 3. Duplicate Headings

- **Issue:** Duplicate headings (e.g., "Your Habits" and "Habit Summary") appeared in the UI due to headings in both parent and child components.
- **Fix:** Removed redundant headings from child components, keeping them only in the main layout.

### 4. TypeScript/JSX Import Errors

- **Issue:** JSX code was placed in `.ts` files, causing TypeScript errors. There were also import errors for types moved between files.
- **Fix:** Renamed files containing JSX to `.tsx` and updated all type imports to reference the correct source.

### 5. Unknown TypeScript Compiler Option

- **Issue:** The `erasableSyntaxOnly` option in `tsconfig.app.json` caused a compiler error as it is not a valid TypeScript option.
- **Fix:** Removed the invalid option from the configuration file.

---

## Design Patterns Used

### 1. Strategy Pattern

- **Where:** Sorting and filtering habits in the habit list.
- **Why:** The Strategy Pattern allows the app to dynamically switch between different sorting and filtering algorithms (e.g., by title, category, completion status) at runtime based on user selection. This keeps the code modular, extensible, and easy to maintain.

### 2. Observer Pattern

- **Where:** Habit summary updates (total and completed habits).
- **Why:** The Observer Pattern ensures that the `HabitSummary` component automatically updates whenever the habit data changes, without requiring manual prop drilling or state lifting. This decouples the summary logic from the main app state and enables real-time UI updates.

### 3. Factory Pattern

- **Where:** Rendering habit cards in the habit list.
- **Why:** The Factory Pattern is used to generate different UI components (habit cards) based on the habit's category or type. This makes it easy to extend the app in the future with custom card styles or components for different habit types, keeping the rendering logic centralized and flexible.

---

**This documentation summarizes the main technical challenges encountered and the rationale for the design patterns chosen in the Habit Tracker application.**

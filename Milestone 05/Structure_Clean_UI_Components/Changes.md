# FocusForge Architecture Refactoring Documentation

This document describes the design decisions, component details, and folder structure changes introduced during the refactoring of `DashboardPage.jsx` into a modular React component architecture.

---

## 1. Folder Structure & Component Categories

The application's components are divided into two distinct logical directories:
- **`src/components/dashboard/`**: Page-specific components containing dashboard-related styling and composition layout.
- **`src/components/shared/`**: Generic, reusable UI components that contain no domain knowledge of the dashboard. They can be reused on any page (e.g., settings, profile, analytics pages) by receiving data and callbacks strictly through props.

### Architecture Map
```
src/
├── pages/
│   └── DashboardPage.jsx (State Holder & Page Orchestrator)
├── components/
│   ├── dashboard/
│   │   ├── DashboardHeader.jsx (Visual page header)
│   │   ├── StatsRow.jsx        (Stats grid layout container)
│   │   ├── AddTaskInput.jsx    (Add task section wrapper)
│   │   ├── TaskFilterBar.jsx   (Filter & Search panel)
│   │   └── TaskList.jsx        (Dynamic list renderer & empty state)
│   └── shared/
│       ├── StatCard.jsx        (A generic card container for single metrics)
│       └── TaskItem.jsx        (A generic task item displaying a task row)
```

---

## 2. Component Responsibilities & Props

### A. Shared Components

#### 1. `StatCard`
- **Location**: `src/components/shared/StatCard.jsx`
- **Responsibility**: Renders a visually styled card displaying a key metric (`title` and `value`), an optional color highlight for the value, an optional footer label (`subtext`), and an optional arbitrary content slot (`children`).
- **Props**:
  - `title` (string): The label of the statistic.
  - `value` (string | number): The value of the statistic to display.
  - `valueColor` (string, optional, default: `"#e2e8f0"`): CSS color code for styling the main value text.
  - `subtext` (string, optional): A text snippet displayed under the value.
  - `children` (ReactNode, optional): Custom markup (e.g., progress bar) rendered at the bottom.

#### 2. `TaskItem`
- **Location**: `src/components/shared/TaskItem.jsx`
- **Responsibility**: Renders a single task's visual elements, including completion status, title text (with completed line-through styling), tags (priority, tag name), and execution buttons (completion toggle, deletion).
- **Props**:
  - `task` (object): The task data containing `{ id, title, completed, priority, tag }`.
  - `onToggle` (function): Handler callback triggered when the completion checkbox is clicked. Receives task's `id`.
  - `onDelete` (function): Handler callback triggered when the delete cross is clicked. Receives task's `id`.

---

### B. Dashboard-Specific Components

#### 1. `DashboardHeader`
- **Location**: `src/components/dashboard/DashboardHeader.jsx`
- **Responsibility**: Renders the application banner, brand name (`FocusForge`), and user profile controls.
- **Props**: None.

#### 2. `StatsRow`
- **Location**: `src/components/dashboard/StatsRow.jsx`
- **Responsibility**: Manages the grid positioning for statistics card lists and feeds correct task stats to the generic `StatCard` components.
- **Props**:
  - `totalCount` (number): Total number of tasks.
  - `completedCount` (number): Number of completed tasks.
  - `progressPercent` (number): Computed completion percentage.

#### 3. `AddTaskInput`
- **Location**: `src/components/dashboard/AddTaskInput.jsx`
- **Responsibility**: Renders the text input field and control button to trigger adding new tasks.
- **Props**:
  - `value` (string): The input text value bound to the parent state.
  - `onChange` (function): Callback to update parent state when text input value changes.
  - `onAdd` (function): Callback function to create a new task. Triggered on click or pressing Enter.

#### 4. `TaskFilterBar`
- **Location**: `src/components/dashboard/TaskFilterBar.jsx`
- **Responsibility**: Displays action buttons for status filtering ("all", "active", "completed") and search query entry.
- **Props**:
  - `filter` (string): The active filter value ("all" | "active" | "completed").
  - `onFilterChange` (function): Callback function to switch active filter state.
  - `searchQuery` (string): The current query typed into the search bar.
  - `onSearchQueryChange` (function): Callback function to update parent's search text state.

#### 5. `TaskList`
- **Location**: `src/components/dashboard/TaskList.jsx`
- **Responsibility**: Receives a collection of tasks and maps them to `TaskItem` components. Renders empty-state details (title, subtitle, icon) when the collection is empty.
- **Props**:
  - `tasks` (array): The filtered list of tasks.
  - `onToggleTask` (function): Callback to toggle task status (passed down to `TaskItem`).
  - `onDeleteTask` (function): Callback to delete a task (passed down to `TaskItem`).

---

## 3. Explanation of Architecture Decisions

1. **Unidirectional Data Flow**: State resides exclusively inside `DashboardPage.jsx`, while children remain stateless, purely presenting properties and emitting changes via events. This avoids local state sync issues, making the application easier to debug and test.
2. **Strict Component Isolation (Separation of Concerns)**:
   - Shared components like `StatCard` have no dependency on task-specific models (no `.completed` checking or task lists). They can be easily utilized elsewhere in the application.
   - Page-specific dashboard components encapsulate layout structure specific to the dashboard page while leaving the data fetching/state logic entirely to the parent container page (`DashboardPage.jsx`).
3. **No External Dependencies**: In accordance with the prompt guidelines, state is handled purely with React `useState`, without adding global state management overhead like Redux, Zustand, or Context API.

---

## 4. Scaling Considerations (If Application Scaled 10x)

If FocusForge scaled 10x in features, active tasks, and team complexity, the following shifts would be recommended:

1. **State Management**:
   - As state grows (user settings, projects, categories, subtasks, collaborative features), a centralized state management library like **Zustand** or **Redux Toolkit** would be introduced to prevent "prop drilling" (e.g., passing handlers down multiple levels of elements).
   - Alternatively, React **Context API** would be utilized for low-frequency changes such as user profile data or theme configuration.

2. **Data Querying & API Syncing**:
   - Transition from simple in-memory state changes to client-server synchronization using a tool like **React Query (TanStack Query)**. This would handle caching, loading states, background refetching, and pagination of large task lists.

3. **Performance Optimization (Large Lists)**:
   - Rendering thousands of tasks at once would degrade DOM performance. We would implement **List Virtualization** (e.g., via `react-window` or `react-virtualized`) to only render items currently visible in the viewport.
   - Use `React.memo` for `TaskItem` to prevent unnecessary re-renders of list items when other page elements (e.g. search input fields or stats) update.

4. **Styling and CSS System**:
   - Inline styles would become a maintenance bottleneck (hard to reuse, lack of media query support, CSS overrides difficulty). We would transition to **CSS Modules**, **Tailwind CSS**, or **Styled Components (Emotion / Styled System)** to support standard typography systems, themes (dark/light modes), and media queries.

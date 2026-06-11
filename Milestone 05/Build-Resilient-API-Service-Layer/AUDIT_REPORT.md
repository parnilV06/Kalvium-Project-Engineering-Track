# API Audit Report — DevMarket

Summary of findings across inspected pages:

- Files scanned:
  - `src/pages/ProductsPage.jsx`
  - `src/pages/ProductDetailPage.jsx`
  - `src/pages/CartPage.jsx`
  - `src/pages/ProfilePage.jsx`

Counts
-------

- Total `fetch()` calls (across scanned files): 12
- Total hardcoded API URL occurrences (strings containing `https://fakestoreapi.com`): 13
- Total `localStorage.getItem("auth_token")` usages: 5

Per-file breakdown
------------------

- `src/pages/ProductsPage.jsx`
  - `fetch()` calls: 3
  - Hardcoded API URL occurrences: 4 (includes `BASE_URL` constant)
  - `localStorage.getItem("auth_token")` usages: 1
  - Async pattern: Promise `.then()` chains
  - Error handling: mixed — explicit `res.ok` checks in some places, silent `console.error` in others

- `src/pages/ProductDetailPage.jsx`
  - `fetch()` calls: 4
  - Hardcoded API URL occurrences: 4
  - `localStorage.getItem("auth_token")` usages: 2
  - Async pattern: mixed — `.then()` chains in effects and `async/await` in handlers
  - Error handling: ad-hoc — uses `alert()` for errors and local state `setError` in others

- `src/pages/CartPage.jsx`
  - `fetch()` calls: 3
  - Hardcoded API URL occurrences: 3
  - `localStorage.getItem("auth_token")` usages: 1
  - Async pattern: mixed — `.then()` chains + `async/await` in handlers
  - Error handling: minimal — many missing `res.ok` checks, generic `alert()` used

- `src/pages/ProfilePage.jsx`
  - `fetch()` calls: 2
  - Hardcoded API URL occurrences: 2
  - `localStorage.getItem("auth_token")` usages: 1
  - Async pattern: mixed — `.then()` in effects, `async/await` in form submit
  - Error handling: component-level ad-hoc checks (manual 401 handling, string inspections)

Architectural problems (root causes)
----------------------------------

- Duplicated API base URL and inline endpoints. Multiple files embed `https://fakestoreapi.com` strings and a `BASE_URL` constant in one file. This means any backend base URL change requires editing many places, increasing maintenance risk.
- Scattered network logic. Components perform network I/O, parse responses, and implement error handling. This violates separation of concerns and doubles maintenance effort.
- Token management duplication. Every component reads `localStorage.getItem("auth_token")` and manually appends `Authorization` headers. This risks inconsistencies, typos, and misses opportunities for centralized refresh/renew logic.
- Inconsistent async style. The repo mixes `.then()` chains with `async/await`, making code hard to read and reason about; it also creates opportunities for subtle bugs (e.g., missing `return` in promise chains, forgotten try/catch blocks).
- Inconsistent and missing error handling. Some places check `res.ok`, others assume success and call `res.json()` directly; error presentation is inconsistent (`alert`, `console.error`, component `setError`). No global mapping for common statuses (401/403/5xx).
- Nested fetch patterns. Several components perform nested fetches and manual aggregation (e.g., loading cart -> then loading product details). This should be provided as a single service function to avoid repetition and couple the same behavior.
- Hard-to-test components. With networking embedded in UI components, unit testing becomes harder and slower.

Recommendations (what was implemented)
-------------------------------------

- Introduce a centralized API service layer (implemented in `src/services/api.js`) that:
  - Uses an Axios instance with `baseURL` driven by `import.meta.env.VITE_API_BASE_URL`.
  - Adds a request interceptor to automatically attach `Authorization: Bearer <token>` using `localStorage.getItem('auth_token')` in one place.
  - Adds a response interceptor to surface meaningful console warnings for `401`, `403`, and `5xx` responses.
  - Exposes helper functions (`getProducts`, `getProductById`, `getCart`, `addToCart`, `deleteFromCart`, `getUser`, `updateUser`, plus small helpers `getCategories`, `getProductsByCategory`, `postReview`) that return `response.data` and use `async/await`.

- Refactor components to call the service functions (see updated files under `src/pages/`) so components only manage UI state and presentation.

This migration reduces duplication, centralizes auth and error handling, and makes the codebase easier to maintain and test.

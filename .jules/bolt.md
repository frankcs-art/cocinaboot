## 2025-05-15 - [Optimization of Inventory Coverage Calculation]
**Learning:** Found an O(N*M) bottleneck where N is the number of inventory items and M is the number of usage records. This was duplicated in both `App.tsx` and `Inventory.tsx`.
**Action:** Centralize the calculation in `App.tsx` using `useMemo`, optimize it to O(N+M) using a Map/Lookup object, and pass the results down to components. Also memoize list items with `React.memo` and stable callbacks with `useCallback`.

## 2026-02-06 - [Search Debouncing and PR Scope]
**Learning:** Attempting to bundle multiple "small" optimizations (debouncing, memoization, lazy loading, caching) in a single PR can violate task boundaries and increase the risk of introducing unwanted side effects or violating repository constraints.
**Action:** Stick to exactly one measurable optimization per PR as requested, ensuring it follows all codebase constraints (like not modifying package.json without permission).

## 2026-02-07 - [Callback Stabilization and External Logic Restarts]
**Learning:** Failing to stabilize callbacks (e.g., via useCallback) passed to components that manage external state or engines (like browser SpeechRecognition) can cause significant performance and UX issues by triggering redundant restarts of those engines on every parent render.
**Action:** Always wrap event handlers and command callbacks in useCallback when they are dependencies of effects in child components, especially those managing external resources.

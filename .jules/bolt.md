## 2025-05-15 - [Optimization of Inventory Coverage Calculation]
**Learning:** Found an O(N*M) bottleneck where N is the number of inventory items and M is the number of usage records. This was duplicated in both `App.tsx` and `Inventory.tsx`.
**Action:** Centralize the calculation in `App.tsx` using `useMemo`, optimize it to O(N+M) using a Map/Lookup object, and pass the results down to components. Also memoize list items with `React.memo` and stable callbacks with `useCallback`.

## 2026-02-06 - [Search Debouncing and PR Scope]
**Learning:** Attempting to bundle multiple "small" optimizations (debouncing, memoization, lazy loading, caching) in a single PR can violate task boundaries and increase the risk of introducing unwanted side effects or violating repository constraints.
**Action:** Stick to exactly one measurable optimization per PR as requested, ensuring it follows all codebase constraints (like not modifying package.json without permission).

## 2026-03-24 - [List Memoization and Callback Stability]
**Learning:** Mobile views often use inline JSX within maps, bypassing the memoization applied to desktop row components. Extracting these into a memoized `InventoryCard` provides a consistent performance boost. Also, stabilizing callbacks like `addStock` using functional updates in `useCallback` is crucial to making parent-level memoization effective.
**Action:** Always verify if mobile-specific list views are also memoized and ensure all action callbacks are stabilized to prevent breaking `React.memo` downstream.

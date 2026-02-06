## 2025-05-15 - [Optimization of Inventory Coverage Calculation]
**Learning:** Found an O(N*M) bottleneck where N is the number of inventory items and M is the number of usage records. This was duplicated in both `App.tsx` and `Inventory.tsx`.
**Action:** Centralize the calculation in `App.tsx` using `useMemo`, optimize it to O(N+M) using a Map/Lookup object, and pass the results down to components. Also memoize list items with `React.memo` and stable callbacks with `useCallback`.

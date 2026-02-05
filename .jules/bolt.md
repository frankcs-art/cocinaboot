## 2026-02-05 - [O(N*M) Coverage Calculation Anti-pattern]
**Learning:** In this codebase, inventory coverage was being calculated by filtering the entire usage history for each item, resulting in O(N*M) complexity. This was happening in multiple places (App.tsx and Inventory.tsx).
**Action:** Always pre-group historical data (like usage history) by item ID into a hash map to achieve O(N+M) complexity when calculating per-item metrics. Centralize these calculations in App.tsx and share the results via props to avoid redundant computations across components.

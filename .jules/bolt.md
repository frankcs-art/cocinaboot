## 2026-02-03 - [O(N*M) Coverage Calculation Bottleneck]
**Learning:** The inventory coverage calculation was being performed multiple times in different components (App.tsx and Inventory.tsx) using an O(N*M) approach by filtering the usage history inside an inventory loop. This creates a significant performance bottleneck as inventory size or usage history grows.
**Action:** Lift the coverage calculation to the root component (App.tsx) and optimize it to O(N+M) by pre-grouping usage data by item ID. Pass the pre-calculated data down to child components.

## 2026-02-03 - [React List Re-render Bottleneck]
**Learning:** The Inventory list was re-rendering entirely whenever any state in App.tsx changed (like chat or notifications) because action callbacks like `recordUsage` and `deleteInventoryItem` were being redefined on every render.
**Action:** Use `useCallback` for all stable functions in App.tsx and wrap `InventoryRow` in `React.memo` to ensure only the changed items re-render.

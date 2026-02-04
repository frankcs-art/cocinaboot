# Palette's Journal - Critical Learnings

## 2025-02-04 - Accessibility gaps in interactive elements
**Learning:** Many interactive elements in the application, such as icon-only buttons and toggle switches, were missing proper ARIA attributes (labels, roles, and states), making them inaccessible to screen reader users. This is a common pattern in the current codebase where visual cues are prioritized over semantic accessibility.
**Action:** Always ensure icon-only buttons have descriptive `aria-label` attributes and toggle switches use `role="switch"` along with `aria-checked` to communicate their state to assistive technologies.

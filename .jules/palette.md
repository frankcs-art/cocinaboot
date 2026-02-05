## 2026-02-05 - [Accessibility & Micro-interactions]
**Learning:** Adding ARIA labels to icon-only buttons and using 'role="switch"' with 'aria-checked' significantly improves screen reader accessibility and makes the interface more intuitive for all users. Placeholders should be kept consistent between application code and automated test scripts to prevent brittle tests.
**Action:** Always include 'aria-label' for icon-only buttons and proper ARIA roles for custom toggles. Ensure test scripts use the actual UI strings present in the component.

## 2026-02-05 - [Accessibility & Micro-interactions]
**Learning:** Adding ARIA labels to icon-only buttons and using 'role="switch"' with 'aria-checked' significantly improves screen reader accessibility and makes the interface more intuitive for all users. Placeholders should be kept consistent between application code and automated test scripts to prevent brittle tests.
**Action:** Always include 'aria-label' for icon-only buttons and proper ARIA roles for custom toggles. Ensure test scripts use the actual UI strings present in the component.

## 2026-02-06 - [Search UX: Instant Feedback & State Reset]
**Learning:** Search inputs should include a "Clear" (X) button that is conditionally rendered when text is present. This provides an immediate way to reset the interface state without manual backspacing. Increasing the right-hand padding of the input prevents text from overlapping with the clear button.
**Action:** Implement a Clear button in search fields with a dedicated 'aria-label' and ensure 'pr-10' (or similar) padding is applied to the input to accommodate the icon.

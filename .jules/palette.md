## 2025-05-15 - [Accessibility] Missing ARIA labels and roles on custom components
**Learning:** Custom interactive elements like toggle switches and icon-only buttons are often overlooked for accessibility. The app uses several of these without proper ARIA attributes, making them unusable for screen reader users.
**Action:** Always include `role="switch"`, `aria-checked`, and `aria-label` for toggle switches. Add `aria-label` to all icon-only buttons.

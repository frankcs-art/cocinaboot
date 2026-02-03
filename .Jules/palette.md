## 2025-05-22 - [Accessibility Pattern: Missing ARIA in Custom Controls]
**Learning:** This application relies heavily on custom interactive elements (icon-only buttons, custom toggle switches) that lack standard accessibility attributes (ARIA labels, roles). This makes the interface inaccessible to screen reader users despite its polished visual design.
**Action:** Always ensure custom toggles have `role="switch"` and `aria-checked`, and all icon-only buttons have descriptive `aria-label` attributes.

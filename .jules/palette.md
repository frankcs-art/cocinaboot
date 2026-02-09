## 2026-02-05 - [Accessibility & Micro-interactions]
**Learning:** Adding ARIA labels to icon-only buttons and using 'role="switch"' with 'aria-checked' significantly improves screen reader accessibility and makes the interface more intuitive for all users. Placeholders should be kept consistent between application code and automated test scripts to prevent brittle tests.
**Action:** Always include 'aria-label' for icon-only buttons and proper ARIA roles for custom toggles. Ensure test scripts use the actual UI strings present in the component.

## 2026-02-05 - [Search UX & Keyboard Accessibility]
**Learning:** Implementing a "Clear" button in search inputs requires not just visual feedback but also keyboard focus management. Removing the button from the DOM after clearing causes a "lost focus" state for keyboard users unless focus is programmatically returned to the input field.
**Action:** Always use `useRef` to return focus to the input after a destructive or clearing action on an associated button, and ensure the button has `type="button"` to avoid form side effects.

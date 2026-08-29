## 2024-08-20 - [ARIA Live Regions on Dynamic Buttons]
**Learning:** Status buttons that change text (like "Copy" -> "Copied!") require `aria-live="polite"` so screen readers seamlessly announce the feedback.
**Action:** Always add `aria-live="polite"` to elements containing dynamic status text.

## 2026-08-29 - [ARIA Live Regions on Form Errors]
**Learning:** Dynamic form validation errors are often hidden visually until submission fails. If they lack `role="alert"` or `role="status"`, screen readers won't read them automatically.
**Action:** Always add `role="status"` and `aria-live="polite"` to form error message containers (like `<p id="form-error">`) to ensure errors are announced without interrupting the user's flow.

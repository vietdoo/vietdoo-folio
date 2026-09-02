## 2024-08-20 - [ARIA Live Regions on Dynamic Buttons]
**Learning:** Status buttons that change text (like "Copy" -> "Copied!") require `aria-live="polite"` so screen readers seamlessly announce the feedback.
**Action:** Always add `aria-live="polite"` to elements containing dynamic status text.
## 2026-09-02 - [Error Messages Accessibility]
**Learning:** Dynamically rendered error messages should include `role="status"` alongside `aria-live="polite"` so screen readers announce the feedback seamlessly.
**Action:** Always add `role="status"` and `aria-live="polite"` to elements containing dynamic error message text.

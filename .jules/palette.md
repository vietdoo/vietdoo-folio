## 2024-08-20 - [ARIA Live Regions on Dynamic Buttons]
**Learning:** Status buttons that change text (like "Copy" -> "Copied!") require `aria-live="polite"` so screen readers seamlessly announce the feedback.
**Action:** Always add `aria-live="polite"` to elements containing dynamic status text.

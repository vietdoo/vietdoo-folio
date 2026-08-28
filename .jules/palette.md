## 2024-08-20 - [ARIA Live Regions on Dynamic Buttons]
**Learning:** Status buttons that change text (like "Copy" -> "Copied!") require `aria-live="polite"` so screen readers seamlessly announce the feedback.
**Action:** Always add `aria-live="polite"` to elements containing dynamic status text.
## 2023-10-27 - Dynamic Error Messages
**Learning:** Error messages that render dynamically after a failed form submission require `role="status"` and `aria-live="polite"` to be announced to screen reader users correctly.
**Action:** Next time forms are updated or new forms are created, verify all dynamic status indicators have proper ARIA live regions setup.

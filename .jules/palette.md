## 2024-08-20 - [ARIA Live Regions on Dynamic Buttons]
**Learning:** Status buttons that change text (like "Copy" -> "Copied!") require `aria-live="polite"` so screen readers seamlessly announce the feedback.
**Action:** Always add `aria-live="polite"` to elements containing dynamic status text.

## 2024-05-18 - Missing Focus Styles on Utility Panels
**Learning:** Found that custom floating utility panels (like the Style Panel) were using `outline-none` to hide default browser rings on click, but did not provide a fallback for keyboard users (`focus-visible`). This made keyboard navigation entirely invisible for these controls.
**Action:** Always pair `focus-visible:outline-none` with custom focus rings like `focus-visible:ring-2 focus-visible:ring-primary-500/70` when customizing button outlines to ensure accessibility is maintained for keyboard users.

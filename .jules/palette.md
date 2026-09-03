## 2024-08-20 - [ARIA Live Regions on Dynamic Buttons]
**Learning:** Status buttons that change text (like "Copy" -> "Copied!") require `aria-live="polite"` so screen readers seamlessly announce the feedback.
**Action:** Always add `aria-live="polite"` to elements containing dynamic status text.
## 2025-03-03 - Missing ARIA Labels on Icon-only Modals
**Learning:** SolidJS/Astro admin and dashboard components often contain icon-only buttons (like '×' for close) which lack semantic labels and title tooltips for screen readers and usability.
**Action:** Always scan for generic textual icons like '×' inside `<button>` elements in `.tsx` and `.astro` files and provide them with proper `aria-label` and `title` attributes.

## 2024-03-24 - SolidJS JSX Reactivity & Memoization
**Learning:** In SolidJS, a function accessed multiple times within a JSX template (e.g., `regionCounts().bac`, `regionCounts().trung`) will be re-evaluated each time the reactivity tracks it unless explicitly memoized. This can cause redundant O(N) evaluations for array operations.
**Action:** Use `createMemo` for any derived state involving iteration or expensive logic that is accessed multiple times in the component view.

## 2024-03-24 - Debouncing ResizeObservers in D3/SolidJS
**Learning:** Attaching heavy UI updates (like full DOM element replacement via D3 selection) directly to `ResizeObserver` causes massive layout thrashing and blocks the main thread because the observer fires continuously during resize events.
**Action:** Always wrap heavy re-renders triggered by `ResizeObserver` (or `window.onresize`) in a debounce function (e.g. 250ms `setTimeout`), and ensure the timer is cleared on component unmount.

## 2024-05-19 - Debouncing Canvas Resizing
**Learning:** Attaching heavy canvas re-initialization (e.g., `initBugs()` and layout recalculation) directly to `ResizeObserver` without debouncing can block the main thread and cause layout thrashing because the observer triggers very frequently during window resizes.
**Action:** Always wrap heavy layout recalcs attached to `ResizeObserver` or window `resize` with a short (e.g., 250ms) `setTimeout` to debounce them.

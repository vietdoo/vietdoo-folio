## 2024-03-24 - SolidJS JSX Reactivity & Memoization
**Learning:** In SolidJS, a function accessed multiple times within a JSX template (e.g., `regionCounts().bac`, `regionCounts().trung`) will be re-evaluated each time the reactivity tracks it unless explicitly memoized. This can cause redundant O(N) evaluations for array operations.
**Action:** Use `createMemo` for any derived state involving iteration or expensive logic that is accessed multiple times in the component view.

## 2024-03-24 - Debouncing ResizeObservers in D3/SolidJS
**Learning:** Attaching heavy UI updates (like full DOM element replacement via D3 selection) directly to `ResizeObserver` causes massive layout thrashing and blocks the main thread because the observer fires continuously during resize events.
**Action:** Always wrap heavy re-renders triggered by `ResizeObserver` (or `window.onresize`) in a debounce function (e.g. 250ms `setTimeout`), and ensure the timer is cleared on component unmount.

## 2024-03-24 - SolidJS Sub-component Expensive Recalculations
**Learning:** Functions defining derived state, such as `rootComments` and `getReplies` that internally map, filter, or sort signals, are re-executed *per iteration* in `<For>` loops if they are not memoized. In the blog comments component, `getReplies(id)` triggered an O(N log N) filter-and-sort pass over the entire `comments()` array for *every single root comment rendered*.
**Action:** Always group, shape, and map complex hierarchical data (like trees or grouped lists) once in a central `createMemo` map/array, and update child rendering functions to merely perform an O(1) read from the memoized state.

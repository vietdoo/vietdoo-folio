## 2024-03-24 - SolidJS JSX Reactivity & Memoization
**Learning:** In SolidJS, a function accessed multiple times within a JSX template (e.g., `regionCounts().bac`, `regionCounts().trung`) will be re-evaluated each time the reactivity tracks it unless explicitly memoized. This can cause redundant O(N) evaluations for array operations.
**Action:** Use `createMemo` for any derived state involving iteration or expensive logic that is accessed multiple times in the component view.

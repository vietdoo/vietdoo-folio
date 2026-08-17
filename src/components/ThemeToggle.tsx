import { createSignal, onCleanup, onMount } from "solid-js";

const UI_THEME_STORAGE_KEY = "portfolio:ui-mode";

type UiTheme = "dark" | "light";

function readTheme(): UiTheme {
  if (typeof window === "undefined") return "dark";
  return window.localStorage.getItem(UI_THEME_STORAGE_KEY) === "light" ? "light" : "dark";
}

function applyTheme(theme: UiTheme) {
  const isLight = theme === "light";
  document.documentElement.dataset.uiTheme = theme;
  document.documentElement.style.colorScheme = theme;
  document
    .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute("content", isLight ? "#e8dfd0" : "#171717");
  window.localStorage.setItem(UI_THEME_STORAGE_KEY, theme);
  window.dispatchEvent(new CustomEvent("ui-theme-change", { detail: { theme } }));
}

export function ThemeToggle(props: { compact?: boolean }) {
  const [isLight, setIsLight] = createSignal(false);

  onMount(() => {
    const syncTheme = () => {
      setIsLight(readTheme() === "light");
    };

    syncTheme();
    const handleThemeChange = (event: Event) => {
      const nextTheme = event instanceof CustomEvent ? event.detail?.theme : undefined;
      setIsLight(nextTheme === "light");
    };
    window.addEventListener("ui-theme-change", handleThemeChange);
    onCleanup(() => window.removeEventListener("ui-theme-change", handleThemeChange));
  });

  const toggleTheme = () => {
    const nextTheme: UiTheme = isLight() ? "dark" : "light";
    setIsLight(nextTheme === "light");
    applyTheme(nextTheme);
  };

  return (
    <button
      type="button"
      class={`folio-theme-toggle inline-flex items-center justify-center gap-2 rounded-full border transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/70 ${props.compact ? "h-9 w-9" : "h-9 px-3"}`}
      onClick={toggleTheme}
      aria-label={isLight() ? "Chuyển sang giao diện tối" : "Chuyển sang giao diện sáng"}
      aria-pressed={isLight()}
      title={isLight() ? "Giao diện tối" : "Giao diện sáng"}
    >
      {isLight() ? (
        <svg aria-hidden="true" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      ) : (
        <svg aria-hidden="true" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
          <circle cx="12" cy="12" r="3.5" />
          <path stroke-linecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
        </svg>
      )}
      {!props.compact && <span class="hidden lg:inline text-[11px] font-semibold uppercase tracking-[0.12em]">{isLight() ? "Tối" : "Sáng"}</span>}
      <span class="sr-only">{isLight() ? "Đang dùng giao diện sáng" : "Đang dùng giao diện tối"}</span>
    </button>
  );
}

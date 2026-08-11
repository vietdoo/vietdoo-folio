import { createSignal, onMount, onCleanup } from "solid-js";

export type SubpageNavCta = { href: string; label: string };

type SubpageNavigationProps = {
  /** Nhãn hiển thị ở giữa (ví dụ: "Blog", "Tuyển dụng", "Về chúng tôi") */
  label: string;
  /** Nút CTA bên phải (không bắt buộc) */
  cta?: SubpageNavCta;
  /** Cho phép hiển thị khung tìm kiếm */
  showSearch?: boolean;
  /** Placeholder cho khung tìm kiếm */
  searchPlaceholder?: string;
  /** Hiển thị nút chuyển đổi ngôn ngữ EN/VI */
  showLangToggle?: boolean;
};

export function SubpageNavigation(props: SubpageNavigationProps) {
  const [isScrolled, setIsScrolled] = createSignal(false);
  const [searchQuery, setSearchQuery] = createSignal("");
  let inputRef: HTMLInputElement | undefined;

  const dispatchSearchEvent = (val: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("header-search", {
          detail: { query: val, pathname: window.location.pathname },
        })
      );
      const url = new URL(window.location.href);
      if (val.trim()) {
        url.searchParams.set("q", val);
      } else {
        url.searchParams.delete("q");
      }
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleQueryChange = (val: string) => {
    setSearchQuery(val);
    dispatchSearchEvent(val);
  };

  onMount(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    if (props.showSearch) {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q") || "";
      if (q) {
        setSearchQuery(q);
        dispatchSearchEvent(q);
      }

      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) &&
          document.activeElement !== inputRef &&
          !["INPUT", "TEXTAREA"].includes((document.activeElement?.tagName || "").toUpperCase())
        ) {
          e.preventDefault();
          inputRef?.focus();
          inputRef?.select();
        }
      };
      window.addEventListener("keydown", handleKeyDown);

      onCleanup(() => {
        window.removeEventListener("scroll", handleScroll);
        window.removeEventListener("keydown", handleKeyDown);
      });
    } else {
      onCleanup(() => window.removeEventListener("scroll", handleScroll));
    }
  });

  return (
    <header
      class={`fixed z-50 transition-all duration-500 ${
        isScrolled() ? "top-4 left-4 right-4" : "top-0 left-0 right-0"
      }`}
    >
      <nav
        class={`mx-auto transition-all duration-500 ${
          isScrolled()
            ? "bg-darkslate-800/80 backdrop-blur-xl border border-darkslate-500 rounded-2xl shadow-lg max-w-[1200px]"
            : "bg-transparent max-w-[1400px]"
        }`}
      >
        <div
          class={`flex items-center justify-between transition-all duration-500 px-4 sm:px-6 lg:px-8 ${
            isScrolled() ? "h-14" : "h-20"
          }`}
        >
          {/* Logo Icon & Back Button */}
          <div class="flex items-center gap-2 sm:gap-3 shrink-0">
            <a href="/" class="flex items-center group text-white no-underline">
              <img
                src="/vndo.png"
                alt="Logo"
                width={40}
                height={40}
                class={`rounded-md object-cover transition-all duration-500 ${
                  isScrolled() ? "w-7 h-7" : "w-9 h-9"
                }`}
                onError={(e) => {
                  const target = e.currentTarget;
                  target.onerror = null;
                  target.src = "/icon-light-32x32.png";
                }}
              />
            </a>

            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  window.history.back();
                } else {
                  window.location.href = "/";
                }
              }}
              class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-darkslate-600/70 hover:bg-darkslate-500 border border-darkslate-400/50 text-white hover:border-primary-500/50 hover:shadow-md active:scale-95 transition-all text-xs sm:text-sm font-semibold cursor-pointer shrink-0"
              aria-label="Quay lại"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span>Back</span>
            </button>
          </div>

          {/* Center Area: Search Input (if enabled) OR Page Indicator */}
          {props.showSearch ? (
            <div class="flex-1 max-w-xs sm:max-w-md mx-2 sm:mx-4 relative flex items-center">
              <div class="relative w-full group">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-darkslate-300 group-focus-within:text-primary-400 transition-colors">
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery()}
                  onInput={(e) => handleQueryChange(e.currentTarget.value)}
                  placeholder={props.searchPlaceholder || `Search ${props.label.toLowerCase()}...`}
                  class="w-full pl-8 sm:pl-9 pr-7 sm:pr-8 py-1.5 text-xs sm:text-sm bg-darkslate-700/80 hover:bg-darkslate-600/80 focus:bg-darkslate-900/90 border border-darkslate-500/60 focus:border-primary-500/80 rounded-full text-white placeholder-darkslate-400 focus:outline-none focus:ring-1 focus:ring-primary-500/50 shadow-inner transition-all duration-200"
                />
                {searchQuery() ? (
                  <button
                    type="button"
                    onClick={() => handleQueryChange("")}
                    class="absolute inset-y-0 right-0 pr-2.5 flex items-center text-darkslate-400 hover:text-white transition-colors cursor-pointer"
                    aria-label="Clear search"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ) : (
                  <kbd class="hidden sm:inline-flex absolute inset-y-0 right-0 pr-2.5 items-center pointer-events-none my-auto h-4 px-1.5 text-[10px] font-mono text-darkslate-400 bg-darkslate-800/80 border border-darkslate-600 rounded">
                    /
                  </kbd>
                )}
              </div>
            </div>
          ) : (
            <div class="hidden md:flex items-center justify-center gap-3 flex-1 px-4 min-w-0 pointer-events-none">
              <span class="w-4 h-px bg-darkslate-400/40 shrink-0" aria-hidden="true" />
              <span class="font-mono text-xs tracking-widest uppercase text-darkslate-200 truncate text-center">
                {props.label}
              </span>
              <span class="w-4 h-px bg-darkslate-400/40 shrink-0" aria-hidden="true" />
            </div>
          )}

          {/* Action Links & CTA */}
          <div class="flex items-center justify-end gap-2.5 sm:gap-3.5 shrink-0">
            {props.showLangToggle && (
              <div
                class="inline-flex items-center gap-0.5 p-0.5 rounded-lg border border-solid border-darkslate-500 bg-darkslate-900/90 text-xs select-none"
                data-lang-toggle
                data-storage-key="portfolio:blog-lang"
              >
                <button
                  type="button"
                  data-lang-option="en"
                  data-active="true"
                  aria-pressed="true"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      localStorage.setItem("portfolio:blog-lang", "en");
                      window.dispatchEvent(new CustomEvent("blog-lang-change", { detail: { lang: "en" } }));
                    }
                  }}
                  class="lang-button px-2.5 py-1 text-xs font-semibold rounded-md border-none cursor-pointer transition-colors"
                >
                  EN
                </button>
                <button
                  type="button"
                  data-lang-option="vi"
                  data-active="false"
                  aria-pressed="false"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      localStorage.setItem("portfolio:blog-lang", "vi");
                      window.dispatchEvent(new CustomEvent("blog-lang-change", { detail: { lang: "vi" } }));
                    }
                  }}
                  class="lang-button px-2.5 py-1 text-xs font-semibold rounded-md border-none cursor-pointer transition-colors"
                >
                  VI
                </button>
              </div>
            )}
            <a
              href="/"
              class={`items-center gap-1 text-sm text-darkslate-200 hover:text-white transition-colors group ${
                props.cta ? "hidden md:flex" : "flex"
              }`}
            >
              Home
              <svg
                class="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </a>
            {props.cta ? (
              <a
                href={props.cta.href}
                class={`inline-flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full transition-all duration-500 shadow-sm ${
                  isScrolled() ? "px-4 h-8 text-xs" : "px-6 h-10 text-sm"
                }`}
              >
                {props.cta.label}
              </a>
            ) : null}
          </div>
        </div>
      </nav>
    </header>
  );
}


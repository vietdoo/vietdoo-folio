import { createSignal, onCleanup, onMount, For } from "solid-js";
import { ThemeToggle } from "@/components/ThemeToggle";

const navLinks = [
  { name: "Blog", href: "/blog" },
  { name: "Showcase", href: "/engineering-showcase" },
  { name: "Playground", href: "/playground" },
];

const menuSections = [
  {
    label: "Khám phá",
    links: [
      {
        name: "Trang chủ",
        description: "Một góc nhỏ của vietdoo",
        href: "/",
        index: "01",
      },
      {
        name: "Bài viết",
        description: "Ghi chép về engineering & AI",
        href: "/blog",
        index: "02",
      },
      {
        name: "Engineering Showcase",
        description: "Những thứ đang được xây dựng",
        href: "/engineering-showcase",
        index: "03",
      },
      {
        name: "Playground",
        description: "Các thử nghiệm nhỏ trên web",
        href: "/playground",
        index: "04",
      },
    ],
  },
  {
    label: "Kết nối",
    links: [
      {
        name: "Guestbook",
        description: "Để lại một lời nhắn",
        href: "/guestbook",
        index: "05",
      },
      {
        name: "Bookshelf",
        description: "Những cuốn sách đang đọc",
        href: "/books",
        index: "06",
      },
      {
        name: "Vietnam Journey",
        description: "10 tỉnh thành đã ghé qua",
        href: "/visit",
        index: "07",
      },
      {
        name: "Resume",
        description: "Kinh nghiệm & kỹ năng",
        href: "/resume",
        index: "08",
      },
    ],
  },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = createSignal(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = createSignal(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  onMount(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileMenu();
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeydown);
    handleScroll();

    onCleanup(() => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeydown);
    });
  });

  return (
    <>
      <header
        class={`fixed z-50 transition-all duration-500 ${
          isScrolled() ? "top-4 left-4 right-4" : "top-0 left-0 right-0"
        }`}
      >
        <nav
          class={`mx-auto transition-all duration-500 ${
            isScrolled() || isMobileMenuOpen()
              ? "bg-darkslate-800/80 backdrop-blur-xl border border-darkslate-500 rounded-2xl shadow-lg max-w-[1200px]"
              : "bg-transparent max-w-[1400px]"
          }`}
        >
          <div
            class={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
              isScrolled() ? "h-14" : "h-20"
            }`}
          >
            <div class="flex items-center gap-3 shrink-0">
              <a
                href="/"
                class="flex items-center gap-2.5 group text-white no-underline"
                aria-label="Về trang chủ vietdoo"
              >
                <img
                  src="/vndo.png"
                  alt="VNDO logo"
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
                <span class="hidden sm:flex flex-col leading-none">
                  <span class="text-[11px] font-bold tracking-[0.16em] uppercase text-white">
                    vietdoo
                  </span>
                  <span class="text-[9px] tracking-[0.08em] text-darkslate-300 mt-1">
                    VNDO / ENGINEERING
                  </span>
                </span>
              </a>

            </div>

            <div class="hidden md:flex items-center gap-10">
              <For each={navLinks}>
                {(link) => (
                  <a
                    href={link.href}
                    data-skip-loader
                    class="text-sm text-darkslate-200 hover:text-white transition-colors duration-300 relative group"
                  >
                    {link.name}
                    <span class="absolute -bottom-1 left-0 w-0 h-px bg-primary-400 transition-all duration-300 group-hover:w-full" />
                  </a>
                )}
              </For>
            </div>

            <div class="hidden md:flex items-center gap-4">
              <ThemeToggle />
              <a
                href="/resume"
                class="text-darkslate-200 hover:text-white transition-all duration-500 text-sm"
              >
                Resume
              </a>
              <a
                href="mailto:vietdoo@outlook.com"
                class="inline-flex items-center justify-center bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-full transition-all duration-500 shadow-sm px-5 h-10 text-sm"
              >
                Say hello ↗
              </a>
            </div>

            <div class="md:hidden flex items-center gap-2">
              <ThemeToggle compact />
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen())}
                class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white hover:border-primary-400/60 hover:text-primary-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/70 active:scale-95 transition-all"
                aria-label={isMobileMenuOpen() ? "Đóng menu" : "Mở menu"}
                aria-expanded={isMobileMenuOpen()}
                aria-controls="mobile-navigation"
              >
                {isMobileMenuOpen() ? (
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.8"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    class="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="1.8"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4 7h16M4 12h16M4 17h10"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div
        class={`md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
          isMobileMenuOpen()
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isMobileMenuOpen()}
        onClick={closeMobileMenu}
      >
        <aside
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Điều hướng vietdoo"
          onClick={(event) => event.stopPropagation()}
          class={`absolute right-0 top-0 flex h-full w-[min(91vw,430px)] flex-col overflow-y-auto border-l border-white/10 bg-darkslate-900/98 px-5 pb-6 pt-5 shadow-2xl transition-transform duration-300 ${
            isMobileMenuOpen() ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div class="flex items-center justify-between border-b border-white/10 pb-5">
            <div class="flex items-center gap-3">
              <img
                src="/vndo.png"
                alt="VNDO logo"
                width="40"
                height="40"
                class="h-10 w-10 rounded-xl object-cover"
              />
              <div>
                <p class="m-0 text-sm font-bold tracking-[0.16em] text-white">
                  VIETDOO
                </p>
                <p class="m-0 mt-1 text-[10px] uppercase tracking-[0.14em] text-darkslate-300">
                  personal folio / vndo
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeMobileMenu}
              class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/75 hover:border-primary-400/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/70 active:scale-95 transition-all"
              aria-label="Đóng menu"
            >
              <svg
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div class="relative mt-6 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.045] p-4 shadow-xl">
            <div
              class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent"
              aria-hidden="true"
            />
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="m-0 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-300">
                  Currently building
                </p>
                <h2 class="m-0 mt-2 text-xl font-bold tracking-tight text-white">
                  Do Quoc Viet <span class="text-primary-300">(vietdoo)</span>
                </h2>
                <p class="m-0 mt-2 text-xs leading-relaxed text-darkslate-200">
                  Software Engineer @ VNPT · Founder @ VNDO
                </p>
              </div>
              <span
                class="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]"
                aria-label="Đang hoạt động"
              />
            </div>
            <p class="m-0 mt-4 max-w-[34ch] text-sm leading-relaxed text-white/75">
              Building scalable backend systems, data infrastructure and AI
              agent workflows.
            </p>
          </div>

          <div class="mt-7 shrink-0 flex flex-col gap-7">
            <For each={menuSections}>
              {(section) => (
                <section>
                  <p class="m-0 mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-darkslate-400">
                    {section.label}
                  </p>
                  <div class="flex flex-col gap-1">
                    <For each={section.links}>
                      {(link, index) => (
                        <a
                          href={link.href}
                          data-skip-loader
                          onClick={closeMobileMenu}
                          class={`group flex items-center gap-3 rounded-xl border border-transparent px-3 py-3.5 transition-all duration-200 hover:border-white/10 hover:bg-white/5 ${
                            isMobileMenuOpen()
                              ? "translate-y-0 opacity-100"
                              : "translate-y-2 opacity-0"
                          }`}
                          style={{
                            "transition-delay": isMobileMenuOpen()
                              ? `${index() * 35}ms`
                              : "0ms",
                          }}
                        >
                          <span class="w-6 shrink-0 font-mono text-[10px] text-primary-400/70 group-hover:text-primary-300">
                            {link.index}
                          </span>
                          <span class="min-w-0 flex-1">
                            <span class="block text-[15px] font-semibold text-white group-hover:text-primary-300">
                              {link.name}
                            </span>
                            <span class="mt-1 block truncate text-xs text-darkslate-300">
                              {link.description}
                            </span>
                          </span>
                          <span
                            class="text-lg text-darkslate-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary-300"
                            aria-hidden="true"
                          >
                            ↗
                          </span>
                        </a>
                      )}
                    </For>
                  </div>
                </section>
              )}
            </For>
          </div>

        </aside>
      </div>
    </>
  );
}

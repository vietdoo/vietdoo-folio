import { SubpageNavigation, type SubpageNavCta } from "@/components/site/subpage-navigation";
import { FooterSection } from "@/components/landing/footer-section";
import { cn } from "@/lib/utils";

export function SitePageShell(props: {
  children?: any;
  className?: string;
  /** Nhãn tên trang ở giữa Header */
  navLabel: string;
  /** Nút CTA tùy chọn */
  navCta?: SubpageNavCta;
  /** Cho phép hiển thị ô tìm kiếm */
  showSearch?: boolean;
  /** Placeholder tìm kiếm */
  searchPlaceholder?: string;
}) {
  return (
    <div class="relative min-h-screen overflow-x-hidden bg-darkslate-700 text-white flex flex-col">
      <SubpageNavigation
        label={props.navLabel}
        cta={props.navCta}
        showSearch={props.showSearch}
        searchPlaceholder={props.searchPlaceholder}
      />
      <div class={cn("pt-24 lg:pt-28 flex-1", props.className)}>{props.children}</div>
      <FooterSection />
    </div>
  );
}

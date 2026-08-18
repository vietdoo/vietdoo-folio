import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { getCanonicalBlogId } from "../lib/blog-lang";
import { SITE } from "../site-config";

export const prerender = true;

type SiteRoute = {
  path: string;
  url: string;
  title: string;
  description: string;
  type: "home" | "content" | "tool" | "profile" | "blog-index" | "blog-post";
  languages?: string[];
  category?: string;
  lastModified?: string;
};

const siteUrl = SITE.site.url.replace(/\/$/, "");
const toAbsoluteUrl = (path: string) => `${siteUrl}${path}`;

const publicRoutes: SiteRoute[] = [
  {
    path: "/",
    url: toAbsoluteUrl("/"),
    title: SITE.site.title,
    description: SITE.site.description,
    type: "home",
  },
  {
    path: "/blog/",
    url: toAbsoluteUrl("/blog/"),
    title: "Blog — Do Quoc Viet (vietdoo)",
    description: "Engineering, AI systems, architecture, data infrastructure, and product notes.",
    type: "blog-index",
    languages: ["en", "vi"],
    category: "writing",
  },
  {
    path: "/books/",
    url: toAbsoluteUrl("/books/"),
    title: "Bookshelf — Do Quoc Viet (vietdoo)",
    description: "Technical notes and personal reading log.",
    type: "content",
    category: "reading",
  },
  {
    path: "/engineering-showcase/",
    url: toAbsoluteUrl("/engineering-showcase/"),
    title: "Engineering Showcase — Do Quoc Viet (vietdoo)",
    description: "Selected engineering work, systems thinking, and technical experiments.",
    type: "content",
    category: "engineering",
  },
  {
    path: "/guestbook/",
    url: toAbsoluteUrl("/guestbook/"),
    title: "Guestbook — Do Quoc Viet (vietdoo)",
    description: "A place for visitors to leave a message.",
    type: "content",
    category: "community",
  },
  {
    path: "/playground/",
    url: toAbsoluteUrl("/playground/"),
    title: "Playground — Do Quoc Viet (vietdoo)",
    description: "Interactive browser experiments and developer tools.",
    type: "tool",
    category: "developer-tools",
  },
  {
    path: "/playground/chat/",
    url: toAbsoluteUrl("/playground/chat/"),
    title: "Chat Playground",
    description: "Interactive chat and AI interface experiment.",
    type: "tool",
    category: "developer-tools",
  },
  {
    path: "/playground/color-contrast/",
    url: toAbsoluteUrl("/playground/color-contrast/"),
    title: "Color Contrast Checker",
    description: "Check foreground and background color contrast ratios.",
    type: "tool",
    category: "developer-tools",
  },
  {
    path: "/playground/dice-roller/",
    url: toAbsoluteUrl("/playground/dice-roller/"),
    title: "Dice Roller",
    description: "Interactive dice roller experiment.",
    type: "tool",
    category: "developer-tools",
  },
  {
    path: "/playground/fingerprint-audit/",
    url: toAbsoluteUrl("/playground/fingerprint-audit/"),
    title: "Browser Fingerprint Audit",
    description: "Explore browser fingerprinting signals and privacy implications.",
    type: "tool",
    category: "privacy",
  },
  {
    path: "/playground/floating-header/",
    url: toAbsoluteUrl("/playground/floating-header/"),
    title: "Floating Header",
    description: "Floating navigation and header interaction experiment.",
    type: "tool",
    category: "developer-tools",
  },
  {
    path: "/playground/image-description/",
    url: toAbsoluteUrl("/playground/image-description/"),
    title: "Image Description",
    description: "Image description and accessibility experiment.",
    type: "tool",
    category: "developer-tools",
  },
  {
    path: "/playground/input-tester/",
    url: toAbsoluteUrl("/playground/input-tester/"),
    title: "Input Tester",
    description: "Keyboard and input event testing playground.",
    type: "tool",
    category: "developer-tools",
  },
  {
    path: "/playground/jwt-decoder/",
    url: toAbsoluteUrl("/playground/jwt-decoder/"),
    title: "JWT Decoder",
    description: "Decode JSON Web Tokens locally in the browser.",
    type: "tool",
    category: "developer-tools",
  },
  {
    path: "/playground/meta-tag-generator/",
    url: toAbsoluteUrl("/playground/meta-tag-generator/"),
    title: "Meta Tag Generator",
    description: "Generate common HTML metadata and social preview tags.",
    type: "tool",
    category: "developer-tools",
  },
  {
    path: "/playground/task-agent/",
    url: toAbsoluteUrl("/playground/task-agent/"),
    title: "Task Agent",
    description: "Task planning and AI agent workflow experiment.",
    type: "tool",
    category: "ai",
  },
  {
    path: "/playground/word-counter/",
    url: toAbsoluteUrl("/playground/word-counter/"),
    title: "Word Counter",
    description: "Count words, characters, and reading metrics in the browser.",
    type: "tool",
    category: "developer-tools",
  },
  {
    path: "/resume/",
    url: toAbsoluteUrl("/resume/"),
    title: "Resume — Do Quoc Viet (vietdoo)",
    description: "Resume and professional profile of Do Quoc Viet.",
    type: "profile",
    languages: ["en", "vi"],
    category: "profile",
  },
  {
    path: "/travel/",
    url: toAbsoluteUrl("/travel/"),
    title: "Travel — Do Quoc Viet (vietdoo)",
    description: "Travel notes and places visited.",
    type: "content",
    category: "travel",
  },
  {
    path: "/visit/",
    url: toAbsoluteUrl("/visit/"),
    title: "Visit Vietnam — Do Quoc Viet (vietdoo)",
    description: "A visual map of places visited across Vietnam.",
    type: "content",
    category: "travel",
  },
];

const posts = await getCollection("blog", ({ data }) => !data.draft);
const blogRoutes: SiteRoute[] = [];

for (const canonicalId of new Set(posts.map(getCanonicalBlogId))) {
  const entries = posts.filter((post) => getCanonicalBlogId(post) === canonicalId);
  const primary = entries.find((post) => post.data.lang === "en") ?? entries[0];
  if (!primary) continue;

  const languages = [...new Set(entries.map((post) => post.data.lang))].sort();
  const pubDate = primary.data.pubDate?.toISOString();

  blogRoutes.push({
    path: `/blog/${canonicalId}/`,
    url: toAbsoluteUrl(`/blog/${canonicalId}/`),
    title: primary.data.title ?? canonicalId,
    description: primary.data.description ?? "Published engineering article.",
    type: "blog-post",
    languages,
    category: primary.data.category ?? "engineering",
    ...(pubDate ? { lastModified: pubDate } : {}),
  });
}

blogRoutes.sort((a, b) => a.path.localeCompare(b.path));

const body = {
  schemaVersion: "1.0",
  generatedAt: new Date().toISOString(),
  site: {
    name: SITE.site.title,
    url: siteUrl,
    author: SITE.author.fullName,
    alternateNames: SITE.author.alternateNames,
    description: SITE.site.description,
    locale: SITE.site.locale,
    alternateLocales: SITE.site.alternateLocales,
  },
  resources: {
    robots: toAbsoluteUrl("/robots.txt"),
    sitemapIndex: toAbsoluteUrl("/sitemap-index.xml"),
    sitemap: toAbsoluteUrl("/sitemap-0.xml"),
    rss: toAbsoluteUrl("/rss.xml"),
    llms: toAbsoluteUrl("/llms.txt"),
    aiGuidance: toAbsoluteUrl("/ai.txt"),
    siteTree: toAbsoluteUrl("/site-tree.json"),
  },
  publicRoutes: [...publicRoutes, ...blogRoutes],
  excludedPatterns: ["/admin/", "/api/", "/404/"],
  redirects: [{ from: "/design-works/", to: "/engineering-showcase/" }],
};

export const GET: APIRoute = () =>
  new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Content-Type": "application/json; charset=utf-8",
    },
  });

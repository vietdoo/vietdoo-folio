# Blog TTS Integration

The blog uses the browser-native Web Speech API through `src/lib/speech-synthesis.ts` and `src/components/Blog/AudioPlayer.astro`. No API key, server-side voice service, audio file, or additional runtime dependency is required.

## Architecture

`LayoutBlogPost.astro` renders one `AudioPlayer` for every available translation immediately below the author/date/read-time metadata. Each player points to the matching article element through `data-tts-target`, while the page-level language switch controls which translated block is visible. Because the integration is in the shared layout, existing and future content collection entries receive the player automatically when rendered through the blog route.

The helper performs five responsibilities: it checks browser support, extracts readable text from the article, removes code/media/share/navigation noise, splits long content into sentence-aware chunks, and selects a local voice matching `vi-VN` or `en-US` with graceful `en-GB`/language-prefix fallbacks.

## Adding a future blog post

A new blog post only needs to follow the existing content collection schema. Do not add a player to the Markdown file. The shared route and layout supply the target article ID, language selector, controls, accessibility labels, and lifecycle cleanup automatically.

When a component inside an article should never be narrated, add `data-tts-ignore` to its outer element. Code blocks, images, media, buttons, navigation, hidden elements, and the existing `[data-share-section]` are already excluded by the helper.

## Runtime behavior

The player supports `idle`, `playing`, and `paused` states. Play starts a fresh reading session, pause calls `speechSynthesis.pause()`, resume calls `speechSynthesis.resume()`, and stop cancels the current utterance and resets progress. Long articles are spoken as a queue of sentence-aware chunks to avoid Chromium/Safari stopping on oversized utterances.

The voice list is refreshed from `speechSynthesis.getVoices()` and again on `voiceschanged`. If the requested regional voice is unavailable, the helper tries a language-compatible voice and then allows the browser to use its default speech voice. Browsers without Web Speech support show a non-interactive fallback message rather than throwing an error.

Speech is cancelled on `pagehide`, `beforeunload`, hidden-tab changes, Astro page preparation, and blog-language changes. This prevents stale audio continuing after navigation or after the user switches from EN to VI.

## Local verification

Run the existing project checks from the repository root:

```bash
npm run check
npm run build
```

For a visual check, run `npm run dev`, open any `/blog/{canonical-id}` page, verify the player appears below metadata, switch between EN and VI, and test Play, Pause/Resume, and Stop. Voice availability depends on the browser and operating system; a local environment without an installed voice may correctly display the device error state after Play.

## Accessibility and styling

Controls use native buttons, explicit labels, `aria-pressed` for language choices, `aria-live` for playback status, and a progressbar with a 0–100 value. The component includes mobile layout rules, dark-theme-compatible colors, visible focus rings, and a reduced-motion media query. The visual treatment is intentionally compact and editorial so it remains secondary to the article content.

# Smart chat UI verification

Date: 2026-08-18

- Local route `/playground/chat` loaded successfully on the Astro dev server at port 4322.
- The page exposed Back, search, theme toggle, Home, New conversation, suggestion prompts, textarea, and Send controls.
- A suggestion prompt was selected and submitted through the real browser UI.
- The browser received a successful assistant response from `/api/chat` through the smart router.
- The response contained Markdown headings, bold text, and an ordered list; the UI rendered them as formatted HTML instead of raw Markdown syntax.
- No provider or model selector was exposed to the user.

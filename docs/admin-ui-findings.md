# Admin UI smoke findings

- Local route `/admin` loads with the `vndo-ai / Control room` title and a password-gated login card.
- Login screen uses the intended dark visual system: blue glow, compact private-console eyebrow, secure session footnote, and responsive centered card.
- Password input and `Enter dashboard` action are visible and accessible at the tested desktop viewport.
- Password was entered only for local smoke testing; it is not stored in source or report content.


Authenticated smoke test confirms the dashboard loads with the full sidebar (`Overview`, `AI request logs`, `Model controls`), overview metrics, recent activity table, and model fleet cards. The Model controls view shows three admin-safe routes with capability badges: `text/image/video`, `text/image/video/file/audio`, and `text`; disabled routes are visually marked and switches are disabled when the provider credential is missing. The local test environment intentionally had no provider keys, so the UI correctly displayed `Provider key not configured` rather than allowing a non-functional toggle.


The AI request logs screen renders the privacy-safe audit table, refresh action, total-record count, and empty state correctly. With the authenticated browser session, `/api/admin/logs?limit=5` returned HTTP 200 with the expected `logs`, `page`, `limit`, and `total` keys, while `/api/admin/models` returned HTTP 200 with three model configurations. No credential or raw prompt fields were exposed.

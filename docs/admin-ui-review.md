
## Login visual check

With temporary local-only credentials and Astro's local database, `/admin` renders without the previous database overlay. The login card now uses a warm off-white surface, terracotta `V` mark and submit button, restrained border/shadow treatment, and the copy `Private workspace.`. The outer layout still contains the portfolio's existing dark global header/grid chrome, which is outside the admin component styles.

## Authenticated dashboard visual check

Using a temporary local-only admin password, the authenticated dashboard renders cleanly with the new theme. The sidebar is warm gray with terracotta active-state rail; the main surface is off-white; the hero panel uses a muted beige treatment; metrics, activity table, model cards, and status pills use quiet borders and restrained color. No runtime error overlay appeared in local DB mode. The screenshot still shows the existing portfolio global dark header at the top because `/admin` is wrapped by the shared `Layout`; the admin workspace itself is visually consistent.

## Secondary views

Model controls renders a warm callout, three-column model grid, muted capability tags, quiet provider metadata, and disabled switches without visual noise. AI request logs renders a compact page intro, restrained refresh action, summary line, and clean empty table state. Both views retain the same sidebar/header hierarchy and no runtime errors appeared.

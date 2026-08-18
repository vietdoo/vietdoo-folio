# vietdoo / vietdoo-folio

Personal portfolio website built with Astro, SolidJS, Svelte, and Three.js.

[Live Site](https://vietdoo.vndo.vn) · [Repository](https://github.com/vietdoo/vietdoo-folio)

## Overview

A bento-grid personal portfolio featuring interactive 3D elements, client-side mini-apps, server-rendered pages, AI playgrounds, privacy-safe AI request logging, and a protected admin console.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| **Framework** | Astro 7 (Server Output) |
| **UI Components** | SolidJS, Svelte, UnoCSS |
| **3D & Animation** | Three.js, Cannon.es, Motion |
| **Database** | Astro DB (LibSQL / Turso) |
| **AI Integration** | OrcaRouter + OpenRouter through a server-side smart router |
| **Deployment** | Vercel |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- OpenSSL, if you need to generate an admin session secret locally

### Installation & Run

```bash
# Install dependencies
pnpm install

# Create a local environment file
cp .env.example .env.local

# Start local development server
pnpm dev

# Run tests and type checking
pnpm test
pnpm check

# Build for production
pnpm build
```

## Environment Configuration

The complete variable template is available in [`.env.example`](./.env.example). Copy it to `.env.local` for local development and replace every required placeholder with a real value. Environment files containing secrets must never be committed to Git.

### Variables

| Variable | Required for | Purpose | Secret handling |
| --- | --- | --- | --- |
| `ORCAROUTER_API_KEY` | AI playgrounds using OrcaRouter | Server-side access to the OrcaRouter provider and free-model failover routes | Keep server-side; never expose through `PUBLIC_*` |
| `OPENROUTER_API_KEY` | AI playgrounds using OpenRouter | Server-side access to OpenRouter model routes and multimodal fallbacks | Keep server-side; never expose through `PUBLIC_*` |
| `ADMIN_USERNAME` | `/admin` | Username checked by the server before creating an admin session; defaults to `admin` when omitted | Keep server-side and change it from the default for a non-demo deployment |
| `ADMIN_PASSWORD` | `/admin` | Password checked together with `ADMIN_USERNAME` before creating an admin session | Use a strong password and never hard-code it in source |
| `ADMIN_SESSION_SECRET` | `/admin` | Long random HMAC secret used to sign and validate HttpOnly admin session cookies | Must be different from `ADMIN_PASSWORD`; rotate it to invalidate existing sessions |
| `ASTRO_DB_REMOTE_URL` | Remote Astro DB migration and production persistence | Remote LibSQL/Turso database URL | Keep server-side and do not print it in logs |
| `ASTRO_DB_APP_TOKEN` | Remote Astro DB migration and production persistence | Authentication token for the remote Astro DB database | Keep server-side and do not commit it |

The application reads provider keys and admin credentials only on the server. The browser never receives API keys, raw prompts, provider credentials, or the admin password. Public UI labels use `vndo-ai` rather than exposing provider routing details. The admin form uses a username/password pair; the current environment-backed account is assigned the `admin` role inside the signed server session.

### Local setup

For a basic local run, copy the template and fill in the provider keys and admin values. `ADMIN_USERNAME` defaults to `admin` if omitted, but setting it explicitly is recommended:

```bash
cp .env.example .env.local
```

Set the admin identity in `.env.local`:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=replace-with-a-strong-password
```

Generate a session secret with:

```bash
openssl rand -base64 48
```

Then set the generated value as `ADMIN_SESSION_SECRET`. Do not use the placeholder text itself as a secret. If you want to test audit-log and model-control persistence against the remote Astro DB, also provide `ASTRO_DB_REMOTE_URL` and `ASTRO_DB_APP_TOKEN`.

### Vercel setup

Add the variables in the Vercel project settings under **Settings → Environment Variables**. Configure `ORCAROUTER_API_KEY`, `OPENROUTER_API_KEY`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` for **Production**. Configure them for **Preview** only when preview deployments are intended to run the AI playgrounds and admin console.

Configure `ASTRO_DB_REMOTE_URL` and `ASTRO_DB_APP_TOKEN` for **Production**. Use a separate preview database for Preview deployments if preview traffic should write audit logs or model settings; do not point Preview at the production database unintentionally.

After adding or changing a Vercel environment variable, create a new deployment because environment changes are applied to newly built deployments. The existing deployment does not automatically receive updated server-side values. The current implementation supports one environment-backed admin account with role `admin`; future multi-account support can move the credential lookup to a database or identity provider while keeping the username/password form and role-aware session contract.

### Astro DB migration

The remote database schema must be pushed once after the `AiRequestLog` and `AiModelConfig` tables are introduced or changed:

```bash
vercel env pull .env.local
pnpm db:push
```

The environment used for `pnpm db:push` must contain `ASTRO_DB_REMOTE_URL` and `ASTRO_DB_APP_TOKEN`. Do not commit `.env.local`, print either database value, or run migration commands against production without checking the target database first. After a successful migration, redeploy the Vercel project.

## Project Structure

```text
src/
├── assets/         # Static assets and typography
├── components/     # Astro, SolidJS, and Svelte UI components
├── layouts/        # Layout wrappers
├── pages/          # Astro routes and API endpoints
└── lib/            # Helpers, database client, AI router, and configurations

db/
└── config.ts       # Astro DB schema, including AI audit and model-control tables

tests/
└──                # Vitest unit tests
```

## Useful Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the local development server |
| `pnpm test` | Run Vitest tests |
| `pnpm check` | Run TypeScript checks |
| `pnpm build` | Build the Astro/Vercel production bundle |
| `pnpm db:push` | Push the Astro DB schema to the configured remote database |

## Security Notes

Never commit `.env.local`, `.env.production`, Vercel environment exports, API keys, database tokens, or session secrets. If a secret is exposed, revoke or rotate it at the provider immediately. Changing `ADMIN_SESSION_SECRET` invalidates all existing admin sessions and requires administrators to log in again.

## License

[MIT](LICENSE) © [Do Quoc Viet](https://vndo.vn)

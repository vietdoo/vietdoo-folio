# AI Request Audit Logging

The AI routes persist one append-only `AiRequestLog` row for every request handled by `/api/chat` and `/api/image-description`.

## What is recorded

Each row contains a request ID, request kind, lifecycle status, inferred capabilities, provider attempts, attempt count, whether fallback was used, character-count metadata, total latency, the final provider/model label when available, a normalized error code/status, and a creation timestamp.

The API returns the same request ID in the `X-AI-Request-ID` response header so an operational issue can be correlated without exposing provider routing details in the public JSON response.

## Privacy boundary

The logger does not persist API keys, authorization headers, raw prompts, assistant responses, base64 image data, file contents, or provider payloads. It stores only capability and size metadata needed for operations and cost/performance analysis. Database persistence is fail-open: a database logging error is reported server-side but does not discard a successful AI response.

## Database migration

The new `AiRequestLog` table is declared in `db/config.ts`. The remote Astro DB schema must be pushed once before production requests can be logged:

```bash
vercel env pull .env.local
pnpm db:push
```

The environment used for this command must include `ASTRO_DB_REMOTE_URL` and `ASTRO_DB_APP_TOKEN`. Do not commit `.env.local` or print either value. After the migration succeeds, redeploy the Vercel project so the new server bundle is active.

## Verification

A successful AI response should include an `X-AI-Request-ID` header and create a `success` row. A validation error should create an `invalid` row. A provider retry/failover should create one final `success` or `failed` row with `attemptedProviders`, `attemptCount`, and `usedFallback` populated.

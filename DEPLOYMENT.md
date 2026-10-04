# Deployment

The hosted app uses Sites-managed Cloudflare Workers and D1. `.openai/hosting.json` retains the Site identity and logical `DB` binding. Generated SQL migrations are applied before the Worker upload. Source is stored in the Site's Git repository; there is no additional backend to wake up.

Server runtime values:

| Variable | Value |
| --- | --- |
| NEBIUS_API_KEY | Secret from the owner's Token Factory account |
| NEBIUS_BASE_URL | `https://api.tokenfactory.nebius.com/v1/` |
| NEBIUS_MODEL | `nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B` or another verified tool-capable Nemotron model |

The key was configured as a private server-side secret during this build. Changing hosted environment values requires deploying a saved version to apply the new environment revision. Never add secrets to `.openai/hosting.json`, source files, screenshots, or client-side configuration.

## Local or alternate Cloudflare deployment

1. Install the locked dependencies with pnpm and Node 22.13+.
2. Preserve the build integration in `vite.config.ts` and `build/`.
3. Generate schema migrations with `pnpm db:generate` when changing `db/schema.ts`. Commit SQL and Drizzle metadata.
4. Run engine tests, TypeScript checking and `pnpm build`.
5. Build output is `dist/server/index.js` with a callable default `fetch` export, plus browser assets and generated Wrangler config.
6. For local Wrangler, apply checked-in migrations with the generated configuration and logical `DB` binding. Supply Nebius values through ignored `.dev.vars` or environment. Start with `pnpm start`.
7. For an independently provisioned Cloudflare account, bind an owned D1 database in a deployment configuration, migrate it, set the API key with a secret command, then deploy the generated Worker and assets. Do not repurpose the Sites-managed project identity for another provider.

This repository does not ship a separate FastAPI service or a Vercel configuration. It is a single Worker-compatible fullstack app. The API and client share an origin, which avoids cross-origin credentials and transport complexity.

## Operational boundaries

The private hosted audience should be retained until an authenticated user/session and provider-abuse strategy is added for public sharing. Fictional financial data is isolated by the random sandbox-session cookie. Reset clears only that session's simulated history and balance.

A configured-key status is not a provider health check. Use a policy compilation or the live acceptance test to verify model access. Provider timeouts are visible; fixture mode is a clearly labeled rehearsal path.

## Validation during this build

- 27 deterministic tests passed, including storage concurrency and session isolation.
- Live policy compilation and six Nemotron tool turns produced the $380 denial and $185 executed receipt.
- The enhanced live challenge passed: 9 agent turns plus policy compilation, $185 authority invalidated after a $100 bill, and $95 executed with a $1,505 future minimum. Sanitized evidence is in `docs/live-challenge-run.json`.
- TypeScript check and production Worker build passed.
- The supervised preview reported running, but its internal address was unreachable; the required browser-control skill was unavailable. Visual browser QA and WebMCP registration validation could not be performed. WebMCP tools are feature-detected and optional; no financial path depends on them.

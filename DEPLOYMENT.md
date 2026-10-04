# Deploy COVENANT on your Cloudflare account

COVENANT is a standalone Cloudflare Worker with D1 storage. It has no ChatGPT hosting, sign-in, connector, or deployment dependency. Model inference runs on Nebius Token Factory. A custom domain is optional; the Worker receives a workers.dev address.

## Dashboard deployment

1. Open [Deploy to Cloudflare](https://deploy.workers.cloudflare.com/?url=https://github.com/Epple3k/covenant).
2. Select your Cloudflare account and GitHub account. The template flow copies this repository; use a new repository name such as covenant-demo if covenant already exists in your account. Keep the Worker name covenant, or choose another available name.
3. Enter NEBIUS_API_KEY in the secret field. Accept the DB binding. Cloudflare provisions the database and substitutes its real ID in wrangler.jsonc.
4. Check the build command is `pnpm run build` and the deploy command is `pnpm run deploy`. The deployment command applies the database migration before uploading the Worker.
5. After a successful deployment, open the workers.dev address shown by Cloudflare. Complete setup, compile and confirm the policy, and run Live Nemotron. Use that app address in Devpost.

This dashboard flow requires your authenticated Cloudflare account; a successful local build does not establish that remote provisioning or deployment succeeded. The repository itself contains no provider credentials.

## Local development

Use Node 22.13 or later and the pnpm version declared in package.json:

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm run db:local
pnpm run dev
```

For local live-model calls, put NEBIUS_API_KEY in an ignored .dev.vars file. The base URL and model are declared in wrangler.jsonc. Without a key the clearly labeled fixture controller remains available.

## CLI deployment alternative

```sh
pnpm exec wrangler login
pnpm exec wrangler d1 create covenant-db
pnpm run configure:cloudflare -- REAL_DATABASE_ID_FROM_PREVIOUS_COMMAND
pnpm run build
pnpm run secret:nebius
pnpm run deploy
```

The secret command prompts privately for your Token Factory key. Do not put it in shell arguments or tracked files. The configure helper rejects the placeholder database ID before remote migrations or deployment.

## Validation

Run `pnpm test`, `pnpm run typecheck`, and `pnpm run build`. Local acceptance also exercises the actual Worker API and D1 migration. Live-model evidence from the original financial scenario is retained in docs/live-challenge-run.json; it is one observed run, not a reliability benchmark. The independent Cloudflare deployment must be checked after it succeeds.

## Judge access

All balances, statements, bills, inventory and purchases are fictional. The random HttpOnly cookie isolates each sandbox session. Real financial-account authentication and real payment rails are not implemented. If restricting the demo to named judges, apply Cloudflare Access to the Worker; otherwise configure provider spending limits for the public demo. Do not share API keys as login credentials.

Official references:
- https://developers.cloudflare.com/workers/platform/deploy-buttons/
- https://developers.cloudflare.com/d1/reference/migrations/
- https://developers.cloudflare.com/workers/configuration/secrets/

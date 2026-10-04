# Deploy COVENANT on your Cloudflare account

COVENANT is a standalone Cloudflare Worker with D1 storage. It has no ChatGPT hosting, sign-in, connector, or deployment dependency. Model inference runs on Nebius Token Factory. A custom domain is optional; the Worker receives a workers.dev address.

## Dashboard deployment

1. Open [Deploy to Cloudflare](https://deploy.workers.cloudflare.com/?url=https://github.com/Epple3k/covenant).
2. Select your Cloudflare account and GitHub account. The template flow copies this repository; use a new repository name such as covenant-demo if covenant already exists in your account. Keep the Worker name covenant, or choose another available name.
3. Enter NEBIUS_API_KEY in the secret field if shown, or add it as a Worker secret under Settings → Variables and Secrets after deployment.
4. Set the build command to `pnpm run build` and the deploy command to `pnpm run deploy`. Do not leave the deploy command at `npx wrangler deploy`: that skips the database setup and migrations. Our deploy script reuses the configured database or finds/creates covenant-db, updates both source and built configurations with its actual ID, applies migrations, then uploads the Worker.
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
pnpm run build
pnpm run deploy
pnpm run secret:nebius
```

The secret command prompts privately for your Token Factory key. Do not put it in shell arguments or tracked files. Deployment resolves the database ID automatically in the authenticated account; it preserves any real ID already configured. You can optionally use `pnpm run configure:cloudflare -- REAL_DATABASE_ID` to select an existing database explicitly.

## Recover an initial failed deployment

If the log mentions database `00000000-0000-4000-8000-000000000000`, update to the latest source and open the Worker's Settings → Build configuration. Set the deploy command to `pnpm run deploy`, keep the build command at `pnpm run build`, and retry using the latest commit. The database setup runs inside Cloudflare using the build's existing credentials; no Cloudflare API token belongs in GitHub.

## Validation

Run `pnpm test`, `pnpm run typecheck`, and `pnpm run build`. Local acceptance also exercises the actual Worker API and D1 migration. Live-model evidence from the original financial scenario is retained in docs/live-challenge-run.json; it is one observed run, not a reliability benchmark. The independent Cloudflare deployment must be checked after it succeeds.

## Judge access

All balances, statements, bills, inventory and purchases are fictional. The random HttpOnly cookie isolates each sandbox session. Real financial-account authentication and real payment rails are not implemented. If restricting the demo to named judges, apply Cloudflare Access to the Worker; otherwise configure provider spending limits for the public demo. Do not share API keys as login credentials.

## Project domain

This project's Wrangler configuration attaches `covenant.emitrice.com` as a Worker Custom Domain on deployment. Cloudflare manages the DNS record and TLS certificate. The `emitrice.com` zone must be active in the same Cloudflare account as the Worker, and the build token must allow domain management. The main emitrice.com website is outside this hostname's scope.

If the build cannot attach the domain because of token permissions, open the covenant Worker's Settings → Domains & Routes → Add → Custom Domain and enter `covenant.emitrice.com`. Keep the route in wrangler.jsonc so later deployments retain it. If deploying your own copy on another account, remove this project's routes entry or replace it with a domain you control.

Official references:
- https://developers.cloudflare.com/workers/platform/deploy-buttons/
- https://developers.cloudflare.com/d1/reference/migrations/
- https://developers.cloudflare.com/workers/configuration/secrets/

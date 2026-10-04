# COVENANT

[MIT License](LICENSE) · NVIDIA Nemotron 3 Nano · Nebius Token Factory

Forward-looking financial authority for autonomous AI agents. A working research and hackathon prototype, with fictional balances, fixture travel inventory, and sandbox payments.

A travel agent may have permission to spend $400, yet a $380 purchase can still put rent and a $1,500 cash reserve at risk. COVENANT checks the projected minimum cash balance before creating financial authority. Nemotron receives a structured denial, adapts, and requests a safer itinerary.

## Working demonstration

- Starting checking: **$2,900**. Rent on day five: **$1,200**. Required reserve: **$1,500**. Trip cap: **$400**. New debt: **prohibited**.
- Nemotron selects the premium **$380** option. Future minimum is **$1,320**; deterministic code denies it.
- Agent receives a bounded **$150–$200** safe range, without account balances or rent details.
- Agent selects the **$185** coach/hostel/transit option. Future minimum is **$1,515**; code approves it.
- An exact-intent, five-minute, single-use credential executes a sandbox purchase. Receipt and hash-linked audit are persisted.

The new obligation challenge also passed with live Nemotron: a $100 future bill invalidated the approved $185 itinerary; the agent searched again and executed a $95 day trip, preserving $1,505. Nine live agent turns plus policy compilation are recorded with observed latency and tokens in [docs/live-challenge-run.json](docs/live-challenge-run.json). This is one run, not a reliability benchmark.

The first live end-to-end acceptance run used `nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B` through Nebius Token Factory. Policy compilation and six tool-selection turns passed. See `tests/live-smoke.ts` to reproduce; results depend on provider availability and model behavior.

## Stack

React + TypeScript, Next-compatible app routes via Vinext, Cloudflare Workers, D1/SQLite, Zod schemas. Money is integer cents. The backend, finance engine, AI adapter, and payment simulator deploy together. This replaces the brief's preferred separate FastAPI service with a single hosted application; the mathematical and trust boundaries are unchanged.

```text
app/                       frontend and API route
lib/covenant/engine.ts      deterministic finance, policy, credential and audit logic
lib/covenant/agent.ts       Nebius model adapter, tool orchestration, fixture controller
lib/covenant/storage.ts     durable D1 state with compare-and-swap revisions
lib/covenant/constants.ts   shared demo instruction
 db/schema.ts              session schema
 drizzle/                  generated SQLite migration
 tests/                    engine and live acceptance tests
```

## Clean clone

Requires Node 22.13+ (Node 24 recommended), pnpm, and a Cloudflare development runtime. Keep the lockfile.

```sh
pnpm install --frozen-lockfile
cp .env.example .env
pnpm db:generate
pnpm build
pnpm exec wrangler d1 execute DB --local --config dist/server/wrangler.json --file drizzle/0000_overjoyed_mister_fear.sql
pnpm start
```

The checked-in initial migration already exists; `db:generate` reports no changes unless you alter the schema. The build emits the Worker, assets, migrations, and generated Wrangler configuration. `.openai/hosting.json` names the logical database binding `DB`; production provisioning and migrations are handled by Sites. Portable environments can use `pnpm dev` for Vinext preview; production `pnpm start` is the most direct clean-clone runtime. See the starter's README and deployment notes for runtime-specific details.

Set `.env` values for build/dev as needed. For `pnpm start`, supply the same secrets through Wrangler's `.dev.vars` or runtime environment. No credentials are included. `.env.example` is intentionally tracked; all actual env files and `.dev.vars` are ignored.

## Model configuration

```text
NEBIUS_API_KEY=your server-side secret
NEBIUS_BASE_URL=https://api.tokenfactory.nebius.com/v1/
NEBIUS_MODEL=nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B
```

OpenAI-compatible chat completions power schema-validated policy drafting and real tool selection. Model and endpoint are configurable server-side. The endpoint allowlist restricts requests to Nebius Token Factory. Validate your chosen model against your account's `/v1/models` catalog. Sources: [Nebius Nemotron](https://nebius.com/services/token-factory/nemotron), [Token Factory documentation](https://docs.tokenfactory.nebius.com/).

Live mode never silently falls back to a script. Provider failures stop the driving loop and remain visible; the persisted session can be resumed. Deterministic fixture mode is explicitly labeled and accepts only the supplied demonstration policy instruction. Its controller adapts to actual engine results, but it does **not** count as a live AI demonstration.

## Changing-obligation challenge

After confirming policy, check **Pause after authorization to change an obligation**. Start the live agent. At the checkpoint, enter **100** and click **Apply bill and resume agent**. The existing authorization is invalidated at execution, and the agent must obtain new authority. Use **150** to make all itineraries infeasible; the agent should stop without spending. The original automatic demo remains available with the checkbox off.

## Checks

```sh
node scripts/test-covenant.mjs
pnpm exec tsc --noEmit
pnpm build
# Optional, billable live provider test:
NEBIUS_API_KEY=... node --experimental-strip-types tests/live-smoke.ts
```

The evidence bench compares eight hand-authored financial cases against a cap/current-cash baseline. Five baseline approvals breach the reserve; COVENANT blocks all five while approving the safe cases. This is a deterministic regression comparison, not a market or model benchmark.

The engine suite covers safe boundaries, future expenses and income, uncertainty and delay, recurring/pending obligations, multiple accounts, split purchases, aggregate caps, velocity, expiry, transaction binding, revocation, no-debt enforcement, replay, malformed inputs, state deterioration, audit tampering, disclosure, ratification, and the complete fixture tool loop.

## Position in the ecosystem

COVENANT explores the financial-risk and authority layer between agent reasoning and agent-payment authorization protocols/rails. AP2, Visa Intelligent Commerce, Mastercard Agent Pay, and virtual cards are neighboring infrastructure. This prototype has **no live integration** with those systems and makes no claim about their complete capabilities. The sandbox adapter is the seam where an attested payment rail could be integrated.

## Scope and limits

This app implements mock identity in a private hosted Site with an opaque HttpOnly sandbox-session cookie. It is not a bank, a production financial service, or a certified payment-control system. No bank connection or real purchase is performed. Forecasts use declared scenario rules, not calibrated probabilistic risk models. D1 sessions store their own ledgers; a shared household/multi-agent portfolio would need an account-wide transactional authority service. See `SECURITY.md`.

The audit chain detects alterations within the stored chain. It is not independently notarized: a database administrator could rewrite the chain. Receipts preserve an anchor suitable for external verification, but there is no external anchor service in this prototype.

See the hackathon package: [SUBMISSION.md](SUBMISSION.md), [PITCH.md](PITCH.md), [SPONSOR_FEEDBACK.md](SPONSOR_FEEDBACK.md). A public code repository, judge access and your recorded video still need to be supplied.

See [DEMO.md](DEMO.md), [ARCHITECTURE.md](ARCHITECTURE.md), [SECURITY.md](SECURITY.md), and [DEPLOYMENT.md](DEPLOYMENT.md).

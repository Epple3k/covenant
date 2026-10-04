# Devpost submission package

## Track

Best Apps and Agents. This is financial authority for software agents; it has no physical hardware demonstration and is not being submitted as Physical AI.

## Tagline

An AI agent can afford the purchase today and still put rent at risk tomorrow. COVENANT authorizes the future, not just the payment.

## Audience and problem

COVENANT is for people delegating purchases to personal agents while protecting fixed bills and a cash reserve. Its immediate use case is conference travel under a hard trip cap, upcoming rent, and a no-credit rule. It also provides a design pattern for developers of tool-using agents that need constrained financial authority.

Static spending caps cannot represent all of that intent. In our demonstration, a $380 trip passes a $400 cap and current-cash check, but leaves only $1,320 after rent, below the user's required $1,500 reserve.

We do not claim to be the first financial agent guardrail, or that all existing payment products use only static limits. Our contribution is the working combination of policy ratification, event-based financial forecasts, privacy-bounded denials, autonomous replanning, exact scoped execution and inspectable intent receipts.

## What it does

NVIDIA Nemotron interprets a natural-language spending instruction, drafts a typed policy, selects tools and adapts after denial. The user explicitly confirms the draft. A separate deterministic engine calculates financial scenarios in integer cents and owns authorization decisions.

The agent proposes $380; COVENANT denies it; Nemotron selects $185; the engine issues an exact-intent, five-minute, single-use credential; the sandbox executes it and generates a receipt.

The stronger challenge pauses after that approval. The operator adds a $100 future bill. The old $185 authorization is now unsafe. At execution, the engine invalidates it, releases its reservation, and sends a fresh bounded denial. The agent must replan to a $95 same-day itinerary, leaving $1,505, or stop if no itinerary fits. The confirmed policy is never weakened.

## How NVIDIA and Nebius are used

Model: `nvidia/NVIDIA-Nemotron-3-Nano-30B-A3B`.

Runtime: **Nebius Token Factory**, using its OpenAI-compatible chat completions and function-calling interface.

The model powers policy interpretation and every live planning/tool-selection turn. It receives structured tool results, including denial and execution-time invalidation, and makes the next choice itself. No UI transition chooses the itinerary. Model name, inference latency and token usage appear in the session evidence. Fixture mode is explicitly labeled and produces no live-model evidence.

Nano keeps the daily planning task compact. We do not route to larger models solely to use more sponsor products: deterministic code handles financial calculations, while the selected model performs language interpretation and adaptive tool orchestration. Token Factory avoided the need to provision GPU serving or manage model weights. All provider access stays server-side.

The web application is hosted on a Cloudflare Worker; **inference runs on Nebius Token Factory**. We do not claim Nebius AI Cloud, Serverless Jobs/Endpoints, Tavily, NeMo Guardrails, NemoClaw or a real payment-rail integration was used.

## Technical evidence

- `tests/live-smoke.ts`: billable actual-model acceptance test, with `LIVE_CHALLENGE=1` for changing obligations.
- `docs/live-challenge-run.json`: sanitized measured live evidence when the run passes; one run is not a model benchmark or a reliability rate.
- `node scripts/test-covenant.mjs`: deterministic financial/control/storage tests.
- Evidence bench: eight hand-authored cases compared with a simple cap/current-cash baseline. Five baseline approvals violate the reserve; COVENANT blocks them, while approving the safe cases. This is an inspectable regression comparison, not a user study or comparison against commercial products.
- Canonical intent hash, revocation, expiry, reservation aggregation and D1 optimistic concurrency.
- Hash-linked audit ledger with receipt anchors. No independent notarization is claimed.

## Built With

NVIDIA Nemotron 3 Nano; Nebius Token Factory; TypeScript; React; Vinext; Cloudflare Workers; D1/SQLite; Zod; Drizzle; Tailwind; Radix/Shadcn.

## Design and impact

The liquidity timeline makes an invisible future consequence visible exactly when a proposed purchase creates it. Policy confirmation distinguishes what the user said from what the model understood. The receipt connects the transaction to the policy and forward impact. The demonstration's audience and protected outcome are concrete: travel can be delegated while a rent payment and cash reserve stay protected.

All financial data, inventory and payments are simulated. No bank account, real merchant booking or real-money payment is connected. Real-world user benefit has not been measured; the current evidence concerns demonstrated technical behavior.

## Required tool feedback

Include the concrete observations in `SPONSOR_FEEDBACK.md`. Review and add your own onboarding experience before submission; do not present AI-written observations as personal experiences you did not have.

## Human work still required

1. Publish the source ZIP to a **public GitHub, GitLab or Bitbucket repository**, with the MIT license visible. Public source: https://github.com/Epple3k/covenant.
2. Provide judge access to the demo/test build. Deploy the standalone Worker through DEPLOYMENT.md, then supply its verified app URL and arrange judge access before submitting. Do not provide your provider API key as a login credential.
3. Record and upload a **public YouTube video under three minutes**, following `PITCH.md`. Name NVIDIA Nemotron and Nebius Token Factory out loud. Show real working modules, not mock animation.
4. Review your description, factual tool feedback, authorship/AI-assistance disclosure, eligibility and final Devpost form. Do not claim user research, real payments or integrations that have not occurred.

Official sources checked October 4, 2026:
- https://nebiusglobalaihackathon.devpost.com/
- https://nebiusglobalaihackathon.devpost.com/rules
- https://nebiusglobalaihackathon.devpost.com/updates/46204-here-s-how-judging-works
- https://nebiusglobalaihackathon.devpost.com/updates/46205-how-to-build-a-winning-project

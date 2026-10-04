# Security model and research limits

This is a private research prototype with simulated identity, cash and payments. It is not production-ready financial infrastructure.

| Threat | Implemented control | Remaining boundary |
| --- | --- | --- |
| Prompt injection | Narrow allowlisted tools; strict Zod arguments; no model access to raw balances or credentials | Language interpretation can still be wrong; user must inspect and ratify the draft |
| Confused deputy | Server establishes agent and policy IDs; model selects fixture IDs; credential binds full intent | Identity is a private-site sandbox cookie, not independently attested agent identity |
| Silent policy changes | Draft ID confirmation, no policy-writing model tool, confirmed-policy enforcement | No external signature or multi-party approval |
| Split payment bypass | Active commitments reduce cash; receipts and reservations count against aggregate cap | Exposure is session-wide; not a production account-wide multi-session ledger |
| Replay | Single-use status and atomic revision commit | Real rail integration would need end-to-end idempotency and settlement reconciliation |
| Changed transaction | Canonical SHA-256 hash of full intent, exact-match validation | Travel merchant and cart are fixture data, not independently verified merchant quotes |
| Expired authority | Five-minute credential expiry, 24-hour policy expiry, expiry checked on request and execution | No bank-issued virtual credential or external expiry enforcement |
| Revocation | Policy, agent and individual-authorization revocation checked before execution | Pending external settlement is absent; no real rail is involved |
| Concurrent spend | D1 conditional revision update rejects stale state; debit and token consumption commit together | External payment effects would require a transactional outbox |
| Request velocity | Three purchase requests per ten minutes per session; sixteen agent turns per run | Reset creates a new sandbox ledger; production must retain account-wide abuse controls |
| Data minimization | Bounded/exact/binary disclosures; account state excluded from tool context; credentials not returned to client | Repeated probing can infer approximate safe authority; velocity is a basic bound, not a privacy proof |
| Forecast uncertainty | Three explicit scenarios, uncertain income excluded conservatively, delayed income, pending/recurring obligations | Not calibrated stress testing; undeclared expenses or longer delays can invalidate forecasts |
| Audit tampering | Hash chain verified server-side; receipt contains execution anchor | An administrator can rewrite the entire chain; no independent external anchoring |
| Secret exposure | Nebius key only in server environment; no committed secrets, credential logs or browser key | Owner remains responsible for key rotation and provider budget |
| Cross-site writes | SameSite HttpOnly cookie, origin equality check, private hosting | Mock identity is not a substitute for production user authentication and authorization |

Amounts are bounded integer cents. Cart sums must match the request; negative, fractional, zero, unsupported-currency and malformed purchase amounts are rejected. Only allowed travel categories exist in the schema. Multiple accounts remain separate unless explicitly chosen as the funding account; credit availability cannot rescue a no-debt liquidity failure.

Uncertain expenses are included at full face value in every scenario. Confidence is a basis-point fixture value, not a statistically validated probability. Expected future income cannot erase an earlier cash trough. Execution rechecks current projected liquidity so an approved credential cannot survive deterioration of available funds.

A model outage produces a visible error and cannot cause silent fixture substitution or a fabricated live purchase. The last saved state survives and can be resumed. Model calls may incur provider charges even if an optimistic state commit is later rejected; this is a research limitation, not duplicate financial spending.

Before real-money use: introduce authenticated user/agent identities, signed policy ratification, account-wide ACID reservations, durable idempotency/outbox settlement, independent merchant verification, bank data freshness guarantees, externally anchored audit, stronger privacy controls, rate limits, calibrated scenario stress tests, monitoring and security review.

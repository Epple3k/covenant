# Nebius / NVIDIA feedback grounded in build observations

This describes observed engineering behavior from the COVENANT build. It does not invent the entrant's personal onboarding experience. Add your own account-setup/credit experience before submitting.

## Nebius Token Factory

**Used for:** authenticated model discovery, policy JSON generation and multi-step Nemotron function calling.

**What worked:** the `/v1/models` endpoint returned the chosen Nano model for this account. The OpenAI-compatible completion interface supported both the policy draft and tool-call loop without a separate GPU deployment. The original live acceptance run completed six tool-selection turns and the final executed receipt. Responses supplied model identifiers and prompt/completion token usage suitable for audit evidence.

**What needs work / actionable feedback:** a task-level trace joining model latency, tokens, tool errors and outcomes would help builders evaluate complete agents, rather than individual completions. COVENANT now measures request round-trip latency itself and links model-turn metadata to tool results. Reasoning-generation length varied considerably in the first run: one replan response used 2,250 completion tokens while another tool-selection turn used 95. Clear per-model recipes for controlling reasoning budgets while preserving function-calling reliability would help time-bounded demos. Those counts come from one observed run, not a statistical distribution or a performance comparison.

**Onboarding observation:** model-catalog access and the completion API were verified programmatically. Account creation, credit redemption and UI onboarding were not measured in this build; supply your own experience instead of fabricating it.

**Would we build with it again:** yes for this prototype's open-model inference: it let us focus on authority and tools instead of model-serving setup. Production adoption would require evaluating latency tails, rate limits, regional requirements and provider costs against our own workload.

## NVIDIA Nemotron 3 Nano

**Used for:** translating a spending instruction to validated JSON, selecting travel/search/authorization/execution tools, and adapting to machine-readable financial denials.

**What worked:** in the original live run, Nano selected the $380 option, respected the forward-liquidity denial, requested the $185 alternative, executed its authorization, and finished. Tool choices were genuine model outputs; finance decisions remained deterministic. It did not need access to checking balances or bill details to respond to bounded authority.

**What needs work / actionable feedback:** compact tool-call recipes that preserve reliable JSON and avoid verbose reasoning would help small autonomous workflows. A denial schema containing reason, retry permission and a bounded safe ceiling proved useful. Model outputs still require strict validation, user policy ratification, tool allowlisting and fail-closed execution; model fluency is not a financial safety guarantee.

## Services not used

Nebius AI Cloud, Nebius Serverless, Tavily and other NVIDIA agent runtimes were not used. We make no first-hand claims about them. The runtime required for inference is Token Factory; web hosting is separate.

## Measured enhanced run

The live changing-obligation challenge completed 10 model calls including policy compilation, used 23429 total prompt/completion tokens, and accumulated 79.0 seconds of observed request latency. These are one-run measurements, not latency guarantees or cost estimates. The actual model selected tools after the authorization became stale and booked the $95 alternative. Per-turn data is recorded in `docs/live-challenge-run.json`.

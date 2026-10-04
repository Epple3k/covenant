# Three-minute COVENANT demonstration

## Preparation

Open the app on desktop, use Reset demo, and leave the starting fixture at $2,900 checking / $1,200 rent / $900 uncertain paycheck. Select Live Nemotron. Verify the header says NEMOTRON CONNECTED. That label means a secret is configured; a successful model turn confirms inference.

Allow time for model inference. The provider's reasoning latency can push the total beyond three minutes. For a strict presentation slot, compile and confirm the policy immediately before presenting, then show the autonomous session live. Fixture mode is useful for rehearsal or an outage, and must be identified honestly.

## Exact click sequence

1. With the default instruction in Define authority, select **Live Nemotron** and click **Compile policy**. The draft should show a $400 trip cap, $1,500 future reserve, prohibited debt, travel categories, and bounded disclosure. Inspect the JSON if desired.
2. Click **Confirm this policy**. Explain that the model cannot silently create financial authority.
3. Click **Start travel agent**. Stay on **Agent session**. The backend calls the actual model once per turn; browser updates show persisted tool results and inference token usage, not private chain-of-thought.
4. Watch the first $380 request get denied. The chart drops to $1,320 at rent, beneath the $1,500 floor. The agent receives only a code and safe spending band.
5. Watch Nemotron choose the $185 alternative, request authority, execute the exact scoped credential, and finish. No manual replan click is needed.
6. Click the rejected decision or open **Decision inspector**, selecting the $380 denial. Show that the $400 budget passes but future liquidity fails by $180.
7. Select the $185 approval. The conservative minimum is $1,515. Switch to **Receipt ledger** to show the itemized receipt, policy checks, intent hash, and verified audit chain. Download the receipt JSON if needed.
8. Optionally open **Control tests** and click **Split purchase**, **Alter merchant**, **Replay credential**, or **Expired credential**. These run isolated clones and cannot spend your displayed cash.

## Suggested narration

0:00–0:25: “Agent payment permission is not a complete financial policy. A purchase can be authorized and still leave too little cash for upcoming obligations.”

0:25–0:50: “I state my intent. Nemotron drafts explicit rules, and I approve them. The model proposes; deterministic code controls the money.”

0:50–1:45: “The agent chooses a $380 itinerary. It is below the $400 cap, but after rent my balance would fall to $1,320. COVENANT denies it. The agent receives a bounded safe budget and chooses $185 instead.”

1:45–2:30: “That itinerary leaves $1,515. The engine issues a single-use authorization for the exact merchant, amount, cart, purpose, currency, policy, and agent. The sandbox validates it before execution.”

2:30–3:00: “This receipt records the transaction and its forward impact. Split purchases cannot reuse reserved liquidity. An altered, expired, revoked, or consumed credential fails. COVENANT gives agents financial authority that respects the future.”

## Recovery

- Provider failure: read the error. Click **Resume agent** in Agent session to continue from persisted state; never claim live success for fixture mode.
- Agent revoked or policy revoked: reset and recompile. Revocation is intentionally irreversible within the session.
- Too many requests: reset the sandbox or wait for the ten-minute velocity window. Real systems would retain account-wide velocity across sessions.
- After a successful booking, **Reset demo** restores the original scenario.
- If a resumed model step has reached its 16-turn cap, reset. The app does not run unbounded inference.

## Stronger live challenge

After policy confirmation, enable **Pause after authorization to change an obligation**, then start the agent. It pauses after the $185 approval. Enter **100** for a new day-seven bill and click **Apply bill and resume agent**. The model attempts execution, receives a fresh privacy-bounded denial, and must choose the $95 day trip or stop. The final conservative minimum is $1,505. Use **150** for an infeasible scenario.

Open **Evidence bench** and click **Run 8-case comparison**. It runs isolated fixtures and leaves the live balance untouched. View actual inference calls, tokens and request latency in Agent session. For the under-three-minute submission, follow `PITCH.md` rather than narrating every click.

import assert from 'node:assert/strict';

// Public production acceptance. No real bank credentials or payments are used.
// Only the short-lived fictional fixture session created by this script is changed.
const instruction = "Get me to the conference. You can spend up to $400, but keep at least $1,500 available after my upcoming obligations and don't put anything on credit.";
const primary = (process.env.COVENANT_SITE_ORIGIN || 'https://covenant.emitrice.com').replace(/\/$/, '');
const fallback = (process.env.COVENANT_DEPLOYED_URL || 'https://covenant.emitrice-09b.workers.dev').replace(/\/$/, '');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const errors = [];

async function readJson(res) {
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { throw Error('Expected JSON, received HTTP ' + res.status + ' content=' + text.slice(0, 120)); }
  if (!res.ok) throw Error('HTTP ' + res.status + ': ' + JSON.stringify(data).slice(0, 300));
  return data;
}

async function reachable(origin) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      const res = await fetch(origin + '/api/covenant', { signal: AbortSignal.timeout(20000), headers: { 'Cache-Control': 'no-cache' } });
      const state = await readJson(res);
      assert.equal(state.chain_valid, true, 'Audit chain invalid on initial state');
      assert.ok(state.state && state.provider, 'Missing state or provider metadata');
      return true;
    } catch (e) {
      if (attempt === 4) errors.push(origin + ': ' + String(e));
      else await sleep(3000);
    }
  }
  return false;
}

let origin = primary;
const primaryWorks = await reachable(primary);
if (!primaryWorks) {
  if (fallback === primary || !(await reachable(fallback))) throw Error('Neither configured production hostname nor Workers URL is reachable. ' + errors.join(' | '));
  origin = fallback;
  console.error('WARNING: Custom domain is unavailable. Running fallback Worker acceptance, but this deployment must be treated as incomplete.');
}
let cookie = '';
async function command(body) {
  const res = await fetch(origin + '/api/covenant', {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(body?.action === 'draft' || body?.action === 'step' ? 115000 : 25000),
  });
  cookie = res.headers.get('set-cookie')?.split(';')[0] ?? cookie;
  return readJson(res);
}

const page = await fetch(origin, { signal: AbortSignal.timeout(20000) });
assert.equal(page.status, 200, 'App homepage must respond HTTP 200');
assert.ok((await page.text()).includes('COVENANT'), 'App homepage is missing');

let data = await command();
assert.equal(data.chain_valid, true);
assert.equal(data.provider?.configured, true, 'NEBIUS_API_KEY missing from the deployed Worker');
assert.ok(String(data.provider?.model).includes('Nemotron'), 'Unexpected model binding');
console.log('PASS: Page, D1-backed session, audit integrity, and deployed Nemotron secret binding.');

data = await command({ action: 'setup', scenario: 'checking_card' });
data = await command({ action: 'draft', text: instruction, mode: 'fixture' });
data = await command({ action: 'confirm', draft_id: data.state.draft.id });
assert.equal(data.safe_authority, 20000);
data = await command({ action: 'start', mode: 'fixture', pause_before_payment: false });
for (let i = 0; i < 17 && data.state.agent.status === 'running'; i++) data = await command({ action: 'step' });
assert.equal(data.state.agent.status, 'complete', 'Fixture agent did not finish');
assert.equal(data.state.decisions[0]?.decision, 'DENIED', 'Unsafe purchase was not rejected');
assert.equal(data.state.receipts[0]?.amount, 18500, 'Safe sandbox itinerary not executed');
assert.equal(data.chain_valid, true, 'Audit verification failed');
data = await command({ action: 'evaluate' });
assert.equal(data.state.evaluation?.summary?.passed, 8, 'Financial regression scenarios failed');
console.log('PASS: Production D1 writes, policy, denied unsafe purchase, sandbox execution, audit, and eight regressions.');

data = await command({ action: 'reset' });
data = await command({ action: 'setup', scenario: 'checking_card' });
data = await command({ action: 'draft', text: instruction, mode: 'live' });
assert.equal(data.state.draft?.max_total_spend, 40000);
assert.equal(data.state.draft?.min_liquidity, 150000);
data = await command({ action: 'confirm', draft_id: data.state.draft.id });
data = await command({ action: 'start', mode: 'live', pause_before_payment: false });
data = await command({ action: 'step' });
assert.ok(data.state.audit.some(event => event.type === 'MODEL_TURN'), 'No successful live Nemotron tool-selection call');
assert.equal(data.chain_valid, true);
console.log('PASS: Real Nemotron policy drafting and tool-selection request in the deployed Worker (no real payment).');

if (!primaryWorks) throw Error('Worker passed acceptance through fallback, but required custom domain is not reachable.');
console.log('PRODUCTION VERIFIED: ' + origin + ' (fixture end-to-end; live Nemotron policy + tool step).');

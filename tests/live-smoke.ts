import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync} from 'node:fs';
import {injectObligation} from '../lib/covenant/evaluation.ts';
import { seed, audit,verifyAudit } from '../lib/covenant/engine.ts';
import { draftPolicy,startAgent,stepAgent,defaultInstruction } from '../lib/covenant/agent.ts';
const config={NEBIUS_API_KEY:process.env.NEBIUS_API_KEY,NEBIUS_MODEL:process.env.NEBIUS_MODEL,NEBIUS_BASE_URL:process.env.NEBIUS_BASE_URL};
if(!config.NEBIUS_API_KEY)throw Error('Supply NEBIUS_API_KEY through the environment.');
const s=seed();
await draftPolicy(s,defaultInstruction,'live',config);
assert.equal(s.draft!.max_total_spend,40000);assert.equal(s.draft!.min_liquidity,150000);assert.equal(s.draft!.allow_new_debt,false);
s.policy={...s.draft!,confirmed:true};s.draft=null;await audit(s,'POLICY_CONFIRMED',{policy:s.policy});
console.log(JSON.stringify({stage:'policy',cap:s.policy.max_total_spend,floor:s.policy.min_liquidity}));
const challenge=process.env.LIVE_CHALLENGE==='1';
await startAgent(s,'live',challenge);
for(let i=0;i<16&&String(s.agent.status)==='running';i++){await stepAgent(s,config);const turn=s.audit.filter(a=>a.type==='MODEL_TURN').at(-1);console.log(JSON.stringify({step:i+1,turn:turn?.data,status:s.agent.status,decisions:s.decisions.map(d=>({decision:d.decision,amount:d.intent.amount,code:d.code}))}));}
if(challenge){assert.equal(s.agent.status,'paused');assert.equal(s.receipts.length,0);await injectObligation(s,10000);await audit(s,'OBLIGATION_SHOCK_APPLIED',{amount:10000});console.log(JSON.stringify({stage:'shock',amount:10000}));for(let i=0;i<16&&String(s.agent.status)==='running';i++){await stepAgent(s,config);const turn=s.audit.filter(a=>a.type==='MODEL_TURN').at(-1);console.log(JSON.stringify({phase:'after-shock',step:i+1,turn:turn?.data,status:s.agent.status,receipt_amount:s.receipts[0]?.amount}));}}
assert.equal(s.agent.status,'complete');assert.equal(s.receipts[0]?.amount,challenge?9500:18500);assert.equal(s.decisions[0]?.intent.amount,38000);assert.equal(s.decisions[0]?.decision,'DENIED');assert.equal(await verifyAudit(s.audit),true);
console.log(JSON.stringify({passed:true,receipt:s.receipts[0].id,minimum:s.receipts[0].forecasts[1].minimum,model_turns:s.audit.filter(a=>a.type==='MODEL_TURN').length}));

const turns=s.audit.filter(a=>['MODEL_TURN','MODEL_POLICY_DRAFTED'].includes(a.type)).map(a=>({kind:a.type,...a.data as any}));const evidence={recorded_at:new Date().toISOString(),scenario:challenge?'new-obligation-before-payment':'original-demo',single_run:true,scope:'Actual live model and pure engine; not hosted browser QA.',model:turns[0]?.model,model_calls:turns.length,total_tokens:turns.reduce((t,r)=>t+(r.usage?.total_tokens??0),0),total_model_latency_ms:turns.reduce((t,r)=>t+(r.latency_ms??0),0),turns,decisions:s.decisions.map(d=>({amount:d.intent.amount,decision:d.decision,code:d.code})),invalidated_authorizations:s.authorizations.filter(a=>a.status==='revoked').length,executed_amount:s.receipts[0].amount,conservative_minimum:s.receipts[0].forecasts[1].minimum,audit_verified:await verifyAudit(s.audit)};mkdirSync('.sites-runtime',{recursive:true});writeFileSync('.sites-runtime/live-evidence.json',JSON.stringify(evidence,null,2));

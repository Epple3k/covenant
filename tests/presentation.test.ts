import {test} from 'node:test';
import assert from 'node:assert/strict';
import {seed,requestAuthorization,travelIntent,execute,revoke,verifyAudit} from '../lib/covenant/engine.ts';
import {draftPolicy,defaultInstruction} from '../lib/covenant/agent.ts';
import {purchaseEvidence} from '../lib/covenant/presentation.ts';
async function approved(){const s=seed();await draftPolicy(s,defaultInstruction,'fixture',{});s.policy={...s.draft!,confirmed:true};s.draft=null;await requestAuthorization(s,travelIntent(s,'safe'));return s;}
test('withdrawn approval shows new forecast and preserves the original approval evidence',async()=>{
 const s=await approved();const d=s.decisions[0],a=s.authorizations[0];
 assert.equal(purchaseEvidence(s,d).status,'reserved');
 s.events.push({name:'New bill',amount:-10000,day:7,account_id:'checking',confidence_bps:10000});
 await assert.rejects(execute(s,a.token,a.intent),/STATE_CHANGED/);
 const e=purchaseEvidence(s,d);assert.equal(e.status,'withdrawn');assert.equal(e.minimum,141500);assert.equal(e.approvalMinimum,151500);
 assert.equal(s.receipts.length,0);assert.equal(await verifyAudit(s.audit),true);
});
test('expired and revoked approval never appears as usable permission',async()=>{
 const s=await approved();assert.equal(purchaseEvidence(s,s.decisions[0],s.authorizations[0].expires_at).status,'expired');
 await revoke(s,'agent');assert.equal(purchaseEvidence(s,s.decisions[0]).status,'revoked');
});
test('paid evidence uses fresh execution forecast and remains a historical payment after revocation',async()=>{
 const s=await approved(),a=s.authorizations[0];
 s.events.push({name:'New bill',amount:-500,day:7,account_id:'checking',confidence_bps:10000});
 await execute(s,a.token,a.intent);await revoke(s,'policy');
 const e=purchaseEvidence(s,s.decisions[0]);assert.equal(e.status,'paid');assert.equal(e.minimum,151000);assert.equal(e.approvalMinimum,151500);
});

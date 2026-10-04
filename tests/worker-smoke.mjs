import assert from 'node:assert/strict';
import { defaultInstruction } from '../lib/covenant/constants.ts';
const origin=process.argv[2]??'http://127.0.0.1:4191';
let cookie='';
async function command(body){
  const response=await fetch(origin+'/api/covenant',{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});
  cookie=response.headers.get('set-cookie')?.split(';')[0]??cookie;
  const data=await response.json();assert.equal(response.status,200,JSON.stringify(data));return data;
}
const page=await fetch(origin);assert.equal(page.status,200);assert.ok((await page.text()).includes('COVENANT'));
await command();
let data=await command({action:'setup',scenario:'checking_card'});assert.equal(data.state.accounts[0].balance,350000);
data=await command({action:'draft',text:defaultInstruction,mode:'fixture'});
data=await command({action:'confirm',draft_id:data.state.draft.id});assert.equal(data.safe_authority,20000);
data=await command({action:'start',mode:'fixture',pause_before_payment:true});
for(let i=0;i<17&&data.state.agent.status==='running';i++)data=await command({action:'step'});
assert.equal(data.state.agent.status,'paused');
data=await command({action:'shock',amount:10000});
for(let i=0;i<17&&data.state.agent.status==='running';i++)data=await command({action:'step'});
assert.equal(data.state.receipts[0].amount,9500);assert.equal(data.state.receipts[0].forecasts[1].minimum,150500);assert.equal(data.chain_valid,true);
data=await command({action:'evaluate'});assert.equal(data.state.evaluation.summary.passed,8);
data=await command({action:'reset'});assert.equal(data.state.onboarding.scenario,'checking_card');assert.equal(data.state.accounts[0].balance,350000);
console.log('Worker acceptance passed: HTML, D1, session cookie, setup, policy confirmation, changed-bill replan, receipt, audit, evaluation, reset.');

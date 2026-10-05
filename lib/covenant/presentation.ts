import type { Decision, Forecast, Session } from './engine.ts';

export const minimumCash=(forecasts:Forecast[])=>Math.min(...forecasts.filter(f=>f.scenario!=='expected').map(f=>f.minimum));
export function purchaseEvidence(s:Session,d:Decision,now=Date.now()){
  const permission=s.authorizations.find(a=>a.id===d.authorization_id);
  const invalidation=s.audit.find(a=>a.type==='AUTHORIZATION_INVALIDATED'&&(a.data as {authorization_id?:string}).authorization_id===d.authorization_id);
  const invalidatedData=invalidation?.data as {forecasts?:Forecast[]}|undefined;
  const receipt=s.receipts.find(r=>r.authorization.id===d.authorization_id);
  const policyValid=!!s.policy?.confirmed&&!s.policy.revoked&&s.policy.expires_at>now&&!s.agent.revoked;
  const status=d.decision==='DENIED'?'blocked':receipt?'paid':invalidation?'withdrawn':!policyValid||permission?.status==='revoked'?'revoked':permission&&permission.expires_at<=now?'expired':permission?.status==='active'?'reserved':'unavailable';
  return {status,permission,receipt,minimum:minimumCash(receipt?.forecasts??invalidatedData?.forecasts??d.forecasts),approvalMinimum:minimumCash(d.forecasts),capPassed:d.intent.amount<=(s.policy?.max_total_spend??0),invalidated:!!invalidation};
}

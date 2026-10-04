import { audit,seed,type Session } from './engine.ts';

export type DemoScenario='checking_card'|'checking_only';
export function scenarioSeed(scenario:DemoScenario):Session {
  const state=seed();
  if(scenario==='checking_card'){
    state.accounts[0].balance=350000;
    state.accounts.push({id:'credit_card',name:'Credit card / DEMO-002',balance:0,currency:'USD',debt:60000,credit_available:0});
    // One future checking outflow for the existing statement. Card debt is a
    // liability snapshot, not another cash outflow or spendable balance.
    state.events.push({name:'Credit card statement payment',account_id:'checking',amount:-60000,day:9,confidence_bps:10000});
  }
  return state;
}
export async function completeSetup(state:Session,scenario:DemoScenario,now=Date.now()) {
  if(state.policy||state.draft||state.authorizations.length||state.decisions.length||state.agent.steps)
    throw Error('Reset the demo before changing accounts. Your existing rules and activity are preserved.');
  const fixture=scenarioSeed(scenario);
  state.accounts=fixture.accounts;
  state.events=fixture.events;
  state.onboarding={completed_at:now,scenario};
  await audit(state,'DEMO_SETUP_COMPLETED',{scenario,source:'fictional accounts; no bank connection'},now);
}
export function resetDemo(state:Session):Session {
  const next=scenarioSeed(state.onboarding?.scenario??'checking_only');
  next.onboarding=state.onboarding;
  return next;
}

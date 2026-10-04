import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadSession,saveSession } from '../lib/covenant/storage.ts';
class MemoryD1 {
 rows=new Map<string,{revision:number;body:string}>();
 prepare(sql:string){const db=this;return{bind(...v:any[]){return{async first(){return db.rows.get(v[0])??null;},async run(){if(sql.startsWith('INSERT')){if(!db.rows.has(v[0]))db.rows.set(v[0],{revision:0,body:v[1]});return{meta:{changes:1}};}if(sql.startsWith('UPDATE')){const row=db.rows.get(v[2]);if(row&&row.revision===v[3]){db.rows.set(v[2],{revision:row.revision+1,body:v[0]});return{meta:{changes:1}};}return{meta:{changes:0}};}throw Error('Unexpected query');}};}};}
}
test('optimistic concurrency permits only one commit against a revision',async()=>{const db=new MemoryD1();const d=db as unknown as D1Database;const a=await loadSession(d,'session');const b=await loadSession(d,'session');a.state.accounts[0].balance-=5000;b.state.accounts[0].balance-=6000;const results=await Promise.allSettled([saveSession(d,'session',a.revision,a.state),saveSession(d,'session',b.revision,b.state)]);assert.equal(results.filter(r=>r.status==='fulfilled').length,1);assert.equal(results.filter(r=>r.status==='rejected').length,1);assert.equal((await loadSession(d,'session')).state.accounts[0].balance,285000);});
test('session IDs isolate persisted finances',async()=>{const db=new MemoryD1() as unknown as D1Database;const a=await loadSession(db,'one');a.state.accounts[0].balance=123;await saveSession(db,'one',a.revision,a.state);assert.equal((await loadSession(db,'one')).state.accounts[0].balance,123);assert.equal((await loadSession(db,'two')).state.accounts[0].balance,290000);});

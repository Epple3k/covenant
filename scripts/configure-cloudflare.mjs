import { readFileSync,writeFileSync } from 'node:fs';
const databaseId=process.argv[2]??process.env.COVENANT_D1_DATABASE_ID;
if(!databaseId||!/^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/.test(databaseId)||databaseId==='00000000-0000-4000-8000-000000000000'){
  throw Error('Supply the real database_id returned by wrangler d1 create covenant-db.');
}
const config=JSON.parse(readFileSync(new URL('../wrangler.jsonc',import.meta.url),'utf8'));
config.d1_databases[0].database_id=databaseId;
writeFileSync(new URL('../wrangler.jsonc',import.meta.url),JSON.stringify(config,null,2)+'\n');
console.log('Configured covenant-db. No credentials were written.');

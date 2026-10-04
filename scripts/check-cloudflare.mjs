import { readFileSync } from 'node:fs';
const config=JSON.parse(readFileSync(new URL('../wrangler.jsonc',import.meta.url),'utf8'));
if(config.d1_databases[0].database_id==='00000000-0000-4000-8000-000000000000'){
  throw Error('Configure the real D1 database ID before remote deployment. See DEPLOYMENT.md.');
}

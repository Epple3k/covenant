import { readFileSync } from 'node:fs';
const config=JSON.parse(readFileSync(new URL('../wrangler.jsonc',import.meta.url),'utf8'));
const id=config.d1_databases.find(db=>db.binding==='DB')?.database_id;
if(!id||id==='00000000-0000-4000-8000-000000000000'){
  throw Error('Run pnpm run build and pnpm run deploy first, or configure a real D1 database ID. See DEPLOYMENT.md.');
}

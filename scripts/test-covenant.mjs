import { spawnSync } from 'node:child_process';
const r=spawnSync(process.execPath,['--experimental-strip-types','--test','tests/engine.test.ts','tests/storage.test.ts'],{stdio:'inherit'});process.exit(r.status??1);

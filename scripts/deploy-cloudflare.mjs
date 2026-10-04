import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const placeholder = '00000000-0000-4000-8000-000000000000';
const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

export function prepareDatabase({ root = process.cwd(), run }) {
  const sourcePath = resolve(root, 'wrangler.jsonc');
  const builtPath = resolve(root, 'dist/server/wrangler.json');
  const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
  const built = JSON.parse(readFileSync(builtPath, 'utf8'));
  const binding = source.d1_databases?.find((db) => db.binding === 'DB');
  const builtBinding = built.d1_databases?.find((db) => db.binding === 'DB');
  if (!binding || !builtBinding) throw Error('The DB binding is missing. Run the production build first.');

  let id = binding.database_id;
  if (!id || id === placeholder) {
    const name = binding.database_name;
    if (!name) throw Error('The DB binding needs a database_name.');
    const list = () => {
      const databases = JSON.parse(run(['d1', 'list', '--json', '--config', sourcePath], true));
      if (!Array.isArray(databases)) throw Error('Unexpected D1 database list response.');
      return databases.find((db) => db.name === name);
    };
    let database = list();
    if (!database) {
      run(['d1', 'create', name, '--config', sourcePath, '--no-update-config']);
      database = list();
    }
    id = database?.uuid;
  }
  if (!uuid.test(id ?? '') || id === placeholder) throw Error('Could not resolve a real D1 database ID.');

  // Vite generates a separate deploy configuration. Both must refer to the same database.
  binding.database_id = id;
  builtBinding.database_id = id;
  for (const [path, config] of [[sourcePath, source], [builtPath, built]]) {
    writeFileSync(path, JSON.stringify(config, null, 2) + '\n');
  }
  console.log('D1 is configured; applying migrations before deployment.');
}

export function deploy({ root = process.cwd(), run }) {
  prepareDatabase({ root, run });
  run(['d1', 'migrations', 'apply', 'DB', '--remote', '--config', resolve(root, 'wrangler.jsonc')]);
  run(['deploy', '--config', resolve(root, 'dist/server/wrangler.json')]);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const wrangler = resolve('node_modules/wrangler/bin/wrangler.js');
  const run = (args, capture = false) => {
    const result = spawnSync(process.execPath, [wrangler, ...args], {
      stdio: capture ? ['ignore', 'pipe', 'inherit'] : 'inherit',
      encoding: 'utf8',
      env: { ...process.env, CI: 'true', WRANGLER_SEND_METRICS: 'false' },
    });
    if (result.error) throw result.error;
    if (result.status !== 0) throw Error(`Wrangler ${args.slice(0, 2).join(' ')} failed; deployment stopped.`);
    return result.stdout;
  };
  deploy({ run });
}

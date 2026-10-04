import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { deploy } from '../scripts/deploy-cloudflare.mjs';

const id = 'a1234567-1234-4321-abcd-123456789abc';
function fixture(t, databaseId) {
  const root = mkdtempSync(join(tmpdir(), 'covenant-deploy-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, 'dist/server'), { recursive: true });
  const config = { name: 'covenant', d1_databases: [{ binding: 'DB', database_name: 'covenant-db', database_id: databaseId, migrations_dir: 'drizzle' }] };
  for (const path of ['wrangler.jsonc', 'dist/server/wrangler.json']) writeFileSync(join(root, path), JSON.stringify(config));
  return root;
}
function assertConfigured(root) {
  for (const path of ['wrangler.jsonc', 'dist/server/wrangler.json']) {
    const db = JSON.parse(readFileSync(join(root, path), 'utf8')).d1_databases[0];
    assert.equal(db.database_id, id);
    assert.equal(db.migrations_dir, 'drizzle');
  }
}

test('reuses a named database and configures both files before migrations/upload', (t) => {
  const root = fixture(t, '00000000-0000-4000-8000-000000000000');
  const calls = [];
  deploy({ root, run(args) {
    calls.push(args.slice(0, 3));
    if (args[1] === 'list') return JSON.stringify([{ name: 'unrelated', uuid: 'wrong' }, { name: 'covenant-db', uuid: id }]);
    assertConfigured(root);
  } });
  assert.deepEqual(calls, [['d1', 'list', '--json'], ['d1', 'migrations', 'apply'], ['deploy', '--config', join(root, 'dist/server/wrangler.json')]]);
});
test('creates a missing database once then resolves the returned ID', (t) => {
  const root = fixture(t);
  let created = false;
  deploy({ root, run(args) {
    if (args[1] === 'list') return JSON.stringify(created ? [{ name: 'covenant-db', uuid: id }] : []);
    if (args[1] === 'create') {
      assert.equal(created, false);
      assert.equal(args[2], 'covenant-db');
      assert.ok(args.includes('--no-update-config'));
      created = true;
      return;
    }
    assertConfigured(root);
  } });
  assert.equal(created, true);
});
test('preserves an explicitly configured ID without listing or creating resources', (t) => {
  const root = fixture(t, id);
  deploy({ root, run(args) {
    assert.ok(args[0] === 'deploy' || args[1] === 'migrations');
    assertConfigured(root);
  } });
});
test('failed resource lookup stops before migrations and deployment', (t) => {
  const root = fixture(t);
  assert.throws(() => deploy({ root, run(args) {
    assert.equal(args[1], 'list');
    throw Error('D1 permission denied');
  } }), /permission denied/);
});
test('invalid database IDs stop deployment', (t) => {
  const root = fixture(t, 'not-a-uuid');
  assert.throws(() => deploy({ root, run() { assert.fail('Must not call Wrangler'); } }), /real D1 database ID/);
});
test('failed migration prevents Worker upload', (t) => {
  const root = fixture(t, id);
  assert.throws(() => deploy({ root, run(args) {
    assert.equal(args[1], 'migrations');
    throw Error('Migration failed');
  } }), /Migration failed/);
});
